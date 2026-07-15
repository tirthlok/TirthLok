<template>
  <section v-if="hasTimings" id="section-timings" class="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- Section header -->
    <div class="flex items-center gap-3 mb-6 sm:mb-8">
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
        <Icon name="Clock" :size="20" />
      </div>
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Timings</h2>
        <p class="text-sm text-gray-500">Darshan & Pooja schedule</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <!-- Darshan Timings -->
      <div
        v-if="hasDarshan"
        class="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-orange-50 to-white p-6 sm:p-8 group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      >
        <!-- Decorative background -->
        <div class="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon name="Sun" :size="140" class="text-amber-500" />
        </div>

        <div class="relative">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2.5 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
              <Icon name="Sun" :size="22" class="text-amber-600" />
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-amber-500 mb-0.5">Darshan</p>
              <h3 class="text-lg font-black text-gray-900">Open Hours</h3>
            </div>
          </div>
          <p class="text-gray-700 font-semibold text-base leading-relaxed">
            {{ tirth.darshanTimings }}
          </p>
        </div>
      </div>

      <!-- Pooja Timings -->
      <div
        v-if="hasPooja"
        class="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 via-violet-50 to-white p-6 sm:p-8 group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      >
        <!-- Decorative background -->
        <div class="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon name="Flower2" :size="140" class="text-purple-500" />
        </div>

        <div class="relative">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2.5 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
              <Icon name="Flower2" :size="22" class="text-purple-600" />
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-purple-500 mb-0.5">Pooja</p>
              <h3 class="text-lg font-black text-gray-900">Prayer Schedule</h3>
            </div>
          </div>
          <p class="text-gray-700 font-semibold text-base leading-relaxed">
            {{ tirth.poojaTimings }}
          </p>
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
const isAvailable = (val: string | undefined | null) =>
  !!val && !PLACEHOLDER.includes(val.toLowerCase().trim())

const hasDarshan = computed(() => isAvailable(props.tirth.darshanTimings))
const hasPooja = computed(() => isAvailable(props.tirth.poojaTimings))
const hasTimings = computed(() => hasDarshan.value || hasPooja.value)
</script>
