
-- Wallpaper categories
CREATE TABLE public.wallpaper_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wallpaper_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wallpaper categories are public" ON public.wallpaper_categories FOR SELECT USING (true);

-- Seed 16 categories
INSERT INTO public.wallpaper_categories (name, slug, icon, color, order_index) VALUES
('Nature', 'nature', 'Trees', '#22c55e', 1),
('Espace', 'espace', 'Rocket', '#6366f1', 2),
('Anime', 'anime', 'Sparkles', '#ec4899', 3),
('Sport', 'sport', 'Trophy', '#f59e0b', 4),
('Animaux', 'animaux', 'Cat', '#8b5cf6', 5),
('Ville', 'ville', 'Building2', '#3b82f6', 6),
('Océan', 'ocean', 'Waves', '#06b6d4', 7),
('Montagne', 'montagne', 'Mountain', '#78716c', 8),
('Abstrait', 'abstrait', 'Palette', '#f43f5e', 9),
('Voitures', 'voitures', 'Car', '#ef4444', 10),
('Gaming', 'gaming', 'Gamepad2', '#a855f7', 11),
('Musique', 'musique', 'Music', '#14b8a6', 12),
('Architecture', 'architecture', 'Landmark', '#64748b', 13),
('Saisons', 'saisons', 'Sun', '#eab308', 14),
('Afrique', 'afrique', 'Globe', '#f97316', 15),
('Minimaliste', 'minimaliste', 'Minus', '#334155', 16);

-- Wallpapers table
CREATE TABLE public.wallpapers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category_id UUID REFERENCES public.wallpaper_categories(id),
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  width INT,
  height INT,
  file_size BIGINT,
  download_count INT DEFAULT 0,
  favorites_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wallpapers are publicly viewable" ON public.wallpapers FOR SELECT USING (is_active = true);
CREATE POLICY "Users can upload wallpapers" ON public.wallpapers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallpapers" ON public.wallpapers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wallpapers" ON public.wallpapers FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_wallpapers_category ON public.wallpapers(category_id);
CREATE INDEX idx_wallpapers_media_type ON public.wallpapers(media_type);
CREATE INDEX idx_wallpapers_created ON public.wallpapers(created_at DESC);

-- Wallpaper favorites
CREATE TABLE public.wallpaper_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wallpaper_id UUID NOT NULL REFERENCES public.wallpapers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, wallpaper_id)
);
ALTER TABLE public.wallpaper_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON public.wallpaper_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.wallpaper_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.wallpaper_favorites FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('wallpapers', 'wallpapers', true);
CREATE POLICY "Anyone can view wallpapers" ON storage.objects FOR SELECT USING (bucket_id = 'wallpapers');
CREATE POLICY "Authenticated users can upload wallpapers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wallpapers' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own wallpaper files" ON storage.objects FOR DELETE USING (bucket_id = 'wallpapers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Updated_at trigger
CREATE TRIGGER update_wallpapers_updated_at
BEFORE UPDATE ON public.wallpapers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
