const userFavorites = new Map<string, Set<string>>()
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, tithId, action } = body
  if (!userId || !tithId) throw createError({ statusCode: 400, message: 'userId and tithId are required' })
  if (!userFavorites.has(userId)) userFavorites.set(userId, new Set())
  const favs = userFavorites.get(userId)!
  if (action === 'add') favs.add(tithId)
  else if (action === 'remove') favs.delete(tithId)
  // Return the updated favorites array for client compatibility
  return Array.from(favs)
})
