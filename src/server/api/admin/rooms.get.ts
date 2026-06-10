import { getSupabaseTirthlok, getUserIdFromEvent } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromEvent(event)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const supabase = getSupabaseTirthlok()

  const { data, error } = await supabase
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

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch rooms' })
  }

  return data || []
})
