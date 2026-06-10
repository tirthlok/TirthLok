<template>
  <div v-if="!adminStore.isAdminMode" class="flex items-center 
       justify-center min-h-screen">
    <p class="text-gray-500">Access denied.</p>
  </div>

  <div v-else class="min-h-screen bg-gray-950 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p class="text-gray-400 text-sm mt-1">
          TirthLok Admin · {{ new Date().toLocaleDateString('en-IN',
          { weekday:'long', day:'numeric', month:'long', year:'numeric' }) }}
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-gray-900 rounded-2xl p-5 border border-gray-800
                 hover:border-gray-700 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <div :class="['p-2 rounded-xl', stat.iconBg]">
              <Icon :name="stat.icon" :size="18" :class="stat.iconColor" />
            </div>
            <span :class="['text-xs font-bold px-2 py-1 rounded-full',
                           stat.badgeBg, stat.badgeText]">
              {{ stat.badge }}
            </span>
          </div>
          <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
          <p class="text-xs text-gray-500 mt-1 font-medium">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Recent Bookings -->
        <div class="lg:col-span-2 bg-gray-900 rounded-2xl border 
                    border-gray-800 overflow-hidden">
          <div class="flex items-center justify-between p-5 
                      border-b border-gray-800">
            <h2 class="font-bold text-white">Recent Bookings</h2>
            <NuxtLink to="/admin/bookings"
              class="text-xs text-amber-400 hover:text-amber-300 
                     font-semibold transition">
              View all →
            </NuxtLink>
          </div>
          <div class="divide-y divide-gray-800">
            <div
              v-for="booking in data?.recentBookings || []"
              :key="booking.booking_id"
              class="flex items-center justify-between p-4 
                     hover:bg-gray-800/50 transition"
            >
              <div>
                <p class="text-sm font-semibold text-white">
                  {{ booking.guest_name }}
                </p>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ booking.dharamshala?.dharamshala_name }}
                  · {{ booking.check_in_date }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-white">
                  ₹{{ booking.total_amount }}
                </p>
                <span :class="statusBadge(booking.status)">
                  {{ booking.status }}
                </span>
              </div>
            </div>
            <div v-if="!data?.recentBookings?.length"
                 class="p-8 text-center text-gray-500 text-sm">
              No bookings yet
            </div>
          </div>
        </div>

        <!-- Room Status -->
        <div class="bg-gray-900 rounded-2xl border border-gray-800 
                    overflow-hidden">
          <div class="p-5 border-b border-gray-800 flex items-center 
                      justify-between">
            <h2 class="font-bold text-white">Room Status</h2>
            <NuxtLink to="/admin/rooms"
              class="text-xs text-amber-400 hover:text-amber-300 
                     font-semibold">
              Manage →
            </NuxtLink>
          </div>
          <div class="divide-y divide-gray-800">
            <div
              v-for="room in data?.roomStats || []"
              :key="room.name"
              class="flex items-center justify-between p-4"
            >
              <div>
                <p class="text-sm font-semibold text-white">{{ room.name }}</p>
                <p class="text-xs text-gray-500 mt-0.5">
                  ₹{{ room.base_price }}/night
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-white">
                  {{ room.total_inventory }} rooms
                </p>
                <span :class="room.is_available_ui
                  ? 'text-green-400 text-xs'
                  : 'text-red-400 text-xs'">
                  {{ room.is_available_ui ? 'Active' : 'Hidden' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdminModeStore } from '~/stores/adminMode'
import { useAuth } from '~/features/auth/composables/useAuth'
import Icon from '~/components/ui/Icon.vue'

definePageMeta({ layout: 'default' })

const adminStore = useAdminModeStore()
const { session } = useAuth()

const { data } = await useFetch('/api/admin/stats', {
  headers: computed(() => ({
    Authorization: `Bearer ${session.value?.access_token || ''}`
  }))
})

const stats = computed(() => [
  {
    label: 'Total Bookings',
    value: data.value?.stats?.totalBookings || 0,
    icon: 'CalendarCheck', iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    badge: 'All', badgeBg: 'bg-blue-500/10', badgeText: 'text-blue-400'
  },
  {
    label: 'Confirmed',
    value: data.value?.stats?.confirmedBookings || 0,
    icon: 'CheckCircle', iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
    badge: 'Live', badgeBg: 'bg-green-500/10', badgeText: 'text-green-400'
  },
  {
    label: 'Pending',
    value: data.value?.stats?.pendingBookings || 0,
    icon: 'Clock', iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    badge: 'Open', badgeBg: 'bg-amber-500/10', badgeText: 'text-amber-400'
  },
  {
    label: 'Cancelled',
    value: data.value?.stats?.cancelledBookings || 0,
    icon: 'XCircle', iconBg: 'bg-red-500/10',
    iconColor: 'text-red-400',
    badge: 'Closed', badgeBg: 'bg-red-500/10', badgeText: 'text-red-400'
  },
])

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    confirmed: 'text-xs text-green-400',
    initiated: 'text-xs text-amber-400',
    cancelled: 'text-xs text-red-400',
    checked_in: 'text-xs text-blue-400',
    checked_out: 'text-xs text-gray-400',
  }
  return map[status] || 'text-xs text-gray-400'
}
</script>
