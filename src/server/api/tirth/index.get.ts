/**
 * GET /api/tirth - Fetch all tirth locations with pagination
 * ============================================================
 * Server-side endpoint that queries Supabase database directly
 * 
 * Query Parameters:
 *  - page: Page number (1-indexed, default: 1)
 *  - limit: Items per page (default: 10)
 *  - search: Search by tirth name (case-insensitive)
 *  - sect: Filter by sect (Digambar/Shwetambar)
 *  - type: Filter by tirth type (kshetra)
 * 
 * Response:
 *  {
 *    success: boolean,
 *    data: Tirth[],
 *    pagination: { total, page, pages }
 *  }
 */

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔌 Server API: /api/tirth called')
    
    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    const config = useRuntimeConfig()
    let supabaseUrl = config.public?.supabaseUrl
    let supabaseKey = config.public?.supabaseAnonKey
    
    // Fallback to hardcoded credentials if not in environment
    if (!supabaseUrl) {
      supabaseUrl = 'https://cfmvkvpyjvbcenqorifa.supabase.co'
    }
    if (!supabaseKey) {
      supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbXZrdnB5anZiY2VucW9yaWZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI5MzQyNCwiZXhwIjoyMDgwODY5NDI0fQ.fLyzNci3KFvO--KEo342_3aYvWk6I4qWnxtXMz74ZEA'
    }

    console.log('📊 Supabase config:', { url: !!supabaseUrl, key: !!supabaseKey })

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // ========================================================================
    // PARSE QUERY PARAMETERS
    // ========================================================================

    const query = getQuery(event)
    const page = parseInt(String(query.page) || '1')
    const limit = parseInt(String(query.limit) || '10')
    const search = String(query.search || '')
    const sect = String(query.sect || '')
    const type = String(query.type || '')
    const offset = (page - 1) * limit

    // ========================================================================
    // DATABASE QUERY
    // ========================================================================

    try {
      // Build query with filters
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

      // =====================================================================
      // TRANSFORM RESPONSE
      // =====================================================================

      const transformedData = (data || []).map((row: any) => {
        // Parse images JSON if needed
        let images = row.tirth_images || []
        if (typeof images === 'string') {
          try {
            images = JSON.parse(images)
          } catch {
            images = [images]
          }
        }

        return {
          id: row.id || `tirth-${row.tirth_name}`,
          name: row.tirth_name || '',
          description: row.tirth_description || '',
          historicalBackground: row.tirth_history || 'To be Updated Soon',
          foundingYear: row.tirth_founding_year || 0,
          foundingDetails: row.tirth_founding_details || 'To be Updated Soon',
          pratisthaYear: row.tirth_pratistha_year || 0,
          acharya: row.tirth_acharya || 'To be Updated Soon',
          architecture: row.tirth_architecture || 'To be Updated Soon',
          moolnayak: row.tirth_moolnayak || [{
            name: row.tirth_name || 'Main Idol',
            height: 'To be Updated Soon',
            metal: 'To be Updated Soon',
            year: 'To be Updated Soon',
            details: 'To be Updated Soon',
          }],
          specialFacts: row.tirth_special_facts 
            ? (Array.isArray(row.tirth_special_facts) ? row.tirth_special_facts : [row.tirth_special_facts])
            : [],
          poojaTimings: row.tirth_pooja_timings || 'To be Updated Soon',
          darshanTimings: row.tirth_darshan_timings || 'To be Updated Soon',
          festivals: row.tirth_festivals || [],
          location: {
            city: row.tirth_city || '',
            state: row.tirth_state || '',
            latitude: row.tirth_latitude || 0,
            longitude: row.tirth_longitude || 0,
            address: row.tirth_address || `${row.tirth_city}, ${row.tirth_state}`,
          },
          images: Array.isArray(images) ? images : [images].filter(Boolean),
          sect: row.tirth_sect as 'Shwetambar' | 'Digambar' || 'Shwetambar',
          type: row.tirth_kshetra || 'Other',
          facilities: row.tirth_facilities || [],
          rating: row.tirth_rating || 0,
          reviews: row.tirth_reviews || 0,
          travelDuration: row.tirth_travel_duration || '',
          rules: row.tirth_rules 
            ? (Array.isArray(row.tirth_rules) ? row.tirth_rules : [row.tirth_rules])
            : [],
        }
      })

      // =====================================================================
      // SUCCESS RESPONSE
      // =====================================================================

      return {
        success: true,
        data: transformedData,
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

