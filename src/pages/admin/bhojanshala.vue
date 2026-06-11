<template>
  <div v-if="!adminStore.isAdminMode"
       class="flex items-center justify-center min-h-screen">
    <p class="text-gray-500">Access denied.</p>
  </div>

  <div v-else class="min-h-screen bg-gray-950 text-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white">🍽️ Bhojanshala</h1>
          <p class="text-gray-400 text-sm mt-1">
            {{ bhojanshalas.length }} locations
          </p>
        </div>
        <button @click="showAddForm = !showAddForm"
          class="flex items-center gap-2 px-4 py-2.5 bg-green-600
                 text-white rounded-xl font-bold text-sm
                 hover:bg-green-500 transition">
          <Icon :name="('Plus' as any)" :size="16" />
          Add Bhojanshala
        </button>
      </div>

      <!-- Add Form -->
      <Transition name="slide-down">
        <div v-if="showAddForm"
             class="bg-gray-900 rounded-2xl border border-green-500/30 p-6 mb-6">
          <h2 class="font-bold text-white mb-5 text-lg">New Bhojanshala</h2>

          <!-- Section: Basic Info -->
          <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">
            Basic Info
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">
                Bhojanshala ID * (BL-XX-0000)
              </label>
              <input v-model="addForm.bhojanshala_id"
                     placeholder="BL-GJ-0005"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500 transition
                       font-mono uppercase"
                @input="addForm.bhojanshala_id =
                  addForm.bhojanshala_id.toUpperCase()"/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">Name *</label>
              <input v-model="addForm.bhojanshala_name"
                     placeholder="Palitana Jain Bhojanshala"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500 transition"/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">Type *</label>
              <select v-model="addForm.bhojanshala_type"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white
                       focus:outline-none focus:border-green-500 transition">
                <option value="free">Free</option>
                <option value="donation">Donation Based</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">City *</label>
              <input v-model="addForm.bhojanshala_city"
                     placeholder="Palitana"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500 transition"/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">State *</label>
              <input v-model="addForm.bhojanshala_state"
                     placeholder="Gujarat"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500 transition"/>
            </div>
            <div v-if="adminStore.isSuperAdmin">
              <label class="text-xs text-gray-400 block mb-1.5">
                Associated Tirth
              </label>
              <select v-model="addForm.tirth_id"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white
                       focus:outline-none focus:border-green-500 transition">
                <option value="">None</option>
                <option v-for="t in tirths" :key="t.tirth_id"
                        :value="t.tirth_id">
                  {{ t.tirth_name }}
                </option>
              </select>
            </div>
            <div class="sm:col-span-2 lg:col-span-3">
              <label class="text-xs text-gray-400 block mb-1.5">
                Address
              </label>
              <input v-model="addForm.bhojanshala_address"
                     placeholder="Full address..."
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500 transition"/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">Phone</label>
              <input v-model="addForm.bhojanshala_phone"
                     placeholder="+91 94270 12345"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500 transition"/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">Email</label>
              <input v-model="addForm.bhojanshala_email"
                     type="email"
                     placeholder="contact@example.com"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500 transition"/>
            </div>
          </div>

          <!-- Section: Details -->
          <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">
            Details
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div class="sm:col-span-2">
              <label class="text-xs text-gray-400 block mb-1.5">About</label>
              <textarea v-model="addForm.about" rows="3"
                placeholder="Describe the bhojanshala..."
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500 transition
                       resize-none"/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">
                Seating Capacity
              </label>
              <input v-model.number="addForm.seating_capacity"
                     type="number" min="1" placeholder="200"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500 transition"/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">
                Payment Info
              </label>
              <input v-model="addForm.payment_info"
                     placeholder="Free / ₹80 per thali / Donation"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500 transition"/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">
                Manager Name
              </label>
              <input v-model="addForm.manager_name"
                     placeholder="Shri Kantilal Shah"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500 transition"/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">
                Manager Phone
              </label>
              <input v-model="addForm.manager_phone"
                     placeholder="+91 94270 11111"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500 transition"/>
            </div>
            <div class="sm:col-span-2">
              <label class="text-xs text-gray-400 block mb-1.5">
                Dietary Info
              </label>
              <textarea v-model="addForm.dietary_info" rows="2"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white
                       focus:outline-none focus:border-green-500 transition
                       resize-none"/>
            </div>
          </div>

          <!-- Meal Timings -->
          <p class="text-xs text-gray-400 font-bold uppercase
                    tracking-widest mb-3">
            Meal Timings
          </p>
          <div class="space-y-2 mb-4">
            <div v-for="(meal, i) in addForm.meal_timings" :key="i"
                 class="grid grid-cols-4 gap-2 items-center">
              <select v-model="meal.meal_type"
                class="bg-gray-800 border border-gray-700 rounded-xl
                       px-3 py-2 text-sm text-white
                       focus:outline-none focus:border-green-500">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snacks</option>
              </select>
              <input v-model="meal.start_time" type="time"
                class="bg-gray-800 border border-gray-700 rounded-xl
                       px-3 py-2 text-sm text-white
                       focus:outline-none focus:border-green-500"/>
              <input v-model="meal.end_time" type="time"
                class="bg-gray-800 border border-gray-700 rounded-xl
                       px-3 py-2 text-sm text-white
                       focus:outline-none focus:border-green-500"/>
              <button @click="removeMealTiming(addForm, i)"
                class="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl
                       text-sm font-bold hover:bg-red-500/30 transition">
                Remove
              </button>
            </div>
            <button @click="addMealTiming(addForm)"
              class="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl
                     text-xs font-bold hover:bg-green-500/30 transition
                     border border-green-500/30">
              + Add Meal Timing
            </button>
          </div>

          <!-- Tag Inputs -->
          <p class="text-xs text-gray-400 font-bold uppercase
                    tracking-widest mb-3">
            Tags & Lists
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">
                Facilities
              </label>
              <TagInput
                v-model="addForm.facilities"
                placeholder="Add facility..."/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">
                Rules
              </label>
              <TagInput
                v-model="addForm.rules"
                placeholder="Add rule..."/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">
                Special Services
              </label>
              <TagInput
                v-model="addForm.special_services"
                placeholder="Add service..."/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">
                Tags
              </label>
              <TagInput
                v-model="addForm.tags"
                placeholder="Add tag..."/>
            </div>
            <div>
              <label class="text-xs text-gray-400 block mb-1.5">
                Languages Spoken
              </label>
              <TagInput
                v-model="addForm.languages_spoken"
                placeholder="e.g. Gujarati"/>
            </div>
          </div>

          <!-- Error + Actions -->
          <div v-if="addError"
               class="mb-4 p-3 bg-red-500/10 border border-red-500/30
                      rounded-xl text-sm text-red-400">
            {{ addError }}
          </div>
          <div class="flex gap-3">
            <button @click="create" :disabled="creating"
              class="flex items-center gap-2 px-5 py-2.5 bg-green-600
                     text-white rounded-xl font-bold text-sm
                     hover:bg-green-500 transition disabled:opacity-50">
              <div v-if="creating"
                   class="w-4 h-4 border-2 border-white/30
                          border-t-white rounded-full animate-spin"/>
              {{ creating ? 'Creating...' : 'Create Bhojanshala' }}
            </button>
            <button @click="showAddForm = false; resetAddForm()"
              class="px-5 py-2.5 bg-gray-800 text-gray-400 rounded-xl
                     font-bold text-sm hover:bg-gray-700 transition">
              Cancel
            </button>
          </div>
        </div>
      </Transition>

      <!-- List -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-8 h-8 border-2 border-green-500
                    border-t-transparent rounded-full animate-spin"/>
      </div>

      <div v-else-if="bhojanshalas.length === 0"
           class="bg-gray-900 rounded-2xl border border-gray-800
                  p-12 text-center text-gray-500 text-sm">
        No bhojanshalas yet. Add one above.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="b in bhojanshalas"
          :key="b.bhojanshala_id"
          class="bg-gray-900 rounded-2xl border border-gray-800
                 overflow-hidden hover:border-gray-700 transition"
        >
          <!-- Summary Row -->
          <div v-if="editingId !== b.bhojanshala_id"
               class="flex items-center justify-between p-5 gap-4">
            <div class="flex items-center gap-4 min-w-0">
              <div :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                b.bhojanshala_type === 'free'
                  ? 'bg-green-500/20'
                  : b.bhojanshala_type === 'donation'
                    ? 'bg-amber-500/20'
                    : 'bg-blue-500/20'
              ]">
                <span class="text-xl">🍽️</span>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap mb-0.5">
                  <p class="font-bold text-white truncate">
                    {{ b.bhojanshala_name }}
                  </p>
                  <span class="font-mono text-xs text-gray-600">
                    {{ b.bhojanshala_id }}
                  </span>
                  <span :class="[
                    'px-2 py-0.5 rounded-full text-xs font-bold',
                    b.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-700 text-gray-500'
                  ]">
                    {{ b.is_active ? 'Active' : 'Inactive' }}
                  </span>
                  <span :class="[
                    'px-2 py-0.5 rounded-full text-xs font-bold capitalize',
                    b.bhojanshala_type === 'free'
                      ? 'bg-green-500/20 text-green-400'
                      : b.bhojanshala_type === 'donation'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                  ]">
                    {{ b.bhojanshala_type }}
                  </span>
                </div>
                <p class="text-xs text-gray-500">
                  {{ b.bhojanshala_city }}, {{ b.bhojanshala_state }}
                  <span v-if="b.tirth?.tirth_name">
                    · {{ b.tirth.tirth_name }}
                  </span>
                  <span v-if="b.details?.seating_capacity">
                    · {{ b.details.seating_capacity }} seats
                  </span>
                  <span v-if="b.details?.manager_name">
                    · {{ b.details.manager_name }}
                  </span>
                </p>
              </div>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button @click="startEdit(b)"
                class="px-3 py-1.5 bg-blue-500/20 text-blue-400
                       rounded-lg text-xs font-bold hover:bg-blue-500/30
                       transition border border-blue-500/30">
                Edit
              </button>
              <button @click="deleteB(b)"
                class="px-3 py-1.5 bg-red-500/20 text-red-400
                       rounded-lg text-xs font-bold hover:bg-red-500/30
                       transition border border-red-500/30">
                Delete
              </button>
            </div>
          </div>

          <!-- Inline Edit Form -->
          <div v-else
               class="p-5 border-t border-green-500/20 bg-gray-800/30">
            <p class="text-xs text-green-400 font-bold uppercase
                      tracking-widest mb-4">
              Editing — {{ b.bhojanshala_name }}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2
                        lg:grid-cols-3 gap-3 mb-4">
              <div>
                <label class="text-xs text-gray-400 block mb-1">
                  Name
                </label>
                <input v-model="editForm.bhojanshala_name"
                  class="w-full bg-gray-800 border border-gray-700
                         rounded-xl px-3 py-2 text-sm text-white
                         focus:outline-none focus:border-green-500"/>
              </div>
              <div>
                <label class="text-xs text-gray-400 block mb-1">
                  Type
                </label>
                <select v-model="editForm.bhojanshala_type"
                  class="w-full bg-gray-800 border border-gray-700
                         rounded-xl px-3 py-2 text-sm text-white
                         focus:outline-none focus:border-green-500">
                  <option value="free">Free</option>
                  <option value="donation">Donation</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label class="text-xs text-gray-400 block mb-1">
                  Seating Capacity
                </label>
                <input v-model.number="editForm.seating_capacity"
                       type="number" min="1"
                  class="w-full bg-gray-800 border border-gray-700
                         rounded-xl px-3 py-2 text-sm text-white
                         focus:outline-none focus:border-green-500"/>
              </div>
              <div>
                <label class="text-xs text-gray-400 block mb-1">
                  Phone
                </label>
                <input v-model="editForm.bhojanshala_phone"
                  class="w-full bg-gray-800 border border-gray-700
                         rounded-xl px-3 py-2 text-sm text-white
                         focus:outline-none focus:border-green-500"/>
              </div>
              <div>
                <label class="text-xs text-gray-400 block mb-1">
                  Manager Name
                </label>
                <input v-model="editForm.manager_name"
                  class="w-full bg-gray-800 border border-gray-700
                         rounded-xl px-3 py-2 text-sm text-white
                         focus:outline-none focus:border-green-500"/>
              </div>
              <div>
                <label class="text-xs text-gray-400 block mb-1">
                  Active
                </label>
                <select v-model="editForm.is_active"
                  class="w-full bg-gray-800 border border-gray-700
                         rounded-xl px-3 py-2 text-sm text-white
                         focus:outline-none focus:border-green-500">
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>
              <div class="sm:col-span-2 lg:col-span-3">
                <label class="text-xs text-gray-400 block mb-1">
                  About
                </label>
                <textarea v-model="editForm.about" rows="2"
                  class="w-full bg-gray-800 border border-gray-700
                         rounded-xl px-3 py-2 text-sm text-white
                         resize-none
                         focus:outline-none focus:border-green-500"/>
              </div>
              <div class="sm:col-span-2 lg:col-span-3">
                <label class="text-xs text-gray-400 block mb-1">
                  Payment Info
                </label>
                <input v-model="editForm.payment_info"
                  class="w-full bg-gray-800 border border-gray-700
                         rounded-xl px-3 py-2 text-sm text-white
                         focus:outline-none focus:border-green-500"/>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="saveEdit(b)"
                class="px-4 py-2 bg-green-600 text-white rounded-xl
                       text-xs font-bold hover:bg-green-500 transition">
                Save Changes
              </button>
              <button @click="cancelEdit"
                class="px-4 py-2 bg-gray-700 text-gray-400 rounded-xl
                       text-xs font-bold hover:bg-gray-600 transition">
                Cancel
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
import TagInput from '~/components/admin/TagInput.vue'

