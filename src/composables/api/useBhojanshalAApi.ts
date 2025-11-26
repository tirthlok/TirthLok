/**
 * useBhojanshalAApi Composable
 * Bhojanshala-specific API endpoints
 */

import type { Bhojanshala } from '~/types/models'

export const useBhojanshalAApi = () => {
  const config = useRuntimeConfig()

  /**
   * Fetch all bhojanshala locations
   */
  const fetchBhojanshallas = async (): Promise<Bhojanshala[]> => {
    try {
      return await $fetch('/api/bhojanshala', {
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error('Error fetching bhojanshalas:', error)
      throw error
    }
  }

  /**
   * Fetch single bhojanshala by ID
   */
  const fetchBhojanshalAById = async (id: string): Promise<Bhojanshala> => {
    try {
      return await $fetch(`/api/bhojanshala/${id}`, {
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error(`Error fetching bhojanshala ${id}:`, error)
      throw error
    }
  }

  /**
   * Create new bhojanshala
   */
  const createBhojanshala = async (data: Partial<Bhojanshala>): Promise<Bhojanshala> => {
    try {
      return await $fetch('/api/bhojanshala', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: data,
      })
    } catch (error) {
      console.error('Error creating bhojanshala:', error)
      throw error
    }
  }

  /**
   * Update existing bhojanshala
   */
  const updateBhojanshala = async (id: string, data: Partial<Bhojanshala>): Promise<Bhojanshala> => {
    try {
      return await $fetch(`/api/bhojanshala/${id}`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        body: data,
      })
    } catch (error) {
      console.error(`Error updating bhojanshala ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete bhojanshala
   */
  const deleteBhojanshala = async (id: string): Promise<void> => {
    try {
      await $fetch(`/api/bhojanshala/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error(`Error deleting bhojanshala ${id}:`, error)
      throw error
    }
  }

  /**
   * Search bhojanshalas
   */
  const searchBhojanshalas = async (query: string): Promise<Bhojanshala[]> => {
    try {
      return await $fetch('/api/bhojanshala/search', {
        baseURL: config.public.apiBaseUrl,
        query: { q: query },
      })
    } catch (error) {
      console.error('Error searching bhojanshalas:', error)
      throw error
    }
  }

  /**
   * Filter bhojanshalas by criteria
   */
  const filterBhojanshalas = async (filters: {
    city?: string
    cuisine?: string[]
    dietaryOptions?: string[]
    servingTimes?: string[]
  }): Promise<Bhojanshala[]> => {
    try {
      return await $fetch('/api/bhojanshala/filter', {
        baseURL: config.public.apiBaseUrl,
        query: filters,
      })
    } catch (error) {
      console.error('Error filtering bhojanshalas:', error)
      throw error
    }
  }

  return {
    fetchBhojanshallas,
    fetchBhojanshalAById,
    createBhojanshala,
    updateBhojanshala,
    deleteBhojanshala,
    searchBhojanshalas,
    filterBhojanshalas,
  }
}
