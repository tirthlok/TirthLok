/**
 * useBhojanshalAApi Composable
 * Bhojanshala-specific API endpoints
 */

import type { Bhojanshala } from '~/types/models'

export const useBhojanshalaApi = () => {
  const config = useRuntimeConfig()

  // Helper: wrap a promise with a timeout and return a fallback on timeout
  const fetchWithTimeout = async <T>(promise: Promise<T>, timeoutMs = 500, fallback: T): Promise<T> => {
    let timer: ReturnType<typeof setTimeout> | null = null
    try {
      return await Promise.race([
        promise,
        new Promise<T>((resolve) => {
          timer = setTimeout(() => resolve(fallback), timeoutMs)
        }),
      ])
    } finally {
      if (timer) clearTimeout(timer)
    }
  }

  /**
   * Fetch all bhojanshala locations
   */
  const fetchBhojanshallas = async (): Promise<Bhojanshala[]> => {
    try {
      const promise = $fetch('/api/bhojanshala', {
        baseURL: config.public.apiBaseUrl,
      }) as Promise<Bhojanshala[]>

      return await fetchWithTimeout<Bhojanshala[]>(promise, 500, [])
    } catch (error) {
      console.error('Error fetching bhojanshalas:', error)
      return []
    }
  }

  /**
   * Fetch single bhojanshala by ID
   */
  const fetchBhojanshalaById = async (id: string): Promise<Bhojanshala> => {
    try {
      const promise = $fetch(`/api/bhojanshala/${id}`, {
        baseURL: config.public.apiBaseUrl,
      }) as Promise<Bhojanshala>

      return await fetchWithTimeout<Bhojanshala>(promise, 500, {} as Bhojanshala)
    } catch (error) {
      console.error(`Error fetching bhojanshala ${id}:`, error)
      return {} as Bhojanshala
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
    fetchBhojanshalaById,
    createBhojanshala,
    updateBhojanshala,
    deleteBhojanshala,
    searchBhojanshalas,
    filterBhojanshalas,
  }
}
