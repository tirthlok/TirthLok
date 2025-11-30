<template>
  <div
    :class="[
      'min-h-screen py-4 sm:py-6 md:py-8 px-3 sm:px-4 lg:px-6',
      themeStore?.isDarkMode ? 'dark bg-gray-950' : 'bg-white',
    ]"
  >
    <div class="max-w-full mx-auto">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-gray-900 transition-colors">Home</NuxtLink>
        <Icon name="ChevronRight" :size="14" />
        <NuxtLink :to="routePrefix" class="hover:text-gray-900 transition-colors">
          {{ getBreadcrumbTitle() }}
        </NuxtLink>
      </div>

      <!-- Header -->
      <div class="mb-8">
        <h1
          :class="[
            'text-3xl sm:text-4xl md:text-5xl font-bold mb-2',
            themeStore?.isDarkMode ? 'text-white' : 'text-gray-900',
          ]"
        >
          {{ pageStrings.title }}
        </h1>
        <p
          :class="[
            'text-base md:text-lg',
            themeStore?.isDarkMode ? 'text-gray-300' : 'text-gray-600',
          ]"
        >
          {{ pageStrings.subtitle }}
        </p>
      </div>

      <!-- Sticky Filter Bar - Full Width -->
      <div
        :class="[
          'sticky top-[84px] z-30 backdrop-blur-sm border-b transition-all duration-300 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6',
          themeStore?.isDarkMode ? 'bg-gray-950/95 border-gray-800' : 'bg-white/95 border-gray-100',
        ]"
      >
        <div class="max-w-full mx-auto py-3">
          <div class="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <button
              v-for="filter in filterOptions"
              :key="filter.id"
              @click="emit('update:selectedFilter', filter.id)"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border',
                getFilterButtonClass(filter.id),
              ]"
            >
              <Icon :name="getFilterIcon(filter.id) as any" :size="16" />
              <span>{{ filter.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div :class="[`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent`, `border-${accentColor} border-t-${accentColor}`]">
        </div>
      </div>

      <!-- Error State -->
      <div
        v-if="error"
        :class="[
          'mb-6 p-4 sm:p-6 border-l-4 rounded-lg',
          themeStore?.isDarkMode ? 'bg-red-900/20 border-red-500 text-red-300' : 'bg-red-50 border-red-500 text-red-700',
        ]"
      >
        <p class="text-sm md:text-base font-semibold">Error loading {{ pageType }}</p>
        <p :class="[`text-xs md:text-sm mt-1`, themeStore?.isDarkMode ? 'text-red-400' : 'text-red-600']">{{ error }}</p>
      </div>

      <!-- Cards Grid -->
      <div
        v-if="!loading && displayedItems.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <BaseCard
          v-for="item in displayedItems"
          :key="item.id"
          :item="item"
          :card-type="pageType"
          :show-wishlist="true"
          :show-details="true"
          :route-prefix="routePrefix"
          :tag-fields="getTagFields(item)"
        />
      </div>

      <!-- Empty State -->
      <div
        v-if="!loading && displayedItems.length === 0"
        :class="[
          'text-center py-8 md:py-12',
          themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600',
        ]"
      >
        <Icon
          :name="pageStrings.emptyIcon as any"
          :size="48"
          :class="themeStore?.isDarkMode ? 'text-gray-500' : 'text-gray-400'"
          class="mx-auto mb-4"
        />
        <h3
          :class="[
            'text-lg sm:text-xl md:text-2xl font-semibold mb-2',
            themeStore?.isDarkMode ? 'text-gray-200' : 'text-gray-900',
          ]"
        >
          {{ pageStrings.emptyTitle }}
        </h3>
        <p class="text-sm md:text-base mb-6">Try adjusting your search or filter criteria</p>
      </div>

      <!-- Results Info -->
      <div
        v-if="!loading && displayedItems.length > 0"
        :class="[
          'mt-8 text-center text-sm',
          themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-600',
        ]"
      >
        Showing {{ displayedItems.length }} of {{ filteredItems.length }} locations
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from '~/components/common/Icon.vue'
import BaseCard from '~/components/shared/cards/BaseCard.vue'
import type { Tirth, Dharamshala, Bhojanshala } from '~/types/models'
import { useListingPage } from '~/composables/ui/useListingPage'
import { useFavoritesStore } from '~/stores/favorites'

type ItemType = Tirth | Dharamshala | Bhojanshala

interface Props {
  items: ItemType[]
  store: {
    loading: boolean
    error: string | null
    getFiltered: () => ItemType[]
  }
  pageType: 'tirth' | 'dharamshala' | 'bhojanshala'
  routePrefix: string
  accentColor: string
  getTagFields?: (item: ItemType) => string[]
  selectedFilter?: string
}

const props = withDefaults(defineProps<Props>(), {
  accentColor: 'red-500',
  selectedFilter: 'all',
  getTagFields: (item: any) => {
    if (item.sect || item.type) {
      return [item.sect, item.type].filter(Boolean)
    }
    if (item.amenities) {
      return Array.isArray(item.amenities) ? item.amenities : []
    }
    if (item.cuisines || item.cuisineTypes) {
      return Array.isArray(item.cuisines || item.cuisineTypes) ? (item.cuisines || item.cuisineTypes) : []
    }
    return []
  },
})

const emit = defineEmits<{
  'update:selectedFilter': [value: string]
}>()

const { loading, error, filterOptions, displayedItems: allItems, getFilterIcon, getPageStrings, getBreadcrumbTitle, themeStore, filteredItems } = useListingPage({
  store: props.store,
  pageType: props.pageType,
  routePrefix: props.routePrefix,
  accentColor: props.accentColor,
})

const pageStrings = computed(() => getPageStrings())
const localSelectedFilter = ref(props.selectedFilter || 'all')
const favoritesStore = useFavoritesStore()

watch(() => props.selectedFilter, (newVal) => {
  if (newVal) {
    localSelectedFilter.value = newVal
  }
})

// Apply filtering based on selected filter
const displayedItems = computed(() => {
  if (localSelectedFilter.value === 'all') {
    return allItems.value
  }
  
  if (localSelectedFilter.value === 'wishlist') {
    return allItems.value.filter((item: any) => favoritesStore.isFavorite(item.id))
  }
  
  return allItems.value
})

const getFilterButtonClass = (filterId: string) => {
  const isDarkMode = themeStore && themeStore.isDarkMode ? themeStore.isDarkMode : false
  
  const accentMap: Record<string, { active: string; inactive: string }> = {
    'red-500': {
      active: 'bg-red-500 text-white border-red-500 shadow-md',
      inactive: isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500 hover:bg-gray-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
    },
    'blue-500': {
      active: 'bg-blue-500 text-white border-blue-500 shadow-md',
      inactive: isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500 hover:bg-gray-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
    },
    'green-500': {
      active: 'bg-green-500 text-white border-green-500 shadow-md',
      inactive: isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500 hover:bg-gray-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50',
    },
  }

  const colorScheme = accentMap[props.accentColor] || accentMap['red-500']

  return localSelectedFilter.value === filterId ? colorScheme.active : colorScheme.inactive
}

const getTagFields = (item: ItemType) => props.getTagFields(item)
</script>
