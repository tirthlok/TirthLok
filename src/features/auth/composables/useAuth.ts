/**
 * useAuth Composable
 * Provides Supabase authentication methods for email/password auth
 */

import { ref, computed } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import { useSupabase } from './useSupabase'

// Shared state across all instances
const currentUser = ref<User | null>(null)
const currentSession = ref<Session | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const initialized = ref(false)

export const useAuth = () => {
    const { supabase } = useSupabase()

    // Computed states
    const isAuthenticated = computed(() => !!currentSession.value)
    const user = computed(() => currentUser.value)
    const session = computed(() => currentSession.value)

    /**
     * Initialize auth state and listen for changes
     */
    const initialize = async () => {
        if (initialized.value) return

        try {
            // Get initial session
            const { data: { session: initialSession } } = await supabase.auth.getSession()
            currentSession.value = initialSession
            currentUser.value = initialSession?.user ?? null

            // Listen for auth state changes
            supabase.auth.onAuthStateChange((_event, session) => {
                currentSession.value = session
                currentUser.value = session?.user ?? null
            })

            initialized.value = true
        } catch (err) {
            console.error('Auth initialization error:', err)
        }
    }

    /**
     * Sign up with email and password
     */
    const signUp = async (
        email: string,
        password: string,
        firstName?: string,
        lastName?: string,
        sect?: string,
        mobile?: string
    ) => {
        loading.value = true
        error.value = null

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        mobile: mobile,
                        sect: sect
                    }
                }
            })

            if (signUpError) {
                error.value = signUpError.message
                return { success: false, error: signUpError.message }
            }

            if (data.user) {
                // Create customer profile in the database
                const profileResult = await createCustomerProfile(
                    email,
                    firstName,
                    lastName,
                    sect,
                    mobile
                )

                if (!profileResult.success) {
                    console.error('Profile creation error:', profileResult.error)
                }

                currentUser.value = data.user
                currentSession.value = data.session
            }

            return { success: true, user: data.user, session: data.session }
        } catch (err: any) {
            error.value = err.message || 'Sign up failed'
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    /**
     * Sign in with email and password
     */
    const signIn = async (email: string, password: string) => {
        loading.value = true
        error.value = null

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (signInError) {
                error.value = signInError.message
                return { success: false, error: signInError.message }
            }

            currentUser.value = data.user
            currentSession.value = data.session

            return { success: true, user: data.user, session: data.session }
        } catch (err: any) {
            error.value = err.message || 'Sign in failed'
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    /**
     * Sign out the current user
     */
    const signOut = async () => {
        loading.value = true
        error.value = null

        try {
            const { error: signOutError } = await supabase.auth.signOut()

            if (signOutError) {
                error.value = signOutError.message
                return { success: false, error: signOutError.message }
            }

            currentUser.value = null
            currentSession.value = null

            return { success: true }
        } catch (err: any) {
            error.value = err.message || 'Sign out failed'
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    /**
     * Create customer profile using RPC function
     * Uses secure create_customer_profile RPC instead of direct INSERT
     */
    const createCustomerProfile = async (
        email: string,
        firstName?: string,
        lastName?: string,
        sect?: string,
        mobile?: string
    ) => {
        try {
            const { error: rpcError } = await supabase.rpc('create_customer_profile', {
                p_email: email,
                p_first_name: firstName || null,
                p_last_name: lastName || null,
                p_mobile: mobile || null,
                p_sect: sect || null,
            })

            if (rpcError) {
                console.error('RPC Error (create_customer_profile):', rpcError)
                return { success: false, error: rpcError.message }
            }

            return { success: true }
        } catch (err: any) {
            return { success: false, error: err.message || 'Profile creation failed' }
        }
    }

    /**
     * Get customer profile using secure view
     * View automatically filters to show only user's own profile
     */
    const getCustomerProfile = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('v_customer_profile')
                .select('*')
                .single()

            if (fetchError) {
                return { success: false, error: fetchError.message, data: null }
            }

            return { success: true, data }
        } catch (err: any) {
            return { success: false, error: err.message || 'Failed to fetch profile', data: null }
        }
    }

    /**
     * Update customer profile using RPC function
     * RPC handles auth.uid() and updated_at automatically
     */
    const updateCustomerProfile = async (
        updates: {
            customer_first_name?: string
            customer_last_name?: string
            customer_mobile?: string
            customer_sect?: string
        }
    ) => {
        try {
            const { data, error: rpcError } = await supabase.rpc('update_customer_profile', {
                p_first_name: updates.customer_first_name || null,
                p_last_name: updates.customer_last_name || null,
                p_mobile: updates.customer_mobile || null,
                p_sect: updates.customer_sect || null,
            })

            if (rpcError) {
                console.error('RPC Error (update_customer_profile):', rpcError)
                return { success: false, error: rpcError.message }
            }

            return { success: true, data }
        } catch (err: any) {
            return { success: false, error: err.message || 'Profile update failed' }
        }
    }

    /**
     * Check if a user already exists with the given email
     */
    const checkUserExists = async (email: string) => {
        try {
            const { data, error: rpcError } = await supabase.rpc('check_email_exists', {
                p_email: email
            })

            if (rpcError) {
                console.error('RPC Error (check_email_exists):', rpcError)
                return false
            }

            return !!data
        } catch (err) {
            return false
        }
    }

    return {
        // State
        user,
        session,
        isAuthenticated,
        loading,
        error,
        initialized,
        // Methods
        initialize,
        signUp,
        signIn,
        signOut,
        createCustomerProfile,
        getCustomerProfile,
        updateCustomerProfile,
        checkUserExists,
    }
}
