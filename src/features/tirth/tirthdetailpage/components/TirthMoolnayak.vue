<template>
  <section v-if="hasMoolnayak" id="section-moolnayak" class="py-4 sm:py-6">
    <div class="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
      <!-- Title & Icon -->
      <div class="flex items-start gap-4 mb-5">
        <div class="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-md">
          <Icon name="Star" :size="20" />
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Mul Nayak</h2>
          <p class="text-xs text-gray-500 mt-0.5">Primary presiding deities of the temple</p>
        </div>
      </div>

      <!-- Presiding Deity List -->
      <div class="space-y-4 relative">
        <div
          v-for="(idol, idx) in validMoolnayak"
          :key="idx"
          class="relative bg-gradient-to-br from-orange-50/45 to-white p-4 rounded-2xl border border-orange-100/60 overflow-hidden shadow-sm hover:border-orange-200 transition-all"
        >
          <Icon name="Sparkles" :size="80" class="absolute -right-6 -bottom-6 text-orange-200/15 rotate-12 pointer-events-none" />
          
          <div class="relative flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-bold text-orange-950 truncate">{{ idol.name }}</h4>
              
              <!-- Badges -->
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span v-if="has(idol.height)" class="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100/60 rounded-lg text-[10px] font-bold text-orange-800">
                  <Icon name="ArrowUp" :size="10" /> {{ idol.height }}
                </span>
                <span v-if="has(idol.metal)" class="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100/60 rounded-lg text-[10px] font-bold text-orange-800">
                  <Icon name="Info" :size="10" /> {{ idol.metal }}
                </span>
              </div>
              
              <!-- Description -->
              <p v-if="has(idol.details)" class="mt-2 text-xs text-gray-600 leading-relaxed">{{ idol.details }}</p>
            </div>

            <!-- Year Indicator -->
            <div v-if="idol.year && has(String(idol.year))" class="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-orange-200 shadow-sm min-w-[56px] flex-shrink-0">
              <span class="text-[8px] uppercase tracking-wider text-orange-400 font-bold">Year</span>
              <span class="text-base font-black text-orange-600">{{ idol.year }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tirth } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()

const PLACEHOLDER = ['to be updated soon', 'to be updated', '']
const has = (val: string | number | undefined | null): boolean => {
  if (val === undefined || val === null) return false
  return !PLACEHOLDER.includes(String(val).toLowerCase().trim())
}

const validMoolnayak = computed(() =>
  (props.tirth.moolnayak ?? []).filter((i) => has(i.name))
)
const hasMoolnayak = computed(() => validMoolnayak.value.length > 0)
</script>
