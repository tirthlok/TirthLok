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
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- About -->
      <TirthAbout :tirth="tirth" />

      <!-- Events — hides itself when tirth.events is empty -->
      <div v-if="hasEvents" class="border-t border-gray-100" />
      <TirthEvents :tirth="tirth" />

      <!-- Dharamshala — hides itself when no linked records found -->
      <div v-if="hasDharamshala" class="border-t border-gray-100" />
      <TirthDharamshala :tirth-id="tirth.id" @loaded="onDharamshalaLoaded" />

      <!-- Bhojanshala — hides itself when no linked records found -->
      <div v-if="hasBhojanshala" class="border-t border-gray-100" />
      <TirthBhojanshala :tirth-id="tirth.id" @loaded="onBhojanshalaLoaded" />

      <!-- Related Tirths -->
      <div v-if="relatedTirths.length > 0" class="border-t border-gray-100" />
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
      <div class="hidden lg:block h-20" aria-hidden="true" />
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

// Navigation clips — only the four required sections (About, Events, Dharamshala, Bhojanshala)
// Gallery and Location are intentionally removed per spec.
// TirthSectionNav's visibleSections computed already filters out sections
// whose DOM element does not exist, so hidden sections never appear as tabs.
const navSections = computed(() => {
  const sections = [
    { id: 'about', label: 'About', icon: 'BookOpen' },
    ...(hasEvents.value ? [{ id: 'events', label: 'Events', icon: 'Calendar' }] : []),
    ...(hasDharamshala.value
      ? [{ id: 'dharamshala', label: 'Dharamshala', icon: 'Building2' }]
      : []),
    ...(hasBhojanshala.value
      ? [{ id: 'bhojanshala', label: 'Bhojanshala', icon: 'UtensilsCrossed' }]
      : []),
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
/* ── Airbnb-style card grid matching main Tirth page ── */
.tirth-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

/* Responsive breakpoint tweaks */
@media (max-width: 479px) {
  .tirth-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 359px) {
  .tirth-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
