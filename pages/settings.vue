<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors"
      >
        <Icon name="ArrowLeft" :size="20" />
        Back to Home
      </NuxtLink>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p class="text-gray-600">Customize your app experience</p>
      </div>

      <!-- Notifications Section -->
      <div class="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden mb-6">
        <!-- Section Header -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 sm:px-8 py-5 flex items-center gap-3">
          <Icon name="Bell" :size="24" class="text-white" />
          <div>
            <h2 class="text-white text-xl font-bold">Notifications</h2>
            <p class="text-blue-100 text-sm">Manage your notification preferences</p>
          </div>
        </div>

        <!-- Settings Content -->
        <div class="p-6 sm:p-8 space-y-6">
          <!-- Event Notifications Toggle -->
          <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 transition-all hover:shadow-md">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 mb-1">Events Notifications</h3>
              <p class="text-sm text-gray-600">Get notified about new events and updates</p>
            </div>
            <div class="ml-4">
              <button 
                @click="settings.eventNotifications = !settings.eventNotifications"
                :class="[
                  'relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300',
                  settings.eventNotifications 
                    ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                    : 'bg-gray-300'
                ]"
              >
                <span 
                  :class="[
                    'inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300',
                    settings.eventNotifications ? 'translate-x-7' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
          </div>

          <!-- Event Notifications Status -->
          <div class="flex items-center gap-2 text-sm">
            <span 
              :class="[
                'inline-block w-3 h-3 rounded-full',
                settings.eventNotifications ? 'bg-green-500' : 'bg-gray-400'
              ]"
            ></span>
            <span 
              :class="settings.eventNotifications ? 'text-green-700 font-medium' : 'text-gray-600'"
            >
              {{ settings.eventNotifications ? 'Notifications Enabled' : 'Notifications Disabled' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Theme Section -->
      <div class="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
        <!-- Section Header -->
        <div class="bg-gradient-to-r from-purple-500 to-purple-600 px-6 sm:px-8 py-5 flex items-center gap-3">
          <Icon name="Palette" :size="24" class="text-white" />
          <div>
            <h2 class="text-white text-xl font-bold">Theme</h2>
            <p class="text-purple-100 text-sm">Choose your preferred color theme</p>
          </div>
        </div>

        <!-- Theme Options -->
        <div class="p-6 sm:p-8 space-y-4">
          <!-- Light Theme -->
          <button 
            @click="settings.theme = 'light'"
            :class="[
              'w-full p-4 rounded-xl border-2 transition-all duration-300 text-left',
              settings.theme === 'light'
                ? 'border-yellow-400 bg-yellow-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-yellow-300'
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Icon name="Sun" :size="24" :class="settings.theme === 'light' ? 'text-yellow-600' : 'text-gray-600'" />
                <div>
                  <h3 class="font-semibold text-gray-900">Light Theme</h3>
                  <p class="text-sm text-gray-600">Bright and clean interface</p>
                </div>
              </div>
              <div 
                :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  settings.theme === 'light'
                    ? 'border-yellow-400 bg-yellow-400'
                    : 'border-gray-300'
                ]"
              >
                <Icon v-if="settings.theme === 'light'" name="Check" :size="14" class="text-white" />
              </div>
            </div>
          </button>

          <!-- Dark Theme -->
          <button 
            @click="settings.theme = 'dark'"
            :class="[
              'w-full p-4 rounded-xl border-2 transition-all duration-300 text-left',
              settings.theme === 'dark'
                ? 'border-gray-700 bg-gray-900 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-400'
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Icon 
                  name="Moon" 
                  :size="24" 
                  :class="settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-600'" 
                />
                <div :class="settings.theme === 'dark' ? 'text-white' : 'text-gray-900'">
                  <h3 class="font-semibold">Dark Theme</h3>
                  <p :class="settings.theme === 'dark' ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'">
                    Dark and comfortable interface
                  </p>
                </div>
              </div>
              <div 
                :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                  settings.theme === 'dark'
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-300'
                ]"
              >
                <Icon v-if="settings.theme === 'dark'" name="Check" :size="14" class="text-white" />
              </div>
            </div>
          </button>
        </div>

        <!-- Theme Preview -->
        <div class="px-6 sm:px-8 pb-8">
          <div class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-3">Preview:</p>
            <div 
              :class="[
                'p-4 rounded-lg border-2',
                settings.theme === 'light'
                  ? 'bg-white border-yellow-200'
                  : 'bg-gray-900 border-gray-700'
              ]"
            >
              <p 
                :class="[
                  'text-sm font-medium',
                  settings.theme === 'light' ? 'text-gray-900' : 'text-white'
                ]"
              >
                This is how your theme will look
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Saved Settings Message -->
      <Transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div v-if="savedMessage" class="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <Icon name="Check" :size="24" class="text-green-600 flex-shrink-0" />
          <span class="text-green-700 font-medium">{{ savedMessage }}</span>
        </div>
      </Transition>

      <!-- Info Card -->
      <div class="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div class="flex items-start gap-3">
          <Icon name="Info" :size="20" class="text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">Settings Auto-Save</h3>
            <p class="text-sm text-gray-600">Your preferences are saved automatically as you make changes.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

definePageMeta({
  layout: 'default',
})

const savedMessage = ref('')

const settings = ref({
  eventNotifications: true,
  theme: 'light' as 'light' | 'dark',
})

// Auto-save settings
watch(settings, (newSettings) => {
  savedMessage.value = 'Settings saved!'
  
  // Save to localStorage
  localStorage.setItem('appSettings', JSON.stringify(newSettings))
  
  setTimeout(() => {
    savedMessage.value = ''
  }, 2000)
}, { deep: true })

// Load settings on mount
onMounted(() => {
  const saved = localStorage.getItem('appSettings')
  if (saved) {
    settings.value = JSON.parse(saved)
  }
})
</script>
