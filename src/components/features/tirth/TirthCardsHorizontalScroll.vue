<template>
  <div class="w-full">
    <!-- Header - Shows when data exists or loading -->
    <div v-if="tirths.length > 0 || loading" class="flex items-center justify-between my-4">
      <div>
        <h2 v-if="title" class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-900">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ subtitle }}
        </p>
      </div>
      <NuxtLink
        v-if="viewAllLink && !loading"
        :to="viewAllLink"
        class="text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition"
      >
        Explore All →
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="px-4 md:px-6 py-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
    </div>

    <!-- Empty State - No data after loading -->
    <div v-else-if="!loading && tirths.length === 0" class="px-4 md:px-6 py-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">
        {{ emptyStateMessage }}
      </p>
    </div>

    <!-- Filter Empty State - Data exists but filters eliminated all -->
    <div v-else-if="!loading && tirths.length > 0 && displayedTirths.length === 0" class="px-4 md:px-6 py-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">
        No tirths match your filters
      </p>
    </div>

    <!-- Cards Grid -->
    <div
      v-else
      class="py-4 overflow-x-auto scrollbar-hide"
      :style="{ scrollBehavior: 'smooth' }"
    >
      <div class="flex gap-4 pb-4 min-w-min">
        <div
          v-for="(tirth, index) in displayedTirths"
          :key="`${tirth.id}-${index}`"
          class="flex-shrink-0 w-72"
        >
          <div class="relative">
            <BaseCard
              :item="tirth"
              card-type="tirth"
              :show-details="variant === 'featured' ? false : showDetails"
              :show-wishlist="showWishlist"
              :image-height="imageHeight"
              :variant="variant"
              :tag-fields="variant === 'featured' ? [] :[tirth.sect, tirth.type]"
            />
            <!-- Badge -->
            <div v-if="showBadges && tirth.tirth_tags && tirth.tirth_tags.length > 0" class="absolute -top-3 -right-3 z-10">
              <span
                class="inline-block bg-gradient-to-r from-accent to-pink-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/20"
              >
                ✨ {{ tirth.tirth_tags[0] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tirth } from '~/types/models'

interface Props {
  tirths: Tirth[]
  loading?: boolean
  grouping?: string
  tagFilter?: string[]
  requireTags?: boolean
  maxCards?: number
  title?: string
  subtitle?: string
  showBadges?: boolean
  showWishlist?: boolean
  variant?: 'default' | 'featured'
  imageHeight?: string
  viewAllLink?: string
  tagFields?: string[]
  emptyStateMessage?: string
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  grouping: '',
  tagFilter: () => [],
  requireTags: false,
  maxCards: 6,
  title: '',
  subtitle: '',
  showBadges: true,
  showWishlist: true,
  variant: 'default',
  imageHeight: 'h-72',
  viewAllLink: '',
  tagFields: () => ['tirth_tags'],
  emptyStateMessage: 'No tirths found matching your filters.',
})

const displayedTirths = computed(() => {
  let filtered = [...props.tirths]

  // Filter to only show cards with tirth_tags if required
  if (props.requireTags) {
    filtered = filtered.filter(
      tirth =>
        tirth.tirth_tags &&
        Array.isArray(tirth.tirth_tags) &&
        tirth.tirth_tags.length > 0
    )
  }

  // Filter by grouping if provided
  if (props.grouping) {
    filtered = filtered.filter(
      tirth =>
        tirth.tirth_grouping &&
        (Array.isArray(tirth.tirth_grouping)
          ? tirth.tirth_grouping.includes(props.grouping)
          : tirth.tirth_grouping === props.grouping)
    )
  }

  // Filter by tags if provided
  if (props.tagFilter && props.tagFilter.length > 0) {
    filtered = filtered.filter(tirth => {
      if (!tirth.tirth_tags || !Array.isArray(tirth.tirth_tags)) return false
      return props.tagFilter.some(tag => tirth.tirth_tags?.includes(tag))
    })
  }

  // Limit to maxCards
  return filtered.slice(0, props.maxCards)
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
