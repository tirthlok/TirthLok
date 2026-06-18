import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export const useSupabase = () => {
  if (import.meta.server) {
    throw new Error(
      '[useSupabase] Client-side only. ' +
      'Server routes must use getSupabaseAdmin() or getSupabaseTirthlok().'
    )
  }

  if (supabaseInstance) return { supabase: supabaseInstance }

  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl  as string
  const supabaseKey = config.public.supabaseAnonKey as string

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      '[useSupabase] Missing credentials. ' +
      'Set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY in .env'
    )
  }

  // createBrowserClient stores session in HttpOnly cookies — not localStorage.
  // Tokens are invisible to JavaScript. XSS cannot steal them.
  supabaseInstance = createBrowserClient(supabaseUrl, supabaseKey)

  return { supabase: supabaseInstance }
}
