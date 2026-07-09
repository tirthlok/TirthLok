<template>
  <section id="section-location" class="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- Section header -->
    <div class="flex items-center gap-3 mb-6 sm:mb-8">
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
        <Icon name="MapPin" :size="20" />
      </div>
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Location</h2>
        <p class="text-sm text-gray-500">{{ tirth.location.city }}, {{ tirth.location.state }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
      <!-- Map embed (takes 3/5 on desktop) -->
      <div
        class="lg:col-span-3 rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative bg-gray-100"
        style="height: 280px; min-height: 220px;"
      >
        <ClientOnly>
          <iframe
            v-if="mapSrc"
            :src="mapSrc"
            class="w-full h-full border-0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Location map"
            aria-label="Map showing location of temple"
            allowfullscreen
          />
          <template #fallback>
            <div class="w-full h-full flex items-center justify-center">
              <div class="text-center text-gray-400">
                <Icon name="Map" :size="40" class="mx-auto mb-2" />
                <p class="text-sm font-medium">Loading map…</p>
              </div>
            </div>
          </template>
        </ClientOnly>
        <!-- Fallback when no coordinates -->
        <div v-if="!mapSrc" class="w-full h-full flex flex-col items-center justify-center gap-3">
          <Icon name="Map" :size="44" class="text-gray-300" />
          <p class="text-sm text-gray-400 font-medium text-center px-4">
            {{ tirth.location.city }}, {{ tirth.location.state }}
          </p>
        </div>
      </div>

      <!-- Address card (takes 2/5 on desktop) -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <!-- Address -->
        <div class="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm flex-1">
          <p class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Address</p>
          <p class="text-gray-800 font-medium text-base leading-relaxed mb-1">
            {{ tirth.location.address || `${tirth.location.city}, ${tirth.location.state}` }}
          </p>
          <p class="text-gray-500 text-sm">
            {{ tirth.location.city }}, {{ tirth.location.state }}
            <span v-if="tirth.location.zipCode"> — {{ tirth.location.zipCode }}</span>
          </p>

          <!-- Copy address button -->
          <button
            @click="copyAddress"
            class="mt-4 flex items-center gap-2 text-sm font-semibold transition-all duration-200"
            :class="copied ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'"
            :aria-label="copied ? 'Address copied' : 'Copy address'"
          >
            <Icon :name="copied ? 'CheckCircle' : 'Copy'" :size="16" />
            {{ copied ? 'Copied!' : 'Copy address' }}
          </button>
        </div>

        <!-- Get Directions CTA -->
        <a
          :href="mapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-base hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
          :aria-label="`Open ${tirth.name} in Google Maps`"
        >
          <Icon name="Navigation" :size="20" class="group-hover:rotate-12 transition-transform duration-300" />
          Open in Google Maps
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Tirth } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()

const copied = ref(false)

// OpenStreetMap embed iframe src (no API key needed)
const mapSrc = computed(() => {
  const { latitude, longitude, city, state } = props.tirth.location
  if (latitude && longitude) {
    const bbox = {
      west: longitude - 0.02,
      south: latitude - 0.01,
      east: longitude + 0.02,
      north: latitude + 0.01,
    }
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.west},${bbox.south},${bbox.east},${bbox.north}&layer=mapnik&marker=${latitude},${longitude}`
  }
  return null
})

// Google Maps URL using existing direction field or coordinates/address
const mapsUrl = computed(() => {
  if (props.tirth.direction) return props.tirth.direction
  const { latitude, longitude, address, city, state } = props.tirth.location
  if (latitude && longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  }
  const addr = `${address || city}, ${city}, ${state}`
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`
})

// Copy address to clipboard
const copyAddress = async () => {
  const { address, city, state, zipCode } = props.tirth.location
  const text = [address, city, state, zipCode].filter(Boolean).join(', ')
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Clipboard API not available
  }
}
</script>
