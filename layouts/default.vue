<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
    <!-- Header - Modern Gradient -->
    <header class="bg-gradient-to-r from-white via-red-50 to-white border-b border-red-200/50 sticky top-0 z-40 shadow-md backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <!-- Top Row: Logo and Menu -->
        <div class="flex items-center justify-between gap-4 mb-3">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 flex-shrink-0 group">
            <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 animate-pulse-glow">
              <Icon name="Palmtree" :size="22" class="text-white group-hover:animate-float" />
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent font-serif hidden sm:inline group-hover:opacity-80 transition-opacity">TirthLok</span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-4">
            <button class="text-gray-600 hover:text-red-500 font-medium text-sm transition-colors p-2 hover:bg-red-50 rounded-full">
              <Icon name="Globe" :size="20" />
            </button>
            <button class="flex items-center gap-2 px-5 py-2 border-2 border-red-300 rounded-full hover:bg-red-50 transition-all hover:shadow-lg font-medium text-sm">
              <Icon name="Menu" :size="18" />
              <Icon name="User" :size="18" />
            </button>
          </nav>

          <!-- Mobile Menu Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Icon name="Menu" :size="24" class="text-gray-900" />
          </button>
        </div>

        <!-- Search Bar - Full Width with Gradient -->
        <div class="flex items-center gap-2 bg-gradient-to-r from-white to-red-50 border-2 border-red-200 rounded-full px-4 py-2.5 hover:shadow-lg hover:border-red-300 transition-all focus-within:ring-2 focus-within:ring-red-400 focus-within:ring-opacity-50">
          <Icon name="Search" :size="18" class="text-red-500 flex-shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search temples, cities..."
            class="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-sm font-medium"
            @input="handleSearch"
            @focus="showSuggestions = true"
            @blur="handleBlur"
          />
          <button
            @click="filterOpen = !filterOpen"
            class="p-2 hover:bg-red-100 rounded-lg transition-all hover:text-red-600"
          >
            <Icon name="Sliders" :size="18" class="text-gray-600 flex-shrink-0 cursor-pointer" />
          </button>
        </div>

        <!-- Search Suggestions -->
        <div
          v-if="showSuggestions && filteredSuggestions.length > 0"
          class="absolute top-20 left-4 right-4 md:left-auto md:right-auto md:w-full md:max-w-md bg-white rounded-xl shadow-2xl border-2 border-red-200 z-50 animate-slide-up md:ml-16 overflow-hidden"
        >
          <div class="max-h-96 overflow-y-auto">
            <div>
              <div v-if="searchQuery" class="px-4 py-3 text-xs font-bold text-red-600 uppercase tracking-widest bg-gradient-to-r from-red-50 to-transparent">
                🔍 Results
              </div>
              <button
                v-for="suggestion in filteredSuggestions"
                :key="suggestion"
                @click="selectSuggestion(suggestion)"
                class="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-red-50 to-transparent transition-all flex items-center gap-3 border-b border-gray-100 last:border-0 hover:border-red-200"
              >
                <Icon name="MapPin" :size="18" class="text-red-500" />
                <span class="text-sm font-medium text-gray-900">{{ suggestion }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white">
        <div class="px-4 py-4 space-y-4">
          <button class="w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2">Become a host</button>
          <button class="w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2">Help & Support</button>
        </div>
      </div>
    </header>

    <!-- Filter Modal - Only visible when filterOpen is true -->
    <BaseModal 
      v-if="filterOpen"
      v-model="filterOpen" 
      title="Filters" 
      :show-overlay="true"
    >
      <div class="space-y-6 px-6 py-4">
        <!-- State Filter -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">State</label>
          <select
            :value="filters.state || ''"
            @input="setFilter('state', ($event.target as HTMLSelectElement).value)"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-sm"
          >
            <option value="">All States</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
          </select>
        </div>

        <!-- Sect Filter -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">Sect</label>
          <select
            :value="filters.sect || ''"
            @input="setFilter('sect', ($event.target as HTMLSelectElement).value)"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-sm"
          >
            <option value="">All Sects</option>
            <option value="Shwetambar">Shwetambar</option>
            <option value="Digambar">Digambar</option>
          </select>
        </div>

        <!-- Type Filter -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">Type</label>
          <select
            :value="filters.type || ''"
            @input="setFilter('type', ($event.target as HTMLSelectElement).value)"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-sm"
          >
            <option value="">All Types</option>
            <option value="Temple">Temple</option>
            <option value="Mountain Peak">Mountain Peak</option>
            <option value="Cave">Cave</option>
          </select>
        </div>

        <!-- Amenities Filter -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-3">Amenities</label>
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" :checked="filterValues.amenities.includes('parking')" @change="toggleAmenity('parking')" class="w-4 h-4 border-gray-300 rounded text-red-500 focus:ring-red-500" />
              <span class="text-sm text-gray-700">Parking</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" :checked="filterValues.amenities.includes('lodging')" @change="toggleAmenity('lodging')" class="w-4 h-4 border-gray-300 rounded text-red-500 focus:ring-red-500" />
              <span class="text-sm text-gray-700">Lodging</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" :checked="filterValues.amenities.includes('food')" @change="toggleAmenity('food')" class="w-4 h-4 border-gray-300 rounded text-red-500 focus:ring-red-500" />
              <span class="text-sm text-gray-700">Food</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <template #footer>
        <div class="flex gap-2 p-4 border-t border-gray-200">
          <BaseButton
            variant="secondary"
            size="md"
            @click="_handleResetFilters"
            class="flex-1"
          >
            Reset
          </BaseButton>
          <BaseButton
            variant="primary"
            size="md"
            @click="applyFilters"
            class="flex-1"
          >
            Apply
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-32 md:pb-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-charcoal text-light-gray mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-safe">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-white font-bold text-lg mb-4">About Jain Tirth Explorer</h3>
            <p class="text-sm leading-relaxed">Discover and explore sacred Jain pilgrimage sites with comprehensive information, nearby facilities, and interactive maps.</p>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink></li>
              <li><NuxtLink to="/favorites" class="hover:text-white transition-colors">Favorites</NuxtLink></li>
              <li><a href="#about" class="hover:text-white transition-colors">About</a></li>
              <li><a href="#contact" class="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4">Help</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#faq" class="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#privacy" class="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#terms" class="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4">Contact</h3>
            <p class="text-sm mb-2">Email: info@jainthirthexplorer.com</p>
            <p class="text-sm mb-4">Phone: +91 XXXX-XXXX-XXXX</p>
            <div class="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener" class="text-gray-400 hover:text-white transition-colors">
                <Icon name="Facebook" :size="20" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener" class="text-gray-400 hover:text-white transition-colors">
                <Icon name="Twitter" :size="20" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener" class="text-gray-400 hover:text-white transition-colors">
                <Icon name="Instagram" :size="20" />
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8">
          <p class="text-center text-sm text-gray-400">&copy; 2024 Jain Tirth Explorer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFilter } from '~/composables/useFilter'
