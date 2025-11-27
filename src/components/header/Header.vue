<template>
  <header class="bg-white sticky top-0 z-40 shadow-sm backdrop-blur-sm overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <!-- Top Row: Logo, Search, Actions (Airbnb-like) -->
      <div class="flex items-center justify-between sm:gap-4">
        <!-- Logo (hidden on mobile to keep header compact) -->
        <NuxtLink to="/" class="hidden sm:flex items-center gap-2 flex-shrink-0 group">
          <div class="w-10 h-10 rounded-full overflow-hidden group-hover:scale-110 transition-all duration-300">
            <img :src="tirthlokLogo" alt="TirthLok" class="w-full h-full object-cover block" />
          </div>
          <span class="text-2xl font-bold text-primary text-logo font-serif hidden sm:inline group-hover:opacity-80 transition-opacity">TirthLok</span>
        </NuxtLink>

        <!-- Center: simplified search bar -->
        <div class="flex-1 sm:px-4">
          <div class="max-w-3xl mx-auto">
            <div ref="searchWrapper" class="flex items-center bg-white border border-gray-200 rounded-full shadow-sm px-4 py-2.5 hover:shadow-md transition-shadow relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search temples, cities..."
                class="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm font-medium"
                @input="handleSearch"
                @focus="showSuggestions = true"
                @blur="handleBlur"
              />
              <!-- Filter icon inside search -->
              <button @click.stop="filterOpen = !filterOpen" aria-label="Filters" class="ml-2 p-1 rounded-full hover:bg-gray-100 transition text-gray-500">
                <Icon name="Sliders" :size="18" />
              </button>
              <!-- Search suggestions component -->
              <SearchSuggestions
                :items="suggestionsSource"
                :query="searchQuery"
                :minChars="1"
                :maxResults="8"
                matchMode="startsWith"
                :visible="showSuggestions"
                :anchor="searchWrapper"
                @select="selectSuggestion"
                @close="showSuggestions = false"
              />
            </div>
          </div>
        </div>

        <!-- Actions: profile (desktop) / mobile menu (mobile) -->
        <div class="hidden sm:flex items-center gap-3">
          <!-- desktop profile button (hidden on mobile) -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Profile menu" class="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 hover:shadow-md transition">
            <Icon name="User" :size="18" class="text-gray-700" />
            <span class="text-sm text-gray-800">Profile</span>
          </button>
        </div>
      </div>

      <!-- Search suggestions are rendered inside the input wrapper via SearchSuggestions component -->
    </div>

    <!-- Modern Animated Menu -->
    <Transition 
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="border-t border-red-200/50 bg-gradient-to-b from-white to-red-50/30 backdrop-blur-sm">
        <div class="px-4 sm:px-6 lg:px-8 py-6 space-y-3">
          <!-- Profile Section -->
          <NuxtLink 
            to="/profile"
            @click="mobileMenuOpen = false"
            class="w-full group relative px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 flex items-center gap-3 border border-transparent hover:border-red-200"
          >
            <div class="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <Icon name="User" :size="18" class="text-white" />
            </div>
            <div class="text-left">
              <p class="font-bold text-gray-900 group-hover:text-red-600 transition-colors">Profile</p>
              <p class="text-xs text-gray-500 group-hover:text-gray-600">Manage your account</p>
            </div>
            <Icon name="ChevronRight" :size="18" class="text-gray-300 group-hover:text-red-400 transition-all duration-300 ml-auto group-hover:translate-x-1" />
          </NuxtLink>

          <!-- Settings Section -->
          <NuxtLink 
            to="/settings"
            @click="mobileMenuOpen = false"
            class="w-full group relative px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-600/10 flex items-center gap-3 border border-transparent hover:border-blue-200"
          >
            <div class="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <Icon name="Settings" :size="18" class="text-white" />
            </div>
            <div class="text-left">
              <p class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Settings</p>
              <p class="text-xs text-gray-500 group-hover:text-gray-600">Customize your experience</p>
            </div>
            <Icon name="ChevronRight" :size="18" class="text-gray-300 group-hover:text-blue-400 transition-all duration-300 ml-auto group-hover:translate-x-1" />
          </NuxtLink>

          <!-- Divider -->
          <div class="h-px bg-gradient-to-r from-transparent via-red-200 to-transparent my-3"></div>

          <!-- Sign Out Section -->
          <button 
            @click="signOut"
            class="w-full group relative px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-600/10 flex items-center gap-3 border border-transparent hover:border-red-300"
          >
            <div class="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              <Icon name="LogOut" :size="18" class="text-white" />
            </div>
            <div class="text-left">
              <p class="font-bold text-gray-900 group-hover:text-red-600 transition-colors">Sign Out</p>
              <p class="text-xs text-gray-500 group-hover:text-gray-600">Logout from account</p>
            </div>
            <Icon name="ChevronRight" :size="18" class="text-gray-300 group-hover:text-red-400 transition-all duration-300 ml-auto group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Filter Modal - Teleported to body so it's not clipped by header or parent stacking contexts -->
    <teleport to="body">
      <div
        v-if="filterOpen"
        class="fixed inset-0 bg-black/50 z-50 transition-opacity flex items-center justify-center p-4"
        @click="filterOpen = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar filter-modal" @click.stop>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">Filters</h2>
            <button @click="filterOpen = false" class="text-gray-400 hover:text-gray-600">
              <Icon name="X" :size="24" />
            </button>
          </div>

          <div class="space-y-4 mb-6">
            <!-- State Filter -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">State</label>
              <div class="relative">
                <select v-model="selectedState" class="w-full px-4 py-3 border-2 border-red-200 rounded-lg bg-gradient-to-r from-white to-red-50 text-gray-900 font-medium focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-sm hover:border-red-300 cursor-pointer appearance-none pr-10">
                  <option value="" class="bg-white text-gray-900">All States</option>
                  <option value="Gujarat" class="bg-white text-gray-900">Gujarat</option>
                  <option value="Rajasthan" class="bg-white text-gray-900">Rajasthan</option>
                  <option value="Karnataka" class="bg-white text-gray-900">Karnataka</option>
                  <option value="Maharashtra" class="bg-white text-gray-900">Maharashtra</option>
                </select>
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-red-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Sect Filter -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Sect</label>
              <div class="relative">
                <select v-model="selectedSect" class="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-gradient-to-r from-white to-blue-50 text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm hover:border-blue-300 cursor-pointer appearance-none pr-10">
                  <option value="" class="bg-white text-gray-900">All Sects</option>
                  <option value="Shwetambar" class="bg-white text-gray-900">Shwetambar</option>
                  <option value="Digambar" class="bg-white text-gray-900">Digambar</option>
                </select>
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-blue-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Facilities Filter - Stylish Checkboxes with Icons -->
            <div class="border-t pt-4">
              <label class="block text-sm font-semibold text-gray-900 mb-3">Facilities</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Dharamshala -->
                <label class="flex items-center gap-3 p-3 rounded-lg border border-red-100 bg-gradient-to-br from-red-50 to-pink-50 cursor-pointer group hover:border-red-300 hover:shadow-md transition-all duration-300">
                  <input 
                    v-model="selectedFacilities"
                    type="checkbox" 
                    value="dharmashala"
                    class="w-4 h-4 rounded border-red-400 text-red-500 bg-white cursor-pointer accent-red-500 focus:ring-red-500"
                  >
                  <span class="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">Dharamshala</span>
                </label>

                <!-- Bhojanshala -->
                <label class="flex items-center gap-3 p-3 rounded-lg border border-red-100 bg-gradient-to-br from-red-50 to-pink-50 cursor-pointer group hover:border-red-300 hover:shadow-md transition-all duration-300">
                  <input 
                    v-model="selectedFacilities"
                    type="checkbox" 
                    value="bhojanshala"
                    class="w-4 h-4 rounded border-red-400 text-red-500 bg-white cursor-pointer accent-red-500 focus:ring-red-500"
                  >
                  <span class="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">Bhojanshala</span>
                </label>

                <!-- Gaushala -->
                <label class="flex items-center gap-3 p-3 rounded-lg border border-red-100 bg-gradient-to-br from-red-50 to-pink-50 cursor-pointer group hover:border-red-300 hover:shadow-md transition-all duration-300">
                  <input 
                    v-model="selectedFacilities"
                    type="checkbox" 
                    value="gaushala"
                    class="w-4 h-4 rounded border-red-400 text-red-500 bg-white cursor-pointer accent-red-500 focus:ring-red-500"
                  >
                  <span class="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">Gaushala</span>
                </label>

                <!-- Parking -->
                <label class="flex items-center gap-3 p-3 rounded-lg border border-red-100 bg-gradient-to-br from-red-50 to-pink-50 cursor-pointer group hover:border-red-300 hover:shadow-md transition-all duration-300">
                  <input 
                    v-model="selectedFacilities"
                    type="checkbox" 
                    value="parking"
                    class="w-4 h-4 rounded border-red-400 text-red-500 bg-white cursor-pointer accent-red-500 focus:ring-red-500"
                  >
                  <span class="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">Parking</span>
                </label>

                <!-- Restroom -->
                <label class="flex items-center gap-3 p-3 rounded-lg border border-red-100 bg-gradient-to-br from-red-50 to-pink-50 cursor-pointer group hover:border-red-300 hover:shadow-md transition-all duration-300">
                  <input 
                    v-model="selectedFacilities"
                    type="checkbox" 
                    value="washroom"
                    class="w-4 h-4 rounded border-red-400 text-red-500 bg-white cursor-pointer accent-red-500 focus:ring-red-500"
                  >
                  <span class="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">Restroom</span>
                </label>

                <!-- Water Facility -->
                <label class="flex items-center gap-3 p-3 rounded-lg border border-red-100 bg-gradient-to-br from-red-50 to-pink-50 cursor-pointer group hover:border-red-300 hover:shadow-md transition-all duration-300">
                  <input 
                    v-model="selectedFacilities"
                    type="checkbox" 
                    value="water"
                    class="w-4 h-4 rounded border-red-400 text-red-500 bg-white cursor-pointer accent-red-500 focus:ring-red-500"
                  >
                  <span class="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">Water Facility</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex gap-2 border-t pt-4">
            <button @click="resetFilters" class="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-all font-medium">
              Reset
            </button>
            <button @click="applyFilters" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium">
              Apply
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '~/components/common/Icon.vue'
import SearchSuggestions from '~/components/header/SearchSuggestions.vue'
import { useTirthStore } from '~/stores/tirth'
import { useDharamshalaStore } from '~/stores/dharamshala'
import { useBhojanshalaStore } from '~/stores/bhojanshala'
// Logo asset
import tirthlokLogo from '~/assets/images/logo-tirthlok.jpeg'

