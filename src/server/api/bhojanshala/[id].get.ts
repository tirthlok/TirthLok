/**
 * GET /api/bhojanshala/:id - Fetch single bhojanshala by ID
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bhojanshala ID is required',
    })
  }
  // Use sample data for now
  const { sampleBhojanshalas } = await import('~/server/utils/sampleData')
  const b = sampleBhojanshalas.find((x: any) => x.id === id)

  if (!b) {
    throw createError({ statusCode: 404, statusMessage: 'Bhojanshala not found' })
  }

  return b
})
