<template>
  <section id="section-timings" class="py-4 sm:py-6">
    <!-- Unified timings card container -->
    <div class="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
      <!-- Title & Icon -->
      <div class="flex items-start gap-4 mb-6">
        <div class="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
          <Icon name="Clock" :size="20" />
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Temple Timings</h2>
          <p class="text-xs text-gray-500 mt-0.5">Darshan, Pooja, and Aarti timings</p>
        </div>
      </div>

      <!-- Real-time open/closed status badge -->
      <div :class="['flex items-center justify-between p-3 rounded-2xl border mb-5 text-sm font-semibold transition-all', currentTimeStatus.statusClass]">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
          <span>{{ currentTimeStatus.statusText }}</span>
        </div>
        <span class="text-xs opacity-90 font-medium">{{ currentTimeStatus.message }}</span>
      </div>

      <!-- Sleek tab selectors -->
      <div class="flex p-1 bg-gray-50 rounded-2xl mb-5 border border-gray-100/60">
        <button
          v-for="t in tabs"
          :key="t.id"
          @click="activeTab = t.id"
          :class="[
            'flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all',
            activeTab === t.id
              ? 'bg-white text-orange-950 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          ]"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="min-h-[190px] transition-all">
        <!-- 1. Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-4">
          <div class="p-4 bg-amber-50/30 rounded-2xl border border-amber-100/40 relative overflow-hidden">
            <Icon name="Sun" :size="80" class="absolute -right-6 -bottom-6 text-amber-200/10 pointer-events-none" />
            <h4 class="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">Gates Opening Status</h4>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex justify-between items-center pb-2 border-b border-gray-100/60">
                <span class="text-gray-500">Opening Time</span>
                <span class="font-extrabold text-gray-900">{{ openingTime }}</span>
              </div>
              <div class="flex justify-between items-center pb-2 border-b border-gray-100/60">
                <span class="text-gray-500">Closing Time</span>
                <span class="font-extrabold text-gray-900">{{ closingTime }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Pakshal Timings</span>
                <span class="font-extrabold text-amber-700">{{ pakshalTime }}</span>
              </div>
            </div>
          </div>

          <div class="p-4 bg-rose-50/20 rounded-2xl border border-rose-100/30 relative overflow-hidden">
            <Icon name="Compass" :size="80" class="absolute -right-6 -bottom-6 text-rose-200/10 pointer-events-none" />
            <h4 class="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3">Darshan Windows</h4>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex justify-between items-center pb-2 border-b border-gray-100/60">
                <span class="text-gray-500">Morning Darshan</span>
                <span class="font-bold text-gray-900">{{ morningDarshan }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Evening Darshan</span>
                <span class="font-bold text-gray-900">{{ eveningDarshan }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Pooja Tab -->
        <div v-if="activeTab === 'pooja'" class="space-y-3">
          <div
            v-for="(pooja, idx) in poojaList"
            :key="idx"
            class="flex items-start gap-3 p-3 bg-purple-50/30 border border-purple-100/30 rounded-xl hover:border-purple-200 transition-all"
          >
            <div class="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-lg text-[10px] font-bold whitespace-nowrap mt-0.5">
              {{ pooja.time }}
            </div>
            <div>
              <h4 class="text-xs font-bold text-gray-900">{{ pooja.name }}</h4>
              <p v-if="pooja.description" class="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{{ pooja.description }}</p>
            </div>
          </div>
        </div>

        <!-- 3. Aarti Tab -->
        <div v-if="activeTab === 'aarti'" class="space-y-3">
          <div
            v-for="(aarti, idx) in aartiList"
            :key="idx"
            class="flex items-start gap-3 p-3 bg-red-50/20 border border-red-100/30 rounded-xl hover:border-red-200 transition-all"
          >
            <div class="px-2 py-0.5 bg-red-100 text-red-800 rounded-lg text-[10px] font-bold whitespace-nowrap mt-0.5">
              {{ aarti.time }}
            </div>
            <div>
              <h4 class="text-xs font-bold text-gray-900">{{ aarti.name }}</h4>
              <p v-if="aarti.description" class="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{{ aarti.description }}</p>
            </div>
          </div>
        </div>

        <!-- 4. Special Tab -->
        <div v-if="activeTab === 'special'" class="space-y-3 text-xs text-gray-700">
          <div class="p-3.5 bg-blue-50/30 border border-blue-100/40 rounded-2xl relative overflow-hidden">
            <h5 class="font-bold text-gray-900 uppercase tracking-wide mb-1">Weekly Changes</h5>
            <p class="leading-relaxed">{{ weeklyChanges }}</p>
          </div>
          <div class="p-3.5 bg-blue-50/30 border border-blue-100/40 rounded-2xl relative overflow-hidden">
            <h5 class="font-bold text-gray-900 uppercase tracking-wide mb-1">Seasonal / Holidays</h5>
            <p class="leading-relaxed">{{ seasonalTimings }}</p>
          </div>
        </div>
      </div>

      <!-- Warning Note -->
      <div class="mt-4 p-3 bg-orange-50/40 border border-orange-100/40 rounded-2xl flex items-start gap-2.5">
        <Icon name="AlertTriangle" :size="15" class="text-orange-500 mt-0.5 flex-shrink-0" />
        <div class="text-[11px] text-gray-600 leading-relaxed">
          <span class="font-bold text-orange-800">Extended Timings:</span> Commences from 4:30 AM during Paryushan and Kalyanak festivals.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Tirth } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()

const activeTab = ref('overview')
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'pooja', label: 'Pooja' },
  { id: 'aarti', label: 'Aarti' },
  { id: 'special', label: 'Special' }
]

