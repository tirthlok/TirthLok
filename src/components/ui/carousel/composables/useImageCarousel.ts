/**
 * useImageCarousel Composable
 * Handles image carousel logic for reusable components
 */

import { computed, ref, watch, isRef } from 'vue'
import type { Ref } from 'vue'

export interface UseImageCarouselOptions {
  autoPlay?: boolean
  autoPlayInterval?: number
  allowClick?: boolean
}

/** Normalize any input format to a plain string array */
function toStringArray(images: string[] | string | undefined): string[] {
  if (!images) return []
  if (Array.isArray(images)) {
    return images
      .map((img: any) => {
        if (typeof img === 'string') return img
        if (img && typeof img === 'object') return img.url || img.image_url || ''
        return ''
      })
      .filter(Boolean)
  }
  if (typeof images === 'string' && images) return [images]
  return []
}

export function useImageCarousel(
  images: string[] | string | undefined | Ref<string[] | string | undefined> | (() => string[] | string | undefined),
  _options: UseImageCarouselOptions = {}
) {
  const currentImageIndex = ref(0)

  // Resolve raw value whether images is a plain value, Ref, or getter function
  const getRaw = (): string[] | string | undefined => {
    if (typeof images === 'function') return (images as () => string[] | string | undefined)()
    if (isRef(images)) return images.value
    return images as string[] | string | undefined
  }

  const imagesArr = ref<string[]>(toStringArray(getRaw()))

  // Keep imagesArr reactive when images is a Ref or getter
  if (typeof images === 'function' || isRef(images)) {
    watch(
      () => getRaw(),
      (newVal) => {
        const arr = toStringArray(newVal)
        if (arr.length > 0) {
          imagesArr.value = arr
          // Reset index if it's now out of range
          if (currentImageIndex.value >= arr.length) {
            currentImageIndex.value = 0
          }
        }
      },
      { deep: true }
    )
  }

  // Kept for backward-compat with ImageCarousel.vue — now just re-syncs from source
  // (removed the image-preload filter which was silently dropping valid images)
  const validateImages = async () => {
    const arr = toStringArray(getRaw())
    if (arr.length > 0) {
      imagesArr.value = arr
    }
  }

  // Navigate to next image
  const nextImage = () => {
    if (imagesArr.value.length === 0) return
    currentImageIndex.value = (currentImageIndex.value + 1) % imagesArr.value.length
  }

  // Navigate to previous image
  const prevImage = () => {
    if (imagesArr.value.length === 0) return
    currentImageIndex.value = (currentImageIndex.value - 1 + imagesArr.value.length) % imagesArr.value.length
  }

  // Go to specific image
  const goToImage = (index: number) => {
    if (index >= 0 && index < imagesArr.value.length) {
      currentImageIndex.value = index
    }
  }

  // Get current image
  const currentImage = computed(() => {
    return imagesArr.value[currentImageIndex.value] || ''
  })

  // Check if carousel has multiple images
  const hasMultipleImages = computed(() => imagesArr.value.length > 1)

  // Reset carousel
  const reset = () => {
    currentImageIndex.value = 0
  }

  return {
    currentImageIndex,
    imagesArr,
    currentImage,
    hasMultipleImages,
    nextImage,
    prevImage,
    goToImage,
    reset,
    validateImages,
  }
}
