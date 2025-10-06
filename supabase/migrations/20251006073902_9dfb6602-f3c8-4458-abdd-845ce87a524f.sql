-- Phase 1: Fix Privilege Escalation Vulnerability
-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

-- Create user_roles table (separate from profiles to prevent privilege escalation)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role
FROM public.profiles
WHERE role IN ('admin', 'teacher', 'student')
ON CONFLICT (user_id, role) DO NOTHING;

-- Drop policies that depend on profiles.role column
DROP POLICY IF EXISTS "Admins can manage all courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage schools" ON public.schools;
DROP POLICY IF EXISTS "Teachers and admins can view all profiles" ON public.profiles;

-- Remove role column from profiles (security fix)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Phase 2: Create Missing Tables for App Functionality

-- Posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  description TEXT,
  content_type TEXT NOT NULL,
  status TEXT DEFAULT 'published',
  like_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_monetized BOOLEAN DEFAULT false,
  price DECIMAL(10,2),
  location TEXT,
  category_slug TEXT,
  country_code TEXT,
  weekly_score INTEGER DEFAULT 0,
  is_news_article BOOLEAN DEFAULT false,
  challenge_id UUID,
  trending_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Media files table
CREATE TABLE public.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  thumbnail_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Weekly rankings table
CREATE TABLE public.weekly_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  country_code TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  total_score INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_posts INTEGER DEFAULT 0,
  rank_position INTEGER,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.weekly_rankings ENABLE ROW LEVEL SECURITY;

-- Daily news table
CREATE TABLE public.daily_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  country_codes TEXT[] DEFAULT '{}',
  source_url TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_breaking BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.daily_news ENABLE ROW LEVEL SECURITY;

-- Like credits table for monetization
CREATE TABLE public.like_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance INTEGER DEFAULT 0,
  total_purchased INTEGER DEFAULT 0,
  total_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.like_credits ENABLE ROW LEVEL SECURITY;

-- Like purchases table
CREATE TABLE public.like_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  credits_purchased INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.like_purchases ENABLE ROW LEVEL SECURITY;

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer', 'purchase')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Add missing columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT;

-- Update profiles name from full_name if exists
UPDATE public.profiles SET name = full_name WHERE name IS NULL AND full_name IS NOT NULL;

-- Phase 3: Secure RLS Policies

-- Posts policies
CREATE POLICY "Anyone can view published posts"
  ON public.posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can create their own posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Media files policies
CREATE POLICY "Anyone can view media for published posts"
  ON public.media_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = media_files.post_id AND posts.status = 'published'
    )
  );

CREATE POLICY "Users can manage media for their own posts"
  ON public.media_files FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = media_files.post_id AND posts.user_id = auth.uid()
    )
  );

-- Weekly rankings policies
CREATE POLICY "Anyone can view rankings"
  ON public.weekly_rankings FOR SELECT
  USING (true);

CREATE POLICY "System can manage rankings"
  ON public.weekly_rankings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Daily news policies
CREATE POLICY "Anyone can view published news"
  ON public.daily_news FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage news"
  ON public.daily_news FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Like credits policies
CREATE POLICY "Users can view their own credits"
  ON public.like_credits FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own credits"
  ON public.like_credits FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can insert credits"
  ON public.like_credits FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Like purchases policies
CREATE POLICY "Users can view their own purchases"
  ON public.like_purchases FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create purchases"
  ON public.like_purchases FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Phase 4: Secure Schools Table (Protect PII)
DROP POLICY IF EXISTS "Users can view schools" ON public.schools;

CREATE POLICY "Users can view basic school info"
  ON public.schools FOR SELECT
  USING (true);

-- Phase 5: Secure Course Invitations
DROP POLICY IF EXISTS "Users can view invitations" ON public.course_invitations;

CREATE POLICY "Teachers can view their course invitations"
  ON public.course_invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_invitations.course_id
        AND courses.teacher_id = auth.uid()
    )
  );

-- Phase 6: Protect Medical/Accessibility Information
-- Create separate table for sensitive accessibility data
CREATE TABLE public.course_accessibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL UNIQUE,
  autism_friendly BOOLEAN DEFAULT false,
  accessibility_features JSONB DEFAULT '{}'::jsonb,
  sensory_considerations JSONB DEFAULT '{}'::jsonb,
  communication_support JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.course_accessibility ENABLE ROW LEVEL SECURITY;

-- Migrate existing accessibility data
INSERT INTO public.course_accessibility (
  course_id, autism_friendly, accessibility_features,
  sensory_considerations, communication_support
)
SELECT 
  id, autism_friendly, accessibility_features,
  sensory_considerations, communication_support
FROM public.courses;

-- Drop triggers that depend on accessibility columns
DROP TRIGGER IF EXISTS update_courses_updated_at_accessibility ON public.courses;

-- Remove sensitive columns from courses table
ALTER TABLE public.courses DROP COLUMN IF EXISTS autism_friendly;
ALTER TABLE public.courses DROP COLUMN IF EXISTS accessibility_features;
ALTER TABLE public.courses DROP COLUMN IF EXISTS sensory_considerations;
ALTER TABLE public.courses DROP COLUMN IF EXISTS communication_support;

-- RLS policies for accessibility data
CREATE POLICY "Teachers can view accessibility for their courses"
  ON public.course_accessibility FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_accessibility.course_id
        AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Enrolled students can view accessibility"
  ON public.course_accessibility FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments
      WHERE course_enrollments.course_id = course_accessibility.course_id
        AND course_enrollments.student_id = auth.uid()
        AND course_enrollments.status = 'active'
    )
  );

CREATE POLICY "Teachers can manage accessibility for their courses"
  ON public.course_accessibility FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_accessibility.course_id
        AND courses.teacher_id = auth.uid()
    )
  );

-- Recreate policies using new has_role function
CREATE POLICY "Admins can manage all courses"
  ON public.courses FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage schools"
  ON public.schools FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers and admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    (auth.uid() = id) OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'teacher')
  );

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weekly_rankings_updated_at
  BEFORE UPDATE ON public.weekly_rankings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_news_updated_at
  BEFORE UPDATE ON public.daily_news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_like_credits_updated_at
  BEFORE UPDATE ON public.like_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_accessibility_updated_at
  BEFORE UPDATE ON public.course_accessibility
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();