<template>
  <section id="section-hero" class="pt-4 sm:pt-6 mb-8">
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <!-- Top Action Bar -->
      <div class="flex items-center justify-between mb-4">
        <!-- Breadcrumb back button -->
        <NuxtLink
          to="/tirth"
          class="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors px-2 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100"
          aria-label="Back to Tirth list"
        >
          <Icon name="ChevronLeft" :size="20" />
          <span class="hidden sm:inline">Back</span>
        </NuxtLink>

        <!-- Right actions -->
        <div class="flex items-center gap-2">
          <!-- Share button -->
          <button
            @click="handleShare"
            class="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors text-sm font-semibold underline decoration-transparent hover:decoration-gray-900"
            aria-label="Share this tirth"
          >
            <Icon name="Share" :size="16" />
            <span class="underline">Share</span>
          </button>
          <!-- Wishlist button -->
          <WishlistButton
            :item-id="tirth.id"
            entity-type="tirth"
            variant="text"
          />
        </div>
      </div>

      <!-- Image Grid -->
      <div class="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100">
        <!-- If 5 or more images -->
        <div v-if="tirth.images.length >= 5" class="grid grid-cols-4 grid-rows-2 gap-2 h-[40vh] sm:h-[50vh] lg:h-[60vh] min-h-[300px]">
          <div class="col-span-2 row-span-2 relative group cursor-pointer" @click="showPhotoTour = true">
            <img :src="tirth.images[0]" class="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="" />
          </div>
          <div class="relative group cursor-pointer" @click="showPhotoTour = true">
            <img :src="tirth.images[1]" class="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="" />
          </div>
          <div class="relative group cursor-pointer" @click="showPhotoTour = true">
            <img :src="tirth.images[2]" class="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="" />
          </div>
          <div class="relative group cursor-pointer" @click="showPhotoTour = true">
            <img :src="tirth.images[3]" class="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="" />
          </div>
          <div class="relative group cursor-pointer" @click="showPhotoTour = true">
            <img :src="tirth.images[4]" class="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="" />
          </div>
        </div>
        <!-- Fallback for 2-4 images -->
        <div v-else-if="tirth.images.length >= 2" class="grid grid-cols-2 gap-2 h-[40vh] sm:h-[50vh] lg:h-[60vh] min-h-[300px]">
          <div class="relative group cursor-pointer" @click="showPhotoTour = true">
            <img :src="tirth.images[0]" class="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="" />
          </div>
          <div class="grid grid-rows-2 gap-2">
             <div class="relative group cursor-pointer" @click="showPhotoTour = true">
               <img :src="tirth.images[1]" class="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="" />
             </div>
             <div v-if="tirth.images[2]" class="relative group cursor-pointer" @click="showPhotoTour = true">
               <img :src="tirth.images[2]" class="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="" />
             </div>
             <div v-else class="bg-gray-200 w-full h-full"></div>
          </div>
        </div>
        <!-- Fallback for 0-1 images -->
        <div v-else class="h-[40vh] sm:h-[50vh] lg:h-[60vh] min-h-[300px] cursor-pointer group relative" @click="showPhotoTour = true">
           <img :src="tirth.images[0] || placeholder" class="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="" />
        </div>
        
        <!-- Show all photos button -->
        <button
          v-if="tirth.images.length > 0"
          @click="showPhotoTour = true"
          class="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-gray-900 px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors z-10"
        >
          <Icon name="Grid3x3" :size="16" />
          Show all photos
        </button>
      </div>

      <!-- Title Section -->
      <div class="mt-6 sm:mt-8">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {{ tirth.name }}
        </h1>
        <div class="flex flex-wrap items-center gap-2 text-gray-600 font-medium text-sm sm:text-base">
          {{ tirth.location.city }}, {{ tirth.location.state }}
          <span class="mx-1 hidden sm:inline">•</span>
          
          <div class="flex flex-wrap gap-2 items-center">
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border bg-gray-50 border-gray-200 text-gray-700"
            >
              <Icon name="Star" :size="10" />
              {{ tirth.sect }}
            </span>
            <!-- Tirth tags -->
            <span
              v-for="tag in visibleTags"
              :key="tag"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-700"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
      
    </div>

    <!-- Teleport the modal to body so it overlays everything -->
    <Teleport to="body">
      <TirthPhotoTour v-if="showPhotoTour" :tirth="tirth" @close="showPhotoTour = false" />
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Tirth } from '~/types/models'
import { WishlistButton } from '~/features/wishlist'
import Icon from '~/components/ui/Icon.vue'
import placeholderImg from '~/assets/images/jain-temple-placeholder.png'
import TirthPhotoTour from './TirthPhotoTour.vue'

const props = defineProps<{ tirth: Tirth }>()

const placeholder = placeholderImg
const showPhotoTour = ref(false)

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
