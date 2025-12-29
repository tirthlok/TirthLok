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
    const { supabase } = useSupabase()
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * Get customer profile using secure view
     * View automatically filters to show only authenticated user's profile
     */
    const getProfile = async () => {
        loading.value = true
        error.value = null

        try {
            const { data, error: fetchError } = await supabase
                .from('v_customer_profile')
                .select('*')
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
     * Create customer profile using RPC function
     * RPC handles auth.uid() automatically and prevents duplicates
     */
    const createProfile = async (params: CreateProfileParams) => {
        loading.value = true
        error.value = null

        try {
            const { data, error: rpcError } = await supabase.rpc('create_customer_profile', {
                p_email: params.email,
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
            error.value = err.message || 'Failed to create profile'
            return { success: false, error: error.value, data: null }
        } finally {
            loading.value = false
        }
    }

    /**
     * Update customer profile using RPC function
     * RPC handles auth.uid() and updated_at automatically
     * Only updates provided fields (COALESCE in SQL)
     */
    const updateProfile = async (params: UpdateProfileParams) => {
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
     * Check if profile exists and create if missing
     * Useful as a fallback for trigger or for users who signed up before trigger
     */
    const ensureProfileExists = async (params: CreateProfileParams) => {
        const { success, data } = await getProfile()

        if (!success || !data) {
            console.log('[useCustomerProfile] Profile missing, creating...')
            return await createProfile(params)
        }

        return { success: true, data }
    }

    return {
        // State
        loading,
        error,
        // Methods
        getProfile,
        createProfile,
        updateProfile,
        ensureProfileExists,
    }
}
