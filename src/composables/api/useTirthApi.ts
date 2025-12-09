/**
 * useTirthApi Composable
 * Tirth-specific API endpoints
 */

import type { Tirth } from '~/types/models'

export const useTirthApi = () => {

  interface TirthApiResponse {
    success: boolean
    data: any[]
    pagination: {
      total: number
      page: number
      pages: number
    }
  }

  /**
   * Transform API response to Tirth model (for list pages)
   */
  const transformTirthData = (raw: any): Tirth => ({
    id: String(raw.tirth_id),
    name: raw.tirth_name,
    location: {
      city: raw.city,
      state: raw.state,
      address: raw.address || '',
      latitude: raw.latitude || 0,
      longitude: raw.longitude || 0,
    },
    sect: raw.sect === 'Digambar' ? 'Digambar' : 'Shwetambar',
    type: raw.kshetra || 'Gyan-sthan',
    description: raw.description || '',
    historicalBackground: '',
    foundingYear: 0,
    foundingDetails: '',
    pratisthaYear: 0,
    acharya: '',
    architecture: '',
    moolnayak: [],
    specialFacts: [],
    poojaTimings: '',
    darshanTimings: '',
    festivals: raw.festivals || [],
    images: raw.images || [],
    rating: raw.rating || 0,
    reviews: 0,
    facilities: raw.facilities || [],
  })

  /**
   * Transform detailed API response to Tirth model (for detail pages)
   * Handles the new response format with details array
   */
  const transformTirthDetailData = (raw: any): Tirth => {
    const details = raw.details && raw.details.length > 0 ? raw.details[0] : {}
    
    // Parse mul_nayak JSON string if it exists
    let moolnayakArray: any[] = []
    let acharya = ''
    
    if (details.mul_nayak) {
      try {
        const mulNayakData = typeof details.mul_nayak === 'string' 
          ? JSON.parse(details.mul_nayak) 
          : details.mul_nayak
        
        if (mulNayakData) {
          moolnayakArray = [{
            name: mulNayakData.name || '',
            height: mulNayakData.height || '',
            metal: mulNayakData.metal || '',
            year: mulNayakData.year ? parseInt(mulNayakData.year) : undefined,
          }]
          acharya = mulNayakData.name || ''
        }
      } catch (e) {
        // Fallback if JSON parsing fails
        acharya = String(details.mul_nayak)
        moolnayakArray = [{ name: acharya }]
      }
    }
    
    return {
      id: String(raw.tirth_id),
      name: raw.tirth_name,
      location: {
        city: raw.city,
        state: raw.state,
        address: raw.address || '',
        latitude: raw.latitude || 0,
        longitude: raw.longitude || 0,
      },
      sect: raw.sect === 'Digambar' ? 'Digambar' : 'Shwetambar',
      type: raw.kshetra || 'Gyan-sthan',
      description: raw.description || '',
      historicalBackground: details.historical_background || '',
      foundingYear: 0,
      foundingDetails: details.founding_details || '',
      pratisthaYear: 0,
      acharya: acharya,
      architecture: details.architecture || '',
      moolnayak: moolnayakArray,
      specialFacts: details.special_facts ? [details.special_facts] : [],
      poojaTimings: details.events || '',
      darshanTimings: details.events || '',
      festivals: details.festival ? [{ name: details.festival, date: '', month: '', description: '' }] : raw.festivals || [],
      images: raw.images || [],
      rating: raw.rating || 0,
      reviews: 0,
      facilities: raw.facilities || [],
    }
  }

  /**
   * Fetch all tirth locations with pagination
   * Calls server-side endpoint which in turn calls backend
   */
  const fetchTirths = async (page = 1, limit = 10, filters?: { search?: string; sect?: string; type?: string }): Promise<{ tirths: Tirth[]; pagination: any }> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.sect && { sect: filters.sect }),
        ...(filters?.type && { type: filters.type }),
      })

      // Call server-side endpoint (not backend directly)
      const response = await $fetch<TirthApiResponse>(`/api/tirth?${params.toString()}`)

      return {
        tirths: (response.data || []).map(transformTirthData),
        pagination: response.pagination,
      }
    } catch (error) {
      console.error('Error fetching tirths:', error)
      throw error
    }
  }

  /**
   * Fetch single tirth by name with full details
   * Calls server-side endpoint which in turn calls backend with includeDetails=true
   */
  const fetchTirthById = async (id: string): Promise<Tirth> => {
    try {
      // Call server-side endpoint (not backend directly)
      // The id should be the tirth_name (e.g., "Palitana")
      const response = await $fetch<{ success: boolean; data: any }>(`/api/tirth/${id}`)
      return transformTirthDetailData(response.data)
    } catch (error) {
      console.error(`Error fetching tirth ${id}:`, error)
      throw error
    }
  }

/**
   * Search tirths
   */
  const searchTirths = async (query: string): Promise<Tirth[]> => {
    try {
      return await $fetch('/api/v1/tirth/search', {
        baseURL: 'http://localhost:5000',
        query: { q: query },
      })
    } catch (error) {
      console.error('Error searching tirths:', error)
      throw error
    }
  }

  /**
   * Filter tirths by criteria
   */
  const filterTirths = async (filters: {
    state?: string
    sect?: string
    type?: string
    facilities?: string[]
  }): Promise<Tirth[]> => {
    try {
      return await $fetch('/api/v1/tirth/filter', {
        baseURL: 'http://localhost:5000',
        query: filters,
      })
    } catch (error) {
      console.error('Error filtering tirths:', error)
      throw error
    }
  }

  return {
    fetchTirths,
    fetchTirthById,
    searchTirths,
    filterTirths,
  }
}
