// Store favorites in memory (will persist with database in production)
const userFavorites = new Map<string, Set<string>>()

// Initialize some sample favorites if needed
if (userFavorites.size === 0) {
  userFavorites.set('guest', new Set())
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const userId = (query.userId as string) || 'guest'

  if (!userFavorites.has(userId)) {
    userFavorites.set(userId, new Set())
  }

  const favs = userFavorites.get(userId)!
  return {
    userId,
    favorites: Array.from(favs),
  }
})
