
-- =============================================
-- 1. PROFILES
-- =============================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name text,
  display_name text,
  username text UNIQUE,
  avatar_url text,
  is_verified boolean DEFAULT false,
  country text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. USER ROLES
-- =============================================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- 3. CONTENT CATEGORIES
-- =============================================
CREATE TABLE public.content_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  color text,
  is_active boolean DEFAULT true,
  order_index int DEFAULT 0,
  posts_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view categories" ON public.content_categories FOR SELECT USING (true);

-- =============================================
-- 4. POSTS & MEDIA
-- =============================================
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text,
  description text,
  content text,
  content_type text DEFAULT 'text',
  status text DEFAULT 'published',
  like_count int DEFAULT 0,
  likes_count int DEFAULT 0,
  view_count int DEFAULT 0,
  views_count int DEFAULT 0,
  comment_count int DEFAULT 0,
  comments_count int DEFAULT 0,
  share_count int DEFAULT 0,
  shares_count int DEFAULT 0,
  save_count int DEFAULT 0,
  is_monetized boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  price numeric DEFAULT 0,
  location text,
  category text,
  category_slug text,
  country text,
  country_code text,
  media_url text,
  media_type text,
  weekly_score numeric DEFAULT 0,
  trending_score numeric DEFAULT 0,
  is_news_article boolean DEFAULT false,
  challenge_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view published posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  url text NOT NULL,
  type text,
  file_path text,
  mime_type text,
  thumbnail_url text,
  thumbnail_path text,
  duration numeric,
  created_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view media" ON public.media_files FOR SELECT USING (true);
CREATE POLICY "Users can insert media" ON public.media_files FOR INSERT WITH CHECK (true);

-- =============================================
-- 5. WEEKLY RANKINGS
-- =============================================
CREATE TABLE public.weekly_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  country_code text,
  category text,
  category_slug text,
  week_start timestamptz NOT NULL,
  week_end timestamptz,
  rank int,
  rank_position int,
  score numeric DEFAULT 0,
  total_score numeric DEFAULT 0,
  total_views int DEFAULT 0,
  total_likes int DEFAULT 0,
  total_posts int DEFAULT 0,
  trend text,
  previous_rank int,
  change_count int DEFAULT 0,
  title text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view rankings" ON public.weekly_rankings FOR SELECT USING (true);

-- =============================================
-- 6. DAILY NEWS
-- =============================================
CREATE TABLE public.daily_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  category text,
  category_slug text,
  country text,
  country_codes text[],
  source text,
  source_url text,
  image_url text,
  is_featured boolean DEFAULT false,
  is_breaking boolean DEFAULT false,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view news" ON public.daily_news FOR SELECT USING (true);

-- =============================================
-- 7. CHALLENGES
-- =============================================
CREATE TABLE public.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  prize text,
  category_slug text,
  challenge_type text,
  start_date timestamptz,
  end_date timestamptz,
  reward_points int DEFAULT 0,
  reward_title text,
  max_participants int,
  participants_count int DEFAULT 0,
  current_participants int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view challenges" ON public.challenges FOR SELECT USING (true);

-- =============================================
-- 8. PRODUCTS & MARKETPLACE
-- =============================================
CREATE TABLE public.seller_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  store_name text NOT NULL,
  description text,
  logo_url text,
  banner_url text,
  country text,
  city text,
  phone text,
  is_verified boolean DEFAULT false,
  total_sales int DEFAULT 0,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view sellers" ON public.seller_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own seller profile" ON public.seller_profiles FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'XOF',
  country text,
  images text[] DEFAULT '{}',
  stock int DEFAULT 0,
  category text,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  views_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Sellers can manage own products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.seller_profiles sp WHERE sp.id = seller_id AND sp.user_id = auth.uid())
);

CREATE TABLE public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view reviews" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 9. CART & ORDERS
-- =============================================
CREATE TABLE public.carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Users can manage own cart" ON public.carts FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity int DEFAULT 1,
  price_snapshot numeric NOT NULL,
  currency_snapshot text DEFAULT 'XOF',
  added_at timestamptz DEFAULT now()
);

