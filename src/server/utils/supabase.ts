/**
 * Server-side Supabase client utility
 */
import { createClient } from '@supabase/supabase-js'
import { getHeader, type H3Event } from 'h3'

// Resolve credentials from environment — no hardcoded fallbacks
const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseAdmin: ReturnType<typeof createClient> | null = null

/** Supabase client for auth operations only (public schema) */
export function getSupabaseAdmin() {
    if (!supabaseAdmin) {
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase environment variables. Check .env file.')
        }
        supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            }
        })
    }
    return supabaseAdmin
}

/** Supabase client configured for the tirthlok schema (all data tables) */
let supabaseTirthlok: ReturnType<typeof createClient> | null = null

export function getSupabaseTirthlok() {
    if (!supabaseTirthlok) {
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase environment variables. Check .env file.')
        }
        supabaseTirthlok = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
            db: {
                schema: 'tirthlok',
            },
        })
    }
    return supabaseTirthlok
}

/**
 * Get user ID from Authorization header (Bearer token)
 * Returns null if not authenticated
 */
export async function getUserIdFromEvent(event: H3Event): Promise<string | null> {
    const authHeader = getHeader(event, 'authorization')

    if (!authHeader?.startsWith('Bearer ')) {
        return null
    }

    const token = authHeader.substring(7)
    const supabase = getSupabaseAdmin()

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token)
        if (error) {
            console.error('[auth] token verification failed:', error.message)
            return null
        }
        if (!user) {
            return null
        }
        return user.id
    } catch (err: any) {
        console.error('[auth] exception during token verification:', err.message)
        return null
    }
}
