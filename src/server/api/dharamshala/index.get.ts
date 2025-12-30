/**
 * GET /api/dharamshala - Fetch all dharamshala locations from Supabase
 * Server-side only endpoint that queries Supabase directly
 */
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔌 Server API: /api/dharamshala called')

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

    // Query the v_dharamshala_cards view
    const query = getQuery(event)
    const search = String(query.search || '')

    try {
      let supabaseQuery = supabase
        .from('v_dharamshala_cards')
        .select('*')

      // Apply search filter if provided
      if (search) {
        supabaseQuery = supabaseQuery.ilike('dharamshala_name', `%${search}%`)
      }

      const { data, error } = await supabaseQuery

      console.log('📊 Supabase response:', { dataCount: data?.length, error: error?.message })

      if (error) {
        console.error('❌ Supabase query error:', error)
        throw error
      }

      // Transform the data to match the Dharamshala model
      const transformedData = (data || []).map((row: any) => {
        let images = row.dharamshala_images || []
        if (typeof images === 'string') {
          try {
            images = JSON.parse(images)
          } catch {
            images = [images]
          }
        }

        let amenities = row.dharamshala_amenities || []
        if (typeof amenities === 'string') {
          try {
            amenities = JSON.parse(amenities)
          } catch {
            amenities = [amenities]
          }
        }

        return {
          id: row.dharamshala_name || 'unknown',
          name: row.dharamshala_name || '',
          description: row.dharamshala_description || '',
          location: {
            city: row.dharamshala_city || '',
            state: row.dharamshala_state || '',
            latitude: row.dharamshala_latitude || 0,
            longitude: row.dharamshala_longitude || 0,
            address: row.dharamshala_address || `${row.dharamshala_city}, ${row.dharamshala_state}`,
          },
          images: Array.isArray(images) ? images : [images].filter(Boolean),
          amenities: Array.isArray(amenities) ? amenities : [],
          capacity: row.dharamshala_capacity || 0,
          contactInfo: {
            phone: row.dharamshala_phone || '',
            email: row.dharamshala_email || '',
            website: row.dharamshala_website || '',
          },
          bookingInfo: {
            bookingRequired: row.dharamshala_booking_required || false,
            bookingUrl: row.dharamshala_booking_url || '',
            bookingPhone: row.dharamshala_booking_phone || '',
          },
          priceRange: row.dharamshala_price_range || '',
          rating: row.dharamshala_rating || 0,
          reviews: row.dharamshala_reviews || 0,
          type: row.dharamshala_type || 'General',
          dharamshala_grouping: row.dharamshala_grouping || undefined,
          dharamshala_tags: row.dharamshala_tags ? (Array.isArray(row.dharamshala_tags) ? row.dharamshala_tags : [row.dharamshala_tags]) : undefined,
        }
      })

      // Fallback to sample data for development if database returns empty
      if (transformedData.length === 0) {
        const { sampleDharamshalas } = await import('~/server/utils/sampleData')
        return sampleDharamshalas
      }

      return transformedData
    } catch (innerError: any) {
      throw innerError
    }
  } catch (error: any) {
    console.error('❌ Server API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to fetch dharamshala locations from Supabase',
    })
  }
})
