/**
 * useRoomBooking Composable
 * Manages transient booking flow state: selected room, dates, guests, pricing, validation
 * This is NOT a Pinia store — it's a per-instance composable for the booking UI
 */

import { ref, computed, watch } from 'vue'
import type { RoomType, GuestBreakdown, PricingBreakdown, Booking } from '~/types/models'
import { useRoomBookingApi } from '~/features/dharamshala/services/roomBookingApi'

export function useRoomBooking(dharamshalaId: string) {
  const {
    calculateNights,
    calculatePricing,
    getRoomAvailabilityStatus,
    getTotalGuests,
    createBooking,
  } = useRoomBookingApi()

  // ─── State ──────────────────────────────────────────────
  const selectedRoom = ref<RoomType | null>(null)
  const checkInDate = ref('')
  const checkOutDate = ref('')
  const guests = ref<GuestBreakdown>({ adults: 1, children: 0, seniors: 0 })
  const notes = ref('')
  const guestName = ref('')
  const guestEmail = ref('')
  const guestPhone = ref('')
  const agreedToTerms = ref(false)
  const isSubmitting = ref(false)
  const bookingError = ref('')
  const bookingSuccess = ref<Booking | null>(null)
  const discount = ref(0)

  // ─── Computed ───────────────────────────────────────────

  /** Today's date in YYYY-MM-DD format */
  const today = computed(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  })

  /** Minimum check-out date (day after check-in) */
  const checkOutMinDate = computed(() => {
    if (!checkInDate.value) return today.value
    const d = new Date(checkInDate.value)
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })

  /** Number of nights */
  const nights = computed(() => {
    if (!checkInDate.value || !checkOutDate.value) return 0
    return calculateNights(checkInDate.value, checkOutDate.value)
  })

  /** Total guest count */
  const totalGuests = computed(() => getTotalGuests(guests.value))

  /** Full pricing breakdown */
  const pricing = computed<PricingBreakdown>(() => {
    if (!selectedRoom.value || !checkInDate.value || !checkOutDate.value) {
      return { roomPrice: 0, nights: 0, subtotal: 0, tax: 0, serviceCharge: 0, discount: 0, grandTotal: 0 }
    }
    return calculatePricing(
      selectedRoom.value.base_price,
      checkInDate.value,
      checkOutDate.value,
      discount.value
    )
  })

  /** Room availability status */
  const roomStatus = computed(() => {
    if (!selectedRoom.value) return 'sold_out'
    return getRoomAvailabilityStatus(selectedRoom.value)
  })

  /** Validation errors */
  const validationErrors = computed(() => {
    const errors: string[] = []

    if (!selectedRoom.value) errors.push('Please select a room')
    if (!checkInDate.value) errors.push('Check-in date is required')
    if (!checkOutDate.value) errors.push('Check-out date is required')
    if (checkInDate.value && checkInDate.value < today.value) errors.push('Check-in date cannot be in the past')
    if (checkInDate.value && checkOutDate.value && checkOutDate.value <= checkInDate.value) {
      errors.push('Check-out must be after check-in')
    }
    if (totalGuests.value < 1) errors.push('At least 1 guest is required')
    if (selectedRoom.value && totalGuests.value > selectedRoom.value.max_guests) {
      errors.push(`Maximum ${selectedRoom.value.max_guests} guests allowed`)
    }
    if (!guestName.value.trim()) errors.push('Guest name is required')
    if (!guestEmail.value.trim()) errors.push('Email is required')
    if (guestEmail.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.value)) {
      errors.push('Invalid email format')
    }
    if (!guestPhone.value.trim()) errors.push('Phone number is required')
    if (!agreedToTerms.value) errors.push('You must agree to the terms')

    return errors
  })

  /** Whether the form is valid and ready for submission */
  const isValid = computed(() => validationErrors.value.length === 0)

  /** Whether dates have been selected */
  const hasDates = computed(() => !!checkInDate.value && !!checkOutDate.value && nights.value > 0)

  // ─── Watchers ───────────────────────────────────────────

  // Auto-adjust check-out if check-in changes to be after it
  watch(checkInDate, (newVal) => {
    if (newVal && checkOutDate.value && checkOutDate.value <= newVal) {
      const d = new Date(newVal)
      d.setDate(d.getDate() + 1)
      checkOutDate.value = d.toISOString().split('T')[0]
    }
  })

  // ─── Actions ────────────────────────────────────────────

  /** Select a room for booking */
  const selectRoom = (room: RoomType) => {
    selectedRoom.value = room
    bookingError.value = ''
    bookingSuccess.value = null
  }

  /** Clear room selection */
  const clearRoom = () => {
    selectedRoom.value = null
  }

  /** Update guest count with validation */
  const updateGuests = (type: keyof GuestBreakdown, delta: number) => {
    const newVal = guests.value[type] + delta
    if (newVal < 0) return
    if (type === 'adults' && newVal < 1) return // minimum 1 adult

    const newGuests = { ...guests.value, [type]: newVal }
    const newTotal = getTotalGuests(newGuests)

    // Check max_guests constraint
    if (selectedRoom.value && newTotal > selectedRoom.value.max_guests) return

    guests.value = newGuests
  }

  /** Submit the booking */
  const submitBooking = async (): Promise<boolean> => {
    if (!isValid.value || !selectedRoom.value) {
      bookingError.value = validationErrors.value[0] || 'Please fix validation errors'
      return false
    }

    isSubmitting.value = true
    bookingError.value = ''

    try {
      const booking = await createBooking({
        roomId: selectedRoom.value.room_type_id,
        dharamshalaId,
        guestName: guestName.value.trim(),
        guestEmail: guestEmail.value.trim(),
        guestPhone: guestPhone.value.trim(),
        checkInDate: checkInDate.value,
        checkOutDate: checkOutDate.value,
        numberOfGuests: totalGuests.value,
        guests: guests.value,
        totalPrice: pricing.value.grandTotal,
        pricing: pricing.value,
        status: 'confirmed',
        notes: notes.value.trim() || undefined,
      })

      bookingSuccess.value = booking
      return true
    } catch (error: any) {
      console.error('Booking submission error:', error)
      const message = error?.data?.statusMessage || error?.message || 'Booking failed. Please try again.'
      bookingError.value = message
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  /** Reset the entire booking form */
  const resetBooking = () => {
    selectedRoom.value = null
    checkInDate.value = ''
    checkOutDate.value = ''
    guests.value = { adults: 1, children: 0, seniors: 0 }
    notes.value = ''
    guestName.value = ''
    guestEmail.value = ''
    guestPhone.value = ''
    agreedToTerms.value = false
    isSubmitting.value = false
    bookingError.value = ''
    bookingSuccess.value = null
    discount.value = 0
  }

  return {
    // State
    selectedRoom,
    checkInDate,
    checkOutDate,
    guests,
    notes,
    guestName,
    guestEmail,
    guestPhone,
    agreedToTerms,
    isSubmitting,
    bookingError,
    bookingSuccess,
    discount,

    // Computed
    today,
    checkOutMinDate,
    nights,
    totalGuests,
    pricing,
    roomStatus,
    validationErrors,
    isValid,
    hasDates,

    // Actions
    selectRoom,
    clearRoom,
    updateGuests,
    submitBooking,
    resetBooking,
  }
}
