<template>
  <header 
    class="sticky top-0 z-50 font-sans transition-all duration-300"
    :class="[
      isScrolled 
        ? (themeStore?.isDarkMode ? 'bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 shadow-none' : 'bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-none')
        : (themeStore?.isDarkMode ? 'bg-gray-950/95 backdrop-blur-sm shadow-sm' : 'bg-white/95 backdrop-blur-sm shadow-sm')
    ]"
  >
    <div class="max-w-full mx-auto px-3 sm:px-4 lg:px-6">
      <div 
        class="flex py-4 sm:items-center sm:justify-around md:justify-between gap-4 md:items-start transition-all duration-300"
      >
        
        <!-- Left: Logo -->
        <NuxtLink 
          to="/" 
          class="flex items-center gap-2 flex-shrink-0 group transition-all duration-300"
          :class="isScrolled ? 'pt-2' : 'pt-1'"
        >
          <div class="w-10 h-10 overflow-hidden transition-all duration-300">
            <img :src="tirthlokLogo" alt="TirthLok" class="w-full h-full object-cover" />
          </div>
          <span :class="[
            'text-lg font-bold hidden md:block font-serif tracking-tight group-hover:text-primary transition-colors',
            themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
          ]">TirthLok</span>
        </NuxtLink>

        <!-- Middle: Nav & Search -->
        <div class="flex-1 flex flex-col items-center max-w-3xl mx-auto w-full transition-all duration-300">
          
          <!-- Navigation (hidden on small screens) -->
          <nav 
            class="hidden sm:flex items-center gap-2 transition-all duration-300 ease-in-out overflow-hidden"
            :class="isScrolled ? 'h-0 opacity-0 mb-0' : 'h-10 opacity-100 mb-3'"
          >
            <NuxtLink 
              v-for="link in navLinks" 
              :key="link.path" 
              :to="link.path"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              :class="{
                'bg-red-500 text-white shadow-md': isActive(link.path) && link.color === 'red',
                'bg-blue-500 text-white shadow-md': isActive(link.path) && link.color === 'blue',
                'bg-green-500 text-white shadow-md': isActive(link.path) && link.color === 'green',
                'text-gray-300 hover:text-white hover:bg-gray-800': !isActive(link.path) && themeStore?.isDarkMode,
                'text-gray-600 hover:text-gray-900 hover:bg-gray-50': !isActive(link.path) && !themeStore?.isDarkMode,
              }"
            >
              <Icon 
                :name="link.icon as any" 
                :size="18"
                :class="`${!isActive(link.path) && link.color === 'red' ? 'text-red-500' : ''} ${!isActive(link.path) && link.color === 'blue' ? 'text-blue-500' : ''} ${!isActive(link.path) && link.color === 'green' ? 'text-green-500' : ''}`"
              />
              {{ link.name }}
            </NuxtLink>
          </nav>

          <!-- Search Bar -->
          <div class="w-full relative group max-w-2xl pt-1">
             <div ref="searchWrapper" class="relative flex items-center w-full">
                <input 
                  v-model="searchQuery"
                  type="text"
                  :placeholder="searchPlaceholder"
                  :class="[
                    'w-full border-2 rounded-full py-3 pl-11 pr-12 text-sm transition-all duration-300 outline-none shadow-sm hover:shadow-md focus:shadow-lg truncate',
                    themeStore?.isDarkMode 
                      ? getSearchBorderColorDark()
                      : 'bg-gray-100 focus:bg-white placeholder-gray-500 text-gray-900 border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/10'
                  ]"
                  @focus="showSuggestions = true"
                  @blur="handleBlur"
                  @input="handleSearch"
                />
                <Icon name="Search" :size="18" class="absolute left-4 group-focus-within:text-primary transition-colors text-gray-500 group-focus-within:text-primary dark:text-gray-400" />
                
                <!-- Filter Button inside Search -->
                <button 
                  @click.stop="filterOpen = !filterOpen" 
                  :class="[
                    'absolute right-2 p-1.5 rounded-full transition-colors',
                    themeStore?.isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                  ]"
                >
                  <div :class="[
                    'flex items-center gap-2 pl-2',
                    themeStore?.isDarkMode ? 'border-l border-gray-700' : 'border-l border-gray-200'
                  ]">
                    <Icon name="Sliders" :size="16" />
                  </div>
                </button>
                
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

        <!-- Right: Profile & Mobile Menu -->
        <div 
          class="flex items-center gap-3 flex-shrink-0 transition-all duration-300"
          :class="isScrolled ? 'pt-2' : 'pt-1'"
        >
          <!-- Desktop Profile Dropdown -->
          <div class="hidden md:flex items-center gap-3 pl-2">
            <button :class="[
              'p-2 rounded-full text-gray-500 hover:text-primary transition-colors relative group',
              themeStore?.isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
            ]">
              <Icon name="Bell" :size="20" />
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white scale-0 group-hover:scale-100 transition-transform"></span>
            </button>
            
            <div class="relative" ref="profileDropdownRef">
              <button 
                @click="profileOpen = !profileOpen"
                :class="[
                  'flex items-center gap-2 p-1 pr-3 rounded-full border hover:shadow-md transition-all cursor-pointer',
                  themeStore?.isDarkMode 
                    ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' 
                    : 'border-gray-200 bg-white'
                ]"
              >
                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  SS
                </div>
                <Icon name="ChevronDown" :size="14" :class="`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''} ${themeStore?.isDarkMode ? 'text-gray-500' : 'text-gray-400'}`" />
              </button>

              <!-- Profile Dropdown Menu -->
              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div :class="[
                  'absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 origin-top-right z-50',
                  themeStore?.isDarkMode 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-100'
                ]" v-if="profileOpen">
                  <div :class="[
                    'px-4 py-3 border-b mb-1',
                    themeStore?.isDarkMode ? 'border-gray-700' : 'border-gray-50'
                  ]">
                    <p :class="[
                      'text-sm font-semibold',
                      themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
                    ]">Shreyas Shah</p>
                    <p :class="[
                      'text-xs truncate',
                      themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    ]">shreyas@example.com</p>
                  </div>
                  
                  <NuxtLink to="/profile" @click="profileOpen = false" :class="[
                    'flex items-center gap-3 px-4 py-2.5 text-sm hover:text-primary transition-colors',
                    themeStore?.isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  ]">
                    <Icon name="User" :size="16" />
                    Profile
                  </NuxtLink>
                  <NuxtLink to="/settings" @click="profileOpen = false" :class="[
                    'flex items-center gap-3 px-4 py-2.5 text-sm hover:text-primary transition-colors',
                    themeStore?.isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  ]">
                    <Icon name="Settings" :size="16" />
                    Settings
                  </NuxtLink>
                  <div :class="[
                    'h-px my-1',
                    themeStore?.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  ]"></div>
                  <button @click="signOut" :class="[
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left',
                    themeStore?.isDarkMode 
                      ? 'text-red-400 hover:bg-red-900/30' 
                      : 'text-red-600 hover:bg-red-50'
                  ]">
                    <Icon name="LogOut" :size="16" />
                    Sign Out
                  </button>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="md:hidden p-2 rounded-full hover:bg-gray-50 border border-gray-200 text-gray-600 transition-colors"
          >
            <Icon :name="mobileMenuOpen ? 'X' : 'Menu'" :size="20" />
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Menu Drawer -->
    <Transition 
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" :class="[
        'md:hidden border-t absolute w-full shadow-lg max-h-[80vh] overflow-y-auto z-40',
        themeStore?.isDarkMode 
          ? 'border-gray-800 bg-gray-800' 
          : 'border-gray-100 bg-white'
      ]">
        <div class="p-4 space-y-6">

          <!-- User Actions -->
          <div class="space-y-1">
            <p :class="[
              'px-4 text-xs font-semibold uppercase tracking-wider mb-2',
              themeStore?.isDarkMode ? 'text-gray-500' : 'text-gray-400'
            ]">Account</p>
            <NuxtLink to="/profile" @click="mobileMenuOpen = false" :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl',
              themeStore?.isDarkMode 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-700 hover:bg-gray-50'
            ]">
              <Icon name="User" :size="18" />
              <span>Profile</span>
            </NuxtLink>
            <NuxtLink to="/settings" @click="mobileMenuOpen = false" :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl',
              themeStore?.isDarkMode 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-700 hover:bg-gray-50'
            ]">
              <Icon name="Settings" :size="18" />
              <span>Settings</span>
            </NuxtLink>
            <button @click="signOut" :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl',
              themeStore?.isDarkMode 
                ? 'text-red-400 hover:bg-red-900/30' 
                : 'text-red-600 hover:bg-red-50'
            ]">
              <Icon name="LogOut" :size="18" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Filter Modal - Teleported to body -->
    <teleport to="body">
      <div
        v-if="filterOpen"
        class="fixed inset-0 bg-black/50 z-[60] transition-opacity flex items-center justify-center p-4 backdrop-blur-sm"
        @click="filterOpen = false"
      >
        <div :class="[
          'rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar filter-modal animate-fade-in-up',
          themeStore?.isDarkMode ? 'bg-gray-800' : 'bg-white'
        ]" @click.stop>
          <!-- ... existing filter modal content ... -->
          <div class="flex items-center justify-between mb-6">
            <h2 :class="[
              'text-xl font-bold',
              themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
            ]">Filters</h2>
            <button @click="filterOpen = false" :class="[
              'p-2 rounded-full transition-colors',
              themeStore?.isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            ]">
              <Icon name="X" :size="20" :class="themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-500'" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- State Filter -->
            <div>
              <label :class="[
                'block text-sm font-semibold mb-2',
                themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
              ]">State</label>
              <div class="relative">
                <select v-model="selectedState" :class="[
                  'w-full px-4 py-3 border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none',
                  themeStore?.isDarkMode 
                    ? 'border-gray-700 bg-gray-700 text-white' 
                    : 'border-gray-200 bg-gray-50 text-gray-900'
                ]">
                  <option value="">All States</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
                <Icon name="ChevronDown" :size="16" :class="`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${themeStore?.isDarkMode ? 'text-gray-500' : 'text-gray-400'}`" />
              </div>
            </div>

            <!-- Sect Filter -->
            <div>
              <label :class="[
                'block text-sm font-semibold mb-2',
                themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
              ]">Sect</label>
              <div class="flex gap-2">
                <button 
                  v-for="sect in ['Shwetambar', 'Digambar']" 
                  :key="sect"
                  @click="selectedSect = selectedSect === sect ? '' : sect"
                  class="flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all"
                  :class="selectedSect === sect ? 'border-primary bg-primary/5 text-primary' : (themeStore?.isDarkMode ? 'border-gray-700 text-gray-300 hover:border-gray-600' : 'border-gray-200 text-gray-600 hover:border-gray-300')"
                >
                  {{ sect }}
                </button>
              </div>
            </div>

            <!-- Facilities Filter -->
            <div>
              <label :class="[
                'block text-sm font-semibold mb-3',
                themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
              ]">Facilities</label>
              <div class="grid grid-cols-2 gap-3">
                <label 
                  v-for="facility in facilitiesList" 
                  :key="facility.value"
                  class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
                  :class="selectedFacilities.includes(facility.value) ? 'border-primary bg-primary/5' : (themeStore?.isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300')"
                >
                  <input 
                    v-model="selectedFacilities"
                    type="checkbox" 
                    :value="facility.value"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  >
                  <span :class="[
                    'text-sm',
                    themeStore?.isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  ]">{{ facility.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <div :class="[
            'flex gap-3 mt-8 pt-6 border-t',
            themeStore?.isDarkMode ? 'border-gray-700' : 'border-gray-100'
          ]">
            <button @click="resetFilters" :class="[
              'flex-1 px-4 py-3 border rounded-xl font-semibold transition-colors',
              themeStore?.isDarkMode 
                ? 'border-gray-700 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            ]">
              Reset
            </button>
            <button @click="applyFilters" class="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold shadow-lg shadow-primary/30 transition-all">
              Show Results
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '~/components/common/Icon.vue'
import SearchSuggestions from '~/components/header/SearchSuggestions.vue'
import { useTirthStore } from '~/stores/tirth'
import { useDharamshalaStore } from '~/stores/dharamshala'
import { useBhojanshalaStore } from '~/stores/bhojanshala'
import { useThemeStore } from '~/stores/theme'
import tirthlokLogo from '~/assets/images/logo-tirthlok.png'

