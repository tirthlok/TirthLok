import { getQuery } from 'h3'
import { userFavorites, ensureUser } from './_favoritesStore'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const userId = ensureUser(query.userId as string)
  // Return plain array of favorite IDs for client compatibility
  return Array.from(userFavorites.get(userId)!)
})
