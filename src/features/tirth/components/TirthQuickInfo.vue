<template>
  <div v-if="chips.length > 0" class="w-full overflow-x-auto scrollbar-hide">
    <div class="flex items-center gap-2 sm:gap-3 page-container py-3 sm:py-4 min-w-max">
      <div
        v-for="chip in chips"
        :key="chip.label"
        class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gray-100 shadow-sm whitespace-nowrap flex-shrink-0 transition-all hover:shadow-md hover:border-amber-200 group"
      >
        <div
          class="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
          :class="chip.iconBg"
        >
          <Icon :name="chip.icon as any" :size="14" :class="chip.iconColor" />
        </div>
        <div class="flex flex-col leading-tight">
          <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">{{ chip.label }}</span>
          <span class="text-sm font-semibold text-gray-800">{{ chip.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tirth } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()

const PLACEHOLDER = ['to be updated soon', 'to be updated', '']

const isAvailable = (val: string | undefined | null): boolean => {
  if (!val) return false
  return !PLACEHOLDER.includes(val.toLowerCase().trim())
}

const chips = computed(() => {
  const result: Array<{
    label: string
    value: string
    icon: string
    iconBg: string
    iconColor: string
  }> = []

  // City
  if (props.tirth.location.city) {
    result.push({
      label: 'City',
      value: props.tirth.location.city,
      icon: 'Building2',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    })
  }

  // State
  if (props.tirth.location.state) {
    result.push({
      label: 'State',
      value: props.tirth.location.state,
      icon: 'MapPin',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    })
  }

  // Sect
  if (props.tirth.sect) {
    result.push({
      label: 'Sect',
      value: props.tirth.sect,
      icon: 'Star',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    })
  }

  // Darshan Timings
  if (isAvailable(props.tirth.darshanTimings)) {
    result.push({
      label: 'Darshan',
      value: props.tirth.darshanTimings.length > 22 ? props.tirth.darshanTimings.slice(0, 22) + '…' : props.tirth.darshanTimings,
      icon: 'Sun',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
    })
  }

  // Pooja Timings
  if (isAvailable(props.tirth.poojaTimings)) {
    result.push({
      label: 'Pooja',
      value: props.tirth.poojaTimings.length > 22 ? props.tirth.poojaTimings.slice(0, 22) + '…' : props.tirth.poojaTimings,
      icon: 'Flower2',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
    })
  }

  return result
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
