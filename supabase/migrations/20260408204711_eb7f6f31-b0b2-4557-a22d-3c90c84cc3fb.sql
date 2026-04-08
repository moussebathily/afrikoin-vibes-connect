
-- Drop the security definer view
DROP VIEW IF EXISTS public.seller_profiles_public;

-- Remove the old duplicate driver policy that was not properly dropped
DROP POLICY IF EXISTS "Authenticated users can view basic driver info" ON public.drivers;

-- Recreate a proper scoped driver policy
CREATE POLICY "Auth users see basic available driver info"
ON public.drivers FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
  OR (
    id IN (
      SELECT driver_id FROM public.rides
      WHERE customer_id = auth.uid()
      AND status IN ('accepted', 'started', 'in_progress')
    )
  )
);
