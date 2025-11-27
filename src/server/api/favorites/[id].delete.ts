import { getQuery } from 'h3'
import { userFavorites, ensureUser } from '../_favoritesStore'

export default defineEventHandler((event) => {
  const params = event.context.params as { id?: string }
  const id = params.id
  const query = getQuery(event)
  const userId = ensureUser(query.userId as string)
  if (!id) throw createError({ statusCode: 400, message: 'id is required' })
  const favs = userFavorites.get(userId)!
  favs.delete(id)
  return Array.from(favs)
})
