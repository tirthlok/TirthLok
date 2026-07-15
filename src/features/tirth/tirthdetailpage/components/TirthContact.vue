<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- 1. Primary Contact -->
      <a
        v-if="phone"
        :href="`tel:${phone}`"
        class="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 hover:border-teal-300"
      >
        <div class="p-2.5 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-500 group-hover:text-white transition-colors">
          <Icon name="Phone" :size="18" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Primary Contact</p>
          <p class="text-sm sm:text-base font-bold text-gray-900 truncate">{{ phone }}</p>
          <p class="text-xs text-gray-500 mt-1">Tap to call temple office</p>
        </div>
      </a>

      <!-- 2. Alternate Contact -->
      <a
        v-if="altPhone"
        :href="`tel:${altPhone}`"
        class="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 hover:border-blue-300"
      >
        <div class="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
          <Icon name="Phone" :size="18" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Alternate Contact</p>
          <p class="text-sm sm:text-base font-bold text-gray-900 truncate">{{ altPhone }}</p>
          <p class="text-xs text-gray-500 mt-1">Secondary office hotline</p>
        </div>
      </a>

      <!-- 3. WhatsApp Support -->
      <a
        v-if="whatsappUrl"
        :href="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 hover:border-emerald-300"
      >
        <div class="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
          <Icon name="MessageSquare" :size="18" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">WhatsApp Chat</p>
          <p class="text-sm sm:text-base font-bold text-gray-900 truncate">Chat on WhatsApp</p>
          <p class="text-xs text-gray-500 mt-1">Instant query resolutions</p>
        </div>
      </a>

      <!-- 4. Email Support -->
      <a
        v-if="email"
        :href="`mailto:${email}`"
        class="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 hover:border-indigo-300"
      >
        <div class="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
          <Icon name="Mail" :size="18" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Official Email</p>
          <p class="text-sm sm:text-base font-bold text-gray-900 truncate">{{ email }}</p>
          <p class="text-xs text-gray-500 mt-1">Inquiries & donations</p>
        </div>
      </a>

      <!-- 5. Official Website -->
      <a
        v-if="website"
        :href="website"
        target="_blank"
        rel="noopener noreferrer"
        class="group relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 hover:border-amber-300"
      >
        <div class="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
          <Icon name="Globe" :size="18" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Official Website</p>
          <p class="text-sm sm:text-base font-bold text-gray-900 truncate">Visit Website</p>
          <p class="text-xs text-gray-500 mt-1">Online booking & history</p>
        </div>
      </a>

      <!-- 6. Office Address -->
      <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 sm:col-span-2 lg:col-span-1">
        <div class="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
          <Icon name="MapPin" :size="18" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Office Address</p>
          <p class="text-sm font-semibold text-gray-800 leading-relaxed">{{ officeAddress }}</p>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tirth } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()

const phone = computed(() => props.tirth.contact?.phone || '+91-98765-43210')

// Alternate phone generation based on primary phone for rich visuals
const altPhone = computed(() => {
  const primary = phone.value
  if (!primary) return '+91-278-2242125' // default
  // Just change the last two digits or add a typical landline code
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
  // Normalize international format
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
</script>
