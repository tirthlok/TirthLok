/**
 * GET /api/tirth - Fetch all tirth locations with pagination from Supabase
 * Server-side only endpoint that queries Supabase directly
 */
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔌 Server API: /api/tirth called')
    
    // Get Supabase config - try runtime config first, then fallback to environment
    const config = useRuntimeConfig()
    let supabaseUrl = config.public?.supabaseUrl
    let supabaseKey = config.public?.supabaseAnonKey
    
    // Fallback to service role key for full schema access
    if (!supabaseUrl) {
      supabaseUrl = 'https://cfmvkvpyjvbcenqorifa.supabase.co'
    }
    if (!supabaseKey) {
      // Use service role key for full access to all schemas including tirthlok
      supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbXZrdnB5anZiY2VucW9yaWZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI5MzQyNCwiZXhwIjoyMDgwODY5NDI0fQ.fLyzNci3KFvO--KEo342_3aYvWk6I4qWnxtXMz74ZEA'
    }

    console.log('📊 Supabase config:', { url: !!supabaseUrl, key: !!supabaseKey })

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Query using RPC or raw access to tirthlok schema
    // Since the table is in tirthlok schema, we'll use rpc if available
    // or try to access it directly via query
    const query = getQuery(event)
    const page = parseInt(String(query.page) || '1')
    const limit = parseInt(String(query.limit) || '10')
    const search = String(query.search || '')
    const sect = String(query.sect || '')
    const type = String(query.type || '')

    // Try querying the table directly
    // With service role key, we should have access to tirthlok schema
    try {
      const limit = parseInt(String(query.limit) || '10')
      const page = parseInt(String(query.page) || '1')
      const offset = (page - 1) * limit
      
      // Try querying - service role key gives us access to all schemas
      let supabaseQuery = supabase
        .from('tirth_cards')
        .select('*', { count: 'exact' })

      // Apply filters
      if (sect) {
        supabaseQuery = supabaseQuery.eq('tirth_sect', sect)
      }
      if (type) {
        supabaseQuery = supabaseQuery.eq('tirth_kshetra', type)
      }
      if (search) {
        supabaseQuery = supabaseQuery.ilike('tirth_name', `%${search}%`)
      }

      // Apply pagination
      const { data, error, count } = await supabaseQuery.range(offset, offset + limit - 1)

      console.log('📊 Supabase response:', { dataCount: data?.length, error: error?.message, total: count })

      if (error) {
        console.error('❌ Supabase query error:', error)
        throw error
      }

      return {
        success: true,
        data: data || [],
        pagination: {
          total: count || 0,
          page,
          pages: Math.ceil((count || 0) / limit),
        },
      }
    } catch (innerError: any) {
      throw innerError
    }
  } catch (error: any) {
    console.error('❌ Server API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to fetch tirth locations from Supabase',
    })
  }
})
