/**
 * GET/POST /api/ratings - Fetch all ratings or create a new rating (server-side storage)
 */
import type { Rating } from '~/types/models'

// Server-side storage (in production, use database)
const ratings: Map<string, Rating> = new Map()

// Initialize with sample data on first load
let initialized = false

async function initializeSampleRatings() {
  if (initialized) return
  initialized = true

  try {
    const { sampleRatings } = await import('~/server/utils/sampleData')
    sampleRatings.forEach((rating: Rating) => {
      ratings.set(rating.id, rating)
    })
  } catch (error) {
    console.error('Error loading sample ratings:', error)
  }
}

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    // Load sample data on first access
    await initializeSampleRatings()
    // Return all ratings including sample data
    return Array.from(ratings.values())
  }

  if (event.node.req.method === 'POST') {
    const body = await readBody(event)

    // Validate required fields
    if (!body.dharamshalaId || !body.guestName || !body.bookingId || body.overallRating === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      })
    }

    // Validate rating values (1-5)
    if (body.overallRating < 1 || body.overallRating > 5) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Ratings must be between 1 and 5',
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
  }
})
