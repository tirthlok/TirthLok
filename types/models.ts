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
