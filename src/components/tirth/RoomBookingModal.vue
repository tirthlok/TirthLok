<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8 flex justify-between items-center rounded-t-2xl shadow-lg">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-white rounded-full opacity-75" />
            <h2 class="text-2xl font-bold text-white">Book Room {{ room?.roomNumber }}</h2>
          </div>
          <button @click="closeDialog" class="text-white hover:text-blue-100 transition transform hover:scale-110">
            <Icon name="X" :size="28" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-8 space-y-6">
          <!-- Room Info -->
          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-white p-4 rounded-xl border border-blue-100 hover:shadow-lg transition-all">
                <p class="text-xs text-gray-600 uppercase font-bold tracking-wide">Type</p>
                <p class="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent capitalize">{{ room?.type }}</p>
              </div>
              <div class="bg-white p-4 rounded-xl border border-green-100 hover:shadow-lg transition-all">
                <p class="text-xs text-gray-600 uppercase font-bold tracking-wide">Price/Night</p>
                <p class="text-lg font-bold text-green-600">₹{{ room?.price }}</p>
              </div>
              <div class="bg-white p-4 rounded-xl border border-blue-100 hover:shadow-lg transition-all">
                <p class="text-xs text-gray-600 uppercase font-bold tracking-wide">Capacity</p>
                <p class="text-lg font-bold text-blue-600">{{ room?.capacity }}</p>
              </div>
              <div class="bg-white p-4 rounded-xl border border-cyan-100 hover:shadow-lg transition-all">
                <p class="text-xs text-gray-600 uppercase font-bold tracking-wide">Bed Type</p>
                <p class="text-sm font-bold text-cyan-600">{{ room?.bedType }}</p>
              </div>
            </div>
          </div>

          <!-- Booking Form -->
          <form @submit.prevent="submitBooking" class="space-y-5">
            <!-- Guest Name -->
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Icon name="User" :size="18" class="text-blue-600" />
                Full Name *
              </label>
              <input
                v-model="formData.guestName"
                type="text"
                placeholder="Enter your full name"
                required
                class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-600 focus:shadow-lg focus:outline-none transition"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Icon name="Mail" :size="18" class="text-blue-600" />
                Email Address *
              </label>
              <input
                v-model="formData.guestEmail"
                type="email"
                placeholder="your.email@example.com"
                required
                class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-600 focus:shadow-lg focus:outline-none transition"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Icon name="Phone" :size="18" class="text-blue-600" />
                Phone Number *
              </label>
              <input
                v-model="formData.guestPhone"
                type="tel"
                placeholder="+91-XXXXXXXXXX"
                required
                class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-600 focus:shadow-lg focus:outline-none transition"
              />
            </div>

            <!-- Check-in & Check-out -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Icon name="Calendar" :size="18" class="text-blue-600" />
                  Check-in Date *
                </label>
                <input
                  v-model="formData.checkInDate"
                  type="date"
                  required
                  :min="today"
                  class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-600 focus:shadow-lg focus:outline-none transition"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Icon name="Calendar" :size="18" class="text-blue-600" />
                  Check-out Date *
                </label>
                <input
                  v-model="formData.checkOutDate"
                  type="date"
                  required
                  :min="checkOutMinDate"
                  class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-600 focus:shadow-lg focus:outline-none transition"
                />
              </div>
            </div>

            <!-- Number of Guests -->
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Icon name="Users" :size="18" class="text-blue-600" />
                Number of Guests *
              </label>
              <select
                v-model.number="formData.numberOfGuests"
                required
                :max="room?.maxGuests"
                class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-600 focus:shadow-lg focus:outline-none transition"
              >
                <option v-for="n in room?.maxGuests" :key="n" :value="n">
                  {{ n }} Guest{{ n > 1 ? 's' : '' }}
                </option>
              </select>
            </div>

            <!-- Special Requests -->
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Icon name="MessageSquare" :size="18" class="text-blue-600" />
                Special Requests (Optional)
              </label>
              <textarea
                v-model="formData.notes"
                placeholder="Any special requests or notes..."
                rows="3"
                class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-600 focus:shadow-lg focus:outline-none transition resize-none"
              />
            </div>

            <!-- Price Calculation -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
              <div class="space-y-3">
                <div class="flex justify-between items-center pb-2">
                  <span class="text-gray-700 font-semibold">Price per night:</span>
                  <span class="font-bold text-gray-900 text-lg">₹{{ room?.price }}</span>
                </div>
                <div class="flex justify-between items-center pb-2 border-b-2 border-green-200">
                  <span class="text-gray-700 font-semibold">Number of nights:</span>
                  <span class="font-bold text-gray-900 text-lg">{{ nights }}</span>
                </div>
                <div class="flex justify-between items-center pt-2">
                  <span class="text-lg font-bold text-gray-900">Total Amount:</span>
                  <span class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">₹{{ totalPrice }}</span>
                </div>
              </div>
            </div>

            <!-- Terms -->
            <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  v-model="agreedToTerms"
                  type="checkbox"
                  class="mt-1 w-5 h-5 accent-blue-600 cursor-pointer rounded"
                />
                <span class="text-sm text-gray-700">
                  I agree to the dharamshala's
                  <span class="font-bold text-blue-600">booking terms and conditions</span>
                </span>
              </label>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 p-4 rounded-xl border-2 border-red-200">
              <p class="text-red-700 font-semibold flex items-center gap-2">
                <Icon name="AlertCircle" :size="18" />
                {{ errorMessage }}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-6 border-t-2 border-blue-200">
              <button
                type="button"
                @click="closeDialog"
                class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition transform hover:scale-105 duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="!agreedToTerms || isSubmitting"
                class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition transform hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Icon v-if="!isSubmitting" name="CheckCircle" :size="18" />
                <span v-if="isSubmitting">Booking...</span>
                <span v-else>Confirm Booking</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Room, Booking } from '~/types/models'
