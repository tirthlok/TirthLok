/**
 * GET /api/ratings/:id - Fetch single rating by ID
 */
export default defineEventHandler(async (event) => {
  const ratingId = getRouterParam(event, 'id')

  if (!ratingId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Rating ID is required',
    })
  }

  try {
    // In production, fetch from database
    throw createError({
      statusCode: 404,
      statusMessage: 'Rating not found',
    })
  } catch (error) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching rating',
    })
  }
})
