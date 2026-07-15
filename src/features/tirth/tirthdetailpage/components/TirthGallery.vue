<template>
  <section v-if="images.length > 0" id="section-gallery" class="py-4 sm:py-6">
    <!-- Section header -->
    <div class="flex items-start gap-4 mb-6 sm:mb-8">
      <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md">
        <Icon name="Grid" :size="22" />
      </div>
      <div class="flex-1 min-w-0 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Photo Gallery</h2>
          <p class="text-sm text-gray-500 mt-0.5">{{ images.length }} photos of the temple</p>
          <div class="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-transparent rounded-full mt-1" />
        </div>
        <button
          v-if="images.length > visibleCount"
          @click="showAll = !showAll"
          class="text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1 flex-shrink-0"
        >
          {{ showAll ? 'Show less' : `View all ${images.length}` }}
          <Icon :name="showAll ? 'ChevronUp' : 'ChevronRight'" :size="16" />
        </button>
      </div>
    </div>

    <!-- Masonry grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
      <div
        v-for="(img, idx) in displayImages"
        :key="idx"
        class="relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer group bg-gray-100"
        :class="idx === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-square'"
        @click="openLightbox(idx)"
        :aria-label="`View photo ${idx + 1}`"
        role="button"
        tabindex="0"
        @keydown.enter.prevent="openLightbox(idx)"
      >
        <img
          :src="img"
          :alt="`Photo ${idx + 1}`"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <!-- Hover overlay -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <Icon name="Expand" :size="28" class="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 drop-shadow-lg" />
        </div>
        <!-- "More" overlay on last visible tile -->
        <div
          v-if="!showAll && idx === displayImages.length - 1 && images.length > visibleCount"
          class="absolute inset-0 bg-black/55 flex items-center justify-center"
        >
          <div class="text-center text-white">
            <p class="text-2xl font-black">+{{ images.length - visibleCount }}</p>
            <p class="text-xs font-semibold uppercase tracking-wider mt-1">more</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          @click.self="closeLightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <!-- Close button -->
          <button
            @click="closeLightbox"
            class="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
            aria-label="Close image viewer"
          >
            <Icon name="X" :size="24" />
          </button>

          <!-- Counter -->
          <div class="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
            {{ lightboxIndex + 1 }} / {{ images.length }}
          </div>

          <!-- Prev button -->
          <button
            v-if="lightboxIndex > 0"
            @click="lightboxIndex--"
            class="absolute left-3 sm:left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
            aria-label="Previous image"
          >
            <Icon name="ChevronLeft" :size="24" />
          </button>

          <!-- Image -->
          <img
            :src="images[lightboxIndex]"
            :alt="`Photo ${lightboxIndex + 1}`"
            class="max-w-[90vw] max-h-[85vh] object-contain select-none"
          />

          <!-- Next button -->
          <button
            v-if="lightboxIndex < images.length - 1"
            @click="lightboxIndex++"
            class="absolute right-3 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
            aria-label="Next image"
          >
            <Icon name="ChevronRight" :size="24" />
          </button>

          <!-- Dot strip -->
          <div class="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 overflow-x-auto px-8">
            <button
              v-for="(_, i) in images"
              :key="i"
              @click="lightboxIndex = i"
              class="flex-shrink-0 rounded-full transition-all duration-300"
              :class="i === lightboxIndex ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'"
              :aria-label="`Go to photo ${i + 1}`"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{
  images: string[]
}>()

const showAll = ref(false)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

// Show up to 7 images initially (1 big + 6 small)
const visibleCount = 7

const displayImages = computed(() =>
  showAll.value ? props.images : props.images.slice(0, visibleCount)
)

const openLightbox = (idx: number) => {
  lightboxIndex.value = idx
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft' && lightboxIndex.value > 0) lightboxIndex.value--
  if (e.key === 'ArrowRight' && lightboxIndex.value < props.images.length - 1) lightboxIndex.value++
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
