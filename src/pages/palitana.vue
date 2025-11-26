<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50 via-white to-blue-50 py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- Back Button with Enhanced Styling -->
      <div class="mb-6 sm:mb-8">
        <NuxtLink
          to="/tirth"
          class="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-bold transition-all duration-300 transform hover:scale-105 hover:gap-3"
        >
          <Icon name="ArrowLeft" :size="22" />
          <span class="text-base sm:text-lg">Back to Tirth List</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="!tirth" class="flex justify-center items-center py-32">
        <div class="text-center space-y-6">
          <div class="relative w-16 h-16 mx-auto">
            <div class="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full animate-spin" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0% 50%)" />
            <div class="absolute inset-2 bg-white rounded-full" />
          </div>
          <p class="text-gray-600 font-semibold text-lg">Loading temple data...</p>
        </div>
      </div>

      <!-- Temple Content -->
      <div v-else class="space-y-6 sm:space-y-8">
        <!-- Header -->
        <TirthHeader :tirth="tirth" />

        <!-- Tabs Navigation with Modern Styling -->
        <div class="border-b-2 border-gray-200 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
          <div class="flex gap-2 sm:gap-8 scroll-smooth">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'pb-4 px-1 font-bold transition-all duration-300 border-b-4 whitespace-nowrap text-sm sm:text-base relative group',
                activeTab === tab.id
                  ? 'border-gradient-to-r from-amber-600 to-orange-600 text-amber-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              ]"
            >
              <div class="flex items-center gap-2">
                <component :is="getTabIcon(tab.id)" :size="18" />
                {{ tab.label }}
              </div>
              <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-t-full" />
            </button>
          </div>
        </div>

        <!-- Tab Content with Smooth Transitions -->
        <div class="min-h-[400px] animate-fadeIn">
          <Transition name="fade" mode="out-in">
            <div :key="activeTab">
              <TirthAbout v-if="activeTab === 'about'" :tirth="tirth" />
              <TirthFacilities v-if="activeTab === 'facilities'" :tirth="tirth" />
              <TirthFestivals v-if="activeTab === 'festivals'" :tirth="tirth" />
            </div>
          </Transition>
        </div>

        <!-- Related Tirths Section -->
        <div v-if="relatedTirths.length > 0" class="border-t-2 pt-8 sm:pt-12 mt-8 sm:mt-12">
          <div class="flex items-center gap-3 mb-6 sm:mb-8">
            <Icon name="Compass" :size="32" class="text-blue-600" />
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Explore Similar Locations
            </h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <TirthCard
              v-for="relatedTirth in relatedTirths"
              :key="relatedTirth.id"
              :tirth="relatedTirth"
            />
          </div>
        </div>

        <!-- Back to Top Button -->
        <div class="flex justify-center mt-12 pt-8 border-t">
          <button
            @click="scrollToTop"
            class="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-bold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
          >
            <Icon name="ArrowUp" :size="20" />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'
import { sampleTirths } from '~~/server/utils/sampleData'
import { ref, computed, onMounted } from 'vue'
import { BookOpen, Home, Sparkles } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
})

const activeTab = ref('about')
const tirth = ref<Tirth | null>(null)

const tabs = [
  { id: 'about', label: 'About', icon: 'BookOpen' },
  { id: 'facilities', label: 'Facilities', icon: 'Home' },
  { id: 'festivals', label: 'Festivals & Events', icon: 'Sparkles' },
]

const relatedTirths = computed(() => {
  if (!tirth.value) return []
  return (sampleTirths
    .filter((t: any) => t.id !== tirth.value!.id && t.sect === tirth.value!.sect)
    .slice(0, 3) as Tirth[])
})

const getTabIcon = (tabId: string) => {
  const iconMap: { [key: string]: any } = {
    about: BookOpen,
    facilities: Home,
    festivals: Sparkles,
  }
  return iconMap[tabId] || BookOpen
}

const loadData = () => {
  try {
    const found = sampleTirths.find((t: any) => t.id === 'palitana')
    tirth.value = (found as Tirth) || null
    activeTab.value = 'about'
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
