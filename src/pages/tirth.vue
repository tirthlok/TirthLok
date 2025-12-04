<template>
  <router-view v-if="hasId" />
  <ListingPage
    v-else
    :items="tirths"
    :store="storeConfig"
    page-type="tirth"
    route-prefix="/tirth"
    accent-color="red-500"
    :get-tag-fields="(item: any) => [item.sect, item.type].filter(Boolean)"
    :selected-filter="selectedFilter"
    @update:selected-filter="selectedFilter = $event"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Tirth } from '~/types/models'
import { useTirthStore } from '~/stores/tirth'
import { useFavoritesStore } from '~/stores/favorites'
import ListingPage from '~/components/listings/ListingPage.vue'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const tirthStore = useTirthStore()
const favoritesStore = useFavoritesStore()

const hasId = computed(() => !!(route && route.params && route.params.id))
const selectedFilter = defineModel<string>('filter', { default: 'all' })
const tirths = computed(() => tirthStore.tirths)

const storeConfig = computed(() => ({
  loading: tirthStore.loading,
  error: tirthStore.error,
  getFiltered: () => tirthStore.filteredTirths,
}))

// Server-side data fetching and store hydration
const { data: serverTirths } = await useAsyncData<Tirth[]>('tirths', () => $fetch('/api/tirth'))
if (serverTirths?.value) {
  tirthStore.$patch((state) => {
    state.tirths = serverTirths.value as Tirth[]
    state.filteredTirths = serverTirths.value as Tirth[]
  })
}

const { data: serverFavorites } = await useAsyncData<string[]>('favorites', () => $fetch('/api/favorites'))
if (serverFavorites?.value) {
  favoritesStore.setFavorites(serverFavorites.value as string[])
}
</script>