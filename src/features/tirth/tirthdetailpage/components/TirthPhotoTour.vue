<template>
  <div
    class="fixed inset-0 z-[100] bg-white overflow-y-auto flex flex-col animate-fade-in"
    role="dialog"
    aria-modal="true"
    aria-label="Photo tour"
  >
    <!-- Header -->
    <div class="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100/60 px-4 sm:px-6 py-3 flex items-center justify-between">
      <button
        ref="closeButtonRef"
        @click="$emit('close')"
        class="p-2.5 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center text-gray-900"
        aria-label="Close photo tour"
      >
        <Icon name="ChevronLeft" :size="24" />
      </button>

      <div class="font-bold text-gray-900 text-lg absolute left-1/2 -translate-x-1/2 tracking-tight">
        Photo Tour
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
            class="absolute top-full mt-1 right-0 text-xs font-medium text-white bg-gray-900 px-2 py-1 rounded-md whitespace-nowrap shadow-md"
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

    <!-- Content: Masonry Grid of all images -->
    <div class="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 pb-24">
       <div class="columns-1 sm:columns-2 gap-4 space-y-4">
         <div 
           v-for="(img, idx) in normalizedImages" 
           :key="idx" 
           class="break-inside-avoid relative group rounded-2xl overflow-hidden border border-gray-150/40 bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-md"
         >
            <!-- Gray placeholder skeleton -->
            <div 
              v-if="!loadedImages[idx]" 
              class="w-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse h-48 sm:h-64 flex items-center justify-center"
            >
              <Icon name="Grid" :size="28" class="text-gray-300 animate-pulse" />
            </div>
            
            <img 
              :src="img" 
              @load="loadedImages[idx] = true"
              :class="[
                'w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]',
                loadedImages[idx] ? 'opacity-100 scale-100 block' : 'opacity-0 scale-95 hidden'
              ]" 
              :alt="`Photo ${idx + 1} of ${tirth.name}`" 
              loading="lazy" 
            />
            
            <!-- Soft hover overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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
const loadedImages = ref<Record<number, boolean>>({})

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
      // User cancelled
    }
  } else {
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

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>