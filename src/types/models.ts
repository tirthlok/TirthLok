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

export interface DharamshalStay {
  id: string
  dharamshalaId: string
  dharamshalaName: string
  userId: string
  checkInDate: string
  checkOutDate: string
  checkOutTime?: string
  status: 'active' | 'completed' | 'cancelled'
  ratingSubmitted: boolean
  rating?: number
  feedback?: string
}

export interface UserStay {
  stays: DharamshalStay[]
}

export interface Room {
  id: string
  dharamshalaId: string
  roomNumber: string
  roomType: 'single' | 'double' | 'dorm' | 'family'
  capacity: number
  price: number
  pricePerNight: number
  amenities: string[]
  images: string[]
  description?: string
  totalRooms: number
  availableRooms: number
}

export interface RoomBooking {
  id: string
  roomId: string
  dharamshalaId: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  numberOfNights: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'checkedIn' | 'checkedOut' | 'cancelled'
  bookingDate: string
  notes?: string
}

export interface DharamshalRoom {
  dharamshalaId: string
  rooms: Room[]
}
