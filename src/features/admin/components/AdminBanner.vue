<template>
  <Transition name="banner">
    <div
      v-if="adminStore.isAdminMode"
      class="sticky top-0 z-40 bg-gradient-to-r from-gray-900 
             via-gray-800 to-gray-900 border-b border-amber-500/40"
    >
      <div class="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-10">

          <!-- Left: Mode indicator -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span class="text-xs font-bold text-amber-400 
                           uppercase tracking-widest">
                Admin Mode
              </span>
            </div>
            <div class="h-3 w-px bg-gray-600" />
            <span class="text-xs text-gray-400 font-medium">
              {{ adminStore.propertyLabel }}
            </span>
          </div>

          <!-- Center: Admin nav -->
          <nav class="hidden sm:flex items-center gap-1">
            <NuxtLink
              v-for="item in adminNav"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-1.5 px-3 py-1 rounded-lg 
                     text-xs font-semibold transition-all"
              :class="isActive(item.to)
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/10'"
            >
              <Icon :name="(item.icon as any)" :size="14" />
              {{ item.label }}
            </NuxtLink>
          </nav>

          <!-- Right: Exit button -->
          <button
            @click="exit"
            class="flex items-center gap-1.5 px-3 py-1 rounded-lg 
                   text-xs font-semibold text-gray-400 
                   hover:text-white hover:bg-white/10 transition-all 
                   border border-gray-700 hover:border-gray-500"
          >
            <Icon name="LogOut" :size="13" />
            Exit Admin
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdminModeStore } from '~/stores/adminMode'
import { useRoute, useRouter } from 'vue-router'
import Icon from '~/components/ui/Icon.vue'

const adminStore = useAdminModeStore()
const route      = useRoute()
const router     = useRouter()

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
  transition: all 0.25s ease;
}
.banner-enter-from, .banner-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
