/**
 * Auth Middleware
 * Protects routes that require authentication
 * Redirects to login page if user is not authenticated
 */

import { useAuth } from '~/composables/auth/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
    // Only run on client side
    if (import.meta.server) return

    const { initialize, isAuthenticated } = useAuth()

    // Initialize auth state
    await initialize()

    // If not authenticated, redirect to login
    if (!isAuthenticated.value) {
        return navigateTo({
            path: '/auth/login',
            query: { redirect: to.fullPath }
        })
    }
})
