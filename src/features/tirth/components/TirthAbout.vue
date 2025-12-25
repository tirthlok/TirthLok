<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Quick Info Cards Section -->
    <div v-if="hasContactInfo" class="max-w-md">
      <!-- Contact Card -->
      <div
        class="bg-gradient-to-br from-teal-50 to-cyan-50 p-5 rounded-xl border-2 border-teal-200 hover:border-teal-300 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-teal-100 rounded-lg">
            <Icon name="Phone" :size="20" class="text-teal-600" aria-hidden="true" />
          </div>
          <h4 class="font-bold text-gray-900">Contact</h4>
        </div>

        <div class="space-y-2 text-sm">
          <div v-if="tirth.contact?.phone">
            <a
              :href="`tel:${tirth.contact.phone}`"
              class="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors group"
            >
              <Icon name="Phone" :size="14" class="text-teal-500 group-hover:text-teal-600" aria-hidden="true" />
              <span class="font-medium">{{ tirth.contact.phone }}</span>
            </a>
          </div>

          <div v-if="tirth.contact?.email">
            <a
              :href="`mailto:${tirth.contact.email}`"
              class="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors group"
            >
              <Icon name="Mail" :size="14" class="text-teal-500 group-hover:text-teal-600" aria-hidden="true" />
              <span class="font-medium break-all">{{ tirth.contact.email }}</span>
            </a>
          </div>

          <div v-if="tirth.contact?.website">
            <a
              :href="tirth.contact.website"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors group"
            >
              <Icon name="Globe" :size="14" class="text-teal-500 group-hover:text-teal-600" aria-hidden="true" />
              <span class="font-medium break-all">Visit Website</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div
      v-if="tirth.description"
      class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-2xl border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
    >
      <div class="flex items-start gap-3 sm:gap-4">
        <Icon name="BookOpen" :size="24" class="text-blue-600 flex-shrink-0 mt-1" aria-hidden="true" />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Description</h3>
          <p class="text-gray-700 leading-relaxed text-base sm:text-lg">
            {{ tirth.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Historical Background -->
    <div
      v-if="tirth.historicalBackground"
      class="bg-gradient-to-r from-amber-50 to-orange-50 p-4 sm:p-6 rounded-2xl border-l-4 border-amber-600 hover:shadow-lg transition-shadow"
    >
      <div class="flex items-start gap-3 sm:gap-4">
        <Icon name="History" :size="24" class="text-amber-600 flex-shrink-0 mt-1" aria-hidden="true" />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Historical Background</h3>
          <p class="text-gray-700 leading-relaxed text-base sm:text-lg">
            {{ tirth.historicalBackground }}
          </p>
        </div>
      </div>
    </div>

    <!-- Founding Details -->
    <div
      v-if="tirth.foundingDetails"
      class="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-2xl border-l-4 border-purple-600 hover:shadow-lg transition-shadow"
    >
      <div class="flex items-start gap-3 sm:gap-4">
        <Icon name="Landmark" :size="24" class="text-purple-600 flex-shrink-0 mt-1" aria-hidden="true" />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Founding Details</h3>
          <p class="text-gray-700 leading-relaxed text-base sm:text-lg">
            {{ tirth.foundingDetails }}
          </p>
        </div>
      </div>
    </div>

    <!-- Architecture -->
    <div
      v-if="tirth.architecture"
      class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-2xl border-l-4 border-green-600 hover:shadow-lg transition-shadow"
    >
      <div class="flex items-start gap-3 sm:gap-4">
        <Icon name="Building" :size="24" class="text-green-600 flex-shrink-0 mt-1" aria-hidden="true" />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Architecture</h3>
          <p class="text-gray-700 leading-relaxed text-base sm:text-lg">
            {{ tirth.architecture }}
          </p>
        </div>
      </div>
    </div>

    <!-- Timings -->
    <div v-if="hasTimings">
      <div class="flex items-center gap-3 mb-4 sm:mb-6">
        <Icon name="Clock" :size="24" class="text-indigo-600" aria-hidden="true" />
        <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
          Timings & Schedule
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-if="tirth.poojaTimings"
          class="bg-gradient-to-br from-sky-50 to-blue-50 p-5 sm:p-6 rounded-xl border-2 border-sky-200 hover:border-sky-300 hover:shadow-lg transition-shadow"
        >
          <h4 class="font-bold text-gray-900 mb-2">Pooja Timings</h4>
          <p class="text-gray-700 text-base sm:text-lg font-medium">
            {{ tirth.poojaTimings }}
          </p>
        </div>

        <div
          v-if="tirth.darshanTimings"
          class="bg-gradient-to-br from-orange-50 to-amber-50 p-5 sm:p-6 rounded-xl border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-shadow"
        >
          <h4 class="font-bold text-gray-900 mb-2">Darshan Timings</h4>
          <p class="text-gray-700 text-base sm:text-lg font-medium">
            {{ tirth.darshanTimings }}
          </p>
        </div>
      </div>
    </div>

    <!-- Rules & Regulations -->
    <div>
      <div class="flex items-center gap-3 mb-4 sm:mb-6">
        <Icon name="Shield" :size="24" class="text-red-600" aria-hidden="true" />
        <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
          Rules & Regulations
        </h3>
      </div>

      <div class="bg-gradient-to-r from-red-50 to-rose-50 p-4 sm:p-6 rounded-2xl border-2 border-red-200">
        <ul v-if="tirth.rules?.length && tirth.rules.length > 0" class="space-y-2 sm:space-y-3">
          <li
            v-for="(rule, idx) in tirth.rules"
            :key="`${rule}-${idx}`"
            class="flex items-start gap-3"
          >
            <span class="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
            <span class="text-gray-700 text-base sm:text-lg">{{ rule }}</span>
          </li>
        </ul>

        <div v-else class="flex items-center gap-3 text-gray-500">
          <Icon name="Info" :size="20" class="text-gray-400" aria-hidden="true" />
          <p class="italic text-base sm:text-lg">
            Rules and regulations will be updated soon
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tirth } from '~/types/models'

const props = defineProps<{ tirth: Tirth }>()

/**
 * FIX 1: Ensure boolean return (no string truthiness)
 */
const hasContactInfo = computed(() =>
  Boolean(
    props.tirth.contact?.phone ||
    props.tirth.contact?.email ||
    props.tirth.contact?.website
  )
)

/**
 * FIX 2: Centralized guards (safe, no behavior change)
 */
const hasTimings = computed(() =>
  Boolean(props.tirth.poojaTimings || props.tirth.darshanTimings)
)
</script>
