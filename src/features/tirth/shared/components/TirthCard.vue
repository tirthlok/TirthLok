<template>
  <!-- Airbnb-style borderless card — no border, no shadow, no background -->
  <div class="tirth-card" @click="handleCardClick($event)">

    <!-- ── Image Container ── -->
    <div
      ref="imageWrap"
      class="tirth-card__image-wrap"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <!-- Image with crossfade transition -->
      <transition name="tc-fade" mode="out-in">
        <img
          :key="currentIndex"
          :src="cardImages[currentIndex] || placeholder"
          :alt="tirth.name"
          loading="lazy"
          class="tirth-card__image"
          :class="{ 'tirth-card__image--hovered': isHovered }"
          @error="onImageError"
        />
      </transition>

      <!-- Prev / Next arrows — only when multiple images and hovered -->
      <template v-if="cardImages.length > 1 && isHovered">
        <button
          class="tirth-card__nav tirth-card__nav--prev"
          data-no-nav="true"
          type="button"
          aria-label="Previous image"
          @click.stop="prevCardImage"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="tirth-card__nav-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          class="tirth-card__nav tirth-card__nav--next"
          data-no-nav="true"
          type="button"
          aria-label="Next image"
          @click.stop="nextCardImage"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="tirth-card__nav-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </template>

      <!-- Dot indicators -->
      <div v-if="cardImages.length > 1" class="tirth-card__dots">
        <button
          v-for="(_, i) in cardImages"
          :key="i"
          class="tirth-card__dot"
          :class="{ 'tirth-card__dot--active': i === currentIndex }"
          data-no-nav="true"
          type="button"
          :aria-label="`Image ${i + 1}`"
          @click.stop="currentIndex = i"
        />
      </div>

      <!-- Tag Badge — top-left (uses existing tirth_tags logic) -->
      <div
        v-if="badgeLabel"
        class="tirth-card__badge"
      >
        {{ badgeLabel }}
      </div>

      <!-- Wishlist Heart — top-right -->
      <button
        class="tirth-card__heart"
        :class="{ 'tirth-card__heart--saved': isSaved }"
        :aria-label="isSaved ? 'Remove from wishlist' : 'Add to wishlist'"
        data-no-nav="true"
        @click.stop="toggleWishlist"
        type="button"
      >
        <svg
          v-if="isSaved"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="tirth-card__heart-icon"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="tirth-card__heart-icon"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>
    </div>

    <!-- ── Text Block below image ── -->
    <div class="tirth-card__info">
      <!-- Line 1: Tirth Name -->
      <p class="tirth-card__name">{{ tirth.name }}</p>
      <!-- Line 2: City, State -->
      <p class="tirth-card__location">{{ tirth.location?.city }}, {{ tirth.location?.state }}</p>
      <!-- Line 3: Kshetra type -->
      <p v-if="tirth.tirth_type || tirth.category || tirth.type" class="tirth-card__kshetra">
        {{ (tirth.tirth_type || tirth.category || tirth.type || '').replace(/-/g, ' ') }}
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '~/features/wishlist'
import { useAuth } from '~/features/auth/composables/useAuth'
import type { Tirth } from '~/types/models'
import placeholderImg from '~/assets/images/jain-temple-placeholder.png'
import { useSwipe } from '~/composables/useSwipe'

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  tirth: Tirth
}
const props = defineProps<Props>()

// ── Router / Wishlist ──────────────────────────────────────────────────────
const router = useRouter()
const wishlistStore = useWishlistStore()
const { isAuthenticated } = useAuth()

// ── Image handling ─────────────────────────────────────────────────────────
const imageError = ref(false)
const currentIndex = ref(0)

// Normalize images to an array of URL strings
const cardImages = computed(() => {
  if (imageError.value) return []
  const imgs = props.tirth.images
  if (Array.isArray(imgs) && imgs.length > 0) {
    // Each element might be a plain string or a {url,…} object
    return imgs.map((img: any) => {
      if (typeof img === 'string') return img
      if (img && typeof img === 'object') return img.url || img.image_url || ''
      return ''
    }).filter(Boolean)
  }
  if (typeof imgs === 'string' && imgs) return [imgs]
  return []
})

const placeholder = placeholderImg

const onImageError = () => {
  // Remove broken image from rotation rather than hiding all images
  const imgs = cardImages.value
  if (imgs.length > 1) {
    // skip to next valid image
    currentIndex.value = (currentIndex.value + 1) % imgs.length
  } else {
    imageError.value = true
  }
}

const nextCardImage = () => {
  const len = cardImages.value.length
  if (len < 2) return
  currentIndex.value = (currentIndex.value + 1) % len
}

const prevCardImage = () => {
  const len = cardImages.value.length
  if (len < 2) return
  currentIndex.value = (currentIndex.value - 1 + len) % len
}

// ── Hover state ────────────────────────────────────────────────────────────
const isHovered = ref(false)

// ── Swipe support (mobile / tablet) ────────────────────────────────────────
const imageWrap = ref<HTMLElement | null>(null)
useSwipe(imageWrap, nextCardImage, prevCardImage)