const tithStore = useTirthStore()
const dStore = useDharamshalaStore()
const bStore = useBhojanshalaStore()
const themeStore = useThemeStore()
const route = useRoute()
const searchWrapper = ref<HTMLElement | null>(null)
const profileDropdownRef = ref<HTMLElement | null>(null)

const mobileMenuOpen = ref(false)
const filterOpen = ref(false)
const profileOpen = ref(false)
const searchQuery = ref('')
const showSuggestions = ref(false)
const isScrolled = ref(false)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

// Filter state
const selectedState = ref('')
const selectedSect = ref('')
const selectedFacilities = ref<string[]>([])

const navLinks = [
  { name: 'Tirth', path: '/tirth', icon: 'Building2', color: 'red' },
  { name: 'Dharamshala', path: '/dharamshala', icon: 'Building', color: 'blue' },
  { name: 'Bhojanshala', path: '/bhojanshala', icon: 'UtensilsCrossed', color: 'green' },
]

const facilitiesList = [
  { label: 'Dharamshala', value: 'dharmashala' },
  { label: 'Bhojanshala', value: 'bhojanshala' },
  { label: 'Gaushala', value: 'gaushala' },
  { label: 'Parking', value: 'parking' },
  { label: 'Restroom', value: 'washroom' },
  { label: 'Water', value: 'water' },
]

