<template>
  <BaseCard
    :images="tirth.images"
    :title="tirth.name"
    :subtitle="`${tirth.location.city}, ${tirth.location.state}`"

    clickable
    @click="navigateToTirth"
  >
  </BaseCard>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'

const props = defineProps<{
  tirth: Tirth
}>()


const navigateToTirth = () => {
  navigateTo(`/tirth/${props.tirth.id}`)
}
</script>
