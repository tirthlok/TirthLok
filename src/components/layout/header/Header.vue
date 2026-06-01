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
            'text-lg font-bold hidden md:block tracking-tight group-hover:text-primary transition-colors',
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
                <Icon name="Search" :size="18" class="absolute left-4 transition-colors text-gray-500 group-focus-within:text-primary dark:text-gray-400" />
                
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
                    <!-- Active filters badge (visible on mobile) -->
                    <span v-if="activeFilterCount > 0" class="md:hidden absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full">{{ activeFilterCount }}</span>
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
            <!-- Notification Bell (only when logged in) -->
            <button 
              v-if="isAuthenticated"
              :class="[
                'p-2 rounded-full text-gray-500 hover:text-primary transition-colors relative group',
                themeStore?.isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
              ]"
            >
              <Icon name="Bell" :size="20" />
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white scale-0 group-hover:scale-100 transition-transform"></span>
            </button>
            
            <!-- Login Button (when NOT authenticated) -->
            <NuxtLink 
              v-if="!isAuthenticated"
              to="/auth/login"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-full border hover:shadow-md transition-all cursor-pointer font-medium text-sm',
                themeStore?.isDarkMode 
                  ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              ]"
            >
              <Icon name="User" :size="18" />
              <span>Login</span>
            </NuxtLink>
            
            <!-- Profile Dropdown (when authenticated) -->
            <div v-if="isAuthenticated" class="relative" ref="profileDropdownRef">
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
                  {{ userInitials }}
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
                    ]">{{ userFullName }}</p>
                    <p :class="[
                      'text-xs truncate',
                      themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    ]">{{ userEmail }}</p>
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
            
            <!-- Login Button (when NOT authenticated) -->
            <NuxtLink 
              v-if="!isAuthenticated"
              to="/auth/login" 
              @click="mobileMenuOpen = false" 
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl',
                themeStore?.isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              <Icon name="LogIn" :size="18" />
              <span>Login / Sign Up</span>
            </NuxtLink>
            
            <!-- User Info & Actions (when authenticated) -->
            <template v-if="isAuthenticated">
              <!-- User Info Header -->
              <div :class="[
                'px-4 py-3 rounded-xl mb-2',
                themeStore?.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              ]">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {{ userInitials }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p :class="[
                      'text-sm font-semibold truncate',
                      themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
                    ]">{{ userFullName }}</p>
                    <p :class="[
                      'text-xs truncate',
                      themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    ]">{{ userEmail }}</p>
                  </div>
                </div>
              </div>
              
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
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Filter Panel Component - Context Aware -->
    <DharamshalaFilterPanel
      v-if="currentPage === 'dharamshala'"
      :is-open="filterOpen"
      :search-query="searchQuery"
      @update:is-open="filterOpen = $event"
      @apply="filterOpen = false"
      @reset="searchQuery = ''"
    />
    <TirthFilterPanel
      v-else-if="currentPage === 'tirth'"
      :is-open="filterOpen"
      :search-query="searchQuery"
      @update:is-open="filterOpen = $event"
      @apply="filterOpen = false"
      @reset="searchQuery = ''"
    />
    <!-- Add BhojanshalaFilterPanel when it's created -->
    <!-- <BhojanshalaFilterPanel
      v-else-if="currentPage === 'bhojanshala'"
      :is-open="filterOpen"
      :search-query="searchQuery"
      @update:is-open="filterOpen = $event"
      @apply="filterOpen = false"
      @reset="searchQuery = ''"
    /> -->
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '~/components/ui/Icon.vue'
import SearchSuggestions from '~/components/layout/header/SearchSuggestions.vue'
import TirthFilterPanel from '~/components/ui/filters/TirthFilterPanel.vue'
import DharamshalaFilterPanel from '~/components/ui/filters/DharamshalaFilterPanel.vue'
import { useTirthStore } from '~/stores/tirth'
import { useDharamshalaStore } from '~/stores/dharamshala'
import { useBhojanshalaStore } from '~/stores/bhojanshala'
import { useThemeStore } from '~/stores/theme'
import { useAuth } from '~/features/auth/composables/useAuth'
import tirthlokLogo from '~/assets/images/logo-tirthlok.png'

