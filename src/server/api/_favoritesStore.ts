// Shared in-memory favorites store for dev
export const userFavorites = new Map<string, Set<string>>()
if (userFavorites.size === 0) userFavorites.set('guest', new Set())

export function ensureUser(userId?: string) {
  const id = userId || 'guest'
  if (!userFavorites.has(id)) userFavorites.set(id, new Set())
  return id
}
