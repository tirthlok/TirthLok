/**
 * useCustomerProfile Composable
 * Handles customer profile operations using secure RPC and views
 * Following production-grade Supabase architecture:
 * - Reads via public.v_customer_profile view
 * - Writes via public RPC functions
 */

import { ref } from 'vue'
import { useSupabase } from './useSupabase'

// TypeScript types
export interface CustomerProfile {
    customer_id: string
    customer_email_id: string
    customer_first_name: string | null
    customer_last_name: string | null
    customer_mobile: string | null
    customer_sect: string | null
    created_at: string
    updated_at: string
}

export interface CreateProfileParams {
    email: string
    firstName?: string
    lastName?: string
    mobile?: string
    sect?: string
}

export interface UpdateProfileParams {
    firstName?: string
    lastName?: string
    mobile?: string
    sect?: string
}

export const useCustomerProfile = () => {
    // Lazily resolve the Supabase client only when a method actually
    // uses it — not at composable creation time. useCustomerProfile()
    // is invoked unconditionally inside useAuth(), which itself is
    // called during SSR by components like Header.vue. The client
    // must not be created at that point.
    const getSupabase = () => {
        if (import.meta.server) return null
        return useSupabase().supabase
    }
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * Get customer profile using secure view
     * View automatically filters to show only authenticated user's profile
     */
    const getProfile = async () => {
        const supabase = getSupabase()
        if (!supabase) {
            return { success: false, error: 'Not available during server rendering', data: null }
        }

        loading.value = true
        error.value = null

        try {
            const { data, error: fetchError } = await supabase
                .rpc('get_customer_profile')
                .single()

            if (fetchError) {
                error.value = fetchError.message
                return { success: false, error: fetchError.message, data: null }
            }

            return { success: true, data: data as CustomerProfile }
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch profile'
            return { success: false, error: error.value, data: null }
        } finally {
            loading.value = false
        }
    }

    /**
     * Check if profile exists
     * The DB trigger handles creation automatically.
     */
    const checkProfileExists = async () => {
        const { success, data } = await getProfile()
        return success && !!data
    }

    /**
     * Update customer profile using RPC function
     * RPC handles auth.uid() and updated_at automatically
     * Only updates provided fields (COALESCE in SQL)
     */
    const updateProfile = async (params: UpdateProfileParams) => {
        const supabase = getSupabase()
        if (!supabase) {
            return { success: false, error: 'Not available during server rendering', data: null }
        }

        loading.value = true
        error.value = null

        try {
            const { data, error: rpcError } = await supabase.rpc('update_customer_profile', {
                p_first_name: params.firstName || null,
                p_last_name: params.lastName || null,
                p_mobile: params.mobile || null,
                p_sect: params.sect || null,
            })

            if (rpcError) {
                error.value = rpcError.message
                return { success: false, error: rpcError.message, data: null }
            }

            return { success: true, data: data as CustomerProfile[] }
        } catch (err: any) {
            error.value = err.message || 'Failed to update profile'
            return { success: false, error: error.value, data: null }
        } finally {
            loading.value = false
        }
    }

    /**
     * Check if profile exists and wait slightly for trigger if not found immediately
     * Useful for newly signed up users where trigger might take a few milliseconds
     */
    const ensureProfileExists = async () => {
        // Try immediately
        let { success, data } = await getProfile()

        if (!success || !data) {
            console.log('[useCustomerProfile] Profile not found, waiting for trigger...')
            // Wait 500ms and try one more time (safety for trigger latency)
            await new Promise(resolve => setTimeout(resolve, 500))
            const retry = await getProfile()
            success = retry.success
            data = retry.data
        }

        return { success, data }
    }

    return {
        // State
        loading,
        error,
        // Methods
        getProfile,
        checkProfileExists,
        updateProfile,
        ensureProfileExists,
    }
}
