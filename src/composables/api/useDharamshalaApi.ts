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

      return await fetchWithTimeout<Dharamshala[]>(promise, 500, [])
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

  return {
    fetchDharamshalas,
    fetchDharamshalaById,
  }
}
