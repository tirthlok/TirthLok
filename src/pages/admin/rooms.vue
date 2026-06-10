<template>
  <div v-if="!adminStore.isAdminMode"
       class="flex items-center justify-center min-h-screen">
    <p class="text-gray-500">Access denied.</p>
  </div>

  <div v-else class="min-h-screen bg-gray-950 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white">Rooms</h1>
        <p class="text-gray-400 text-sm mt-1">
          Manage room inventory and availability
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-8 h-8 border-2 border-amber-500 
                    border-t-transparent rounded-full animate-spin" />
      </div>

      <!-- Rooms Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 
                         lg:grid-cols-3 gap-5">
        <div
          v-for="room in rooms"
          :key="room.room_type_id"
          class="bg-gray-900 rounded-2xl border border-gray-800 
                 overflow-hidden hover:border-gray-700 transition"
        >
          <!-- Card Header -->
          <div class="p-5 border-b border-gray-800">
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="font-bold text-white">{{ room.name }}</p>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ room.dharamshala?.dharamshala_name }}
                </p>
              </div>
              <!-- Toggle availability -->
              <button
                @click="toggleAvailability(room)"
                :class="[
                  'relative w-11 h-6 rounded-full transition-all duration-300',
                  room.is_available_ui ? 'bg-green-500' : 'bg-gray-700'
                ]"
              >
                <div :class="[
                  'absolute top-0.5 w-5 h-5 bg-white rounded-full',
                  'transition-all duration-300 shadow',
                  room.is_available_ui ? 'left-5' : 'left-0.5'
                ]" />
              </button>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="bg-gray-800 rounded-xl p-2">
                <p class="text-xs text-gray-500">Price</p>
                <p class="text-sm font-bold text-white">
                  ₹{{ room.base_price }}
                </p>
              </div>
              <div class="bg-gray-800 rounded-xl p-2">
                <p class="text-xs text-gray-500">Inventory</p>
                <p class="text-sm font-bold text-white">
                  {{ room.total_inventory }}
                </p>
              </div>
              <div class="bg-gray-800 rounded-xl p-2">
                <p class="text-xs text-gray-500">Capacity</p>
                <p class="text-sm font-bold text-white">
                  {{ room.max_guests }}
                </p>
              </div>
            </div>
          </div>

          <!-- Edit Form -->
          <div class="p-4 space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-gray-500 font-medium 
                               block mb-1">
                  Base Price (₹)
                </label>
                <input
                  v-model.number="room.base_price"
                  type="number"
                  class="w-full bg-gray-800 border border-gray-700 
                         rounded-lg px-3 py-2 text-sm text-white 
                         focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 font-medium 
                               block mb-1">
                  Inventory
                </label>
                <input
                  v-model.number="room.total_inventory"
                  type="number"
                  class="w-full bg-gray-800 border border-gray-700 
                         rounded-lg px-3 py-2 text-sm text-white 
                         focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <button
              @click="saveRoom(room)"
              class="w-full py-2 bg-amber-500/20 text-amber-400 
                     rounded-lg text-xs font-bold hover:bg-amber-500/30 
                     transition border border-amber-500/30"
            >
              Save Changes
            </button>
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

definePageMeta({ layout: 'default' })

const adminStore = useAdminModeStore()
const { session } = useAuth()
const rooms   = ref<any[]>([])
const loading = ref(false)

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

const toggleAvailability = async (room: any) => {
  room.is_available_ui = !room.is_available_ui
  await $fetch(`/api/admin/rooms/${room.room_type_id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: { is_available_ui: room.is_available_ui },
  })
}

const saveRoom = async (room: any) => {
  await $fetch(`/api/admin/rooms/${room.room_type_id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: {
      base_price:      room.base_price,
      total_inventory: room.total_inventory,
    },
  })
  alert('Room updated successfully')
}

onMounted(fetchRooms)
</script>
