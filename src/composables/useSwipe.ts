/**
 * useSwipe
 * Attaches native touch listeners (passive:false) to an element ref and
 * calls onNext / onPrev when a horizontal swipe is detected.
 *
 * Must be called inside setup(); it registers in onMounted / onBeforeUnmount.
 */
import { onMounted, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'

interface SwipeOptions {
  /** Minimum horizontal px movement to trigger a swipe (default 40) */
  threshold?: number
}

export function useSwipe(
  elRef: Ref<HTMLElement | null>,
  onNext: () => void,
  onPrev: () => void,
  options: SwipeOptions = {}
) {
  const threshold = options.threshold ?? 40
  let startX = 0
  let startY = 0

  function handleTouchStart(e: TouchEvent) {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  }

  function handleTouchMove(e: TouchEvent) {
    const dx = e.touches[0].clientX - startX
    const dy = e.touches[0].clientY - startY
    // Only lock scroll when gesture is clearly horizontal
    if (Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault()
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - startX
    const dy = e.changedTouches[0].clientY - startY
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      if (dx < 0) onNext()
      else onPrev()
    }
  }

  onMounted(() => {
    const el = elRef.value
    if (!el) return
    el.addEventListener('touchstart', handleTouchStart, { passive: false })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: false })
  })

  onBeforeUnmount(() => {
    const el = elRef.value
    if (!el) return
    el.removeEventListener('touchstart', handleTouchStart)
    el.removeEventListener('touchmove', handleTouchMove)
    el.removeEventListener('touchend', handleTouchEnd)
  })
}
