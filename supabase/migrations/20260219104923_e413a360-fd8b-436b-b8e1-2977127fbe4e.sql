
-- ============================================================
-- MESSAGERIE AFRIKOIN
-- conversations, members, messages, reads, storage bucket
-- ============================================================

-- Types énumérés
DO $$ BEGIN
  CREATE TYPE public.conversation_type AS ENUM ('private', 'group');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.message_type AS ENUM ('text', 'image', 'file', 'audio', 'video');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.member_role AS ENUM ('admin', 'member');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Table conversations
CREATE TABLE public.conversations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type          public.conversation_type NOT NULL DEFAULT 'private',
  name          text,
  description   text,
  avatar_url    text,
  created_by    uuid NOT NULL,
  last_message  text,
  last_message_at timestamp with time zone,
  created_at    timestamp with time zone NOT NULL DEFAULT now(),
  updated_at    timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Table members
CREATE TABLE public.conversation_members (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id          uuid NOT NULL,
  role             public.member_role NOT NULL DEFAULT 'member',
  joined_at        timestamp with time zone NOT NULL DEFAULT now(),
  last_read_at     timestamp with time zone,
  is_muted         boolean DEFAULT false,
  UNIQUE (conversation_id, user_id)
);

ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;

-- Table messages
CREATE TABLE public.messages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id        uuid NOT NULL,
  content          text,
  message_type     public.message_type NOT NULL DEFAULT 'text',
  file_url         text,
  file_name        text,
  file_size        bigint,
  duration_sec     integer,
  reply_to_id      uuid REFERENCES public.messages(id) ON DELETE SET NULL,
  is_deleted       boolean DEFAULT false,
  created_at       timestamp with time zone NOT NULL DEFAULT now(),
  updated_at       timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Table reads (indicateur "vu")
CREATE TABLE public.message_reads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id  uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL,
  read_at     timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id)
);

ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- conversations: visible si membre
CREATE POLICY "Members can view their conversations"
  ON public.conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = conversations.id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update their conversations"
  ON public.conversations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = conversations.id
        AND cm.user_id = auth.uid()
        AND cm.role = 'admin'
    )
  );

-- conversation_members
CREATE POLICY "Members can view members of their conversations"
  ON public.conversation_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members cm2
      WHERE cm2.conversation_id = conversation_members.conversation_id
        AND cm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Can insert own membership"
  ON public.conversation_members FOR INSERT
  WITH CHECK (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.conversation_members cm
    WHERE cm.conversation_id = conversation_members.conversation_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'admin'
  ));

CREATE POLICY "Members can update own membership"
  ON public.conversation_members FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Members can leave conversations"
  ON public.conversation_members FOR DELETE
  USING (auth.uid() = user_id);

-- messages
CREATE POLICY "Members can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = messages.conversation_id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = messages.conversation_id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Senders can update own messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id);

CREATE POLICY "Senders can delete own messages"
  ON public.messages FOR DELETE
  USING (auth.uid() = sender_id);

-- message_reads
CREATE POLICY "Users can view reads in their conversations"
  ON public.message_reads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversation_members cm ON cm.conversation_id = m.conversation_id
      WHERE m.id = message_reads.message_id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can mark messages as read"
  ON public.message_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- updated_at sur conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- updated_at sur messages
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Mise à jour last_message dans conversations après insert message
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET last_message = CASE
        WHEN NEW.message_type = 'text' THEN LEFT(NEW.content, 100)
        WHEN NEW.message_type = 'image' THEN '📷 Image'
        WHEN NEW.message_type = 'audio' THEN '🎙️ Message vocal'
        WHEN NEW.message_type = 'video' THEN '🎥 Vidéo'
        WHEN NEW.message_type = 'file'  THEN '📎 Fichier: ' || COALESCE(NEW.file_name, '')
        ELSE NEW.content
      END,
      last_message_at = NEW.created_at,
      updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_last_message_after_insert
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();

-- ============================================================
-- STORAGE BUCKET pour fichiers de messagerie
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-files', 'message-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload message files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'message-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Message files are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'message-files');

CREATE POLICY "Users can delete own message files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'message-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime on messages and conversation_members
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
