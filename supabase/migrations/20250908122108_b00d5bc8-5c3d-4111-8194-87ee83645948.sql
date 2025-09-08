-- Create content categories table
CREATE TABLE public.content_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weekly rankings table
CREATE TABLE public.weekly_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  country_code TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  total_views INTEGER NOT NULL DEFAULT 0,
  total_likes INTEGER NOT NULL DEFAULT 0,
  total_posts INTEGER NOT NULL DEFAULT 0,
  rank_position INTEGER,
  title TEXT, -- "Roi du Sport", "Reine de la Culture", etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily news table
CREATE TABLE public.daily_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  country_codes TEXT[], -- Array of country codes
  source_url TEXT,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_breaking BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  challenge_type TEXT NOT NULL DEFAULT 'weekly', -- weekly, monthly, special
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reward_points INTEGER NOT NULL DEFAULT 0,
  reward_title TEXT,
  max_participants INTEGER,
  current_participants INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_type TEXT NOT NULL, -- title, badge, milestone
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  category_slug TEXT,
  points_earned INTEGER NOT NULL DEFAULT 0,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  week_start DATE, -- For weekly achievements
  metadata JSONB -- Additional data like rank position, country, etc.
);

-- Extend posts table with new columns
ALTER TABLE public.posts 
ADD COLUMN category_slug TEXT DEFAULT 'general',
ADD COLUMN country_code TEXT,
ADD COLUMN weekly_score INTEGER NOT NULL DEFAULT 0,
ADD COLUMN is_news_article BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN challenge_id UUID,
ADD COLUMN trending_score DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Insert default categories
INSERT INTO public.content_categories (name, slug, description, icon, color) VALUES
('Culture', 'culture', 'Arts, traditions et patrimoine africain', 'Palette', 'hsl(350, 70%, 50%)'),
('Sport', 'sport', 'Football, athlétisme et sports africains', 'Trophy', 'hsl(120, 70%, 50%)'),
('Économie', 'economy', 'Business, fintech et entrepreneuriat', 'TrendingUp', 'hsl(210, 70%, 50%)'),
('Sécurité', 'security', 'Actualités sécuritaires et alertes', 'Shield', 'hsl(30, 70%, 50%)'),
('Général', 'general', 'Contenus divers et variés', 'Hash', 'hsl(260, 70%, 50%)');

-- Enable Row Level Security
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for content_categories
CREATE POLICY "Anyone can view categories" ON public.content_categories FOR SELECT USING (true);
CREATE POLICY "Only system can manage categories" ON public.content_categories FOR ALL USING (false) WITH CHECK (false);

-- Create policies for weekly_rankings
CREATE POLICY "Anyone can view rankings" ON public.weekly_rankings FOR SELECT USING (true);
CREATE POLICY "System can insert rankings" ON public.weekly_rankings FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update rankings" ON public.weekly_rankings FOR UPDATE USING (true);

-- Create policies for daily_news
CREATE POLICY "Anyone can view news" ON public.daily_news FOR SELECT USING (true);
CREATE POLICY "System can manage news" ON public.daily_news FOR ALL USING (true) WITH CHECK (true);

-- Create policies for challenges
CREATE POLICY "Anyone can view challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "System can manage challenges" ON public.challenges FOR ALL USING (true) WITH CHECK (true);

-- Create policies for user_achievements
CREATE POLICY "Users can view their achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert achievements" ON public.user_achievements FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_weekly_rankings_country_category ON public.weekly_rankings(country_code, category_slug, week_start);
CREATE INDEX idx_weekly_rankings_user_week ON public.weekly_rankings(user_id, week_start);
CREATE INDEX idx_posts_category_country ON public.posts(category_slug, country_code);
CREATE INDEX idx_posts_trending_score ON public.posts(trending_score DESC);
CREATE INDEX idx_daily_news_category ON public.daily_news(category_slug, published_at DESC);
CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id, earned_at DESC);

-- Create function to update trending scores
CREATE OR REPLACE FUNCTION public.calculate_trending_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate trending score based on views, likes, and recency
  NEW.trending_score = (
    (NEW.view_count * 1.0) + 
    (NEW.like_count * 2.0) + 
    (EXTRACT(EPOCH FROM (now() - NEW.created_at)) / 3600.0 * -0.1)
  );
  
  -- Calculate weekly score
  NEW.weekly_score = NEW.view_count + (NEW.like_count * 2);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for trending score calculation
CREATE TRIGGER update_post_trending_score
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_trending_score();