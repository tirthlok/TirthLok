import { defineStore } from 'pinia'
import type { DharamshalStay } from '~/types/models'

interface StaysState {
  stays: DharamshalStay[]
  activeStay: DharamshalStay | null
  completedStayAwaitingRating: DharamshalStay | null
  loading: boolean
  error: string | null
}

/**
 * Stays Store
 * Manages user stays at dharamshalas and tracks rating status
 */
export const useStaysStore = defineStore('stays', {
  state: (): StaysState => ({
    stays: [],
    activeStay: null,
    completedStayAwaitingRating: null,
    loading: false,
    error: null,
  }),

  getters: {
    getStaysByStatus: (state) => (status: 'active' | 'completed' | 'cancelled') => {
      return state.stays.filter((s) => s.status === status)
    },
  },

  actions: {
    /**
     * Create a new stay at a dharamshala
     */
    async startStay(dharamshalaId: string, dharamshalaName: string, checkInDate: string) {
      const { useUserStore } = await import('~/stores/user')
      const userStore = useUserStore()
      
      const stay: DharamshalStay = {
        id: `stay_${Date.now()}`,
        dharamshalaId,
        dharamshalaName,
        userId: userStore.userId,
        checkInDate,
        checkOutDate: '',
        status: 'active',
        ratingSubmitted: false,
      }

      this.stays.push(stay)
      this.activeStay = stay
      this.saveStaysToLocalStorage()
      
      return stay
    },

    /**
     * Complete a stay and mark for rating
     */
    async completeStay(stayId: string, checkOutDate: string, checkOutTime?: string) {
      const stay = this.stays.find((s) => s.id === stayId)
      if (!stay) {
        this.error = 'Stay not found'
        return
      }

      stay.status = 'completed'
      stay.checkOutDate = checkOutDate
      stay.checkOutTime = checkOutTime
      
      if (!stay.ratingSubmitted) {
        this.completedStayAwaitingRating = stay
      }

      this.activeStay = null
      this.saveStaysToLocalStorage()
      return stay
    },

    /**
     * Submit rating for a completed stay
     */
    async submitRatingForStay(stayId: string, rating: number, feedback: string) {
      const stay = this.stays.find((s) => s.id === stayId)
      if (!stay) {
        this.error = 'Stay not found'
        return
      }

      stay.rating = rating
      stay.feedback = feedback
      stay.ratingSubmitted = true
      this.completedStayAwaitingRating = null
      this.saveStaysToLocalStorage()
      return stay
    },

    /**
     * Get stay by dharamshala and user
     */
    getStayByDharamshalAndUser(dharamshalaId: string, userId: string) {
      return this.stays.find((s) => s.dharamshalaId === dharamshalaId && s.userId === userId && s.status === 'active')
    },

    /**
     * Load stays from localStorage
     */
    loadStaysFromLocalStorage() {
      try {
        const key = 'dharamshala_stays'
        const stored = localStorage.getItem(key)
        if (stored) {
          const data = JSON.parse(stored)
          this.stays = data.stays || []
          
          const active = this.stays.find((s) => s.status === 'active')
          if (active) {
            this.activeStay = active
          }

          const completed = this.stays.find((s) => s.status === 'completed' && !s.ratingSubmitted)
          if (completed) {
            this.completedStayAwaitingRating = completed
          }
        }
      } catch (e) {
        console.error('Failed to load stays from localStorage:', e)
      }
    },

    /**
     * Save stays to localStorage
     */
    saveStaysToLocalStorage() {
      try {
        const key = 'dharamshala_stays'
        const data = { stays: this.stays }
        localStorage.setItem(key, JSON.stringify(data))
      } catch (e) {
        console.error('Failed to save stays to localStorage:', e)
      }
    },

    /**
     * Reset all stays data
     */
    resetAllStays() {
      this.stays = []
      this.activeStay = null
      this.completedStayAwaitingRating = null
      try {
        localStorage.removeItem('dharamshala_stays')
      } catch (e) {
        console.error('Failed to clear localStorage:', e)
      }
    },
  },
})
