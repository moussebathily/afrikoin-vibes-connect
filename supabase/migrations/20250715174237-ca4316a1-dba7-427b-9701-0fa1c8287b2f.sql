-- Créer la table pour les crédits de likes
CREATE TABLE public.like_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  total_purchased INTEGER NOT NULL DEFAULT 0,
  total_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Créer la table pour les achats de packs
CREATE TABLE public.like_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  purchase_token TEXT NOT NULL UNIQUE,
  product_id TEXT NOT NULL,
  pack_name TEXT NOT NULL,
  likes_amount INTEGER NOT NULL,
  price_amount INTEGER NOT NULL, -- en centimes
  currency TEXT NOT NULL DEFAULT 'EUR',
  store_type TEXT NOT NULL DEFAULT 'play_store',
  status TEXT NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Créer la table pour l'utilisation des likes
CREATE TABLE public.like_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_post_id UUID,
  target_user_id UUID,
  likes_used INTEGER NOT NULL DEFAULT 1,
  usage_type TEXT NOT NULL DEFAULT 'manual', -- 'manual' ou 'automatic'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.like_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.like_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.like_usage ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour like_credits
CREATE POLICY "Users can view their own like credits" 
ON public.like_credits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own like credits" 
ON public.like_credits 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert like credits" 
ON public.like_credits 
FOR INSERT 
WITH CHECK (true);

-- Politiques RLS pour like_purchases
CREATE POLICY "Users can view their own purchases" 
ON public.like_purchases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert purchases" 
ON public.like_purchases 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update purchases" 
ON public.like_purchases 
FOR UPDATE 
USING (true);

-- Politiques RLS pour like_usage
CREATE POLICY "Users can view their own usage" 
ON public.like_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
ON public.like_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.update_like_credits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_like_credits_updated_at
  BEFORE UPDATE ON public.like_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_like_credits_updated_at();

-- Fonction pour créer le solde initial lors de l'inscription
CREATE OR REPLACE FUNCTION public.create_initial_like_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.like_credits (user_id, balance)
  VALUES (NEW.id, 10); -- 10 likes gratuits à l'inscription
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le solde initial
CREATE TRIGGER on_user_created_like_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_initial_like_credits();