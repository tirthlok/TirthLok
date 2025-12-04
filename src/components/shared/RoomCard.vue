<template>
  <div class="group h-full">
    <div class="bg-white rounded-2xl border-2 border-blue-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full flex flex-col group-hover:border-cyan-300">
      <!-- Image Carousel -->
      <div class="relative bg-gradient-to-br from-blue-100 to-cyan-100 overflow-hidden h-56">
        <!-- Image -->
        <img
          :src="currentImage"
          :alt="`Room ${room.roomNumber}`"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <!-- Image Counter Badge -->
        <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-bold">
          {{ currentImageIndex + 1 }}/{{ room.images.length }}
        </div>

        <!-- Navigation Arrows -->
        <button
          v-show="room.images.length > 1"
          @click="previousImage"
          class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white hover:scale-110 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
        >
          <Icon name="ChevronLeft" :size="20" class="text-blue-600" />
        </button>
        <button
          v-show="room.images.length > 1"
          @click="nextImage"
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white hover:scale-110 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
        >
          <Icon name="ChevronRight" :size="20" class="text-blue-600" />
        </button>

        <!-- Dot Navigation -->
        <div v-if="room.images.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          <button
            v-for="(_, idx) in room.images"
            :key="idx"
            @click="currentImageIndex = idx"
            :class="{ 'scale-125': idx === currentImageIndex }"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :style="{ backgroundColor: idx === currentImageIndex ? 'rgb(59, 130, 246)' : 'rgba(255,255,255,0.6)' }"
          />
        </div>

        <!-- Badge -->
        <div class="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-lg">
          {{ formatRoomType(room.roomType) }}
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 p-5 flex flex-col">
        <!-- Room Info -->
        <div class="mb-3">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-black text-lg text-gray-900">Room {{ room.roomNumber }}</h3>
            <div class="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              <Icon name="Users" :size="16" class="text-blue-600" />
              <span class="font-bold text-sm text-blue-900">{{ room.capacity }}</span>
            </div>
          </div>
          <p class="text-sm text-gray-600 line-clamp-2 leading-snug">{{ room.description }}</p>
        </div>

        <!-- Amenities -->
        <div class="mb-4 pb-4 border-b-2 border-gray-100">
          <div class="flex flex-wrap gap-2">
            <span v-for="(amenity, idx) in room.amenities.slice(0, 3)" :key="idx" class="text-xs bg-gradient-to-r from-emerald-50 to-cyan-50 text-gray-700 px-2.5 py-1.5 rounded-lg font-semibold border border-emerald-200">
              ✓ {{ amenity }}
            </span>
            <span v-if="room.amenities.length > 3" class="text-xs bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg font-bold">
              +{{ room.amenities.length - 3 }} more
            </span>
          </div>
        </div>

        <!-- Price Section -->
        <div class="mb-4 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-3xl font-black text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">₹{{ room.pricePerNight }}</span>
            <span class="text-gray-600 font-semibold">/night</span>
          </div>
          <p v-if="numberOfNights > 0" class="text-sm text-gray-600 font-semibold">
            Total: <span class="font-black text-gray-900">₹{{ calculatedTotal }}</span> ({{ numberOfNights }} night{{ numberOfNights !== 1 ? 's' : '' }})
          </p>
        </div>

        <!-- Book Button -->
        <button
          @click="toggleBookingForm"
          :class="{ 'ring-4 ring-blue-300': showBookingForm }"
          class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-black shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Icon name="Calendar" :size="18" />
          {{ showBookingForm ? 'Hide' : 'Book Now' }}
        </button>
      </div>

      <!-- Booking Form (Hidden by default) -->
      <div
        v-if="showBookingForm"
        class="px-5 pb-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-t-2 border-blue-200 space-y-4"
      >
        <!-- Number of Guests -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Number of Guests</label>
          <select
            v-model.number="bookingData.numberOfGuests"
            class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-semibold"
          >
            <option v-for="n in room.capacity" :key="n" :value="n">{{ n }} {{ n === 1 ? 'Guest' : 'Guests' }}</option>
          </select>
        </div>

        <!-- Check-in Date -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Check-in Date</label>
          <input
            v-model="bookingData.checkInDate"
            type="date"
            :min="today"
            class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-semibold"
          />
        </div>

        <!-- Check-out Date -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Check-out Date</label>
          <input
            v-model="bookingData.checkOutDate"
            type="date"
            :min="bookingData.checkInDate || today"
            class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-semibold"
          />
        </div>

        <!-- Name -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
          <input
            v-model="bookingData.userName"
            type="text"
            placeholder="Enter your name"
            class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-semibold"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Email</label>
          <input
            v-model="bookingData.userEmail"
            type="email"
            placeholder="your@email.com"
            class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-semibold"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
          <input
            v-model="bookingData.userPhone"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-semibold"
          />
        </div>

        <!-- Special Requests -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Special Requests (Optional)</label>
          <textarea
            v-model="bookingData.notes"
            placeholder="Any special requirements?"
            class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-semibold resize-none h-20"
          />
        </div>

        <!-- Price Summary -->
        <div class="p-3 bg-white rounded-lg border-2 border-blue-300">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-600 font-semibold">₹{{ room.pricePerNight }} × {{ numberOfNights }} night{{ numberOfNights !== 1 ? 's' : '' }}</span>
            <span class="font-black text-gray-900">₹{{ calculatedTotal }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 pt-2">
          <button
            @click="confirmBooking"
            :disabled="!isBookingValid || isSubmitting"
            :class="{ 'opacity-50 cursor-not-allowed': !isBookingValid || isSubmitting }"
            class="flex-1 py-3 px-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-black shadow-lg hover:shadow-xl transition-all disabled:hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <Icon name="Check" :size="18" />
            {{ isSubmitting ? 'Booking...' : 'Confirm' }}
          </button>
          <button
            @click="cancelBooking"
            class="flex-1 py-3 px-3 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-black shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Room } from '~/types/models'
import Icon from '~/components/common/Icon.vue'
import { useRoomsStore } from '~/stores/rooms'

interface Props {
  room: Room
  dharamshalaId: string
  dharamshalaName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  bookingConfirmed: [bookingId: string]
}>()

const roomsStore = useRoomsStore()

const currentImageIndex = ref(0)
const showBookingForm = ref(false)
const isSubmitting = ref(false)

const today = new Date().toISOString().split('T')[0]

const bookingData = ref({
  numberOfGuests: 1,
  checkInDate: '',
  checkOutDate: '',
  userName: '',
  userEmail: '',
  userPhone: '',
  notes: '',
})

const numberOfNights = computed(() => {
  if (!bookingData.value.checkInDate || !bookingData.value.checkOutDate) return 0
  const start = new Date(bookingData.value.checkInDate)
  const end = new Date(bookingData.value.checkOutDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
})

const calculatedTotal = computed(() => {
  return roomsStore.calculateTotalPrice(props.room.pricePerNight, numberOfNights.value)
})

const isBookingValid = computed(() => {
  return (
    bookingData.value.numberOfGuests > 0 &&
    bookingData.value.checkInDate &&
    bookingData.value.checkOutDate &&
    bookingData.value.userName &&
    bookingData.value.userEmail &&
    bookingData.value.userPhone &&
    numberOfNights.value > 0
  )
})

const currentImage = computed(() => {
  return props.room.images[currentImageIndex.value] || 'https://via.placeholder.com/400x300'
})

const formatRoomType = (type: string): string => {
  const types: { [key: string]: string } = {
    single: 'Single',
    double: 'Double',
    dorm: 'Dorm',
    family: 'Family',
  }
  return types[type] || type
}

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % props.room.images.length
}

const previousImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + props.room.images.length) % props.room.images.length
}

