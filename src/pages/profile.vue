<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 py-2 sm:py-6 md:py-8">
    <div class="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold mb-3 sm:mb-6 md:mb-8 transition-colors text-xs sm:text-base"
      >
        <Icon name="ArrowLeft" :size="16" />
        <span class="hidden sm:inline">Back</span>
      </NuxtLink>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <svg class="animate-spin h-10 w-10 text-red-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Loading profile...</p>
        </div>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="mb-3 sm:mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-0.5">
              Profile
            </h1>
            <p class="text-xs sm:text-sm lg:text-base text-gray-600 hidden sm:block">Manage your information</p>
          </div>
          <!-- Logout Button -->
          <button 
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="px-3 py-1.5 sm:px-4 sm:py-2 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-50 transition-all duration-300 flex items-center gap-1.5 text-xs sm:text-sm disabled:opacity-50"
          >
            <Icon name="LogOut" :size="16" />
            <span class="hidden sm:inline">{{ isLoggingOut ? 'Signing out...' : 'Sign Out' }}</span>
          </button>
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
                  <h2 class="text-white text-base sm:text-2xl md:text-3xl font-bold truncate">{{ editMode ? 'Edit Profile' : displayName }}</h2>
                  <p class="text-red-100 text-xs sm:text-sm md:text-base truncate hidden sm:block">{{ profile.email }}</p>
                </div>
              </div>

              <!-- Profile Content -->
              <div class="p-3 sm:p-6 md:p-8 space-y-3 md:space-y-6">
                <!-- Name Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                  <!-- First Name Field -->
                  <div class="space-y-1">
                    <label class="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">First Name</label>
                    <input 
                      v-model="profile.firstName"
                      :disabled="!editMode"
                      type="text"
                      placeholder="First Name"
                      class="w-full px-2.5 py-1.5 sm:px-4 sm:py-3 md:py-4 rounded-lg border-2 text-xs sm:text-sm md:text-base transition-all duration-300"
                      :class="editMode 
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'"
                    />
                  </div>

                  <!-- Last Name Field -->
                  <div class="space-y-1">
                    <label class="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">Last Name</label>
                    <input 
                      v-model="profile.lastName"
                      :disabled="!editMode"
                      type="text"
                      placeholder="Last Name"
                      class="w-full px-2.5 py-1.5 sm:px-4 sm:py-3 md:py-4 rounded-lg border-2 text-xs sm:text-sm md:text-base transition-all duration-300"
                      :class="editMode 
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'"
                    />
                  </div>
                </div>

                <!-- Email Field (Read-only) -->
                <div class="space-y-1">
                  <label class="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">Email</label>
                  <input 
                    v-model="profile.email"
                    disabled
                    type="email"
                    class="w-full px-2.5 py-1.5 sm:px-4 sm:py-3 md:py-4 rounded-lg border-2 text-xs sm:text-sm md:text-base border-gray-200 bg-gray-50 cursor-not-allowed"
                  />
                  <p class="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <!-- Phone Field -->
                <div class="space-y-1">
                  <label class="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">Phone</label>
                  <input 
                    v-model="profile.phone"
                    :disabled="!editMode"
                    type="tel"
                    placeholder="Phone Number"
                    class="w-full px-2.5 py-1.5 sm:px-4 sm:py-3 md:py-4 rounded-lg border-2 text-xs sm:text-sm md:text-base transition-all duration-300"
                    :class="editMode 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'"
                  />
                </div>

                <!-- Sect Field -->
                <div class="space-y-1">
                  <label class="block text-xs sm:text-sm md:text-base font-semibold text-gray-700">Sect</label>
                  <select 
                    v-model="profile.sect"
                    :disabled="!editMode"
                    class="w-full px-2.5 py-1.5 sm:px-4 sm:py-3 md:py-4 rounded-lg border-2 text-xs sm:text-sm md:text-base transition-all duration-300"
                    :class="editMode 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'"
                  >
                    <option value="">Select your sect</option>
                    <option value="Shwetambar">Shwetambar</option>
                    <option value="Digambar">Digambar</option>
                  </select>
                </div>

                <!-- Error Message -->
                <Transition
                  enter-active-class="transition-all duration-300"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-200"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                >
                  <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-4 flex items-center gap-2 text-xs sm:text-base">
                    <Icon name="AlertCircle" :size="14" class="text-red-600 flex-shrink-0 sm:w-5 sm:h-5" />
                    <span class="text-red-700 font-medium text-xs sm:text-sm">{{ errorMessage }}</span>
                  </div>
                </Transition>

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
                    <span class="hidden sm:inline">Edit Profile</span>
                    <span class="sm:hidden">Edit</span>
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
                      :disabled="isSaving"
                      class="flex-1 px-3 py-1.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1 shadow-lg hover:shadow-xl text-xs sm:text-base md:text-lg disabled:opacity-50 disabled:transform-none"
                    >
                      <Icon v-if="!isSaving" name="Check" :size="14" class="sm:w-5 sm:h-5" />
                      <svg v-else class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      <span class="hidden sm:inline">{{ isSaving ? 'Saving...' : 'Save' }}</span>
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
                  <p class="text-xs md:text-sm text-gray-600">Keep your information up to date. Your data is secure with us.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const router = useRouter()
const { user, signOut, getCustomerProfile, updateCustomerProfile, initialize } = useAuth()

const editMode = ref(false)
const isLoading = ref(true)
const isSaving = ref(false)
const isLoggingOut = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  sect: '',
})

const originalProfile = ref({ ...profile.value })

const displayName = computed(() => {
  const firstName = profile.value.firstName || ''
  const lastName = profile.value.lastName || ''
  if (firstName || lastName) {
    return `${firstName} ${lastName}`.trim()
  }
  return 'User'
})

// Load profile data on mount
onMounted(async () => {
  await initialize()
  
  if (user.value) {
    profile.value.email = user.value.email || ''
    
    // Fetch customer profile from database
    const result = await getCustomerProfile(user.value.id)
    
    if (result.success && result.data) {
      profile.value.firstName = result.data.customer_first_name || ''
      profile.value.lastName = result.data.customer_last_name || ''
      profile.value.phone = result.data.customer_mobile?.toString() || ''
      profile.value.sect = result.data.customer_sect || ''
    }
    
    originalProfile.value = { ...profile.value }
  }
  
  isLoading.value = false
})

const cancelEdit = () => {
  profile.value = { ...originalProfile.value }
  editMode.value = false
  successMessage.value = ''
  errorMessage.value = ''
}

const saveDetails = async () => {
  if (!user.value) return
  
  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const result = await updateCustomerProfile(user.value.id, {
      customer_first_name: profile.value.firstName || undefined,
      customer_last_name: profile.value.lastName || undefined,
      customer_mobile: profile.value.phone ? parseInt(profile.value.phone.replace(/\D/g, '')) : undefined,
      customer_sect: profile.value.sect || undefined,
    })

    if (result.success) {
      originalProfile.value = { ...profile.value }
      editMode.value = false
      successMessage.value = 'Profile updated successfully!'
      
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      errorMessage.value = result.error || 'Failed to update profile. Please try again.'
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'An unexpected error occurred.'
  } finally {
    isSaving.value = false
  }
}

const handleLogout = async () => {
  isLoggingOut.value = true
  
  try {
    await signOut()
    router.push('/')
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    isLoggingOut.value = false
  }
}
</script>
