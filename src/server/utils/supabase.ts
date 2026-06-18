/**
 * Server-side Supabase client utility
 */
import { createClient } from '@supabase/supabase-js'
import { getHeader, type H3Event } from 'h3'

// Resolve credentials from environment — no hardcoded fallbacks
const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

let supabaseAdmin: ReturnType<typeof createClient> | null = null

/** Supabase client for auth operations only (public schema) */
export function getSupabaseAdmin() {
    if (!supabaseAdmin) {
        if (!supabaseUrl) {
            throw new Error(
                '[getSupabaseAdmin] NUXT_PUBLIC_SUPABASE_URL is not set. Check .env file.'
            )
        }
        if (!supabaseServiceKey) {
            throw new Error(
                '[getSupabaseAdmin] SUPABASE_SERVICE_KEY is not set. ' +
                'Never use the anon key as a fallback — it cannot bypass RLS ' +
                'and will silently break all admin operations. ' +
                'Add SUPABASE_SERVICE_KEY to your .env file.'
            )
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
        if (!supabaseUrl) {
            throw new Error(
                '[getSupabaseTirthlok] NUXT_PUBLIC_SUPABASE_URL is not set. Check .env file.'
            )
        }
        if (!supabaseServiceKey) {
            throw new Error(
                '[getSupabaseTirthlok] SUPABASE_SERVICE_KEY is not set. ' +
                'Never use the anon key as a fallback — it cannot bypass RLS ' +
                'and will silently break all data operations. ' +
                'Add SUPABASE_SERVICE_KEY to your .env file.'
            )
        }
        supabaseTirthlok = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
            db: {
                schema: 'tirthlok' as string,
            },
        })
    }
    return supabaseTirthlok
}

/**
 * Verify the requesting user's identity from either a cookie session
 * or a Bearer token. Both paths call getUser() — a network-verified
 * call to Supabase Auth — never trusting local cookie state alone.
 *
 * PATH 1: Cookie (all standard browser requests)
 *   server/middleware/session.ts extracts the raw access_token from
 *   the HttpOnly cookie and stores it in event.context.accessToken.
 *   We call getUser(token) to verify it against Supabase Auth server.
 *   Catches: expired tokens, revoked accounts, forged JWTs.
 *
 * PATH 2: Bearer token (invoice page only)
 *   invoice/[bookingId].vue is ssr:false and reads the session
 *   client-side via supabase.auth.getSession(), then sends the
 *   access_token as Authorization: Bearer <token>.
 *   Same getUser(token) verification as PATH 1.
 */
export async function getUserIdFromEvent(
  event: H3Event
): Promise<string | null> {
  const supabase = getSupabaseAdmin()

  // PATH 1 — Cookie session (set by server/middleware/session.ts)
  if (event.context.accessToken) {
    try {
      const { data: { user }, error } =
        await supabase.auth.getUser(event.context.accessToken)
      if (error || !user) return null
      return user.id
    } catch {
      return null
    }
  }

  // PATH 2 — Bearer token fallback (invoice page)
  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const { data: { user }, error } =
        await supabase.auth.getUser(token)
      if (error || !user) return null
      return user.id
    } catch {
      return null
    }
  }

  return null
}
