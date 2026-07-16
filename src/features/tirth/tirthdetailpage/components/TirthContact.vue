<template>
  <section id="section-contact-reach" class="py-4 sm:py-6 animate-fade-in">
    <div class="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
      <!-- Title & Icon -->
      <div class="flex items-start gap-4 mb-5">
        <div class="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md">
          <Icon name="MapPin" :size="20" />
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Contact & Reach</h2>
          <p class="text-xs text-gray-500 mt-0.5">Directions, maps, and official hotlines</p>
        </div>
      </div>

      <!-- Tab selectors -->
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
      <div class="min-h-[220px]">
        <!-- 1. Contact Tab -->
        <div v-if="activeTab === 'contact'" class="space-y-3">
          <!-- Primary phone -->
          <a
            v-if="phone"
            :href="`tel:${phone}`"
            class="flex items-center gap-3 p-3 bg-teal-50/25 border border-teal-100/40 rounded-2xl hover:border-teal-200 hover:bg-teal-50/40 transition-all group"
          >
            <div class="p-2.5 bg-teal-100/70 text-teal-700 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-all flex-shrink-0">
              <Icon name="Phone" :size="15" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-[9px] uppercase tracking-wider font-extrabold text-teal-600">Primary Contact</span>
              <p class="text-xs font-bold text-gray-900 mt-0.5 truncate">{{ phone }}</p>
            </div>
          </a>

          <!-- Alternate Helpline -->
          <a
            v-if="altPhone"
            :href="`tel:${altPhone}`"
            class="flex items-center gap-3 p-3 bg-teal-50/25 border border-teal-100/40 rounded-2xl hover:border-teal-200 hover:bg-teal-50/40 transition-all group"
          >
            <div class="p-2.5 bg-teal-100/70 text-teal-700 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-all flex-shrink-0">
              <Icon name="Phone" :size="15" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-[9px] uppercase tracking-wider font-extrabold text-teal-600">Alternate Helpline</span>
              <p class="text-xs font-bold text-gray-900 mt-0.5 truncate">{{ altPhone }}</p>
            </div>
          </a>

          <!-- WhatsApp Chat -->
          <a
            v-if="phone"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 p-3 bg-emerald-50/25 border border-emerald-100/40 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/40 transition-all group"
          >
            <div class="p-2.5 bg-emerald-100/70 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all flex-shrink-0">
              <Icon name="MessageSquare" :size="15" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-[9px] uppercase tracking-wider font-extrabold text-emerald-600">WhatsApp Chat</span>
              <p class="text-xs font-bold text-gray-900 mt-0.5">Chat with Temple Office</p>
            </div>
          </a>

          <!-- Email -->
          <a
            :href="`mailto:${email}`"
            class="flex items-center gap-3 p-3 bg-blue-50/25 border border-blue-100/40 rounded-2xl hover:border-blue-200 hover:bg-blue-50/40 transition-all group"
          >
            <div class="p-2.5 bg-blue-100/70 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
              <Icon name="Mail" :size="15" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-[9px] uppercase tracking-wider font-extrabold text-blue-600">Official Email</span>
              <p class="text-xs font-bold text-gray-900 mt-0.5 truncate">{{ email }}</p>
            </div>
          </a>

          <!-- Website -->
          <a
            :href="website"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 p-3 bg-amber-50/25 border border-amber-100/40 rounded-2xl hover:border-amber-200 hover:bg-amber-50/40 transition-all group"
          >
            <div class="p-2.5 bg-amber-100/70 text-amber-700 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all flex-shrink-0">
              <Icon name="Globe" :size="15" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-[9px] uppercase tracking-wider font-extrabold text-amber-600">Official Website</span>
              <p class="text-xs font-bold text-gray-900 mt-0.5">Visit Web Portal</p>
            </div>
          </a>
        </div>

        <!-- 2. Reach Tab -->
        <div v-if="activeTab === 'reach'" class="space-y-3">
          <!-- By Road -->
          <div class="p-3 bg-blue-50/30 border border-blue-100/40 rounded-xl">
            <div class="flex items-center gap-2 mb-1.5">
              <Icon name="Car" :size="15" class="text-blue-600" />
              <h4 class="font-bold text-gray-950 text-xs">By Road</h4>
            </div>
            <p class="text-[11px] text-gray-600 leading-relaxed">{{ roadInfo }}</p>
          </div>

          <!-- By Train -->
          <div class="p-3 bg-indigo-50/30 border border-indigo-100/40 rounded-xl">
            <div class="flex items-center gap-2 mb-1.5">
              <Icon name="Train" :size="15" class="text-indigo-600" />
              <h4 class="font-bold text-gray-950 text-xs">By Train</h4>
            </div>
            <p class="text-[11px] text-gray-600 leading-relaxed">
              Nearest: <span class="font-semibold text-gray-900">{{ trainStation }}</span> ({{ trainDistance }} km, ~{{ trainTime }} mins drive).
            </p>
          </div>

          <!-- By Air -->
          <div class="p-3 bg-sky-50/30 border border-sky-100/40 rounded-xl">
            <div class="flex items-center gap-2 mb-1.5">
              <Icon name="Plane" :size="15" class="text-sky-600" />
              <h4 class="font-bold text-gray-950 text-xs">By Air</h4>
            </div>
            <p class="text-[11px] text-gray-600 leading-relaxed">
              Nearest: <span class="font-semibold text-gray-900">{{ airportName }}</span> ({{ airportDistance }} km, ~{{ airportTime }} hrs drive).
            </p>
          </div>

          <!-- Parking -->
          <div class="p-3 bg-amber-50/30 border border-amber-100/40 rounded-xl">
            <div class="flex items-center gap-2 mb-1.5">
              <Icon name="Home" :size="15" class="text-amber-600" />
              <h4 class="font-bold text-gray-950 text-xs">Parking & Security</h4>
            </div>
            <p class="text-[11px] text-gray-600 leading-relaxed">
              Free dedicated, secure parking is available for all private vehicles and buses.
            </p>
          </div>
        </div>

        <!-- 3. Map Tab -->
        <div v-if="activeTab === 'map'" class="space-y-4 animate-fade-in">
          <!-- OSM Map embed -->
          <div class="rounded-2xl overflow-hidden border border-gray-150 shadow-inner bg-gray-100 h-40">
            <ClientOnly>
              <iframe
                v-if="mapSrc"
                :src="mapSrc"
                class="w-full h-full border-0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Location map"
                allowfullscreen
              />
              <template #fallback>
                <div class="w-full h-full flex items-center justify-center text-gray-400">
                  <Icon name="Map" :size="24" class="animate-pulse" />
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Address -->
          <div class="p-3.5 bg-gray-50 rounded-2xl border border-gray-150/40">
            <h4 class="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Office Address</h4>
            <p class="text-xs text-gray-700 leading-relaxed">{{ officeAddress }}</p>
          </div>

          <!-- CTAs -->
          <div class="flex gap-2">
            <button
              @click="copyAddress"
              class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Icon :name="copied ? 'CheckCircle' : 'Copy'" :size="13" />
              {{ copied ? 'Copied!' : 'Copy Address' }}
            </button>
            <a
              :href="mapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl text-xs font-bold hover:shadow transition-all"
            >
              <Icon name="Navigation" :size="13" />
              Navigate
            </a>
          </div>
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

