<template>
  <div 
    v-if="visible" 
    class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50 max-w-2xl"
  >
    <!-- Search Bar -->
    <div class="mb-4">
      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Search by Name</label>
      <input
        v-model="localFilters.searchTerm"
        type="text"
        placeholder="Search..."
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-700 dark:text-white"
        @input="applyFilters"
      />
    </div>

    <!-- Filter Options Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- State Filter (for Tirth) -->
      <div v-if="showStateFilter" class="space-y-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">State</label>
        <div class="space-y-1 max-h-40 overflow-y-auto">
          <label v-for="state in states" :key="state" class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              :checked="localFilters.state === state"
              type="radio"
              :value="state"
              name="state"
              class="w-4 h-4 cursor-pointer"
              @change="(e: Event) => { localFilters.state = (e.target as HTMLInputElement).value; applyFilters() }"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ state }}</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              :checked="!localFilters.state"
              type="radio"
              value=""
              name="state"
              class="w-4 h-4 cursor-pointer"
              @change="localFilters.state = ''; applyFilters()"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">All States</span>
          </label>
        </div>
      </div>

      <!-- Sect Filter (for Tirth) -->
      <div v-if="showSectFilter" class="space-y-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Sect</label>
        <div class="space-y-1">
          <label v-for="sect in sects" :key="sect" class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              :checked="localFilters.sect === sect"
              type="radio"
              :value="sect"
              name="sect"
              class="w-4 h-4 cursor-pointer"
              @change="(e: Event) => { localFilters.sect = (e.target as HTMLInputElement).value; applyFilters() }"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ sect }}</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              :checked="!localFilters.sect"
              type="radio"
              value=""
              name="sect"
              class="w-4 h-4 cursor-pointer"
              @change="localFilters.sect = ''; applyFilters()"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">All Sects</span>
          </label>
        </div>
      </div>

      <!-- Type Filter -->
      <div v-if="showTypeFilter" class="space-y-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">{{ typeLabel }}</label>
        <div class="space-y-1 max-h-40 overflow-y-auto">
          <label v-for="type in types" :key="type" class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              :checked="localFilters.type === type"
              type="radio"
              :value="type"
              name="type"
              class="w-4 h-4 cursor-pointer"
              @change="(e: Event) => { localFilters.type = (e.target as HTMLInputElement).value; applyFilters() }"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ type }}</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              :checked="!localFilters.type"
              type="radio"
              value=""
              name="type"
              class="w-4 h-4 cursor-pointer"
              @change="localFilters.type = ''; applyFilters()"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">All {{ typeLabel }}</span>
          </label>
        </div>
      </div>

      <!-- Amenities/Facilities Filter -->
      <div v-if="showAmenitiesFilter" class="space-y-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">{{ amenitiesLabel }}</label>
        <div class="space-y-1 max-h-40 overflow-y-auto">
          <label v-for="amenity in amenities" :key="amenity" class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              :checked="localFilters.amenities?.includes(amenity)"
              type="checkbox"
              :value="amenity"
              class="w-4 h-4 cursor-pointer"
              @change="toggleAmenity(amenity); applyFilters()"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ amenity }}</span>
          </label>
        </div>
      </div>

      <!-- City Filter (for Dharamshala/Bhojanshala) -->
      <div v-if="showCityFilter" class="space-y-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">City</label>
        <div class="space-y-1 max-h-40 overflow-y-auto">
          <label v-for="city in cities" :key="city" class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              :checked="localFilters.city === city"
              type="radio"
              :value="city"
              name="city"
              class="w-4 h-4 cursor-pointer"
              @change="(e: Event) => { localFilters.city = (e.target as HTMLInputElement).value; applyFilters() }"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ city }}</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              :checked="!localFilters.city"
              type="radio"
              value=""
              name="city"
              class="w-4 h-4 cursor-pointer"
              @change="localFilters.city = ''; applyFilters()"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">All Cities</span>
          </label>
        </div>
      </div>

      <!-- Cuisine Filter (for Bhojanshala) -->
      <div v-if="showCuisineFilter" class="space-y-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Cuisine</label>
        <div class="space-y-1 max-h-40 overflow-y-auto">
          <label v-for="cuisine in cuisines" :key="cuisine" class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              :checked="localFilters.cuisines?.includes(cuisine)"
              type="checkbox"
              :value="cuisine"
              class="w-4 h-4 cursor-pointer"
              @change="toggleCuisine(cuisine); applyFilters()"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ cuisine }}</span>
          </label>
        </div>
      </div>

      <!-- Dietary Options Filter (for Bhojanshala) -->
      <div v-if="showDietaryFilter" class="space-y-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300">Dietary Options</label>
        <div class="space-y-1">
          <label v-for="option in dietaryOptions" :key="option" class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
            <input
              :checked="localFilters.dietaryOptions?.includes(option)"
              type="checkbox"
              :value="option"
              class="w-4 h-4 cursor-pointer"
              @change="toggleDietaryOption(option); applyFilters()"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ option }}</span>
          </label>
        </div>
      </div>

      <!-- Vegetarian Only Filter (for Bhojanshala) -->
      <div v-if="showVegetarianFilter" class="space-y-2">
        <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
          <input
            v-model="localFilters.vegetarianOnly"
            type="checkbox"
            class="w-4 h-4 cursor-pointer"
            @change="applyFilters()"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300 font-semibold">Vegetarian Only</span>
        </label>
      </div>
    </div>

    <!-- Clear Filters Button -->
    <div class="mt-4 flex gap-2">
      <button
        @click="clearFilters"
        class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        Clear All
      </button>
      <button
        @click="$emit('close')"
        class="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  visible: { type: Boolean, default: false },
  filters: { type: Object as () => Record<string, any>, default: () => ({}) },
  states: { type: Array as () => string[], default: () => [] },
  sects: { type: Array as () => string[], default: () => [] },
  types: { type: Array as () => string[], default: () => [] },
  amenities: { type: Array as () => string[], default: () => [] },
  cities: { type: Array as () => string[], default: () => [] },
  cuisines: { type: Array as () => string[], default: () => [] },
  dietaryOptions: { type: Array as () => string[], default: () => [] },
})

