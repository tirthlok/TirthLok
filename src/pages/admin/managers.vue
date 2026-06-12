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
            class="overflow-hidden"
          >
            <!-- Summary row -->
            <div class="p-5 flex items-start justify-between gap-4">
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
              <div class="flex flex-col gap-2 flex-shrink-0">
                <button @click="startEditManager(manager)"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold transition border
                         bg-blue-500/10 text-blue-400 border-blue-500/20
                         hover:bg-blue-500/20">
                  Edit
                </button>
                <button @click="toggleActive(manager)"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-bold transition border',
                    manager.is_active
                      ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                      : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                  ]">
                  {{ manager.is_active ? 'Deactivate' : 'Activate' }}
                </button>
                <button @click="deleteManager(manager)"
                  :disabled="deletingManager === manager.manager_id"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold transition border
                         bg-red-900/30 text-red-500 border-red-800/50
                         hover:bg-red-900/50 disabled:opacity-50">
                  {{ deletingManager === manager.manager_id ? '...' : 'Delete' }}
                </button>
              </div>
            </div>

            <!-- Edit form — inside the v-for item, after the summary row -->
            <div v-if="editingManager === manager.manager_id"
                 class="px-5 pb-5 border-t border-amber-500/20 bg-gray-800/50">
              <p class="text-xs font-bold text-amber-400 uppercase tracking-wide
                        pt-4 mb-4">
                Edit Manager
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label class="text-xs text-gray-400 block mb-1.5">Full Name</label>
                  <input v-model="editManagerForm.full_name"
                    class="w-full bg-gray-800 border border-gray-700 rounded-xl
                           px-4 py-2.5 text-sm text-white
                           focus:outline-none focus:border-amber-500 transition"/>
                </div>
                <div>
                  <label class="text-xs text-gray-400 block mb-1.5">Phone</label>
                  <input v-model="editManagerForm.phone"
                    class="w-full bg-gray-800 border border-gray-700 rounded-xl
                           px-4 py-2.5 text-sm text-white placeholder-gray-500
                           focus:outline-none focus:border-amber-500 transition"
                    placeholder="+91 98765 43210"/>
                </div>
                <div>
                  <label class="text-xs text-gray-400 block mb-1.5">Manager Type</label>
                  <select v-model="editManagerForm.manager_type"
                    class="w-full bg-gray-800 border border-gray-700 rounded-xl
                           px-4 py-2.5 text-sm text-white
                           focus:outline-none focus:border-amber-500 transition">
                    <option value="tirth">Tirth Only</option>
                    <option value="dharamshala">Dharamshala Only</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div v-if="editManagerForm.manager_type !== 'dharamshala'">
                  <label class="text-xs text-gray-400 block mb-1.5">
                    Assigned Tirth
                  </label>
                  <select v-model="editManagerForm.assigned_tirth_id"
                    class="w-full bg-gray-800 border border-gray-700 rounded-xl
                           px-4 py-2.5 text-sm text-white
                           focus:outline-none focus:border-amber-500 transition">
                    <option value="">None</option>
                    <option v-for="t in tirths" :key="t.tirth_id"
                            :value="t.tirth_id">
                      {{ t.tirth_name }}
                    </option>
                  </select>
                </div>
                <div v-if="editManagerForm.manager_type !== 'tirth'">
                  <label class="text-xs text-gray-400 block mb-1.5">
                    Assigned Dharamshala
                  </label>
                  <select v-model="editManagerForm.assigned_dharamshala_id"
                    class="w-full bg-gray-800 border border-gray-700 rounded-xl
                           px-4 py-2.5 text-sm text-white
                           focus:outline-none focus:border-amber-500 transition">
                    <option value="">None</option>
                    <option v-for="d in dharamshalas" :key="d.dharamshala_id"
                            :value="d.dharamshala_id">
                      {{ d.dharamshala_name }}
                    </option>
                  </select>
                </div>
              </div>

              <div v-if="editManagerError"
                   class="mb-3 p-3 bg-red-500/10 border border-red-500/30
                          rounded-xl text-sm text-red-400">
                {{ editManagerError }}
              </div>

              <div class="flex gap-2">
                <button @click="saveEditManager(manager)"
                  :disabled="savingEdit"
                  class="px-5 py-2 bg-amber-500 text-gray-900 rounded-xl
                         font-bold text-sm hover:bg-amber-400 transition
                         disabled:opacity-50">
                  {{ savingEdit ? 'Saving...' : 'Save Changes' }}
                </button>
                <button @click="cancelEditManager"
                  class="px-5 py-2 bg-gray-800 text-gray-400 rounded-xl
                         font-bold text-sm hover:bg-gray-700 transition">
                  Cancel
                </button>
              </div>
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

const editingManager   = ref<string | null>(null)
const editManagerForm  = ref<any>({})
const editManagerError = ref('')
const savingEdit       = ref(false)
const deletingManager  = ref<string | null>(null)

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

const startEditManager = (manager: any) => {
  editingManager.value  = manager.manager_id
  editManagerError.value = ''
  editManagerForm.value = {
    full_name:               manager.full_name,
    phone:                   manager.phone || '',
    manager_type:            manager.manager_type,
    assigned_tirth_id:       manager.tirth?.tirth_id       || '',
    assigned_dharamshala_id: manager.dharamshala?.dharamshala_id || '',
  }
}

const cancelEditManager = () => {
  editingManager.value   = null
  editManagerForm.value  = {}
  editManagerError.value = ''
}

const saveEditManager = async (manager: any) => {
  editManagerError.value = ''
  savingEdit.value = true
  try {
    await $fetch(`/api/admin/managers/${manager.manager_id}`, {
      method: 'PATCH' as const,
      headers: authHeaders(),
      body: {
        full_name:               editManagerForm.value.full_name,
        phone:                   editManagerForm.value.phone || null,
        manager_type:            editManagerForm.value.manager_type,
        assigned_tirth_id:       editManagerForm.value.assigned_tirth_id || null,
        assigned_dharamshala_id: editManagerForm.value.assigned_dharamshala_id || null,
      },
    })
    cancelEditManager()
    await fetchManagers()
  } catch (err: any) {
    editManagerError.value = err?.data?.statusMessage || 'Update failed.'
  } finally {
    savingEdit.value = false
  }
}

const deleteManager = async (manager: any) => {
  const confirmed = prompt(
    `Permanently delete "${manager.full_name}"?\n\n` +
    `Type DELETE to confirm. This cannot be undone.`
  )
  if (confirmed !== 'DELETE') return

  deletingManager.value = manager.manager_id
  try {
    await $fetch(`/api/admin/managers/${manager.manager_id}`, {
      method: 'DELETE' as const,
      headers: authHeaders(),
    })
    await fetchManagers()
  } catch (err: any) {
    alert(err?.data?.statusMessage || 'Delete failed.')
  } finally {
    deletingManager.value = null
  }
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
