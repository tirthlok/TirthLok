import { defineStore } from 'pinia'
import type { Tirth, Facility, User } from '~/types/models'

interface TirthState {
  tirths: Tirth[]
  selectedTirth: Tirth | null
  filteredTirths: Tirth[]
  loading: boolean
  error: string | null
}

export const useTirthStore = defineStore('tirth', {
  state: (): TirthState => ({
    tirths: [],
    selectedTirth: null,
    filteredTirths: [],
    loading: false,
    error: null,
  }),

  getters: {
    getTirthById: (state) => (id: string) => {
      return state.tirths.find((t) => t.id === id)
    },

    getTirthsByState: (state) => (state_name: string) => {
      return state.filteredTirths.filter((t) => t.location.state === state_name)
    },

    getTirthsBySect: (state) => (sect: string) => {
      return state.filteredTirths.filter((t) => t.sect === sect)
    },

    getTirthsByType: (state) => (type: string) => {
      return state.filteredTirths.filter((t) => t.type === type)
    },
  },

  actions: {
    async fetchTirths() {
      // If we already have seeded data, use it and skip remote fetch
      if (this.tirths && this.tirths.length > 0) {
        this.filteredTirths = [...this.tirths]
        return
      }

      this.loading = true
      this.error = null
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<Tirth[]>(`${config.public.apiBaseUrl}/tirths`)
        this.tirths = response
        this.filteredTirths = response
      } catch (error) {
        this.error = 'Failed to fetch tirth locations'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchTirthById(id: string) {
      // Try local store first
      const local = this.tirths.find((t) => t.id === id)
      if (local) {
        this.selectedTirth = local
        return local
      }

      this.loading = true
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<Tirth>(`${config.public.apiBaseUrl}/tirths/${id}`)
        this.selectedTirth = response
        return response
      } catch (error) {
        this.error = `Failed to fetch tirth: ${id}`
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    filterTirths(filters: {
      state?: string
      sect?: string
      type?: string
      searchTerm?: string
    }) {
      let results = [...this.tirths]

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        results = results.filter(
          (t) =>
            t.name.toLowerCase().includes(term) ||
            t.description.toLowerCase().includes(term) ||
            t.location.city.toLowerCase().includes(term)
        )
      }

      if (filters.state) {
        results = results.filter((t) => t.location.state === filters.state)
      }

      if (filters.sect) {
        results = results.filter((t) => t.sect === filters.sect)
      }

      if (filters.type) {
        results = results.filter((t) => t.type === filters.type)
      }

      this.filteredTirths = results
    },

    setSelectedTirth(tirth: Tirth | null) {
      this.selectedTirth = tirth
    },
  },
})
