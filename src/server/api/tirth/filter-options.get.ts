/**
 * GET /api/tirth/filter-options - Fetch unique filter values
 * Queries tirthlok.tirth_cards directly
 */
import { getSupabaseTirthlok } from '../../utils/supabase'

export default defineEventHandler(async () => {
  try {
    const supabase = getSupabaseTirthlok()

    // Fetch all unique states from tirth_cards
    const { data: statesData, error: statesError } = await supabase
      .from('tirth_cards')
      .select('tirth_state')
      .not('tirth_state', 'is', null)

    // Fetch all unique sects from tirth_cards
    const { data: sectsData, error: sectsError } = await supabase
      .from('tirth_cards')
      .select('tirth_sect')
      .not('tirth_sect', 'is', null)

    // Fetch all unique types (kshetra) from tirth_cards
    const { data: typesData, error: typesError } = await supabase
      .from('tirth_cards')
      .select('tirth_kshetra')
      .not('tirth_kshetra', 'is', null)

    if (statesError || sectsError || typesError) {
      console.error('[filter-options] fetch failed:', statesError?.message || sectsError?.message || typesError?.message)
      return {
        success: false,
        error: 'Failed to fetch filter options',
      }
    }

    // Extract unique values
    const states = [...new Set(statesData?.map(d => d.tirth_state).filter(Boolean) || [])].sort()
    const sects = [...new Set(sectsData?.map(d => d.tirth_sect).filter(Boolean) || [])].sort()
    const types = [...new Set(typesData?.map(d => d.tirth_kshetra).filter(Boolean) || [])].sort()

    // For facilities, fetch from tirth_details since they might be stored there
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
  } catch (error: any) {
    console.error('[filter-options] fetch failed:', error.message)
    return {
      success: false,
      error: 'Internal server error',
    }
  }
})
