<template>
  <div class="auth-page">
    <div class="auth-form-side">
      <div class="auth-form-container">
        <!-- Header Row -->
        <div class="auth-header-row">
          <button type="button" @click="handleBack" class="auth-back-link">
            <Icon name="ArrowLeft" :size="20" />
          </button>
          
          <div class="auth-logo-area">
            <h1 class="auth-title">Reset Password</h1>
            <p class="auth-subtitle">We'll send you a link to reset your password</p>
          </div>

          <div class="auth-header-spacer"></div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleReset" class="auth-main-form">
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

          <!-- Email Input -->
          <div class="auth-input-group">
            <label class="auth-label">Email Address</label>
            <input 
              v-model="email"
              type="email"
              required
              placeholder="name@gmail.com"
              class="auth-input"
              :disabled="isLoading || !!successMessage"
            />
          </div>

          <!-- Action Button -->
          <button 
            type="submit"
            :disabled="isLoading || !!successMessage"
            class="auth-submit-btn"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Sending...' : 'Send Reset Link' }}</span>
          </button>

          <!-- Back to Login -->
          <div class="auth-helper-row justify-center mt-4">
            <NuxtLink to="/auth/login" class="auth-link">
              Back to Sign In
            </NuxtLink>
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
const { resetPassword } = useAuth()

const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
  // Pre-fill email from query param if available
  if (route.query.email) {
    email.value = route.query.email as string
  }
})

const handleBack = () => {
  router.push('/auth/login')
}

const handleReset = async () => {
  if (!email.value) return

  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const result = await resetPassword(email.value)
    if (result.success) {
      successMessage.value = 'Password reset link sent! Please check your inbox and click the reset link.'
    } else {
      errorMessage.value = result.error || 'Failed to send reset link.'
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
