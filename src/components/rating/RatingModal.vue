<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="sticky top-0 bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b-2 border-blue-200 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Rate Your Stay</h2>
          <p class="text-gray-600 text-sm mt-1">{{ dharamshalaName }}</p>
        </div>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Icon name="X" :size="28" />
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-8 space-y-8">
        <!-- Overall Rating -->
        <div class="space-y-4">
          <label class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Icon name="Star" :size="24" class="text-amber-500" />
            Overall Experience
            <span class="text-red-600">*</span>
          </label>
          <div class="flex gap-4 items-center">
            <div class="flex gap-2">
              <button
                v-for="i in 5"
                :key="i"
                @click="form.overallRating = i"
                class="transition-all"
              >
                <Icon
                  name="Star"
                  :size="40"
                  :class="i <= form.overallRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'"
                />
              </button>
            </div>
            <span v-if="form.overallRating > 0" class="text-2xl font-bold text-amber-600">{{ form.overallRating }}/5</span>
          </div>
        </div>

        <!-- Category Ratings -->
        <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200 space-y-6">
          <h3 class="text-lg font-bold text-gray-900">Rate Each Category</h3>

          <!-- Cleanliness -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="font-semibold text-gray-700 flex items-center gap-2">
                <Icon name="Sparkles" :size="20" class="text-blue-600" />
                Cleanliness
              </label>
              <span v-if="form.cleanliness > 0" class="text-sm font-bold text-blue-600">{{ form.cleanliness }}/5</span>
            </div>
            <div class="flex gap-2">
              <button
                v-for="i in 5"
                :key="i"
                @click="form.cleanliness = i"
                class="transition-all"
              >
                <Icon
                  name="Star"
                  :size="28"
                  :class="i <= form.cleanliness ? 'text-blue-500 fill-blue-500' : 'text-gray-300'"
                />
              </button>
            </div>
          </div>

          <!-- Comfort -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="font-semibold text-gray-700 flex items-center gap-2">
                <Icon name="Armchair" :size="20" class="text-green-600" />
                Comfort
              </label>
              <span v-if="form.comfort > 0" class="text-sm font-bold text-green-600">{{ form.comfort }}/5</span>
            </div>
            <div class="flex gap-2">
              <button
                v-for="i in 5"
                :key="i"
                @click="form.comfort = i"
                class="transition-all"
              >
                <Icon
                  name="Star"
                  :size="28"
                  :class="i <= form.comfort ? 'text-green-500 fill-green-500' : 'text-gray-300'"
                />
              </button>
            </div>
          </div>

          <!-- Hospitality -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="font-semibold text-gray-700 flex items-center gap-2">
                <Icon name="Heart" :size="20" class="text-red-600" />
                Hospitality
              </label>
              <span v-if="form.hospitality > 0" class="text-sm font-bold text-red-600">{{ form.hospitality }}/5</span>
            </div>
            <div class="flex gap-2">
              <button
                v-for="i in 5"
                :key="i"
                @click="form.hospitality = i"
                class="transition-all"
              >
                <Icon
                  name="Star"
                  :size="28"
                  :class="i <= form.hospitality ? 'text-red-500 fill-red-500' : 'text-gray-300'"
                />
              </button>
            </div>
          </div>

          <!-- Value for Money -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="font-semibold text-gray-700 flex items-center gap-2">
                <Icon name="IndianRupee" :size="20" class="text-purple-600" />
                Value for Money
              </label>
              <span v-if="form.value > 0" class="text-sm font-bold text-purple-600">{{ form.value }}/5</span>
            </div>
            <div class="flex gap-2">
              <button
                v-for="i in 5"
                :key="i"
                @click="form.value = i"
                class="transition-all"
              >
                <Icon
                  name="Star"
                  :size="28"
                  :class="i <= form.value ? 'text-purple-500 fill-purple-500' : 'text-gray-300'"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Comment -->
        <div class="space-y-3">
          <label class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Icon name="MessageSquare" :size="24" class="text-cyan-600" />
            Share Your Experience
          </label>
          <textarea
            v-model="form.comment"
            placeholder="Tell us about your stay... (optional)"
            rows="5"
            class="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none resize-none transition-colors placeholder:text-gray-400"
          />
          <p class="text-sm text-gray-500">{{ form.comment.length }}/500 characters</p>
        </div>

        <!-- Guest Info -->
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200 space-y-4">
          <h3 class="text-lg font-bold text-gray-900">Guest Information</h3>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Name <span class="text-red-600">*</span>
            </label>
            <input
              v-model="form.guestName"
              type="text"
              placeholder="Your name"
              class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              v-model="form.guestEmail"
              type="email"
              placeholder="Your email (optional)"
              class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border-2 border-red-200 p-4 rounded-xl">
          <p class="text-red-700 font-semibold flex items-center gap-2">
            <Icon name="AlertCircle" :size="20" />
            {{ error }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl">
          <p class="text-blue-700 font-semibold flex items-center gap-2">
            <Icon name="Loader" :size="20" class="animate-spin" />
            Submitting your rating...
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-gray-50 p-6 border-t-2 border-gray-200 flex gap-4 justify-end">
        <button
          @click="closeModal"
          :disabled="loading"
          class="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          @click="submitRating"
          :disabled="loading || form.overallRating === 0 || !form.guestName"
          class="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Icon v-if="!loading" name="Send" :size="20" />
          {{ loading ? 'Submitting...' : 'Submit Rating' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { Rating } from '~/types/models'
import Icon from '~/components/common/Icon.vue'

interface Props {
  isOpen: boolean
  booking?: {
    id: string
    dharamshalaId: string
    guestName: string
    guestEmail: string
  }
  dharamshalaName?: string
}

interface RatingForm {
  overallRating: number
  cleanliness: number
  comfort: number
  hospitality: number
  value: number
  comment: string
  guestName: string
  guestEmail: string
}

const props = withDefaults(defineProps<Props>(), {
  dharamshalaName: 'Dharamshala',
})

const emit = defineEmits<{
  close: []
  ratingSubmitted: [Rating]
}>()

const form = reactive<RatingForm>({
  overallRating: 0,
  cleanliness: 0,
  comfort: 0,
  hospitality: 0,
  value: 0,
  comment: '',
  guestName: props.booking?.guestName || '',
  guestEmail: props.booking?.guestEmail || '',
})

const loading = ref(false)
const error = ref<string | null>(null)

const closeModal = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  form.overallRating = 0
  form.cleanliness = 0
  form.comfort = 0
  form.hospitality = 0
  form.value = 0
  form.comment = ''
  error.value = null
}

const submitRating = async () => {
  // Validate
  if (form.overallRating === 0) {
    error.value = 'Please provide an overall rating'
    return
  }

  if (!form.guestName.trim()) {
    error.value = 'Please enter your name'
    return
  }

  if (form.comment.length > 500) {
    error.value = 'Comment cannot exceed 500 characters'
    return
  }

  loading.value = true
  error.value = null

  try {
    const { useRatingApi } = await import('~/composables/api')
    const { createRating } = useRatingApi()

    const ratingData: Omit<Rating, 'id' | 'createdAt'> = {
      dharamshalaId: props.booking?.dharamshalaId || '',
      guestName: form.guestName,
      guestEmail: form.guestEmail,
      bookingId: props.booking?.id || '',
      overallRating: form.overallRating,
      cleanliness: form.cleanliness,
      comfort: form.comfort,
      hospitality: form.hospitality,
      value: form.value,
      comment: form.comment,
      visitDate: new Date().toISOString().split('T')[0],
    }

    const newRating = await createRating(ratingData)
    emit('ratingSubmitted', newRating)
    closeModal()
  } catch (err) {
    error.value = 'Failed to submit rating. Please try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Update form from props
watch(() => props.booking, (newBooking) => {
  if (newBooking) {
    form.guestName = newBooking.guestName
    form.guestEmail = newBooking.guestEmail
  }
}, { deep: true })
</script>
