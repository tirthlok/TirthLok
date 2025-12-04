<template>
  <div class="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 p-8 rounded-3xl border-2 border-blue-200 shadow-2xl overflow-hidden relative">
    <!-- Decorative Elements -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-20 -mr-20 -mt-20 blur-3xl" />
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-100 to-blue-100 rounded-full opacity-20 -ml-20 -mb-20 blur-3xl" />

    <div class="relative z-10">
      <!-- Header -->
      <div class="mb-10">
        <div class="flex items-center gap-4 mb-3">
          <div class="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg">
            <Icon name="Home" :size="32" class="text-white" />
          </div>
          <div>
            <h2 class="text-4xl font-black bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent">Available Rooms & Bookings</h2>
            <p class="text-gray-600 mt-1 font-medium">Choose your perfect room and book your stay</p>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="mb-10 p-6 bg-white rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Check-in Date Filter -->
          <div class="group">
            <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Icon name="LogIn" :size="16" class="text-blue-600" />
              Check-in Date
            </label>
            <input
              v-model="filterDates.checkIn"
              type="date"
              :min="today"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-semibold"
            />
          </div>

          <!-- Check-out Date Filter -->
          <div class="group">
            <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Icon name="LogOut" :size="16" class="text-cyan-600" />
              Check-out Date
            </label>
            <input
              v-model="filterDates.checkOut"
              type="date"
              :min="filterDates.checkIn || today"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all duration-300 font-semibold"
            />
          </div>

          <!-- Room Type Filter -->
          <div class="group">
            <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Icon name="Layers" :size="16" class="text-emerald-600" />
              Room Type
            </label>
            <select
              v-model="filterRoomType"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 font-semibold bg-white cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="dorm">Dorm</option>
              <option value="family">Family</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-32">
        <div class="text-center">
          <div class="relative w-20 h-20 mx-auto mb-6">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full animate-spin" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0% 50%)" />
            <div class="absolute inset-3 bg-white rounded-full flex items-center justify-center">
              <Icon name="Home" :size="24" class="text-blue-600 animate-pulse" />
            </div>
          </div>
          <p class="text-gray-600 font-bold text-lg">Loading rooms...</p>
        </div>
      </div>

      <!-- Rooms Grid -->
      <div v-else-if="filteredRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <RoomCard
          v-for="room in filteredRooms"
          :key="room.id"
          :room="room"
          :dharamshala-id="dharamshalaId"
          :dharamshala-name="dharamshalaName"
          @booking-confirmed="handleBookingConfirmed"
        />
      </div>

      <!-- No Rooms Available -->
      <div v-else class="flex justify-center items-center py-32">
        <div class="text-center max-w-md">
          <div class="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <Icon name="Home" :size="48" class="text-gray-400" />
          </div>
          <p class="text-gray-600 font-bold text-lg">No rooms available</p>
          <p class="text-gray-500 mt-2">Try selecting different dates or room types</p>
        </div>
      </div>

      <!-- Bookings Summary -->
      <div v-if="userBookings.length > 0" class="mt-16 pt-12 border-t-4 border-gradient-to-r from-blue-300 to-cyan-300">
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg">
            <Icon name="CheckCircle" :size="32" class="text-white" />
          </div>
          <h3 class="text-3xl font-black bg-gradient-to-r from-green-900 to-emerald-700 bg-clip-text text-transparent">Your Bookings</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="booking in userBookings"
            :key="booking.id"
            class="p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-green-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm group"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="font-black text-lg text-gray-900">Room Booking</p>
                <p class="text-xs text-gray-500 font-bold mt-1">ID: {{ booking.id.slice(-8) }}</p>
              </div>
              <span
                :class="{
                  'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300': booking.status === 'confirmed' || booking.status === 'checkedIn',
                  'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300': booking.status === 'pending',
                  'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300': booking.status === 'cancelled',
                }"
                class="px-3 py-1 rounded-full text-xs font-black uppercase border-2 shadow-md"
              >
                {{ booking.status }}
              </span>
            </div>
            
            <div class="space-y-3 mb-4 p-4 bg-white rounded-xl border border-blue-100">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 font-semibold flex items-center gap-2">
                  <Icon name="User" :size="14" class="text-blue-600" />
                  Guest:
                </span>
                <span class="font-black text-gray-900">{{ booking.userName }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 font-semibold flex items-center gap-2">
                  <Icon name="Calendar" :size="14" class="text-blue-600" />
                  Check-in:
                </span>
                <span class="font-black text-gray-900">{{ formatDate(booking.checkInDate) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 font-semibold flex items-center gap-2">
                  <Icon name="Calendar" :size="14" class="text-blue-600" />
                  Check-out:
                </span>
                <span class="font-black text-gray-900">{{ formatDate(booking.checkOutDate) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 font-semibold flex items-center gap-2">
                  <Icon name="Users" :size="14" class="text-blue-600" />
                  Guests:
                </span>
                <span class="font-black text-gray-900">{{ booking.numberOfGuests }}</span>
              </div>
              <div class="flex justify-between items-center pt-3 border-t-2 border-blue-100">
                <span class="text-gray-700 font-black">Total:</span>
                <span class="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">₹{{ booking.totalPrice }}</span>
              </div>
            </div>

            <!-- Booking Actions -->
            <div class="flex gap-2">
              <button
                v-if="booking.status === 'confirmed'"
                @click="handleCheckIn(booking.id)"
                class="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm transform hover:scale-105 flex items-center justify-center gap-1"
              >
                <Icon name="LogIn" :size="14" />
                Check-in
              </button>
              <button
                v-if="booking.status === 'checkedIn'"
                @click="handleCheckOut(booking.id)"
                class="flex-1 py-2 px-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm transform hover:scale-105 flex items-center justify-center gap-1"
              >
                <Icon name="LogOut" :size="14" />
                Check-out
              </button>
              <button
                v-if="['confirmed', 'pending'].includes(booking.status)"
                @click="handleCancelBooking(booking.id)"
                class="flex-1 py-2 px-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm transform hover:scale-105 flex items-center justify-center gap-1"
              >
                <Icon name="X" :size="14" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Room } from '~/types/models'
import Icon from '~/components/common/Icon.vue'
import { RoomCard } from '~/components/shared'
import { useRoomsStore } from '~/stores/rooms'
import { useUserStore } from '~/stores/user'

interface Props {
  dharamshalaId: string
  dharamshalaName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  bookingCreated: [bookingId: string]
  checkedOut: [bookingId: string]
}>()

const roomsStore = useRoomsStore()
const userStore = useUserStore()

const rooms = ref<Room[]>([])
const loading = ref(false)
const filterDates = ref({
  checkIn: '',
  checkOut: '',
})
const filterRoomType = ref('')

const today = new Date().toISOString().split('T')[0]

const filteredRooms = computed(() => {
  let result = rooms.value

  // Filter by room type
  if (filterRoomType.value) {
    result = result.filter((r) => r.roomType === filterRoomType.value)
  }

  // Filter by availability for selected dates
  if (filterDates.value.checkIn && filterDates.value.checkOut) {
    result = result.filter((room) => {
      const bookingsForRoom = roomsStore.bookings.filter(
        (b) => b.roomId === room.id && b.status !== 'cancelled'
      )
      const isAvailable = !bookingsForRoom.some((booking) => {
        const bookingStart = new Date(booking.checkInDate)
        const bookingEnd = new Date(booking.checkOutDate)
        const requestStart = new Date(filterDates.value.checkIn)
        const requestEnd = new Date(filterDates.value.checkOut)

        return !(requestEnd <= bookingStart || requestStart >= bookingEnd)
      })
      return isAvailable
    })
  }

  return result
})

const userBookings = computed(() => {
  return roomsStore.bookings
    .filter((b) => b.dharamshalaId === props.dharamshalaId && b.userId === (userStore.userId || 'guest'))
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
})

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const handleBookingConfirmed = (bookingId: string) => {
  emit('bookingCreated', bookingId)
  roomsStore.loadBookingsFromLocalStorage()
}

const handleCheckIn = async (bookingId: string) => {
  await roomsStore.updateBookingStatus(bookingId, 'checkedIn')
  alert('✅ You have successfully checked in!')
}

const handleCheckOut = async (bookingId: string) => {
  const { useStaysStore } = await import('~/stores/stays')
  const staysStore = useStaysStore()

  const booking = roomsStore.bookings.find((b) => b.id === bookingId)
  if (booking) {
    const stay = staysStore.stays.find(
      (s) => s.dharamshalaId === booking.dharamshalaId && s.status === 'active'
    )

    if (stay) {
      await staysStore.completeStay(stay.id, new Date().toISOString().split('T')[0])
    }
  }

  await roomsStore.updateBookingStatus(bookingId, 'checkedOut')
  emit('checkedOut', bookingId)
  alert('✅ You have checked out! Thank you for your stay. Please rate your experience.')
}

const handleCancelBooking = async (bookingId: string) => {
  if (confirm('Are you sure you want to cancel this booking?')) {
    await roomsStore.cancelBooking(bookingId)
    alert('❌ Booking cancelled.')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const { useStaysStore } = await import('~/stores/stays')
    const staysStore = useStaysStore()
    staysStore.loadStaysFromLocalStorage()

    roomsStore.loadBookingsFromLocalStorage()
    roomsStore.loadSampleRooms(props.dharamshalaId)
    rooms.value = roomsStore.getRoomsByDharamshal(props.dharamshalaId)
  } catch (error) {
    console.error('Failed to load rooms:', error)
  } finally {
    loading.value = false
  }
})
</script>
