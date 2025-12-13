<template>
    <router-view v-if="hasId" />
    <div v-else :class="[
      'min-h-screen py-4 sm:py-8 md:py-12',
      themeStore?.isDarkMode ? 'dark bg-gray-950' : 'bg-white'
    ]">
      <div class="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
       <div class="flex items-center gap-2 text-sm text-gray-500">
          <NuxtLink to="/" class="hover:text-gray-900 transition-colors">Home</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <NuxtLink to="/tirth" class="hover:text-gray-900 transition-colors">Tirth</NuxtLink>
       </div>
      <!-- <div class="mb-8">
        <h1 :class="[
          'text-3xl sm:text-4xl md:text-5xl font-bold mb-2',
          themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
        ]">All Tirth Locations</h1>
        <p :class="[
          'text-base md:text-lg',
          themeStore?.isDarkMode ? 'text-gray-300' : 'text-gray-600'
        ]">Explore sacred Jain pilgrimage sites</p>
      </div> -->

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-if="error && !loading" :class="[
        'mb-6 p-4 sm:p-6 border-l-4 rounded-lg',
        themeStore?.isDarkMode 
          ? 'bg-red-900/20 border-red-500 text-red-300' 
          : 'bg-red-50 border-red-500 text-red-700'
      ]">
        <p class="text-sm md:text-base font-semibold">Error loading tirths</p>
        <p :class="[
          'text-xs md:text-sm mt-1',
          themeStore?.isDarkMode ? 'text-red-400' : 'text-red-600'
        ]">{{ error }}</p>
      </div>

      <!-- Dynamic Grouped Horizontal Scroll Sections -->
      <div v-if="!loading && groupedTirths.length > 0" class="space-y-12 mb-4">
        <div
          v-for="(group, index) in groupedTirths"
          :key="`${group.grouping}-${index}`"
          class="scroll-section"
        >
          <TirthCardsHorizontalScroll
            :tirths="group.tirths"
            :loading="loading"
            :grouping="group.grouping"
            :title="group.displayTitle"
            :subtitle="`${group.count} ${group.count === 1 ? 'location' : 'locations'}`"
            show-badges
            show-wishlist
            :show-details="true"
            variant="default"
            image-height="200px"
            :view-all-link="`/tirth?grouping=${encodeURIComponent(group.grouping)}`"
            :max-cards="6"
          />
        </div>
      </div>

      <!-- All Tirth Grid Section -->
      <div v-if="!loading && allTirths.length > 0" class="mt-4">
        <div class="mb-8">
          <h2 :class="[
            'text-2xl md:text-3xl font-bold mb-2',
            themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
          ]">All Tirth Locations</h2>
          <p :class="[
            'text-base',
            themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
          ]">
            Browse all {{ allTirths.length }} sacred pilgrimage sites
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max" style="grid-auto-rows: 1fr;">
          <BaseCard
              v-for="tirth in allTirths"
              :key="tirth.id"
              :item="tirth"
              card-type="tirth"
              :show-details="true"
              :show-wishlist="true"
              :image-height="'200px'"
              :variant="'default'"
              :tag-fields="[tirth.sect, tirth.type]"
            />
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && allTirths.length === 0" class="text-center py-12">
        <Icon name="MapPin" :size="48" class="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
        <h3 :class="[
          'text-lg sm:text-xl md:text-2xl font-semibold mb-2',
          themeStore?.isDarkMode ? 'text-white' : 'text-gray-900'
        ]">No Tirths Available</h3>
        <p :class="[
          'text-sm md:text-base',
          themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600'
        ]">Try refreshing the page or check back soon.</p>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useThemeStore } from '~/stores/theme'
import { useTirthStore } from '~/stores/tirth'
import { useGrouping } from '~/composables/ui/useGrouping'
import { TirthCardsHorizontalScroll, BaseCard, Icon } from '~/components/shared'
import type { Tirth } from '~/types/models'

definePageMeta({
  layout: 'default'
})

const themeStore = useThemeStore()
const tirthStore = useTirthStore()
const { groupTirthsByGrouping } = useGrouping()
const route = useRoute()

const hasId = computed(() => !!(route?.params?.id))

// Fetch all tirths (full dataset for grouping)
const { data: tirthData, pending: loading, error: fetchError } = await useAsyncData(
  'all-tirths-for-grouping',
  () => $fetch<{ success: boolean; data: Tirth[] }>('/api/tirth', {
    query: { limit: 1000 } // Fetch all for grouping logic
  })
)

const allTirths = computed(() => (tirthData.value?.data || []) as Tirth[])
console.log('Fetched tirths for grouping:', allTirths.value) 

// Dynamically compute grouped tirths
const groupedTirths = computed(() => {
  return groupTirthsByGrouping(allTirths.value)
})

const error = computed(() => {
  if (!fetchError.value) return null
  return typeof fetchError.value === 'string' 
    ? fetchError.value 
    : fetchError.value?.message || 'Error loading data'
})

// Sync to store for other components
watch(allTirths, (newTirths) => {
  if (newTirths.length > 0) {
    tirthStore.tirths = newTirths
  }
}, { deep: true, immediate: true })

onMounted(async () => {
  await tirthStore.fetchFilterOptions()
})
</script>

<style scoped>
.scroll-section {
  scroll-margin-top: 4rem;
}
</style>
