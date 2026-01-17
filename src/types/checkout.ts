// Checkout and order types

export interface ShippingAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type PaymentMethod = 'mobile_money' | 'cash_on_delivery' | 'stripe';

export type MobileMoneyProvider = 'orange_money' | 'mtn_momo' | 'wave';

export interface CheckoutData {
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  mobile_money_provider?: MobileMoneyProvider;
  notes?: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping_fee: number;
  total: number;
  currency: string;
  items_count: number;
}
