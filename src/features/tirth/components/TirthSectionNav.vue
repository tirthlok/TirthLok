<template>
  <div
    ref="navRef"
    :class="[
      'z-30 transition-all duration-300',
      isSticky
        ? 'fixed top-0 left-0 right-0 shadow-md bg-white/95 backdrop-blur-md border-b border-gray-100'
        : 'relative bg-white border-b border-gray-100',
    ]"
  >
    <div class="page-container">
      <div class="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0">
        <button
          v-for="section in visibleSections"
          :key="section.id"
          @click="scrollToSection(section.id)"
          class="relative flex items-center gap-1.5 px-3 sm:px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 focus:outline-none group"
          :class="[
            activeSection === section.id
              ? 'text-amber-700'
              : 'text-gray-500 hover:text-gray-900',
          ]"
          :aria-current="activeSection === section.id ? 'true' : undefined"
        >
          <Icon :name="section.icon as any" :size="15" class="flex-shrink-0" />
          {{ section.label }}
          <!-- Active indicator -->
          <span
            class="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full transition-all duration-300"
            :class="activeSection === section.id ? 'bg-amber-600' : 'bg-transparent group-hover:bg-gray-200'"
          />
        </button>
      </div>
    </div>
  </div>
  <!-- Placeholder to prevent layout jump when sticky -->
  <div v-if="isSticky" class="h-[49px]" aria-hidden="true" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue'
import Icon from '~/components/ui/Icon.vue'

interface NavSection {
  id: string
  label: string
  icon: string
  required?: boolean
}

const props = defineProps<{
  sections: NavSection[]
}>()

const navRef = ref<HTMLElement | null>(null)
const isSticky = ref(false)
const activeSection = ref<string>('')

// Use the sections provided by the parent directly
const visibleSections = computed(() => props.sections)

// Sticky behavior
let stickyObserver: IntersectionObserver | null = null
let sectionObserver: IntersectionObserver | null = null

const scrollToSection = (id: string) => {
  const el = document.getElementById(`section-${id}`)
  if (!el) return
  const offset = 56 // nav height
  const top = el.getBoundingClientRect().top + window.scrollY - offset - 12
  window.scrollTo({ top, behavior: 'smooth' })
}

const initSectionObserver = () => {
  if (sectionObserver) {
    sectionObserver.disconnect()
  }
  
  // Track active section
  const sectionEls = props.sections
    .map((s) => document.getElementById(`section-${s.id}`))
    .filter(Boolean) as HTMLElement[]

  if (sectionEls.length) {
    sectionObserver = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting entry
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (intersecting.length) {
          const id = intersecting[0].target.id.replace('section-', '')
          activeSection.value = id
        }
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0,
      }
    )
    sectionEls.forEach((el) => sectionObserver!.observe(el))
  }
}

watch(
  () => props.sections,
  async () => {
    await nextTick()
    initSectionObserver()
  },
  { deep: true }
)

onMounted(() => {
  // Detect when navbar should become sticky
  const sentinel = document.getElementById('section-hero')
  if (sentinel) {
    stickyObserver = new IntersectionObserver(
      ([entry]) => {
        isSticky.value = !entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    stickyObserver.observe(sentinel)
  }

  initSectionObserver()

  // Default to first section
  if (props.sections.length) {
    activeSection.value = props.sections[0].id
  }
})

onBeforeUnmount(() => {
  stickyObserver?.disconnect()
  sectionObserver?.disconnect()
})
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
