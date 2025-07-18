-- Create posts table for user publications
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  description TEXT,
  content_type TEXT NOT NULL DEFAULT 'photo', -- 'photo' or 'video'
  location TEXT,
  price DECIMAL(10,2), -- for monetization
  is_monetized BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published', -- 'draft', 'published', 'archived'
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media_files table for file metadata
CREATE TABLE public.media_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- for videos in seconds
  thumbnail_path TEXT, -- for video thumbnails
  storage_bucket TEXT NOT NULL DEFAULT 'posts',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts table
CREATE POLICY "Users can view published posts" 
ON public.posts 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Users can create their own posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for media_files table
CREATE POLICY "Users can view media of published posts" 
ON public.media_files 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = media_files.post_id 
    AND posts.status = 'published'
  )
);

CREATE POLICY "Users can manage media of their own posts" 
ON public.media_files 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = media_files.post_id 
    AND posts.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = media_files.post_id 
    AND posts.user_id = auth.uid()
  )
);

-- Add foreign key constraint
ALTER TABLE public.media_files 
ADD CONSTRAINT media_files_post_id_fkey 
FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_media_files_post_id ON public.media_files(post_id);

-- Create function for updating timestamps
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for posts media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('posts', 'posts', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('thumbnails', 'thumbnails', true);

-- Storage policies for posts bucket
CREATE POLICY "Posts media are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'posts');

CREATE POLICY "Users can upload their own posts media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'posts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own posts media" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'posts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own posts media" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'posts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for thumbnails bucket
CREATE POLICY "Thumbnails are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'thumbnails');

CREATE POLICY "Users can upload their own thumbnails" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'thumbnails' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own thumbnails" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'thumbnails' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own thumbnails" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'thumbnails' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);