import { requireAdmin } from '~/server/utils/adminContext'
import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const ctx     = await requireAdmin(event)
  const roomId  = getRouterParam(event, 'id')

  if (!roomId) {
    throw createError({ statusCode: 400, statusMessage: 'Room ID required' })
  }

  const supabase = getSupabaseTirthlok() as any

  // Manager scoping
  if (ctx.isManager) {
    if (!ctx.dharamshalaId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No dharamshala assigned to your account'
      })
    }
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

  const { error } = await supabase
    .from('room_types')
    .update({
      is_active:       false,
      is_available_ui: false,
      updated_at:      new Date().toISOString(),
    })
    .eq('room_type_id', roomId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Delete failed' })
  }

  return { success: true }
})
