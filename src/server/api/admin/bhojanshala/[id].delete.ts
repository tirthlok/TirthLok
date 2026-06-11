import { requireAdmin } from '~/server/utils/adminContext'
import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const ctx           = await requireAdmin(event)
  const bhojanshalaId = getRouterParam(event, 'id')

  if (!bhojanshalaId) {
    throw createError({ statusCode: 400, statusMessage: 'Bhojanshala ID required' })
  }

  const supabase = getSupabaseTirthlok() as any

  // Tirth manager ownership check
  if (ctx.isManager) {
    if (!ctx.tirthId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tirth assigned to your account'
      })
    }
    const { data: existing } = await supabase
      .from('bhojanshala_cards')
      .select('tirth_id')
      .eq('bhojanshala_id', bhojanshalaId)
      .single()

    if (!existing || existing.tirth_id !== ctx.tirthId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have access to this bhojanshala'
      })
    }
  }

  // Soft delete
  const { error } = await supabase
    .from('bhojanshala_cards')
    .update({
      is_active:  false,
      updated_at: new Date().toISOString()
    })
    .eq('bhojanshala_id', bhojanshalaId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Delete failed' })
  }

  return { success: true }
})
