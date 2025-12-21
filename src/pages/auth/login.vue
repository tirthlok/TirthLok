<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-4 sm:py-8 px-4">
    <div class="w-full max-w-md">
      <!-- Back Button -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
      >
        <Icon name="ArrowLeft" :size="16" />
        <span>Back to Home</span>
      </NuxtLink>

      <!-- Auth Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 sm:py-8 text-center">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-3">
            <Icon name="User" :size="32" class="text-red-600" />
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-white">
            {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
          </h1>
          <p class="text-red-100 text-sm mt-1">
            {{ isSignUp ? 'Join TirthLok today' : 'Sign in to your account' }}
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 sm:p-8 space-y-4 sm:space-y-5">
          <!-- Error Message -->
          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <Icon name="AlertCircle" :size="18" class="text-red-600 flex-shrink-0 mt-0.5" />
              <span class="text-red-700 text-sm">{{ errorMessage }}</span>
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
            <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <Icon name="Check" :size="18" class="text-green-600 flex-shrink-0 mt-0.5" />
              <span class="text-green-700 text-sm">{{ successMessage }}</span>
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
            <div v-if="isSignUp" class="grid grid-cols-2 gap-3 overflow-hidden">
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700">First Name</label>
                <input 
                  v-model="form.firstName"
                  type="text"
                  placeholder="John"
                  class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 text-sm"
                />
              </div>
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700">Last Name</label>
                <input 
                  v-model="form.lastName"
                  type="text"
                  placeholder="Doe"
                  class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 text-sm"
                />
              </div>
            </div>
          </Transition>

          <!-- Email Field -->
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              v-model="form.email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 text-sm"
            />
          </div>

          <!-- Password Field -->
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <div class="relative">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="••••••••"
                class="w-full px-4 py-2.5 pr-10 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 text-sm"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon :name="showPassword ? 'EyeOff' : 'Eye'" :size="18" />
              </button>
            </div>
            <p v-if="isSignUp" class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
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
            <div v-if="isSignUp" class="space-y-1.5 overflow-hidden">
              <label class="block text-sm font-medium text-gray-700">Sect (Optional)</label>
              <select 
                v-model="form.sect"
                class="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 text-sm bg-white"
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
            class="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In') }}</span>
          </button>

          <!-- Toggle Mode -->
          <div class="text-center pt-2">
            <p class="text-sm text-gray-600">
              {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
              <button 
                type="button"
                @click="toggleMode"
                class="text-red-600 hover:text-red-700 font-semibold ml-1 transition-colors"
              >
                {{ isSignUp ? 'Sign In' : 'Sign Up' }}
              </button>
            </p>
          </div>
        </form>
      </div>

      <!-- Info Card -->
      <div class="mt-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
        <div class="flex items-start gap-2">
          <Icon name="Info" :size="18" class="text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p class="text-sm text-gray-600">
              By creating an account, you can save your favorite Tirths, track visited places, and get personalized recommendations.
            </p>
          </div>
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
