<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 py-4 sm:py-6 md:py-8">
    <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 sm:mb-6 md:mb-8 transition-colors text-sm sm:text-base"
      >
        <Icon name="ArrowLeft" :size="18" />
        Back
      </NuxtLink>

      <!-- Header -->
      <div class="mb-4 sm:mb-6 md:mb-8">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-1">
          Settings
        </h1>
        <p class="text-xs sm:text-sm lg:text-base text-gray-600">Customize your experience</p>
      </div>

      <!-- Desktop Layout: Two Column -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Left Column: Settings Cards -->
        <div class="lg:col-span-2 space-y-6 md:space-y-8">
          <!-- Notifications Section -->
          <div class="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
            <!-- Section Header -->
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-8 py-4 sm:py-5 md:py-6 flex items-center gap-2 sm:gap-3">
              <Icon name="Bell" :size="24" class="text-white flex-shrink-0 md:scale-125" />
              <div class="min-w-0">
                <h2 class="text-white text-base sm:text-xl md:text-2xl font-bold truncate">Notifications</h2>
                <p class="text-blue-100 text-xs sm:text-sm md:text-base truncate">Manage preferences</p>
              </div>
            </div>

            <!-- Settings Content -->
            <div class="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 md:space-y-6">
              <!-- Event Notifications Toggle -->
              <div class="flex items-center justify-between p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 transition-all hover:shadow-md">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 text-sm md:text-base">Events Notifications</h3>
                  <p class="text-xs md:text-sm text-gray-600">Get notified about updates</p>
                </div>
                <div class="ml-3 flex-shrink-0">
                  <button 
                    @click="settings.eventNotifications = !settings.eventNotifications"
                    :class="[
                      'relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 md:h-9 md:w-20',
                      settings.eventNotifications 
                        ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                        : 'bg-gray-300'
                    ]"
                  >
                    <span 
                      :class="[
                        'inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 md:h-7 md:w-7',
                        settings.eventNotifications ? 'translate-x-9 md:translate-x-12' : 'translate-x-1'
                      ]"
                    />
                  </button>
                </div>
              </div>

              <!-- Event Notifications Status -->
              <div class="flex items-center gap-2 text-xs sm:text-sm md:text-base">
                <span 
                  :class="[
                    'inline-block w-3 h-3 rounded-full flex-shrink-0 md:w-4 md:h-4',
                    settings.eventNotifications ? 'bg-green-500' : 'bg-gray-400'
                  ]"
                ></span>
                <span 
                  :class="settings.eventNotifications ? 'text-green-700 font-medium' : 'text-gray-600'"
                >
                  {{ settings.eventNotifications ? 'Enabled' : 'Disabled' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Theme Section -->
          <div class="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden">
            <!-- Section Header -->
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 px-4 sm:px-8 py-4 sm:py-5 md:py-6 flex items-center gap-2 sm:gap-3">
              <Icon name="Palette" :size="24" class="text-white flex-shrink-0 md:scale-125" />
              <div class="min-w-0">
                <h2 class="text-white text-base sm:text-xl md:text-2xl font-bold truncate">Theme</h2>
                <p class="text-purple-100 text-xs sm:text-sm md:text-base truncate">Choose theme</p>
              </div>
            </div>

            <!-- Theme Options -->
            <div class="p-4 sm:p-6 md:p-8 space-y-2 sm:space-y-3 md:space-y-4">
              <!-- Light Theme -->
              <button 
                @click="settings.theme = 'light'"
                :class="[
                  'w-full p-3 sm:p-4 md:p-6 rounded-lg border-2 transition-all duration-300 text-left',
                  settings.theme === 'light'
                    ? 'border-yellow-400 bg-yellow-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-yellow-300'
                ]"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                    <Icon name="Sun" :size="24" :class="`${settings.theme === 'light' ? 'text-yellow-600' : 'text-gray-600'} md:scale-150`" />
                    <div class="min-w-0">
                      <h3 class="font-semibold text-gray-900 text-sm md:text-base truncate">Light Theme</h3>
                      <p class="text-xs md:text-sm text-gray-600 truncate">Bright interface</p>
                    </div>
                  </div>
                  <div 
                    :class="[
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 md:w-6 md:h-6',
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
                  'w-full p-3 sm:p-4 md:p-6 rounded-lg border-2 transition-all duration-300 text-left',
                  settings.theme === 'dark'
                    ? 'border-gray-700 bg-gray-900 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                ]"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                    <Icon 
                      name="Moon" 
                      :size="24" 
                      :class="`${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} md:scale-150`"
                    />
                    <div :class="[settings.theme === 'dark' ? 'text-white' : 'text-gray-900', 'min-w-0']">
                      <h3 class="font-semibold text-sm md:text-base truncate">Dark Theme</h3>
                      <p :class="[settings.theme === 'dark' ? 'text-gray-400 text-xs md:text-sm' : 'text-gray-600 text-xs md:text-sm', 'truncate']">
                        Dark interface
                      </p>
                    </div>
                  </div>
                  <div 
                    :class="[
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 md:w-6 md:h-6',
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
          </div>
        </div>

        <!-- Right Column: Info Cards -->
        <div class="lg:col-span-1 space-y-6 md:space-y-8">
          <!-- Saved Settings Message -->
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
          >
            <div v-if="savedMessage" class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 md:p-4 flex items-center gap-2 text-sm md:text-base">
              <Icon name="Check" :size="20" class="text-green-600 flex-shrink-0" />
              <span class="text-green-700 font-medium">{{ savedMessage }}</span>
            </div>
          </Transition>

          <!-- Info Card -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 md:p-4 border border-blue-200 h-fit sticky top-4">
            <div class="flex items-start gap-2 md:gap-3">
              <Icon name="Info" :size="20" class="text-blue-600 mt-0.5 flex-shrink-0 md:scale-125 md:mt-1" />
              <div class="min-w-0">
                <h3 class="font-semibold text-gray-900 mb-0.5 text-sm md:text-base">Auto-Save</h3>
                <p class="text-xs md:text-sm text-gray-600">Preferences save automatically as you make changes.</p>
              </div>
            </div>
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
