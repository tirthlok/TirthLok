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
  historicalBackground: string
  foundingYear: number
  foundingDetails: string
  pratisthaYear: number
  acharya: string
  architecture: string
  moolnayak: Idol[]
  specialFacts: string[]
  poojaTimings: string
  darshanTimings: string
  festivals: Festival[]
  location: Location
  images: string[]
  sect: 'Shwetambar' | 'Digambar'
  type: 'Gyan-sthan' | 'Siddhakshetra' | 'Atishay-Kshetra' | 'Other'
  facilities: Facility[]
  rating: number
  reviews: number
  travelDuration?: string
  rules?: string[]
  tirth_grouping?: string // e.g., 'popular', 'newly-added', 'most-visited', 'hidden-gems'
  tirth_tags?: string[] // e.g., ['featured', 'seasonal', 'architectural-wonder']
}

export interface Festival {
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