CREATE POLICY "Users can manage own cart items" ON public.cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_id AND c.user_id = auth.uid())
);

CREATE TABLE public.shipping_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text,
  postal_code text,
  country text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Users can manage own addresses" ON public.shipping_addresses FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number text UNIQUE NOT NULL DEFAULT 'ORD-' || substr(gen_random_uuid()::text, 1, 8),
  status text DEFAULT 'pending',
  subtotal numeric DEFAULT 0,
  shipping_fee numeric DEFAULT 0,
  total numeric DEFAULT 0,
  currency text DEFAULT 'XOF',
  payment_method text,
  payment_status text DEFAULT 'pending',
  shipping_address_id uuid REFERENCES public.shipping_addresses(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) NOT NULL,
  quantity int NOT NULL,
  price numeric NOT NULL,
  currency text DEFAULT 'XOF',
  created_at timestamptz DEFAULT now()
);

CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
CREATE POLICY "Users can insert order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

-- =============================================
-- 10. JOBS & RECRUITMENT
-- =============================================
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  company text,
  description text,
  requirements text,
  location text,
  job_type text DEFAULT 'full-time',
  category text,
  salary_min numeric,
  salary_max numeric,
  currency text DEFAULT 'XOF',
  experience_level text,
  is_remote boolean DEFAULT false,
  is_active boolean DEFAULT true,
  applicants_count int DEFAULT 0,
  views_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view active jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Users can create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cover_letter text,
  resume_url text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, user_id)
);

CREATE POLICY "Users can view own applications" ON public.job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Recruiters can view applications for their jobs" ON public.job_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = job_id AND j.user_id = auth.uid())
);
CREATE POLICY "Users can create applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON public.job_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Recruiters can update applications" ON public.job_applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = job_id AND j.user_id = auth.uid())
);

CREATE TABLE public.job_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE(job_id, user_id)
);

CREATE POLICY "Users can manage own job views" ON public.job_views FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.user_job_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  preferred_categories text[] DEFAULT '{}',
  preferred_locations text[] DEFAULT '{}',
  preferred_job_types text[] DEFAULT '{}',
  min_salary numeric DEFAULT 0,
  experience_level text,
  remote_only boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Users can manage own preferences" ON public.user_job_preferences FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_url text NOT NULL,
  file_name text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE POLICY "Users can manage own resumes" ON public.resumes FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 11. TRANSPORT: DRIVERS, VEHICLES, RIDES, RENTALS
-- =============================================
CREATE TABLE public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone text,
  email text,
  photo_url text,
  id_card_url text,
  driving_license_url text,
  status text DEFAULT 'offline',
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT false,
  total_rides int DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  average_rating numeric DEFAULT 0,
  total_reviews int DEFAULT 0,
  current_lat double precision,
  current_lng double precision,
  last_location_update timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view active drivers" ON public.drivers FOR SELECT USING (true);
CREATE POLICY "Users can manage own driver profile" ON public.drivers FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES public.drivers(id) ON DELETE CASCADE NOT NULL,
  vehicle_type text NOT NULL,
  brand text,
  model text,
  year int,
  color text,
  plate_number text,
  registration_card_url text,
  insurance_url text,
  photo_url text,
  seats int DEFAULT 4,
  luggage_capacity int DEFAULT 2,
  has_ac boolean DEFAULT false,
  cargo_volume_m3 numeric,
  max_weight_kg numeric,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Drivers can manage own vehicles" ON public.vehicles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = driver_id AND d.user_id = auth.uid())
);

