<template>
  <div>

    <!-- ── Loading: full-page skeleton ──────────────────────────────── -->
    <div v-if="loading" class="min-h-screen bg-gray-50 animate-pulse">
      <!-- Hero skeleton -->
      <div class="w-full bg-gray-200" style="height: 92vh; min-height: 520px; max-height: 860px;" />
      <!-- Quick info skeleton -->
      <div class="px-4 sm:px-6 lg:px-8 py-4 flex gap-3">
        <div v-for="n in 4" :key="n" class="h-14 w-32 bg-gray-200 rounded-2xl" />
      </div>
      <!-- Section nav skeleton -->
      <div class="border-b border-gray-100 px-4 sm:px-6 lg:px-8 flex gap-6 py-3">
        <div v-for="n in 5" :key="n" class="h-5 w-20 bg-gray-200 rounded" />
      </div>
      <!-- Content skeleton -->
      <div class="px-4 sm:px-6 lg:px-8 py-10 space-y-4 max-w-4xl">
        <div class="h-8 w-48 bg-gray-200 rounded" />
        <div class="h-4 w-full bg-gray-200 rounded" />
        <div class="h-4 w-5/6 bg-gray-200 rounded" />
        <div class="h-4 w-4/6 bg-gray-200 rounded" />
        <div class="h-4 w-full bg-gray-200 rounded mt-4" />
        <div class="h-4 w-3/4 bg-gray-200 rounded" />
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
  { watch: [tirthId] }
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
