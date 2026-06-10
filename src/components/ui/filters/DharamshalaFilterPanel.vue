<template>
  <!-- Filter Modal - Teleported to body -->
  <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-[60] transition-opacity flex items-center justify-center p-4 backdrop-blur-sm"
      @click="close"
    >
      <div
        :class="[
          'rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar filter-modal animate-fade-in-up',
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        ]"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2
            :class="[
              'text-xl font-bold',
              isDarkMode ? 'text-white' : 'text-gray-900'
            ]"
          >
            Filters
          </h2>
          <button
            @click="close"
            :class="[
              'p-2 rounded-full transition-colors',
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            ]"
          >
            <Icon
              name="X"
              :size="20"
              :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'"
            />
          </button>
        </div>

        <!-- Filters -->
        <div class="space-y-6">
          <!-- State Filter -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label
                :class="[
                  'block text-sm font-semibold',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                ]"
              >
                State
              </label>
              <button
                v-if="selectedState"
                @click="selectedState = ''"
                :class="[
                  'p-1 rounded-full transition-colors',
                  isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                ]"
                title="Clear state filter"
              >
                <Icon name="X" :size="14" />
              </button>
            </div>
            <div class="relative">
              <select
                v-model="selectedState"
                :class="[
                  'w-full px-4 py-3 border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none',
                  isDarkMode
                    ? 'border-gray-700 bg-gray-700 text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-900'
                ]"
              >
                <option value="">All States</option>
                <option v-for="state in availableStates" :key="state" :value="state">
                  {{ state }}
                </option>
              </select>
              <Icon
                name="ChevronDown"
                :size="16"
                :class="`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`"
              />
            </div>
          </div>

          <!-- City Filter -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label
                :class="[
                  'block text-sm font-semibold',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                ]"
              >
                City
              </label>
              <button
                v-if="selectedCity"
                @click="selectedCity = ''"
                :class="[
                  'p-1 rounded-full transition-colors',
                  isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                ]"
                title="Clear city filter"
              >
                <Icon name="X" :size="14" />
              </button>
            </div>
            <div class="relative">
              <select
                v-model="selectedCity"
                :class="[
                  'w-full px-4 py-3 border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none',
                  isDarkMode
                    ? 'border-gray-700 bg-gray-700 text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-900'
                ]"
              >
                <option value="">All Cities</option>
                <option v-for="city in availableCities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
              <Icon
                name="ChevronDown"
                :size="16"
                :class="`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`"
              />
            </div>
          </div>

          <!-- Facilities Filter -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label
                :class="[
                  'block text-sm font-semibold',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                ]"
              >
                Facilities
              </label>
              <button
                v-if="selectedFacilities.length > 0"
                @click="selectedFacilities = []"
                :class="[
                  'p-1 rounded-full transition-colors',
                  isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                ]"
                title="Clear all facilities"
              >
                <Icon name="X" :size="14" />
              </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <label
                v-for="facility in availableFacilities"
                :key="facility"
                class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
                :class="
                  selectedFacilities.includes(facility)
                    ? 'border-primary bg-primary/5'
                    : isDarkMode
                    ? 'border-gray-700 hover:border-gray-600'
                    : 'border-gray-200 hover:border-gray-300'
                "
              >
                <input
                  v-model="selectedFacilities"
                  type="checkbox"
                  :value="facility"
                  class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span
                  :class="[
                    'text-sm flex-1',
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  ]"
                >
                  {{ formatFacilityName(facility) }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div
          :class="[
            'flex gap-3 mt-8 pt-6 border-t',
            isDarkMode ? 'border-gray-700' : 'border-gray-100'
          ]"
        >
          <button
            @click="reset"
            :class="[
              'flex-1 px-4 py-3 border rounded-xl font-semibold transition-colors',
              isDarkMode
                ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            ]"
          >
            Reset
          </button>
          <button
            @click="apply"
            class="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold shadow-lg shadow-blue-500/30 transition-all"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '~/components/ui/Icon.vue'
import { useThemeStore } from '~/stores/theme'
import { useDharamshalaStore } from '~/features/dharamshala/composables/useDharamshalaStore'

interface Props {
  isOpen: boolean
  searchQuery?: string
}

withDefaults(defineProps<Props>(), {
  searchQuery: '',
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  apply: [filters: FilterState]
  reset: []
}>()

interface FilterState {
  state?: string
  city?: string
  facilities?: string[]
  searchTerm?: string
}

const themeStore = useThemeStore()
const dharamshalaStore = useDharamshalaStore()

const isDarkMode = computed(() => themeStore.isDarkMode)

const selectedState = ref('')
const selectedCity = ref('')
const selectedFacilities = ref<string[]>([])

// Get filter options from store
const availableStates = computed(() => dharamshalaStore.filterOptions.states || [])
const availableCities = computed(() => dharamshalaStore.filterOptions.cities || [])
const availableFacilities = computed(() => dharamshalaStore.filterOptions.facilities || [])

const formatFacilityName = (facility: string): string => {
  const facilityMap: Record<string, string> = {
    parking: 'Parking',
    washroom: 'Restroom',
    water: 'Water',
    wifi: 'WiFi',
    kitchen: 'Kitchen',
    ac: 'AC',
    heater: 'Heater',
    blanket: 'Blanket'
  }
  return facilityMap[facility] || facility.charAt(0).toUpperCase() + facility.slice(1)
}

const close = () => {
  emit('update:isOpen', false)
}

const apply = () => {
  const filters: FilterState = {
    state: selectedState.value || undefined,
    city: selectedCity.value || undefined,
    facilities: selectedFacilities.value.length > 0 ? selectedFacilities.value : undefined,
    searchTerm: undefined,
  }
  dharamshalaStore.filterDharamshalas(filters)
  emit('apply', filters)
  close()
}

const reset = () => {
  selectedState.value = ''
  selectedCity.value = ''
  selectedFacilities.value = []
  dharamshalaStore.filterDharamshalas({})
  emit('reset')
  close()
}
</script>
