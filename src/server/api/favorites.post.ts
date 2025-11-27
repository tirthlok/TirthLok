import { readBody } from 'h3'
import { userFavorites, ensureUser } from './_favoritesStore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // Support both shapes: { userId, tithId, action } (old) and { itemId, entityType } (client)
  const userIdFromBody = body.userId as string | undefined
  const itemId = (body.itemId || body.tithId) as string | undefined
  const action = (body.action as string | undefined) || (itemId ? 'add' : undefined)

  if (!userIdFromBody) {
    // allow anonymous guest operations
  }
  if (!itemId) throw createError({ statusCode: 400, message: 'itemId (or tithId) is required' })

  const userId = ensureUser(userIdFromBody)
  const favs = userFavorites.get(userId)!
  if (action === 'add') favs.add(itemId)
  else if (action === 'remove') favs.delete(itemId)

  // Return the updated favorites array for client compatibility
  return Array.from(favs)
})
