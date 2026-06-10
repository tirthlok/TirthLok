<template>
  <div v-if="!adminStore.isSuperAdmin"
       class="flex items-center justify-center min-h-screen bg-gray-950">
    <p class="text-gray-500">Super admin access required.</p>
  </div>

  <div v-else class="min-h-screen bg-gray-950 text-white">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white">Managers</h1>
          <p class="text-gray-400 text-sm mt-1">
            Create and manage property administrators
          </p>
        </div>
        <button
          @click="showForm = !showForm"
          class="flex items-center gap-2 px-4 py-2.5 
                 bg-amber-500 text-gray-900 rounded-xl 
                 font-bold text-sm hover:bg-amber-400 transition"
        >
          <Icon name="Plus" :size="16" />
          Add Manager
        </button>
      </div>

      <!-- Create Manager Form -->
      <Transition name="slide-down">
        <div v-if="showForm"
             class="bg-gray-900 rounded-2xl border border-amber-500/30 
                    p-6 mb-6">
          <h2 class="font-bold text-white mb-5 flex items-center gap-2">
            <Icon name="UserPlus" :size="18" class="text-amber-400" />
            New Manager
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Full Name *
              </label>
              <input v-model="form.full_name" placeholder="Rajesh Kumar"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl 
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-amber-500 transition"/>
            </div>
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Email Address *
              </label>
              <input v-model="form.email" type="email"
                     placeholder="manager@tirthlok.in"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl 
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-amber-500 transition"/>
            </div>
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Phone
              </label>
              <input v-model="form.phone" placeholder="+91 98765 43210"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl 
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-amber-500 transition"/>
            </div>
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Manager Type *
              </label>
              <select v-model="form.manager_type"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl 
                       px-4 py-2.5 text-sm text-white
                       focus:outline-none focus:border-amber-500 transition">
                <option value="">Select type</option>
                <option value="tirth">Tirth Only</option>
                <option value="dharamshala">Dharamshala Only</option>
                <option value="both">Both (Tirth + Dharamshala)</option>
              </select>
            </div>
          </div>

          <!-- Tirth Assignment -->
          <div v-if="form.manager_type === 'tirth' ||
                     form.manager_type === 'both'"
               class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Assigned Tirth *
              </label>
              <select v-model="form.assigned_tirth_id"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl 
                       px-4 py-2.5 text-sm text-white
                       focus:outline-none focus:border-amber-500 transition">
                <option value="">Select tirth</option>
                <option
                  v-for="t in tirths"
                  :key="t.tirth_id"
                  :value="t.tirth_id"
                >
                  {{ t.tirth_name }} ({{ t.tirth_id }})
                </option>
              </select>
            </div>
          </div>

          <!-- Dharamshala Assignment -->
          <div v-if="form.manager_type === 'dharamshala' ||
                     form.manager_type === 'both'"
               class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Assigned Dharamshala *
              </label>
              <select v-model="form.assigned_dharamshala_id"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl 
                       px-4 py-2.5 text-sm text-white
                       focus:outline-none focus:border-amber-500 transition">
                <option value="">Select dharamshala</option>
                <option
                  v-for="d in dharamshalas"
                  :key="d.dharamshala_id"
                  :value="d.dharamshala_id"
                >
                  {{ d.dharamshala_name }} ({{ d.dharamshala_id }})
                </option>
              </select>
            </div>
          </div>

          <!-- Error -->
          <div v-if="formError"
               class="mb-4 p-3 bg-red-500/10 border border-red-500/30 
                      rounded-xl text-sm text-red-400">
            {{ formError }}
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="createManager"
              :disabled="creating"
              class="flex items-center gap-2 px-5 py-2.5 
                     bg-amber-500 text-gray-900 rounded-xl font-bold 
                     text-sm hover:bg-amber-400 transition 
                     disabled:opacity-50"
            >
              <div v-if="creating"
                   class="w-4 h-4 border-2 border-gray-900/30 
                          border-t-gray-900 rounded-full animate-spin"/>
              <Icon v-else name="UserPlus" :size="16" />
              {{ creating ? 'Sending Invite...' : 'Send Invite' }}
            </button>
            <button
              @click="showForm = false; resetForm()"
              class="px-5 py-2.5 bg-gray-800 text-gray-400 rounded-xl 
                     font-bold text-sm hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </Transition>

      <!-- Managers List -->
      <div class="bg-gray-900 rounded-2xl border border-gray-800 
                  overflow-hidden">
        <div class="p-5 border-b border-gray-800">
          <h2 class="font-bold text-white">
            Active Managers ({{ managers.length }})
          </h2>
        </div>

        <div v-if="loading" class="p-8 text-center">
          <div class="w-8 h-8 border-2 border-amber-500 
                      border-t-transparent rounded-full 
                      animate-spin mx-auto"/>
        </div>

        <div v-else-if="managers.length === 0"
             class="p-12 text-center text-gray-500 text-sm">
          No managers yet. Add one above.
        </div>

        <div v-else class="divide-y divide-gray-800">
          <div
            v-for="manager in managers"
            :key="manager.manager_id"
            class="p-5 flex items-start justify-between gap-4"
          >
            <div class="flex items-start gap-4">
              <!-- Avatar -->
              <div class="w-10 h-10 rounded-full bg-gradient-to-br 
                          from-amber-400 to-orange-500 flex items-center 
                          justify-center flex-shrink-0">
                <span class="text-sm font-bold text-white">
                  {{ manager.full_name?.charAt(0)?.toUpperCase() }}
                </span>
              </div>

              <div>
                <div class="flex items-center gap-2 mb-1">
                  <p class="font-semibold text-white">
                    {{ manager.full_name }}
                  </p>
                  <span :class="[
                    'px-2 py-0.5 rounded-full text-xs font-bold',
                    manager.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-700 text-gray-500'
                  ]">
                    {{ manager.is_active ? 'Active' : 'Inactive' }}
                  </span>
                  <span class="px-2 py-0.5 rounded-full text-xs font-bold 
                               bg-amber-500/20 text-amber-400">
                    {{ managerTypeLabel(manager.manager_type) }}
                  </span>
                </div>

                <!-- Assignments -->
                <div class="space-y-1">
                  <div v-if="manager.tirth"
                       class="flex items-center gap-1.5 text-xs text-gray-400">
                    <Icon name="MapPin" :size="11" class="text-blue-400"/>
                    {{ manager.tirth.tirth_name }}
                    <span class="text-gray-600">
                      ({{ manager.tirth.tirth_id }})
                    </span>
                  </div>
                  <div v-if="manager.dharamshala"
                       class="flex items-center gap-1.5 text-xs text-gray-400">
                    <Icon name="Building2" :size="11" class="text-green-400"/>
                    {{ manager.dharamshala.dharamshala_name }}
                    <span class="text-gray-600">
                      ({{ manager.dharamshala.dharamshala_id }})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 flex-shrink-0">
              <button
                @click="toggleActive(manager)"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition border',
                  manager.is_active
                    ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                    : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                ]"
              >
                {{ manager.is_active ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminModeStore } from '~/stores/adminMode'
import { useAuth } from '~/features/auth/composables/useAuth'
import Icon from '~/components/ui/Icon.vue'

definePageMeta({ layout: 'default' })

const adminStore = useAdminModeStore()
const { session } = useAuth()

const managers     = ref<any[]>([])
const tirths       = ref<any[]>([])
const dharamshalas = ref<any[]>([])
const loading      = ref(false)
const showForm     = ref(false)
const creating     = ref(false)
const formError    = ref('')

const form = ref({
  full_name:               '',
  email:                   '',
  phone:                   '',
  manager_type:            '',
  assigned_tirth_id:       '',
  assigned_dharamshala_id: '',
})

const authHeaders = () => ({
  Authorization: `Bearer ${session.value?.access_token || ''}`,
})

const fetchManagers = async () => {
  loading.value = true
  try {
    managers.value = await $fetch<any[]>(
      '/api/admin/managers',
      { headers: authHeaders() }
    )
  } finally {
    loading.value = false
  }
}

const fetchDropdowns = async () => {
  const { useSupabase } = await import(
    '~/features/auth/composables/useSupabase'
  )
  const { supabase } = useSupabase()

  const [{ data: t }, { data: d }] = await Promise.all([
    supabase.schema('tirthlok').from('tirth_cards')
      .select('tirth_id, tirth_name').order('tirth_name'),
    supabase.schema('tirthlok').from('dharamshala_cards')
      .select('dharamshala_id, dharamshala_name').order('dharamshala_name'),
  ])
  tirths.value       = t || []
  dharamshalas.value = d || []
}

const createManager = async () => {
  formError.value = ''
  if (!form.value.full_name || !form.value.email || !form.value.manager_type) {
    formError.value = 'Full name, email and manager type are required.'
    return
  }
  if (form.value.manager_type !== 'dharamshala' &&
      !form.value.assigned_tirth_id) {
    formError.value = 'Please assign a tirth.'
    return
  }
  if (form.value.manager_type !== 'tirth' &&
      !form.value.assigned_dharamshala_id) {
    formError.value = 'Please assign a dharamshala.'
    return
  }

  creating.value = true
  try {
    await $fetch('/api/admin/managers', {
      method: 'POST',
      headers: authHeaders(),
      body: {
        ...form.value,
        assigned_tirth_id:       form.value.assigned_tirth_id       || null,
        assigned_dharamshala_id: form.value.assigned_dharamshala_id || null,
      },
    })
    showForm.value = false
    resetForm()
    await fetchManagers()
  } catch (err: any) {
    formError.value = err?.data?.statusMessage || 'Failed to create manager.'
  } finally {
    creating.value = false
  }
}

const toggleActive = async (manager: any) => {
  await $fetch(`/api/admin/managers/${manager.manager_id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: { is_active: !manager.is_active },
  })
  await fetchManagers()
}

const resetForm = () => {
  form.value = {
    full_name:               '',
    email:                   '',
    phone:                   '',
    manager_type:            '',
    assigned_tirth_id:       '',
    assigned_dharamshala_id: '',
  }
  formError.value = ''
}

const managerTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    tirth:       'Tirth',
    dharamshala: 'Dharamshala',
    both:        'Tirth + Dharamshala',
  }
  return map[type] || type
}

onMounted(async () => {
  await Promise.all([fetchManagers(), fetchDropdowns()])
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