const emit = defineEmits(['apply', 'close'])
const route = useRoute()

const localFilters = ref({ ...props.filters })

const showStateFilter = computed(() => route.path.startsWith('/tirth'))
const showSectFilter = computed(() => route.path.startsWith('/tirth'))
const showTypeFilter = computed(() => route.path !== '/')
const showAmenitiesFilter = computed(() => route.path.startsWith('/tirth'))
const showCityFilter = computed(() => !route.path.startsWith('/tirth'))
const showCuisineFilter = computed(() => route.path.startsWith('/bhojanshala'))
const showDietaryFilter = computed(() => route.path.startsWith('/bhojanshala'))
const showVegetarianFilter = computed(() => route.path.startsWith('/bhojanshala'))

const typeLabel = computed(() => {
  if (route.path.startsWith('/bhojanshala')) return 'Cuisine Type'
  if (route.path.startsWith('/dharamshala')) return 'Accommodation Type'
  return 'Type'
})

const amenitiesLabel = computed(() => {
  if (route.path.startsWith('/tirth')) return 'Facilities'
  return 'Amenities'
})

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
})

const applyFilters = () => {
  emit('apply', localFilters.value)
}

const clearFilters = () => {
  localFilters.value = {
    searchTerm: '',
    state: '',
    sect: '',
    type: '',
    city: '',
    amenities: [],
    cuisines: [],
    dietaryOptions: [],
    vegetarianOnly: false,
  }
  applyFilters()
}

const toggleAmenity = (amenity: string) => {
  if (!localFilters.value.amenities) {
    localFilters.value.amenities = []
  }
  const index = localFilters.value.amenities.indexOf(amenity)
  if (index > -1) {
    localFilters.value.amenities.splice(index, 1)
  } else {
    localFilters.value.amenities.push(amenity)
  }
}

const toggleCuisine = (cuisine: string) => {
  if (!localFilters.value.cuisines) {
    localFilters.value.cuisines = []
  }
  const index = localFilters.value.cuisines.indexOf(cuisine)
  if (index > -1) {
    localFilters.value.cuisines.splice(index, 1)
  } else {
    localFilters.value.cuisines.push(cuisine)
  }
}

const toggleDietaryOption = (option: string) => {
  if (!localFilters.value.dietaryOptions) {
    localFilters.value.dietaryOptions = []
  }
  const index = localFilters.value.dietaryOptions.indexOf(option)
  if (index > -1) {
    localFilters.value.dietaryOptions.splice(index, 1)
  } else {
    localFilters.value.dietaryOptions.push(option)
  }
}
</script>

<style scoped>
/* Custom scrollbar */
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

div::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

:deep(.dark div::-webkit-scrollbar-thumb) {
  background: #475569;
}

:deep(.dark div::-webkit-scrollbar-thumb:hover) {
  background: #64748b;
}
</style>
