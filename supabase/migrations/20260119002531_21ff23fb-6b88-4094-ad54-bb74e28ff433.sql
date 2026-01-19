-- Create table for user job preferences
CREATE TABLE public.user_job_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  preferred_categories TEXT[] DEFAULT '{}',
  preferred_locations TEXT[] DEFAULT '{}',
  preferred_job_types TEXT[] DEFAULT '{}',
  min_salary NUMERIC,
  max_salary NUMERIC,
  experience_level TEXT,
  remote_only BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_user_preferences UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.user_job_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own preferences"
ON public.user_job_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own preferences"
ON public.user_job_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
ON public.user_job_preferences FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
ON public.user_job_preferences FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_job_preferences_updated_at
BEFORE UPDATE ON public.user_job_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for tracking job views (for recommendations)
CREATE TABLE public.job_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_views ENABLE ROW LEVEL SECURITY;

-- RLS policies for job_views
CREATE POLICY "Users can view own job views"
ON public.job_views FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job views"
ON public.job_views FOR INSERT
WITH CHECK (auth.uid() = user_id);