const tirthStore = useTirthStore()
const dStore = useDharamshalaStore()
const bStore = useBhojanshalaStore()
const themeStore = useThemeStore()
const route = useRoute()
const searchWrapper = ref<HTMLElement | null>(null)
const profileDropdownRef = ref<HTMLElement | null>(null)

// Auth state
const { 
  user, 
  isAuthenticated, 
  initialize: initAuth, 
  signOut: authSignOut,
  getCustomerProfile 
} = useAuth()

// Customer profile data
const customerProfile = ref<{
  customer_first_name?: string | null
  customer_last_name?: string | null
  customer_email_id?: string | null
} | null>(null)

// Computed user display properties
const userInitials = computed(() => {
  if (!isAuthenticated.value) return ''
  
  const firstName = customerProfile.value?.customer_first_name || user.value?.user_metadata?.first_name || ''
  const lastName = customerProfile.value?.customer_last_name || user.value?.user_metadata?.last_name || ''
  
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  if (firstName) {
    return firstName.substring(0, 2).toUpperCase()
  }
  // Fallback to email initials
  const email = user.value?.email || ''
  return email.substring(0, 2).toUpperCase()
})

const userFullName = computed(() => {
  if (!isAuthenticated.value) return ''
  
  const firstName = customerProfile.value?.customer_first_name || user.value?.user_metadata?.first_name || ''
  const lastName = customerProfile.value?.customer_last_name || user.value?.user_metadata?.last_name || ''
  
  if (firstName || lastName) {
    return `${firstName} ${lastName}`.trim()
  }
  return user.value?.email?.split('@')[0] || 'User'
})

const userEmail = computed(() => {
  if (!isAuthenticated.value) return ''
  return customerProfile.value?.customer_email_id || user.value?.email || ''
})

// Load customer profile when user is authenticated
const loadCustomerProfile = async () => {
  if (user.value?.id) {
    const result = await getCustomerProfile()
    if (result.success && result.data) {
      customerProfile.value = result.data
    }
  }
}

// Watch for auth state changes
watch(isAuthenticated, async (newVal) => {
  if (newVal) {
    await loadCustomerProfile()
  } else {
    customerProfile.value = null
  }
})

const mobileMenuOpen = ref(false)
const filterOpen = ref(false)
const profileOpen = ref(false)
const searchQuery = ref('')
const showSuggestions = ref(false)
const isScrolled = ref(false)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

const navLinks = [
  { name: 'Tirth', path: '/tirth', icon: 'Mandir', color: 'red' },
  { name: 'Dharamshala', path: '/dharamshala', icon: 'Building', color: 'blue' },
  { name: 'Bhojanshala', path: '/bhojanshala', icon: 'UtensilsCrossed', color: 'green' },
]

const isActive = (path: string) => route.path.startsWith(path)

// Determine current page context for filter panel
const currentPage = computed(() => {
  const p = route.path || ''
  if (p.startsWith('/dharamshala')) return 'dharamshala'
  if (p.startsWith('/bhojanshala')) return 'bhojanshala'
  if (p.startsWith('/tirth')) return 'tirth'
  return 'tirth' // default
})

// Calculate active filter count for current page (mobile filter badge)
const activeFilterCount = computed(() => {
  const p = route.path || ''
  
  // Tirth page filters
  if (p.startsWith('/tirth')) {
    const filters = tirthStore.currentFilters
    let count = 0
    if (filters.state) count++
    if (filters.sect) count++
    if (filters.amenities && filters.amenities.length > 0) count += filters.amenities.length
    return count
  }
  
  // Dharamshala page filters
  if (p.startsWith('/dharamshala')) {
    const filters = dStore.currentFilters
    let count = 0
    if (filters.state) count++
    if (filters.city) count++
    if (filters.facilities && filters.facilities.length > 0) count += filters.facilities.length
    return count
  }
  
  return 0
})

const suggestionsSource = computed(() => {
  const p = route.path || ''
  if (p.startsWith('/dharamshala')) return dStore.dharamshalaNames || []
  if (p.startsWith('/bhojanshala')) return bStore.bhojanshalaNames || []
  return tirthStore.tirthNames || []
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
    tirthStore.filterTirths({ searchTerm: q })
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

const signOut = async () => {
  mobileMenuOpen.value = false
  profileOpen.value = false
  await authSignOut()
  customerProfile.value = null
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

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // Initialize auth and load profile
  await initAuth()
  if (isAuthenticated.value) {
    await loadCustomerProfile()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>