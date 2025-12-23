/**
 * Server-side Supabase client utility
 */
import { createClient } from '@supabase/supabase-js'
import { getHeader, type H3Event } from 'h3'

// Server-side Supabase client (uses service role for admin operations)
const supabaseUrl = process.env.SUPABASE_URL || "https://cfmvkvpyjvbcenqorifa.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbXZrdnB5anZiY2VucW9yaWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTM0MjQsImV4cCI6MjA4MDg2OTQyNH0.lWTSNFoT9LteNnRzVXKjgbe2YORyS9275p2lYDH2bZ4"

let supabaseAdmin: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
    if (!supabaseAdmin) {
        supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            }
        })
    }
    return supabaseAdmin
}

/**
 * Get user ID from Authorization header (Bearer token)
 * Returns null if not authenticated
 */
export async function getUserIdFromEvent(event: H3Event): Promise<string | null> {
    const authHeader = getHeader(event, 'authorization')
    console.log('[Wishlist Auth] Auth header present:', !!authHeader)

    if (!authHeader?.startsWith('Bearer ')) {
        console.log('[Wishlist Auth] No Bearer token found')
        return null
    }

    const token = authHeader.substring(7)
    console.log('[Wishlist Auth] Token length:', token.length)

    const supabase = getSupabaseAdmin()

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token)
        if (error) {
            console.log('[Wishlist Auth] Supabase auth error:', error.message)
            return null
        }
        if (!user) {
            console.log('[Wishlist Auth] No user returned')
            return null
        }
        console.log('[Wishlist Auth] User authenticated:', user.id)
        return user.id
    } catch (err: any) {
        console.log('[Wishlist Auth] Exception:', err.message)
        return null
    }
}

