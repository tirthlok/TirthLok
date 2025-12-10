/**
 * GET /api/tirth - Fetch all tirth locations with pagination
 * Server-side only endpoint that calls the backend API
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = query.page ? String(query.page) : '1'
    const limit = query.limit ? String(query.limit) : '10'
    const search = query.search ? String(query.search) : ''
    const sect = query.sect ? String(query.sect) : ''
    const type = query.type ? String(query.type) : ''

    // Build query params for backend
    const params = new URLSearchParams({
      page,
      limit,
    })

    if (search) params.append('search', search)
    if (sect) params.append('tirth_sect', sect)
    if (type) params.append('tirth_kshetra', type)

    // Call backend API
    const backendUrl = `http://localhost:5000/api/v1/tirth?${params.toString()}`
    const response = await $fetch(backendUrl)

    // Ensure response has the expected structure
    if (!response.data) {
      return {
        success: true,
        data: Array.isArray(response) ? response : [],
        pagination: {
          total: response.total || 0,
          page: parseInt(page) || 1,
          pages: 1,
        }
      }
    }

    return response
  } catch (error) {
    console.error('Error fetching tirths from backend:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tirth locations',
    })
  }
})
