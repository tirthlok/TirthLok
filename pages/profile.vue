<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 py-2 sm:py-6 md:py-8">
    <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold mb-3 sm:mb-6 md:mb-8 transition-colors text-xs sm:text-base"
      >
        <Icon name="ArrowLeft" :size="16" />
        <span class="hidden sm:inline">Back</span>
      </NuxtLink>

      <!-- Header -->
      <div class="mb-3 sm:mb-6 md:mb-8">
        <h1 class="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-0.5">
          Profile
        </h1>
        <p class="text-xs sm:text-sm lg:text-base text-gray-600 hidden sm:block">Manage your information</p>
      </div>

      <!-- Desktop Layout: Two Column -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <!-- Left Column: Profile Card -->
        <div class="lg:col-span-2">
          <!-- Profile Card -->
          <div class="bg-white rounded-lg shadow-lg border border-red-100 overflow-hidden">
            <!-- Profile Header with Avatar -->
            <div class="bg-gradient-to-r from-red-500 to-red-600 px-3 sm:px-8 py-4 sm:py-6 md:py-8 flex items-end gap-2.5 md:gap-4">
              <div class="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <Icon name="User" :size="32" class="text-red-600 sm:scale-100 md:scale-125" />
              </div>
              <div class="min-w-0 flex-1">
                <h2 class="text-white text-base sm:text-2xl md:text-3xl font-bold truncate">{{ editMode ? 'Edit' : 'Profile' }}</h2>
                <p class="text-red-100 text-xs sm:text-sm md:text-base truncate hidden sm:block">{{ editMode ? 'Update info' : 'Manage details' }}</p>
              </div>
            </div>

            <!-- Profile Content -->
            <div class="p-3 sm:p-6 md:p-8 space-y-3 md:space-y-6">
              <!-- Name and Email Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <!-- Name Field -->
                <div class="space-y-1">
                  <label class="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">Name</label>
                  <input 
                    v-model="profile.name"
                    :disabled="!editMode"
                    type="text"
                    placeholder="Name"
                    class="w-full px-2.5 py-1.5 sm:px-4 sm:py-3 md:py-4 rounded-lg border-2 text-xs sm:text-sm md:text-base transition-all duration-300"
                    :class="editMode 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'"
                  />
                </div>

                <!-- Email Field -->
                <div class="space-y-1">
                  <label class="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">Email</label>
                  <input 
                    v-model="profile.email"
                    :disabled="!editMode"
                    type="email"
                    placeholder="Email"
                    class="w-full px-2.5 py-1.5 sm:px-4 sm:py-3 md:py-4 rounded-lg border-2 text-xs sm:text-sm md:text-base transition-all duration-300"
                    :class="editMode 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'"
                  />
                </div>
              </div>

              <!-- Phone Field (Full Width) -->
              <div class="space-y-1">
                <label class="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">Phone</label>
                <input 
                  v-model="profile.phone"
                  :disabled="!editMode"
                  type="tel"
                  placeholder="Phone"
                  class="w-full px-2.5 py-1.5 sm:px-4 sm:py-3 md:py-4 rounded-lg border-2 text-xs sm:text-sm md:text-base transition-all duration-300"
                  :class="editMode 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white' 
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'"
                />
              </div>

              <!-- Success Message -->
              <Transition
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-4 flex items-center gap-2 text-xs sm:text-base">
                  <Icon name="Check" :size="14" class="text-green-600 flex-shrink-0 sm:w-5 sm:h-5" />
                  <span class="text-green-700 font-medium text-xs sm:text-sm">{{ successMessage }}</span>
                </div>
              </Transition>

              <!-- Action Buttons -->
              <div class="flex gap-1.5 pt-2 sm:gap-3 sm:pt-4 md:gap-4 md:pt-6 border-t">
                <button 
                  v-if="!editMode"
                  @click="editMode = true"
                  class="flex-1 px-3 py-1.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1 shadow-lg hover:shadow-xl text-xs sm:text-base md:text-lg"
                >
                  <Icon name="Edit" :size="14" class="sm:w-5 sm:h-5" />
                  <span class="hidden sm:inline">Edit</span>
                </button>
                <template v-else>
                  <button 
                    @click="cancelEdit"
                    class="flex-1 px-3 py-1.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-1 text-xs sm:text-base md:text-lg"
                  >
                    <Icon name="X" :size="14" class="sm:w-5 sm:h-5" />
                    <span class="hidden sm:inline">Cancel</span>
                  </button>
                  <button 
                    @click="saveDetails"
                    class="flex-1 px-3 py-1.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1 shadow-lg hover:shadow-xl text-xs sm:text-base md:text-lg"
                  >
                    <Icon name="Check" :size="14" class="sm:w-5 sm:h-5" />
                    <span class="hidden sm:inline">Save</span>
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Info Card - Hidden on Mobile -->
        <div class="hidden lg:block lg:col-span-1">
          <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3 sm:p-4 md:p-6 border border-red-200 h-fit sticky top-4">
            <div class="flex items-start gap-2 sm:gap-3">
              <Icon name="Info" :size="20" class="text-red-600 mt-0.5 flex-shrink-0 md:scale-125 md:mt-1" />
              <div class="min-w-0">
                <h3 class="font-semibold text-gray-900 mb-0.5 text-sm md:text-base">Account Info</h3>
                <p class="text-xs md:text-sm text-gray-600">Keep information up to date. Data is secure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'default',
})

const editMode = ref(false)
const successMessage = ref('')

const profile = ref({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 98765 43210',
})

const originalProfile = ref({ ...profile.value })

const cancelEdit = () => {
  profile.value = { ...originalProfile.value }
  editMode.value = false
  successMessage.value = ''
}

const saveDetails = () => {
  originalProfile.value = { ...profile.value }
  editMode.value = false
  successMessage.value = 'Profile updated successfully!'
  
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}
</script>
