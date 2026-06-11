import { getSupabaseTirthlok } from '~/server/utils/supabase'
import { requireAdmin } from '~/server/utils/adminContext'

export default defineEventHandler(async (event) => {
  const ctx = await requireAdmin(event)

  const roomId = getRouterParam(event, 'id')

  // Verify manager owns this room's dharamshala
  if (ctx.isManager && ctx.dharamshalaId) {
    const supabase = getSupabaseTirthlok() as any
    const { data: room } = await supabase
      .from('room_types')
      .select('dharamshala_id')
      .eq('room_type_id', roomId)
      .single()

    if (!room || room.dharamshala_id !== ctx.dharamshalaId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You do not have access to this room'
      })
    }
  }

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

  const { data, error } = await (supabase
    .from('room_types') as any)
    .update(updateData)
    .eq('room_type_id', roomId)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Update failed' })
  }

  return data
})
