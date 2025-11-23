<template>
  <div
    :class="[
      'bg-white rounded-2xl transition-all duration-300',
      gridClass,
      clickable ? 'cursor-pointer' : '',
    ]"
    @click="clickable && $emit('click')"
  >
    <!-- Image -->
    <div class="relative w-full portrait-aspect overflow-hidden rounded-2xl">
      <img
        :src="imagesArr[currentImageIndex] || 'https://via.placeholder.com/300x200'"
        :alt="title"
        class="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
      />
      <div v-if="imagesArr.length > 1" class="absolute inset-0 flex items-center justify-between px-2">
        <button @click.stop="prevImage" class="p-2 bg-white rounded-full shadow-md opacity-75 hover:opacity-100 transition-opacity">
          <Icon name="ChevronLeft" :size="20" />
        </button>
        <button @click.stop="nextImage" class="p-2 bg-white rounded-full shadow-md opacity-75 hover:opacity-100 transition-opacity">
          <Icon name="ChevronRight" :size="20" />
        </button>
      </div>
      <div v-if="imagesArr.length > 1" class="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
        <span
          v-for="(_, index) in imagesArr"
          :key="index"
          :class="['block w-1.5 h-1.5 rounded-full', index === currentImageIndex ? 'bg-white' : 'bg-gray-400 opacity-75']"
        ></span>
      </div>
    </div>

    <!-- Content -->
    <div class="pt-3 px-2 pb-2">
      <h3 class="text-base font-medium text-gray-800 line-clamp-1">
        {{ title }}
      </h3>

      <div v-if="subtitle" class="text-sm text-gray-500 mt-1 line-clamp-1">
        {{ subtitle }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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

// Normalize images prop to always be an array for easier handling

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
// Lightweight debug output (kept minimal). Remove or toggle as needed.
onMounted(() => {
  // console.log('BaseCard images for', props.title, ':', imagesArr.value)
})
</script>


