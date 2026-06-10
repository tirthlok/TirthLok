<template>
  <div class="auth-page">
    <!-- Centered Form Side -->
    <div class="auth-form-side">
      <div class="auth-form-container" :class="{ 'auth-form-container--wide': isSignUp }">
        <!-- Header Row: Back Button + Title -->
        <div class="auth-header-row">
          <button type="button" @click="handleBack" class="auth-back-link">
            <Icon name="ArrowLeft" :size="20" />
          </button>
          
          <div class="auth-logo-area">
            <h1 class="auth-title">
              {{ isSignUp ? 'Begin Journey' : 'Welcome Back' }}
            </h1>
            <p class="auth-subtitle">
              {{ isSignUp ? 'Join the Tirthlok community' : '' }}
            </p>
          </div>

          <!-- Dummy spacer to help center the title area -->
          <div class="auth-header-spacer"></div>
        </div>

        <!-- Segmented Toggle (Switch) -->
        <div class="auth-switcher">
          <button 
            type="button" 
            class="auth-switcher-btn"
            :class="{ 'auth-switcher-btn--active': !isSignUp }"
            @click="isSignUp = false"
          >
            Sign In
          </button>
          <button 
            type="button" 
            class="auth-switcher-btn"
            :class="{ 'auth-switcher-btn--active': isSignUp }"
            @click="isSignUp = true"
          >
            Sign Up
          </button>
          <div 
            class="auth-switcher-bg"
            :class="{ 'auth-switcher-bg--right': isSignUp }"
          ></div>
        </div>

        <!-- Main Form -->
        <form @submit.prevent="handleSubmit" class="auth-main-form">
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

          <!-- Sign Up Name Row -->
          <div v-if="isSignUp" class="auth-grid-row">
            <div class="auth-input-group">
              <label class="auth-label">First Name</label>
              <input 
                v-model="form.firstName"
                type="text"
                placeholder="Nabhi"
                class="auth-input"
              />
            </div>
            <div class="auth-input-group">
              <label class="auth-label">Last Name</label>
              <input 
                v-model="form.lastName"
                type="text"
                placeholder="Rai"
                class="auth-input"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="auth-input-group">
            <label class="auth-label">Email Address</label>
            <input 
              v-model="form.email"
              type="email"
              required
              placeholder="name@gmail.com"
              class="auth-input"
            />
          </div>

          <!-- Password -->
          <div class="auth-input-group">
            <label class="auth-label">Password</label>
            <div class="auth-input-wrapper">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="••••••••"
                class="auth-input"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="auth-input-icon"
              >
                <Icon :name="showPassword ? 'EyeOff' : 'Eye'" :size="18" />
              </button>
            </div>
            
            <!-- Forgot Password Link -->
            <div v-if="!isSignUp" class="auth-helper-row">
              <NuxtLink :to="{ path: '/auth/forgot-password', query: { email: form.email } }" class="auth-link">
                Forgot Password?
              </NuxtLink>
            </div>
          </div>

          <!-- Extra Fields for Sign Up -->
          <template v-if="isSignUp">
            <div class="auth-input-group">
              <label class="auth-label">Mobile Number</label>
              <input 
                v-model="form.mobile"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                class="auth-input"
              />
            </div>

            <div class="auth-input-group">
              <label class="auth-label">Sect (Optional)</label>
              <select 
                v-model="form.sect"
                class="auth-input auth-select"
              >
                <option value="">Select your sect</option>
                <option value="Shwetambar">Shwetambar</option>
                <option value="Digambar">Digambar</option>
              </select>
            </div>
          </template>

          <!-- Action Button -->
          <button 
            type="submit"
            :disabled="isLoading"
            class="auth-submit-btn"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In') }}</span>
          </button>

        </form>
      </div>
    </div>

    <!-- Verification Modal -->
    <Transition name="pop">
      <div v-if="showVerificationPopup" class="auth-modal-overlay">
        <div class="auth-modal">
          <div class="auth-modal-icon">
              <Icon name="Mail" :size="32" />
          </div>
          <h2 class="auth-modal-title">Check your inbox</h2>
          <p class="auth-modal-text">
            A verification email has been sent to <strong>{{ form.email }}</strong>. Please verify your email to continue.
          </p>
          <button @click="showVerificationPopup = false" class="auth-submit-btn w-full">
            Understood
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'

definePageMeta({
  layout: 'default',
})

const router = useRouter()
const route = useRoute()

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const { signUp, signIn, isAuthenticated, checkUserExists } = useAuth()

onMounted(() => {
  if (route.query.resetSuccess === '1') {
    successMessage.value = 'Password reset successfully! Please sign in with your new password.'
  }
})

// Form state
const isSignUp = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showVerificationPopup = ref(false)

const form = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  mobile: '',
  sect: '',
})

// Redirect if already authenticated
watchEffect(() => {
  if (isAuthenticated.value) {
    const redirectTo = route.query.redirect as string || '/profile'
    router.push(redirectTo)
  }
})


const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    if (isSignUp.value) {
      // Check if user already exists
      const exists = await checkUserExists(form.value.email)
      if (exists) {
          errorMessage.value = 'An account with this email already exists. Switching to Sign In...'
          setTimeout(() => {
              isSignUp.value = false
              errorMessage.value = ''
          }, 2000)
          return
      }

      // Sign Up
      const result = await signUp(
        form.value.email,
        form.value.password,
        form.value.firstName,
        form.value.lastName,
        form.value.sect,
        form.value.mobile
      )

      if (result.success) {
        showVerificationPopup.value = true
        // Clear form after success
        form.value.password = ''
      } else {
        errorMessage.value = result.error || 'Sign up failed. Please try again.'
      }
    } else {
      // Sign In
      const result = await signIn(form.value.email, form.value.password)

      if (result.success) {
        successMessage.value = 'Signed in successfully! Redirecting...'
        setTimeout(() => {
          const redirectTo = route.query.redirect as string || '/profile'
          router.push(redirectTo)
        }, 1000)
      } else {
        // If user not found, suggest signup
        if (result.error?.toLowerCase().includes('invalid login credentials')) {
            // We'll check exists to be sure it's "user not found" scenario
            const exists = await checkUserExists(form.value.email)
            if (!exists) {
                errorMessage.value = 'Account not found. Switching to Sign Up...'
                setTimeout(() => {
                    isSignUp.value = true
                    errorMessage.value = ''
                }, 2000)
                return
            }
        }
        errorMessage.value = result.error || 'Invalid email or password.'
      }
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'An unexpected error occurred.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Scoped transitions for Vue */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.pop-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-leave-active {
  transition: all 0.3s ease-in;
}
.pop-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.pop-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
