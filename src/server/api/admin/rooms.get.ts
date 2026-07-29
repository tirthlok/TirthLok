import { getSupabaseTirthlok } from '~/server/utils/supabase'
import { requireAdmin } from '~/server/utils/adminContext'

export default defineEventHandler(async (event) => {
  const ctx = await requireAdmin(event)

  const supabase = getSupabaseTirthlok() as any

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

  const queryParams = getQuery(event)
  const checkInDate = queryParams.checkIn as string
  const checkOutDate = queryParams.checkOut as string

  if (checkInDate && checkOutDate && data && data.length > 0) {
    const roomTypeIds = data.map((r: any) => r.room_type_id)
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('room_type_id, check_in_date, check_out_date, rooms_count')
      .in('room_type_id', roomTypeIds)
      .not('status', 'in', '(cancelled,refunded)')
      .lt('check_in_date', checkOutDate)
      .gt('check_out_date', checkInDate)

    if (bookingsError) {
      console.error('[admin-rooms] bookings fetch failed:', bookingsError.message)
      throw createError({ statusCode: 500, statusMessage: 'Failed to check room availability' })
    }

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    data.forEach((room: any) => {
      let maxOccupancy = 0
      const current = new Date(checkIn)

      while (current < checkOut) {
        const dateStr = current.toISOString().split('T')[0]
        let occupiedOnDate = 0

        for (const b of bookings || []) {
          if (b.room_type_id === room.room_type_id && b.check_in_date <= dateStr && b.check_out_date > dateStr) {
            occupiedOnDate += b.rooms_count || 1
          }
        }

        if (occupiedOnDate > maxOccupancy) {
          maxOccupancy = occupiedOnDate
        }

        current.setDate(current.getDate() + 1)
      }

      room.available_rooms = Math.max(0, room.total_inventory - maxOccupancy)
    })
  }

  return data || []
})
