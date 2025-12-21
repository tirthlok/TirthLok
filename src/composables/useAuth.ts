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
        sect?: string
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
                    data.user.id,
                    email,
                    firstName,
                    lastName,
                    sect
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
     * Create customer profile in the database
     */
    const createCustomerProfile = async (
        userId: string,
        email: string,
        firstName?: string,
        lastName?: string,
        sect?: string
    ) => {
        try {
            const { error: insertError } = await supabase
                .from('customer_profile')
                .insert({
                    customer_id: userId,
                    customer_email_id: email,
                    customer_first_name: firstName || null,
                    customer_last_name: lastName || null,
                    customer_sect: sect || null,
                })

            if (insertError) {
                return { success: false, error: insertError.message }
            }

            return { success: true }
        } catch (err: any) {
            return { success: false, error: err.message || 'Profile creation failed' }
        }
    }

    /**
     * Get customer profile from database
     */
    const getCustomerProfile = async (userId: string) => {
        try {
            const { data, error: fetchError } = await supabase
                .from('customer_profile')
                .select('*')
                .eq('customer_id', userId)
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
     * Update customer profile in database
     */
    const updateCustomerProfile = async (
        userId: string,
        updates: {
            customer_first_name?: string
            customer_last_name?: string
            customer_mobile?: number
            customer_sect?: string
        }
    ) => {
        try {
            const { data, error: updateError } = await supabase
                .from('customer_profile')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('customer_id', userId)
                .select()
                .single()

            if (updateError) {
                return { success: false, error: updateError.message }
            }

            return { success: true, data }
        } catch (err: any) {
            return { success: false, error: err.message || 'Profile update failed' }
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
    }
}
