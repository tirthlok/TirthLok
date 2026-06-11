import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Bhojanshala ID required' })
  }

  const supabase = getSupabaseTirthlok() as any

  const { data, error } = await supabase
    .from('bhojanshala_cards')
    .select(`
      bhojanshala_id,
      tirth_id,
      bhojanshala_name,
      bhojanshala_city,
      bhojanshala_state,
      bhojanshala_address,
      bhojanshala_phone,
      bhojanshala_email,
      bhojanshala_images,
      bhojanshala_type,
      tags,
      is_active,
      created_at,
      tirth:tirth_id (tirth_id, tirth_name),
      details:bhojanshala_details (
        about,
        meal_timings,
        facilities,
        dietary_info,
        rules,
        special_services,
        seating_capacity,
        languages_spoken,
        payment_info,
        manager_name,
        manager_phone
      )
    `)
    .eq('bhojanshala_id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, statusMessage: 'Bhojanshala not found' })
  }

  return data
})
