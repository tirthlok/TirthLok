<template>
  <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl border-2 border-blue-200">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <Icon name="Star" :size="28" class="text-blue-500 fill-blue-500" />
          Guest Reviews
        </h2>
        <p class="text-gray-600">{{ ratingCount }} {{ ratingCount === 1 ? 'guest' : 'guests' }} have rated this dharamshala</p>
      </div>

      <!-- Overall Stats -->
      <div class="text-center">
        <div class="text-5xl font-bold text-blue-600">{{ averageRating }}</div>
        <div class="flex gap-1 justify-center mt-2">
          <Icon
            v-for="i in 5"
            :key="i"
            name="Star"
            :size="20"
            :class="i <= Math.round(averageRating) ? 'text-blue-500 fill-blue-500' : 'text-gray-300'"
          />
        </div>
        <p class="text-sm text-gray-600 mt-2">out of 5</p>
        
        <!-- Add Rating Button -->
        <button 
          @click="$emit('open-rating')"
          class="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 text-sm"
        >
          + Add Rating
        </button>
      </div>
    </div>

    <!-- Category Breakdown -->
    <div v-if="ratingCount > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Cleanliness -->
      <div class="bg-white p-4 rounded-xl border-2 border-blue-100">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="Sparkles" :size="20" class="text-blue-600" />
          <span class="font-semibold text-gray-700">Cleanliness</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold text-blue-600">{{ averageCleanliness }}</span>
          <span class="text-sm text-gray-600">/5</span>
        </div>
        <div class="flex gap-1 mt-2">
          <Icon
            v-for="i in 5"
            :key="i"
            name="Star"
            :size="16"
            :class="i <= Math.round(averageCleanliness) ? 'text-blue-500 fill-blue-500' : 'text-gray-300'"
          />
        </div>
      </div>

      <!-- Comfort -->
      <div class="bg-white p-4 rounded-xl border-2 border-green-100">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="Armchair" :size="20" class="text-green-600" />
          <span class="font-semibold text-gray-700">Comfort</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold text-green-600">{{ averageComfort }}</span>
          <span class="text-sm text-gray-600">/5</span>
        </div>
        <div class="flex gap-1 mt-2">
          <Icon
            v-for="i in 5"
            :key="i"
            name="Star"
            :size="16"
            :class="i <= Math.round(averageComfort) ? 'text-green-500 fill-green-500' : 'text-gray-300'"
          />
        </div>
      </div>

      <!-- Hospitality -->
      <div class="bg-white p-4 rounded-xl border-2 border-red-100">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="Heart" :size="20" class="text-red-600" />
          <span class="font-semibold text-gray-700">Hospitality</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold text-red-600">{{ averageHospitality }}</span>
          <span class="text-sm text-gray-600">/5</span>
        </div>
        <div class="flex gap-1 mt-2">
          <Icon
            v-for="i in 5"
            :key="i"
            name="Star"
            :size="16"
            :class="i <= Math.round(averageHospitality) ? 'text-red-500 fill-red-500' : 'text-gray-300'"
          />
        </div>
      </div>

      <!-- Value -->
      <div class="bg-white p-4 rounded-xl border-2 border-purple-100">
        <div class="flex items-center gap-2 mb-2">
          <Icon name="IndianRupee" :size="20" class="text-purple-600" />
          <span class="font-semibold text-gray-700">Value for Money</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold text-purple-600">{{ averageValue }}</span>
          <span class="text-sm text-gray-600">/5</span>
        </div>
        <div class="flex gap-1 mt-2">
          <Icon
            v-for="i in 5"
            :key="i"
            name="Star"
            :size="16"
            :class="i <= Math.round(averageValue) ? 'text-purple-500 fill-purple-500' : 'text-gray-300'"
          />
        </div>
      </div>
    </div>

    <!-- No Ratings Message -->
    <div v-else class="bg-white p-8 rounded-xl border-2 border-gray-200 text-center">
      <Icon name="MessageSquare" :size="48" class="text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 font-semibold">No ratings yet</p>
      <p class="text-sm text-gray-500 mt-1">Be the first to review your stay!</p>
    </div>

    <!-- Recent Reviews -->
    <div v-if="ratingCount > 0" class="mt-8">
      <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Icon name="MessageCircle" :size="24" class="text-cyan-600" />
        Latest Reviews
      </h3>

      <div class="space-y-4">
        <div
          v-for="rating in sortedRatings.slice(0, 3)"
          :key="rating.id"
          class="bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-blue-300 transition-colors"
        >
          <!-- Reviewer Info -->
          <div class="flex items-center justify-between mb-3">
            <div>
              <h4 class="font-bold text-gray-900">{{ rating.guestName }}</h4>
              <p class="text-sm text-gray-600">{{ formatDate(rating.visitDate) }}</p>
            </div>
            <div class="flex gap-1">
              <Icon
                v-for="i in 5"
                :key="i"
                name="Star"
                :size="18"
                :class="i <= rating.overallRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'"
              />
            </div>
          </div>

          <!-- Comment -->
          <p v-if="rating.comment" class="text-gray-700 leading-relaxed">
            {{ rating.comment }}
          </p>

          <!-- Category Tags -->
          <div v-if="hasDetailedRatings(rating)" class="mt-4 flex flex-wrap gap-2">
            <span v-if="rating.cleanliness > 0" class="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
              Cleanliness: {{ rating.cleanliness }}/5
            </span>
            <span v-if="rating.comfort > 0" class="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
              Comfort: {{ rating.comfort }}/5
            </span>
            <span v-if="rating.hospitality > 0" class="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
              Hospitality: {{ rating.hospitality }}/5
            </span>
            <span v-if="rating.value > 0" class="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
              Value: {{ rating.value }}/5
            </span>
          </div>
        </div>
      </div>

      <!-- View All Reviews Button -->
      <div v-if="ratingCount > 3" class="mt-6 text-center">
        <button
          @click="showAllReviews = !showAllReviews"
          class="px-6 py-2 rounded-lg font-semibold text-blue-600 bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 transition-colors"
        >
          {{ showAllReviews ? 'Show Less' : `View All ${ratingCount} Reviews` }}
        </button>
      </div>

      <!-- All Reviews (Expandable) -->
      <div v-if="showAllReviews && ratingCount > 3" class="mt-6 space-y-4">
        <div
          v-for="rating in sortedRatings.slice(3)"
          :key="rating.id"
          class="bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-blue-300 transition-colors"
        >
          <div class="flex items-center justify-between mb-3">
            <div>
              <h4 class="font-bold text-gray-900">{{ rating.guestName }}</h4>
              <p class="text-sm text-gray-600">{{ formatDate(rating.visitDate) }}</p>
            </div>
            <div class="flex gap-1">
              <Icon
                v-for="i in 5"
                :key="i"
                name="Star"
                :size="18"
                :class="i <= rating.overallRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'"
              />
            </div>
          </div>

          <p v-if="rating.comment" class="text-gray-700 leading-relaxed">
            {{ rating.comment }}
          </p>

          <div v-if="hasDetailedRatings(rating)" class="mt-4 flex flex-wrap gap-2">
            <span v-if="rating.cleanliness > 0" class="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
              Cleanliness: {{ rating.cleanliness }}/5
            </span>
            <span v-if="rating.comfort > 0" class="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
              Comfort: {{ rating.comfort }}/5
            </span>
            <span v-if="rating.hospitality > 0" class="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
              Hospitality: {{ rating.hospitality }}/5
            </span>
            <span v-if="rating.value > 0" class="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
              Value: {{ rating.value }}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Rating } from '~/types/models'
