<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6">

      <!-- Back -->
      <div class="flex items-center gap-3 mb-6">
        <NuxtLink to="/bookings"
          class="p-2 hover:bg-white rounded-xl transition border border-gray-200">
          <Icon name="ArrowLeft" :size="18" class="text-gray-600" />
        </NuxtLink>
        <h1 class="text-xl font-bold text-gray-900">Booking Details</h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white rounded-2xl p-8 border border-gray-200 
                                 animate-pulse space-y-4">
        <div class="h-6 bg-gray-200 rounded w-48" />
        <div class="h-4 bg-gray-100 rounded w-full" />
        <div class="h-4 bg-gray-100 rounded w-3/4" />
      </div>

      <!-- Error -->
      <div v-else-if="error"
           class="text-center py-16 bg-white rounded-2xl border border-gray-200">
        <Icon name="AlertTriangle" :size="40" class="text-red-400 mx-auto mb-4" />
        <p class="text-red-600 font-semibold">{{ error }}</p>
        <NuxtLink to="/bookings"
          class="mt-4 inline-block text-blue-600 font-semibold text-sm">
          Back to bookings
        </NuxtLink>
      </div>

      <!-- Booking Detail -->
      <div v-else-if="booking" class="space-y-4">

        <!-- Status Banner -->
        <div :class="statusBannerClass">
          <Icon :name="statusIcon" :size="20" />
          <span class="font-bold">{{ statusLabel }}</span>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
            <p class="text-blue-200 text-xs font-semibold uppercase 
                      tracking-wide mb-1">Booking ID</p>
            <p class="font-mono text-white font-bold text-lg">
              {{ booking.booking_id.slice(0, 8).toUpperCase() }}
            </p>
          </div>

          <!-- Details -->
          <div class="p-6 space-y-5">

            <!-- Property -->
            <div>
              <p class="text-xs text-gray-500 font-semibold uppercase 
                        tracking-wide mb-1">Property</p>
              <p class="font-bold text-gray-900 text-lg">
                {{ booking.dharamshala?.dharamshala_name || booking.dharamshala_id }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 p-4 rounded-xl">
                <p class="text-xs text-gray-500 font-medium mb-1">Check-in</p>
                <p class="font-bold text-gray-900">
                  {{ formatDate(booking.check_in_date) }}
                </p>
              </div>
              <div class="bg-orange-50 p-4 rounded-xl">
                <p class="text-xs text-gray-500 font-medium mb-1">Check-out</p>
                <p class="font-bold text-gray-900">
                  {{ formatDate(booking.check_out_date) }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 font-medium mb-1">Guests</p>
                <p class="font-semibold text-gray-900">
                  {{ booking.adults_count || 1 }} adults
                  <span v-if="booking.children_count > 0">
                    · {{ booking.children_count }} children
                  </span>
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-medium mb-1">Rooms</p>
                <p class="font-semibold text-gray-900">
                  {{ booking.rooms_count }} room
                </p>
              </div>
            </div>

            <div v-if="booking.special_requests"
                 class="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <p class="text-xs text-gray-500 font-medium mb-1">
                Special Requests
              </p>
              <p class="text-sm text-gray-700">{{ booking.special_requests }}</p>
            </div>

            <!-- Amount -->
            <div class="bg-green-50 p-4 rounded-xl border border-green-200 
                        flex justify-between items-center">
              <div>
                <p class="text-xs text-gray-500 font-medium">Total Amount</p>
                <p class="text-2xl font-bold text-green-700 mt-0.5">
                  ₹{{ booking.total_amount }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500 font-medium">Payment</p>
                <p class="text-sm font-bold text-gray-700 mt-0.5">
                  Pay at property
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Guest Info Card -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
          <h2 class="font-bold text-gray-900">Guest Information</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Name</span>
              <span class="font-semibold text-gray-900">
                {{ booking.guest_name }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Email</span>
              <span class="font-semibold text-gray-900">
                {{ booking.guest_email }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Phone</span>
              <span class="font-semibold text-gray-900">
                {{ booking.guest_phone }}
              </span>
            </div>
          </div>
        </div>

        <!-- Cancel Button -->
        <button
          v-if="canCancel"
          @click="cancelBooking"
          :disabled="cancelling"
          class="w-full py-3 px-4 border-2 border-red-300 text-red-600 
                 rounded-xl font-bold hover:bg-red-50 transition 
                 disabled:opacity-50"
        >
          {{ cancelling ? 'Cancelling...' : 'Cancel Booking' }}
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'
import Icon from '~/components/ui/Icon.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const { session } = useAuth()

const booking = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const cancelling = ref(false)

const authHeaders = computed(() => ({
  Authorization: `Bearer ${session.value?.access_token || ''}`
}))

const fetchBooking = async () => {
  loading.value = true
  try {
    booking.value = await $fetch(
      `/api/bookings/${route.params.id}`,
      { headers: authHeaders.value }
    )
  } catch {
    error.value = 'Booking not found'
  } finally {
    loading.value = false
  }
}

const canCancel = computed(() => {
  return booking.value &&
    ['confirmed', 'initiated'].includes(booking.value.status)
})

const cancelBooking = async () => {
  if (!confirm('Are you sure you want to cancel this booking?')) return
  cancelling.value = true
  try {
    await $fetch(`/api/bookings/${route.params.id}`, {
      method: 'PATCH',
      headers: authHeaders.value,
      body: { status: 'cancelled', reason: 'Cancelled by guest' }
    })
    await fetchBooking()
  } catch {
    alert('Failed to cancel booking. Please try again.')
  } finally {
    cancelling.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    confirmed: 'Booking Confirmed',
    initiated: 'Booking Pending',
    cancelled: 'Booking Cancelled',
    checked_in: 'Currently Checked In',
    checked_out: 'Stay Completed',
  }
  return map[booking.value?.status] || booking.value?.status
})

const statusIcon = computed(() => {
  const map: Record<string, string> = {
    confirmed: 'CheckCircle',
    initiated: 'Clock',
    cancelled: 'XCircle',
    checked_in: 'LogIn',
    checked_out: 'CheckSquare',
  }
  return map[booking.value?.status] || 'Info'
})

const statusBannerClass = computed(() => {
  const base = 'flex items-center gap-3 p-4 rounded-2xl font-semibold text-sm'
  const map: Record<string, string> = {
    confirmed: `${base} bg-green-100 text-green-800`,
    initiated: `${base} bg-yellow-100 text-yellow-800`,
    cancelled: `${base} bg-red-100 text-red-800`,
    checked_in: `${base} bg-blue-100 text-blue-800`,
    checked_out: `${base} bg-gray-100 text-gray-700`,
  }
  return map[booking.value?.status] || `${base} bg-gray-100 text-gray-700`
})

onMounted(fetchBooking)
</script>
