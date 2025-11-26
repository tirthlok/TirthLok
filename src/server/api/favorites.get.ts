// lightweight favorites endpoint for dev
const userFavorites = new Map<string, Set<string>>()
if (userFavorites.size === 0) userFavorites.set('guest', new Set())

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const userId = (query.userId as string) || 'guest'
  if (!userFavorites.has(userId)) userFavorites.set(userId, new Set())
  // Return plain array of favorite IDs for client compatibility
  return Array.from(userFavorites.get(userId)!)
})
