<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

    <!-- Hero Header -->
    <div class="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div class="flex items-center gap-4 mb-6">
          <NuxtLink to="/"
            class="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition backdrop-blur-sm">
            <Icon name="ArrowLeft" :size="20" class="text-white" />
          </NuxtLink>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-white">
              My Bookings
            </h1>
            <p class="text-blue-200 text-sm mt-0.5">
              Manage your dharamshala stays
            </p>
          </div>
        </div>

        <!-- Stats Strip -->
        <div class="grid grid-cols-3 gap-3" v-if="isAuthenticated">
          <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
            <p class="text-2xl font-bold text-white">
              {{ bookings.length }}
            </p>
            <p class="text-blue-200 text-xs font-medium mt-0.5">Total</p>
          </div>
          <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
            <p class="text-2xl font-bold text-green-300">
              {{ bookings.filter(b => b.status === 'confirmed').length }}
            </p>
            <p class="text-blue-200 text-xs font-medium mt-0.5">Confirmed</p>
          </div>
          <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
            <p class="text-2xl font-bold text-amber-300">
              {{ bookings.filter(b => b.status === 'initiated').length }}
            </p>
            <p class="text-blue-200 text-xs font-medium mt-0.5">Pending</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      <!-- Filter Tabs -->
      <div v-if="isAuthenticated && bookings.length > 0"
           class="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border',
            activeTab === tab.value
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
          ]"
        >
          <span :class="tab.dot" class="w-2 h-2 rounded-full" />
          {{ tab.label }}
          <span :class="[
            'text-xs px-1.5 py-0.5 rounded-full font-bold',
            activeTab === tab.value
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-500'
          ]">
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Auth Guard -->
      <div v-if="!isAuthenticated"
           class="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Shield" :size="36" class="text-blue-400" />
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Sign in to view bookings</h2>
        <p class="text-gray-500 mb-6 text-sm">Your bookings are linked to your account</p>
        <NuxtLink to="/auth/login"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition inline-block">
          Sign In
        </NuxtLink>
      </div>

      <!-- Loading Skeleton -->
      <div v-else-if="loading" class="space-y-4">
        <div v-for="n in 3" :key="n"
             class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse">
          <div class="flex justify-between mb-4">
            <div class="space-y-2">
              <div class="h-3 bg-gray-100 rounded w-24" />
              <div class="h-5 bg-gray-200 rounded w-48" />
            </div>
            <div class="h-7 bg-gray-100 rounded-full w-24" />
          </div>
          <div class="grid grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="space-y-1.5">
              <div class="h-3 bg-gray-100 rounded w-16" />
              <div class="h-4 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredBookings.length === 0 && bookings.length === 0"
           class="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Calendar" :size="40" class="text-blue-400" />
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">No bookings yet</h2>
        <p class="text-gray-500 mb-8 text-sm max-w-xs mx-auto">
          Your confirmed dharamshala stays will appear here
        </p>
        <NuxtLink to="/dharamshala"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition inline-block">
          Browse Dharamshalas
        </NuxtLink>
      </div>

      <!-- No results for active filter -->
      <div v-else-if="filteredBookings.length === 0"
           class="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <p class="text-gray-500 font-medium">No {{ activeTab }} bookings</p>
      </div>

      <!-- Bookings List -->
      <div v-else class="space-y-4">
        <div
          v-for="booking in filteredBookings"
          :key="booking.booking_id"
          @click="goToDetail(booking.booking_id)"
          :class="[
            'bg-white rounded-3xl border-2 shadow-sm hover:shadow-xl',
            'transition-all duration-300 cursor-pointer group overflow-hidden',
            statusBorderClass(booking.status)
          ]"
        >
          <!-- Color accent bar -->
          <div :class="['h-1.5 w-full', statusBarClass(booking.status)]" />

          <div class="p-5 sm:p-6">
            <!-- Top Row -->
            <div class="flex items-start justify-between gap-3 mb-5">
              <div class="flex items-start gap-3">
                <!-- Property Icon -->
                <div :class="[
                  'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0',
                  statusIconBgClass(booking.status)
                ]">
                  <Icon name="Building2" :size="22" :class="statusIconClass(booking.status)" />
                </div>
                <div>
                  <p class="text-xs text-gray-400 font-mono mb-0.5">
                    #{{ booking.booking_id.slice(0, 8).toUpperCase() }}
                  </p>
                  <h3 class="font-bold text-gray-900 text-base leading-tight">
                    {{ booking.dharamshala?.dharamshala_name || booking.dharamshala_id }}
                  </h3>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ booking.dharamshala?.dharamshala_city }},
                    {{ booking.dharamshala?.dharamshala_state }}
                  </p>
                </div>
              </div>
              <span :class="statusBadgeClass(booking.status)">
                {{ statusLabel(booking.status) }}
              </span>
            </div>

            <!-- Date + Info Strip -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div class="bg-blue-50 rounded-2xl p-3 border border-blue-100">
                <p class="text-xs text-blue-500 font-semibold mb-1 flex items-center gap-1">
                  <Icon name="LogIn" :size="11" />
                  Check-in
                </p>
                <p class="text-sm font-bold text-blue-900">
                  {{ formatDate(booking.check_in_date) }}
                </p>
              </div>
              <div class="bg-orange-50 rounded-2xl p-3 border border-orange-100">
                <p class="text-xs text-orange-500 font-semibold mb-1 flex items-center gap-1">
                  <Icon name="LogOut" :size="11" />
                  Check-out
                </p>
                <p class="text-sm font-bold text-orange-900">
                  {{ formatDate(booking.check_out_date) }}
                </p>
              </div>
              <div class="bg-purple-50 rounded-2xl p-3 border border-purple-100">
                <p class="text-xs text-purple-500 font-semibold mb-1 flex items-center gap-1">
                  <Icon name="User" :size="11" />
                  Guests
                </p>
                <p class="text-sm font-bold text-purple-900">
                  {{ booking.adults_count || 1 }} adults
                </p>
              </div>
              <div class="bg-green-50 rounded-2xl p-3 border border-green-100">
                <p class="text-xs text-green-500 font-semibold mb-1 flex items-center gap-1">
                  <Icon name="IndianRupee" :size="11" />
                  Total
                </p>
                <p class="text-sm font-bold text-green-900">
                  ₹{{ booking.total_amount }}
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center gap-2">
                <Icon name="Clock" :size="13" class="text-gray-400" />
                <p class="text-xs text-gray-400">Booked {{ formatDate(booking.created_at) }}</p>
              </div>
              <div :class="[
                'flex items-center gap-1.5 text-sm font-semibold',
                'group-hover:gap-2.5 transition-all',
                statusTextClass(booking.status)
              ]">
                View details
                <Icon name="ArrowRight" :size="15" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'
