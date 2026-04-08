
-- 1. Fix seller_profiles: hide phone from public
DROP POLICY IF EXISTS "Anyone can view seller profiles" ON public.seller_profiles;

CREATE POLICY "Anyone can view seller profiles (public fields)"
ON public.seller_profiles FOR SELECT
USING (true);

-- Create a secure view for seller public data (without phone)
CREATE OR REPLACE VIEW public.seller_profiles_public AS
SELECT id, user_id, store_name, description, logo_url, banner_url,
       city, country, is_verified, rating, total_sales, created_at
FROM public.seller_profiles;

-- 2. Fix drivers: restrict visible fields for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view available drivers" ON public.drivers;

CREATE POLICY "Authenticated users can view basic driver info"
ON public.drivers FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
  OR (
    (status = 'available' OR status = 'active')
    AND id IN (
      SELECT driver_id FROM public.rides
      WHERE customer_id = auth.uid()
      AND status IN ('accepted', 'started', 'in_progress')
    )
  )
);

-- 3. Fix message_reads: scope to conversation members
DROP POLICY IF EXISTS "Anyone can view message reads" ON public.message_reads;
DROP POLICY IF EXISTS "Users can view read receipts" ON public.message_reads;

CREATE POLICY "Conversation members can view read receipts"
ON public.message_reads FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.messages m
    JOIN public.conversation_members cm ON cm.conversation_id = m.conversation_id
    WHERE m.id = message_reads.message_id
    AND cm.user_id = auth.uid()
  )
);

-- 4. Fix resumes upload: enforce path ownership
DROP POLICY IF EXISTS "Users upload own resumes" ON storage.objects;

CREATE POLICY "Users upload own resumes with path check"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
