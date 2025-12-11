/**
 * useSupabaseTirthApi Composable
 * Fetch tirth data from Supabase
 */

import type { Tirth } from '~/types/models'
import { useSupabase } from './useSupabase'

export const useSupabaseTirthApi = () => {
  const { supabase } = useSupabase()

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
   * Transform Supabase response to Tirth model (for list pages)
   */
  const transformTirthData = (raw: any): Tirth => {
    // Parse mul_nayak if it exists (from list response)
    let mulNayakArray: any[] = []
    let acharya = ''
    
    if (raw.mul_nayak) {
      try {
        const mulNayakData = typeof raw.mul_nayak === 'string' 
          ? JSON.parse(raw.mul_nayak) 
          : raw.mul_nayak
        
        if (mulNayakData) {
          if (Array.isArray(mulNayakData)) {
            mulNayakArray = mulNayakData.map((idol: any) => ({
              name: idol.name || '',
              height: idol.height || '',
              metal: idol.metal || '',
              year: idol.year ? parseInt(idol.year) : undefined,
            }))
          } else {
            mulNayakArray = [{
              name: mulNayakData.name || '',
              height: mulNayakData.height || '',
              metal: mulNayakData.metal || '',
              year: mulNayakData.year ? parseInt(mulNayakData.year) : undefined,
            }]
          }
          acharya = Array.isArray(mulNayakData) ? (mulNayakData[0]?.name || '') : (mulNayakData.name || '')
        }
      } catch (e) {
        console.error('Error parsing mul_nayak:', e)
        if (raw.mul_nayak) {
          acharya = String(raw.mul_nayak)
          mulNayakArray = [{ name: acharya }]
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
      moolnayak: mulNayakArray,
      specialFacts: raw.special_facts ? (Array.isArray(raw.special_facts) ? raw.special_facts : [raw.special_facts]) : [],
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
   * Transform detailed Supabase response to Tirth model (for detail pages)
   */
  const transformTirthDetailData = (raw: any): Tirth => {
    // Parse mul_nayak - check multiple possible locations
    let mulNayakArray: any[] = []
    let acharya = ''
    
    // Try multiple field names and locations - prioritize mul_nayak
    const mulNayakSource = raw.mul_nayak || raw.mool_nayak
    
    if (mulNayakSource) {
      try {
        const mulNayakData = typeof mulNayakSource === 'string' 
          ? JSON.parse(mulNayakSource) 
          : mulNayakSource
        
        if (mulNayakData) {
          if (Array.isArray(mulNayakData)) {
            mulNayakArray = mulNayakData.map((idol: any) => ({
              name: idol.name || '',
              height: idol.height || '',
              metal: idol.metal || '',
              year: idol.year ? parseInt(idol.year) : undefined,
            }))
          } else {
            mulNayakArray = [{
              name: mulNayakData.name || '',
              height: mulNayakData.height || '',
              metal: mulNayakData.metal || '',
              year: mulNayakData.year ? parseInt(mulNayakData.year) : undefined,
            }]
          }
          acharya = Array.isArray(mulNayakData) ? (mulNayakData[0]?.name || '') : (mulNayakData.name || '')
        }
      } catch (e) {
        console.error('Error parsing mul_nayak:', e)
        if (mulNayakSource) {
          acharya = String(mulNayakSource)
          mulNayakArray = [{ name: acharya }]
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
      moolnayak: mulNayakArray,
      specialFacts: raw.special_facts ? (Array.isArray(raw.special_facts) ? raw.special_facts : [raw.special_facts]) : [],
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
   * Fetch all tirth locations with pagination from Supabase
   */
  const fetchTirths = async (page = 1, limit = 10, filters?: { search?: string; sect?: string; type?: string }): Promise<{ tirths: Tirth[]; pagination: any }> => {
    try {
      let query = supabase
        .from('tirth')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters?.sect) {
        query = query.eq('tirth_sect', filters.sect)
      }
      if (filters?.type) {
        query = query.eq('tirth_kshetra', filters.type)
      }
      if (filters?.search) {
        query = query.or(`tirth_name.ilike.%${filters.search}%,tirth_description.ilike.%${filters.search}%,tirth_city.ilike.%${filters.search}%`)
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      
      const { data, error, count } = await query.range(from, to)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      const total = count || 0
      const pages = Math.ceil(total / limit)

      return {
        tirths: (data || []).map(transformTirthData),
        pagination: {
          total,
          page,
          pages,
        },
      }
    } catch (error) {
      console.error('Error fetching tirths from Supabase:', error)
      throw error
    }
  }

  /**
   * Fetch single tirth by ID with full details
   */
  const fetchTirthById = async (id: string): Promise<Tirth> => {
    try {
      const { data, error } = await supabase
        .from('tirth')
        .select('*')
        .eq('tirth_id', id)
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      if (!data) {
        throw new Error('Tirth not found')
      }

      return transformTirthDetailData(data)
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
      const { data, error } = await supabase
        .from('tirth')
        .select('*')
        .or(`tirth_name.ilike.%${query}%,tirth_description.ilike.%${query}%,tirth_city.ilike.%${query}%`)
        .limit(20)

      if (error) throw error

      return (data || []).map(transformTirthData)
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
      let query = supabase.from('tirth').select('*')

      if (filters.state) {
        query = query.eq('tirth_state', filters.state)
      }
      if (filters.sect) {
        query = query.eq('tirth_sect', filters.sect)
      }
      if (filters.type) {
        query = query.eq('tirth_kshetra', filters.type)
      }

      const { data, error } = await query

      if (error) throw error

      return (data || []).map(transformTirthData)
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
