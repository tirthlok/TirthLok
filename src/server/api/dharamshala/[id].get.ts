/**
 * GET /api/dharamshala/:id - Fetch single dharamshala by ID
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dharamshala ID is required',
    })
  }
  // Use sample data for now
  const { sampleDharamshalas } = await import('~/server/utils/sampleData')
  const dh = sampleDharamshalas.find((d: any) => d.id === id)

  if (!dh) {
    throw createError({ statusCode: 404, statusMessage: 'Dharamshala not found' })
  }

  return dh
})
