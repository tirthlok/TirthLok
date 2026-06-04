/**
 * GET /api/dharamshala/:id - Fetch single dharamshala by ID
 * The :id parameter should be the dharamshala_id (e.g. DL-GJ-0001)
 * Queries tirthlok.dharamshala_cards + tirthlok.dharamshala_details
 */
import { getSupabaseTirthlok } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dharamshala ID is required',
    })
  }

  try {
    const supabase = getSupabaseTirthlok()

    // Fetch card data
    const { data: cardData, error: cardError } = await supabase
      .from('dharamshala_cards')
      .select('*')
      .eq('dharamshala_id', decodeURIComponent(id))
      .single()

    if (cardError || !cardData) {
      throw createError({ statusCode: 404, statusMessage: 'Dharamshala not found' })
    }

    // Fetch detail data
    let detailData: any = null
    try {
      const { data: details } = await supabase
        .from('dharamshala_details')
        .select('*')
        .eq('dharamshala_id', decodeURIComponent(id))
        .single()

      if (details) {
        detailData = details
      }
    } catch {
      // Details may not exist — not an error
    }

    // Merge and return
    const result = { ...cardData, ...detailData }
    delete result.dharamshala_latitude
    delete result.dharamshala_longitude
    return result
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('[dharamshala] detail fetch failed:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dharamshala details',
    })
  }
})
