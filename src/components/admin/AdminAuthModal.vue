<template>
  <Transition name="modal">
    <div v-if="show"
         class="fixed inset-0 z-[100] flex items-center justify-center
                bg-black/70 backdrop-blur-sm px-4">
      <div class="bg-gray-900 rounded-2xl border border-amber-500/30
                  w-full max-w-md p-6 shadow-2xl">

        <!-- Header -->
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20
                      flex items-center justify-center">
            <Icon :name="('ShieldCheck' as any)" :size="20"
                  class="text-amber-400"/>
          </div>
          <div>
            <h2 class="font-bold text-white text-lg">Confirm Identity</h2>
            <p class="text-gray-400 text-xs">
              Re-enter your password to access admin mode
            </p>
          </div>
        </div>

        <!-- Email (read-only) -->
        <div class="mb-4">
          <label class="text-xs text-gray-400 font-medium block mb-1.5">
            Account
          </label>
          <div class="w-full bg-gray-800 border border-gray-700
                      rounded-xl px-4 py-2.5 text-sm text-gray-400">
            {{ userEmail }}
          </div>
        </div>

        <!-- Password -->
        <div class="mb-5">
          <label class="text-xs text-gray-400 font-medium block mb-1.5">
            Password *
          </label>
          <input
            ref="passwordInput"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            @keydown.enter="verify"
            :disabled="verifying"
            class="w-full bg-gray-800 border border-gray-700 rounded-xl
                   px-4 py-2.5 text-sm text-white placeholder-gray-500
                   focus:outline-none focus:border-amber-500 transition
                   disabled:opacity-50"
          />
        </div>

        <!-- Error -->
        <div v-if="authError"
             class="mb-4 p-3 bg-red-500/10 border border-red-500/30
                    rounded-xl text-sm text-red-400 flex items-center gap-2">
          <span>⚠️</span>
          {{ authError }}
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            @click="verify"
            :disabled="!password || verifying"
            class="flex-1 flex items-center justify-center gap-2
                   py-2.5 bg-amber-500 text-gray-900 rounded-xl
                   font-bold text-sm hover:bg-amber-400 transition
                   disabled:opacity-40"
          >
            <div v-if="verifying"
                 class="w-4 h-4 border-2 border-gray-900/30
                        border-t-gray-900 rounded-full animate-spin"/>
            {{ verifying ? 'Verifying...' : 'Enter Admin Mode' }}
          </button>
          <button
            @click="cancel"
            :disabled="verifying"
            class="px-5 py-2.5 bg-gray-800 text-gray-400 rounded-xl
                   font-bold text-sm hover:bg-gray-700 transition
                   disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        <!-- Security note -->
        <p class="text-center text-xs text-gray-600 mt-4">
          Admin session expires after 30 minutes of inactivity
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ show: boolean }>()

const emit = defineEmits<{
  (e: 'verified'): void
  (e: 'cancelled'): void
}>()

const { session } = useAuth()

// Lazily resolve the Supabase client — never at script setup root (runs during SSR)
const getSupabase = () => {
  if (import.meta.server) return null
  return useSupabase().supabase
}

const password      = ref('')
const verifying     = ref(false)
const authError     = ref('')
const passwordInput = ref<HTMLInputElement | null>(null)

const userEmail = computed(() =>
  session.value?.user?.email || ''
)

watch(() => props.show, async (val) => {
  if (val) {
    password.value  = ''
    authError.value = ''
    await nextTick()
    passwordInput.value?.focus()
  }
})

const verify = async () => {
  if (!password.value || verifying.value) return
  authError.value = ''
  verifying.value = true

  try {
    // Re-authenticate with current credentials
    // This verifies identity even with an active session
    const supabase = getSupabase()
    if (!supabase) return
    const { error } = await supabase.auth.signInWithPassword({
      email:    userEmail.value,
      password: password.value,
    })

    if (error) {
      authError.value = 'Incorrect password. Please try again.'
      password.value  = ''
      await nextTick()
      passwordInput.value?.focus()
      return
    }

    emit('verified')
  } catch {
    authError.value = 'Verification failed. Please try again.'
  } finally {
    verifying.value = false
  }
}

const cancel = () => {
  password.value  = ''
  authError.value = ''
  emit('cancelled')
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
