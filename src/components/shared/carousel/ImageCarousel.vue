<template>
  <div class="relative w-full overflow-hidden bg-gray-200" :style="{ height: imageHeight }">
    <!-- Image Display -->
    <img
      :src="currentImage"
      :alt="title || 'Image'"
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />

    <!-- Gradient Overlay -->
    <div v-if="showGradient" class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

    <!-- Navigation Arrows -->
    <div v-if="hasMultipleImages" class="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        @click.stop="prevImage"
        class="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors hover:shadow-xl transform hover:scale-110"
        :aria-label="`Previous image`"
      >
        <Icon name="ChevronLeft" :size="24" class="text-gray-900" />
      </button>
      <button
        @click.stop="nextImage"
        class="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors hover:shadow-xl transform hover:scale-110"
        :aria-label="`Next image`"
      >
        <Icon name="ChevronRight" :size="24" class="text-gray-900" />
      </button>
    </div>

    <!-- Image Indicator Dots -->
    <div v-if="hasMultipleImages && showDots" class="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
      <button
        v-for="(_, index) in imagesArr"
        :key="index"
        @click.stop="goToImage(index)"
        :class="[
          'transition-all duration-300',
          index === currentImageIndex ? `w-8 h-2 rounded-full ${accentDotColor}` : 'w-2 h-2 bg-white/60 rounded-full hover:bg-white/80',
        ]"
        :aria-label="`Go to image ${index + 1}`"
      />
    </div>

    <!-- Title Overlay (Optional) -->
    <div v-if="title && showTitleOverlay" class="absolute bottom-0 left-0 right-0 p-4 text-white">
      <h3 class="text-lg font-bold line-clamp-2">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-200 mt-1 line-clamp-1">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useImageCarousel } from './composables/useImageCarousel'
import Icon from '~/components/common/Icon.vue'

interface Props {
  images?: string[] | string
  title?: string
  subtitle?: string
  imageHeight?: string
  accentDotColor?: string
  showGradient?: boolean
  showDots?: boolean
  showTitleOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  images: undefined,
  title: undefined,
  subtitle: undefined,
  imageHeight: 'h-64',
  accentDotColor: 'bg-red-400',
  showGradient: true,
  showDots: true,
  showTitleOverlay: true,
})

const { currentImageIndex, imagesArr, currentImage, hasMultipleImages, nextImage, prevImage, goToImage } =
  useImageCarousel(props.images)
</script>
