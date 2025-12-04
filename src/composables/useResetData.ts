/**
 * Reset Data Utility
 * Usage in browser console:
 * 
 * window.__resetAllData?.()
 */

export const useResetData = () => {
  const resetAll = async () => {
    try {
      const { useRoomsStore } = await import('~/stores/rooms')
      const { useStaysStore } = await import('~/stores/stays')
      
      const roomsStore = useRoomsStore()
      const staysStore = useStaysStore()
      
      // Reset both stores
      roomsStore.resetAllBookings()
      staysStore.resetAllStays()
      
      // Clear localStorage
      localStorage.removeItem('dharamshala_bookings')
      localStorage.removeItem('dharamshala_stays')
      localStorage.removeItem('dharamshala_favorites')
      
      console.log('✅ All data reset successfully!')
      console.log('🔄 Reloading page in 2 seconds...')
      
      setTimeout(() => {
        location.reload()
      }, 2000)
    } catch (error) {
      console.error('❌ Error resetting data:', error)
    }
  }

  return {
    resetAll,
  }
}
