/**
 * useSupabase Composable
 * Initialize and provide Supabase client
 */

import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  // Get from environment at build time, fallback to window for client-side
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || (typeof window !== 'undefined' && (window as any).__NUXT__?.config?.public?.supabaseUrl)
  const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || (typeof window !== 'undefined' && (window as any).__NUXT__?.config?.public?.supabaseAnonKey)

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey })
    throw new Error('Supabase URL and Anon Key are required')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  return { supabase }
}
