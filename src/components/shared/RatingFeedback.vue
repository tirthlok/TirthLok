<template>
  <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-200 will-change-auto">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <Icon name="Star" :size="28" class="text-yellow-500" />
      <h2 class="text-2xl font-bold text-gray-900">Recent Guest Ratings</h2>
    </div>

    <!-- Submitted Ratings Display (if any) -->
    <div v-if="submittedRatings.length > 0" class="space-y-4 max-h-96 overflow-y-auto will-change-auto">
      <div v-for="(rating, index) in submittedRatings" :key="index" class="p-4 bg-white rounded-xl border-2 border-yellow-100 hover:shadow-md transition-shadow will-change-auto">
        <div class="flex items-start justify-between mb-3">
          <div class="flex gap-2">
            <span v-for="star in 5" :key="star">
              <Icon 
                name="Star"
                :size="16" 
                :class="getReviewStarClass(star, rating.rating)"
              />
            </span>
          </div>
          <span class="text-xs text-gray-500 font-semibold">{{ rating.date }}</span>
        </div>
        <p v-if="rating.feedback" class="text-gray-700 text-sm leading-relaxed">{{ rating.feedback }}</p>
        <p v-else class="text-gray-500 italic text-sm">No feedback provided</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-6 bg-white rounded-xl border-2 border-blue-100 text-center">
      <Icon name="MessageSquare" :size="32" class="text-gray-400 mx-auto mb-3" />
      <p class="text-gray-500 font-semibold">No ratings yet. Be the first to rate after your stay!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useStaysStore } from '~/stores/stays'
import Icon from '~/components/common/Icon.vue'

interface Rating {
  rating: number
  feedback: string
  date: string
}

interface Props {
  facilityId: string
}

const props = defineProps<Props>()

const submittedRatings = ref<Rating[]>([])
const staysStore = useStaysStore()

const getReviewStarClass = (star: number, reviewRating: number): string => {
  if (star <= reviewRating) {
    return 'fill-yellow-400 text-yellow-400'
  }
  return 'text-gray-300 opacity-40'
}

const loadRatings = () => {
  submittedRatings.value = []
  staysStore.stays.forEach((stay) => {
    if (stay.dharamshalaId === props.facilityId && stay.ratingSubmitted && stay.rating) {
      submittedRatings.value.push({
        rating: stay.rating,
        feedback: stay.feedback || '',
        date: new Date(stay.checkOutDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      })
    }
  })
}

onMounted(() => {
  // Load stays from localStorage
  staysStore.loadStaysFromLocalStorage()
  loadRatings()
})

// Watch for changes in stays to update ratings in real-time
watch(
  () => staysStore.stays.length,
  () => {
    loadRatings()
  }
)
</script>

