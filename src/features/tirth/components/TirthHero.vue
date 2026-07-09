<template>
  <section id="section-hero" class="page-container pt-2 sm:pt-4">
    <div class="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm" style="height: 75vh; min-height: 480px; max-height: 720px;">
    <!-- Full bleed image carousel -->
    <ImageCarousel
      :images="tirth.images"
      :title="tirth.name"
      image-height="h-full"
      :show-dots="tirth.images.length > 1"
      :show-title-overlay="false"
      :show-gradient="false"
      accent-dot-color="bg-amber-400"
      class="absolute inset-0 w-full h-full"
    />

    <!-- Multi-layer gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none" />
    <div class="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />

    <!-- Top action bar -->
    <div class="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 z-20">
      <!-- Breadcrumb back button -->
      <NuxtLink
        to="/tirth"
        class="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-black/20 hover:bg-black/40 backdrop-blur-sm px-3 py-2 rounded-xl text-sm font-semibold"
        aria-label="Back to Tirth list"
      >
        <Icon name="ChevronLeft" :size="18" />
        <span class="hidden sm:inline">Tirth</span>
      </NuxtLink>

      <!-- Right actions -->
      <div class="flex items-center gap-2">
        <!-- Share button -->
        <button
          @click="handleShare"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white transition-all hover:scale-110"
          aria-label="Share this tirth"
        >
          <Icon name="Share2" :size="18" />
        </button>
        <!-- Wishlist button -->
        <div class="rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all hover:scale-110">
          <WishlistButton
            :item-id="tirth.id"
            entity-type="tirth"
          />
        </div>
      </div>
    </div>

    <!-- Bottom content -->
    <div class="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 z-20">
      <!-- Tags row -->
      <div v-if="hasTags" class="flex flex-wrap gap-2 mb-3">
        <!-- Sect badge -->
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-sm border"
          :class="tirth.sect === 'Digambar'
            ? 'bg-purple-500/20 border-purple-300/40 text-purple-100'
            : 'bg-amber-500/20 border-amber-300/40 text-amber-100'"
        >
          <Icon name="Star" :size="10" />
          {{ tirth.sect }}
        </span>
        <!-- Tirth tags -->
        <span
          v-for="tag in visibleTags"
          :key="tag"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-sm border border-white/25 text-white/90"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Tirth name -->
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2 drop-shadow-lg">
        {{ tirth.name }}
      </h1>

      <!-- Location -->
      <div class="flex items-center gap-2 text-white/80">
        <Icon name="MapPin" :size="16" class="text-amber-400 flex-shrink-0" />
        <span class="text-sm sm:text-base font-medium">
          {{ tirth.location.city }}, {{ tirth.location.state }}
        </span>
      </div>

      <!-- Image count indicator -->
      <div
        v-if="tirth.images.length > 1"
        class="mt-3 inline-flex items-center gap-1.5 text-xs text-white/60 font-medium"
      >
        <Icon name="Images" :size="14" />
        {{ tirth.images.length }} photos
      </div>
    </div>

    <!-- Scroll cue -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce z-20 hidden sm:flex">
      <Icon name="ChevronDown" :size="22" />
    </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tirth } from '~/types/models'
import { WishlistButton } from '~/features/wishlist'
import ImageCarousel from '~/components/ui/carousel/ImageCarousel.vue'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()

const visibleTags = computed(() => (props.tirth.tirth_tags ?? []).slice(0, 3))
const hasTags = computed(() => props.tirth.tirth_tags && props.tirth.tirth_tags.length > 0)

const handleShare = async () => {
  const shareData = {
    title: props.tirth.name,
    text: `Explore ${props.tirth.name} — a ${props.tirth.sect} Jain Tirth in ${props.tirth.location.city}, ${props.tirth.location.state}`,
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
    } catch {
      // Clipboard not available
    }
  }
}
</script>
