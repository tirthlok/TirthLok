import { defineStore } from 'pinia'
import type { User } from '~/types/models'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  getters: {
    getFavorites: (state) => state.user?.favorites || [],
    isFavorite: (state) => (tithId: string) => {
      return state.user?.favorites.includes(tithId) || false
    },
  },

  actions: {
    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
    },

    clearUser() {
      this.user = null
      this.isAuthenticated = false
    },

    async addFavorite(tithId: string) {
      if (!this.user) return

      try {
        if (!this.user.favorites.includes(tithId)) {
          this.user.favorites.push(tithId)
          // TODO: Sync with backend
        }
      } catch (error) {
        this.error = 'Failed to add favorite'
        console.error(error)
      }
    },

    async removeFavorite(tithId: string) {
      if (!this.user) return

      try {
        const index = this.user.favorites.indexOf(tithId)
        if (index > -1) {
          this.user.favorites.splice(index, 1)
          // TODO: Sync with backend
        }
      } catch (error) {
        this.error = 'Failed to remove favorite'
        console.error(error)
      }
    },
  },
})
