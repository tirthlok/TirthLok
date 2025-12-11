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
  const transformTirthData = (raw: any): Tirth => {
    // Parse mool_nayak if it exists (from list response)
    let moolnayakArray: any[] = []
    let acharya = ''
    
    if (raw.mool_nayak) {
      try {
        const moolNayakData = typeof raw.mool_nayak === 'string' 
          ? JSON.parse(raw.mool_nayak) 
          : raw.mool_nayak
        
        if (moolNayakData) {
          if (Array.isArray(moolNayakData)) {
            moolnayakArray = moolNayakData.map((idol: any) => ({
              name: idol.name || '',
              height: idol.height || '',
              metal: idol.metal || '',
              year: idol.year ? parseInt(idol.year) : undefined,
            }))
          } else {
            moolnayakArray = [{
              name: moolNayakData.name || '',
              height: moolNayakData.height || '',
              metal: moolNayakData.metal || '',
              year: moolNayakData.year ? parseInt(moolNayakData.year) : undefined,
            }]
          }
          acharya = Array.isArray(moolNayakData) ? (moolNayakData[0]?.name || '') : (moolNayakData.name || '')
        }
      } catch (e) {
        console.error('Error parsing mool_nayak:', e)
        if (raw.mool_nayak) {
          acharya = String(raw.mool_nayak)
          moolnayakArray = [{ name: acharya }]
        }
      }
    }

    return {
      id: String(raw.tirth_id),
      name: raw.tirth_name,
      location: {
        city: raw.tirth_city,
        state: raw.tirth_state,
        address: raw.address || '',
        latitude: raw.latitude || 0,
        longitude: raw.longitude || 0,
      },
      sect: (raw.tirth_sect && ['Digambar', 'Shwetambar'].includes(raw.tirth_sect)) ? raw.tirth_sect : 'Jain',
      type: raw.tirth_kshetra || 'Gyan-sthan',
      description: raw.tirth_description || '',
      historicalBackground: raw.historical_background || raw.historicalBackground || '',
      foundingYear: 0,
      foundingDetails: raw.founding_details || raw.foundingDetails || '',
      pratisthaYear: 0,
      acharya: acharya,
      architecture: raw.architecture || '',
      moolnayak: moolnayakArray,
      specialFacts: raw.special_facts ? [raw.special_facts] : [],
      poojaTimings: raw.pooja_timings || raw.poojaTimings || '',
      darshanTimings: raw.darshan_timings || raw.darshanTimings || '',
      festivals: raw.festivals || [],
      images: raw.images || [],
      rating: raw.rating || 0,
      reviews: 0,
      facilities: raw.facilities || [],
    }
  }

  /**
   * Transform detailed API response to Tirth model (for detail pages)
   * Handles the new response format with details array
   */
  const transformTirthDetailData = (raw: any): Tirth => {
    const details = raw.details && raw.details.length > 0 ? raw.details[0] : {}
    
    // Parse mool_nayak - check multiple possible locations
    let moolnayakArray: any[] = []
    let acharya = ''
    
    // Try multiple field names and locations
    const moolNayakSource = details.mool_nayak || details.mul_nayak || raw.mool_nayak || raw.mul_nayak
    
    if (moolNayakSource) {
      try {
        const mulNayakData = typeof moolNayakSource === 'string' 
          ? JSON.parse(moolNayakSource) 
          : moolNayakSource
        
        if (mulNayakData) {
          if (Array.isArray(mulNayakData)) {
            moolnayakArray = mulNayakData.map((idol: any) => ({
              name: idol.name || '',
              height: idol.height || '',
              metal: idol.metal || '',
              year: idol.year ? parseInt(idol.year) : undefined,
            }))
          } else {
            moolnayakArray = [{
              name: mulNayakData.name || '',
              height: mulNayakData.height || '',
              metal: mulNayakData.metal || '',
              year: mulNayakData.year ? parseInt(mulNayakData.year) : undefined,
            }]
          }
          acharya = Array.isArray(mulNayakData) ? (mulNayakData[0]?.name || '') : (mulNayakData.name || '')
        }
      } catch (e) {
        console.error('Error parsing mool_nayak:', e)
        if (moolNayakSource) {
          acharya = String(moolNayakSource)
          moolnayakArray = [{ name: acharya }]
        }
      }
    }
    
    return {
      id: String(raw.tirth_id),
      name: raw.tirth_name,
      location: {
        city: raw.tirth_city,
        state: raw.tirth_state,
        address: raw.address || '',
        latitude: raw.latitude || 0,
        longitude: raw.longitude || 0,
      },
      sect: (raw.tirth_sect && ['Digambar', 'Shwetambar'].includes(raw.tirth_sect)) ? raw.tirth_sect : 'Jain',
      type: raw.tirth_kshetra || 'Gyan-sthan',
      description: raw.tirth_description || '',
      historicalBackground: details.historical_background || raw.historical_background || details.historicalBackground || raw.historicalBackground || '',
      foundingYear: 0,
      foundingDetails: details.founding_details || raw.founding_details || details.foundingDetails || raw.foundingDetails || '',
      pratisthaYear: 0,
      acharya: acharya,
      architecture: details.architecture || raw.architecture || '',
      moolnayak: moolnayakArray,
      specialFacts: details.special_facts ? [details.special_facts] : raw.special_facts ? [raw.special_facts] : [],
      poojaTimings: details.events || details.pooja_timings || raw.pooja_timings || raw.poojaTimings || '',
      darshanTimings: details.events || details.darshan_timings || raw.darshan_timings || raw.darshanTimings || '',
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
        pagination: response.pagination || { total: 0, page: 1, pages: 1 },
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
