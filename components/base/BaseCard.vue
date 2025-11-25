<template>
  <div
    :class="[
      'group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer',
      'bg-white shadow-lg hover:shadow-2xl hover:scale-105',
      'border-2 border-red-100 hover:border-red-300',
      gridClass,
    ]"
    @click="clickable && $emit('click')"
  >
    <!-- Image Container -->
    <div class="relative w-full h-64 overflow-hidden bg-gray-200">
      <!-- Image with lazy loading effect -->
      <img
        :src="imagesArr[currentImageIndex] || 'https://via.placeholder.com/400x320'"
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

      <!-- Navigation Arrows -->
      <div v-if="imagesArr.length > 1" class="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click.stop="prevImage"
          class="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors hover:shadow-xl"
        >
          <Icon name="ChevronLeft" :size="24" class="text-gray-900" />
        </button>
        <button
          @click.stop="nextImage"
          class="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors hover:shadow-xl"
        >
          <Icon name="ChevronRight" :size="24" class="text-gray-900" />
        </button>
      </div>

      <!-- Image Dots -->
      <div v-if="imagesArr.length > 1" class="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        <button
          v-for="(_, index) in imagesArr"
          :key="index"
          @click.stop="currentImageIndex = index"
          :class="[
            'transition-all duration-300',
            index === currentImageIndex
              ? 'w-8 h-2 bg-red-400 rounded-full'
              : 'w-2 h-2 bg-white/60 rounded-full hover:bg-white/80'
          ]"
        />
      </div>

      <!-- Title and Subtitle positioned over gradient -->
      <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 class="text-lg font-bold line-clamp-2">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-gray-200 mt-1 line-clamp-1">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '~/components/Icon.vue'

const props = withDefaults(
  defineProps<{
    images?: string[] | string
    title: string
    subtitle?: string
    gridClass?: string
    clickable?: boolean
  }>(),
  {
    images: () => [],
    gridClass: '',
    clickable: false,
  }
)

const currentImageIndex = ref(0)

const imagesArr = computed(() => {
  if (!props.images) return [] as string[]
  if (Array.isArray(props.images)) return props.images as string[]
  return [props.images as string]
})

const nextImage = () => {
  if (imagesArr.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value + 1) % imagesArr.value.length
}

const prevImage = () => {
  if (imagesArr.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value - 1 + imagesArr.value.length) % imagesArr.value.length
}

defineEmits<{
  click: []
}>()
</script>