const toggleBookingForm = () => {
  showBookingForm.value = !showBookingForm.value
}

const confirmBooking = async () => {
  if (!isBookingValid.value) {
    alert('Please fill all required fields')
    return
  }

  isSubmitting.value = true

  try {
    const { useUserStore } = await import('~/stores/user')
    const userStore = useUserStore()

    const booking = await roomsStore.createBooking({
      roomId: props.room.id,
      dharamshalaId: props.dharamshalaId,
      userId: userStore.userId || 'guest',
      userName: bookingData.value.userName,
      userEmail: bookingData.value.userEmail,
      userPhone: bookingData.value.userPhone,
      checkInDate: bookingData.value.checkInDate,
      checkOutDate: bookingData.value.checkOutDate,
      numberOfGuests: bookingData.value.numberOfGuests,
      numberOfNights: numberOfNights.value,
      totalPrice: calculatedTotal.value,
      status: 'confirmed',
      notes: bookingData.value.notes,
    })

    emit('bookingConfirmed', booking.id)
    showBookingForm.value = false
    alert(`✅ Booking Confirmed! Booking ID: ${booking.id}\n\nCheck-in: ${bookingData.value.checkInDate}\nCheck-out: ${bookingData.value.checkOutDate}\nTotal: ₹${calculatedTotal.value}`)
    
    // Reset form
    bookingData.value = {
      numberOfGuests: 1,
      checkInDate: '',
      checkOutDate: '',
      userName: '',
      userEmail: '',
      userPhone: '',
      notes: '',
    }
  } catch (error) {
    alert('Failed to confirm booking. Please try again.')
    console.error('Booking error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const cancelBooking = () => {
  showBookingForm.value = false
  bookingData.value = {
    numberOfGuests: 1,
    checkInDate: '',
    checkOutDate: '',
    userName: '',
    userEmail: '',
    userPhone: '',
    notes: '',
  }
}
</script>
