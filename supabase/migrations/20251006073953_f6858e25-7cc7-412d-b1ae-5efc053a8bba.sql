-- Create missing tables that the application expects

-- Content categories table
CREATE TABLE public.content_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON public.content_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON public.content_categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Challenges table
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('weekly', 'monthly', 'special')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reward_points INTEGER DEFAULT 0,
  reward_title TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active challenges"
  ON public.challenges FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage challenges"
  ON public.challenges FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- User balances table (for wallet functionality)
CREATE TABLE public.user_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  available_balance DECIMAL(10,2) DEFAULT 0,
  pending_balance DECIMAL(10,2) DEFAULT 0,
  total_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own balance"
  ON public.user_balances FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own balance"
  ON public.user_balances FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can insert balances"
  ON public.user_balances FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_content_categories_updated_at
  BEFORE UPDATE ON public.content_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_balances_updated_at
  BEFORE UPDATE ON public.user_balances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default content categories
INSERT INTO public.content_categories (name, slug, description, icon, color) VALUES
  ('Culture', 'culture', 'Cultural content and traditions', '🎭', '#9b87f5'),
  ('Sports', 'sports', 'Sports news and highlights', '⚽', '#0EA5E9'),
  ('Markets', 'markets', 'Market trends and business', '📈', '#10b981'),
  ('Entertainment', 'entertainment', 'Entertainment and media', '🎬', '#f59e0b'),
  ('News', 'news', 'Latest news and updates', '📰', '#ef4444')
ON CONFLICT (slug) DO NOTHING;