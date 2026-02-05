-- Create tabaski_reservations table
CREATE TABLE public.tabaski_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reservation_number TEXT NOT NULL UNIQUE,
  livestock_id TEXT NOT NULL,
  livestock_name TEXT NOT NULL,
  livestock_type TEXT NOT NULL,
  livestock_breed TEXT NOT NULL,
  livestock_weight TEXT,
  livestock_price NUMERIC NOT NULL,
  seller_name TEXT NOT NULL,
  seller_location TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  currency TEXT DEFAULT 'XOF',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tabaski_reservations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own reservations"
ON public.tabaski_reservations
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create reservations"
ON public.tabaski_reservations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own reservations"
ON public.tabaski_reservations
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tabaski_reservations_updated_at
BEFORE UPDATE ON public.tabaski_reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_tabaski_reservations_user_id ON public.tabaski_reservations(user_id);
CREATE INDEX idx_tabaski_reservations_status ON public.tabaski_reservations(status);
CREATE INDEX idx_tabaski_reservations_delivery_date ON public.tabaski_reservations(delivery_date);