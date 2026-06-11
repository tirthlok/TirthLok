<template>
  <div v-if="!adminStore.isAdminMode"
       class="flex items-center justify-center min-h-screen">
    <p class="text-gray-500">Access denied.</p>
  </div>

  <div v-else class="min-h-screen bg-gray-950 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white">Rooms</h1>
          <p class="text-gray-400 text-sm mt-1">
            {{ rooms.length }} room type{{ rooms.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <button
          @click="showAddForm = !showAddForm"
          class="flex items-center gap-2 px-4 py-2.5
                 bg-amber-500 text-gray-900 rounded-xl
                 font-bold text-sm hover:bg-amber-400 transition"
        >
          <Icon :name="('Plus' as any)" :size="16" />
          Add Room
        </button>
      </div>

      <!-- Add Room Form -->
      <Transition name="slide-down">
        <div v-if="showAddForm"
             class="bg-gray-900 rounded-2xl border border-amber-500/30
                    p-6 mb-6">
          <h2 class="font-bold text-white mb-5 flex items-center gap-2">
            <Icon :name="('Plus' as any)" :size="18" class="text-amber-400" />
            New Room Type
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <!-- Dharamshala -->
            <div v-if="adminStore.isSuperAdmin" class="lg:col-span-3">
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Dharamshala *
              </label>
              <select v-model="addForm.dharamshala_id"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white
                       focus:outline-none focus:border-amber-500 transition">
                <option value="">Select dharamshala</option>
                <option v-for="d in dharamshalas" :key="d.dharamshala_id"
                        :value="d.dharamshala_id">
                  {{ d.dharamshala_name }}
                </option>
              </select>
            </div>

            <!-- Name -->
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Room Name *
              </label>
              <input v-model="addForm.name" placeholder="Deluxe Room"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-amber-500 transition"/>
            </div>

            <!-- Category -->
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Category *
              </label>
              <select v-model="addForm.room_category"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white
                       focus:outline-none focus:border-amber-500 transition">
                <option value="">Select category</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="family_suite">Family Suite</option>
                <option value="dormitory">Dormitory</option>
                <option value="hall">Hall</option>
              </select>
            </div>

            <!-- Bed Configuration -->
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Bed Configuration *
              </label>
              <input v-model="addForm.bed_configuration"
                     placeholder="Single Bed / Double Bed"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-amber-500 transition"/>
            </div>

            <!-- Capacity -->
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Room Capacity *
              </label>
              <input v-model.number="addForm.capacity" type="number" min="1"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white
                       focus:outline-none focus:border-amber-500 transition"/>
            </div>

            <!-- Max Guests -->
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Max Guests *
              </label>
              <input v-model.number="addForm.max_guests" type="number" min="1"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white
                       focus:outline-none focus:border-amber-500 transition"/>
            </div>

            <!-- Base Price -->
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Base Price (₹) *
              </label>
              <input v-model.number="addForm.base_price" type="number" min="0"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white
                       focus:outline-none focus:border-amber-500 transition"/>
            </div>

            <!-- Discount Price -->
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Discount Price (₹)
              </label>
              <input v-model.number="addForm.discount_price" type="number" min="0"
                placeholder="Optional"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-amber-500 transition"/>
            </div>

            <!-- Inventory -->
            <div>
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Total Inventory *
              </label>
              <input v-model.number="addForm.total_inventory" type="number" min="1"
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white
                       focus:outline-none focus:border-amber-500 transition"/>
            </div>

            <!-- Description -->
            <div class="lg:col-span-3">
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Description
              </label>
              <textarea v-model="addForm.description" rows="2"
                placeholder="Brief description of the room..."
                class="w-full bg-gray-800 border border-gray-700 rounded-xl
                       px-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-amber-500 transition
                       resize-none"/>
            </div>

            <!-- Amenities -->
            <div class="lg:col-span-3">
              <label class="text-xs text-gray-400 font-medium block mb-1.5">
                Amenities
              </label>
              <div class="flex gap-2 mb-2">
                <input v-model="amenityInput" placeholder="Type amenity and press Enter"
                  @keydown.enter.prevent="addAmenity(addForm)"
                  class="flex-1 bg-gray-800 border border-gray-700 rounded-xl
                         px-4 py-2.5 text-sm text-white placeholder-gray-500
                         focus:outline-none focus:border-amber-500 transition"/>
                <button @click="addAmenity(addForm)" type="button"
                  class="px-4 py-2.5 bg-amber-500/20 text-amber-400 rounded-xl
                         text-sm font-bold hover:bg-amber-500/30 transition
                         border border-amber-500/30">
                  Add
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="(amenity, i) in addForm.amenities" :key="i"
                  class="flex items-center gap-1.5 px-3 py-1 bg-gray-800
                         text-gray-300 rounded-full text-xs border border-gray-700">
                  {{ amenity }}
                  <button @click="removeAmenity(addForm, i)"
                    class="text-gray-500 hover:text-red-400 transition">
                    ×
                  </button>
                </span>
              </div>
            </div>

          </div>

          <!-- Error -->
          <div v-if="addError"
               class="mt-4 p-3 bg-red-500/10 border border-red-500/30
                      rounded-xl text-sm text-red-400">
            {{ addError }}
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-5">
            <button @click="createRoom" :disabled="creating"
              class="flex items-center gap-2 px-5 py-2.5
                     bg-amber-500 text-gray-900 rounded-xl font-bold
                     text-sm hover:bg-amber-400 transition disabled:opacity-50">
              <div v-if="creating"
                   class="w-4 h-4 border-2 border-gray-900/30
                          border-t-gray-900 rounded-full animate-spin"/>
              {{ creating ? 'Creating...' : 'Create Room' }}
            </button>
            <button @click="showAddForm = false; resetAddForm()"
              class="px-5 py-2.5 bg-gray-800 text-gray-400 rounded-xl
                     font-bold text-sm hover:bg-gray-700 transition">
              Cancel
            </button>
          </div>
        </div>
      </Transition>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-8 h-8 border-2 border-amber-500
                    border-t-transparent rounded-full animate-spin"/>
      </div>

      <!-- Rooms Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="room in rooms" :key="room.room_type_id"
             class="bg-gray-900 rounded-2xl border border-gray-800
                    overflow-hidden hover:border-gray-700 transition">

          <!-- Card Header -->
          <div class="p-5 border-b border-gray-800">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 min-w-0 mr-3">
                <p class="font-bold text-white truncate">{{ room.name }}</p>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ room.dharamshala?.dharamshala_name }}
                </p>
                <span class="inline-block mt-1 px-2 py-0.5 bg-gray-800
                             text-gray-400 rounded-full text-xs capitalize">
                  {{ room.room_category?.replace('_', ' ') }}
                </span>
              </div>
              <button @click="toggleAvailability(room)"
                :class="[
                  'relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0',
                  room.is_available_ui ? 'bg-green-500' : 'bg-gray-700'
                ]">
                <div :class="[
                  'absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow',
                  room.is_available_ui ? 'left-5' : 'left-0.5'
                ]"/>
              </button>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="bg-gray-800 rounded-xl p-2">
                <p class="text-xs text-gray-500">Price</p>
                <p class="text-sm font-bold text-white">₹{{ room.base_price }}</p>
              </div>
              <div class="bg-gray-800 rounded-xl p-2">
                <p class="text-xs text-gray-500">Rooms</p>
                <p class="text-sm font-bold text-white">{{ room.total_inventory }}</p>
              </div>
              <div class="bg-gray-800 rounded-xl p-2">
                <p class="text-xs text-gray-500">Guests</p>
                <p class="text-sm font-bold text-white">{{ room.max_guests }}</p>
              </div>
            </div>
          </div>

          <!-- Collapsed Edit Area -->
          <div v-if="editingRoom !== room.room_type_id" class="p-4 space-y-3">
            <div class="grid grid-cols-2 gap-2">
              <button @click="startEdit(room)"
                class="py-2 bg-blue-500/20 text-blue-400 rounded-lg
                       text-xs font-bold hover:bg-blue-500/30 transition
                       border border-blue-500/30">
                Edit
              </button>
              <button @click="deleteRoom(room)"
                class="py-2 bg-red-500/20 text-red-400 rounded-lg
                       text-xs font-bold hover:bg-red-500/30 transition
                       border border-red-500/30">
                Delete
              </button>
            </div>
          </div>

          <!-- Expanded Edit Form -->
          <div v-else class="p-4 space-y-3 border-t border-amber-500/20
                             bg-gray-800/50">
            <p class="text-xs font-bold text-amber-400 uppercase tracking-wide">
              Editing
            </p>

            <div class="space-y-3">
              <div>
                <label class="text-xs text-gray-400 block mb-1">Name</label>
                <input v-model="editForm.name"
                  class="w-full bg-gray-800 border border-gray-700 rounded-lg
                         px-3 py-2 text-sm text-white
                         focus:outline-none focus:border-amber-500"/>
              </div>
              <div>
                <label class="text-xs text-gray-400 block mb-1">
                  Description
                </label>
                <textarea v-model="editForm.description" rows="2"
                  class="w-full bg-gray-800 border border-gray-700 rounded-lg
                         px-3 py-2 text-sm text-white resize-none
                         focus:outline-none focus:border-amber-500"/>
              </div>
              <div>
                <label class="text-xs text-gray-400 block mb-1">
                  Bed Configuration
                </label>
                <input v-model="editForm.bed_configuration"
                  class="w-full bg-gray-800 border border-gray-700 rounded-lg
                         px-3 py-2 text-sm text-white
                         focus:outline-none focus:border-amber-500"/>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-xs text-gray-400 block mb-1">
                    Base Price (₹)
                  </label>
                  <input v-model.number="editForm.base_price" type="number"
                    class="w-full bg-gray-800 border border-gray-700 rounded-lg
                           px-3 py-2 text-sm text-white
                           focus:outline-none focus:border-amber-500"/>
                </div>
                <div>
                  <label class="text-xs text-gray-400 block mb-1">
                    Discount (₹)
                  </label>
                  <input v-model.number="editForm.discount_price" type="number"
                    placeholder="Optional"
                    class="w-full bg-gray-800 border border-gray-700 rounded-lg
                           px-3 py-2 text-sm text-white placeholder-gray-600
                           focus:outline-none focus:border-amber-500"/>
                </div>
                <div>
                  <label class="text-xs text-gray-400 block mb-1">
                    Capacity
                  </label>
                  <input v-model.number="editForm.capacity" type="number"
                    class="w-full bg-gray-800 border border-gray-700 rounded-lg
                           px-3 py-2 text-sm text-white
                           focus:outline-none focus:border-amber-500"/>
                </div>
                <div>
                  <label class="text-xs text-gray-400 block mb-1">
                    Max Guests
                  </label>
                  <input v-model.number="editForm.max_guests" type="number"
                    class="w-full bg-gray-800 border border-gray-700 rounded-lg
                           px-3 py-2 text-sm text-white
                           focus:outline-none focus:border-amber-500"/>
                </div>
                <div class="col-span-2">
                  <label class="text-xs text-gray-400 block mb-1">
                    Inventory
                  </label>
                  <input v-model.number="editForm.total_inventory" type="number"
                    class="w-full bg-gray-800 border border-gray-700 rounded-lg
                           px-3 py-2 text-sm text-white
                           focus:outline-none focus:border-amber-500"/>
                </div>
              </div>

              <!-- Amenities in edit -->
              <div>
                <label class="text-xs text-gray-400 block mb-1">Amenities</label>
                <div class="flex gap-2 mb-2">
                  <input v-model="editAmenityInput"
                    placeholder="Add amenity..."
                    @keydown.enter.prevent="addAmenity(editForm)"
                    class="flex-1 bg-gray-800 border border-gray-700 rounded-lg
                           px-3 py-2 text-sm text-white placeholder-gray-600
                           focus:outline-none focus:border-amber-500"/>
                  <button @click="addAmenity(editForm)" type="button"
                    class="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg
                           text-xs font-bold hover:bg-gray-600 transition">
                    +
                  </button>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="(a, i) in editForm.amenities" :key="i"
                    class="flex items-center gap-1 px-2 py-0.5 bg-gray-800
                           text-gray-300 rounded-full text-xs">
                    {{ a }}
                    <button @click="removeAmenity(editForm, i)"
                      class="text-gray-500 hover:text-red-400">×</button>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex gap-2 pt-2">
              <button @click="saveEdit(room)"
                class="flex-1 py-2 bg-amber-500/20 text-amber-400 rounded-lg
                       text-xs font-bold hover:bg-amber-500/30 transition
                       border border-amber-500/30">
                Save
              </button>
              <button @click="cancelEdit"
                class="flex-1 py-2 bg-gray-700 text-gray-400 rounded-lg
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

