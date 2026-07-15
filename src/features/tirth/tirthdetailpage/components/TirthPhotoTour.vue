<template>
  <div
    class="fixed inset-0 z-[100] bg-white overflow-y-auto flex flex-col"
    role="dialog"
    aria-modal="true"
    aria-label="Photo tour"
  >
    <!-- Header -->
    <div class="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
      <button
        ref="closeButtonRef"
        @click="$emit('close')"
        class="p-2.5 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center text-gray-900"
        aria-label="Close photo tour"
      >
        <Icon name="ChevronLeft" :size="24" />
      </button>

      <div class="font-semibold text-lg absolute left-1/2 -translate-x-1/2">
        Photo tour
      </div>

      <div class="flex items-center gap-2">
        <div class="relative">
          <button
            @click="handleShare"
            class="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-900 transition-colors"
            aria-label="Share this tirth"
          >
            <Icon name="Share" :size="20" />
          </button>
          <div
            v-if="justCopied"
            class="absolute top-full mt-1 right-0 text-xs font-medium text-white bg-gray-900 px-2 py-1 rounded-md whitespace-nowrap"
          >
            Link copied
          </div>
        </div>
        <div class="w-11 h-11 flex items-center justify-center text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
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
         <div v-for="(img, idx) in normalizedImages" :key="idx" class="break-inside-avoid">
            <img :src="img" class="w-full rounded-xl object-cover hover:opacity-95 transition-opacity" :alt="`Photo ${idx + 1} of ${tirth.name}`" loading="lazy" />
         </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Tirth } from '~/types/models'
import { WishlistButton } from '~/features/wishlist'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const closeButtonRef = ref<HTMLButtonElement | null>(null)
const justCopied = ref(false)

// Same normalization as TirthCard.vue's `cardImages` — entries in
// tirth.images may be a plain string or a {url,…} object, not just strings.
const normalizedImages = computed(() => {
  const imgs = props.tirth.images
  if (!Array.isArray(imgs)) return []
  return imgs
    .map((img: any) => {
      if (typeof img === 'string') return img
      if (img && typeof img === 'object') return img.url || img.image_url || ''
      return ''
    })
    .filter(Boolean)
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

// Prevent background scrolling while modal is open
onMounted(() => {
  document.body.style.overflow = 'hidden'
  closeButtonRef.value?.focus()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})

const handleShare = async () => {
  const shareData = {
    title: props.tirth.name,
    text: `Explore ${props.tirth.name} — a ${props.tirth.sect} Jain Tirth in ${props.tirth.location?.city ?? 'India'}${props.tirth.location?.state ? `, ${props.tirth.location.state}` : ''}`,
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
      justCopied.value = true
      setTimeout(() => { justCopied.value = false }, 2000)
    } catch {
      // Clipboard not available
    }
  }
}
</script>