const PLACEHOLDER = ['to be updated soon', 'to be updated', '']
const isAvailable = (val: string | undefined | null) =>
  !!val && !PLACEHOLDER.includes(val.toLowerCase().trim())

const hasDarshanDb = computed(() => isAvailable(props.tirth.darshanTimings))
const hasPoojaDb = computed(() => isAvailable(props.tirth.poojaTimings))

const openingTime = computed(() => {
  if (hasDarshanDb.value) {
    const parts = props.tirth.darshanTimings.split('-')
    if (parts.length >= 1) return parts[0].trim()
  }
  return '06:00 AM'
})

const closingTime = computed(() => {
  if (hasDarshanDb.value) {
    const parts = props.tirth.darshanTimings.split('-')
    if (parts.length >= 2) return parts[1].trim()
  }
  return '09:00 PM'
})

const pakshalTime = computed(() => '06:30 AM - 07:15 AM')
const morningDarshan = computed(() => {
  if (hasDarshanDb.value) return props.tirth.darshanTimings
  return '06:00 AM - 12:00 PM'
})
const eveningDarshan = computed(() => '05:00 PM - 09:00 PM')
const weeklyChanges = computed(() => 'Standard schedule is maintained throughout the week. No weekly closures.')
const seasonalTimings = computed(() => 'No seasonal updates. Gates remain open on public holidays.')

// Dynamic pooja list
const poojaList = computed(() => {
  if (hasPoojaDb.value) {
    return [
      {
        name: 'Main Dev Pooja',
        time: props.tirth.poojaTimings,
        description: 'Primary morning puja schedule.'
      },
      {
        name: 'Snatra Pooja',
        time: '07:30 AM',
        description: 'Bathing ritual performed daily for the deity.'
      }
    ]
  }
  return [
    {
      name: 'Snatra Pooja',
      time: '07:30 AM',
      description: 'Daily bathing and worship ritual of Lord Jinendra.'
    },
    {
      name: 'Ashtaprakari Pooja',
      time: '09:00 AM',
      description: 'Traditional eight-fold worship ritual using sandalwood, flowers, and incense.'
    },
    {
      name: 'Dev Vandan',
      time: '11:00 AM',
      description: 'Mid-day prayer and meditation.'
    }
  ]
})

// Aarti list
const aartiList = computed(() => [
  {
    name: 'Mangal Aarti',
    time: '06:15 AM',
    description: 'First morning light offering accompanying the temple gate opening.'
  },
  {
    name: 'Sandhya Aarti',
    time: '07:00 PM',
    description: 'Evening light waving ceremony.'
  },
  {
    name: 'Mangal Divo',
    time: '07:15 PM',
    description: 'Waving of the sacred oil lamp right after Sandhya Aarti.'
  }
])

// Real-time opening status calculations
const currentTimeStatus = computed(() => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMin = now.getMinutes()
  
  let openH = 6, openM = 0
  let closeH = 21, closeM = 0
  
  try {
    const parseTime = (timeStr: string) => {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
      if (match) {
        let h = parseInt(match[1])
        const m = parseInt(match[2])
        const isPM = match[3].toUpperCase() === 'PM'
        if (isPM && h < 12) h += 12
        if (!isPM && h === 12) h = 0
        return { h, m }
      }
      return null
    }
    const o = parseTime(openingTime.value)
    if (o) { openH = o.h; openM = o.m }
    const c = parseTime(closingTime.value)
    if (c) { closeH = c.h; closeM = c.m }
  } catch (e) {
    // fallback to defaults
  }

  const nowVal = currentHour * 60 + currentMin
  const openVal = openH * 60 + openM
  const closeVal = closeH * 60 + closeM
  
  const isOpen = nowVal >= openVal && nowVal < closeVal
  return {
    isOpen,
    statusText: isOpen ? 'Open Now' : 'Closed Now',
    statusClass: isOpen 
      ? 'bg-emerald-50/50 text-emerald-800 border-emerald-100/50' 
      : 'bg-red-50/50 text-red-800 border-red-100/50',
    message: isOpen ? `Closes at ${closingTime.value}` : `Opens at ${openingTime.value}`
  }
})
</script>
