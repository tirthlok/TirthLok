<template>
  <section
    v-if="!loading && dharamshalas.length > 0"
    id="section-dharamshala"
    class="py-4 sm:py-6"
  >
    <!-- Section Header -->
    <div class="flex items-start gap-4 mb-6 sm:mb-8">
      <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white shadow-md">
        <Icon name="Building2" :size="22" />
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Dharamshala</h2>
        <p class="text-sm text-gray-500 mt-0.5">Accommodation near this Tirth</p>
        <div class="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-transparent rounded-full mt-1" />
      </div>
    </div>

    <!-- Skeleton loader -->
    <div v-if="loading" class="flex gap-4 overflow-hidden">
      <div
        v-for="n in 4"
        :key="n"
        class="flex-shrink-0 w-64 animate-pulse"
      >
        <div class="aspect-[4/3] rounded-xl bg-gray-200 mb-3" />
        <div class="h-3.5 w-3/4 bg-gray-200 rounded mb-1.5" />
        <div class="h-3 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>

    <!-- Horizontal scroll cards -->
    <div
      v-else
      class="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
    >
      <div
        v-for="dharamshala in dharamshalas"
        :key="dharamshala.id"
        class="flex-shrink-0 w-[260px] sm:w-[280px]"
      >
        <DharamshalaCard :dharamshala="dharamshala" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Dharamshala } from '~/types/models'
import DharamshalaCard from '~/features/dharamshala/components/DharamshalaCard.vue'
import Icon from '~/components/ui/Icon.vue'

const emit = defineEmits<{ loaded: [count: number] }>()

const props = defineProps<{
  tirthId: string
}>()

const dharamshalas = ref<Dharamshala[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!props.tirthId) {
    loading.value = false
    emit('loaded', 0)
    return
  }
  try {
    // Filter server-side using the tirth_id FK — never load all and filter on client
    const data = await $fetch<Dharamshala[]>('/api/dharamshala', {
      query: { tirth_id: props.tirthId },
    })
    dharamshalas.value = Array.isArray(data) ? data : []
    emit('loaded', dharamshalas.value.length)
  } catch (e) {
    dharamshalas.value = []
    emit('loaded', 0)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
