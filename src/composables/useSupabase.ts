/**
 * useSupabase Composable
 * Initialize and provide Supabase client
 */

import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseAnonKey

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Anon Key are required')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  return { supabase }
}
