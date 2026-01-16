-- Create seller_profiles table for extended seller information
CREATE TABLE public.seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  store_name TEXT NOT NULL,
  store_description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  business_type TEXT DEFAULT 'individual',
  country TEXT,
  city TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table for tracking sales
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  status TEXT DEFAULT 'pending',
  subtotal NUMERIC NOT NULL DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'XOF',
  shipping_address JSONB,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_title TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for seller_profiles
CREATE POLICY "Seller profiles are viewable by everyone"
  ON public.seller_profiles FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create own seller profile"
  ON public.seller_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own seller profile"
  ON public.seller_profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for orders
CREATE POLICY "Buyers can view own orders"
  ON public.orders FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view orders for their products"
  ON public.orders FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update order status"
  ON public.orders FOR UPDATE USING (auth.uid() = seller_id);

-- RLS policies for order_items
CREATE POLICY "Order items viewable by order owner"
  ON public.order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

CREATE POLICY "Order items insertable with order"
  ON public.order_items FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.buyer_id = auth.uid()
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_seller_profiles_updated_at
  BEFORE UPDATE ON public.seller_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(NEW.id::TEXT, 1, 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- Insert sample seller profile (using a placeholder UUID)
INSERT INTO public.seller_profiles (user_id, store_name, store_description, business_type, country, city, is_verified, rating, total_reviews, total_sales, total_revenue)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Artisanat Dakar', 'Boutique d''artisanat africain authentique. Produits faits main par des artisans locaux.', 'business', 'Sénégal', 'Dakar', true, 4.8, 156, 423, 2850000),
  ('00000000-0000-0000-0000-000000000002', 'Mode Abidjan', 'Vêtements et accessoires de mode africaine. Tissus wax et designs modernes.', 'individual', 'Côte d''Ivoire', 'Abidjan', false, 4.5, 89, 234, 1540000);

-- Insert sample orders for statistics
INSERT INTO public.orders (buyer_id, seller_id, status, subtotal, shipping_fee, total_amount, currency, payment_status, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'delivered', 45000, 2500, 47500, 'XOF', 'completed', NOW() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'delivered', 85000, 3000, 88000, 'XOF', 'completed', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'shipped', 32000, 2000, 34000, 'XOF', 'completed', NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'pending', 55000, 2500, 57500, 'XOF', 'pending', NOW()),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'processing', 120000, 4000, 124000, 'XOF', 'completed', NOW() - INTERVAL '5 hours');