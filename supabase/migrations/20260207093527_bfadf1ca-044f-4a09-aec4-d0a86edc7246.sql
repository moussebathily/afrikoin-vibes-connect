
-- Table des stations d'essence et kiosques
CREATE TABLE public.stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'station' CHECK (type IN ('station', 'kiosque')),
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'CI',
  fuel_types TEXT[] DEFAULT '{}',
  products TEXT[] DEFAULT '{}',
  opening_hours TEXT,
  is_24h BOOLEAN DEFAULT false,
  is_open BOOLEAN DEFAULT true,
  phone TEXT,
  brand TEXT,
  price_essence NUMERIC,
  price_diesel NUMERIC,
  price_gaz NUMERIC,
  current_status TEXT DEFAULT 'libre' CHECK (current_status IN ('libre', 'moyen', 'bonde')),
  status_updated_at TIMESTAMP WITH TIME ZONE,
  total_reports INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stations are viewable by everyone"
  ON public.stations FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert stations"
  ON public.stations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Table des signalements communautaires
CREATE TABLE public.station_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('libre', 'moyen', 'bonde')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.station_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reports are viewable by everyone"
  ON public.station_reports FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reports"
  ON public.station_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index pour performances
CREATE INDEX idx_stations_city ON public.stations(city);
CREATE INDEX idx_stations_type ON public.stations(type);
CREATE INDEX idx_stations_country ON public.stations(country);
CREATE INDEX idx_station_reports_station ON public.station_reports(station_id);
CREATE INDEX idx_station_reports_created ON public.station_reports(created_at DESC);

-- Trigger updated_at
CREATE TRIGGER update_stations_updated_at
  BEFORE UPDATE ON public.stations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data: stations à Abidjan
INSERT INTO public.stations (name, type, latitude, longitude, address, city, country, fuel_types, products, opening_hours, is_24h, brand, price_essence, price_diesel, price_gaz, current_status) VALUES
('Total Plateau', 'station', 5.3200, -4.0167, 'Boulevard de la République, Plateau', 'Abidjan', 'CI', ARRAY['essence', 'diesel', 'gaz'], ARRAY['carburant', 'lubrifiant', 'boutique'], '06h-22h', false, 'Total', 735, 655, 450, 'libre'),
('Shell Cocody', 'station', 5.3488, -3.9908, 'Rue des Jardins, Cocody', 'Abidjan', 'CI', ARRAY['essence', 'diesel'], ARRAY['carburant', 'lavage'], '06h-23h', false, 'Shell', 740, 660, NULL, 'moyen'),
('Petro Ivoire Marcory', 'station', 5.3011, -3.9876, 'Avenue Pierre Fakhoury, Marcory', 'Abidjan', 'CI', ARRAY['essence', 'diesel', 'gaz'], ARRAY['carburant', 'boutique', 'restaurant'], '24h/24', true, 'Petro Ivoire', 730, 650, 445, 'libre'),
('Total Yopougon', 'station', 5.3364, -4.0800, 'Carrefour Siporex, Yopougon', 'Abidjan', 'CI', ARRAY['essence', 'diesel'], ARRAY['carburant', 'lubrifiant'], '06h-21h', false, 'Total', 735, 655, NULL, 'bonde'),
('Kiosque Abobo Gare', 'kiosque', 5.4167, -4.0167, 'Marché Abobo Gare', 'Abidjan', 'CI', ARRAY['essence'], ARRAY['essence bidon', 'recharge telephone', 'eau'], '07h-20h', false, NULL, 800, NULL, NULL, 'libre'),
('Kiosque Port-Bouët', 'kiosque', 5.2550, -3.9267, 'Quartier Gonzagueville', 'Abidjan', 'CI', ARRAY['essence', 'gaz'], ARRAY['essence bidon', 'gaz', 'eau'], '06h-19h', false, NULL, 790, NULL, 460, 'moyen'),

-- Dakar
('Total Dakar Plateau', 'station', 14.6928, -17.4467, 'Avenue Lamine Guèye, Plateau', 'Dakar', 'SN', ARRAY['essence', 'diesel', 'gaz'], ARRAY['carburant', 'boutique'], '06h-22h', false, 'Total', 790, 695, 400, 'libre'),
('Shell Almadies', 'station', 14.7445, -17.5139, 'Route des Almadies', 'Dakar', 'SN', ARRAY['essence', 'diesel'], ARRAY['carburant', 'lavage', 'boutique'], '24h/24', true, 'Shell', 795, 700, NULL, 'moyen'),
('Kiosque Pikine', 'kiosque', 14.7500, -17.3900, 'Marché central Pikine', 'Dakar', 'SN', ARRAY['essence'], ARRAY['essence bidon', 'eau', 'recharge telephone'], '07h-21h', false, NULL, 850, NULL, NULL, 'libre'),

-- Lagos
('NNPC Lekki', 'station', 6.4474, 3.4737, 'Lekki Phase 1', 'Lagos', 'NG', ARRAY['essence', 'diesel'], ARRAY['carburant', 'boutique'], '06h-22h', false, 'NNPC', 617, 890, NULL, 'bonde'),
('Total Ikeja', 'station', 6.6018, 3.3515, 'Allen Avenue, Ikeja', 'Lagos', 'NG', ARRAY['essence', 'diesel', 'gaz'], ARRAY['carburant', 'lubrifiant', 'boutique'], '24h/24', true, 'Total', 620, 895, 350, 'libre'),
('Kiosque Mushin', 'kiosque', 6.5250, 3.3508, 'Quartier Mushin', 'Lagos', 'NG', ARRAY['essence'], ARRAY['essence bidon', 'kérosène'], '07h-19h', false, NULL, 700, NULL, NULL, 'moyen'),

-- Douala
('Total Akwa', 'station', 4.0483, 9.7043, 'Boulevard de la Liberté, Akwa', 'Douala', 'CM', ARRAY['essence', 'diesel'], ARRAY['carburant', 'boutique'], '06h-22h', false, 'Total', 630, 575, NULL, 'libre'),
('Tradex Bonabéri', 'station', 4.0833, 9.6833, 'Route de Bonabéri', 'Douala', 'CM', ARRAY['essence', 'diesel', 'gaz'], ARRAY['carburant', 'lavage', 'gaz domestique'], '06h-23h', false, 'Tradex', 625, 570, 350, 'moyen');
