<template>
  <div class="auth-page">
    <div class="auth-wrapper">
      <!-- Back Button -->
      <NuxtLink to="/" class="auth-back-btn">
        <Icon name="ArrowLeft" :size="16" />
        <span>Back to Home</span>
      </NuxtLink>

      <!-- Auth Card -->
      <div class="auth-card">
        <!-- Header -->
        <div class="auth-card__header">
          <div class="auth-avatar">
            <Icon name="User" :size="28" />
          </div>
          <h1 class="auth-header__title">
            {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
          </h1>
          <p class="auth-header__subtitle">
            {{ isSignUp ? 'Join TirthLok today' : 'Sign in to your account' }}
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="auth-card__body">
          <!-- Error Message -->
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-if="errorMessage" class="auth-alert auth-alert--error">
              <Icon name="AlertCircle" :size="16" />
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
            <div v-if="successMessage" class="auth-alert auth-alert--success">
              <Icon name="Check" :size="16" />
              <span>{{ successMessage }}</span>
            </div>
          </Transition>

          <!-- Name Fields (Sign Up Only) -->
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-40"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 max-h-40"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="isSignUp" class="auth-form__row overflow-hidden">
              <div class="auth-form__group">
                <label class="auth-form__label">First Name</label>
                <input 
                  v-model="form.firstName"
                  type="text"
                  placeholder="John"
                  class="auth-form__input"
                />
              </div>
              <div class="auth-form__group">
                <label class="auth-form__label">Last Name</label>
                <input 
                  v-model="form.lastName"
                  type="text"
                  placeholder="Doe"
                  class="auth-form__input"
                />
              </div>
            </div>
          </Transition>

          <!-- Email Field -->
          <div class="auth-form__group">
            <label class="auth-form__label">Email</label>
            <input 
              v-model="form.email"
              type="email"
              required
              placeholder="you@example.com"
              class="auth-form__input"
            />
          </div>

          <!-- Password Field -->
          <div class="auth-form__group">
            <label class="auth-form__label">Password</label>
            <div class="auth-form__input-wrapper">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="••••••••"
                class="auth-form__input"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="auth-form__toggle-password"
              >
                <Icon :name="showPassword ? 'EyeOff' : 'Eye'" :size="18" />
              </button>
            </div>
            <p v-if="isSignUp" class="auth-form__hint">Minimum 6 characters</p>
          </div>

          <!-- Sect Selection (Sign Up Only) -->
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-20"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 max-h-20"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="isSignUp" class="auth-form__group overflow-hidden">
              <label class="auth-form__label">Sect (Optional)</label>
              <select 
                v-model="form.sect"
                class="auth-form__input"
              >
                <option value="">Select your sect</option>
                <option value="Shwetambar">Shwetambar</option>
                <option value="Digambar">Digambar</option>
              </select>
            </div>
          </Transition>

          <!-- Submit Button -->
          <button 
            type="submit"
            :disabled="isLoading"
            class="auth-btn-submit"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In') }}</span>
          </button>

          <!-- Toggle Mode -->
          <div class="auth-toggle">
            <p class="auth-toggle__text">
              {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
              <button 
                type="button"
                @click="toggleMode"
                class="auth-toggle__btn"
              >
                {{ isSignUp ? 'Sign In' : 'Sign Up' }}
              </button>
            </p>
          </div>
        </form>
      </div>

      <!-- Info Card -->
      <div class="auth-info-card">
        <div class="auth-info-card__content">
          <Icon name="Info" :size="18" class="auth-info-card__icon" />
          <p class="auth-info-card__text">
            By creating an account, you can save your favorite Tirths, track visited places, and get personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'default',
})

const router = useRouter()
const route = useRoute()
const { signUp, signIn, isAuthenticated } = useAuth()

// Form state
const isSignUp = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  sect: '',
})

// Redirect if already authenticated
watchEffect(() => {
  if (isAuthenticated.value) {
    const redirectTo = route.query.redirect as string || '/profile'
    router.push(redirectTo)
  }
})

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  errorMessage.value = ''
  successMessage.value = ''
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    if (isSignUp.value) {
      // Sign Up
      const result = await signUp(
        form.value.email,
        form.value.password,
        form.value.firstName,
        form.value.lastName,
        form.value.sect
      )

      if (result.success) {
        successMessage.value = 'Account created successfully! Redirecting...'
        setTimeout(() => {
          const redirectTo = route.query.redirect as string || '/profile'
          router.push(redirectTo)
        }, 1500)
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
