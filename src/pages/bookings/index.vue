<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/" class="p-2 hover:bg-white rounded-xl transition">
          <Icon name="ArrowLeft" :size="20" class="text-gray-600" />
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p class="text-sm text-gray-500 mt-0.5">
            {{ bookings.length }} booking{{ bookings.length !== 1 ? 's' : '' }} found
          </p>
        </div>
      </div>

      <!-- Auth Guard -->
      <div v-if="!isAuthenticated" 
           class="text-center py-20 bg-white rounded-2xl border border-gray-200">
        <Icon name="Lock" :size="48" class="text-gray-300 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-900 mb-2">Sign in to view bookings</h2>
        <p class="text-gray-500 mb-6">Your bookings are linked to your account</p>
        <NuxtLink to="/auth/login"
          class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold 
                 hover:bg-blue-700 transition inline-block">
          Sign In
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-else-if="loading" class="space-y-4">
        <div v-for="n in 3" :key="n"
             class="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
          <div class="flex justify-between mb-4">
            <div class="h-5 bg-gray-200 rounded w-32" />
            <div class="h-5 bg-gray-200 rounded w-20" />
          </div>
          <div class="h-4 bg-gray-100 rounded w-full mb-2" />
          <div class="h-4 bg-gray-100 rounded w-2/3" />
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="bookings.length === 0"
           class="text-center py-20 bg-white rounded-2xl border border-gray-200">
        <Icon name="CalendarX" :size="48" class="text-gray-300 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-900 mb-2">No bookings yet</h2>
        <p class="text-gray-500 mb-6">Your confirmed bookings will appear here</p>
        <NuxtLink to="/dharamshala"
          class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold 
                 hover:bg-blue-700 transition inline-block">
          Browse Dharamshalas
        </NuxtLink>
      </div>

      <!-- Bookings List -->
      <div v-else class="space-y-4">
        <div
          v-for="booking in bookings"
          :key="booking.booking_id"
          @click="goToDetail(booking.booking_id)"
          class="bg-white rounded-2xl p-6 border-2 border-gray-100 
                 hover:border-blue-200 hover:shadow-md transition-all 
                 cursor-pointer group"
        >
          <!-- Top Row -->
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <p class="font-mono text-xs text-gray-400 mb-1">
                {{ booking.booking_id.slice(0, 8).toUpperCase() }}
              </p>
              <p class="font-bold text-gray-900 text-lg">
                {{ booking.dharamshala?.dharamshala_name || booking.dharamshala_id }}
              </p>
            </div>
            <span :class="statusClass(booking.status)">
              {{ statusLabel(booking.status) }}
            </span>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <p class="text-xs text-gray-500 font-medium">Check-in</p>
              <p class="text-sm font-bold text-gray-900">
                {{ formatDate(booking.check_in_date) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Check-out</p>
              <p class="text-sm font-bold text-gray-900">
                {{ formatDate(booking.check_out_date) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Guests</p>
              <p class="text-sm font-bold text-gray-900">
                {{ booking.adults_count || 1 }} adults
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Total</p>
              <p class="text-sm font-bold text-green-700">
                ₹{{ booking.total_amount }}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-4 
                      border-t border-gray-100">
            <p class="text-xs text-gray-400">
              Booked {{ formatDate(booking.created_at) }}
            </p>
            <div class="flex items-center gap-1 text-blue-600 
                        group-hover:gap-2 transition-all text-sm font-semibold">
              View details
              <Icon name="ArrowRight" :size="16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'
import Icon from '~/components/ui/Icon.vue'

definePageMeta({ layout: 'default' })

const { isAuthenticated, session } = useAuth()
const router = useRouter()
const bookings = ref<any[]>([])
const loading = ref(false)

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

const statusClass = (status: string) => {
  const base = 'px-3 py-1 rounded-full text-xs font-bold'
  const map: Record<string, string> = {
    confirmed:        `${base} bg-green-100 text-green-700`,
    initiated:        `${base} bg-yellow-100 text-yellow-700`,
    awaiting_payment: `${base} bg-orange-100 text-orange-700`,
    cancelled:        `${base} bg-red-100 text-red-700`,
    checked_in:       `${base} bg-blue-100 text-blue-700`,
    checked_out:      `${base} bg-gray-100 text-gray-700`,
    refunded:         `${base} bg-purple-100 text-purple-700`,
  }
  return map[status] || `${base} bg-gray-100 text-gray-600`
}

onMounted(fetchBookings)
</script>
