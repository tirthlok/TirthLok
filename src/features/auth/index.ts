/**
 * Auth Feature
 * Authentication and user management
 */

// Composables
export { useAuth } from './composables/useAuth'
export { useSupabase } from './composables/useSupabase'

// Re-export types if needed
export type { User, Session } from '@supabase/supabase-js'
