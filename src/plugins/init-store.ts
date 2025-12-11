import { useTirthStore } from '~/stores/tirth'

export default defineNuxtPlugin(async () => {
  const tithStore = useTirthStore()
  
  // Initialize store with tirth data on app startup with timeout
  if (tithStore.tirths.length === 0) {
    try {
      console.log('🔌 Plugin: Initializing tirth store')
      // Set a 5 second timeout for initial fetch
      const fetchPromise = tithStore.fetchTirths()
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Fetch timeout')), 5000)
      )
      
      await Promise.race([fetchPromise, timeoutPromise])
      console.log('🔌 Plugin: Store initialization complete, tirths loaded:', tithStore.tirths.length)
    } catch (error) {
      // Silently fail - app can still function without initial data
      console.warn('❌ Failed to initialize tirth data on startup:', error)
      // Continue loading app without data
    }
  } else {
    console.log('🔌 Plugin: Store already has data, skipping init')
  }
})
