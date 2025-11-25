<template>
  <div class="min-h-screen bg-gradient-to-b from-cream to-white py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <div class="mb-4 sm:mb-6">
        <NuxtLink
          to="/tirth"
          class="inline-flex items-center gap-2 text-sage hover:text-opacity-80 font-semibold transition-colors text-sm sm:text-base"
        >
          <Icon name="ArrowLeft" :size="20" />
          Back to Tirth List
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="!tirth" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-sage border-t-charcoal mx-auto mb-4"></div>
          <p>Loading temple data...</p>
        </div>
      </div>

      <!-- Temple Content -->
      <div v-else class="space-y-6 sm:space-y-8">
        <!-- Header -->
        <TirthHeader :tirth="tirth" />

        <!-- Tabs Navigation -->
        <div class="border-b border-gray-200 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
          <div class="flex gap-2 sm:gap-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'pb-3 sm:pb-4 px-1 font-semibold transition-colors border-b-2 whitespace-nowrap text-sm sm:text-base',
                activeTab === tab.id
                  ? 'border-sage text-sage'
                  : 'border-transparent text-light-gray hover:text-charcoal'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="min-h-[300px]">
          <TirthAbout v-show="activeTab === 'about'" :tirth="tirth" />
          <TirthFacilities v-show="activeTab === 'facilities'" :tirth="tirth" />
          <TirthFestivals v-show="activeTab === 'festivals'" :tirth="tirth" />
        </div>

        <!-- Related Tirths -->
        <div v-if="relatedTirths.length > 0" class="border-t pt-6 sm:pt-8 mt-6 sm:mt-8">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-charcoal mb-4 sm:mb-6">Similar Locations</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            <TirthCard
              v-for="relatedTirth in relatedTirths"
              :key="relatedTirth.id"
              :tirth="relatedTirth"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'
import { sampleTirths } from '~/server/utils/sampleData'
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'default',
})

const activeTab = ref('about')
const tirth = ref<Tirth | null>(null)

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'festivals', label: 'Festivals & Events' },
]

const relatedTirths = computed(() => {
  if (!tirth.value) return []
  return (sampleTirths
    .filter((t: any) => t.id !== tirth.value!.id && t.sect === tirth.value!.sect)
    .slice(0, 3) as Tirth[])
})

const loadData = () => {
  try {
    const found = sampleTirths.find((t: any) => t.id === 'ranakpur')
    tirth.value = (found as Tirth) || null
    activeTab.value = 'about'
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>