const tithStore = useTirthStore()
const dStore = useDharamshalaStore()
const bStore = useBhojanshalaStore()
const route = useRoute()
// template ref for the search wrapper (passed to SearchSuggestions)
const searchWrapper = ref<HTMLElement | null>(null)

const mobileMenuOpen = ref(false)
const filterOpen = ref(false)
const searchQuery = ref('')
const showSuggestions = ref(false)

// Filter state (used when user applies filters)
const selectedState = ref('')
const selectedSect = ref('')
const selectedFacilities = ref<string[]>([])

// Route-aware suggestions source: pick name arrays from stores
const suggestionsSource = computed(() => {
  const p = route.path || ''
  if (p.startsWith('/dharamshala')) return dStore.dharamshalaNames || []
  if (p.startsWith('/bhojanshala')) return bStore.bhojanshalaNames || []
  // default: landing or tirth pages => tirths
  return tithStore.tirthNames || []
})

// When user types, call the appropriate store filter for the current page
const handleSearch = () => {
  const q = searchQuery.value || undefined
  // Ensure suggestions re-open when the user types after a previous selection
  if (searchQuery.value && searchQuery.value.length >= 1) showSuggestions.value = true
  const p = route.path || ''
  if (p.startsWith('/dharamshala')) {
    dStore.filterDharamshalas({ searchTerm: q })
  } else if (p.startsWith('/bhojanshala')) {
    bStore.filterBhojanshalas({ searchTerm: q })
  } else {
    tithStore.filterTirths({ searchTerm: q })
  }
}

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  showSuggestions.value = false
  handleSearch()
}

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const applyFilters = () => {
  tithStore.filterTirths({
    state: selectedState.value || undefined,
    sect: selectedSect.value || undefined,
    facilities: selectedFacilities.value.length > 0 ? selectedFacilities.value : undefined,
    searchTerm: searchQuery.value || undefined,
  })
  filterOpen.value = false
}

const resetFilters = () => {
  selectedState.value = ''
  selectedSect.value = ''
  selectedFacilities.value = []
  searchQuery.value = ''
  tithStore.filterTirths({})
  filterOpen.value = false
}

const signOut = () => {
  mobileMenuOpen.value = false
  // Implement sign out logic here
  console.log('User signed out')
  // You can redirect to home or login page
  navigateTo('/')
}
</script>
