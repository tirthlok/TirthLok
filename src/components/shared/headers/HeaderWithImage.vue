<template>
  <div class="relative w-full">
    <!-- Image Carousel -->
    <ImageCarousel
      :images="images"
      :title="title"
      :subtitle="subtitle"
      :image-height="imageHeight"
      :accent-dot-color="accentDotColor"
      :show-gradient="true"
      :show-dots="true"
      :show-title-overlay="false"
    />

    <!-- Header Content Overlay -->
    <div class="absolute inset-0 flex flex-col justify-between p-6">
      <!-- Top Actions -->
      <div class="flex items-start justify-between">
        <!-- Back Button -->
        <button
          v-if="showBackButton"
          @click="goBack"
          class="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
          aria-label="Go back"
        >
          <Icon name="ChevronLeft" :size="24" class="text-gray-900" />
        </button>

        <!-- Top Actions Slot -->
        <div class="flex items-center gap-2">
          <slot name="top-actions" />
        </div>
      </div>

      <!-- Bottom Content -->
      <div class="space-y-4">
        <!-- Title & Metadata -->
        <div class="text-white">
          <h1 class="text-3xl font-bold line-clamp-2">{{ title }}</h1>
          <p v-if="subtitle" class="text-lg text-gray-200 mt-2 line-clamp-1">{{ subtitle }}</p>

          <!-- Metadata Row -->
          <div v-if="metadata" class="flex flex-wrap gap-4 mt-4 text-sm">
            <!-- Location -->
            <div v-if="metadata.location" class="flex items-center gap-1">
              <Icon name="MapPin" :size="16" class="text-red-300" />
              <span>{{ metadata.location }}</span>
            </div>

            <!-- Rating -->
            <div v-if="metadata.rating" class="flex items-center gap-1">
              <Icon name="Star" :size="16" class="fill-yellow-300 text-yellow-300" />
              <span>{{ metadata.rating }}</span>
            </div>

            <!-- Type Badge -->
            <div v-if="metadata.type" :class="['px-3 py-1 rounded-full font-semibold', metadataBadgeClass]">
              {{ metadata.type }}
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-2">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ImageCarousel from '../carousel/ImageCarousel.vue'
import Icon from '~/components/common/Icon.vue'

interface MetadataItem {
  location?: string
  rating?: string | number
  type?: string
  [key: string]: any
}

interface Props {
  title: string
  subtitle?: string
  images?: string[] | string
  metadata?: MetadataItem
  imageHeight?: string
  accentDotColor?: string
  metadataBadgeClass?: string
  showBackButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: undefined,
  images: undefined,
  metadata: undefined,
  imageHeight: 'h-80',
  accentDotColor: 'bg-red-400',
  metadataBadgeClass: 'bg-green-600 text-white',
  showBackButton: true,
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>