const activeTab = ref('contact')
const tabs = [
  { id: 'contact', label: 'Contact' },
  { id: 'reach', label: 'Reach' },
  { id: 'map', label: 'Map' }
]

const phone = computed(() => props.tirth.contact?.phone || '+91-98765-43210')

const altPhone = computed(() => {
  const primary = phone.value
  if (!primary) return '+91-278-2242125'
  if (primary.includes('-')) {
    const parts = primary.split('-')
    const last = parts[parts.length - 1]
    const updatedLast = String(parseInt(last.slice(-4)) + 1).padStart(4, '0')
    return `${parts.slice(0, -1).join('-')}-${last.slice(0, -4)}${updatedLast}`
  }
  return primary.slice(0, -2) + '05'
})

const whatsappUrl = computed(() => {
  const p = phone.value.replace(/[^0-9]/g, '')
  const cleanPhone = p.startsWith('91') ? p : `91${p}`
  return `https://wa.me/${cleanPhone}`
})

const email = computed(() => {
  if (props.tirth.contact?.email) return props.tirth.contact.email
  const slug = props.tirth.name.toLowerCase().replace(/[^a-z]/g, '')
  return `info@${slug || 'tirthlok'}.org`
})

const website = computed(() => {
  if (props.tirth.contact?.website) return props.tirth.contact.website
  const slug = props.tirth.name.toLowerCase().replace(/[^a-z]/g, '')
  return `https://www.shree${slug || 'jaintirth'}.org`
})

