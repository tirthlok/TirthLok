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
      // Fallback to sample data
      const { sampleDharamshalas } = await import('~/server/utils/sampleData')
      const dh = sampleDharamshalas.find((d: any) => d.id === id)

      if (!dh) {
        throw createError({ statusCode: 404, statusMessage: 'Dharamshala not found' })
      }
      return dh
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
    return { ...cardData, ...detailData }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('[dharamshala] detail fetch failed:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dharamshala details',
    })
  }
})
