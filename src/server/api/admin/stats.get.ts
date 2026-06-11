import { getSupabaseTirthlok } from '~/server/utils/supabase'
import { requireAdmin } from '~/server/utils/adminContext'

export default defineEventHandler(async (event) => {
  const ctx      = await requireAdmin(event)
  const supabase = getSupabaseTirthlok()
  const dId      = ctx.isManager ? ctx.dharamshalaId : null

  const applyFilter = (q: any) => {
    if (dId) q = q.eq('dharamshala_id', dId)
    return q
  }

  const [
    { count: totalBookings },
    { count: confirmedBookings },
    { count: pendingBookings },
    { count: cancelledBookings },
    { data: recentBookings },
    { data: roomStats },
  ] = await Promise.all([
    applyFilter(supabase.from('bookings').select('*', { count: 'exact', head: true })),
    applyFilter(supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed')),
    applyFilter(supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'initiated')),
    applyFilter(supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'cancelled')),
    applyFilter(supabase.from('bookings').select(`
      booking_id, guest_name, status, total_amount,
      check_in_date, check_out_date, created_at,
      dharamshala:dharamshala_id (dharamshala_name)
    `)).order('created_at', { ascending: false }).limit(5),
    applyFilter(supabase.from('room_types')
      .select('name, total_inventory, is_available_ui, base_price')),
  ])

  return {
    stats: {
      totalBookings:     totalBookings     || 0,
      confirmedBookings: confirmedBookings || 0,
      pendingBookings:   pendingBookings   || 0,
      cancelledBookings: cancelledBookings || 0,
    },
    recentBookings: recentBookings || [],
    roomStats:      roomStats      || [],
  }
})
