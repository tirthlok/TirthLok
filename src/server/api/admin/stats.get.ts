import { getSupabaseTirthlok, getUserIdFromEvent } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromEvent(event)
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const supabase = getSupabaseTirthlok()

  const [
    { count: totalBookings },
    { count: confirmedBookings },
    { count: pendingBookings },
    { count: cancelledBookings },
    { data: recentBookings },
    { data: roomStats },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed'),
    supabase.from('bookings').select('*', { count: 'exact', head: true })
      .eq('status', 'initiated'),
    supabase.from('bookings').select('*', { count: 'exact', head: true })
      .eq('status', 'cancelled'),
    supabase.from('bookings')
      .select(`
        booking_id, guest_name, status, total_amount,
        check_in_date, check_out_date, created_at,
        dharamshala:dharamshala_id (dharamshala_name)
      `)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('room_types')
      .select('name, total_inventory, is_available_ui, base_price'),
  ])

  const totalRevenue = recentBookings
    ?.filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + Number(b.total_amount), 0) || 0

  return {
    stats: {
      totalBookings:     totalBookings    || 0,
      confirmedBookings: confirmedBookings || 0,
      pendingBookings:   pendingBookings   || 0,
      cancelledBookings: cancelledBookings || 0,
    },
    recentBookings: recentBookings || [],
    roomStats:      roomStats      || [],
  }
})
