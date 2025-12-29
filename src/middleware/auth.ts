/**
 * Auth Middleware
 * Protects routes that require authentication
 * Redirects to login page if user is not authenticated
 */

import { useAuth } from '~/features/auth/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
    const { initialize, isFullyAuthenticated } = useAuth()

    // Initialize auth state
    await initialize()

    // If not fully authenticated (e.g. in recovery mode or not logged in), redirect to login
    if (!isFullyAuthenticated.value) {
        return navigateTo({
            path: '/auth/login',
            query: { redirect: to.fullPath }
        }, { replace: true })
    }
})
