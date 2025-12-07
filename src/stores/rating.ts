import { defineStore } from 'pinia'
import type { Rating } from '~/types/models'

interface RatingState {
  ratings: Rating[]
  selectedDharamshalaRatings: Rating[]
  loading: boolean
  error: string | null
}

/**
 * Rating Store
 * Manages dharamshala ratings and reviews
 */
export const useRatingStore = defineStore('rating', {
  state: (): RatingState => ({
    ratings: [],
    selectedDharamshalaRatings: [],
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * Get all ratings for a specific dharamshala
     */
    getRatingsByDharamshala: (state) => (dharamshalaId: string) => {
      return state.ratings.filter((r) => r.dharamshalaId === dharamshalaId)
    },

    /**
     * Get average overall rating for a dharamshala
     */
    getAverageRating: (state) => (dharamshalaId: string) => {
      const dharamshalaRatings = state.ratings.filter((r) => r.dharamshalaId === dharamshalaId)
      if (dharamshalaRatings.length === 0) return 0
      const total = dharamshalaRatings.reduce((sum, r) => sum + r.overallRating, 0)
      return Math.round((total / dharamshalaRatings.length) * 10) / 10
    },

    /**
     * Get average rating for specific category
     */
    getAverageCategoryRating: (state) => (dharamshalaId: string, category: 'cleanliness' | 'comfort' | 'hospitality' | 'value') => {
      const dharamshalaRatings = state.ratings.filter((r) => r.dharamshalaId === dharamshalaId)
      if (dharamshalaRatings.length === 0) return 0
      const total = dharamshalaRatings.reduce((sum, r) => sum + r[category], 0)
      return Math.round((total / dharamshalaRatings.length) * 10) / 10
    },

    /**
     * Get total number of ratings for a dharamshala
     */
    getRatingCount: (state) => (dharamshalaId: string) => {
      return state.ratings.filter((r) => r.dharamshalaId === dharamshalaId).length
    },

    /**
     * Check if a booking has been rated
     */
    hasBookingBeenRated: (state) => (bookingId: string) => {
      return state.ratings.some((r) => r.bookingId === bookingId)
    },
  },

  actions: {
    /**
     * Fetch all ratings
     */
    async fetchRatings() {
      if (this.ratings.length > 0) {
        return
      }

      this.loading = true
      this.error = null
      try {
        const { useRatingApi } = await import('~/composables/api')
        const { fetchAllRatings } = useRatingApi()
        const response = await fetchAllRatings()
        this.ratings = response
      } catch (error) {
        this.error = 'Failed to fetch ratings'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch ratings for specific dharamshala
     */
    async fetchDharamshalaRatings(dharamshalaId: string) {
      this.loading = true
      this.error = null
      try {
        const { useRatingApi } = await import('~/composables/api')
        const { fetchDharamshalaRatings } = useRatingApi()
        const response = await fetchDharamshalaRatings(dharamshalaId)
        this.selectedDharamshalaRatings = response
      } catch (error) {
        this.error = `Failed to fetch ratings for dharamshala ${dharamshalaId}`
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Add a new rating
     */
    async addRating(rating: Omit<Rating, 'id' | 'createdAt'>) {
      this.loading = true
      this.error = null
      try {
        const { useRatingApi } = await import('~/composables/api')
        const { createRating } = useRatingApi()
        const newRating = await createRating(rating)
        this.ratings.push(newRating)
        return newRating
      } catch (error) {
        this.error = 'Failed to submit rating'
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Delete a rating (admin only)
     */
    async deleteRating(ratingId: string) {
      this.loading = true
      this.error = null
      try {
        const { useRatingApi } = await import('~/composables/api')
        const { deleteRating: deleteRatingApi } = useRatingApi()
        await deleteRatingApi(ratingId)
        this.ratings = this.ratings.filter((r) => r.id !== ratingId)
        this.selectedDharamshalaRatings = this.selectedDharamshalaRatings.filter((r) => r.id !== ratingId)
      } catch (error) {
        this.error = `Failed to delete rating ${ratingId}`
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Clear all ratings (for testing/development)
     */
    clearRatings() {
      this.ratings = []
      this.selectedDharamshalaRatings = []
      this.error = null
    },
  },
})
