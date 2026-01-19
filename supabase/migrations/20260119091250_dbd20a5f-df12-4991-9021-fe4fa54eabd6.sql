-- ===========================================
-- MODULE TRANSPORT & LOCATION - AFRIKOIN
-- ===========================================

-- Types ENUM pour les services
CREATE TYPE public.vehicle_type AS ENUM ('moto', 'taxi', 'utility', 'rental');
CREATE TYPE public.ride_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.driver_status AS ENUM ('offline', 'available', 'busy');
CREATE TYPE public.rental_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled');

-- ===========================================
-- TABLE: drivers (Chauffeurs)
-- ===========================================
CREATE TABLE public.drivers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    photo_url TEXT,
    id_card_url TEXT,
    driving_license_url TEXT,
    status driver_status DEFAULT 'offline',
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    total_rides INTEGER DEFAULT 0,
    total_earnings NUMERIC DEFAULT 0,
    average_rating NUMERIC DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    current_lat NUMERIC,
    current_lng NUMERIC,
    last_location_update TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===========================================
-- TABLE: vehicles (Véhicules)
-- ===========================================
CREATE TABLE public.vehicles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    color TEXT,
    plate_number TEXT NOT NULL,
    registration_card_url TEXT,
    insurance_url TEXT,
    photo_url TEXT,
    seats INTEGER DEFAULT 4,
    luggage_capacity INTEGER DEFAULT 2,
    has_ac BOOLEAN DEFAULT false,
    cargo_volume_m3 NUMERIC,
    max_weight_kg NUMERIC,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===========================================
