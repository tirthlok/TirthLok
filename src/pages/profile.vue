<template>
  <div class="profile-page">
    <div class="profile-page-bg">
      <div class="cosmic-mesh"></div>
      <div class="cosmic-glow cosmic-glow-1"></div>
      <div class="cosmic-glow cosmic-glow-2"></div>
      <div class="cosmic-glow cosmic-glow-3"></div>
      <div class="cosmic-particles">
        <div 
          v-for="n in 60" 
          :key="n" 
          class="particle"
          :style="{
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animationDelay: (Math.random() * 15) + 's',
            animationDuration: (10 + Math.random() * 20) + 's'
          }"
        ></div>
      </div>
    </div>

    <div class="profile-wrapper">
      <!-- Top Navigation -->
      <nav class="profile-nav">
        <NuxtLink to="/" class="profile-nav__back">
          <Icon name="ArrowLeft" :size="20" />
          <span>Explore</span>
        </NuxtLink>
        <div class="profile-nav__actions">
             <button 
              @click="handleLogout"
              :disabled="isLoggingOut"
              class="profile-nav__logout"
              title="Sign Out"
            >
              <Icon name="LogOut" :size="18" />
              <span>{{ isLoggingOut ? '...' : 'Sign Out' }}</span>
            </button>
        </div>
      </nav>

      <!-- Loading State: Out of the Universe -->
      <div v-if="isLoading" class="profile-loading-screen">
        <div class="nebula-overlay"></div>
        <div class="nebula-overlay nebula-overlay--alt"></div>
        <div class="starfield">
          <div 
            v-for="n in 120" 
            :key="n" 
            class="star"
            :style="{
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: (Math.random() * 10) + 's',
              animationDuration: (5 + Math.random() * 10) + 's'
            }"
          ></div>
        </div>
        <div class="loading-content">
          <div class="spiritual-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-core">
              <Icon name="User" :size="32" />
            </div>
            <div class="spinner-orbit"></div>
          </div>
          <h2 class="loading-text">Connecting to the Tirthlok...</h2>
          <p class="loading-subtext">Fetching your Tirthlok profile</p>
        </div>
      </div>

      <template v-else>
        <!-- Hero Section -->
        <header class="profile-hero">
          <div class="profile-hero__content">
            <div class="profile-avatar-wrapper">
              <div class="profile-avatar-inner">
                <Icon name="User" :size="40" />
              </div>
              <div class="profile-avatar-badge" v-if="profile.sect">
                {{ profile.sect.charAt(0) }}
              </div>
            </div>
            <div class="profile-hero__text">
              <h1 class="profile-hero__name">{{ displayName }}</h1>
              <p class="profile-hero__email">{{ profile.email }}</p>
            </div>
          </div>
          

        </header>

        <!-- Main Content Grid -->
        <main class="profile-main">
          <div class="profile-card-group">
            <!-- Account Information Card -->
            <section class="profile-glass-card">
              <div class="profile-card-header">
                <div class="profile-card-header__info">
                  <div class="profile-card-title-group">
                    <Icon name="User" :size="24" class="profile-title-icon" />
                    <h2 class="profile-card-title">Personal Details</h2>
                  </div>
                  <p class="profile-card-subtitle">Manage your personal information and preferences</p>
                </div>
                <button 
                  v-if="!editMode"
                  @click="editMode = true"
                  class="profile-edit-trigger"
                >
                  <Icon name="Edit3" :size="16" />
                  <span>Edit</span>
                </button>
              </div>

              <div class="profile-form">
                <!-- Name Grid -->
                <div class="profile-form-grid">
                  <div class="profile-form-group">
                    <label class="profile-field-label">First Name</label>
                    <div class="profile-input-container">
                      <Icon name="User" :size="18" class="profile-input-icon" />
                      <input 
                        v-model="profile.firstName"
                        :disabled="!editMode"
                        type="text"
                        placeholder="e.g. Nabhi"
                        class="profile-field-input"
                        :class="{ 'is-editing': editMode }"
                      />
                    </div>
                  </div>

                  <div class="profile-form-group">
                    <label class="profile-field-label">Last Name</label>
                    <div class="profile-input-container">
                      <Icon name="User" :size="18" class="profile-input-icon" />
                      <input 
                        v-model="profile.lastName"
                        :disabled="!editMode"
                        type="text"
                        placeholder="e.g. Rai"
                        class="profile-field-input"
                        :class="{ 'is-editing': editMode }"
                      />
                    </div>
                  </div>
                </div>

                <!-- Contact Grid -->
                <div class="profile-form-grid">
                  <div class="profile-form-group">
                    <label class="profile-field-label">Email Address</label>
                    <div class="profile-input-container is-disabled">
                      <Icon name="Mail" :size="18" class="profile-input-icon" />
                      <input 
                        v-model="profile.email"
                        disabled
                        type="email"
                        class="profile-field-input"
                      />
                    </div>
                  </div>

                  <div class="profile-form-group">
                    <label class="profile-field-label">Phone Number</label>
                    <div class="profile-input-container">
                      <Icon name="Phone" :size="18" class="profile-input-icon" />
                      <input 
                        v-model="profile.phone"
                        :disabled="!editMode"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        class="profile-field-input"
                        :class="{ 'is-editing': editMode }"
                      />
                    </div>
                  </div>
                </div>

                <!-- Preferences -->
                <div class="profile-form-group">
                  <label class="profile-field-label">Sect</label>
                  <div class="profile-input-container">
                    <Icon name="User" :size="18" class="profile-input-icon" />
                    <select 
                      v-model="profile.sect"
                      :disabled="!editMode"
                      class="profile-field-select"
                      :class="{ 'is-editing': editMode }"
                    >
                      <option value="">Choose your sect</option>
                      <option value="Shwetambar">Shwetambar</option>
                      <option value="Digambar">Digambar</option>
                    </select>
                  </div>
                </div>

                <!-- Form Feedback -->
                <Transition name="fade-slide">
                  <div v-if="errorMessage || successMessage" class="profile-status-box" :class="errorMessage ? 'is-error' : 'is-success'">
                    <Icon :name="errorMessage ? 'AlertCircle' : 'CheckCircle'" :size="18" />
                    <span>{{ errorMessage || successMessage }}</span>
                  </div>
                </Transition>

                <!-- Action Bar -->
                <div v-if="editMode" class="profile-form-actions">
                  <button @click="cancelEdit" class="profile-btn-cancel">
                    Cancel
                  </button>
                  <button 
                    @click="saveDetails" 
                    :disabled="isSaving" 
                    class="profile-btn-save"
                  >
                    <span v-if="!isSaving">Save Changes</span>
                    <div v-else class="profile-btn-spinner"></div>
                  </button>
                </div>
              </div>
            </section>

            <!-- Quick Access / Sidebar -->
            <aside class="profile-sidebar">
              <div class="profile-glass-card profile-info-mini">
                <div class="profile-info-header">
                  <Icon name="ShieldCheck" :size="20" class="profile-info-icon" />
                  <h3>Secure Profile</h3>
                </div>
                <div class="profile-info-content">
                  <p>Your Tirthlok journey data is encrypted and private. We never share your personal information with third parties.</p>
                </div>
              </div>
              
              <div class="profile-glass-card profile-cta-mini">
                <div class="profile-info-header">
                  <Icon name="Calendar" :size="20" class="profile-cta-icon" />
                  <h3>Plan a Yatra</h3>
                </div>
                <div class="profile-info-content">
                  <p>Discover Tirths and plan your next peaceful yatras.</p>
                  <NuxtLink to="/tirth" class="profile-cta-link">Browse Tirths</NuxtLink>
                </div>
              </div>

              <div class="profile-glass-card profile-security-mini">
                <div class="profile-info-header">
                  <Icon name="Lock" :size="20" class="profile-security-icon" />
                  <h3>Account Security</h3>
                </div>
                <div class="profile-info-content">
                  <p>Change your password periodically to keep your account secure and prevent unauthorized access.</p>
                  <button 
                    @click="showPasswordModal = true"
                    class="profile-cta-link profile-btn-full"
                  >
                    <span>Update Password</span>
                    <Icon name="ChevronRight" :size="16" />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </template>
    </div>

    <!-- Modal Backdrop -->
    <Transition name="fade">
      <div v-if="showPasswordModal" class="cosmic-modal-backdrop" @click.self="closePasswordModal">
        <Transition name="modal-scale">
          <div class="cosmic-modal">
            <div class="modal-header">
              <div class="modal-header-info">
                <Icon name="Lock" :size="24" class="modal-title-icon" />
                <h2 class="modal-title">Update Credentials</h2>
              </div>
              <button @click="closePasswordModal" class="modal-close-btn">
                <Icon name="X" :size="20" />
              </button>
            </div>
            
            <div class="modal-body">
              <p class="modal-description">For security, please verify your identity before changing your password.</p>
              
              <!-- Feedback Move Above Form -->
              <Transition name="fade-slide">
                <div v-if="passwordError || passwordSuccess" class="profile-status-box modal-feedback" :class="passwordError ? 'is-error' : 'is-success'">
                  <Icon :name="passwordError ? 'AlertCircle' : 'CheckCircle'" :size="18" class="feedback-icon" />
                  <span class="feedback-text">{{ passwordError || passwordSuccess }}</span>
                </div>
              </Transition>

              <div class="profile-form">
                <!-- Old Password -->
                <div class="profile-form-group">
                  <label class="profile-field-label">Current Password</label>
                  <div class="profile-input-container">
                    <Icon name="ShieldAlert" :size="18" class="profile-input-icon" />
                    <input 
                      v-model="passwordForm.oldPassword"
                      :type="showOldPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      class="profile-field-input is-editing pr-12"
                      :disabled="isUpdatingPassword"
                    />
                    <button 
                      type="button"
                      @click="showOldPassword = !showOldPassword"
                      class="password-toggle"
                      tabindex="-1"
                    >
                      <Icon :name="showOldPassword ? 'EyeOff' : 'Eye'" :size="18" />
                    </button>
                  </div>
                </div>

                <div class="modal-divider"></div>

                <!-- New Password -->
                <div class="profile-form-group">
                  <label class="profile-field-label">New Password</label>
                  <div class="profile-input-container">
                    <Icon name="Key" :size="18" class="profile-input-icon" />
                    <input 
                      v-model="passwordForm.newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      class="profile-field-input is-editing pr-12"
                      :disabled="isUpdatingPassword"
                    />
                    <button 
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                      class="password-toggle"
                      tabindex="-1"
                    >
                      <Icon :name="showNewPassword ? 'EyeOff' : 'Eye'" :size="18" />
                    </button>
                  </div>
                </div>
                
                <!-- Confirm Password -->
                <div class="profile-form-group">
                  <label class="profile-field-label">Confirm New Password</label>
                  <div class="profile-input-container">
                    <Icon name="ShieldCheck" :size="18" class="profile-input-icon" />
                    <input 
                      v-model="passwordForm.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      class="profile-field-input is-editing pr-12"
                      :disabled="isUpdatingPassword"
                    />
                    <button 
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="password-toggle"
                      tabindex="-1"
                    >
                      <Icon :name="showConfirmPassword ? 'EyeOff' : 'Eye'" :size="18" />
                    </button>
                  </div>
                </div>


                <div class="modal-actions">
                  <button @click="closePasswordModal" class="profile-btn-cancel" :disabled="isUpdatingPassword">
                    Cancel
                  </button>
                  <button 
                    @click="handlePasswordChange" 
                    :disabled="isUpdatingPassword" 
                    class="profile-btn-save"
                  >
                    <span v-if="!isUpdatingPassword">Securely Update</span>
                    <div v-else class="profile-btn-spinner"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'

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

