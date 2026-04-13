-- 1. Fix seller_profiles: restrict SELECT to authenticated users only
DROP POLICY IF EXISTS "Anyone can view seller profiles (public fields)" ON public.seller_profiles;

CREATE POLICY "Authenticated users can view seller profiles"
  ON public.seller_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 2. Fix message-files storage: add DELETE policy scoped to file owner
CREATE POLICY "Users can delete own message files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'message-files'
    AND owner = auth.uid()
  );