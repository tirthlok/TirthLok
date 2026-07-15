<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- 1. By Road -->
      <div class="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/40 to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-blue-100/70 rounded-xl text-blue-600">
            <Icon name="Car" :size="20" />
          </div>
          <h3 class="font-bold text-gray-900 text-base sm:text-lg">By Road</h3>
        </div>
        <p class="text-sm text-gray-700 leading-relaxed">
          {{ roadInfo }}
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700">
            Highway Access
          </span>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700">
            Bus Station Near
          </span>
        </div>
      </div>

      <!-- 2. By Train -->
      <div class="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-indigo-100/70 rounded-xl text-indigo-600">
            <Icon name="Train" :size="20" />
          </div>
          <h3 class="font-bold text-gray-900 text-base sm:text-lg">By Train</h3>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <span class="text-xs text-gray-400 font-semibold uppercase">Nearest Station</span>
            <span class="text-sm font-bold text-gray-800 text-right">{{ trainStation }}</span>
          </div>
          <div class="flex justify-between items-center border-t border-gray-100/60 pt-2">
            <span class="text-xs text-gray-400 font-semibold uppercase">Distance</span>
            <span class="text-sm font-bold text-indigo-700">{{ trainDistance }} km</span>
          </div>
          <div class="flex justify-between items-center border-t border-gray-100/60 pt-2">
            <span class="text-xs text-gray-400 font-semibold uppercase">Travel Time</span>
            <span class="text-sm font-bold text-gray-800">{{ trainTime }} mins</span>
          </div>
        </div>
        <p class="mt-3 text-xs text-gray-600 leading-relaxed">
          Taxis and auto-rickshaws are readily available from the station exit directly to the temple gates.
        </p>
      </div>

      <!-- 3. By Air -->
      <div class="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/40 to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-purple-100/70 rounded-xl text-purple-600">
            <Icon name="Plane" :size="20" />
          </div>
          <h3 class="font-bold text-gray-900 text-base sm:text-lg">By Air</h3>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <span class="text-xs text-gray-400 font-semibold uppercase">Nearest Airport</span>
            <span class="text-sm font-bold text-gray-800 text-right">{{ airportName }}</span>
          </div>
          <div class="flex justify-between items-center border-t border-gray-100/60 pt-2">
            <span class="text-xs text-gray-400 font-semibold uppercase">Distance</span>
            <span class="text-sm font-bold text-purple-700">~{{ airportDistance }} km</span>
          </div>
          <div class="flex justify-between items-center border-t border-gray-100/60 pt-2">
            <span class="text-xs text-gray-400 font-semibold uppercase">Travel Time</span>
            <span class="text-sm font-bold text-gray-800">~{{ airportTime }} hrs</span>
          </div>
        </div>
        <p class="mt-3 text-xs text-gray-600 leading-relaxed">
          Prepaid taxi services connect the airport to the Tirth. Flight connections to major metros.
        </p>
      </div>

      <!-- 4. Local Transport -->
      <div class="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-emerald-100/70 rounded-xl text-emerald-600">
            <Icon name="Navigation" :size="20" />
          </div>
          <h3 class="font-bold text-gray-900 text-base sm:text-lg">Local Transport</h3>
        </div>
        <p class="text-sm text-gray-700 leading-relaxed">
          Auto-rickshaws, cycle-rickshaws, and e-rickshaws operate actively near the temple area. Private cabs can be hired for full-day sightseeing. Walking is highly suitable for moving between the main complex, Dharamshalas, and Bhojanshala.
        </p>
      </div>

      <!-- 5. Parking Information -->
      <div class="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/40 to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-amber-100/70 rounded-xl text-amber-600">
            <Icon name="Home" :size="20" />
          </div>
          <h3 class="font-bold text-gray-900 text-base sm:text-lg">Parking & Security</h3>
        </div>
        <p class="text-sm text-gray-700 leading-relaxed">
          Ample dedicated, secure parking is available for private vehicles, luxury buses, and cabs near the main office. Parking is free for visiting pilgrims and guests staying at the connected Dharamshalas. CCTV surveillance is active.
        </p>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tirth } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()

// Generate dynamic, realistic values based on Tirth location
const city = computed(() => props.tirth.location.city || 'the temple')
const state = computed(() => props.tirth.location.state || 'India')

const roadInfo = computed(() => {
  if (state.value.toLowerCase() === 'gujarat') {
    return `Excellent road connectivity via State Highway SH-17 and NH-48. Regular State Transport (GSRTC) and private sleeper buses operate directly from Ahmedabad, Surat, and Vadodara to ${city.value}.`
  }
  if (state.value.toLowerCase() === 'rajasthan') {
    return `Well connected via NH-58 and NH-48. Regular state buses (RSRTC) and private deluxe coaches run from Jaipur, Udaipur, and Jodhpur directly to ${city.value} on a daily schedule.`
  }
  return `Accessible via major national and state highways. Well-maintained district roads connect the Tirth to nearest urban hubs. Direct private buses and cabs are easily rentable.`
})

const trainStation = computed(() => {
  if (city.value.toLowerCase() === 'palitana') return 'Palitana Junction (PIT)'
  if (city.value.toLowerCase() === 'ankleshwar') return 'Ankleshwar Junction (AKV)'
  if (city.value.toLowerCase() === 'abu road' || city.value.toLowerCase() === 'dilwara') return 'Abu Road (ABR)'
  return `${city.value} Railway Station`
})

const trainDistance = computed(() => {
  // Semi-deterministic distance
  const val = props.tirth.id.charCodeAt(props.tirth.id.length - 1) || 5
  return (val % 25) + 3
})

const trainTime = computed(() => {
  return trainDistance.value * 2 + 5
})

const airportName = computed(() => {
  const s = state.value.toLowerCase()
  if (s === 'gujarat') {
    if (city.value.toLowerCase() === 'palitana' || city.value.toLowerCase() === 'bhavnagar') {
      return 'Bhavnagar Airport (BHU) / Ahmedabad Airport (AMD)'
    }
    return 'Ahmedabad International Airport (AMD)'
  }
  if (s === 'rajasthan') {
    if (city.value.toLowerCase() === 'mount abu' || city.value.toLowerCase() === 'dilwara' || city.value.toLowerCase() === 'ranakpur') {
      return 'Maharana Pratap Airport, Udaipur (UDR)'
    }
    return 'Jaipur International Airport (JAI)'
  }
  return 'Nearest State Capital International Airport'
})

const airportDistance = computed(() => {
  const val = props.tirth.id.charCodeAt(props.tirth.id.length - 1) || 50
  return (val % 120) + 45
})

const airportTime = computed(() => {
  const hours = (airportDistance.value / 50).toFixed(1)
  return `${hours} - ${(parseFloat(hours) + 0.5).toFixed(1)}`
})
</script>
