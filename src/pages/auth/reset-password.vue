<template>
  <div class="auth-page">
    <div class="auth-form-side">
      <div class="auth-form-container">
        <!-- Header Row -->
        <div class="auth-header-row">
          <div class="auth-logo-area">
            <h1 class="auth-title">Set New Password</h1>
            <p class="auth-subtitle">Please enter your new password below</p>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleUpdatePassword" class="auth-main-form">
          <!-- Feedback Messages -->
          <Transition name="slide-down">
            <div v-if="errorMessage" class="auth-feedback auth-feedback--error">
              <Icon name="AlertCircle" :size="16" />
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <Transition name="slide-down">
            <div v-if="successMessage" class="auth-feedback auth-feedback--success">
              <Icon name="Check" :size="16" />
              <span>{{ successMessage }}</span>
            </div>
          </Transition>

          <!-- New Password -->
          <div class="auth-input-group">
            <label class="auth-label">New Password</label>
            <div class="auth-input-wrapper">
              <input 
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="••••••••"
                class="auth-input"
                :disabled="isLoading || isUpdateSuccessful"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="auth-input-icon"
              >
                <Icon :name="showPassword ? 'EyeOff' : 'Eye'" :size="18" />
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="auth-input-group">
            <label class="auth-label">Confirm Password</label>
            <div class="auth-input-wrapper">
              <input 
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="••••••••"
                class="auth-input"
                :disabled="isLoading || isUpdateSuccessful"
              />
            </div>
          </div>

          <!-- Action Button -->
          <button 
            type="submit"
            :disabled="isLoading || isUpdateSuccessful"
            class="auth-submit-btn"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Updating...' : 'Update Password' }}</span>
          </button>

          <!-- Back to Login -->
          <div class="auth-helper-row justify-center mt-4">
            <button type="button" @click="handleBack" class="auth-link btn-link">
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'

definePageMeta({
  layout: 'default',
})

const router = useRouter()
const route = useRoute()
const { updatePassword, verifyResetToken, signOut, user } = useAuth()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isTokenVerified = ref(false)
const isUpdateSuccessful = ref(false)

// Handle navigation away from reset page
onBeforeRouteLeave(async (_to, _from) => {
  // If update wasn't successful and we are navigating away, sign out
  if (!isUpdateSuccessful.value) {
    console.log('[ResetPassword] Navigating away without success, signing out...')
    await signOut()
  }
})

// Token and Email from query params (for link-based verification)
const token = ref((route.query.token as string) || '')
const email = ref((route.query.email as string) || '')

onMounted(async () => {
  // Check for reset success message from query params
  if (route.query.resetSuccess === '1') {
    successMessage.value = 'Password reset successfully! Please sign in with your new password.'
  }

  // If user is already authenticated and trying to use a reset link, sign them out first.
  // This prevents logged-in users from using a reset link when they should use "change password".
  if (user.value && token.value && email.value) {
    console.log('[ResetPassword] User already authenticated and using reset link, signing out to clear session.')
    await signOut()
  }

  // If we have token and email, try to verify automatically
  if (token.value && email.value) {
    isLoading.value = true
    try {
      const result = await verifyResetToken(email.value, token.value)
      if (result.success) {
        isTokenVerified.value = true
        successMessage.value = 'Reset link verified. Please enter your new password below.'
      } else {
        errorMessage.value = 'Invalid or expired reset link. Please request a new one.'
        // Sign out to clear any partial session if verification failed
        await signOut()
      }
    } catch (err: any) {
      errorMessage.value = 'Verification failed. Please try again.'
    } finally {
      isLoading.value = false
    }
  }
})

const handleBack = async () => {
  await signOut()
  router.push('/auth/login')
}

const handleUpdatePassword = async () => {
  if (!password.value) return
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  // If no token was verified automatically, we need to ensure the user is authenticated
  // (In Supabase, verifyOtp sets the session, so if result.success was true, we are good)
  // If no token was in URL, they might have come from a direct redirect with hash.
  
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const result = await updatePassword(password.value)
    if (result.success) {
      isUpdateSuccessful.value = true
      successMessage.value = 'Password updated successfully! You can now sign in.'
      
      // Force sign out so they must login manually with the new password
      await signOut()
      
      setTimeout(() => {
        router.push({ path: '/auth/login', query: { resetSuccess: '1' } })
      }, 3000)
    } else {
      errorMessage.value = result.error || 'Failed to update password. Your session might have expired.'
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'An unexpected error occurred.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