definePageMeta({ layout: 'default' })

const adminStore = useAdminModeStore()
const { session } = useAuth()

const bhojanshalas = ref<any[]>([])
const tirths       = ref<any[]>([])
const loading      = ref(false)
const showAddForm  = ref(false)
const creating     = ref(false)
const addError     = ref('')
const editingId    = ref<string | null>(null)
const editForm     = ref<any>({})

const defaultAdd = () => ({
  bhojanshala_id:      '',
  bhojanshala_name:    '',
  bhojanshala_city:    '',
  bhojanshala_state:   '',
  bhojanshala_address: '',
  bhojanshala_phone:   '',
  bhojanshala_email:   '',
  bhojanshala_type:    'free',
  tirth_id:            '',
  about:               '',
  seating_capacity:    null as number | null,
  payment_info:        '',
  manager_name:        '',
  manager_phone:       '',
  dietary_info:
    'Pure Jain vegetarian. No onion, garlic, or root vegetables.',
  meal_timings:     [] as any[],
  facilities:       [] as string[],
  rules:            [] as string[],
  special_services: [] as string[],
  tags:             [] as string[],
  languages_spoken: [] as string[],
})

const addForm = ref(defaultAdd())

const authHeaders = () => ({
  Authorization: `Bearer ${session.value?.access_token || ''}`
})

