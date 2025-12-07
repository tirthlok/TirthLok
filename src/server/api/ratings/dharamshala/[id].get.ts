/**
 * GET /api/ratings/dharamshala/:id - Fetch all ratings for a specific dharamshala
 */
export default defineEventHandler(async (event) => {
  const dharamshalaId = getRouterParam(event, 'id')

  if (!dharamshalaId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dharamshala ID is required',
    })
  }

  try {
    // Fetch all ratings and filter by dharamshalaId
    const allRatings = await $fetch('/api/ratings', {
      baseURL: 'http://localhost:3000', // Use server-side URL
    })

    const filteredRatings = allRatings.filter((r: any) => r.dharamshalaId === dharamshalaId)
    return filteredRatings
  } catch (error) {
    // If API call fails, return empty array for graceful degradation
    return []
  }
})

