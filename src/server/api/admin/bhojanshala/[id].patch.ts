import { requireAdmin } from '~/server/utils/adminContext'
import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const ctx           = await requireAdmin(event)
  const bhojanshalaId = getRouterParam(event, 'id')
  const body          = await readBody(event)

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

  // Validate type if provided
  if (body.bhojanshala_type &&
      !['free', 'paid', 'donation'].includes(body.bhojanshala_type)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid bhojanshala type' })
  }

  // Update card
  const cardFields: Record<string, any> = {
    updated_at: new Date().toISOString()
  }
  const cardAllowed = [
    'bhojanshala_name', 'bhojanshala_city', 'bhojanshala_state',
    'bhojanshala_address', 'bhojanshala_phone', 'bhojanshala_email',
    'bhojanshala_type', 'bhojanshala_images', 'tags', 'is_active', 'tirth_id'
  ]
  for (const field of cardAllowed) {
    if (body[field] !== undefined) cardFields[field] = body[field]
  }

  if (Object.keys(cardFields).length > 1) {
    const { error } = await supabase
      .from('bhojanshala_cards')
      .update(cardFields)
      .eq('bhojanshala_id', bhojanshalaId)
    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }
  }

  // Update details
  const detailFields: Record<string, any> = {
    updated_at: new Date().toISOString()
  }
  const detailAllowed = [
    'about', 'meal_timings', 'facilities', 'dietary_info',
    'rules', 'special_services', 'seating_capacity',
    'languages_spoken', 'payment_info', 'manager_name', 'manager_phone'
  ]
  for (const field of detailAllowed) {
    if (body[field] !== undefined) detailFields[field] = body[field]
  }

  if (Object.keys(detailFields).length > 1) {
    const { error } = await supabase
      .from('bhojanshala_details')
      .upsert({ bhojanshala_id: bhojanshalaId, ...detailFields })
    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }
  }

  return { success: true }
})
