<template>
  <div class="profile-page">
    <div class="profile-wrapper">
      <!-- Back Button -->
      <NuxtLink to="/" class="profile-back-btn">
        <Icon name="ArrowLeft" :size="16" />
        <span>Back</span>
      </NuxtLink>

      <!-- Loading State -->
      <div v-if="isLoading" class="profile-loading">
        <div class="profile-loading__spinner"></div>
        <p class="profile-loading__text">Loading profile...</p>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="profile-header">
          <div class="profile-header__title-group">
            <h1 class="profile-header__title">Profile</h1>
            <p class="profile-header__subtitle">Manage your information</p>
          </div>
          <!-- Logout Button -->
          <button 
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="profile-logout-btn"
          >
            <Icon name="LogOut" :size="16" />
            <span class="hidden sm:inline">{{ isLoggingOut ? 'Signing out...' : 'Sign Out' }}</span>
          </button>
        </div>

        <!-- Main Grid Layout -->
        <div class="profile-grid">
          <!-- Profile Card -->
          <div class="profile-card">
            <!-- Profile Header with Avatar -->
            <div class="profile-card__header">
              <div class="profile-avatar">
                <Icon name="User" :size="28" />
              </div>
              <div class="profile-userinfo">
                <h2 class="profile-userinfo__name">{{ editMode ? 'Edit Profile' : displayName }}</h2>
                <p class="profile-userinfo__email">{{ profile.email }}</p>
              </div>
            </div>

            <!-- Profile Form Content -->
            <div class="profile-card__body">
              <!-- Name Row (Two columns on tablet+) -->
              <div class="profile-form__row profile-form__row--half">
                <!-- First Name Field -->
                <div class="profile-form__group">
                  <label class="profile-form__label">First Name</label>
                  <input 
                    v-model="profile.firstName"
                    :disabled="!editMode"
                    type="text"
                    placeholder="First Name"
                    class="profile-form__input"
                    :class="editMode ? 'profile-form__input--editable' : ''"
                  />
                </div>

                <!-- Last Name Field -->
                <div class="profile-form__group">
                  <label class="profile-form__label">Last Name</label>
                  <input 
                    v-model="profile.lastName"
                    :disabled="!editMode"
                    type="text"
                    placeholder="Last Name"
                    class="profile-form__input"
                    :class="editMode ? 'profile-form__input--editable' : ''"
                  />
                </div>
              </div>

              <!-- Email and Phone Row (Two columns on tablet+) -->
              <div class="profile-form__row profile-form__row--half">
                <!-- Email Field (Read-only) -->
                <div class="profile-form__group">
                  <label class="profile-form__label">Email</label>
                  <input 
                    v-model="profile.email"
                    disabled
                    type="email"
                    class="profile-form__input"
                  />
                  <p class="profile-form__hint">Email cannot be changed</p>
                </div>

                <!-- Phone Field -->
                <div class="profile-form__group">
                  <label class="profile-form__label">Phone</label>
                  <input 
                    v-model="profile.phone"
                    :disabled="!editMode"
                    type="tel"
                    placeholder="Phone Number"
                    class="profile-form__input"
                    :class="editMode ? 'profile-form__input--editable' : ''"
                  />
                </div>
              </div>

              <!-- Sect Field -->
              <div class="profile-form__group">
                <label class="profile-form__label">Sect</label>
                <select 
                  v-model="profile.sect"
                  :disabled="!editMode"
                  class="profile-form__input"
                  :class="editMode ? 'profile-form__input--editable' : ''"
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
                <div v-if="errorMessage" class="profile-alert profile-alert--error">
                  <Icon name="AlertCircle" :size="14" />
                  <span>{{ errorMessage }}</span>
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
                <div v-if="successMessage" class="profile-alert profile-alert--success">
                  <Icon name="Check" :size="14" />
                  <span>{{ successMessage }}</span>
                </div>
              </Transition>

              <!-- Action Buttons -->
              <div class="profile-actions">
                <button 
                  v-if="!editMode"
                  @click="editMode = true"
                  class="profile-btn profile-btn--primary"
                >
                  <Icon name="Edit" :size="14" />
                  <span>Edit Profile</span>
                </button>
                <template v-else>
                  <button 
                    @click="cancelEdit"
                    class="profile-btn profile-btn--secondary"
                  >
                    <Icon name="X" :size="14" />
                    <span>Cancel</span>
                  </button>
                  <button 
                    @click="saveDetails"
                    :disabled="isSaving"
                    class="profile-btn profile-btn--success"
                  >
                    <Icon v-if="!isSaving" name="Check" :size="14" />
                    <svg v-else class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
                  </button>
                </template>
              </div>
            </div>
          </div>

          <!-- Info Card - Sidebar on Desktop -->
          <div class="profile-info-card">
            <div class="profile-info-card__content">
              <Icon name="Info" :size="20" class="profile-info-card__icon" />
              <div class="profile-info-card__text">
                <h3>Account Info</h3>
                <p>Keep your information up to date. Your data is secure with us.</p>
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
import { useAuth } from '~/composables/auth/useAuth'

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
