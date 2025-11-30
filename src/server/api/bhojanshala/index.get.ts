import { sampleBhojanshalas } from '~/server/utils/sampleData'

/**
 * GET /api/bhojanshala - Fetch all bhojanshala locations
 */
export default defineEventHandler(async (_event) => {
  return sampleBhojanshalas
})
