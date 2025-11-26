/**
 * useImageCarousel Composable
 * Handles image carousel logic for reusable components
 */

import { computed, ref } from 'vue'

export interface UseImageCarouselOptions {
  autoPlay?: boolean
  autoPlayInterval?: number
  allowClick?: boolean
}

export function useImageCarousel(
  images: string[] | string | undefined,
  _options: UseImageCarouselOptions = {}
) {
  const currentImageIndex = ref(0)

  // Normalize images to array
  const imagesArr = computed(() => {
    if (!images) return [] as string[]
    return Array.isArray(images) ? images : [images]
  })

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
    return imagesArr.value[currentImageIndex.value] || 'https://via.placeholder.com/400x320'
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
  }
}
