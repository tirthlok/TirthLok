<template>
  <router-view v-if="hasId" />
  <ListingPage
    v-else
    :items="bhojanshalas"
    :store="storeConfig"
    page-type="bhojanshala"
    route-prefix="/bhojanshala"
    accent-color="green-500"
    :get-tag-fields="(item: any) => Array.isArray(item.cuisines) ? item.cuisines : []"
    :selected-filter="selectedFilter"
    @update:selected-filter="selectedFilter = $event"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBhojanshalaStore } from '~/stores/bhojanshala'
import { useFavoritesStore } from '~/stores/favorites'
import type { Bhojanshala } from '~/types/models'
import ListingPage from '~/components/listings/ListingPage.vue'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const bhojanshalaStore = useBhojanshalaStore()
const favoritesStore = useFavoritesStore()

const hasId = computed(() => !!(route && route.params && route.params.id))
const selectedFilter = defineModel<string>('filter', { default: 'all' })
const bhojanshalas = computed(() => bhojanshalaStore.bhojanshalas)

const storeConfig = computed(() => ({
  loading: bhojanshalaStore.loading,
  error: bhojanshalaStore.error,
  getFiltered: () => bhojanshalaStore.filteredBhojanshalas,
}))

// Server-side data fetching and store hydration
const { data: serverBhojans } = await useAsyncData<Bhojanshala[]>('bhojanshala', () => $fetch('/api/bhojanshala'))
if (serverBhojans?.value) {
  bhojanshalaStore.$patch((state) => {
    state.bhojanshalas = serverBhojans.value as Bhojanshala[]
    state.filteredBhojanshalas = serverBhojans.value as Bhojanshala[]
  })
}

const { data: serverFavorites } = await useAsyncData<string[]>('favorites', () => $fetch('/api/favorites'))
if (serverFavorites?.value) {
  favoritesStore.setFavorites(serverFavorites.value as string[])
}
</script>