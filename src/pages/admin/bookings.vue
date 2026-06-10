<template>
  <div v-if="!adminStore.isAdminMode"
       class="flex items-center justify-center min-h-screen">
    <p class="text-gray-500">Access denied.</p>
  </div>

  <div v-else class="min-h-screen bg-gray-950 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white">Bookings</h1>
          <p class="text-gray-400 text-sm mt-1">
            {{ total }} total bookings
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3 mb-6">
        <!-- Search -->
        <div class="flex-1 min-w-48 relative">
          <Icon name="Search" :size="16"
                class="absolute left-3 top-1/2 -translate-y-1/2 
                       text-gray-500" />
          <input
            v-model="search"
            placeholder="Search guest name or email..."
            class="w-full bg-gray-900 border border-gray-700 
                   rounded-xl pl-9 pr-4 py-2.5 text-sm text-white 
                   placeholder-gray-500 focus:outline-none 
                   focus:border-amber-500 transition"
            @input="fetchBookings"
          />
        </div>

        <!-- Status Filter -->
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="selectedStatus = tab.value; fetchBookings()"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold transition-all border',
              selectedStatus === tab.value
                ? 'bg-amber-500 text-gray-900 border-amber-500'
                : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-gray-900 rounded-2xl border border-gray-800 
                  overflow-hidden">

        <!-- Loading -->
        <div v-if="loading" class="p-8 text-center">
          <div class="w-8 h-8 border-2 border-amber-500 border-t-transparent 
                      rounded-full animate-spin mx-auto" />
        </div>

        <!-- Empty -->
        <div v-else-if="bookings.length === 0"
             class="p-12 text-center text-gray-500">
          No bookings found
        </div>

        <!-- Bookings -->
        <div v-else class="divide-y divide-gray-800">
          <div
            v-for="booking in bookings"
            :key="booking.booking_id"
            class="p-5 hover:bg-gray-800/40 transition"
          >
            <div class="flex items-start justify-between gap-4">

              <!-- Guest Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-2">
                  <p class="font-semibold text-white truncate">
                    {{ booking.guest_name }}
                  </p>
                  <span :class="statusStyle(booking.status)">
                    {{ statusLabel(booking.status) }}
                  </span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p class="text-gray-500">Property</p>
                    <p class="text-gray-300 font-medium truncate">
                      {{ booking.dharamshala?.dharamshala_name || booking.dharamshala_id }}
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500">Room</p>
                    <p class="text-gray-300 font-medium">
                      {{ booking.room?.name || '-' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500">Dates</p>
                    <p class="text-gray-300 font-medium">
                      {{ booking.check_in_date }} → {{ booking.check_out_date }}
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500">Contact</p>
                    <p class="text-gray-300 font-medium">
                      {{ booking.guest_phone }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Amount + Actions -->
              <div class="flex flex-col items-end gap-3 flex-shrink-0">
                <p class="text-lg font-bold text-white">
                  ₹{{ booking.total_amount }}
                </p>
                <div class="flex gap-2">
                  <button
                    v-if="booking.status === 'confirmed'"
                    @click="updateStatus(booking.booking_id, 'checked_in')"
                    class="px-3 py-1.5 bg-blue-500/20 text-blue-400 
                           rounded-lg text-xs font-bold hover:bg-blue-500/30 
                           transition border border-blue-500/30"
                  >
                    Check In
                  </button>
                  <button
                    v-if="booking.status === 'checked_in'"
                    @click="updateStatus(booking.booking_id, 'checked_out')"
                    class="px-3 py-1.5 bg-green-500/20 text-green-400 
                           rounded-lg text-xs font-bold hover:bg-green-500/30 
                           transition border border-green-500/30"
                  >
                    Check Out
                  </button>
                  <button
                    v-if="['confirmed','initiated'].includes(booking.status)"
                    @click="updateStatus(booking.booking_id, 'cancelled')"
                    class="px-3 py-1.5 bg-red-500/20 text-red-400 
                           rounded-lg text-xs font-bold hover:bg-red-500/30 
                           transition border border-red-500/30"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="total > limit"
             class="flex items-center justify-between p-4 
                    border-t border-gray-800">
          <p class="text-xs text-gray-500">
            Showing {{ (page-1)*limit+1 }}–{{ Math.min(page*limit,total) }}
            of {{ total }}
          </p>
          <div class="flex gap-2">
            <button
              :disabled="page === 1"
              @click="page--; fetchBookings()"
              class="px-3 py-1.5 bg-gray-800 rounded-lg text-xs 
                     font-bold text-gray-400 disabled:opacity-30 
                     hover:bg-gray-700 transition"
            >
              Previous
            </button>
            <button
              :disabled="page * limit >= total"
              @click="page++; fetchBookings()"
              class="px-3 py-1.5 bg-gray-800 rounded-lg text-xs 
                     font-bold text-gray-400 disabled:opacity-30 
                     hover:bg-gray-700 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdminModeStore } from '~/stores/adminMode'
import { useAuth } from '~/features/auth/composables/useAuth'
import Icon from '~/components/ui/Icon.vue'

definePageMeta({ layout: 'default' })

const adminStore = useAdminModeStore()
const { session } = useAuth()

const bookings       = ref<any[]>([])
const total          = ref(0)
const loading        = ref(false)
const search         = ref('')
const selectedStatus = ref('all')
const page           = ref(1)
const limit          = 20

const statusTabs = [
  { value: 'all',        label: 'All'        },
  { value: 'confirmed',  label: 'Confirmed'  },
  { value: 'initiated',  label: 'Pending'    },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'cancelled',  label: 'Cancelled'  },
]

const authHeaders = () => ({
  Authorization: `Bearer ${session.value?.access_token || ''}`
})

const fetchBookings = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page:   String(page.value),
      limit:  String(limit),
      status: selectedStatus.value,
      ...(search.value && { search: search.value }),
    })
    const data = await $fetch<any>(
      `/api/admin/bookings?${params}`,
      { headers: authHeaders() }
    )
    bookings.value = data.bookings || []
    total.value    = data.total    || 0
  } finally {
    loading.value = false
  }
}

const updateStatus = async (bookingId: string, status: string) => {
  if (!confirm(`Change booking status to ${status}?`)) return
  await $fetch(`/api/admin/bookings/${bookingId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: { status },
  })
  await fetchBookings()
}

const statusStyle = (status: string) => {
  const map: Record<string, string> = {
    confirmed:  'px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-400',
    initiated:  'px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400',
    cancelled:  'px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400',
    checked_in: 'px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400',
    checked_out:'px-2 py-0.5 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400',
  }
  return map[status] || 'px-2 py-0.5 rounded-full text-xs font-bold bg-gray-800 text-gray-400'
}

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    confirmed:  'Confirmed',
    initiated:  'Pending',
    cancelled:  'Cancelled',
    checked_in: 'Checked In',
    checked_out:'Checked Out',
  }
  return map[status] || status
}

onMounted(fetchBookings)
</script>
