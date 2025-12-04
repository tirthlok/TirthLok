/**
 * Data Reset Plugin
 * Clears bookings and ratings/stays on app startup
 */

export default defineNuxtPlugin(() => {
  if (process.client) {
    try {
      localStorage.removeItem('dharamshala_bookings')
      localStorage.removeItem('dharamshala_stays')
      localStorage.removeItem('dharamshala_favorites')
    } catch (e) {
      console.error('Failed to clear localStorage:', e)
    }
  }
})
