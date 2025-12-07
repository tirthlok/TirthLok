/**
 * GET /api/ratings/user/:guestEmail/:dharamshalaId
 * Get user's existing rating for a dharamshala (if any)
 */
export default defineEventHandler(async (event) => {
  const guestEmail = getRouterParam(event, 'guestEmail')
  const dharamshalaId = getRouterParam(event, 'dharamshalaId')

  if (!guestEmail || !dharamshalaId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Guest email and dharamshala ID are required',
    })
  }

  try {
    // In production, query database for user's rating
    // For now, return null (no existing rating)
    return { rating: null, hasRated: false }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error checking user rating',
    })
  }
})
