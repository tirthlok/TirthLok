<template>
  <Transition name="slide-up">
    <div
      v-if="isVisible"
      class="fixed bottom-0 left-0 right-0 z-40 px-4 py-3 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl pb-[calc(12px+env(safe-area-inset-bottom))]"
      role="toolbar"
      aria-label="Quick actions"
    >
      <div class="max-w-lg mx-auto flex items-center justify-between gap-3">
        <!-- Tirth name (small, truncated) -->
        <div class="min-[380px]:block hidden flex-1 min-w-0">
          <p class="text-xs text-gray-400 font-medium truncate">{{ tirth.name }}</p>
          <p class="text-sm text-gray-700 font-semibold truncate">
            {{ tirth.location.city }}, {{ tirth.location.state }}
          </p>
        </div>

        <!-- Action buttons -->
        <div
          class="flex items-center gap-2 flex-shrink-0 w-full min-[380px]:w-auto justify-between min-[380px]:justify-end"
        >
          <!-- Wishlist -->
          <div
            class="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0"
            :title="'Save to Wishlist'"
          >
            <WishlistButton :item-id="tirth.id" entity-type="tirth" />
          </div>

          <!-- Share -->
          <button
            @click="handleShare"
            class="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all hover:scale-105 flex-shrink-0"
            aria-label="Share this tirth"
          >
            <Icon name="Share2" :size="20" />
          </button>

          <!-- Navigate -->
          <a
            :href="mapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-sm hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg hover:scale-105 flex-grow min-[380px]:flex-grow-0 text-center"
            aria-label="Navigate to this tirth"
          >
            <Icon name="Navigation" :size="16" />
            <span>Navigate</span>
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Tirth } from '~/types/models'
import { WishlistButton } from '~/features/wishlist'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()

const isVisible = ref(false)

// Google Maps URL using existing direction field or coordinates/address
const mapsUrl = computed(() => {
  if (props.tirth.direction) return props.tirth.direction
  const { latitude, longitude, address, city, state } = props.tirth.location
  if (latitude && longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  }
  const addr = `${address}, ${city}, ${state}`
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`
})

const handleShare = async () => {
  const shareData = {
    title: props.tirth.name,
    text: `Explore ${props.tirth.name} on TirthLok`,
    url: window.location.href,
  }
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch {
      /* cancelled */
    }
  } else {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      /* no clipboard */
    }
  }
}

onMounted(() => {
  const hero = document.getElementById('section-hero')
  if (!hero) {
    isVisible.value = true
    return
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = !entry.isIntersecting
    },
    { threshold: 0.1 }
  )
  observer.observe(hero)

  onBeforeUnmount(() => observer.disconnect())
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