import { useTirthStore } from '~/stores/tirth'

const mobileMenuOpen = ref(false)
const filterOpen = ref(false)
const searchQuery = ref('')
const showSuggestions = ref(false)
const tirtStore = useTirthStore()

const suggestions = [
  'Palitana',
  'Ranakpur',
  'Hastinapur',
  'Indore',
  'Ujjain',
  'Mathura',
  'Gaya',
  'Shirpur',
]

// Initialize filter composable
const { filters, setFilter, resetFilters } = useFilter([], ['state', 'sect', 'type', 'amenities'])

const filterValues = computed(() => ({
  state: filters.value.state || '',
  sect: filters.value.sect || '',
  type: filters.value.type || '',
  amenities: typeof filters.value.amenities === 'string' ? filters.value.amenities.split(',').filter(Boolean) : []
}))

const filteredSuggestions = computed(() => {
  if (!searchQuery.value) return []
  return suggestions.filter(s =>
    s.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleSearch = () => {
  // handleSearch: hook into search/composable when needed
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

const toggleAmenity = (amenity: string) => {
  const currentStr = typeof filters.value.amenities === 'string' ? filters.value.amenities : ''
  const currentAmenities = currentStr ? currentStr.split(',') : []
  let newAmenities: string[]
  if (currentAmenities.includes(amenity)) {
    newAmenities = currentAmenities.filter((a: string) => a !== amenity)
  } else {
    newAmenities = [...currentAmenities, amenity]
  }
  setFilter('amenities', newAmenities.join(','))
}

const applyFilters = () => {
  // Apply filters to tirth store
  tirtStore.filterTirths({
    state: filters.value.state || undefined,
    sect: filters.value.sect || undefined,
    type: filters.value.type || undefined,
  })
  // Close modal
  filterOpen.value = false
}

const _handleResetFilters = () => {
  resetFilters()
  // Also reset tirth store to show all tirths
  tirtStore.filterTirths({})
  filterOpen.value = false
}
</script>
