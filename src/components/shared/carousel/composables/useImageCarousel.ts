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

  // Normalize images to array (and filter broken images on client)
  const _initialImages = Array.isArray(images) ? images.slice() : images ? [images] : []
  const imagesArr = ref<string[]>(_initialImages)

  // Preload images on client and filter out broken ones
  const preloadImage = (url: string, timeout = 5000) => {
    return new Promise<boolean>((resolve) => {
      if (typeof window === 'undefined') return resolve(false)
      const img = new Image()
      let done = false
      const t = setTimeout(() => {
        if (done) return
        done = true
        img.src = ''
        resolve(false)
      }, timeout)
      img.onload = () => {
        if (done) return
        done = true
        clearTimeout(t)
        resolve(true)
      }
      img.onerror = () => {
        if (done) return
        done = true
        clearTimeout(t)
        resolve(false)
      }
      img.src = url
    })
  }

  // Validate and filter images when called (lazy validation)
  const validateImages = async () => {
    if (_initialImages.length === 0) {
      imagesArr.value = []
      return
    }
    const validated: string[] = []
    await Promise.all(
      _initialImages.map(async (u) => {
        try {
          const ok = await preloadImage(u)
          if (ok) validated.push(u)
        } catch (e) {
          // ignore
        }
      })
    )
    imagesArr.value = validated
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
