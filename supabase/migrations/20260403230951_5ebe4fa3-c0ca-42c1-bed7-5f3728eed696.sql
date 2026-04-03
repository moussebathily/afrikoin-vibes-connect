
DROP POLICY IF EXISTS "seed_seller_profiles" ON public.seller_profiles;
DROP POLICY IF EXISTS "seed_products" ON public.products;

-- Admin-only insert for seller_profiles (users create via authenticated policy already exists)
CREATE POLICY "Admins can insert seller_profiles" ON public.seller_profiles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
