/**
 * POST /api/ratings - Create a new rating
 */
import type { Rating } from '~/types/models'

// Store reference - we'll use the same map from index.get.ts by importing
let ratings: Map<string, Rating> = new Map()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate required fields
  if (!body.dharamshalaId || !body.guestName || !body.bookingId || body.overallRating === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: dharamshalaId, guestName, bookingId, overallRating',
    })
  }

  // Validate rating values (1-5)
  if (
    body.overallRating < 1 || body.overallRating > 5 ||
    (body.cleanliness && (body.cleanliness < 1 || body.cleanliness > 5)) ||
    (body.comfort && (body.comfort < 1 || body.comfort > 5)) ||
    (body.hospitality && (body.hospitality < 1 || body.hospitality > 5)) ||
    (body.value && (body.value < 1 || body.value > 5))
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'All ratings must be between 1 and 5',
    })
  }

  try {
    const ratingId = `RATING-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newRating: Rating = {
      id: ratingId,
      dharamshalaId: body.dharamshalaId,
      guestName: body.guestName,
      guestEmail: body.guestEmail || '',
      bookingId: body.bookingId,
      overallRating: body.overallRating,
      cleanliness: body.cleanliness || 0,
      comfort: body.comfort || 0,
      hospitality: body.hospitality || 0,
      value: body.value || 0,
      comment: body.comment || '',
      visitDate: body.visitDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    }

    // Store rating on server
    ratings.set(ratingId, newRating)

    console.log(`New rating created: ${ratingId} for dharamshala ${body.dharamshalaId}`)

    return newRating
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating rating',
    })
  }
})
