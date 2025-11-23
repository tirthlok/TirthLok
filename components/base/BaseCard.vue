<template>
  <div :class="['bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all', gridClass]">
    <!-- Image -->
    <div class="relative h-40 sm:h-48 bg-gray-200 overflow-hidden group">
      <img
        :src="image || 'https://via.placeholder.com/300x200'"
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div v-if="badge" class="absolute top-3 left-3">
        <BaseBadge variant="primary">{{ badge }}</BaseBadge>
      </div>
      <button
        v-if="showFavorite"
        @click.stop="$emit('favorite')"
        :class="['absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all', isFavorite ? 'text-red-500' : 'text-gray-400']"
      >
        <Icon name="Heart" :size="20" :fill="isFavorite" />
      </button>
    </div>

    <!-- Content -->
    <div class="p-4">
      <h3 class="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-red-600 transition-colors">
        {{ title }}
      </h3>

      <div v-if="subtitle" class="flex items-center gap-1 text-sm text-gray-500 mb-3">
        <Icon name="MapPin" :size="16" class="text-gray-400" />
        <span class="line-clamp-1">{{ subtitle }}</span>
      </div>

      <!-- Meta Info Grid -->
      <div v-if="metaInfo.length > 0" class="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
        <div v-for="(meta, idx) in metaInfo" :key="idx" class="bg-gray-50 rounded-lg py-2">
          <div class="text-gray-500">{{ meta.label }}</div>
          <div class="font-bold text-gray-900">{{ meta.value }}</div>
        </div>
      </div>

      <!-- Rating -->
      <div v-if="rating" class="flex items-center gap-1 mb-4">
        <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
        <span class="text-sm font-semibold">{{ rating }}</span>
        <span v-if="reviews" class="text-xs text-gray-600">({{ reviews }})</span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MetaItem {
  label: string
  value: string | number
}

withDefaults(
  defineProps<{
    image?: string
    title: string
    subtitle?: string
    badge?: string
    rating?: number
    reviews?: number
    metaInfo?: MetaItem[]
    isFavorite?: boolean
    showFavorite?: boolean
    gridClass?: string
  }>(),
  {
    metaInfo: () => [],
    showFavorite: true,
    gridClass: '',
  }
)

defineEmits<{
  favorite: []
}>()
</script>
