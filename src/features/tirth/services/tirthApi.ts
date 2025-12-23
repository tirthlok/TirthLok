/**
 * useTirthApi Composable
 * Consolidated Tirth API endpoints
 * Handles all Tirth-related HTTP requests with unified data transformation
 */

import type { Tirth } from '~/types/models'

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
 * Parse and transform mool_nayak field into structured array
 */
const parseMoolNayak = (source: any) => {
  let moolnayakArray: any[] = []
  let acharya = ''

  if (!source) return { moolnayakArray, acharya }

  try {
    const data = typeof source === 'string' ? JSON.parse(source) : source

    if (data) {
      if (Array.isArray(data)) {
        moolnayakArray = data.map((idol: any) => ({
          name: idol.name || '',
          height: idol.height || '',
          metal: idol.metal || '',
          year: idol.year ? parseInt(idol.year) : undefined,
        }))
        acharya = data[0]?.name || ''
      } else {
        moolnayakArray = [{
          name: data.name || '',
          height: data.height || '',
          metal: data.metal || '',
          year: data.year ? parseInt(data.year) : undefined,
        }]
        acharya = data.name || ''
      }
    }
  } catch (e) {
    console.error('Error parsing mool_nayak:', e)
    if (source) {
      acharya = String(source)
      moolnayakArray = [{ name: acharya }]
    }
  }

  return { moolnayakArray, acharya }
}

/**
 * Parse tags from tirth_tags field
 */
const parseTags = (source: any) => {
  if (!source) return undefined
  if (Array.isArray(source)) return source
  if (typeof source === 'string') {
    try {
      const parsed = JSON.parse(source)
      return Array.isArray(parsed) ? parsed : [source]
    } catch {
      return source.split(',').map((tag: string) => tag.trim())
    }
  }
  return undefined
}

/**
 * Transform raw API response to Tirth model
 * Handles both list and detail responses with fallback field names
 */
const transformTirthData = (raw: any, details?: any): Tirth => {
  const detailsObj = details || (raw.details && raw.details.length > 0 ? raw.details[0] : {})

  // Check for mool_nayak in multiple locations
  const moolNayakSource = detailsObj.mool_nayak || detailsObj.mul_nayak || raw.mool_nayak || raw.mul_nayak
  const { moolnayakArray, acharya } = parseMoolNayak(moolNayakSource)

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
    historicalBackground: detailsObj.historical_background || raw.historical_background || detailsObj.historicalBackground || raw.historicalBackground || '',
    foundingYear: 0,
    foundingDetails: detailsObj.founding_details || raw.founding_details || detailsObj.foundingDetails || raw.foundingDetails || '',
    pratisthaYear: 0,
    acharya,
    architecture: detailsObj.architecture || raw.architecture || '',
    moolnayak: moolnayakArray,
    specialFacts: detailsObj.special_facts ? [detailsObj.special_facts] : raw.special_facts ? [raw.special_facts] : [],
    poojaTimings: detailsObj.events || detailsObj.pooja_timings || raw.pooja_timings || raw.poojaTimings || '',
    darshanTimings: detailsObj.events || detailsObj.darshan_timings || raw.darshan_timings || raw.darshanTimings || '',
    festivals: detailsObj.festival ? [{ name: detailsObj.festival, date: '', month: '', description: '' }] : raw.festivals || [],
    images: raw.images || [],
    rating: raw.rating || 0,
    reviews: 0,
    facilities: raw.facilities || [],
    tirth_grouping: raw.tirth_grouping || undefined,
    tirth_tags: parseTags(raw.tirth_tags),
  }
}

export const useTirthApi = () => {
  /**
   * Fetch all tirth locations with pagination
   */
  const fetchTirths = async (page = 1, limit = 10): Promise<{ tirths: Tirth[]; pagination: any }> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })

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
   * Fetch single tirth by ID with full details
   */
  const fetchTirthById = async (id: string): Promise<Tirth> => {
    try {
      const response = await $fetch<{ success: boolean; data: any }>(`/api/tirth/${id}`)
      return transformTirthData(response.data)
    } catch (error) {
      console.error(`Error fetching tirth ${id}:`, error)
      throw error
    }
  }

  return {
    fetchTirths,
    fetchTirthById,
  }
}
