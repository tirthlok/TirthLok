/**
 * GET /api/dharamshala/:id/rooms - Fetch rooms for a dharamshala
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dharamshala ID is required',
    })
  }

  try {
    const { sampleDharamshalas } = await import('~/server/utils/sampleData')
    const dh = sampleDharamshalas.find((d: any) => d.id === id)

    if (!dh) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Dharamshala not found',
      })
    }

    return dh.rooms || []
  } catch (error) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching rooms',
    })
  }
})
