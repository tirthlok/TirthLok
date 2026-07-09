<template>
  <div>

    <!-- ── Loading: full-page skeleton ──────────────────────────────── -->
    <div v-if="loading" class="min-h-screen bg-gray-50">
      <!-- Hero skeleton (animate-pulse applied to elements) -->
      <div class="w-full bg-gray-200 relative overflow-hidden" style="height: 92vh; min-height: 520px; max-height: 860px;">
        <div class="absolute inset-0 bg-gray-300 animate-pulse" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        
        <!-- Top bar skeleton -->
        <div class="absolute top-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex justify-between z-10">
            <div class="w-24 h-10 bg-white/30 backdrop-blur-sm rounded-xl animate-pulse" />
            <div class="flex gap-2">
                <div class="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full animate-pulse" />
                <div class="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full animate-pulse" />
            </div>
        </div>
        
        <!-- Bottom content skeleton -->
        <div class="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 z-10 space-y-4">
             <div class="flex gap-2">
                 <div class="h-6 w-24 bg-white/30 backdrop-blur-sm rounded-full animate-pulse" />
                 <div class="h-6 w-20 bg-white/30 backdrop-blur-sm rounded-full animate-pulse" />
             </div>
             <div class="h-12 sm:h-16 w-3/4 max-w-2xl bg-white/40 backdrop-blur-sm rounded-lg animate-pulse" />
             <div class="flex gap-2 items-center">
                 <div class="w-4 h-4 bg-white/40 rounded-full animate-pulse" />
                 <div class="h-5 w-48 bg-white/40 backdrop-blur-sm rounded-md animate-pulse" />
             </div>
        </div>
      </div>

      <!-- Quick info skeleton -->
      <div class="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 flex overflow-hidden">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div v-for="n in 4" :key="n" class="flex items-center gap-3">
             <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex-shrink-0 animate-pulse" />
             <div class="space-y-1.5 flex-grow">
                 <div class="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                 <div class="h-4 w-24 bg-gray-200 rounded animate-pulse" />
             </div>
          </div>
        </div>
      </div>

      <!-- Section nav skeleton -->
      <div class="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 flex gap-8 py-4 overflow-hidden">
        <div v-for="n in 4" :key="n" class="flex items-center gap-2">
           <div class="w-5 h-5 bg-gray-200 rounded animate-pulse" />
           <div class="h-4 w-20 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>

      <!-- Content skeleton -->
      <div class="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-4xl">
         <!-- About skeleton -->
         <div class="space-y-6 mb-12">
             <div class="flex items-center gap-3">
                 <div class="w-10 h-10 bg-gray-200 rounded-2xl animate-pulse" />
                 <div class="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />
             </div>
             <div class="space-y-3">
                 <div class="h-4 w-full bg-gray-200 rounded animate-pulse" />
                 <div class="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
                 <div class="h-4 w-full bg-gray-200 rounded animate-pulse" />
                 <div class="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                 <div class="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
             </div>
         </div>
      </div>
    </div>

    <!-- ── Error ─────────────────────────────────────────────────────── -->
    <div v-else-if="error" class="flex justify-center items-center min-h-screen py-32 px-4">
      <div class="text-center space-y-6 max-w-md">
        <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
          <Icon name="AlertTriangle" :size="32" class="text-red-500" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 mb-2">Unable to load Tirth</h1>
          <p class="text-gray-500 text-sm">{{ error }}</p>
        </div>
        <NuxtLink
          to="/tirth"
          class="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors"
        >
          <Icon name="ArrowLeft" :size="16" />
          Back to Tirth List
        </NuxtLink>
      </div>
    </div>

    <!-- ── Not Found ─────────────────────────────────────────────────── -->
    <div v-else-if="!tirth" class="flex justify-center items-center min-h-screen py-32 px-4">
      <div class="text-center space-y-6 max-w-md">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
          <Icon name="SearchX" :size="32" class="text-gray-400" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 mb-2">Tirth not found</h1>
          <p class="text-gray-500 text-sm">We couldn't find the temple you're looking for.</p>
        </div>
        <NuxtLink
          to="/tirth"
          class="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors"
        >
          <Icon name="ArrowLeft" :size="16" />
          Browse All Tirths
        </NuxtLink>
      </div>
    </div>

    <!-- ── Main content: delegate entirely to TirthDetailsPage ──────── -->
    <TirthDetailsPage v-else :tirth="tirth" />

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tirth } from '~/types/models'
import TirthDetailsPage from '~/features/tirth/components/TirthDetailsPage.vue'
import Icon from '~/components/ui/Icon.vue'

definePageMeta({
  layout: 'default',
})

const route = useRoute()

const tirthId = computed(() => {
  const id = route.params.id as string
  return id ? decodeURIComponent(id) : ''
})

// Server-side data fetch — the only responsibility of this file
const { data: tirth, pending: loading, error: fetchError } = await useAsyncData(
  () => `tirth-detail-${tirthId.value}`,
  () => {
    if (!tirthId.value) return Promise.resolve(null)
    return $fetch<Tirth>(`/api/tirth/${tirthId.value}`)
  },
  { 
    watch: [tirthId],
    lazy: import.meta.client 
  }
)

const error = computed(() => {
  if (!fetchError.value) return null
  return typeof fetchError.value === 'string'
    ? fetchError.value
    : (fetchError.value as Error).message || 'Failed to load temple data'
})

// SEO meta — page-level concern, belongs here not in TirthDetailsPage
useHead(() => ({
  title: tirth.value ? `${tirth.value.name} — TirthLok` : 'Tirth Details — TirthLok',
  meta: [
    {
      name: 'description',
      content: tirth.value
        ? `Explore ${tirth.value.name}, a ${tirth.value.sect} Jain Tirth in ${tirth.value.location.city}, ${tirth.value.location.state}. View timings, facilities, gallery, and more.`
        : 'Explore Jain pilgrimage sites on TirthLok.',
    },
  ],
}))
</script>
