export interface Location {
  latitude: number
  longitude: number
  address: string
  city: string
  state: string
  zipCode?: string
}

export interface ContactInfo {
  phone: string
  email?: string
  website?: string
}

export interface Facility {
  id: string
  name: string
  type: 'bhojanshala' | 'dharmashala' | 'gaushala' | 'clinic' | 'water' | 'parking' | 'washroom'
  description: string
  location: Location
  contact: ContactInfo
  image: string
  rating: number
  availability?: string
  operatingHours?: string
}

export interface Idol {
  name: string
  height?: string
  metal?: string
  year?: number
  details?: string
}

export interface Tirth {
  id: string
  name: string
  description: string
  architecture: string
  mythology?: string
  foundingDetails?: string
  direction?: string
  mainTemples?: string[]
  moolnayak: Idol[]
  poojaTimings: string
  darshanTimings: string
  events: EventItem[]
  location: Location
  contact?: ContactInfo
  images: string[]
  sect: 'Shwetambar' | 'Digambar'
  facilities: Facility[]
  rules?: string[]
  tirth_grouping?: string
  tirth_tags?: string[]
  specialFacts?: string[]
}

export interface EventItem {
  name: string
  date: string
  month: string
  description: string
  specialEvent?: string
}

export interface CustomerProfile {
  customer_id: string
  customer_email_id: string
  customer_first_name?: string
  customer_last_name?: string
  customer_mobile?: number
  customer_sect?: string
  created_at?: string
  updated_at?: string
}

export interface Room {
  id: string
  roomNumber: string
  type: 'single' | 'double' | 'dormitory' | 'suite'
  capacity: number
  price: number
  currency?: string
  amenities: string[]
  image?: string
  description?: string
  available: boolean
  maxGuests: number
  bedType: string
}

/** Room category types matching tirthlok.room_category_type enum */
export type RoomCategoryType = 'dormitory' | 'standard' | 'deluxe' | 'suite' | 'premium'

/** Availability status derived from inventory */
export type RoomAvailabilityStatus = 'available' | 'limited' | 'sold_out'

/**
 * RoomType — maps 1:1 to tirthlok.room_types table
 * Used for Supabase-backed room data on Dharamshala detail pages
 */
export interface RoomType {
  room_type_id: string
  dharamshala_id: string
  name: string
  room_category: RoomCategoryType
  description: string | null
  bed_configuration: string
  capacity: number
  max_guests: number
  base_price: number
  total_inventory: number
  amenities: string[]
  room_type_images: string[]
  is_available_ui: boolean
  created_at: string
  updated_at: string
}

/** Guest breakdown for booking */
export interface GuestBreakdown {
  adults: number
  children: number
  seniors: number
}

/** Pricing breakdown for a booking */
export interface PricingBreakdown {
  roomPrice: number
  nights: number
  subtotal: number
  tax: number
  serviceCharge: number
  discount: number
  grandTotal: number
}

export interface Booking {
  id: string
  roomId: string
  dharamshalaId: string
  guestName: string
  guestEmail: string
  guestPhone: string
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  guests?: GuestBreakdown
  totalPrice: number
  pricing?: PricingBreakdown
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'
  createdAt: string
  notes?: string
}

export interface Dharamshala {
  id: string
  /** UUID from tirthlok.dharamshala_details, used for room_types FK */
  dharamshalaUuid?: string
  name: string
  description?: string
  type: string
  rating: number
  reviews: number
  capacity?: number
  priceRange: string
  amenities?: string[]
  location: Location
  contact: ContactInfo
  images: string[]
  operatingHours?: string
  rules?: string[]
  rooms?: Room[]
  roomTypes?: RoomType[]
  dharamshala_grouping?: string | string[]
  dharamshala_tags?: string[]
  checkInTime?: string
  checkOutTime?: string
  languagesSpoken?: string[]
  nearbyAttractions?: string[]
  diningInfo?: string
  specialServices?: string[]
  paymentMethods?: string[]
  isFeatured?: boolean
  establishedYear?: number | null
}

export interface Bhojanshala {
  id: string
  name: string
  description?: string
  type: string
  rating: number
  reviews: number
  operatingHours: string
  priceRange: string
  cuisineTypes?: string[]
  dietaryOptions?: string[]
  location: Location
  contact: ContactInfo
  images: string[]
  speciality?: string
  vegetarianOnly?: boolean
}