definePageMeta({ layout: 'default' })

const adminStore = useAdminModeStore()
const { session } = useAuth()

const rooms        = ref<any[]>([])
const dharamshalas = ref<any[]>([])
const loading      = ref(false)
const showAddForm  = ref(false)
const creating     = ref(false)
const addError     = ref('')
const editingRoom  = ref<string | null>(null)
const amenityInput     = ref('')
const editAmenityInput = ref('')

const defaultAddForm = () => ({
  dharamshala_id:    adminStore.managerDharamshalaId || '',
  name:              '',
  room_category:     '',
  description:       '',
  bed_configuration: '',
  capacity:          2,
  max_guests:        2,
  max_children:      0,
  base_price:        0,
  discount_price:    null as number | null,
  total_inventory:   1,
  amenities:         [] as string[],
  is_available_ui:   true,
})

const addForm  = ref(defaultAddForm())
const editForm = ref<any>({})

const authHeaders = () => ({
  Authorization: `Bearer ${session.value?.access_token || ''}`
})

const fetchRooms = async () => {
  loading.value = true
  try {
    rooms.value = await $fetch<any[]>(
      '/api/admin/rooms',
      { headers: authHeaders() }
    )
  } finally {
    loading.value = false
  }
}

const fetchDharamshalas = async () => {
  if (!adminStore.isSuperAdmin) return
  const { useSupabase } = await import(
    '~/features/auth/composables/useSupabase'
  )
  const { supabase } = useSupabase()
  const { data } = await supabase
    .schema('tirthlok')
    .from('dharamshala_cards')
    .select('dharamshala_id, dharamshala_name')
    .order('dharamshala_name')
  dharamshalas.value = data || []
}

