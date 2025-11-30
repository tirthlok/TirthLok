import { sampleTirths } from '~/server/utils/sampleData'

/**
 * GET /api/tirth - Fetch all tirth locations
 */
export default defineEventHandler(async (_event) => {
  return sampleTirths
})
