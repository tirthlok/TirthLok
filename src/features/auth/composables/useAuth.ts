/**
 * useAuth Composable
 * Provides Supabase authentication methods for email/password auth
 */

import { ref, computed } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import { useSupabase } from './useSupabase'
import { useCustomerProfile } from './useCustomerProfile'

// Shared state across all instances
const currentUser = ref<User | null>(null)
const currentSession = ref<Session | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const initialized = ref(false)
const isRecoveryMode = ref(false)

export const useAuth = () => {
    // Lazily resolve the Supabase client only when a method actually
    // uses it — not at composable creation time. useAuth() is invoked
    // during SSR (Header, layouts, pages) where no auth action runs,
    // so the client must not be created at that point.
    const getSupabase = () => {
        if (import.meta.server) return null
        return useSupabase().supabase
    }
    const {
        getProfile,
        updateProfile,
        ensureProfileExists
    } = useCustomerProfile()

    // Computed states
    const isAuthenticated = computed(() => !!currentSession.value)
    const isFullyAuthenticated = computed(() => !!currentSession.value && !isRecoveryMode.value)
    const user = computed(() => currentUser.value)
    const session = computed(() => currentSession.value)

    /**
     * Initialize auth state and listen for changes
     */
    const initialize = async () => {
        if (initialized.value) return
        const supabase = getSupabase()
        if (!supabase) return

        try {
            // Get initial session
            const { data: { session: initialSession } } = await supabase.auth.getSession()
            currentSession.value = initialSession
            currentUser.value = initialSession?.user ?? null

            // Detect recovery mode from URL hash or sessionStorage on initial load
            if (typeof window !== 'undefined') {
                if (window.location.hash.includes('type=recovery') || sessionStorage.getItem('isRecoveryMode') === 'true') {
                    isRecoveryMode.value = true
                    if (window.location.hash.includes('type=recovery')) {
                        sessionStorage.setItem('isRecoveryMode', 'true')
                    }
                }
            }

            // Listen for auth state changes
            supabase.auth.onAuthStateChange((event, session) => {
              currentSession.value = session
              currentUser.value    = session?.user ?? null

              if (event === 'PASSWORD_RECOVERY') {
                isRecoveryMode.value = true
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('isRecoveryMode', 'true')
                }
                return
              }

              if (event === 'SIGNED_OUT') {
                currentSession.value = null
                currentUser.value    = null
                isRecoveryMode.value = false
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('isRecoveryMode')
                }
                return
              }

              if (event === 'USER_UPDATED') {
                isRecoveryMode.value = false
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('isRecoveryMode')
                }
                return
              }
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
        const supabase = getSupabase()
        if (!supabase) {
            return { success: false, error: 'Not available during server rendering' }
        }

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
                // We rely on the DB trigger for creation.
                // We call ensureProfileExists just to verify and wait for the trigger 
                // to finish so the UI sees the new profile immediately.
                await ensureProfileExists()
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
        const supabase = getSupabase()
        if (!supabase) {
            return { success: false, error: 'Not available during server rendering' }
        }

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

            // onAuthStateChange handles state update — no manual set needed
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
      const supabase = getSupabase()

      loading.value = true
      error.value = null

      // Clear local state immediately — UI updates before network call
      currentUser.value    = null
      currentSession.value = null
      isRecoveryMode.value = false
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('isRecoveryMode')
      }

      if (!supabase) {
        loading.value = false
        return { success: true }
      }

      try {
        await supabase.auth.signOut()
      } catch (err) {
        // supabase.auth.signOut() failed — manually clear localStorage
        // so a page refresh does not restore the session
        if (typeof window !== 'undefined') {
          const projectRef = (supabase as any).supabaseUrl
            ?.split('//')[1]?.split('.')[0] || ''
          if (projectRef) {
            localStorage.removeItem(`sb-${projectRef}-auth-token`)
            localStorage.removeItem(`sb-${projectRef}-auth-token.0`)
            localStorage.removeItem(`sb-${projectRef}-auth-token.1`)
          }
        }
      } finally {
        loading.value = false
      }

      return { success: true }
    }

    /**
     * Verify password reset token
     */
    const verifyResetToken = async (email: string, token: string) => {
        const supabase = getSupabase()
        if (!supabase) {
            return { success: false, error: 'Not available during server rendering' }
        }

        loading.value = true
        error.value = null

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'recovery'
            })

            if (verifyError) {
                error.value = verifyError.message
                return { success: false, error: verifyError.message }
            }

            // Successful verification puts us in recovery mode
            isRecoveryMode.value = true

            return { success: true }
        } catch (err: any) {
            error.value = err.message || 'Verification failed'
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    /**
     * Send password reset email
     */
    const resetPassword = async (email: string) => {
        const supabase = getSupabase()
        if (!supabase) {
            return { success: false, error: 'Not available during server rendering' }
        }

        loading.value = true
        error.value = null

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            })

            if (resetError) {
                error.value = resetError.message
                return { success: false, error: resetError.message }
            }

            return { success: true }
        } catch (err: any) {
            error.value = err.message || 'Password reset failed'
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    /**
     * Update user password
     */
    const updatePassword = async (newPassword: string) => {
        const supabase = getSupabase()
        if (!supabase) {
            return { success: false, error: 'Not available during server rendering' }
        }

        loading.value = true
        error.value = null

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (updateError) {
                error.value = updateError.message
                return { success: false, error: updateError.message }
            }

            return { success: true }
        } catch (err: any) {
            error.value = err.message || 'Password update failed'
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    /**
     * Check if a user already exists with the given email
     */
    const checkUserExists = async (email: string) => {
        const supabase = getSupabase()
        if (!supabase) return false

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
        isFullyAuthenticated,
        isRecoveryMode,
        loading,
        error,
        initialized,
        // Methods
        initialize,
        signUp,
        signIn,
        signOut,
        resetPassword,
        verifyResetToken,
        updatePassword,
        // Profile Methods (Delegated to useCustomerProfile)
        createCustomerProfile: ensureProfileExists,
        getCustomerProfile: async () => {
            if (isRecoveryMode.value) {
                return { success: false, error: 'Restricted access: Please complete password reset first.', data: null }
            }
            return await getProfile()
        },
        updateCustomerProfile: async (updates: any) => {
            if (isRecoveryMode.value) {
                return { success: false, error: 'Restricted access: Please complete password reset first.' }
            }
            return await updateProfile({
                firstName: updates.customer_first_name,
                lastName: updates.customer_last_name,
                mobile: updates.customer_mobile,
                sect: updates.customer_sect
            })
        },
        checkUserExists,
    }
}
