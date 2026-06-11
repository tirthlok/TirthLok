import { requireAdmin } from '~/server/utils/adminContext'
import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const ctx      = await requireAdmin(event)
  const supabase = getSupabaseTirthlok() as any

  let dbQuery = supabase
    .from('bhojanshala_cards')
    .select(`
      bhojanshala_id,
      tirth_id,
      bhojanshala_name,
      bhojanshala_city,
      bhojanshala_state,
      bhojanshala_type,
      is_active,
      tags,
      tirth:tirth_id (tirth_name),
      details:bhojanshala_details (seating_capacity, manager_name)
    `)
    .order('bhojanshala_name')

  // Tirth manager: only see bhojanshalas for their tirth
  if (ctx.isManager) {
    if (!ctx.tirthId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tirth assigned to your account'
      })
    }
    dbQuery = dbQuery.eq('tirth_id', ctx.tirthId)
  }

  const { data, error } = await dbQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch bhojanshalas' })
  }

  return data || []
})
