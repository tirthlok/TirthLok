import { useTirthStore } from '~/stores/tirth'
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(async () => {
  const tithStore = useTirthStore()
  const userStore = useUserStore()

  // Initialize store with tirth data on app startup
  // This ensures data is available even when navigating directly to a detail page
  if (tithStore.tirths.length === 0) {
    await tithStore.fetchTirths()
  }

  // Hydrate user favorites on server startup so favorites are available on first paint
  try {
    await userStore.loadFavorites()
  } catch (err) {
    // Non-fatal: log and continue
    // eslint-disable-next-line no-console
    console.warn('Failed to hydrate favorites during init:', err)
  }
})
