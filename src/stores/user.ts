import { defineStore } from 'pinia'
import type { User } from '~/types/models'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  userId: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: {
      id: 'guest',
      name: 'Guest',
      email: 'guest@example.com',
      favorites: [],
    },
    isAuthenticated: false,
    loading: false,
    error: null,
    userId: 'guest', // Default guest user
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

    async loadFavorites() {
      try {
        const { data } = await useFetch<string[]>(`/api/favorites?userId=${this.userId}`)
        if (data.value && this.user) {
          // API returns either an array of favorite IDs or an object containing `favorites`.
          if (Array.isArray(data.value)) {
            this.user.favorites = data.value
          } else if ((data.value as any).favorites) {
            this.user.favorites = (data.value as any).favorites || []
          } else {
            this.user.favorites = []
          }
        }
      } catch (error) {
        console.error('Failed to load favorites:', error)
      }
    },

    async addFavorite(tithId: string) {
      if (!this.user) return

      try {
        if (!this.user.favorites.includes(tithId)) {
          this.user.favorites.push(tithId)
          // Sync with server
          await $fetch('/api/favorites', {
            method: 'POST',
            body: {
              userId: this.userId,
              tithId,
              action: 'add',
            },
          })
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
          // Sync with server
          await $fetch('/api/favorites', {
            method: 'POST',
            body: {
              userId: this.userId,
              tithId,
              action: 'remove',
            },
          })
        }
      } catch (error) {
        this.error = 'Failed to remove favorite'
        console.error(error)
      }
    },
  },
})