CREATE TABLE public.rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_number text UNIQUE NOT NULL DEFAULT 'RIDE-' || substr(gen_random_uuid()::text, 1, 8),
  customer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  driver_id uuid REFERENCES public.drivers(id),
  vehicle_id uuid REFERENCES public.vehicles(id),
  service_type text NOT NULL,
  pickup_address text NOT NULL,
  pickup_lat double precision NOT NULL,
  pickup_lng double precision NOT NULL,
  dropoff_address text NOT NULL,
  dropoff_lat double precision NOT NULL,
  dropoff_lng double precision NOT NULL,
  distance_km numeric,
  estimated_duration_min int,
  actual_duration_min int,
  estimated_price numeric NOT NULL,
  final_price numeric,
  currency text DEFAULT 'XOF',
  status text DEFAULT 'pending',
  payment_method text DEFAULT 'cash',
  payment_status text DEFAULT 'pending',
  has_helmet boolean DEFAULT false,
  needs_loading_help boolean DEFAULT false,
  notes text,
  requested_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Users can view own rides" ON public.rides FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Drivers can view assigned rides" ON public.rides FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = driver_id AND d.user_id = auth.uid())
);
CREATE POLICY "Users can create rides" ON public.rides FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users and drivers can update rides" ON public.rides FOR UPDATE USING (
  auth.uid() = customer_id OR
  EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = driver_id AND d.user_id = auth.uid())
);

CREATE TABLE public.ride_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES public.rides(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE POLICY "Ride participants can view messages" ON public.ride_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.rides r WHERE r.id = ride_id AND (r.customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = r.driver_id AND d.user_id = auth.uid())))
);
CREATE POLICY "Ride participants can send messages" ON public.ride_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE TABLE public.ride_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES public.rides(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  driver_id uuid REFERENCES public.drivers(id) NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view reviews" ON public.ride_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.ride_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE TABLE public.rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_number text UNIQUE NOT NULL DEFAULT 'RNT-' || substr(gen_random_uuid()::text, 1, 8),
  customer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) NOT NULL,
  driver_id uuid REFERENCES public.drivers(id),
  with_driver boolean DEFAULT false,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  actual_return_date timestamptz,
  pickup_address text,
  return_address text,
  daily_rate numeric NOT NULL,
  driver_daily_rate numeric DEFAULT 0,
  total_days int NOT NULL,
  subtotal numeric NOT NULL,
  deposit numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  currency text DEFAULT 'XOF',
  status text DEFAULT 'pending',
  payment_method text DEFAULT 'cash',
  payment_status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Users can view own rentals" ON public.rentals FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Users can create rentals" ON public.rentals FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can update own rentals" ON public.rentals FOR UPDATE USING (auth.uid() = customer_id);

-- =============================================
-- 12. STATIONS
-- =============================================
CREATE TABLE public.stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text DEFAULT 'fuel',
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  address text,
  city text,
  country text,
  fuel_types text[] DEFAULT '{}',
  products text[] DEFAULT '{}',
  opening_hours text,
  is_24h boolean DEFAULT false,
  is_open boolean DEFAULT true,
  phone text,
  brand text,
  price_essence numeric,
  price_diesel numeric,
  price_gaz numeric,
  current_status text DEFAULT 'libre',
  total_reports int DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view stations" ON public.stations FOR SELECT USING (true);

CREATE TABLE public.station_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id uuid REFERENCES public.stations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL,
  wait_time_min int,
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view reports" ON public.station_reports FOR SELECT USING (true);
CREATE POLICY "Users can create reports" ON public.station_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 13. TABASKI RESERVATIONS
-- =============================================
CREATE TABLE public.tabaski_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  animal_type text NOT NULL,
  animal_name text,
  breed text,
  weight text,
  price numeric NOT NULL,
  seller_name text,
  seller_phone text,
  location text,
  delivery_address text,
  delivery_date timestamptz,
  status text DEFAULT 'pending',
  payment_method text,
  payment_status text DEFAULT 'pending',
  deposit_amount numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Users can view own reservations" ON public.tabaski_reservations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reservations" ON public.tabaski_reservations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reservations" ON public.tabaski_reservations FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 14. WALLPAPERS
-- =============================================
CREATE TABLE public.wallpaper_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  color text,
  wallpaper_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view wallpaper categories" ON public.wallpaper_categories FOR SELECT USING (true);

