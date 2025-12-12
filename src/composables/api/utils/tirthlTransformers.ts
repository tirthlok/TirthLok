/**
 * Tirth Data Transformers Utility
 * Centralized functions for transforming raw API responses to Tirth models
 * Used by both store and composables to avoid code duplication
 */

import type { Tirth } from '~/types/models'

/**
 * Parse mul_nayak (principal deity) data from various formats
 * Handles both string JSON and object formats, including mool_nayak variants
 * 
 * @param source - Raw mul_nayak data (string, object, array, or undefined)
 * @returns Tuple of [moolnayakArray, acharyaName]
 */
function parseMulNayak(source: any): [any[], string] {
  let moolnayakArray: any[] = []
  let acharya = ''

  if (!source) return [moolnayakArray, acharya]

  try {
    // Try to parse if string, otherwise use as-is
    const moolNayakData = typeof source === 'string' ? JSON.parse(source) : source

    if (moolNayakData) {
      if (Array.isArray(moolNayakData)) {
        moolnayakArray = moolNayakData.map((idol: any) => ({
          name: idol.name || '',
          height: idol.height || '',
          metal: idol.metal || '',
          year: idol.year ? parseInt(idol.year) : undefined,
        }))
        acharya = moolNayakData[0]?.name || ''
      } else {
        moolnayakArray = [{
          name: moolNayakData.name || '',
          height: moolNayakData.height || '',
          metal: moolNayakData.metal || '',
          year: moolNayakData.year ? parseInt(moolNayakData.year) : undefined,
        }]
        acharya = moolNayakData.name || ''
      }
    }
  } catch (error) {
    // Fallback: treat source as string name
    if (source) {
      acharya = String(source)
      moolnayakArray = [{ name: acharya }]
    }
  }

  return [moolnayakArray, acharya]
}

/**
 * Validate sect value against allowed values
 * 
 * @param sect - Raw sect value from database
 * @returns Valid sect or default 'Jain'
 */
function validateSect(sect: string): string {
  const validSects = ['Digambar', 'Shwetambar']
  return sect && validSects.includes(sect) ? sect : 'Jain'
}

/**
 * Transform raw database response to Tirth model (list/card view)
 * Handles field name variations and data type conversions
 * 
 * @param raw - Raw data from API/database
 * @returns Transformed Tirth object ready for display
 */
export function transformTirthData(raw: any): Tirth {
  // Parse mul_nayak with fallback to mool_nayak
  const moolNayakSource = raw.mul_nayak || raw.mool_nayak
  const [moolnayakArray, acharya] = parseMulNayak(moolNayakSource)

  return {
    id: String(raw.tirth_id || ''),
    name: raw.tirth_name || '',
    location: {
      city: raw.tirth_city || '',
      state: raw.tirth_state || '',
      address: raw.address || '',
      latitude: raw.latitude || 0,
      longitude: raw.longitude || 0,
    },
    sect: validateSect(raw.tirth_sect),
    type: raw.tirth_kshetra || 'Gyan-sthan',
    description: raw.tirth_description || '',
    historicalBackground: raw.historical_background || raw.historicalBackground || '',
    foundingYear: 0,
    foundingDetails: raw.founding_details || raw.foundingDetails || '',
    pratisthaYear: 0,
    acharya,
    architecture: raw.architecture || '',
    moolnayak: moolnayakArray,
    specialFacts: raw.special_facts 
      ? (Array.isArray(raw.special_facts) ? raw.special_facts : [raw.special_facts])
      : [],
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
 * Transform detailed API response to Tirth model (detail page view)
 * Handles nested details object and multiple field name variations
 * 
 * @param raw - Raw data from detail API endpoint
 * @returns Transformed Tirth object with full details
 */
export function transformTirthDetailData(raw: any): Tirth {
  // Extract details object if present
  const details = raw.details && Array.isArray(raw.details) && raw.details.length > 0 
    ? raw.details[0] 
    : raw.details || {}

  // Parse mul_nayak from multiple possible locations
  const moolNayakSource = details.mool_nayak || details.mul_nayak || raw.mool_nayak || raw.mul_nayak
  const [moolnayakArray, acharya] = parseMulNayak(moolNayakSource)

  return {
    id: String(raw.tirth_id || ''),
    name: raw.tirth_name || '',
    location: {
      city: raw.tirth_city || '',
      state: raw.tirth_state || '',
      address: raw.address || '',
      latitude: raw.latitude || 0,
      longitude: raw.longitude || 0,
    },
    sect: validateSect(raw.tirth_sect),
    type: raw.tirth_kshetra || 'Gyan-sthan',
    description: raw.tirth_description || '',
    historicalBackground: details.historical_background || raw.historical_background || details.historicalBackground || raw.historicalBackground || '',
    foundingYear: 0,
    foundingDetails: details.founding_details || raw.founding_details || details.foundingDetails || raw.foundingDetails || '',
    pratisthaYear: 0,
    acharya,
    architecture: details.architecture || raw.architecture || '',
    moolnayak: moolnayakArray,
    specialFacts: details.special_facts 
      ? (Array.isArray(details.special_facts) ? details.special_facts : [details.special_facts])
      : raw.special_facts 
        ? (Array.isArray(raw.special_facts) ? raw.special_facts : [raw.special_facts])
        : [],
    poojaTimings: details.pooja_timings || raw.pooja_timings || details.poojaTimings || raw.poojaTimings || '',
    darshanTimings: details.darshan_timings || raw.darshan_timings || details.darshanTimings || raw.darshanTimings || '',
    festivals: raw.festivals || [],
    images: raw.images || [],
    rating: raw.rating || 0,
    reviews: 0,
    facilities: raw.facilities || [],
  }
}
