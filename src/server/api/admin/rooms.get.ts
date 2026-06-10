import { getSupabaseTirthlok } from '~/server/utils/supabase'
import { requireAdmin } from '~/server/utils/adminContext'

export default defineEventHandler(async (event) => {
  const ctx = requireAdmin(event)

  const supabase = getSupabaseTirthlok()

  let query = supabase
    .from('room_types')
    .select(`
      room_type_id, dharamshala_id, name, room_category,
      description, bed_configuration, capacity, max_guests,
      base_price, discount_price, total_inventory,
      amenities, room_type_images, is_available_ui,
      is_active, created_at, updated_at,
      dharamshala:dharamshala_id (
        dharamshala_name, dharamshala_city
      )
    `)
    .order('dharamshala_id')
    .order('base_price')

  if (ctx.isManager && ctx.dharamshalaId) {
    query = query.eq('dharamshala_id', ctx.dharamshalaId)
  }

  const { data, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch rooms' })
  }

  return data || []
})
