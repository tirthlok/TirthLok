import { sampleTirths } from '~/server/utils/sampleData'

/**
 * GET /api/tirth/:id - Fetch single tirth by ID
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tirth ID is required',
    })
  }

  const tirth = sampleTirths.find((t) => t.id === id)

  if (!tirth) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tirth not found',
    })
  }

  return tirth
})
