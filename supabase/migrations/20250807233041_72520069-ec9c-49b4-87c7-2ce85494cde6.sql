-- Create followers table for user relationships
CREATE TABLE IF NOT EXISTS public.followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  follower_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT followers_unique UNIQUE (user_id, follower_id)
);

-- Enable RLS
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can follow others"
ON public.followers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = follower_id AND user_id <> follower_id);

CREATE POLICY "Users can unfollow"
ON public.followers
FOR DELETE
TO authenticated
USING (auth.uid() = follower_id);

CREATE POLICY "Users can view their follow graph"
ON public.followers
FOR SELECT
TO authenticated
USING (auth.uid() = follower_id OR auth.uid() = user_id);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_followers_user_id ON public.followers (user_id);
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON public.followers (follower_id);
