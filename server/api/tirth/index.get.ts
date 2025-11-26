import { sampleTirths } from '~~/server/utils/sampleData'

/**
 * GET /api/tirth - Fetch all tirth locations
 */
export default defineEventHandler(async (_event) => {
  // TODO: Replace with actual database calls
  return sampleTirths
})
