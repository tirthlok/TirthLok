import { useTirthStore } from '~/stores/tirth'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Get store instance
  const tirthStore = useTirthStore()

  // Initialize store data on app startup
  // This ensures data is available when SSR hydration occurs
  try {
    console.log('🔌 Plugin: Initializing tirth store on app startup')

    // Always attempt to fetch on first load, regardless of current state
    // useAsyncData on pages will handle caching with server: true
    const fetchPromise = tirthStore.fetchTirths()

    // Set timeout to prevent hanging on slow networks
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Fetch timeout')), 8000)
    )

    await Promise.race([fetchPromise, timeoutPromise])
    console.log('🔌 Plugin: Store initialization complete, tirths loaded:', tirthStore.tirths.length)
  } catch (error) {
    console.warn('⚠️ Warning: Initial fetch failed, pages will handle data fetching:', error)
    // Pages have useAsyncData with server: true, so data will still load correctly
  }
})
