/**
 * GET /api/dharamshala/:id/rooms - Fetch rooms for a dharamshala
 * The :id param is the dharamshala_id (e.g. DL-GJ-0001)
 * Queries tirthlok.room_types directly
 */
import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dharamshala ID is required',
    })
  }

  try {
    const supabase = getSupabaseTirthlok()

    // Resolve dharamshala_id — if it matches DL-XX-XXXX format, use directly
    let dharamshalaId = decodeURIComponent(id)
    const isStandardId = /^DL-[A-Z]{2}-\d{4}$/i.test(dharamshalaId)

    if (!isStandardId) {
      // It's a name slug — resolve via dharamshala_cards
      const { data: detailData, error: detailError } = await supabase
        .from('dharamshala_cards')
        .select('dharamshala_id')
        .eq('dharamshala_name', dharamshalaId)
        .single()

      if (detailError || !detailData) {
        return fallbackToSampleData(id)
      }

      dharamshalaId = detailData.dharamshala_id
    }

    // Query room_types
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .eq('dharamshala_id', dharamshalaId)
      .eq('is_available_ui', true)
      .order('base_price', { ascending: true })

    if (error) {
      console.error('[rooms] fetch failed:', error.message)
      return fallbackToSampleData(id)
    }

    if (data && data.length > 0) {
      return {
        success: true,
        data,
        source: 'supabase',
      }
    }

    return fallbackToSampleData(id)

  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('[rooms] fetch failed:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Error fetching rooms',
    })
  }
})

/** Fallback to sample data for development */
async function fallbackToSampleData(id: string) {
  const { sampleDharamshalas } = await import('~/server/utils/sampleData')
  const dh = sampleDharamshalas.find((d: any) => d.id === id)

  if (!dh) {
    return {
      success: true,
      data: [],
      source: 'empty',
    }
  }

  // Transform sample Room[] data to match RoomType shape
  const transformedRooms = (dh.rooms || []).map((room: any) => ({
    room_type_id: room.id,
    dharamshala_id: id,
    name: `Room ${room.roomNumber}`,
    room_category: room.type || 'standard',
    description: room.description || null,
    bed_configuration: room.bedType || 'Single Bed',
    capacity: room.capacity || 1,
    max_guests: room.maxGuests || room.capacity || 1,
    base_price: room.price || 0,
    total_inventory: room.available ? 3 : 0,
    amenities: room.amenities || [],
    room_type_images: room.image ? [room.image] : [],
    is_available_ui: room.available !== false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))

  return {
    success: true,
    data: transformedRooms,
    source: 'sample',
  }
}
