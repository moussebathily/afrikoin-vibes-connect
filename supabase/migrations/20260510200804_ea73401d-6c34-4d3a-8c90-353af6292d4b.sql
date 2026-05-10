
-- 1. Tighten seller_subscriptions UPDATE policy: prevent self-promotion to premium
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.seller_subscriptions;
CREATE POLICY "Users can update own subscription auto_renew"
ON public.seller_subscriptions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND plan = (SELECT s.plan FROM public.seller_subscriptions s WHERE s.id = seller_subscriptions.id)
  AND status = (SELECT s.status FROM public.seller_subscriptions s WHERE s.id = seller_subscriptions.id)
  AND expires_at IS NOT DISTINCT FROM (SELECT s.expires_at FROM public.seller_subscriptions s WHERE s.id = seller_subscriptions.id)
  AND amount = (SELECT s.amount FROM public.seller_subscriptions s WHERE s.id = seller_subscriptions.id)
);

-- 2. Drivers: drop overly broad policy that exposes PII to any auth'd user with active ride
DROP POLICY IF EXISTS "Auth users see basic available driver info" ON public.drivers;
-- Keep: own profile, admins, assigned-ride customers (already exists, scoped to customer's own ride)

-- 3. Vehicles: restrict public access; expose sensitive fields only to owner/admin
DROP POLICY IF EXISTS "Anyone can view vehicles" ON public.vehicles;
CREATE POLICY "Authenticated users can view vehicles"
ON public.vehicles
FOR SELECT
TO authenticated
USING (true);
-- Sensitive doc URLs/plate are still in row; restrict via column grants
REVOKE SELECT (plate_number, registration_card_url, insurance_url) ON public.vehicles FROM anon, authenticated;
GRANT SELECT (plate_number, registration_card_url, insurance_url) ON public.vehicles TO service_role;

-- 4. Seller profiles phone: restrict column visibility to owner only
REVOKE SELECT (phone) ON public.seller_profiles FROM anon, authenticated;
GRANT SELECT (phone) ON public.seller_profiles TO service_role;

-- 5. Lock down SECURITY DEFINER user-callable functions (not policy/trigger functions)
REVOKE EXECUTE ON FUNCTION public.log_premium_activity(uuid, text, text, text, numeric, text, text, text, text, timestamptz, text, jsonb) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.compute_seller_trust_score(uuid) FROM anon, public;
