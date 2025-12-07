/**
 * useRatingApi Composable
 * Rating-specific API endpoints
 */

import type { Rating } from '~/types/models'

export const useRatingApi = () => {
  const config = useRuntimeConfig()

  /**
   * Fetch all ratings
   */
  const fetchAllRatings = async (): Promise<Rating[]> => {
    try {
      return await $fetch('/api/ratings', {
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error('Error fetching ratings:', error)
      throw error
    }
  }

  /**
   * Fetch ratings for a specific dharamshala
   */
  const fetchDharamshalaRatings = async (dharamshalaId: string): Promise<Rating[]> => {
    try {
      return await $fetch(`/api/ratings/dharamshala/${dharamshalaId}`, {
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error(`Error fetching ratings for dharamshala ${dharamshalaId}:`, error)
      throw error
    }
  }

  /**
   * Fetch single rating by ID
   */
  const fetchRatingById = async (ratingId: string): Promise<Rating> => {
    try {
      return await $fetch(`/api/ratings/${ratingId}`, {
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error(`Error fetching rating ${ratingId}:`, error)
      throw error
    }
  }

  /**
   * Create a new rating
   */
  const createRating = async (rating: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating> => {
    try {
      return await $fetch('/api/ratings', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: rating,
      })
    } catch (error) {
      console.error('Error creating rating:', error)
      throw error
    }
  }

  /**
   * Delete a rating
   */
  const deleteRating = async (ratingId: string): Promise<void> => {
    try {
      await $fetch(`/api/ratings/${ratingId}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error(`Error deleting rating ${ratingId}:`, error)
      throw error
    }
  }

  /**
   * Check if booking has been rated
   */
  const checkIfBookingRated = async (bookingId: string): Promise<boolean> => {
    try {
      const response = (await $fetch(`/api/ratings/booking/${bookingId}/check`, {
        baseURL: config.public.apiBaseUrl,
      })) as { isRated: boolean }
      return response.isRated
    } catch (error) {
      console.error(`Error checking if booking is rated ${bookingId}:`, error)
      return false
    }
  }

  return {
    fetchAllRatings,
    fetchDharamshalaRatings,
    fetchRatingById,
    createRating,
    deleteRating,
    checkIfBookingRated,
  }
}
