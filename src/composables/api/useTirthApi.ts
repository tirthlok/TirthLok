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

  /**
   * Create new tirth
   */
  const createTirth = async (data: Partial<Tirth>): Promise<Tirth> => {
    try {
      return await $fetch('/api/tirth', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: data,
      })
    } catch (error) {
      console.error('Error creating tirth:', error)
      throw error
    }
  }

  /**
   * Update existing tirth
   */
  const updateTirth = async (id: string, data: Partial<Tirth>): Promise<Tirth> => {
    try {
      return await $fetch(`/api/tirth/${id}`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        body: data,
      })
    } catch (error) {
      console.error(`Error updating tirth ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete tirth
   */
  const deleteTirth = async (id: string): Promise<void> => {
    try {
      await $fetch(`/api/tirth/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error(`Error deleting tirth ${id}:`, error)
      throw error
    }
  }

  /**
   * Search tirths
   */
  const searchTirths = async (query: string): Promise<Tirth[]> => {
    try {
      return await $fetch('/api/tirth/search', {
        baseURL: config.public.apiBaseUrl,
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
      return await $fetch('/api/tirth/filter', {
        baseURL: config.public.apiBaseUrl,
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
    createTirth,
    updateTirth,
    deleteTirth,
    searchTirths,
    filterTirths,
  }
}
