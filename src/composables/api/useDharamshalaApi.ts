/**
 * useDharamshalaApi Composable
 * Dharamshala-specific API endpoints
 */

import type { Dharamshala } from '~/types/models'

export const useDharamshalaApi = () => {
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
   * Fetch all dharamshala locations
   */
  const fetchDharamshalas = async (): Promise<Dharamshala[]> => {
    try {
      const promise = $fetch('/api/dharamshala', {
        baseURL: config.public.apiBaseUrl,
      }) as Promise<Dharamshala[]>

      return await fetchWithTimeout<Dharamshala[]>(promise, 2000, [])
    } catch (error) {
      console.error('Error fetching dharamshalas:', error)
      return []
    }
  }

  /**
   * Fetch single dharamshala by ID
   */
  const fetchDharamshalaById = async (id: string): Promise<Dharamshala> => {
    try {
      const promise = $fetch(`/api/dharamshala/${id}`, {
        baseURL: config.public.apiBaseUrl,
      }) as Promise<Dharamshala>

      // on timeout return an empty object cast to Dharamshala to avoid hanging
      return await fetchWithTimeout<Dharamshala>(promise, 500, {} as Dharamshala)
    } catch (error) {
      console.error(`Error fetching dharamshala ${id}:`, error)
      return {} as Dharamshala
    }
  }

  /**
   * Create new dharamshala
   */
  const createDharmadhala = async (data: Partial<Dharamshala>): Promise<Dharamshala> => {
    try {
      return await $fetch('/api/dharamshala', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: data,
      })
    } catch (error) {
      console.error('Error creating dharamshala:', error)
      throw error
    }
  }

  /**
   * Update existing dharamshala
   */
  const updateDharmadhala = async (id: string, data: Partial<Dharamshala>): Promise<Dharamshala> => {
    try {
      return await $fetch(`/api/dharamshala/${id}`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        body: data,
      })
    } catch (error) {
      console.error(`Error updating dharamshala ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete dharamshala
   */
  const deleteDharmadhala = async (id: string): Promise<void> => {
    try {
      await $fetch(`/api/dharamshala/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error(`Error deleting dharamshala ${id}:`, error)
      throw error
    }
  }

  /**
   * Search dharamshalas
   */
  const searchDharamshalas = async (query: string): Promise<Dharamshala[]> => {
    try {
      return await $fetch('/api/dharamshala/search', {
        baseURL: config.public.apiBaseUrl,
        query: { q: query },
      })
    } catch (error) {
      console.error('Error searching dharamshalas:', error)
      throw error
    }
  }

  /**
   * Filter dharamshalas by criteria
   */
  const filterDharamshalas = async (filters: {
    city?: string
    capacity?: number
    amenities?: string[]
    priceRange?: [number, number]
  }): Promise<Dharamshala[]> => {
    try {
      return await $fetch('/api/dharamshala/filter', {
        baseURL: config.public.apiBaseUrl,
        query: filters,
      })
    } catch (error) {
      console.error('Error filtering dharamshalas:', error)
      throw error
    }
  }

  return {
    fetchDharamshalas,
    fetchDharamshalaById,
    createDharmadhala,
    updateDharmadhala,
    deleteDharmadhala,
    searchDharamshalas,
    filterDharamshalas,
  }
}
