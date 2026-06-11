import { requireAdmin } from '~/server/utils/adminContext'
import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const ctx  = await requireAdmin(event)
  const body = await readBody(event)

  // Required field validation
  const required = [
    'dharamshala_id', 'name', 'room_category',
    'bed_configuration', 'capacity', 'max_guests',
    'base_price', 'total_inventory'
  ]
  const missing = required.filter(f => !body[f])
  if (missing.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missing.join(', ')}`
    })
  }

  // Bounds validation
  if (Number(body.base_price)      <= 0)
    throw createError({ statusCode: 400, statusMessage: 'Base price must be greater than 0' })
  if (Number(body.total_inventory) <= 0)
    throw createError({ statusCode: 400, statusMessage: 'Inventory must be at least 1' })
  if (Number(body.capacity)        <= 0)
    throw createError({ statusCode: 400, statusMessage: 'Capacity must be at least 1' })
  if (Number(body.max_guests)      <= 0)
    throw createError({ statusCode: 400, statusMessage: 'Max guests must be at least 1' })
  if (body.discount_price !== undefined && body.discount_price !== null) {
    if (Number(body.discount_price) <= 0)
      throw createError({ statusCode: 400, statusMessage: 'Discount price must be greater than 0' })
    if (Number(body.discount_price) >= Number(body.base_price))
      throw createError({ statusCode: 400, statusMessage: 'Discount price must be less than base price' })
  }

  // Manager scoping — null dharamshalaId is itself a hard error
  if (ctx.isManager) {
    if (!ctx.dharamshalaId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No dharamshala assigned to your account'
      })
    }
    if (body.dharamshala_id !== ctx.dharamshalaId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You can only create rooms for your assigned dharamshala'
      })
    }
  }

  const supabase = getSupabaseTirthlok() as any

  const { data, error } = await supabase
    .from('room_types')
    .insert({
      dharamshala_id:    body.dharamshala_id,
      name:              String(body.name).trim(),
      room_category:     body.room_category,
      description:       body.description
                           ? String(body.description).trim()
                           : null,
      bed_configuration: String(body.bed_configuration).trim(),
      capacity:          Number(body.capacity),
      max_guests:        Number(body.max_guests),
      max_children:      Number(body.max_children    || 0),
      base_price:        Number(body.base_price),
      discount_price:    body.discount_price
                           ? Number(body.discount_price)
                           : null,
      total_inventory:   Number(body.total_inventory),
      amenities:         Array.isArray(body.amenities)
                           ? body.amenities.map((a: any) => String(a).trim())
                           : [],
      is_available_ui:   body.is_available_ui ?? true,
      is_active:         true,
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})
