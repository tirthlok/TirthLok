<template>
  <div class="fixed inset-0 z-[100] bg-white overflow-y-auto flex flex-col">
    <!-- Header -->
    <div class="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
      <button 
        @click="$emit('close')"
        class="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center text-gray-900"
        aria-label="Close photo tour"
      >
        <Icon name="ChevronLeft" :size="24" />
      </button>

      <div class="font-semibold text-lg absolute left-1/2 -translate-x-1/2">
        Photo tour
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="handleShare"
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-900 transition-colors"
          aria-label="Share this tirth"
        >
          <Icon name="Share" :size="20" />
        </button>
        <div class="flex items-center justify-center text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
          <WishlistButton
            :item-id="tirth.id"
            entity-type="tirth"
            variant="icon"
          />
        </div>
      </div>
    </div>

    <!-- Content: Masonry/Grid of all images -->
    <div class="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 pb-24">
       <!-- Simplified masonry grid for Photo Tour -->
       <div class="columns-1 sm:columns-2 gap-4 space-y-4">
         <div v-for="(img, idx) in tirth.images" :key="idx" class="break-inside-avoid">
            <img :src="img" class="w-full rounded-xl object-cover hover:opacity-95 transition-opacity" :alt="`Photo ${idx + 1} of ${tirth.name}`" loading="lazy" />
         </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { Tirth } from '~/types/models'
import { WishlistButton } from '~/features/wishlist'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()
const emit = defineEmits<{ (e: 'close'): void }>()

// Prevent background scrolling while modal is open
onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

const handleShare = async () => {
  const shareData = {
    title: props.tirth.name,
    text: `Explore ${props.tirth.name} — a ${props.tirth.sect} Jain Tirth in ${props.tirth.location.city}, ${props.tirth.location.state}`,
    url: window.location.href,
  }
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch {
      // User cancelled share
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      // Clipboard not available
    }
  }
}
</script>
