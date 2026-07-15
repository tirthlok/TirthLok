<template>
  <section id="section-about" class="py-4 sm:py-6">
    <div class="space-y-10 sm:space-y-14">
      
      <!-- 1. Description -->
      <div v-if="has(tirth.description)" class="relative">
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <Icon name="BookOpen" :size="22" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">About</h2>
            <div class="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-transparent rounded-full mt-1" />
          </div>
        </div>
        <div class="sm:ml-16">
          <div
            class="text-gray-700 leading-relaxed text-base sm:text-lg overflow-hidden transition-[max-height] duration-500"
            :style="{ maxHeight: descExpanded ? '9999px' : '9.5rem' }"
          >
            {{ tirth.description }}
          </div>
          <button
            v-if="tirth.description.length > 400"
            @click="descExpanded = !descExpanded"
            class="mt-3 flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-semibold text-sm transition-colors"
          >
            {{ descExpanded ? 'Read less' : 'Read more' }}
            <Icon :name="descExpanded ? 'ChevronUp' : 'ChevronDown'" :size="16" />
          </button>
        </div>
      </div>

      <!-- 2. Mul Nayak (Moolnayak) -->
      <div v-if="hasMoolnayak" class="relative">
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-md">
            <Icon name="Star" :size="22" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Mul Nayak</h2>
            <div class="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-transparent rounded-full mt-1" />
          </div>
        </div>
        <div class="sm:ml-16 space-y-4">
          <div
            v-for="(idol, idx) in validMoolnayak"
            :key="idx"
            class="relative bg-gradient-to-br from-orange-50 to-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-orange-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <Icon name="Sparkles" :size="100" class="absolute -right-6 -bottom-6 text-orange-200/30 rotate-12 pointer-events-none" />
            <div class="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div class="flex-1">
                <h4 class="text-lg font-bold text-orange-900 mb-3">{{ idol.name }}</h4>
                <div class="flex flex-wrap gap-2">
                  <span v-if="has(idol.height)" class="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100/70 rounded-full text-xs font-semibold text-orange-700">
                    <Icon name="ArrowUp" :size="11" /> {{ idol.height }}
                  </span>
                  <span v-if="has(idol.metal)" class="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100/70 rounded-full text-xs font-semibold text-orange-700">
                    <Icon name="Info" :size="11" /> {{ idol.metal }}
                  </span>
                </div>
                <p v-if="has(idol.details)" class="mt-3 text-sm text-gray-600 leading-relaxed">{{ idol.details }}</p>
              </div>
              <div v-if="idol.year && has(String(idol.year))" class="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-orange-200 shadow-sm min-w-[80px] flex-shrink-0">
                <span class="text-[9px] uppercase tracking-widest text-orange-400 font-bold">Year</span>
                <span class="text-2xl font-black text-orange-600">{{ idol.year }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Sacred Identity & Mythology -->
      <div v-if="has(tirth.mythology)" class="relative">
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Icon name="Sparkles" :size="22" />
          </div>
          <div class="flex-1 min-w-0 flex flex-wrap items-center gap-3">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Sacred Identity & Mythology</h2>
            <span class="px-3 py-1 bg-indigo-50 rounded-xl border border-indigo-100 text-xs font-bold text-indigo-800">{{ tirth.sect }}</span>
          </div>
        </div>
        <p class="sm:ml-16 text-gray-700 leading-relaxed text-base sm:text-lg">{{ tirth.mythology }}</p>
      </div>

      <!-- 4. Architecture -->
      <div v-if="has(tirth.architecture)" class="relative">
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-md">
            <Icon name="Landmark" :size="22" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Architecture</h2>
            <div class="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-transparent rounded-full mt-1" />
          </div>
        </div>
        <p class="sm:ml-16 text-gray-700 leading-relaxed text-base sm:text-lg">{{ tirth.architecture }}</p>
      </div>

      <!-- 5. Founding & History -->
      <div v-if="has(tirth.foundingDetails)" class="relative">
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md">
            <Icon name="History" :size="22" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Founding & History</h2>
            <div class="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-transparent rounded-full mt-1" />
          </div>
        </div>
        <p class="sm:ml-16 text-gray-700 leading-relaxed text-base sm:text-lg">{{ tirth.foundingDetails }}</p>
      </div>

      <!-- 6. Main Temples -->
      <div v-if="hasMainTemples" class="relative">
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Icon name="Building" :size="22" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Main Temples</h2>
            <div class="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-transparent rounded-full mt-1" />
          </div>
        </div>
        <div class="sm:ml-16 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="(temple, idx) in validTemples"
            :key="idx"
            class="flex items-center gap-3 p-4 bg-violet-50/60 rounded-xl border border-violet-100 hover:border-violet-300 transition-colors"
          >
            <div class="w-7 h-7 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold text-xs flex-shrink-0">
              {{ idx + 1 }}
            </div>
            <span class="text-gray-800 font-medium text-sm">{{ temple }}</span>
          </div>
        </div>
      </div>

      <!-- 7. Special Facts -->
      <div v-if="hasSpecialFacts" class="relative">
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white shadow-md">
            <Icon name="Sparkles" :size="22" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Special Facts</h2>
            <div class="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-transparent rounded-full mt-1" />
          </div>
        </div>
        <div class="sm:ml-16 bg-amber-50/40 p-5 sm:p-6 rounded-2xl border border-amber-100">
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <li
              v-for="(fact, idx) in validSpecialFacts"
              :key="idx"
              class="flex items-start gap-3 p-3 bg-white/80 rounded-xl border border-amber-50 shadow-sm hover:translate-x-1 transition-transform"
            >
              <Icon name="Star" :size="15" class="text-amber-500 mt-0.5 flex-shrink-0" />
              <span class="text-gray-700 font-medium text-sm">{{ fact }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 8. Rules & Regulations -->
      <div v-if="hasRules" class="relative">
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-md">
            <Icon name="Shield" :size="22" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Rules & Regulations</h2>
            <div class="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-transparent rounded-full mt-1" />
          </div>
        </div>
        <div class="sm:ml-16 bg-red-50/30 p-5 sm:p-6 rounded-2xl border border-red-100">
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <li
              v-for="(rule, idx) in validRules"
              :key="idx"
              class="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-red-50 shadow-sm hover:translate-x-1 transition-transform"
            >
              <Icon name="CheckCircle" :size="15" class="text-red-500 mt-0.5 flex-shrink-0" />
              <span class="text-gray-700 font-medium text-sm">{{ rule }}</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Tirth } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()

const descExpanded = ref(false)

const PLACEHOLDER = ['to be updated soon', 'to be updated', '']
const has = (val: string | number | undefined | null): boolean => {
  if (val === undefined || val === null) return false
  return !PLACEHOLDER.includes(String(val).toLowerCase().trim())
}

const validMoolnayak = computed(() =>
  (props.tirth.moolnayak ?? []).filter((i) => has(i.name))
)
const hasMoolnayak = computed(() => validMoolnayak.value.length > 0)

const validTemples = computed(() =>
  (props.tirth.mainTemples ?? []).filter((t) => has(t))
)
const hasMainTemples = computed(() => validTemples.value.length > 0)

const validSpecialFacts = computed(() =>
  (props.tirth.specialFacts ?? []).filter((f) => has(f))
)
const hasSpecialFacts = computed(() => validSpecialFacts.value.length > 0)

const validRules = computed(() =>
  (props.tirth.rules ?? []).filter((r) => has(r))
)
const hasRules = computed(() => validRules.value.length > 0)
</script>
