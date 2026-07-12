<template>
  <Transition name="banner">
    <div
      v-if="adminStore.isAdminMode"
      :class="[
        'sticky top-0 z-50 transition-all duration-300 font-sans',
        themeStore?.isDarkMode 
          ? 'bg-gray-950/95 backdrop-blur-md border-b border-gray-800' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
      ]"
    >
      <div class="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Row 1: Primary Header -->
        <div class="flex items-center justify-between h-14 border-b border-transparent">
          
          <!-- Left: Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 flex-shrink-0 group">
            <div class="w-8 h-8 overflow-hidden transition-all duration-300 rounded-md">
              <img :src="tirthlokLogo" alt="TirthLok" class="w-full h-full object-cover" />
            </div>
            <span :class="[
              'text-lg font-bold hidden md:block tracking-tight group-hover:text-primary transition-colors',
              themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
            ]">TirthLok</span>
            <!-- Admin Badge -->
            <div class="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Admin
            </div>
          </NuxtLink>

          <!-- Center: Primary Navigation -->
          <nav class="hidden md:flex items-center gap-2 h-full">
            <NuxtLink
              v-for="item in primaryNav"
              :key="item.path"
              :to="item.path"
              class="relative flex items-center h-full px-3 text-sm font-medium transition-colors"
              :class="isPrimaryActive(item.path) 
                ? (themeStore?.isDarkMode ? 'text-white' : 'text-gray-900')
                : (themeStore?.isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-900')"
            >
              {{ item.name }}
              <!-- Active Indicator (Smooth Underline) -->
              <span 
                v-if="isPrimaryActive(item.path)" 
                class="absolute inset-x-0 bottom-0 h-[2px] bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(var(--color-primary),0.5)]"
              ></span>
            </NuxtLink>
          </nav>

          <!-- Right: Profile & Exit -->
          <div class="flex items-center gap-3">
            
            <!-- Mobile Menu Toggle (Only visible on small screens to show primary nav if needed) -->
            <!-- We will keep it simple and focus on the avatar + exit admin -->
            
            <!-- Profile Avatar -->
            <div 
              v-if="isAuthenticated" 
              class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-bold text-xs shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all"
              title="Profile"
            >
              {{ userInitials }}
            </div>
            <div v-else class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500">
              <Icon name="User" :size="16" />
            </div>

            <!-- Exit Admin -->
            <button
              @click="exit"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border',
                themeStore?.isDarkMode
                  ? 'text-red-400 border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30'
                  : 'text-red-600 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200'
              ]"
            >
              <Icon name="LogOut" :size="14" />
              <span class="hidden sm:inline">Exit Admin</span>
            </button>
          </div>
        </div>

        <!-- Row 2: Secondary Navigation (Admin Modules) -->
        <div class="flex items-center py-2 overflow-x-auto no-scrollbar">
          
          <!-- Property Label if it exists -->
          <div v-if="adminStore.propertyLabel" class="flex items-center pr-3 border-r mr-3 flex-shrink-0" :class="themeStore?.isDarkMode ? 'border-gray-800' : 'border-gray-200'">
            <div class="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">
              <div class="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
              <span class="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                {{ adminStore.propertyLabel }}
              </span>
            </div>
          </div>

          <!-- Admin Nav Clips (Segmented Control Style) -->
          <nav 
            class="flex items-center gap-1 p-1 rounded-lg flex-shrink-0"
            :class="themeStore?.isDarkMode ? 'bg-gray-900/50 border border-gray-800/50' : 'bg-gray-100/80 border border-gray-200/50'"
          >
            <NuxtLink
              v-for="item in adminNav"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all relative group"
              :class="isActive(item.to)
                ? (themeStore?.isDarkMode ? 'bg-gray-800 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                : (themeStore?.isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50')"
            >
              <Icon :name="(item.icon as any)" :size="15" 
                :class="isActive(item.to) 
                  ? (themeStore?.isDarkMode ? 'text-white' : 'text-gray-900') 
                  : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors'" 
              />
              {{ item.label }}
            </NuxtLink>
          </nav>

        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAdminModeStore } from '~/stores/adminMode'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '~/stores/theme'
import { useAuth } from '~/features/auth/composables/useAuth'
import Icon from '~/components/ui/Icon.vue'
import tirthlokLogo from '~/assets/images/logo-tirthlok.png'

const adminStore = useAdminModeStore()
const themeStore = useThemeStore()
const route      = useRoute()
const router     = useRouter()
const { user, isAuthenticated, getCustomerProfile } = useAuth()

// Load User Profile for Avatar
const customerProfile = ref<{
  customer_first_name?: string | null
  customer_last_name?: string | null
  customer_email_id?: string | null
} | null>(null)

onMounted(async () => {
  if (isAuthenticated.value) {
    const result = await getCustomerProfile()
    if (result.success && result.data) {
      customerProfile.value = result.data
    }
  }
})

// User Initials Computed
const userInitials = computed(() => {
  if (!isAuthenticated.value) return ''
  const firstName = customerProfile.value?.customer_first_name || user.value?.user_metadata?.first_name || ''
  const lastName = customerProfile.value?.customer_last_name || user.value?.user_metadata?.last_name || ''
  
  if (firstName && lastName) return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  if (firstName) return firstName.substring(0, 2).toUpperCase()
  
  const email = user.value?.email || ''
  return email.substring(0, 2).toUpperCase()
})

// Primary Navigation (Platform Modules)
const primaryNav = [
  { name: 'Tirth', path: '/tirth' },
  { name: 'Dharamshala', path: '/dharamshala' },
  { name: 'Bhojanshala', path: '/bhojanshala' },
]

const isPrimaryActive = (path: string) => route.path.startsWith(path)

// Secondary Navigation (Admin Routes)
const adminNav = computed(() => {
  const base = [
    { to: '/admin',          label: 'Overview', icon: 'LayoutDashboard' },
    { to: '/admin/bookings', label: 'Bookings', icon: 'CalendarCheck'   },
    { to: '/admin/rooms',    label: 'Rooms',    icon: 'BedDouble'       },
  ]
  if (adminStore.isSuperAdmin) {
    base.push({ to: '/admin/managers', label: 'Managers', icon: 'Users' })
  }
  return base
})

const isActive = (path: string) => route.path === path

const exit = () => {
  adminStore.exitAdminMode()
  router.push('/')
}
</script>

<style scoped>
.banner-enter-active, .banner-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.banner-enter-from, .banner-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Hide scrollbar for horizontally scrollable nav */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
