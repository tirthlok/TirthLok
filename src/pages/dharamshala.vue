<template>
  <router-view v-if="hasId" />
  <ListingPage
    v-else
    :items="dharamshalas"
    :store="storeConfig"
    page-type="dharamshala"
    route-prefix="/dharamshala"
    accent-color="blue-500"
    :get-tag-fields="(item: any) => Array.isArray(item.amenities) ? item.amenities : []"
    :selected-filter="selectedFilter"
    @update:selected-filter="selectedFilter = $event"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDharamshalaStore } from '~/stores/dharamshala'
import { useFavoritesStore } from '~/stores/favorites'
import type { Dharamshala } from '~/types/models'
import ListingPage from '~/components/listings/ListingPage.vue'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const dharamshalaStore = useDharamshalaStore()
const favoritesStore = useFavoritesStore()

const hasId = computed(() => !!(route && route.params && route.params.id))
const selectedFilter = defineModel<string>('filter', { default: 'all' })
const dharamshalas = computed(() => dharamshalaStore.dharamshalas)

const storeConfig = computed(() => ({
  loading: dharamshalaStore.loading,
  error: dharamshalaStore.error,
  getFiltered: () => dharamshalaStore.filteredDharamshalas,
}))

// Server-side data fetching and store hydration
const { data: serverDharamshala } = await useAsyncData<Dharamshala[]>('dharamshala', () => $fetch('/api/dharamshala'))
if (serverDharamshala?.value) {
  dharamshalaStore.$patch((state) => {
    state.dharamshalas = serverDharamshala.value as Dharamshala[]
    state.filteredDharamshalas = serverDharamshala.value as Dharamshala[]
  })
}

const { data: serverFavorites } = await useAsyncData<string[]>('favorites', () => $fetch('/api/favorites'))
if (serverFavorites?.value) {
  favoritesStore.setFavorites(serverFavorites.value as string[])
}
</script>