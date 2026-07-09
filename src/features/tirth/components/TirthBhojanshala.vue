<template>
  <section
    v-if="!loading && bhojanshalas.length > 0"
    id="section-bhojanshala"
    class="py-4 sm:py-6"
  >
    <!-- Section Header -->
    <div class="flex items-start gap-4 mb-6 sm:mb-8">
      <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
        <Icon name="UtensilsCrossed" :size="22" />
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Bhojanshala</h2>
        <p class="text-sm text-gray-500 mt-0.5">Dining near this Tirth</p>
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
        v-for="bhojanshala in bhojanshalas"
        :key="bhojanshala.id"
        class="flex-shrink-0 w-[260px] sm:w-[280px]"
      >
        <BhojanshalaCard :bhojanshala="bhojanshala" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Bhojanshala } from '~/types/models'
import BhojanshalaCard from '~/features/bhojanshala/components/BhojanshalaCard.vue'
import Icon from '~/components/ui/Icon.vue'

const emit = defineEmits<{ loaded: [count: number] }>()

const props = defineProps<{
  tirthId: string
}>()

const bhojanshalas = ref<Bhojanshala[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!props.tirthId) {
    loading.value = false
    emit('loaded', 0)
    return
  }
  try {
    // Filter server-side using the tirth_id FK — never load all and filter on client
    const response = await $fetch<{ bhojanshalas: any[]; total: number }>('/api/bhojanshala', {
      query: { tirth: props.tirthId, limit: 50 },
    })

    const rows = response?.bhojanshalas ?? []

    bhojanshalas.value = rows.map((row: any): Bhojanshala => ({
      id: row.bhojanshala_id,
      name: row.bhojanshala_name || '',
      description: row.details?.about || '',
      type: row.bhojanshala_type || '',
      rating: 0,
      reviews: 0,
      operatingHours: row.details?.meal_timings || '',
      priceRange: '',
      cuisineTypes: [],
      dietaryOptions: [],
      location: {
        latitude: 0,
        longitude: 0,
        address: row.bhojanshala_address || `${row.bhojanshala_city}, ${row.bhojanshala_state}`,
        city: row.bhojanshala_city || '',
        state: row.bhojanshala_state || '',
      },
      contact: {
        phone: row.bhojanshala_phone || '',
        email: row.bhojanshala_email || '',
      },
      images: Array.isArray(row.bhojanshala_images) ? row.bhojanshala_images : [],
      speciality: Array.isArray(row.tags) && row.tags.length > 0 ? row.tags[0] : undefined,
      vegetarianOnly: true,
    }))
    emit('loaded', bhojanshalas.value.length)
  } catch (e) {
    bhojanshalas.value = []
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
