-- Premium Vendeur subscriptions
CREATE TABLE public.seller_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  payment_method TEXT,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seller_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
ON public.seller_subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
ON public.seller_subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
ON public.seller_subscriptions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
ON public.seller_subscriptions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_seller_subscriptions_user ON public.seller_subscriptions(user_id);
CREATE INDEX idx_seller_subscriptions_seller ON public.seller_subscriptions(seller_id);
CREATE INDEX idx_seller_subscriptions_status ON public.seller_subscriptions(status, expires_at);

-- Add Premium + Trust Score fields to seller_profiles
ALTER TABLE public.seller_profiles
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS premium_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS id_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Trigger updated_at on seller_subscriptions
CREATE TRIGGER update_seller_subscriptions_updated_at
BEFORE UPDATE ON public.seller_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_last_message();

-- Function to compute trust score
CREATE OR REPLACE FUNCTION public.compute_seller_trust_score(_seller_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  score INTEGER := 0;
  sp RECORD;
  avg_rating NUMERIC;
  review_count INTEGER;
BEGIN
  SELECT * INTO sp FROM public.seller_profiles WHERE id = _seller_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  -- Verifications (max 30)
  IF sp.is_verified THEN score := score + 10; END IF;
  IF sp.phone_verified THEN score := score + 10; END IF;
  IF sp.id_verified THEN score := score + 10; END IF;

  -- Sales activity (max 30)
  score := score + LEAST(COALESCE(sp.total_sales, 0), 30);

  -- Reviews (max 25)
  SELECT AVG(pr.rating)::NUMERIC, COUNT(*)::INTEGER
  INTO avg_rating, review_count
  FROM public.product_reviews pr
  JOIN public.products p ON p.id = pr.product_id
  WHERE p.seller_id = _seller_id;

  IF review_count > 0 THEN
    score := score + LEAST(review_count, 10);
    score := score + ROUND(COALESCE(avg_rating, 0) * 3)::INTEGER;
  END IF;

  -- Premium bonus (max 15)
  IF sp.is_premium AND (sp.premium_until IS NULL OR sp.premium_until > now()) THEN
    score := score + 15;
  END IF;

  RETURN LEAST(score, 100);
END;
$$;