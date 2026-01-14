-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add missing columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Add missing columns to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'text';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_monetized BOOLEAN DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS save_count INTEGER DEFAULT 0;

-- Add missing columns to weekly_rankings
ALTER TABLE public.weekly_rankings ADD COLUMN IF NOT EXISTS country_code TEXT;
ALTER TABLE public.weekly_rankings ADD COLUMN IF NOT EXISTS category_slug TEXT;
ALTER TABLE public.weekly_rankings ADD COLUMN IF NOT EXISTS week_end DATE;
ALTER TABLE public.weekly_rankings ADD COLUMN IF NOT EXISTS total_score INTEGER DEFAULT 0;
ALTER TABLE public.weekly_rankings ADD COLUMN IF NOT EXISTS trend TEXT DEFAULT 'stable';
ALTER TABLE public.weekly_rankings ADD COLUMN IF NOT EXISTS previous_rank INTEGER;
ALTER TABLE public.weekly_rankings ADD COLUMN IF NOT EXISTS change_count INTEGER DEFAULT 0;
ALTER TABLE public.weekly_rankings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add missing columns to daily_news
ALTER TABLE public.daily_news ADD COLUMN IF NOT EXISTS category_slug TEXT;
ALTER TABLE public.daily_news ADD COLUMN IF NOT EXISTS country_codes TEXT[];
ALTER TABLE public.daily_news ADD COLUMN IF NOT EXISTS is_breaking BOOLEAN DEFAULT false;
ALTER TABLE public.daily_news ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add missing columns to challenges
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS category_slug TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS challenge_type TEXT DEFAULT 'weekly';
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS reward_points INTEGER DEFAULT 0;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS current_participants INTEGER DEFAULT 0;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add missing columns to content_categories
ALTER TABLE public.content_categories ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0;
ALTER TABLE public.content_categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Create media_files table for posts
CREATE TABLE IF NOT EXISTS public.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'image',
  thumbnail_url TEXT,
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media files are viewable by everyone" ON public.media_files FOR SELECT USING (true);
CREATE POLICY "Users can insert media for own posts" ON public.media_files FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.posts WHERE posts.id = media_files.post_id AND posts.user_id = auth.uid())
);