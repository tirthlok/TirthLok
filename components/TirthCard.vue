<template>
  <BaseCard
    :image="tirth.images[0]"
    :title="tirth.name"
    :subtitle="`${tirth.location.city}, ${tirth.location.state}`"
    :badge="tirth.sect"
    :rating="tirth.rating"
    :reviews="tirth.reviews"
    :is-favorite="isFav"
    @favorite="toggleFavorite"
    :meta-info="[
      { label: 'Founded', value: tirth.pratisthaYear },
      { label: 'Type', value: tirth.type },
      { label: 'Facilities', value: tirth.facilities.length },
    ]"
  >
    <template #actions>
      <NuxtLink
        :to="`/tirth/${tirth.id}`"
        class="flex-1 bg-red-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-red-600 transition-all text-center text-sm flex items-center justify-center gap-2"
      >
        <Icon name="Eye" :size="16" />
        View Details
      </NuxtLink>
      <button
        @click.stop="shareLocation"
        class="px-3 py-2 bg-gray-50 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm"
      >
        <Icon name="Share2" :size="16" />
      </button>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tirth } from '~/types/models'
import { useUserStore } from '~/stores/user'

const props = defineProps<{
  tirth: Tirth
}>()

const userStore = useUserStore()
const isFav = computed(() => userStore.isFavorite(props.tirth.id))

const toggleFavorite = async () => {
  if (isFav.value) {
    await userStore.removeFavorite(props.tirth.id)
  } else {
    await userStore.addFavorite(props.tirth.id)
  }
}

const shareLocation = () => {
  if (navigator.share) {
    navigator.share({
      title: props.tirth.name,
      text: `Check out ${props.tirth.name} - a beautiful Jain Tirth in ${props.tirth.location.city}`,
      url: window.location.href,
    })
  } else {
    alert(`${props.tirth.name} - ${props.tirth.location.city}, ${props.tirth.location.state}`)
  }
}
</script>
