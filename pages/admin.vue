<template>
  <div class="min-h-screen bg-gradient-to-b from-cream to-white py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal">Admin Dashboard</h1>
        <p class="text-light-gray text-sm md:text-base mt-1">Manage temples and facilities</p>
      </div>
      <button
        @click="showAddForm = true"
        class="w-full sm:w-auto px-4 py-2 bg-sage text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center sm:justify-start gap-2 text-sm md:text-base"
      >
        <Icon name="Plus" :size="20" />
        Add Tirth
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <!-- Total Temples -->
      <div class="bg-white rounded-lg shadow-sm p-3 sm:p-6 border-l-4 border-sage">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs sm:text-sm text-light-gray font-medium mb-1">Total Temples</p>
            <p class="text-xl sm:text-3xl font-bold text-charcoal">{{ totalTirths }}</p>
          </div>
          <Icon name="Building2" :size="32" class="text-sage hidden sm:block opacity-50" />
        </div>
      </div>

      <!-- Shwetambar Count -->
      <div class="bg-white rounded-lg shadow-sm p-3 sm:p-6 border-l-4 border-saffron">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs sm:text-sm text-light-gray font-medium mb-1">Shwetambar</p>
            <p class="text-xl sm:text-3xl font-bold text-charcoal">{{ shwetambarCount }}</p>
          </div>
          <Icon name="Users" :size="32" class="text-saffron hidden sm:block opacity-50" />
        </div>
      </div>

      <!-- Digambar Count -->
      <div class="bg-white rounded-lg shadow-sm p-3 sm:p-6 border-l-4 border-charcoal">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs sm:text-sm text-light-gray font-medium mb-1">Digambar</p>
            <p class="text-xl sm:text-3xl font-bold text-charcoal">{{ digambarCount }}</p>
          </div>
          <Icon name="Users2" :size="32" class="text-charcoal hidden sm:block opacity-50" />
        </div>
      </div>

      <!-- Total Facilities -->
      <div class="bg-white rounded-lg shadow-sm p-3 sm:p-6 border-l-4 border-sage">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs sm:text-sm text-light-gray font-medium mb-1">Facilities</p>
            <p class="text-xl sm:text-3xl font-bold text-charcoal">{{ totalFacilities }}</p>
          </div>
          <Icon name="MapPin" :size="32" class="text-sage hidden sm:block opacity-50" />
        </div>
      </div>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="showAddForm" class="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border-l-4 border-sage">
      <h2 class="text-lg sm:text-2xl font-bold text-charcoal mb-4">
        {{ editingTirth ? 'Edit Tirth' : 'Add New Tirth' }}
      </h2>

      <form @submit.prevent="saveTirth" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-charcoal mb-2">Tirth Name</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-sage focus:ring-2 focus:ring-sage focus:ring-opacity-20 outline-none text-xs sm:text-sm"
              placeholder="Enter tirth name"
            />
          </div>
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-charcoal mb-2">State</label>
            <input
              v-model="formData.state"
              type="text"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-sage focus:ring-2 focus:ring-sage focus:ring-opacity-20 outline-none text-xs sm:text-sm"
              placeholder="Enter state"
            />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-sage text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors text-sm md:text-base"
          >
            Save Tirth
          </button>
          <button
            type="button"
            @click="showAddForm = false"
            class="flex-1 px-4 py-2 bg-cream text-charcoal font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Tirth Management Table -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm md:text-base">
          <thead class="bg-charcoal text-white">
            <tr>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase">Name</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase hidden sm:table-cell">Location</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase hidden md:table-cell">Sect</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="tirth in tithStore.tirths" :key="tirth.id" class="hover:bg-cream transition-colors">
              <td class="px-3 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-charcoal truncate">{{ tirth.name }}</td>
              <td class="px-3 sm:px-6 py-4 text-xs sm:text-sm text-light-gray hidden sm:table-cell">{{ tirth.location.city }}, {{ tirth.location.state }}</td>
              <td class="px-3 sm:px-6 py-4 text-xs sm:text-sm text-light-gray hidden md:table-cell">{{ tirth.sect }}</td>
              <td class="px-3 sm:px-6 py-4 text-xs sm:text-sm space-x-1 sm:space-x-2">
                <button
                  @click="editTirth(tirth)"
                  class="text-sage hover:text-opacity-80 font-semibold transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="deleteTirth(tirth.id)"
                  class="text-red-600 hover:text-red-800 font-semibold transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="tithStore.tirths.length === 0" class="text-center py-12">
        <Icon name="AlertCircle" :size="48" class="text-light-gray mx-auto mb-4" />
        <p class="text-light-gray text-sm md:text-base">No temples found. Create one to get started.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTirthStore } from '~/stores/tirth'
import type { Tirth } from '~/types/models'

definePageMeta({
  layout: 'default',
})

const tithStore = useTirthStore()
const showAddForm = ref(false)
const editingTirth = ref<Tirth | null>(null)
const formData = reactive({
  name: '',
  state: '',
})

const totalTirths = computed(() => tithStore.tirths.length)
const shwetambarCount = computed(() => tithStore.tirths.filter((t) => t.sect === 'Shwetambar').length)
const digambarCount = computed(() => tithStore.tirths.filter((t) => t.sect === 'Digambar').length)
const totalFacilities = computed(() => {
  return tithStore.tirths.reduce((total, t) => total + t.facilities.length, 0)
})

const editTirth = (tirth: Tirth) => {
  editingTirth.value = tirth
  formData.name = tirth.name
  formData.state = tirth.location.state
  showAddForm.value = true
}

const saveTirth = async () => {
  // TODO: Implement save logic
  showAddForm.value = false
  editingTirth.value = null
}

const deleteTirth = (id: string) => {
  if (confirm('Are you sure you want to delete this tirth?')) {
    // TODO: Implement delete logic
  }
}

onMounted(async () => {
  if (tithStore.tirths.length === 0) {
    await tithStore.fetchTirths()
  }
})
</script>
