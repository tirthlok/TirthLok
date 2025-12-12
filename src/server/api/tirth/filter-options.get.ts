export default defineEventHandler(async () => {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    
    // Get Supabase config - try runtime config first, then fallback to environment
    const config = useRuntimeConfig()
    let supabaseUrl = config.public?.supabaseUrl
    let supabaseKey = config.public?.supabaseAnonKey
    
    // Fallback to hardcoded values
    if (!supabaseUrl) {
      supabaseUrl = 'https://cfmvkvpyjvbcenqorifa.supabase.co'
    }
    if (!supabaseKey) {
      supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbXZrdnB5anZiY2VucW9yaWZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI5MzQyNCwiZXhwIjoyMDgwODY5NDI0fQ.fLyzNci3KFvO--KEo342_3aYvWk6I4qWnxtXMz74ZEA'
    }

    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        error: 'Supabase credentials not configured',
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all unique states from tirth_cards table
    const { data: statesData, error: statesError } = await supabase
      .from('tirth_cards')
      .select('tirth_state')
      .not('tirth_state', 'is', null)

    // Fetch all unique sects from tirth_cards table
    const { data: sectsData, error: sectsError } = await supabase
      .from('tirth_cards')
      .select('tirth_sect')
      .not('tirth_sect', 'is', null)

    // Fetch all unique types (kshetra) from tirth_cards table
    const { data: typesData, error: typesError } = await supabase
      .from('tirth_cards')
      .select('tirth_kshetra')
      .not('tirth_kshetra', 'is', null)

    if (statesError || sectsError || typesError) {
      console.error('Filter options error:', { statesError, sectsError, typesError })
      return {
        success: false,
        error: 'Failed to fetch filter options',
      }
    }

    // Extract unique values
    const states = [...new Set(statesData?.map(d => d.tirth_state).filter(Boolean) || [])].sort()
    const sects = [...new Set(sectsData?.map(d => d.tirth_sect).filter(Boolean) || [])].sort()
    const types = [...new Set(typesData?.map(d => d.tirth_kshetra).filter(Boolean) || [])].sort()

    // For facilities, fetch from tirth_details table since they might be stored there
    const { data: facilitiesData, error: facilitiesError } = await supabase
      .from('tirth_details')
      .select('facilities')
      .not('facilities', 'is', null)

    let facilities: string[] = []
    if (!facilitiesError && facilitiesData) {
      const facilitiesSet = new Set<string>()
      facilitiesData.forEach((item: any) => {
        if (item.facilities) {
          try {
            const parsed = typeof item.facilities === 'string' ? JSON.parse(item.facilities) : item.facilities
            if (Array.isArray(parsed)) {
              parsed.forEach((f: any) => {
                if (f.type) facilitiesSet.add(f.type)
              })
            }
          } catch (e) {
            // Skip parsing errors
          }
        }
      })
      facilities = Array.from(facilitiesSet).sort()
    }

    return {
      success: true,
      data: {
        states,
        sects,
        types,
        facilities,
      },
    }
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return {
      success: false,
      error: 'Internal server error',
    }
  }
})
