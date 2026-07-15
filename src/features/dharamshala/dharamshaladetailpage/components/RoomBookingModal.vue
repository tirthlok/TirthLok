<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" @click="closeDialog" />
    </Transition>

    <!-- Modal -->
    <Transition name="slide-up">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
        <div
          class="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
          @click.stop
        >
          <!-- Header -->
          <div class="sticky top-0 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-6 py-5 flex justify-between items-center z-10 shadow-lg flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-1 h-8 bg-white/70 rounded-full" />
              <div>
                <h2 class="text-xl font-bold text-white">Book Room</h2>
                <p class="text-blue-100 text-sm">{{ room?.name || '' }}</p>
              </div>
            </div>
            <button @click="closeDialog" class="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-full">
              <Icon name="X" :size="24" />
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto overscroll-contain">
            <div class="p-5 sm:p-6 space-y-5">

              <!-- Room Info Summary -->
              <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-200">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div class="bg-white p-3 rounded-xl border border-blue-100 text-center">
                    <p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Category</p>
                    <p class="text-sm font-bold text-blue-600 capitalize mt-0.5">{{ room?.room_category }}</p>
                  </div>
                  <div class="bg-white p-3 rounded-xl border border-green-100 text-center">
                    <p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Price/Night</p>
                    <p class="text-sm font-bold text-green-600 mt-0.5">₹{{ room?.base_price }}</p>
                  </div>
                  <div class="bg-white p-3 rounded-xl border border-blue-100 text-center">
                    <p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Capacity</p>
                    <p class="text-sm font-bold text-blue-600 mt-0.5">{{ room?.capacity }} guests</p>
                  </div>
                  <div class="bg-white p-3 rounded-xl border border-cyan-100 text-center">
                    <p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Bed</p>
                    <p class="text-sm font-bold text-cyan-600 mt-0.5 truncate">{{ room?.bed_configuration }}</p>
                  </div>
                </div>
              </div>

              <!-- Booking Form -->
              <form @submit.prevent="handleSubmit" class="space-y-5">

                <!-- Date Selection -->
                <div class="bg-white rounded-2xl border-2 border-blue-100 p-4 space-y-3">
                  <h3 class="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <Icon name="Calendar" :size="18" class="text-blue-600" />
                    Select Dates
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-1.5">Check-in</label>
                      <input
                        v-model="booking.checkInDate"
                        type="date"
                        required
                        :min="booking.today"
                        class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-1.5">Check-out</label>
                      <input
                        v-model="booking.checkOutDate"
                        type="date"
                        required
                        :min="booking.checkOutMinDate"
                        class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition text-sm font-medium"
                      />
                    </div>
                  </div>
                  <!-- Night Count Badge -->
                  <div v-if="booking.nights > 0" class="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                    <Icon name="Moon" :size="14" class="text-blue-600" />
                    <span class="text-sm font-semibold text-blue-700">{{ booking.nights }} night{{ booking.nights > 1 ? 's' : '' }}</span>
                  </div>
                </div>

                <!-- Guest Selection -->
                <div class="bg-white rounded-2xl border-2 border-blue-100 p-4 space-y-3">
                  <h3 class="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <Icon name="Users" :size="18" class="text-blue-600" />
                    Guests
                    <span class="text-xs text-gray-400 font-normal ml-auto">Max {{ room?.max_guests }} guests</span>
                  </h3>

                  <!-- Guest Type Rows -->
                  <div class="space-y-2.5">
                    <!-- Adults -->
                    <div class="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl">
                      <div>
                        <p class="font-semibold text-gray-900 text-sm">Adults</p>
                        <p class="text-xs text-gray-500">13+ years</p>
                      </div>
                      <div class="flex items-center gap-3">
                        <button
                          type="button"
                          @click="booking.updateGuests('adults', -1)"
                          :disabled="booking.guests.adults <= 1"
                          class="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-600 font-bold hover:bg-blue-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >−</button>
                        <span class="w-8 text-center font-bold text-gray-900">{{ booking.guests.adults }}</span>
                        <button
                          type="button"
                          @click="booking.updateGuests('adults', 1)"
                          :disabled="booking.totalGuests >= (room?.max_guests || 1)"
                          class="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-600 font-bold hover:bg-blue-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >+</button>
                      </div>
                    </div>

                    <!-- Children -->
                    <div class="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl">
                      <div>
                        <p class="font-semibold text-gray-900 text-sm">Children</p>
                        <p class="text-xs text-gray-500">2-12 years</p>
                      </div>
                      <div class="flex items-center gap-3">
                        <button
                          type="button"
                          @click="booking.updateGuests('children', -1)"
                          :disabled="booking.guests.children <= 0"
                          class="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-600 font-bold hover:bg-blue-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >−</button>
                        <span class="w-8 text-center font-bold text-gray-900">{{ booking.guests.children }}</span>
                        <button
                          type="button"
                          @click="booking.updateGuests('children', 1)"
                          :disabled="booking.totalGuests >= (room?.max_guests || 1)"
                          class="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-600 font-bold hover:bg-blue-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >+</button>
                      </div>
                    </div>

                    <!-- Senior Citizens -->
                    <div class="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl">
                      <div>
                        <p class="font-semibold text-gray-900 text-sm">Senior Citizens</p>
                        <p class="text-xs text-gray-500">60+ years</p>
                      </div>
                      <div class="flex items-center gap-3">
                        <button
                          type="button"
                          @click="booking.updateGuests('seniors', -1)"
                          :disabled="booking.guests.seniors <= 0"
                          class="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-600 font-bold hover:bg-blue-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >−</button>
                        <span class="w-8 text-center font-bold text-gray-900">{{ booking.guests.seniors }}</span>
                        <button
                          type="button"
                          @click="booking.updateGuests('seniors', 1)"
                          :disabled="booking.totalGuests >= (room?.max_guests || 1)"
                          class="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-blue-600 font-bold hover:bg-blue-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                        >+</button>
                      </div>
                    </div>
                  </div>

                  <!-- Total Guests Badge -->
                  <div class="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                    <Icon name="Users" :size="14" class="text-blue-600" />
                    <span class="text-sm font-semibold text-blue-700">{{ booking.totalGuests }} total guest{{ booking.totalGuests > 1 ? 's' : '' }}</span>
                  </div>
                </div>

                <!-- Guest Details -->
                <div class="bg-white rounded-2xl border-2 border-blue-100 p-4 space-y-3">
                  <h3 class="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <Icon name="User" :size="18" class="text-blue-600" />
                    Guest Details
                  </h3>

                  <div class="space-y-3">
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                      <input
                        v-model="booking.guestName"
                        type="text"
                        placeholder="Enter your full name"
                        required
                        class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition text-sm"
                      />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Email *</label>
                        <input
                          v-model="booking.guestEmail"
                          type="email"
                          placeholder="your@email.com"
                          required
                          class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition text-sm"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Phone *</label>
                        <input
                          v-model="booking.guestPhone"
                          type="tel"
                          placeholder="+91-XXXXXXXXXX"
                          required
                          class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-1.5">Special Requests (Optional)</label>
                      <textarea
                        v-model="booking.notes"
                        placeholder="Any special requests..."
                        rows="2"
                        class="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition resize-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <!-- Pricing Breakdown -->
                <div v-if="booking.hasDates" class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-4 space-y-2">
                  <h3 class="font-bold text-gray-900 flex items-center gap-2 text-sm mb-3">
                    <Icon name="IndianRupee" :size="18" class="text-green-600" />
                    Price Breakdown
                  </h3>

                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">₹{{ booking.pricing?.roomPrice ?? 0 }} × {{ booking.pricing?.nights ?? 0 }} night{{ (booking.pricing?.nights ?? 0) > 1 ? 's' : '' }}</span>
                      <span class="font-semibold text-gray-900">₹{{ Number(booking.pricing?.subtotal ?? 0).toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">GST (5%)</span>
                      <span class="font-semibold text-gray-900">₹{{ Number(booking.pricing?.tax ?? 0).toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Service Charge</span>
                      <span class="font-semibold text-gray-900">₹{{ Number(booking.pricing?.serviceCharge ?? 0).toFixed(2) }}</span>
                    </div>
                    <div v-if="booking.pricing.discount > 0" class="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span class="font-semibold">-₹{{ Number(booking.pricing?.discount ?? 0).toFixed(2) }}</span>
                    </div>

                    <div class="border-t-2 border-green-200 pt-3 mt-3">
                      <div class="flex justify-between items-center">
                        <span class="text-base font-bold text-gray-900">Grand Total</span>
                        <span class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ₹{{ Number(booking.pricing?.grandTotal ?? 0).toFixed(2) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Terms -->
                <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <label class="flex items-start gap-3 cursor-pointer">
                    <input
                      v-model="booking.agreedToTerms"
                      type="checkbox"
                      class="mt-0.5 w-5 h-5 accent-blue-600 cursor-pointer rounded"
                    />
                    <span class="text-sm text-gray-700">
                      I agree to the dharamshala's
                      <span class="font-bold text-blue-600">booking terms and conditions</span>
                    </span>
                  </label>
                </div>

                <!-- Error Message -->
                <div v-if="booking.bookingError" class="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                  <p class="text-red-700 font-semibold flex items-center gap-2 text-sm">
                    <Icon name="AlertCircle" :size="18" />
                    {{ booking.bookingError }}
                  </p>
                </div>

                <!-- Success Message -->
                <div v-if="booking.bookingSuccess" class="space-y-4 py-2">

                  <!-- Success Header -->
                  <div class="text-center space-y-3">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center
                                justify-center mx-auto">
                      <Icon name="CheckCircle" :size="40" class="text-green-600" />
                    </div>
                    <h3 class="text-xl font-bold text-gray-900">Booking Confirmed!</h3>
                    <p class="text-sm text-gray-500">
                      Your stay has been successfully reserved
                    </p>
                  </div>

                  <!-- Booking Summary Card -->
                  <div class="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-200">
                    <div class="flex justify-between items-center pb-3
                                border-b border-gray-200">
                      <span class="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        Booking ID
                      </span>
                      <span class="font-mono text-sm font-bold text-blue-700
                                   bg-blue-50 px-3 py-1 rounded-lg">
                        {{ booking.bookingSuccess.id }}
                      </span>
                    </div>

                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Room</span>
                      <span class="font-semibold text-gray-900">{{ room?.name }}</span>
                    </div>

                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Check-in</span>
                      <span class="font-semibold text-gray-900">
                        {{ booking.bookingSuccess.checkInDate }}
                      </span>
                    </div>

                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Check-out</span>
                      <span class="font-semibold text-gray-900">
                        {{ booking.bookingSuccess.checkOutDate }}
                      </span>
                    </div>

                    <div class="flex justify-between items-center pt-3
                                border-t border-gray-200">
                      <span class="text-sm font-bold text-gray-900">Total Paid</span>
                      <span class="text-lg font-bold text-green-700">
                        ₹{{ booking.bookingSuccess.totalPrice }}
                      </span>
                    </div>
                  </div>

                  <!-- Status Badge -->
                  <div class="flex items-center justify-center gap-2
                              bg-green-50 py-3 rounded-xl border border-green-200">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span class="text-sm font-semibold text-green-700">
                      Booking Confirmed
                    </span>
                  </div>

                  <!-- Action Buttons -->
                  <div class="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      @click="closeDialog"
                      class="py-3 px-4 bg-gray-100 text-gray-700 rounded-xl
                             font-bold text-sm hover:bg-gray-200 transition"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      @click="goToBookings"
                      class="py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600
                             text-white rounded-xl font-bold text-sm
                             hover:from-blue-700 hover:to-cyan-700 transition"
                    >
                      View My Bookings
                    </button>
                  </div>
                </div>

                <!-- Action Buttons (hide after success) -->
                <div v-if="!booking.bookingSuccess" class="flex gap-3 pt-2">
                  <button
                    type="button"
                    @click="closeDialog"
                    class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="!booking.isValid || booking.isSubmitting"
                    class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-sm hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                  >
                    <template v-if="booking.isSubmitting">
                      <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Booking...
                    </template>
                    <template v-else>
                      <Icon name="CheckCircle" :size="18" />
                      Confirm Booking
                    </template>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, reactive } from 'vue'
import type { RoomType, Booking } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'
import { useRoomBooking } from '~/features/dharamshala/dharamshaladetailpage/composables/useRoomBooking'

interface Props {
  isOpen: boolean
  room?: RoomType
  dharamshalaId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  bookingConfirmed: [booking: Booking]
}>()

const booking = reactive(useRoomBooking(props.dharamshalaId))

// Sync selected room when prop changes
watch(() => props.room, (newRoom) => {
  if (newRoom) {
    booking.selectRoom(newRoom)
  }
}, { immediate: true })

// Reset when modal closes
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    booking.resetBooking()
  }
})

const router = useRouter()

const closeDialog = () => {
  emit('close')
}

const goToBookings = () => {
  emit('close')
  router.push('/bookings')
}

const handleSubmit = async () => {
  const success = await booking.submitBooking()
  if (success && booking.bookingSuccess) {
    emit('bookingConfirmed', booking.bookingSuccess)
  }
}
</script>

<style scoped>
/* Slide-up transition for mobile bottom sheet feel */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Fade transition for backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Smooth scroll for overscroll */
.overscroll-contain {
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
</style>