CREATE TABLE public.wallpapers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  thumbnail_url text,
  category_id uuid REFERENCES public.wallpaper_categories(id),
  media_type text DEFAULT 'image',
  width int,
  height int,
  file_size bigint,
  download_count int DEFAULT 0,
  view_count int DEFAULT 0,
  is_featured boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE POLICY "Anyone can view wallpapers" ON public.wallpapers FOR SELECT USING (true);
CREATE POLICY "Users can upload wallpapers" ON public.wallpapers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own wallpapers" ON public.wallpapers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wallpapers" ON public.wallpapers FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.wallpaper_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallpaper_id uuid REFERENCES public.wallpapers(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, wallpaper_id)
);

CREATE POLICY "Users can manage own favorites" ON public.wallpaper_favorites FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 15. MESSAGING
-- =============================================
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text DEFAULT 'private',
  name text,
  description text,
  avatar_url text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.conversations REPLICA IDENTITY FULL;

CREATE TABLE public.conversation_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz,
  is_muted boolean DEFAULT false,
  UNIQUE(conversation_id, user_id)
);

CREATE POLICY "Members can view conversations" ON public.conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_members cm WHERE cm.conversation_id = id AND cm.user_id = auth.uid())
);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Members can update conversations" ON public.conversations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.conversation_members cm WHERE cm.conversation_id = id AND cm.user_id = auth.uid())
);

CREATE POLICY "Members can view members" ON public.conversation_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_members cm WHERE cm.conversation_id = conversation_id AND cm.user_id = auth.uid())
);
CREATE POLICY "Users can join conversations" ON public.conversation_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Members can update own membership" ON public.conversation_members FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text,
  message_type text DEFAULT 'text',
  file_url text,
  file_name text,
  file_size bigint,
  duration_sec int,
  reply_to_id uuid REFERENCES public.messages(id),
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.messages REPLICA IDENTITY FULL;

CREATE POLICY "Members can view messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_members cm WHERE cm.conversation_id = conversation_id AND cm.user_id = auth.uid())
);
CREATE POLICY "Members can send messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (SELECT 1 FROM public.conversation_members cm WHERE cm.conversation_id = conversation_id AND cm.user_id = auth.uid())
);
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id);

CREATE TABLE public.message_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  read_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id)
);

CREATE POLICY "Members can view reads" ON public.message_reads FOR SELECT USING (true);
CREATE POLICY "Users can mark as read" ON public.message_reads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update conversation last_message on new message
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.conversations
  SET last_message = NEW.content,
      last_message_at = NEW.created_at,
      updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();

-- =============================================
-- 16. ENABLE REALTIME
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rides;
ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;

-- =============================================
-- 17. SEED WALLPAPER CATEGORIES
-- =============================================
INSERT INTO public.wallpaper_categories (name, slug, icon, color) VALUES
  ('Nature', 'nature', '🌿', '#22c55e'),
  ('Espace', 'espace', '🚀', '#6366f1'),
  ('Anime', 'anime', '🎌', '#ec4899'),
  ('Sport', 'sport', '⚽', '#f59e0b'),
  ('Voitures', 'voitures', '🏎️', '#ef4444'),
  ('Gaming', 'gaming', '🎮', '#8b5cf6'),
  ('Animaux', 'animaux', '🐾', '#14b8a6'),
  ('Architecture', 'architecture', '🏛️', '#64748b'),
  ('Art', 'art', '🎨', '#f43f5e'),
  ('Musique', 'musique', '🎵', '#a855f7'),
  ('Films', 'films', '🎬', '#0ea5e9'),
  ('Technologie', 'technologie', '💻', '#06b6d4'),
  ('Voyage', 'voyage', '✈️', '#10b981'),
  ('Nourriture', 'nourriture', '🍔', '#f97316'),
  ('Abstrait', 'abstrait', '🔮', '#7c3aed'),
  ('Afrique', 'afrique', '🌍', '#eab308');