import Icon from '~/components/common/Icon.vue'
import { useRoomBookingApi } from '~/composables/api/useRoomBookingApi'

interface Props {
  isOpen: boolean
  room?: Room
  dharamshalaId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  bookingConfirmed: [booking: Booking]
}>()

const { createBooking, calculateBookingPrice, calculateNights } = useRoomBookingApi()

const formData = ref({
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  checkInDate: '',
  checkOutDate: '',
  numberOfGuests: 1,
  notes: '',
})

const agreedToTerms = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const today = computed(() => {
  const date = new Date()
  date.setDate(date.getDate())
  return date.toISOString().split('T')[0]
})

const checkOutMinDate = computed(() => {
  if (!formData.value.checkInDate) return today.value
  const date = new Date(formData.value.checkInDate)
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
})

const nights = computed(() => {
  if (!formData.value.checkInDate || !formData.value.checkOutDate) return 0
  return calculateNights(formData.value.checkInDate, formData.value.checkOutDate)
})

const totalPrice = computed(() => {
  if (!props.room || !formData.value.checkInDate || !formData.value.checkOutDate) return 0
  return calculateBookingPrice(props.room.price, formData.value.checkInDate, formData.value.checkOutDate)
})

const closeDialog = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  formData.value = {
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    notes: '',
  }
  agreedToTerms.value = false
  errorMessage.value = ''
}

const submitBooking = async () => {
  if (!props.room || !agreedToTerms.value) return

  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const booking = await createBooking({
      roomId: props.room.id,
      dharamshalaId: props.dharamshalaId,
      guestName: formData.value.guestName,
      guestEmail: formData.value.guestEmail,
      guestPhone: formData.value.guestPhone,
      checkInDate: formData.value.checkInDate,
      checkOutDate: formData.value.checkOutDate,
      numberOfGuests: formData.value.numberOfGuests,
      totalPrice: totalPrice.value,
      status: 'confirmed',
      notes: formData.value.notes,
    })

    emit('bookingConfirmed', booking)
    closeDialog()

    // Show success message
    const message = `Booking confirmed! Booking ID: ${booking.id}`
    alert(message)
  } catch (error) {
    console.error('Booking error:', error)
    errorMessage.value = 'Failed to create booking. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
