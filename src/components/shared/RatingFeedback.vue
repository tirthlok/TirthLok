<template>
  <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-200">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <Icon name="Info" :size="28" class="text-blue-600" />
      <h2 class="text-2xl font-bold text-gray-900">Rating System</h2>
    </div>

    <!-- Info Message -->
    <div class="p-6 bg-white rounded-xl border-2 border-blue-100">
      <div class="flex items-start gap-4">
        <Icon name="AlertCircle" :size="24" class="text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <p class="font-semibold text-gray-900 mb-2">How Ratings Work</p>
          <p class="text-gray-700 text-sm leading-relaxed">
            Ratings and feedback are collected <strong>after you complete your stay</strong> at this dharamshala. 
            When you check out, you'll receive a popup to rate your experience and share feedback.
          </p>
          <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm font-semibold text-blue-900 mb-2">📍 Rating Eligibility:</p>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>✓ Complete your stay at the dharamshala</li>
              <li>✓ Rate your experience during checkout</li>
              <li>✓ Share detailed feedback to help others</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Submitted Ratings Display (if any) -->
    <div v-if="submittedRatings.length > 0" class="mt-8">
      <h3 class="text-xl font-bold text-gray-900 mb-6">Recent Guest Ratings</h3>
      <div class="space-y-4 max-h-96 overflow-y-auto">
        <div v-for="(rating, index) in submittedRatings" :key="index" class="p-4 bg-white rounded-xl border-2 border-yellow-100 hover:shadow-md transition-all">
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
    </div>

    <!-- Empty State -->
    <div v-else class="mt-8 p-6 bg-white rounded-xl border-2 border-blue-100 text-center">
      <Icon name="MessageSquare" :size="32" class="text-gray-400 mx-auto mb-3" />
      <p class="text-gray-500 font-semibold">No ratings yet. Be the first to rate after your stay!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const getReviewStarClass = (star: number, reviewRating: number): string => {
  if (star <= reviewRating) {
    return 'fill-yellow-400 text-yellow-400'
  }
  return 'text-gray-300 opacity-40'
}

onMounted(() => {
  // Load submitted ratings for this dharamshala from stays
  const key = `dharamshala_stays`
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      const data = JSON.parse(stored)
      const stays = data.stays || []
      
      // Get ratings submitted for this dharamshala
      stays.forEach((stay: any) => {
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
    } catch (e) {
      console.error('Failed to load ratings:', e)
    }
  }
})
</script>