const addAmenity = (form: any) => {
  const val = (form === addForm.value ? amenityInput : editAmenityInput).value.trim()
  if (!val) return
  form.amenities = [...(form.amenities || []), val]
  if (form === addForm.value) amenityInput.value = ''
  else editAmenityInput.value = ''
}

const removeAmenity = (form: any, index: number) => {
  form.amenities = form.amenities.filter((_: any, i: number) => i !== index)
}

const createRoom = async () => {
  addError.value = ''
  const form = addForm.value
  if (!form.dharamshala_id || !form.name || !form.room_category ||
      !form.bed_configuration || !form.capacity || !form.max_guests ||
      !form.base_price || !form.total_inventory) {
    addError.value = 'Please fill all required fields.'
    return
  }
  creating.value = true
  try {
    await $fetch('/api/admin/rooms', {
      method: 'POST',
      headers: authHeaders(),
      body: form,
    })
    showAddForm.value = false
    resetAddForm()
    await fetchRooms()
  } catch (err: any) {
    addError.value = err?.data?.statusMessage || 'Failed to create room.'
  } finally {
    creating.value = false
  }
}

const resetAddForm = () => {
  addForm.value = defaultAddForm()
  addError.value = ''
  amenityInput.value = ''
}

const startEdit = (room: any) => {
  editingRoom.value = room.room_type_id
  editForm.value = {
    name:              room.name,
    description:       room.description || '',
    bed_configuration: room.bed_configuration,
    capacity:          room.capacity,
    max_guests:        room.max_guests,
    base_price:        room.base_price,
    discount_price:    room.discount_price || null,
    total_inventory:   room.total_inventory,
    amenities:         [...(room.amenities || [])],
  }
  editAmenityInput.value = ''
}

const cancelEdit = () => {
  editingRoom.value = null
  editForm.value = {}
}

const saveEdit = async (room: any) => {
  await $fetch(`/api/admin/rooms/${room.room_type_id}`, {
    method: 'PATCH' as const,
    headers: authHeaders(),
    body: editForm.value,
  })
  cancelEdit()
  await fetchRooms()
}

const toggleAvailability = async (room: any) => {
  room.is_available_ui = !room.is_available_ui
  await $fetch(`/api/admin/rooms/${room.room_type_id}`, {
    method: 'PATCH' as const,
    headers: authHeaders(),
    body: { is_available_ui: room.is_available_ui },
  })
}

const deleteRoom = async (room: any) => {
  if (!confirm(
    `Delete "${room.name}"?\n\nThis room will be hidden from users. Existing bookings are preserved.`
  )) return

  await $fetch(`/api/admin/rooms/${room.room_type_id}`, {
    method: 'DELETE' as const,
    headers: authHeaders(),
  })
  await fetchRooms()
}

onMounted(async () => {
  await Promise.all([fetchRooms(), fetchDharamshalas()])
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
