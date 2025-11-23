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
    tirths: [
      {
        id: 'palitana',
        name: 'Palitana',
        description: 'A major pilgrimage of Jainism, famous for its cluster of temples on Shatrunjaya hill.',
        historicalBackground: 'Palitana has been a center of Jain pilgrimage for centuries.',
        foundingYear: 1100,
        foundingDetails: 'Built and expanded by generations of Jain patrons.',
        pratisthaYear: 1100,
        acharya: 'Multiple',
        architecture: 'Maru-Gurjara style',
        moolnayak: [{ name: 'Adinatha' }],
        specialFacts: ['Thousands of temples', 'Sacred hill climb'],
        poojaTimings: '6:00 AM - 8:00 PM',
        darshanTimings: '5:30 AM - 9:00 PM',
        festivals: [],
        location: {
          latitude: 21.6754,
          longitude: 71.7685,
          address: 'Shatrunjaya Hills',
          city: 'Palitana',
          state: 'Gujarat',
        },
        images: ['https://images.unsplash.com/photo-1558980664-10a8b85a9f34?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=palitana'],
        sect: 'Shwetambar',
        type: 'Atishay-Kshetra',
        facilities: [],
        rating: 4.7,
        reviews: 1324,
      },
      {
        id: 'girnar',
        name: 'Girnar',
        description: 'A group of mountains with many important Jain temples and pilgrimage spots.',
        historicalBackground: 'Girnar temples date back many centuries and are revered by Jains.',
        foundingYear: 900,
        foundingDetails: 'Ancient hill temples with stepped approaches.',
        pratisthaYear: 900,
        acharya: 'Multiple',
        architecture: 'Rock-cut and temple complexes',
        moolnayak: [{ name: 'Neminatha' }],
        specialFacts: ['Mountain pilgrimage', 'Scenic views'],
        poojaTimings: '5:30 AM - 7:30 PM',
        darshanTimings: '5:00 AM - 8:00 PM',
        festivals: [],
        location: {
          latitude: 21.1039,
          longitude: 70.7840,
          address: 'Girnar Hills',
          city: 'Junagadh',
          state: 'Gujarat',
        },
        images: ['https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=girnar'],
        sect: 'Digambar',
        type: 'Siddhakshetra',
        facilities: [],
        rating: 4.6,
        reviews: 940,
      },
      {
        id: 'manas-mandir',
        name: 'Manas Mandir',
        description: 'A revered Jain temple known for its serene atmosphere and rituals.',
        historicalBackground: 'Manas Mandir attracts devotees seeking spiritual solace.',
        foundingYear: 1800,
        foundingDetails: 'Restored over time by local communities.',
        pratisthaYear: 1800,
        acharya: 'Local Acharyas',
        architecture: 'Modern temple architecture with traditional motifs',
        moolnayak: [{ name: 'Parshvanatha' }],
        specialFacts: ['Community-run', 'Active festivals'],
        poojaTimings: '6:00 AM - 9:00 PM',
        darshanTimings: '5:30 AM - 9:30 PM',
        festivals: [],
        location: {
          latitude: 25.0,
          longitude: 85.0,
          address: 'Manas Mandir Road',
          city: 'Gaya',
          state: 'Bihar',
        },
        images: ['https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=manas'],
        sect: 'Shwetambar',
        type: 'Gyan-sthan',
        facilities: [],
        rating: 4.4,
        reviews: 210,
      },
      {
        id: 'ranakpur',
        name: 'Ranakpur',
        description: 'Famous for its stunning marble Jain temple complex dedicated to Adinatha.',
        historicalBackground: 'Ranakpur temple is a masterpiece of 15th-century architecture.',
        foundingYear: 1437,
        foundingDetails: 'Built under royal patronage with intricate carvings.',
        pratisthaYear: 1437,
        acharya: 'Historical Acharyas',
        architecture: 'Marble carvings and pillared halls',
        moolnayak: [{ name: 'Adinatha' }],
        specialFacts: ['1,444 pillars', 'Architectural marvel'],
        poojaTimings: '6:00 AM - 8:00 PM',
        darshanTimings: '5:30 AM - 8:30 PM',
        festivals: [],
        location: {
          latitude: 25.1234,
          longitude: 73.4567,
          address: 'Ranakpur Road',
          city: 'Ranakpur',
          state: 'Rajasthan',
        },
        images: ['https://images.unsplash.com/photo-1508873699372-7ae3b0e0b0f8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=ranakpur'],
        sect: 'Digambar',
        type: 'Atishay-Kshetra',
        facilities: [],
        rating: 4.8,
        reviews: 2400,
      },
    ],
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
