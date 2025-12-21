/**
 * useSupabase Composable
 * Initialize and provide Supabase client
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export const useSupabase = () => {
  // Return existing instance if available
  if (supabaseInstance) {
    return { supabase: supabaseInstance }
  }

  // Get config from Nuxt runtime config
  const config = useRuntimeConfig()

  // const supabaseUrl = config.public.supabaseUrl as string
  // const supabaseKey = config.public.supabaseAnonKey as string
  const supabaseUrl = "https://cfmvkvpyjvbcenqorifa.supabase.co"
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbXZrdnB5anZiY2VucW9yaWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTM0MjQsImV4cCI6MjA4MDg2OTQyNH0.lWTSNFoT9LteNnRzVXKjgbe2YORyS9275p2lYDH2bZ4"

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    })
    throw new Error('Supabase URL and Anon Key are required. Please configure NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY in .env.local file.')
  }

  // Create singleton instance
  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  })

  return { supabase: supabaseInstance }
}
