
-- Fix permissive media_files INSERT policy
DROP POLICY IF EXISTS "Users can insert media" ON public.media_files;
CREATE POLICY "Users can insert media" ON public.media_files FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.user_id = auth.uid())
);

-- Fix permissive conversation_members INSERT policy
DROP POLICY IF EXISTS "Users can join conversations" ON public.conversation_members;
CREATE POLICY "Conversation creators can add members" ON public.conversation_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.created_by = auth.uid())
  OR auth.uid() = user_id
);

-- Fix function search_path
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET last_message = NEW.content,
      last_message_at = NEW.created_at,
      updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;
