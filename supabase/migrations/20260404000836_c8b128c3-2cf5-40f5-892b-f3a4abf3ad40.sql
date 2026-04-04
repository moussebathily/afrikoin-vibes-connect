
-- Fix conversations SELECT policy: cm.conversation_id = cm.id → cm.conversation_id = conversations.id
DROP POLICY IF EXISTS "Members can view conversations" ON public.conversations;
CREATE POLICY "Members can view conversations" ON public.conversations
FOR SELECT TO public
USING (EXISTS (
  SELECT 1 FROM conversation_members cm
  WHERE cm.conversation_id = conversations.id AND cm.user_id = auth.uid()
));

-- Fix conversations UPDATE policy: same bug
DROP POLICY IF EXISTS "Members can update conversations" ON public.conversations;
CREATE POLICY "Members can update conversations" ON public.conversations
FOR UPDATE TO public
USING (EXISTS (
  SELECT 1 FROM conversation_members cm
  WHERE cm.conversation_id = conversations.id AND cm.user_id = auth.uid()
));

-- Fix messages SELECT policy: cm.conversation_id = cm.conversation_id (tautology) → cm.conversation_id = messages.conversation_id
DROP POLICY IF EXISTS "Members can view messages" ON public.messages;
CREATE POLICY "Members can view messages" ON public.messages
FOR SELECT TO public
USING (EXISTS (
  SELECT 1 FROM conversation_members cm
  WHERE cm.conversation_id = messages.conversation_id AND cm.user_id = auth.uid()
));

-- Fix messages INSERT policy: same tautology bug
DROP POLICY IF EXISTS "Members can send messages" ON public.messages;
CREATE POLICY "Members can send messages" ON public.messages
FOR INSERT TO public
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM conversation_members cm
    WHERE cm.conversation_id = messages.conversation_id AND cm.user_id = auth.uid()
  )
);

-- Fix conversation_members SELECT policy: cm.conversation_id = cm.conversation_id (tautology)
DROP POLICY IF EXISTS "Members can view members" ON public.conversation_members;
CREATE POLICY "Members can view members" ON public.conversation_members
FOR SELECT TO public
USING (EXISTS (
  SELECT 1 FROM conversation_members cm2
  WHERE cm2.conversation_id = conversation_members.conversation_id AND cm2.user_id = auth.uid()
));

-- Fix resumes storage: add ownership check
DROP POLICY IF EXISTS "Users read own resumes" ON storage.objects;
CREATE POLICY "Users read own resumes" ON storage.objects
FOR SELECT TO public
USING (
  bucket_id = 'resumes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