// ── Badge: uses existing tirth_tags logic ─────────────────────────────────
// Shows first tag from tirth_tags (existing system) — per user instruction
const badgeLabel = computed(() => {
  const tags = props.tirth.tirth_tags
  if (Array.isArray(tags) && tags.length > 0) return tags[0]
  // Fallback to tirth_grouping if no tags
  const grouping = props.tirth.tirth_grouping
  if (typeof grouping === 'string' && grouping) return grouping
  if (Array.isArray(grouping) && grouping.length > 0) return grouping[0]
  return null
})

// ── Wishlist ───────────────────────────────────────────────────────────────
const isSaved = computed(() => wishlistStore.isInWishlist(props.tirth.id))

const toggleWishlist = async () => {
  if (!isAuthenticated.value) {
    router.push('/auth/login')
    return
  }
  if (isSaved.value) {
    await wishlistStore.removeFromWishlist(props.tirth.id)
  } else {
    await wishlistStore.addToWishlist(props.tirth.id, 'tirth')
  }
}

// ── Navigation ─────────────────────────────────────────────────────────────
const navigateToDetail = () => {
  router.push(`/tirth/${encodeURIComponent(props.tirth.name)}`)
}

const handleCardClick = (event: MouseEvent) => {
  try {
    const path = (event.composedPath && event.composedPath()) || (event as any).path || []
    const clickedInteractive = path.some((node: any) => {
      if (!node || !node.tagName) return false
      const tag = String(node.tagName).toUpperCase()
      if (tag === 'BUTTON' || tag === 'A') return true
      if (node.dataset && node.dataset.noNav === 'true') return true
      if (node.getAttribute && node.getAttribute('role') === 'button') return true
      return false
    })
    if (!clickedInteractive) navigateToDetail()
  } catch {
    const target = event.target as HTMLElement
    if (!target.closest?.('button') && !target.closest?.('a')) navigateToDetail()
  }
}
</script>

<style scoped>
/* ── Card Container — Airbnb: no border, no shadow, no bg ── */
.tirth-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Image Wrapper ─────────────────────────────────────── */
.tirth-card__image-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
  background: #F0EDE8;
  touch-action: pan-y; /* allow vertical scroll; JS handles horizontal swipe */
}

/* ── Image with scale-on-hover ─────────────────────────── */
.tirth-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
  position: absolute;
  inset: 0;
}

.tirth-card__image--hovered {
  transform: scale(1.04);
}

/* ── Carousel nav arrows ────────────────────────────────── */
.tirth-card__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 15;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.88);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  transition: background 0.15s ease, transform 0.15s ease;
  animation: tcFadeIn 0.15s ease;
}

.tirth-card__nav:hover {
  background: rgba(255,255,255,1);
  transform: translateY(-50%) scale(1.1);
}

.tirth-card__nav--prev { left: 8px; }
.tirth-card__nav--next { right: 8px; }

.tirth-card__nav-icon {
  width: 14px;
  height: 14px;
  color: #1A1A18;
}

/* ── Dot indicators ─────────────────────────────────────── */
.tirth-card__dots {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 4px;
  z-index: 15;
  pointer-events: none;
}

.tirth-card__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  background: rgba(255,255,255,0.55);
  transition: all 0.2s ease;
  pointer-events: auto;
}

.tirth-card__dot--active {
  background: #ffffff;
  width: 18px;
  border-radius: 3px;
}

/* ── Badge — top-left, uses existing tags ──────────────── */
.tirth-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  /* Semi-transparent with backdrop blur — section-tinted */
  background: rgba(232, 86, 42, 0.88);
  color: #ffffff;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  letter-spacing: 0.01em;
  max-width: calc(100% - 60px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
}

/* ── Wishlist Heart — top-right ──────────────────────────── */
.tirth-card__heart {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
  transition: transform 0.15s ease;
  z-index: 10;
}

.tirth-card__heart:hover {
  transform: scale(1.15);
}

.tirth-card__heart:active {
  transform: scale(0.92);
}

.tirth-card__heart-icon {
  width: 22px;
  height: 22px;
  /* Outline heart: white with subtle drop-shadow for visibility on images */
  color: #ffffff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
  transition: color 0.2s ease, filter 0.2s ease;
}

/* Saved (filled) heart — saffron */
.tirth-card__heart--saved .tirth-card__heart-icon {
  color: #E8562A;
  filter: drop-shadow(0 1px 3px rgba(232, 86, 42, 0.45));
}

/* ── Text Block ─────────────────────────────────────────── */
.tirth-card__info {
  padding: 8px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.4;
}

/* Line 1: tirth_name */
.tirth-card__name {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A18;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Line 2: city, state */
.tirth-card__location {
  font-size: 13px;
  color: #6B6B65;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Line 3: tirth_kshetra */
.tirth-card__kshetra {
  font-size: 13px;
  color: #6B6B65;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Dark Mode Support ──────────────────────────────────── */
:global(.dark) .tirth-card__name {
  color: #F5F4F0;
}

:global(.dark) .tirth-card__location,
:global(.dark) .tirth-card__kshetra {
  color: #9C9B96;
}

:global(.dark) .tirth-card__image-wrap {
  background: #2A2825;
}

/* ── Crossfade transition for image swap ────────────────── */
.tc-fade-enter-active,
.tc-fade-leave-active {
  transition: opacity 0.25s ease;
  position: absolute;
  inset: 0;
}

.tc-fade-enter-from,
.tc-fade-leave-to {
  opacity: 0;
}

/* ── Arrow fade-in keyframe ─────────────────────────────── */
@keyframes tcFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>
