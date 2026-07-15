/**
 * Composable for interacting with Events API
 * Handles fetching event data from the backend
 */

import type { EventItem } from '~/types/models'

export const useEventsApi = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * Fetch all events or events for a specific tirth
     */
    const fetchEvents = async (tirth_id?: string): Promise<EventItem[]> => {
        loading.value = true
        error.value = null

        try {
            console.log('🔌 Fetching events', { tirth_id })

            const params = tirth_id ? { tirth_id } : {}
            const response = await $fetch<{
                success: boolean
                data: EventItem[]
                pagination: { total: number }
            }>('/api/events', { query: params })

            console.log('📦 Events API response:', {
                success: response.success,
                count: response.data?.length || 0,
            })

            if (!response.success) {
                throw new Error('Failed to fetch events')
            }

            return response.data || []
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events'
            error.value = errorMessage
            console.error('❌ Error fetching events:', err)
            return []
        } finally {
            loading.value = false
        }
    }

    /**
     * Fetch events for a specific tirth by name
     */
    const fetchEventsForTirth = async (tirthName: string): Promise<EventItem[]> => {
        // Since the API uses tirth_id, we would need the ID mapping
        // For now, events are included in the tirth detail endpoint
        console.log(`🔌 Fetching events for tirth: ${tirthName}`)
        return await fetchEvents()
    }

    return {
        loading: readonly(loading),
        error: readonly(error),
        fetchEvents,
        fetchEventsForTirth,
    }
}
