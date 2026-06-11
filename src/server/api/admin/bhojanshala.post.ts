import { requireAdmin } from '~/server/utils/adminContext'
import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const ctx  = await requireAdmin(event)
  const body = await readBody(event)

  // Required field validation
  const required = ['bhojanshala_id', 'bhojanshala_name', 'bhojanshala_city',
                    'bhojanshala_state', 'bhojanshala_type']
  const missing  = required.filter(f => !body[f]?.toString().trim())
  if (missing.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missing.join(', ')}`
    })
  }

  // Validate type
  if (!['free', 'paid', 'donation'].includes(body.bhojanshala_type)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid bhojanshala type' })
  }

  // Validate ID format: BL-XX-0000
  if (!/^BL-[A-Z]{2}-\d{4}$/.test(body.bhojanshala_id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID format. Use BL-XX-0000 (e.g. BL-GJ-0001)'
    })
  }

  // Tirth manager can only create under their tirth
  if (ctx.isManager) {
    if (!ctx.tirthId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tirth assigned to your account'
      })
    }
    if (body.tirth_id && body.tirth_id !== ctx.tirthId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You can only create bhojanshalas for your assigned tirth'
      })
    }
    body.tirth_id = ctx.tirthId
  }

  const supabase = getSupabaseTirthlok() as any

  // Insert card
  const { data: card, error: cardError } = await supabase
    .from('bhojanshala_cards')
    .insert({
      bhojanshala_id:      String(body.bhojanshala_id).trim().toUpperCase(),
      tirth_id:            body.tirth_id            || null,
      bhojanshala_name:    String(body.bhojanshala_name).trim(),
      bhojanshala_city:    String(body.bhojanshala_city).trim(),
      bhojanshala_state:   String(body.bhojanshala_state).trim(),
      bhojanshala_address: body.bhojanshala_address
                             ? String(body.bhojanshala_address).trim()
                             : null,
      bhojanshala_phone:   body.bhojanshala_phone
                             ? String(body.bhojanshala_phone).trim()
                             : null,
      bhojanshala_email:   body.bhojanshala_email
                             ? String(body.bhojanshala_email).trim().toLowerCase()
                             : null,
      bhojanshala_type:    body.bhojanshala_type,
      bhojanshala_images:  Array.isArray(body.bhojanshala_images)
                             ? body.bhojanshala_images
                             : [],
      tags:                Array.isArray(body.tags)
                             ? body.tags.map((t: any) => String(t).trim())
                             : [],
      is_active:           true,
    })
    .select()
    .single()

  if (cardError) {
    if (cardError.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: `Bhojanshala ID ${body.bhojanshala_id} already exists`
      })
    }
    throw createError({ statusCode: 500, statusMessage: cardError.message })
  }

  // Insert details
  const { error: detailError } = await supabase
    .from('bhojanshala_details')
    .insert({
      bhojanshala_id:   card.bhojanshala_id,
      about:            body.about            ? String(body.about).trim()     : null,
      meal_timings:     Array.isArray(body.meal_timings)  ? body.meal_timings  : [],
      facilities:       Array.isArray(body.facilities)    ? body.facilities    : [],
      dietary_info:     body.dietary_info
                          ? String(body.dietary_info).trim()
                          : 'Pure Jain vegetarian. No onion, garlic, or root vegetables.',
      rules:            Array.isArray(body.rules)         ? body.rules         : [],
      special_services: Array.isArray(body.special_services)
                          ? body.special_services
                          : [],
      seating_capacity: body.seating_capacity
                          ? Number(body.seating_capacity)
                          : null,
      languages_spoken: Array.isArray(body.languages_spoken)
                          ? body.languages_spoken
                          : [],
      payment_info:     body.payment_info
                          ? String(body.payment_info).trim()
                          : null,
      manager_name:     body.manager_name
                          ? String(body.manager_name).trim()
                          : null,
      manager_phone:    body.manager_phone
                          ? String(body.manager_phone).trim()
                          : null,
    })

  if (detailError) {
    // Rollback card
    await supabase
      .from('bhojanshala_cards')
      .delete()
      .eq('bhojanshala_id', card.bhojanshala_id)
    throw createError({ statusCode: 500, statusMessage: detailError.message })
  }

  return card
})
