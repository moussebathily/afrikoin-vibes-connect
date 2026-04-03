
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('wallpapers', 'wallpapers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('message-files', 'message-files', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Wallpapers: public read, authenticated upload
CREATE POLICY "Public wallpaper read" ON storage.objects FOR SELECT USING (bucket_id = 'wallpapers');
CREATE POLICY "Auth wallpaper upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wallpapers' AND auth.role() = 'authenticated');

-- Message files: only conversation members
CREATE POLICY "Auth message files upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'message-files' AND auth.role() = 'authenticated');
CREATE POLICY "Auth message files read" ON storage.objects FOR SELECT USING (bucket_id = 'message-files' AND auth.role() = 'authenticated');

-- Resumes: only owner
CREATE POLICY "Users upload own resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');
CREATE POLICY "Users read own resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- Product images: public read, seller upload
CREATE POLICY "Public product images read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Auth product images upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