import Icon from '~/components/ui/Icon.vue'

definePageMeta({ layout: 'default' })

const { isAuthenticated, session } = useAuth()
const router = useRouter()
const bookings = ref<any[]>([])
const loading = ref(false)

// ── New state & computed ──────────────────────────────────────────────────────

const activeTab = ref('all')

const statusTabs = computed(() => [
  {
    value: 'all',
    label: 'All',
    dot: 'bg-blue-500',
    count: bookings.value.length,
  },
  {
    value: 'confirmed',
    label: 'Confirmed',
    dot: 'bg-green-500',
    count: bookings.value.filter(b => b.status === 'confirmed').length,
  },
  {
    value: 'initiated',
    label: 'Pending',
    dot: 'bg-amber-500',
    count: bookings.value.filter(b => b.status === 'initiated').length,
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    dot: 'bg-red-500',
    count: bookings.value.filter(b => b.status === 'cancelled').length,
  },
])

const filteredBookings = computed(() => {
  if (activeTab.value === 'all') return bookings.value
  return bookings.value.filter(b => b.status === activeTab.value)
})

// ── Status helper methods ─────────────────────────────────────────────────────

const statusBorderClass = (status: string) => {
  const map: Record<string, string> = {
    confirmed:   'border-green-200 hover:border-green-400',
    initiated:   'border-amber-200 hover:border-amber-400',
    cancelled:   'border-red-200 hover:border-red-300',
    checked_in:  'border-blue-200 hover:border-blue-400',
    checked_out: 'border-gray-200 hover:border-gray-300',
  }
  return map[status] || 'border-gray-200'
}

const statusBarClass = (status: string) => {
  const map: Record<string, string> = {
    confirmed:   'bg-gradient-to-r from-green-400 to-emerald-500',
    initiated:   'bg-gradient-to-r from-amber-400 to-orange-400',
    cancelled:   'bg-gradient-to-r from-red-400 to-rose-500',
    checked_in:  'bg-gradient-to-r from-blue-400 to-cyan-500',
    checked_out: 'bg-gradient-to-r from-gray-300 to-gray-400',
  }
  return map[status] || 'bg-gray-200'
}

const statusIconBgClass = (status: string) => {
  const map: Record<string, string> = {
    confirmed:   'bg-green-100',
    initiated:   'bg-amber-100',
    cancelled:   'bg-red-100',
    checked_in:  'bg-blue-100',
    checked_out: 'bg-gray-100',
  }
  return map[status] || 'bg-gray-100'
}

const statusIconClass = (status: string) => {
  const map: Record<string, string> = {
    confirmed:   'text-green-600',
    initiated:   'text-amber-600',
    cancelled:   'text-red-500',
    checked_in:  'text-blue-600',
    checked_out: 'text-gray-500',
  }
  return map[status] || 'text-gray-500'
}

const statusBadgeClass = (status: string) => {
  const base = 'px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap'
  const map: Record<string, string> = {
    confirmed:   `${base} bg-green-100 text-green-800 border border-green-200`,
    initiated:   `${base} bg-amber-100 text-amber-800 border border-amber-200`,
    cancelled:   `${base} bg-red-100 text-red-700 border border-red-200`,
    checked_in:  `${base} bg-blue-100 text-blue-800 border border-blue-200`,
    checked_out: `${base} bg-gray-100 text-gray-700 border border-gray-200`,
  }
  return map[status] || `${base} bg-gray-100 text-gray-600`
}

const statusTextClass = (status: string) => {
  const map: Record<string, string> = {
    confirmed:   'text-green-600',
    initiated:   'text-amber-600',
    cancelled:   'text-red-500',
    checked_in:  'text-blue-600',
    checked_out: 'text-gray-500',
  }
  return map[status] || 'text-blue-600'
}

// ── Unchanged original logic ──────────────────────────────────────────────────

const fetchBookings = async () => {
  if (!isAuthenticated.value || !session.value?.access_token) return
  loading.value = true
  try {
    const data = await $fetch<any[]>('/api/bookings/my', {
      headers: { Authorization: `Bearer ${session.value.access_token}` }
    })
    bookings.value = data || []
  } catch (err) {
    console.error('[bookings] fetch failed:', err)
  } finally {
    loading.value = false
  }
}

const goToDetail = (id: string) => {
  router.push(`/bookings/${id}`)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    confirmed:        'Confirmed',
    initiated:        'Pending',
    awaiting_payment: 'Awaiting Payment',
    cancelled:        'Cancelled',
    checked_in:       'Checked In',
    checked_out:      'Completed',
    refunded:         'Refunded',
  }
  return map[status] || status
}


onMounted(fetchBookings)
</script>

<style scoped>
/* Hide scrollbar for filter tabs on mobile */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