// Password Change Modal State
const showPasswordModal = ref(false)
const isUpdatingPassword = ref(false)
const passwordSuccess = ref('')
const passwordError = ref('')
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Visibility Toggles
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const closePasswordModal = () => {
  if (isUpdatingPassword.value) return
  showPasswordModal.value = false
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordError.value = ''
  passwordSuccess.value = ''
  showOldPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

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
    const result = await getCustomerProfile()
    
    if (result.success && result.data) {
      console.log('[Profile] Loaded data:', result.data)
      // Use database data, fallback to auth metadata if empty
      profile.value.firstName = result.data.customer_first_name || user.value.user_metadata?.first_name || ''
      profile.value.lastName = result.data.customer_last_name || user.value.user_metadata?.last_name || ''
      profile.value.phone = result.data.customer_mobile?.toString() || ''
      profile.value.sect = result.data.customer_sect || ''
    } else {
      console.warn('[Profile] Failed to load data from DB, using metadata fallback:', result)
      profile.value.firstName = user.value.user_metadata?.first_name || ''
      profile.value.lastName = user.value.user_metadata?.last_name || ''
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
    const result = await updateCustomerProfile({
      customer_first_name: profile.value.firstName || undefined,
      customer_last_name: profile.value.lastName || undefined,
      customer_mobile: profile.value.phone ? profile.value.phone.replace(/\D/g, '') : undefined,
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

const handlePasswordChange = async () => {
  passwordError.value = ''
  passwordSuccess.value = ''

  // Validation
  if (!passwordForm.value.oldPassword) {
    passwordError.value = 'Please enter your current password'
    return
  }

  if (!passwordForm.value.newPassword) {
    passwordError.value = 'Please enter a new password'
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return
  }

  if (passwordForm.value.newPassword === passwordForm.value.oldPassword) {
    passwordError.value = 'New password must be different from current password'
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Passwords do not match'
    return
  }

  isUpdatingPassword.value = true
  try {
    const { signIn, updatePassword } = useAuth()
    
    // 1. Verify Old Password by trying to sign in again
    if (user.value?.email) {
      const verifyResult = await signIn(user.value.email, passwordForm.value.oldPassword)
      
      if (!verifyResult.success) {
        passwordError.value = 'Incorrect current password'
        isUpdatingPassword.value = false
        return
      }
    } else {
      passwordError.value = 'User session not found'
      isUpdatingPassword.value = false
      return
    }

    // 2. Update to New Password
    const result = await updatePassword(passwordForm.value.newPassword)
    
    if (result.success) {
      passwordSuccess.value = 'Password updated successfully!'
      
      // Auto close after success
      setTimeout(() => {
        closePasswordModal()
      }, 2000)
    } else {
      passwordError.value = result.error || 'Failed to update password'
    }
  } catch (err: any) {
    passwordError.value = err.message || 'An unexpected error occurred'
  } finally {
    isUpdatingPassword.value = false
  }
}
</script>
