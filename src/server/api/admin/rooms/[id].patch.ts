import { getSupabaseTirthlok, getUserIdFromEvent } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromEvent(event)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const roomId = getRouterParam(event, 'id')
  const body   = await readBody(event)

  const allowedFields = [
    'name', 'description', 'base_price', 'discount_price',
    'total_inventory', 'is_available_ui', 'is_active',
    'amenities', 'bed_configuration', 'capacity', 'max_guests',
  ]

  const updateData: Record<string, any> = { updated_at: new Date().toISOString() }
  for (const field of allowedFields) {
    if (body[field] !== undefined) updateData[field] = body[field]
  }

  const supabase = getSupabaseTirthlok()

  const { data, error } = await supabase
    .from('room_types')
    .update(updateData)
    .eq('room_type_id', roomId)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Update failed' })
  }

  return data
})
