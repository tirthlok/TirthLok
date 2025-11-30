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

  return {
    fetchBhojanshallas,
    fetchBhojanshalaById,
  }
}