const fetchBhojanshalas = async () => {
  loading.value = true
  try {
    bhojanshalas.value = await $fetch<any[]>(
      '/api/admin/bhojanshala',
      { headers: authHeaders() }
    )
  } finally {
    loading.value = false
  }
}

const fetchTirths = async () => {
  if (!adminStore.isSuperAdmin) return
  const { useSupabase } = await import(
    '~/features/auth/composables/useSupabase'
  )
  const { supabase } = useSupabase()
  const { data } = await supabase
    .schema('tirthlok')
    .from('tirth_cards')
    .select('tirth_id, tirth_name')
    .order('tirth_name')
  tirths.value = data || []
}

const addMealTiming = (form: any) => {
  form.meal_timings = [
    ...form.meal_timings,
    { meal_type: 'lunch', start_time: '11:00', end_time: '14:00' }
  ]
}

const removeMealTiming = (form: any, i: number) => {
  form.meal_timings = form.meal_timings
    .filter((_: any, idx: number) => idx !== i)
}

const create = async () => {
  addError.value = ''
  const f = addForm.value

  if (!f.bhojanshala_id || !f.bhojanshala_name ||
      !f.bhojanshala_city || !f.bhojanshala_state) {
    addError.value = 'ID, name, city, and state are required.'
    return
  }

  creating.value = true
  try {
    await $fetch('/api/admin/bhojanshala', {
      method:  'POST' as const,
      headers: authHeaders(),
      body: {
        ...f,
        tirth_id:         f.tirth_id         || null,
        seating_capacity: f.seating_capacity  || null,
      },
    })
    showAddForm.value = false
    resetAddForm()
    await fetchBhojanshalas()
  } catch (err: any) {
    addError.value = err?.data?.statusMessage || 'Failed to create.'
  } finally {
    creating.value = false
  }
}

