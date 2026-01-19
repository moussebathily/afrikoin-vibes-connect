// Types pour le module Transport & Location

export type VehicleType = 'moto' | 'taxi' | 'utility' | 'rental';
export type RideStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
export type DriverStatus = 'offline' | 'available' | 'busy';
export type RentalStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Driver {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email?: string;
  photo_url?: string;
  id_card_url?: string;
  driving_license_url?: string;
  status: DriverStatus;
  is_verified: boolean;
  is_active: boolean;
  total_rides: number;
  total_earnings: number;
  average_rating: number;
  total_reviews: number;
  current_lat?: number;
  current_lng?: number;
  last_location_update?: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  driver_id: string;
  vehicle_type: VehicleType;
  brand: string;
  model: string;
  year?: number;
  color?: string;
  plate_number: string;
  registration_card_url?: string;
  insurance_url?: string;
  photo_url?: string;
  seats: number;
  luggage_capacity: number;
  has_ac: boolean;
  cargo_volume_m3?: number;
  max_weight_kg?: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  driver?: Driver;
}

export interface Ride {
  id: string;
  ride_number: string;
  customer_id: string;
  driver_id?: string;
  vehicle_id?: string;
  service_type: VehicleType;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_address: string;
  dropoff_lat: number;
  dropoff_lng: number;
  distance_km?: number;
  estimated_duration_min?: number;
  actual_duration_min?: number;
  estimated_price: number;
  final_price?: number;
  currency: string;
  status: RideStatus;
  payment_method: string;
  payment_status: string;
  has_helmet: boolean;
  needs_loading_help: boolean;
  notes?: string;
  requested_at: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  driver?: Driver;
  vehicle?: Vehicle;
}

export interface Rental {
  id: string;
  rental_number: string;
  customer_id: string;
  vehicle_id: string;
  driver_id?: string;
  with_driver: boolean;
  start_date: string;
  end_date: string;
  actual_return_date?: string;
  pickup_address: string;
  return_address?: string;
  daily_rate: number;
  driver_daily_rate: number;
  total_days: number;
  subtotal: number;
  deposit: number;
  total_amount: number;
  currency: string;
  status: RentalStatus;
  payment_method: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
  driver?: Driver;
}

export interface RideReview {
  id: string;
  ride_id: string;
  reviewer_id: string;
  driver_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ServiceOption {
  type: VehicleType;
  name: string;
  description: string;
  icon: string;
  basePrice: number;
  pricePerKm: number;
  color: string;
}

export interface LocationPoint {
  address: string;
  lat: number;
  lng: number;
}