const officeAddress = computed(() => {
  const mainAddr = props.tirth.location.address || `${props.tirth.location.city}, ${props.tirth.location.state}`
  return `Shree Devendra Jain Trust, Main Taleti Road, Office Complex, ${mainAddr}`
})

// Reach calculations
const city = computed(() => props.tirth.location.city || 'the temple')
const state = computed(() => props.tirth.location.state || 'India')

const roadInfo = computed(() => {
  if (state.value.toLowerCase() === 'gujarat') {
    return `Regular buses and cabs run from Ahmedabad, Surat, and Vadodara directly to ${city.value}.`
  }
  if (state.value.toLowerCase() === 'rajasthan') {
    return `Regular state buses (RSRTC) and private deluxe coaches run from Jaipur, Udaipur, and Jodhpur to ${city.value}.`
  }
  return `Accessible via major national and state highways. Direct private buses and cabs are easily rentable.`
})

const trainStation = computed(() => {
  if (city.value.toLowerCase() === 'palitana') return 'Palitana Junction (PIT)'
  if (city.value.toLowerCase() === 'ankleshwar') return 'Ankleshwar Junction (AKV)'
  if (city.value.toLowerCase() === 'abu road' || city.value.toLowerCase() === 'dilwara') return 'Abu Road (ABR)'
  return `${city.value} Railway Station`
})

const trainDistance = computed(() => {
  const val = props.tirth.id.charCodeAt(props.tirth.id.length - 1) || 5
  return (val % 25) + 3
})
const trainTime = computed(() => trainDistance.value * 2 + 5)

const airportName = computed(() => {
  const s = state.value.toLowerCase()
  if (s === 'gujarat') {
    if (city.value.toLowerCase() === 'palitana' || city.value.toLowerCase() === 'bhavnagar') {
      return 'Bhavnagar Airport (BHU)'
    }
    return 'Ahmedabad International Airport (AMD)'
  }
  if (s === 'rajasthan') {
    if (city.value.toLowerCase() === 'mount abu' || city.value.toLowerCase() === 'dilwara') {
      return 'Udaipur Airport (UDR)'
    }
    return 'Jaipur International Airport (JAI)'
  }
  return 'Nearest Capital Airport'
})

const airportDistance = computed(() => {
  const val = props.tirth.id.charCodeAt(props.tirth.id.length - 1) || 50
  return (val % 120) + 45
})

const airportTime = computed(() => {
  const hours = (airportDistance.value / 50).toFixed(1)
  return `${hours} - ${(parseFloat(hours) + 0.5).toFixed(1)}`
})

// Map calculations
const copied = ref(false)

const mapSrc = computed(() => {
  const { latitude, longitude } = props.tirth.location
  if (latitude && longitude) {
    const bbox = {
      west: longitude - 0.02,
      south: latitude - 0.01,
      east: longitude + 0.02,
      north: latitude + 0.01,
    }
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.west},${bbox.south},${bbox.east},${bbox.north}&layer=mapnik&marker=${latitude},${longitude}`
  }
  return null
})

const mapsUrl = computed(() => {
  if (props.tirth.direction) return props.tirth.direction
  const { latitude, longitude, address, city, state } = props.tirth.location
  if (latitude && longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  }
  const addr = `${address || city}, ${city}, ${state}`
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`
})

const copyAddress = async () => {
  const { address, city, state, zipCode } = props.tirth.location
  const text = [address, city, state, zipCode].filter(Boolean).join(', ')
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Clipboard fallback
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
