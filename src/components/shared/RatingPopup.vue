<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isVisible" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-bounce-in">
          <!-- Header -->
          <div class="bg-gradient-to-r from-yellow-400 to-amber-400 p-6 text-center">
            <Icon name="Star" :size="48" class="fill-yellow-600 text-yellow-600 mx-auto mb-3" />
            <h2 class="text-2xl font-bold text-gray-900">Rate Your Stay</h2>
            <p class="text-gray-700 text-sm mt-2">Tell us about your experience at {{ stay?.dharamshalaName }}</p>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6">
            <!-- Check-in/out dates -->
            <div class="bg-gray-50 p-4 rounded-xl">
              <p class="text-sm text-gray-600 font-semibold mb-3">Your Stay Duration</p>
              <div class="flex items-center justify-between text-sm">
                <div>
                  <p class="text-gray-500">Check-in</p>
                  <p class="font-bold text-gray-900">{{ formatDate(stay?.checkInDate) }}</p>
                </div>
                <Icon name="ArrowRight" :size="20" class="text-gray-400" />
                <div>
                  <p class="text-gray-500">Check-out</p>
                  <p class="font-bold text-gray-900">{{ formatDate(stay?.checkOutDate) }}</p>
                </div>
              </div>
            </div>

            <!-- Star Rating -->
            <div class="text-center">
              <p class="text-sm font-semibold text-gray-700 mb-4">How would you rate your stay?</p>
              <div class="flex gap-3 justify-center">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="userRating = star"
                  @mouseover="hoverRating = star"
                  @mouseleave="hoverRating = 0"
                  class="transition-all duration-200 transform hover:scale-125"
                >
                  <Icon 
                    name="Star" 
                    :size="40" 
                    :class="getStarClass(star, hoverRating || userRating)"
                  />
                </button>
              </div>
              <p class="text-lg font-bold text-gray-900 mt-4">
                {{ getRatingLabel(userRating) }}
              </p>
            </div>

            <!-- Feedback Textarea -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Share your feedback (optional)</label>
              <textarea
                v-model="userFeedback"
                placeholder="Tell us about your experience, cleanliness, facilities, hospitality..."
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                rows="4"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <button
                @click="submitRating"
                class="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-bold hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="userRating === 0"
              >
                <Icon name="Send" :size="18" class="group-hover:animate-bounce" />
                <span>Submit Rating</span>
              </button>
              <button
                @click="skipRating"
                class="flex-1 py-3 px-4 bg-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300"
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { DharamshalStay } from '~/types/models'
import Icon from '~/components/common/Icon.vue'

interface Props {
  stay: DharamshalStay | null
  isOpen: boolean
}

const props = withDefaults(defineProps<Props>(), {
  stay: null,
  isOpen: false,
})

const emit = defineEmits<{
  ratingSubmitted: [rating: number, feedback: string]
  closed: []
}>()

const isVisible = ref(props.isOpen)
const userRating = ref(0)
const userFeedback = ref('')
const hoverRating = ref(0)

// Watch for changes to isOpen prop
watch(() => props.isOpen, (newVal) => {
  isVisible.value = newVal
})

const getRatingLabel = (rating: number): string => {
  const labels: { [key: number]: string } = {
    0: 'Select a rating',
    1: '😞 Poor - Needs improvement',
    2: '😐 Average - Could be better',
    3: '😊 Good - Satisfied',
    4: '😄 Very Good - Impressed',
    5: '🤩 Excellent - Highly recommend',
  }
  return labels[rating] || 'Select a rating'
}

const getStarClass = (star: number, activeRating: number): string => {
  if (star <= activeRating) {
    return 'fill-yellow-400 text-yellow-400 transition-all duration-200'
  }
  return 'fill-gray-300 text-gray-300 transition-all duration-200'
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const submitRating = async () => {
  if (userRating.value === 0) {
    alert('Please select a rating')
    return
  }

  const { useStaysStore } = await import('~/stores/stays')
  const staysStore = useStaysStore()

  if (props.stay) {
    await staysStore.submitRatingForStay(props.stay.id, userRating.value, userFeedback.value)
  }

  emit('ratingSubmitted', userRating.value, userFeedback.value)
  isVisible.value = false
}

const skipRating = () => {
  isVisible.value = false
  emit('closed')
}

onMounted(() => {
  isVisible.value = props.isOpen
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.3s ease;
}
</style>
