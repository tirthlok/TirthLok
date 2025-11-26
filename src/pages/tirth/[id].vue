<template>
  <div id="top" class="min-h-screen bg-gradient-to-b from-amber-50 via-white to-blue-50 py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- Back Button -->
      <div class="mb-6 sm:mb-8">
        <NuxtLink
          to="/tirth"
          class="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-bold transition-all"
        >
          <Icon name="ArrowLeft" :size="22" />
          <span class="text-base sm:text-lg">Back to Tirth List</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-32">
        <div class="text-center space-y-6">
          <div class="relative w-16 h-16 mx-auto">
            <div class="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full animate-spin" style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 0% 50%)" />
            <div class="absolute inset-2 bg-white rounded-full" />
          </div>
          <p class="text-gray-600 font-semibold text-lg">Loading temple data...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex justify-center items-center py-32">
        <div class="text-center space-y-6 max-w-md">
          <Icon name="AlertTriangle" :size="48" class="text-red-500 mx-auto" />
          <p class="text-red-600 font-semibold text-lg">{{ error }}</p>
          <NuxtLink to="/tirth" class="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700">
            Return to List
          </NuxtLink>
        </div>
      </div>

      <!-- Temple Content -->
      <div v-else-if="tirth" class="space-y-6 sm:space-y-8">
        <!-- Header -->
        <HeaderWithImage
          :title="tirth.name"
          :subtitle="`${tirth.location.city}, ${tirth.location.state}`"
          :images="tirth.images"
          :metadata="{
            location: `${tirth.location.city}, ${tirth.location.state}`,
            rating: tirth.rating ? `${tirth.rating} (${tirth.reviews || 0} reviews)` : undefined,
            type: tirth.type,
          }"
          :accent-dot-color="'bg-amber-400'"
          :show-back-button="false"
        />

        <!-- Tabs Navigation -->
        <div class="border-b-2 border-gray-200 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
          <div class="flex gap-2 sm:gap-8 scroll-smooth">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'pb-4 px-1 font-bold transition-all duration-300 border-b-4 whitespace-nowrap text-sm sm:text-base',
                activeTab === tab.id
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="min-h-[400px]">
          <Transition name="fade" mode="out-in">
            <div :key="activeTab">
              <TirthAbout v-if="activeTab === 'about'" :tirth="tirth" />
              <TirthFacilities v-if="activeTab === 'facilities'" :tirth="tirth" />
              <TirthFestivals v-if="activeTab === 'festivals'" :tirth="tirth" />
            </div>
          </Transition>
        </div>

        <!-- Related Tirths -->
        <div v-if="relatedTirths.length > 0" class="border-t-2 pt-8 sm:pt-12 mt-8 sm:mt-12">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Explore Similar Locations
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <BaseCard
              v-for="relatedTirth in relatedTirths"
              :key="relatedTirth.id"
              :item="relatedTirth"
              card-type="tirth"
              :show-wishlist="true"
              :show-details="true"
              route-prefix="/tirth"
              :tag-fields="[relatedTirth.sect, relatedTirth.type]"
            />
          </div>
        </div>

        <!-- Back to Top -->
        <div class="flex justify-center pt-8 border-t">
          <a
            href="#top"
            class="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-bold hover:from-amber-700 hover:to-orange-700 transition-all"
          >
            <Icon name="ArrowUp" :size="20" />
            <span>Back to Top</span>
          </a>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="flex justify-center items-center py-32">
        <div class="text-center space-y-6 max-w-md">
          <p class="text-gray-600 font-semibold text-lg">Temple not found</p>
          <NuxtLink to="/tirth" class="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700">
            Return to List
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'
import { ref, computed, onMounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useTirthStore } from '~/stores/tirth'
import { BaseCard, HeaderWithImage } from '~/components/shared'
import TirthAbout from '~/components/tirth/TirthAbout.vue'
import TirthFacilities from '~/components/tirth/TirthFacilities.vue'
import TirthFestivals from '~/components/tirth/TirthFestivals.vue'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const tirthStore = useTirthStore()

const activeTab = ref('about')
const tirth = ref<Tirth | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'festivals', label: 'Festivals & Events' },
]

const relatedTirths = computed(() => {
  if (!tirth.value) return []
  return tirthStore.tirths
    .filter((t: Tirth) => t.id !== tirth.value!.id && t.sect === tirth.value!.sect)
    .slice(0, 3)
})

// Back-to-top behavior handled by global `scroll.client.ts` plugin and anchor link

const loadData = async (idParam?: string) => {
  try {
    loading.value = true
    error.value = null
    const id = (idParam ?? route.params.id) as string

    // Fetch data if not in store
    if (tirthStore.tirths.length === 0) {
      await tirthStore.fetchTirths()
    }

    const found = tirthStore.getTirthById(id)
    if (found) {
      tirth.value = found
      activeTab.value = 'about'
    } else {
      error.value = `Temple with ID "${id}" not found`
    }
  } catch (err) {
    error.value = 'Failed to load temple data'
    console.error('Error loading tirth:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// React to route param updates when the same component instance is reused
onBeforeRouteUpdate((to) => {
  const nextId = to.params.id as string
  loadData(nextId)
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
</style>