const resetAddForm = () => {
  addForm.value  = defaultAdd()
  addError.value = ''
}

const startEdit = (b: any) => {
  editingId.value = b.bhojanshala_id
  editForm.value  = {
    bhojanshala_name:  b.bhojanshala_name,
    bhojanshala_type:  b.bhojanshala_type,
    bhojanshala_phone: b.bhojanshala_phone     || '',
    is_active:         b.is_active,
    about:             b.details?.about         || '',
    seating_capacity:  b.details?.seating_capacity || null,
    payment_info:      b.details?.payment_info   || '',
    manager_name:      b.details?.manager_name   || '',
  }
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value  = {}
}

const saveEdit = async (b: any) => {
  await $fetch(`/api/admin/bhojanshala/${b.bhojanshala_id}`, {
    method:  'PATCH' as const,
    headers: authHeaders(),
    body:    editForm.value,
  })
  cancelEdit()
  await fetchBhojanshalas()
}

const deleteB = async (b: any) => {
  if (!confirm(
    `Delete "${b.bhojanshala_name}"?\n\nIt will be hidden from users.`
  )) return
  await $fetch(`/api/admin/bhojanshala/${b.bhojanshala_id}`, {
    method:  'DELETE' as const,
    headers: authHeaders(),
  })
  await fetchBhojanshalas()
}

onMounted(async () => {
  await Promise.all([fetchBhojanshalas(), fetchTirths()])
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
  transform: translateY(-12px);
}
</style>
