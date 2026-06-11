// ── Tirth ─────────────────────────────────────────────────────

export interface TirthCard {
  tirth_id:            string
  tirth_name:          string
  tirth_city:          string
  tirth_state:         string
  tirth_country:       string
  tirth_type:          string | null
  tirth_sect:          string | null
  tirth_images:        TirthImage[]
  tirth_address:       string | null
  tirth_phone:         string | null
  tirth_email:         string | null
  tirth_website:       string | null
  tags:                string[]
  is_active:           boolean
  created_at:          string
  updated_at:          string
}

export interface TirthDetails {
  tirth_id:            string
  historical_background: string | null
  founding_details:    string | null
  architecture:        string | null
  mul_nayak:           MulNayak[]
  special_facts:       string[]
}

export interface TirthImage {
  url:     string
  alt?:    string
  order?:  number
}

export interface MulNayak {
  name:        string
  description?: string
  image_url?:  string
}

export interface TirthEvent {
  event_id:    string
  tirth_id:    string
  event_name:  string
  event_date:  string | null
  recurrence:  string | null
  description: string | null
}

// ── Dharamshala ───────────────────────────────────────────────

export interface DharamshalaCard {
  dharamshala_id:      string
  tirth_id:            string | null
  dharamshala_name:    string
  dharamshala_city:    string
  dharamshala_state:   string
  dharamshala_address: string | null
  dharamshala_phone:   string | null
  dharamshala_email:   string | null
  dharamshala_images:  DharamshalaImage[]
  tags:                string[]
  is_active:           boolean
  created_at:          string
  updated_at:          string
}

export interface DharamshalaDetails {
  dharamshala_id:         string
  about:                  string | null
  rules:                  string[]
  dharamshala_amenities:  string[]
  dharamshala_price_range: string | null
  dharamshala_phone:      string | null
  dharamshala_email:      string | null
  dharamshala_location:   string | null
  check_in_time:          string | null
  check_out_time:         string | null
  languages_spoken:       string[]
  nearby_attractions:     string[]
  dining_info:            string | null
  special_services:       string[]
  payment_methods:        string[]
}

export interface DharamshalaImage {
  url:    string
  alt?:   string
  order?: number
}

// ── Room ─────────────────────────────────────────────────────

export interface RoomType {
  room_type_id:        string
  dharamshala_id:      string
  name:                string
  room_category:       string
  description:         string | null
  bed_configuration:   string | null
  capacity:            number
  max_guests:          number
  max_children:        number
  base_price:          number
  discount_price:      number | null
  total_inventory:     number
  amenities:           string[]
  room_type_images:    RoomImage[]
  is_available_ui:     boolean
  is_active:           boolean
  created_at:          string
  updated_at:          string
}

export interface RoomImage {
  url:    string
  alt?:   string
  order?: number
}

// ── Bhojanshala ───────────────────────────────────────────────

export interface BhojanshalaCard {
  bhojanshala_id:      string
  tirth_id:            string | null
  bhojanshala_name:    string
  bhojanshala_city:    string
  bhojanshala_state:   string
  bhojanshala_address: string | null
  bhojanshala_phone:   string | null
  bhojanshala_email:   string | null
  bhojanshala_images:  BhojanshalaImage[]
  bhojanshala_type:    'free' | 'paid' | 'donation'
  tags:                string[]
  is_active:           boolean
  created_at:          string
  updated_at:          string
}

export interface BhojanshalaDetails {
  bhojanshala_id:   string
  about:            string | null
  meal_timings:     MealTiming[]
  facilities:       string[]
  dietary_info:     string
  rules:            string[]
  special_services: string[]
  seating_capacity: number | null
  languages_spoken: string[]
  payment_info:     string | null
  manager_name:     string | null
  manager_phone:    string | null
}

export interface MealTiming {
  meal_type:   'breakfast' | 'lunch' | 'dinner' | 'snacks'
  start_time:  string
  end_time:    string
  description?: string
}

export interface BhojanshalaImage {
  url:    string
  alt?:   string
  order?: number
}

// ── Booking ───────────────────────────────────────────────────

export interface Booking {
  booking_id:           string
  user_id:              string
  dharamshala_id:       string
  room_type_id:         string
  rooms_count:          number
  check_in_date:        string
  check_out_date:       string
  total_amount:         number
  status:               BookingStatus
  guest_name:           string
  guest_email:          string
  guest_phone:          string
  adults_count:         number
  children_count:       number
  special_requests:     string | null
  invoice_number:       string | null
  cancelled_at:         string | null
  cancellation_reason:  string | null
  refund_amount:        number | null
  created_at:           string
  updated_at:           string
}

export type BookingStatus =
  | 'initiated'
  | 'pending_payment'
  | 'awaiting_payment'
  | 'confirmed'
  | 'failed'
  | 'cancelled'
  | 'checked_in'
  | 'checked_out'
  | 'refunded'

// ── Manager ───────────────────────────────────────────────────

export interface ManagerProfile {
  manager_id:              string
  full_name:               string
  phone:                   string | null
  manager_type:            'tirth' | 'dharamshala' | 'both'
  assigned_tirth_id:       string | null
  assigned_dharamshala_id: string | null
  is_active:               boolean
  created_at:              string
}

// ── Customer ──────────────────────────────────────────────────

export interface CustomerProfile {
  customer_id:         string
  customer_first_name: string | null
  customer_last_name:  string | null
  customer_mobile:     string | null
  customer_sect:       string | null
  created_at:          string
  updated_at:          string
}

// ── Wishlist ──────────────────────────────────────────────────

export interface WishlistItem {
  wishlist_id:     string
  user_id:         string
  entity_type:     'tirth' | 'dharamshala' | 'bhojanshala'
  tirth_id:        string | null
  dharamshala_id:  string | null
  bhojanshala_id:  string | null
  created_at:      string
}

// ── Invoice ───────────────────────────────────────────────────

export interface Invoice {
  invoice_id:      string
  booking_id:      string
  user_id:         string
  invoice_number:  string
  amount:          number
  tax_amount:      number
  total_amount:    number
  issued_at:       string
}
