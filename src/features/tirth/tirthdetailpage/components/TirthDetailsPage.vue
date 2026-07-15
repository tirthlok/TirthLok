<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 1. Hero -->
    <TirthHero :tirth="tirth" />

    <!-- 2. Quick Info Strip -->
    <div class="bg-white border-b border-gray-100 shadow-sm">
      <TirthQuickInfo :tirth="tirth" />
    </div>

    <!-- 3. Sticky Section Nav — only shows clips that exist in the DOM -->
    <TirthSectionNav :sections="navSections" />

    <!-- 4. Page body -->
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6">
      
      <!-- Responsive Layout Grid: 2-column on desktop, stacked on mobile/tablet -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Main Column (Takes 8/12 of horizontal space on desktop) -->
        <div class="lg:col-span-8 space-y-8">
          <!-- About Section -->
          <TirthAbout :tirth="tirth" />
          
          <!-- Facilities — hides itself when empty -->
          <template v-if="hasFacilities">
            <div class="border-t border-gray-100 pt-6" />
            <TirthFacilities :tirth="tirth" />
          </template>

          <!-- Nearby Attractions -->
          <div class="border-t border-gray-100 pt-6" />
          <TirthNearbyAttractions :tirth="tirth" />

          <!-- Events — hides itself when empty -->
          <template v-if="hasEvents">
            <div class="border-t border-gray-100 pt-6" />
            <TirthEvents :tirth="tirth" />
          </template>

          <!-- Dharamshala — hides itself when no linked records found -->
          <template v-if="hasDharamshala">
            <div class="border-t border-gray-100 pt-6" />
            <TirthDharamshala :tirth-id="tirth.id" @loaded="onDharamshalaLoaded" />
          </template>
          <div v-else class="hidden">
            <TirthDharamshala :tirth-id="tirth.id" @loaded="onDharamshalaLoaded" />
          </div>

          <!-- Bhojanshala — hides itself when no linked records found -->
          <template v-if="hasBhojanshala">
            <div class="border-t border-gray-100 pt-6" />
            <TirthBhojanshala :tirth-id="tirth.id" @loaded="onBhojanshalaLoaded" />
          </template>
          <div v-else class="hidden">
            <TirthBhojanshala :tirth-id="tirth.id" @loaded="onBhojanshalaLoaded" />
          </div>
        </div>

        <!-- Right Sidebar Column (Takes 4/12 of horizontal space, sticky on desktop) -->
        <div class="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
          <!-- Temple Timings widget -->
          <TirthTimings :tirth="tirth" />

          <!-- Visitor Guidelines & Important Info -->
          <TirthImportantInfo :tirth="tirth" />
        </div>

      </div>

      <!-- Unified Contact & Reach Section (Full Width below the grid) -->
      <div class="border-t border-gray-100 mt-8 pt-8" />
      <section id="section-contact-reach" class="py-4 sm:py-6 space-y-8">
        <!-- Header -->
        <div class="flex items-start gap-4 mb-4">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Icon name="MapPin" :size="20" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Contact & Reach</h2>
            <p class="text-sm text-gray-500 mt-0.5">Directions, transport hubs, and official hotlines</p>
            <div class="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-transparent rounded-full mt-1" />
          </div>
        </div>

        <!-- Contacts Grid -->
        <TirthContact :tirth="tirth" />

        <!-- Address Card & OSM Map embed -->
        <TirthLocation :tirth="tirth" />

        <!-- Transport connectivity details -->
        <TirthHowToReach :tirth="tirth" />
      </section>

      <!-- Related Tirths -->
      <div v-if="relatedTirths.length > 0" class="border-t border-gray-100 mt-8 pt-8" />
      <section v-if="relatedTirths.length > 0" id="section-related" class="py-4 sm:py-6">
        <div class="flex items-center justify-between mb-6 sm:mb-8">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md flex-shrink-0"
            >
              <Icon name="Compass" :size="20" />
            </div>
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Similar Tirths</h2>
              <p class="text-sm text-gray-500">More {{ tirth.sect }} pilgrimage sites</p>
            </div>
          </div>
          <NuxtLink
            to="/tirth"
            class="text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1"
          >
            View all
            <Icon name="ChevronRight" :size="16" />
          </NuxtLink>
        </div>

        <div
          class="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory scroll-smooth"
        >
          <div
            v-for="related in relatedTirths"
            :key="related.id"
            class="flex-shrink-0 w-[260px] sm:w-[280px] snap-start"
          >
            <TirthCard :tirth="related" />
          </div>
        </div>
      </section>

      <!-- Footer spacing for sticky bar -->
      <div class="h-24 md:h-20" aria-hidden="true" />
    </div>

    <!-- Sticky bottom action bar -->
    <TirthStickyBar :tirth="tirth" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Tirth } from '~/types/models'
import { useTirthStore } from '~/features/tirth/shared/composables/useTirthStore'
import TirthCard from '~/features/tirth/shared/components/TirthCard.vue'
import TirthHero from './TirthHero.vue'
import TirthQuickInfo from './TirthQuickInfo.vue'
import TirthSectionNav from './TirthSectionNav.vue'
import TirthAbout from './TirthAbout.vue'
import TirthTimings from './TirthTimings.vue'
import TirthFacilities from './TirthFacilities.vue'
import TirthHowToReach from './TirthHowToReach.vue'
import TirthNearbyAttractions from './TirthNearbyAttractions.vue'
import TirthImportantInfo from './TirthImportantInfo.vue'
import TirthLocation from './TirthLocation.vue'
import TirthContact from './TirthContact.vue'
import TirthEvents from './TirthEvents.vue'
import TirthDharamshala from './TirthDharamshala.vue'
import TirthBhojanshala from './TirthBhojanshala.vue'
import TirthStickyBar from './TirthStickyBar.vue'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{
  tirth: Tirth
 }>()

const tirthStore = useTirthStore()

// Track whether related sections have data (set by child components after fetch)
const hasDharamshala = ref(false)
const hasBhojanshala = ref(false)

const onDharamshalaLoaded = (count: number) => {
  hasDharamshala.value = count > 0
}
const onBhojanshalaLoaded = (count: number) => {
  hasBhojanshala.value = count > 0
}

// Derived flags
const hasEvents = computed(() => !!(props.tirth.events && props.tirth.events.length > 0))
const hasFacilities = computed(() => !!(props.tirth.facilities && props.tirth.facilities.length > 0))

// Navigation clips matching the redesigned information architecture
const navSections = computed(() => {
  const sections = [
    { id: 'about', label: 'About', icon: 'BookOpen' },
    { id: 'timings', label: 'Timings', icon: 'Clock' },
    ...(hasFacilities.value ? [{ id: 'facilities', label: 'Facilities', icon: 'Home' }] : []),
    { id: 'contact-reach', label: 'Contact & Reach', icon: 'MapPin' },
    { id: 'attractions', label: 'Attractions', icon: 'Compass' },
    ...(hasEvents.value ? [{ id: 'events', label: 'Events', icon: 'Calendar' }] : []),
    ...(hasDharamshala.value ? [{ id: 'dharamshala', label: 'Dharamshala', icon: 'Building2' }] : []),
    ...(hasBhojanshala.value ? [{ id: 'bhojanshala', label: 'Bhojanshala', icon: 'UtensilsCrossed' }] : []),
  ]
  return sections
})

// Same-sect related tirths (uses existing store data — no extra API call)
const relatedTirths = computed(() =>
  tirthStore.tirths
    .filter((t: Tirth) => t.id !== props.tirth.id && t.sect === props.tirth.sect)
    .slice(0, 3)
)
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
