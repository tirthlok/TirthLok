/**
 * GET /api/tirth/:id - Fetch single tirth by name with full details
 * Server-side only endpoint that calls the backend API
 * The :id parameter should be the tirth_name (e.g., "Palitana")
 */
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tirth name is required',
      })
    }

    // Call backend API with includeDetails=true
    // The backend expects the tirth_name as the identifier
    const backendUrl = `http://localhost:5000/api/v1/tirth/${id}?includeDetails=true`
    const response = await $fetch(backendUrl)

    return response
  } catch (error: any) {
    console.error(`Error fetching tirth ${getRouterParam(event, 'id')} from backend:`, error)
    
    // Handle backend 404 errors
    if (error.statusCode === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Tirth not found',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tirth details',
    })
  }
})
