/**
 * useTirthApi Composable
 * Tirth-specific API endpoints
 */

import type { Tirth } from '~/types/models'

export const useTirthApi = () => {
  const config = useRuntimeConfig()

  /**
   * Fetch all tirth locations
   */
  const fetchTirths = async (): Promise<Tirth[]> => {
    try {
      return await $fetch('/api/tirth', {
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error('Error fetching tirths:', error)
      throw error
    }
  }

  /**
   * Fetch single tirth by ID
   */
  const fetchTirthById = async (id: string): Promise<Tirth> => {
    try {
      return await $fetch(`/api/tirth/${id}`, {
        baseURL: config.public.apiBaseUrl,
      })
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
