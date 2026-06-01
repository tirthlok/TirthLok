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
}

export interface EventItem {
  name: string
  date: string
  month: string
  description: string
  specialEvent?: string
}

export interface User {
  id: string
  email: string
  name: string
  favorites: string[] // Tirth IDs
  profile?: {
    bio?: string
    avatar?: string
    sect?: 'Shwetambar' | 'Digambar'
  }
}

export interface AdminUser extends User {
  role: 'admin' | 'editor'
  permissions: string[]
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
  totalPrice: number
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'
  createdAt: string
  notes?: string
}

export interface Dharamshala {
  id: string
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
  dharamshala_grouping?: string | string[]
  dharamshala_tags?: string[]
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
