/**
 * Composable for interacting with Festivals API
 * Handles fetching festival data from the backend
 */

import type { Festival } from '~/types/models'

export const useFestivalsApi = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch all festivals or festivals for a specific tirth
   */
  const fetchFestivals = async (tirth_id?: string): Promise<Festival[]> => {
    loading.value = true
    error.value = null

    try {
      console.log('🔌 Fetching festivals', { tirth_id })

      const params = tirth_id ? { tirth_id } : {}
      const response = await $fetch<{
        success: boolean
        data: Festival[]
        pagination: { total: number }
      }>('/api/festivals', { query: params })

      console.log('📦 Festivals API response:', {
        success: response.success,
        count: response.data?.length || 0,
      })

      if (!response.success) {
        throw new Error('Failed to fetch festivals')
      }

      return response.data || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch festivals'
      error.value = errorMessage
      console.error('❌ Error fetching festivals:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch festivals for a specific tirth by name
   */
  const fetchFestivalsForTirth = async (tirthName: string): Promise<Festival[]> => {
    // Since the API uses tirth_id, we would need the ID mapping
    // For now, festivals are included in the tirth detail endpoint
    return await fetchFestivals()
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchFestivals,
    fetchFestivalsForTirth,
  }
}