import Icon from '~/components/common/Icon.vue'

interface Props {
  ratings: Rating[]
}

const props = withDefaults(defineProps<Props>(), {
  ratings: () => [],
})

const showAllReviews = ref(false)

const ratingCount = computed(() => props.ratings.length)

const averageRating = computed(() => {
  if (ratingCount.value === 0) return 0
  const total = props.ratings.reduce((sum, r) => sum + r.overallRating, 0)
  return Math.round((total / ratingCount.value) * 10) / 10
})

const averageCleanliness = computed(() => {
  if (ratingCount.value === 0) return 0
  const total = props.ratings.reduce((sum, r) => sum + r.cleanliness, 0)
  return Math.round((total / ratingCount.value) * 10) / 10
})

const averageComfort = computed(() => {
  if (ratingCount.value === 0) return 0
  const total = props.ratings.reduce((sum, r) => sum + r.comfort, 0)
  return Math.round((total / ratingCount.value) * 10) / 10
})

const averageHospitality = computed(() => {
  if (ratingCount.value === 0) return 0
  const total = props.ratings.reduce((sum, r) => sum + r.hospitality, 0)
  return Math.round((total / ratingCount.value) * 10) / 10
})

const averageValue = computed(() => {
  if (ratingCount.value === 0) return 0
  const total = props.ratings.reduce((sum, r) => sum + r.value, 0)
  return Math.round((total / ratingCount.value) * 10) / 10
})

const sortedRatings = computed(() => {
  return [...props.ratings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

const hasDetailedRatings = (rating: Rating): boolean => {
  return rating.cleanliness > 0 || rating.comfort > 0 || rating.hospitality > 0 || rating.value > 0
}
</script>