-- TABLE: rides (Courses)
-- ===========================================
CREATE TABLE public.rides (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ride_number TEXT NOT NULL UNIQUE,
    customer_id UUID NOT NULL,
    driver_id UUID REFERENCES public.drivers(id),
    vehicle_id UUID REFERENCES public.vehicles(id),
    service_type vehicle_type NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_lat NUMERIC NOT NULL,
    pickup_lng NUMERIC NOT NULL,
    dropoff_address TEXT NOT NULL,
    dropoff_lat NUMERIC NOT NULL,
    dropoff_lng NUMERIC NOT NULL,
    distance_km NUMERIC,
    estimated_duration_min INTEGER,
    actual_duration_min INTEGER,
    estimated_price NUMERIC NOT NULL,
    final_price NUMERIC,
    currency TEXT DEFAULT 'XOF',
    status ride_status DEFAULT 'pending',
    payment_method TEXT DEFAULT 'cash',
    payment_status TEXT DEFAULT 'pending',
    has_helmet BOOLEAN DEFAULT false,
    needs_loading_help BOOLEAN DEFAULT false,
    notes TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===========================================
-- TABLE: rentals (Locations de véhicules)
-- ===========================================
CREATE TABLE public.rentals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    rental_number TEXT NOT NULL UNIQUE,
    customer_id UUID NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
    driver_id UUID REFERENCES public.drivers(id),
    with_driver BOOLEAN DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_return_date TIMESTAMP WITH TIME ZONE,
    pickup_address TEXT NOT NULL,
    return_address TEXT,
    daily_rate NUMERIC NOT NULL,
    driver_daily_rate NUMERIC DEFAULT 0,
    total_days INTEGER NOT NULL,
    subtotal NUMERIC NOT NULL,
    deposit NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'XOF',
    status rental_status DEFAULT 'pending',
    payment_method TEXT DEFAULT 'cash',
    payment_status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===========================================
-- TABLE: ride_reviews (Avis sur les courses)
-- ===========================================
CREATE TABLE public.ride_reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID NOT NULL,
    driver_id UUID REFERENCES public.drivers(id) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===========================================
-- TABLE: driver_documents (Documents chauffeur)
-- ===========================================
CREATE TABLE public.driver_documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL,
    document_url TEXT NOT NULL,
    expiry_date DATE,
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===========================================
-- INDEXES
-- ===========================================
CREATE INDEX idx_drivers_user_id ON public.drivers(user_id);
CREATE INDEX idx_drivers_status ON public.drivers(status);
CREATE INDEX idx_drivers_location ON public.drivers(current_lat, current_lng);
CREATE INDEX idx_vehicles_driver_id ON public.vehicles(driver_id);
CREATE INDEX idx_vehicles_type ON public.vehicles(vehicle_type);
CREATE INDEX idx_rides_customer_id ON public.rides(customer_id);
CREATE INDEX idx_rides_driver_id ON public.rides(driver_id);
CREATE INDEX idx_rides_status ON public.rides(status);
CREATE INDEX idx_rentals_customer_id ON public.rentals(customer_id);
CREATE INDEX idx_rentals_vehicle_id ON public.rentals(vehicle_id);
CREATE INDEX idx_rentals_status ON public.rentals(status);

-- ===========================================
-- TRIGGERS pour updated_at
-- ===========================================
CREATE TRIGGER update_drivers_updated_at
    BEFORE UPDATE ON public.drivers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rides_updated_at
    BEFORE UPDATE ON public.rides
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rentals_updated_at
    BEFORE UPDATE ON public.rentals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Générer numéro de course
CREATE OR REPLACE FUNCTION public.generate_ride_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.ride_number := 'RIDE-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(NEW.id::TEXT, 1, 8));
    RETURN NEW;
END;
$$;

CREATE TRIGGER generate_ride_number_trigger
    BEFORE INSERT ON public.rides
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_ride_number();

-- Générer numéro de location
CREATE OR REPLACE FUNCTION public.generate_rental_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.rental_number := 'RENT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(NEW.id::TEXT, 1, 8));
    RETURN NEW;
END;
$$;

CREATE TRIGGER generate_rental_number_trigger
    BEFORE INSERT ON public.rentals
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_rental_number();

-- Mettre à jour les stats du chauffeur après un avis
CREATE OR REPLACE FUNCTION public.update_driver_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.drivers SET
        average_rating = (SELECT COALESCE(AVG(rating), 0) FROM public.ride_reviews WHERE driver_id = COALESCE(NEW.driver_id, OLD.driver_id)),
        total_reviews = (SELECT COUNT(*) FROM public.ride_reviews WHERE driver_id = COALESCE(NEW.driver_id, OLD.driver_id))
    WHERE id = COALESCE(NEW.driver_id, OLD.driver_id);
    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER update_driver_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.ride_reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_driver_rating();

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

-- Drivers
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers are viewable by everyone"
    ON public.drivers FOR SELECT
    USING (is_active = true);

CREATE POLICY "Users can create own driver profile"
    ON public.drivers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own driver profile"
    ON public.drivers FOR UPDATE
    USING (auth.uid() = user_id);

-- Vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vehicles are viewable by everyone"
    ON public.vehicles FOR SELECT
    USING (is_active = true);

CREATE POLICY "Drivers can insert own vehicles"
    ON public.vehicles FOR INSERT
    WITH CHECK (driver_id IN (
        SELECT id FROM public.drivers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Drivers can update own vehicles"
    ON public.vehicles FOR UPDATE
    USING (driver_id IN (
        SELECT id FROM public.drivers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Drivers can delete own vehicles"
    ON public.vehicles FOR DELETE
    USING (driver_id IN (
        SELECT id FROM public.drivers WHERE user_id = auth.uid()
    ));

-- Rides
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own rides"
    ON public.rides FOR SELECT
    USING (auth.uid() = customer_id);

CREATE POLICY "Drivers can view assigned rides"
    ON public.rides FOR SELECT
    USING (driver_id IN (
        SELECT id FROM public.drivers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Pending rides viewable by available drivers"
    ON public.rides FOR SELECT
    USING (status = 'pending' AND EXISTS (
        SELECT 1 FROM public.drivers WHERE user_id = auth.uid() AND status = 'available'
    ));

CREATE POLICY "Customers can create rides"
    ON public.rides FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Drivers can update assigned rides"
    ON public.rides FOR UPDATE
    USING (driver_id IN (
        SELECT id FROM public.drivers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Customers can update own rides"
    ON public.rides FOR UPDATE
    USING (auth.uid() = customer_id);

-- Rentals
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own rentals"
    ON public.rentals FOR SELECT
    USING (auth.uid() = customer_id);

CREATE POLICY "Drivers can view assigned rentals"
    ON public.rentals FOR SELECT
    USING (driver_id IN (
        SELECT id FROM public.drivers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Customers can create rentals"
    ON public.rentals FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own rentals"
    ON public.rentals FOR UPDATE
    USING (auth.uid() = customer_id);

-- Ride Reviews
ALTER TABLE public.ride_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
    ON public.ride_reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews for their rides"
    ON public.ride_reviews FOR INSERT
    WITH CHECK (auth.uid() = reviewer_id);

-- Driver Documents
ALTER TABLE public.driver_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can view own documents"
    ON public.driver_documents FOR SELECT
    USING (driver_id IN (
        SELECT id FROM public.drivers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Drivers can insert own documents"
    ON public.driver_documents FOR INSERT
    WITH CHECK (driver_id IN (
        SELECT id FROM public.drivers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Drivers can update own documents"
    ON public.driver_documents FOR UPDATE
    USING (driver_id IN (
        SELECT id FROM public.drivers WHERE user_id = auth.uid()
    ));