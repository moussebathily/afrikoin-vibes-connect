
-- Temporary open insert policies for seeding
CREATE POLICY "seed_seller_profiles" ON public.seller_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "seed_products" ON public.products FOR INSERT WITH CHECK (true);
