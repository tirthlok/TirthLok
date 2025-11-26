<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold mb-6 transition-colors"
      >
        <Icon name="ArrowLeft" :size="20" />
        Back to Home
      </NuxtLink>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2">
          Profile
        </h1>
        <p class="text-gray-600">Manage your personal information</p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
        <!-- Profile Header with Avatar -->
        <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 sm:px-8 py-8 flex items-end gap-4">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Icon name="User" :size="40" class="text-red-600" />
          </div>
          <div>
            <h2 class="text-white text-2xl font-bold">{{ editMode ? 'Edit Profile' : 'Your Profile' }}</h2>
            <p class="text-red-100 text-sm">{{ editMode ? 'Update your information' : 'View and manage details' }}</p>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="p-6 sm:p-8 space-y-6">
          <!-- Name Field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Full Name</label>
            <input 
              v-model="profile.name"
              :disabled="!editMode"
              type="text"
              placeholder="Enter your full name"
              class="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300"
              :class="editMode 
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white' 
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'"
            />
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Email ID</label>
            <input 
              v-model="profile.email"
              :disabled="!editMode"
              type="email"
              placeholder="Enter your email"
              class="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300"
              :class="editMode 
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white' 
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'"
            />
          </div>

          <!-- Phone Field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">Phone Number</label>
            <input 
              v-model="profile.phone"
              :disabled="!editMode"
              type="tel"
              placeholder="Enter your phone number"
              class="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300"
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
            <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <Icon name="Check" :size="20" class="text-green-600" />
              <span class="text-green-700 font-medium">{{ successMessage }}</span>
            </div>
          </Transition>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t">
            <button 
              v-if="!editMode"
              @click="editMode = true"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Icon name="Edit" :size="18" />
              Edit Details
            </button>
            <template v-else>
              <button 
                @click="cancelEdit"
                class="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Icon name="X" :size="18" />
                Cancel
              </button>
              <button 
                @click="saveDetails"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Icon name="Check" :size="18" />
                Save Details
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-8 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
        <div class="flex items-start gap-3">
          <Icon name="Info" :size="20" class="text-red-600 mt-1 flex-shrink-0" />
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">Account Information</h3>
            <p class="text-sm text-gray-600">Keep your profile information up to date to ensure smooth experience. Your data is secure and private.</p>
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
