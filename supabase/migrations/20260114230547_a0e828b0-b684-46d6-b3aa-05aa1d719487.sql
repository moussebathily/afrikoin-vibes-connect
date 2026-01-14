-- Create product_reviews table for customer reviews
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Reviews are viewable by everyone" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.product_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.product_reviews FOR DELETE USING (auth.uid() = user_id);

-- Add average_rating and reviews_count to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS average_rating NUMERIC(2,1) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;

-- Trigger to update product ratings
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products SET
    average_rating = (SELECT COALESCE(AVG(rating), 0) FROM public.product_reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)),
    reviews_count = (SELECT COUNT(*) FROM public.product_reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id))
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_on_review
AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();

-- Insert sample reviews
INSERT INTO public.product_reviews (product_id, user_id, rating, title, comment, is_verified_purchase)
SELECT 
  p.id,
  (SELECT id FROM auth.users LIMIT 1),
  4 + (random() < 0.5)::int,
  'Excellent produit !',
  'Très satisfait de mon achat. La qualité est au rendez-vous et la livraison était rapide.',
  true
FROM public.products p
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1)
LIMIT 5;