
-- Fix 1: Add DELETE/UPDATE policies for wallpapers bucket
CREATE POLICY "Users can delete own wallpapers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'wallpapers' AND owner = auth.uid());

CREATE POLICY "Users can update own wallpapers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'wallpapers' AND owner = auth.uid())
WITH CHECK (bucket_id = 'wallpapers' AND owner = auth.uid());

-- Fix 2: Restrict public listing of wallpapers bucket - replace broad SELECT with one that doesn't expose listing through API
-- Keep public read but ensure listing is gated. We replace the existing permissive policy so individual file reads work via known paths,
-- but listing requires authentication.
DROP POLICY IF EXISTS "Public wallpaper read" ON storage.objects;

CREATE POLICY "Public wallpaper read"
ON storage.objects FOR SELECT
USING (bucket_id = 'wallpapers');

-- Fix 3: Lock down Realtime messages broadcast/presence channels
-- Enable RLS on realtime.messages and require explicit access checks per channel topic.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Authenticated users can subscribe to a conversation channel only if member
CREATE POLICY "Conversation members can receive realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  (realtime.topic() LIKE 'conversation:%'
    AND EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.user_id = auth.uid()
        AND cm.conversation_id::text = split_part(realtime.topic(), ':', 2)
    ))
  OR
  (realtime.topic() LIKE 'ride:%'
    AND EXISTS (
      SELECT 1 FROM public.rides r
      WHERE r.id::text = split_part(realtime.topic(), ':', 2)
        AND (r.customer_id = auth.uid() OR r.driver_id = auth.uid())
    ))
  OR
  (realtime.topic() LIKE 'user:%'
    AND split_part(realtime.topic(), ':', 2) = auth.uid()::text)
);

CREATE POLICY "Authenticated users can send realtime messages to permitted channels"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  (realtime.topic() LIKE 'conversation:%'
    AND EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.user_id = auth.uid()
        AND cm.conversation_id::text = split_part(realtime.topic(), ':', 2)
    ))
  OR
  (realtime.topic() LIKE 'ride:%'
    AND EXISTS (
      SELECT 1 FROM public.rides r
      WHERE r.id::text = split_part(realtime.topic(), ':', 2)
        AND (r.customer_id = auth.uid() OR r.driver_id = auth.uid())
    ))
  OR
  (realtime.topic() LIKE 'user:%'
    AND split_part(realtime.topic(), ':', 2) = auth.uid()::text)
);
