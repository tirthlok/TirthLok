/**
 * useTirthApi Composable
 * ========================
 * Server-side API interface for Tirth locations
 * 
 * Methods:
 *  - fetchTirths()      : Get all tirth locations with pagination
 *  - fetchTirthById()   : Get single tirth with full details
 * 
 * Note: searchTirths() and filterTirths() are deprecated - use fetchTirths with filters instead
 */

import type { Tirth } from '~/types/models'
import { transformTirthData, transformTirthDetailData } from './utils/tirthlTransformers'

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

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  /**
   * Fetch all tirth locations with pagination and optional filters
   * @param page - Page number (1-indexed)
   * @param limit - Items per page (default: 10)
   * @param filters - Optional filters: search, sect, type
   * @returns Promise with array of Tirth objects and pagination info
   */
  const fetchTirths = async (
    page = 1,
    limit = 10,
    filters?: { search?: string; sect?: string; type?: string }
  ): Promise<{ tirths: Tirth[]; pagination: any }> => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.sect && { sect: filters.sect }),
        ...(filters?.type && { type: filters.type }),
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
   * Fetch single tirth by name with full details
   * @param id - Tirth name (e.g., "Palitana")
   * @returns Promise with complete Tirth object including details
   */
  const fetchTirthById = async (id: string): Promise<Tirth> => {
    try {
      const response = await $fetch<{ success: boolean; data: any }>(`/api/tirth/${id}`)
      return transformTirthDetailData(response.data)
    } catch (error) {
      console.error(`Error fetching tirth ${id}:`, error)
      throw error
    }
  }

  // ============================================================================
  // EXPORTS
  // ============================================================================

  return {
    fetchTirths,
    fetchTirthById,
  }
}

