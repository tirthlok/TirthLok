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

          <!-- Hamburger Button - Modern Animated -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="p-2 hover:bg-red-100 rounded-lg transition-all duration-300 group"
          >
            <div class="w-6 h-5 flex flex-col justify-center gap-1.5 relative">
              <span 
                class="w-6 h-0.5 bg-gray-900 rounded-full transition-all duration-300 origin-center"
                :class="mobileMenuOpen ? 'rotate-45 translate-y-3' : ''"
              ></span>
              <span 
                class="w-6 h-0.5 bg-gray-900 rounded-full transition-all duration-300"
                :class="mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'"
              ></span>
              <span 
                class="w-6 h-0.5 bg-gray-900 rounded-full transition-all duration-300 origin-center"
                :class="mobileMenuOpen ? '-rotate-45 -translate-y-3' : ''"
              ></span>
            </div>
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
    </header>

    <!-- Filter Modal - Only visible when filterOpen is true -->
    <div 
      v-if="filterOpen"
      class="fixed inset-0 bg-black/50 z-40 transition-opacity"
      @click="filterOpen = false"
    >
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-11/12 max-w-md" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Filters</h2>
          <button @click="filterOpen = false" class="text-gray-400 hover:text-gray-600">
            <Icon name="X" :size="24" />
          </button>
        </div>

        <div class="space-y-4 max-h-96 overflow-y-auto mb-6">
          <!-- State Filter -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">State</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:border-red-500 outline-none transition-all text-sm">
              <option value="">All States</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>

          <!-- Sect Filter -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Sect</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:border-red-500 outline-none transition-all text-sm">
              <option value="">All Sects</option>
              <option value="Shwetambar">Shwetambar</option>
              <option value="Digambar">Digambar</option>
            </select>
          </div>

          <!-- Type Filter -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Type</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:border-red-500 outline-none transition-all text-sm">
              <option value="">All Types</option>
              <option value="Temple">Temple</option>
              <option value="Mountain Peak">Mountain Peak</option>
              <option value="Cave">Cave</option>
            </select>
          </div>
        </div>

        <div class="flex gap-2 border-t pt-4">
          <button @click="filterOpen = false" class="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-all font-medium">
            Cancel
          </button>
          <button @click="filterOpen = false" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium">
            Apply
          </button>
        </div>
      </div>
    </div>

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
              <li><NuxtLink to="/tirth" class="hover:text-white transition-colors">Tirth</NuxtLink></li>
              <li><NuxtLink to="/dharamshala" class="hover:text-white transition-colors">Dharamshala</NuxtLink></li>
              <li><NuxtLink to="/bhojanshala" class="hover:text-white transition-colors">Bhojanshala</NuxtLink></li>
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

const mobileMenuOpen = ref(false)
const filterOpen = ref(false)
const searchQuery = ref('')
const showSuggestions = ref(false)

const suggestions = [
  'Palitana',
  'Ranakpur',
  'Girnar',
  'Shikharji',
  'Dharamshala',
  'Bhojanshala',
]

const filteredSuggestions = computed(() => {
  if (!searchQuery.value) return []
  return suggestions.filter(s =>
    s.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleSearch = () => {
  // Search functionality can be implemented when needed
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

const signOut = () => {
  mobileMenuOpen.value = false
  // Implement sign out logic here
  console.log('User signed out')
  // You can redirect to home or login page
  navigateTo('/')
}
</script>