const isActive = (path: string) => route.path.startsWith(path)

const suggestionsSource = computed(() => {
  const p = route.path || ''
  if (p.startsWith('/dharamshala')) return dStore.dharamshalaNames || []
  if (p.startsWith('/bhojanshala')) return bStore.bhojanshalaNames || []
  return tithStore.tirthNames || []
})

const searchPlaceholder = computed(() => {
  const p = route.path || ''
  if (p.startsWith('/dharamshala')) return 'Search dharamshalas...'
  if (p.startsWith('/bhojanshala')) return 'Search bhojanshalas...'
  return 'Search tirths...'
})

const handleSearch = () => {
  const q = searchQuery.value || undefined
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
  profileOpen.value = false
  navigateTo('/')
}

// Close profile dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target as Node)) {
    profileOpen.value = false
  }
}

const handleScroll = () => {
  // Debounce scroll handler to reduce flickering
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    isScrolled.value = window.scrollY > 20
  }, 16) // ~60fps debounce
}

const getSearchBorderColorDark = () => {
  const p = route.path || ''
  if (p.startsWith('/dharamshala')) {
    return 'bg-gray-800 focus:bg-gray-700 placeholder-gray-500 text-white border-blue-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20'
  }
  if (p.startsWith('/bhojanshala')) {
    return 'bg-gray-800 focus:bg-gray-700 placeholder-gray-500 text-white border-green-500 focus:border-green-400 focus:ring-4 focus:ring-green-500/20'
  }
  return 'bg-gray-800 focus:bg-gray-700 placeholder-gray-500 text-white border-red-500 focus:border-red-400 focus:ring-4 focus:ring-red-500/20'
}

// Watch route changes and reset scroll state
watch(() => route.path, () => {
  isScrolled.value = false
  if (scrollTimeout) clearTimeout(scrollTimeout)
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>
