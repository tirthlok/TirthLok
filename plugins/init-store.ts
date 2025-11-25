import { useTirthStore } from '~/stores/tirth'

export default defineNuxtPlugin(async () => {
  const tithStore = useTirthStore()
  
  // Initialize store with tirth data on app startup
  // This ensures data is available even when navigating directly to a detail page
  if (tithStore.tirths.length === 0) {
    await tithStore.fetchTirths()
  }
})
