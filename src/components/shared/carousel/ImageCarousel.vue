<template>
  <div
    ref="root"
    class="relative w-full overflow-hidden bg-gray-200 group"
    :class="imageHeightClass"
    :style="imageHeightStyle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Image Display: show validated image when available, otherwise a placeholder -->
    <img
      :src="currentImage || placeholder"
      :alt="title || 'Image'"
      loading="lazy"
      class="w-full h-full object-cover transition-transform duration-500"
      :class="isHovered ? 'scale-110' : ''"
    />

    <!-- Gradient Overlay -->
    <div v-if="showGradient" class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>

    <!-- Navigation Arrows (always visible) -->
    <div v-if="hasMultipleImages" class="absolute inset-0 flex items-center justify-between px-3 opacity-90 z-30">
      <button
        @click.stop.prevent="prevImage"
        @mouseenter="() => (arrowHoverState = 'prev')"
        @mouseleave="() => (arrowHoverState = null)"
        :aria-label="`Previous image`"
        type="button"
        class="p-2 bg-white/20 hover:bg-white/40 rounded-full shadow-lg hover:shadow-xl transition-all pointer-events-auto"
      >
        <Icon name="ChevronLeft" :size="24" class="text-gray-900" />
      </button>

      <button
        @click.stop.prevent="nextImage"
        @mouseenter="() => (arrowHoverState = 'next')"
        @mouseleave="() => (arrowHoverState = null)"
        :aria-label="`Next image`"
        type="button"
        class="p-2 bg-white/20 hover:bg-white/40 rounded-full shadow-lg hover:shadow-xl transition-all pointer-events-auto"
      >
        <Icon name="ChevronRight" :size="24" class="text-gray-900" />
      </button>
    </div>

    <!-- Image Indicator Dots -->
    <div v-if="hasMultipleImages && showDots" class="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-auto">
      <button
        v-for="(_, index) in imagesArr"
        :key="index"
        @click.stop.prevent="goToImage(index)"
        :class="[
          'transition-all duration-300 focus:outline-none',
          index === currentImageIndex ? `w-8 h-2 rounded-full ${accentDotColor}` : 'w-2 h-2 bg-white/60 rounded-full hover:bg-white/80',
        ]"
        :aria-label="`Go to image ${index + 1}`"
        role="button"
        type="button"
        data-no-nav="true"
      >
        <span class="sr-only">Go to image {{ index + 1 }}</span>
      </button>
    </div>

    <!-- Title Overlay (Optional) -->
    <div v-if="title && showTitleOverlay" :class="titleOverlayClass">
      <h3 class="text-lg font-bold line-clamp-2">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-200 mt-1 line-clamp-1">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useImageCarousel } from './composables/useImageCarousel'
import Icon from '~/components/common/Icon.vue'
// Placeholder image when there are no valid images
import placeholderImg from '~/assets/images/jain-temple-placeholder.png'

interface Props {
  images?: string[] | string
  title?: string
  subtitle?: string
  imageHeight?: string
  accentDotColor?: string
  showGradient?: boolean
  showDots?: boolean
  showTitleOverlay?: boolean
  titleOverlayClass?: string
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
  titleOverlayClass: 'absolute bottom-0 left-0 right-0 p-4 text-white',
})

const {
  currentImageIndex,
  imagesArr,
  currentImage,
  hasMultipleImages,
  nextImage,
  prevImage,
  goToImage,
  validateImages,
} = useImageCarousel(props.images)

// local hover state to control arrow visibility and image scale
const isHovered = ref(false)
const arrowHoverState = ref<'prev' | 'next' | null>(null)

const placeholder = placeholderImg


// Observe when the carousel enters the viewport and validate images lazily
const root = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null
onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    // Fallback: validate immediately
    validateImages()
    return
  }
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          validateImages()
          if (io && root.value) io.unobserve(root.value)
        }
      }
    },
    { root: null, threshold: 0.1 }
  )
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => {
  if (io && root.value) io.unobserve(root.value)
  io = null
})

// (placeholder variable already defined above)

// Support passing either a Tailwind height class (e.g. 'h-72') or a CSS height value (e.g. '300px' or '18rem')
const imageHeightClass = computed(() => {
  if (!props.imageHeight) return ''
  return props.imageHeight.startsWith('h-') ? props.imageHeight : ''
})

const imageHeightStyle = computed(() => {
  if (!props.imageHeight) return {}
  return props.imageHeight.startsWith('h-') ? {} : { height: props.imageHeight }
})
</script>
