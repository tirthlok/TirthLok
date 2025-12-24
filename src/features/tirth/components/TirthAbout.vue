<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Quick Info Cards Section -->
    <div v-if="hasContactInfo" class="max-w-md">
      <!-- Contact Card -->
      <div class="bg-gradient-to-br from-teal-50 to-cyan-50 p-5 rounded-xl border-2 border-teal-200 hover:border-teal-300 hover:shadow-lg transition-all">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 bg-teal-100 rounded-lg">
            <Icon name="Phone" :size="20" class="text-teal-600" />
          </div>
          <h4 class="font-bold text-gray-900">Contact</h4>
        </div>
        <div class="space-y-2 text-sm">
          <div v-if="tirth.contact?.phone">
            <a 
              :href="`tel:${tirth.contact.phone}`"
              class="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors group"
            >
              <Icon name="Phone" :size="14" class="text-teal-500 group-hover:text-teal-600" />
              <span class="font-medium">{{ tirth.contact.phone }}</span>
            </a>
          </div>
          <div v-if="tirth.contact?.email">
            <a 
              :href="`mailto:${tirth.contact.email}`"
              class="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors group"
            >
              <Icon name="Mail" :size="14" class="text-teal-500 group-hover:text-teal-600" />
              <span class="font-medium break-all">{{ tirth.contact.email }}</span>
            </a>
          </div>
          <div v-if="tirth.contact?.website">
            <a 
              :href="tirth.contact.website"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors group"
            >
              <Icon name="Globe" :size="14" class="text-teal-500 group-hover:text-teal-600" />
              <span class="font-medium break-all">Visit Website</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Description Section -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-2xl border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div class="flex items-start gap-3 sm:gap-4">
        <Icon name="BookOpen" :size="24" class="sm:w-7 sm:h-7 text-blue-600 flex-shrink-0 mt-1" />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Description</h3>
          <p class="text-gray-700 leading-relaxed text-base sm:text-lg">{{ tirth.description }}</p>
        </div>
      </div>
    </div>

    <!-- Historical Background -->
    <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-4 sm:p-6 rounded-2xl border-l-4 border-amber-600 hover:shadow-lg transition-shadow">
      <div class="flex items-start gap-3 sm:gap-4">
        <Icon name="History" :size="24" class="sm:w-7 sm:h-7 text-amber-600 flex-shrink-0 mt-1" />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Historical Background</h3>
          <p class="text-gray-700 leading-relaxed text-base sm:text-lg">{{ tirth.historicalBackground }}</p>
        </div>
      </div>
    </div>

    <!-- Founding Details -->
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-2xl border-l-4 border-purple-600 hover:shadow-lg transition-shadow">
      <div class="flex items-start gap-3 sm:gap-4">
        <Icon name="Landmark" :size="24" class="sm:w-7 sm:h-7 text-purple-600 flex-shrink-0 mt-1" />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Founding Details</h3>
          <p class="text-gray-700 leading-relaxed text-base sm:text-lg">{{ tirth.foundingDetails }}</p>
        </div>
      </div>
    </div>

    <!-- Architecture Section -->
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-2xl border-l-4 border-green-600 hover:shadow-lg transition-shadow">
      <div class="flex items-start gap-3 sm:gap-4">
        <Icon name="Building" :size="24" class="sm:w-7 sm:h-7 text-green-600 flex-shrink-0 mt-1" />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Architecture</h3>
          <p class="text-gray-700 leading-relaxed text-base sm:text-lg">{{ tirth.architecture }}</p>
        </div>
      </div>
    </div>

    <!-- Timings & Schedule Section -->
    <div v-if="tirth.poojaTimings || tirth.darshanTimings">
      <div class="flex items-center gap-3 mb-4 sm:mb-6">
        <Icon name="Clock" :size="24" class="sm:w-7 sm:h-7 text-indigo-600" />
        <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Timings & Schedule</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-if="tirth.poojaTimings" class="bg-gradient-to-br from-sky-50 to-blue-50 p-5 sm:p-6 rounded-xl border-2 border-sky-200 hover:border-sky-300 hover:shadow-lg transition-all group">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-sky-500 rounded-lg group-hover:scale-110 transition-transform">
              <Icon name="Clock" :size="20" class="text-white" />
            </div>
            <h4 class="text-lg font-bold text-gray-900">Pooja Timings</h4>
          </div>
          <p class="text-gray-700 text-base sm:text-lg font-medium ml-11">{{ tirth.poojaTimings }}</p>
        </div>

        <div v-if="tirth.darshanTimings" class="bg-gradient-to-br from-orange-50 to-amber-50 p-5 sm:p-6 rounded-xl border-2 border-orange-200 hover:border-orange-300 hover:shadow-lg transition-all group">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-orange-500 rounded-lg group-hover:scale-110 transition-transform">
              <Icon name="Sun" :size="20" class="text-white" />
            </div>
            <h4 class="text-lg font-bold text-gray-900">Darshan Timings</h4>
          </div>
          <p class="text-gray-700 text-base sm:text-lg font-medium ml-11">{{ tirth.darshanTimings }}</p>
        </div>
      </div>
    </div>

    <!-- Contact Information Section -->
    <div v-if="hasContactInfo">
      <div class="flex items-center gap-3 mb-4 sm:mb-6">
        <Icon name="Phone" :size="24" class="sm:w-7 sm:h-7 text-teal-600" />
        <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Contact Information</h3>
      </div>
      
      <div class="bg-gradient-to-r from-teal-50 to-cyan-50 p-5 sm:p-6 rounded-2xl border-2 border-teal-200">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-if="tirth.contact?.phone" class="flex items-start gap-3 group">
            <div class="p-2 bg-teal-500 rounded-lg flex-shrink-0">
              <Icon name="Phone" :size="18" class="text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-gray-600 uppercase tracking-wide mb-1">Phone</p>
              <a 
                :href="`tel:${tirth.contact.phone}`"
                class="text-gray-900 font-semibold hover:text-teal-600 transition-colors text-sm sm:text-base"
              >
                {{ tirth.contact.phone }}
              </a>
            </div>
          </div>

          <div v-if="tirth.contact?.email" class="flex items-start gap-3 group">
            <div class="p-2 bg-teal-500 rounded-lg flex-shrink-0">
              <Icon name="Mail" :size="18" class="text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-gray-600 uppercase tracking-wide mb-1">Email</p>
              <a 
                :href="`mailto:${tirth.contact.email}`"
                class="text-gray-900 font-semibold hover:text-teal-600 transition-colors break-all text-sm sm:text-base"
              >
                {{ tirth.contact.email }}
              </a>
            </div>
          </div>

          <div v-if="tirth.contact?.website" class="flex items-start gap-3 group">
            <div class="p-2 bg-teal-500 rounded-lg flex-shrink-0">
              <Icon name="Globe" :size="18" class="text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-gray-600 uppercase tracking-wide mb-1">Website</p>
              <a 
                :href="tirth.contact.website"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-900 font-semibold hover:text-teal-600 transition-colors break-all text-sm sm:text-base inline-flex items-center gap-1"
              >
                Visit Website
                <Icon name="ExternalLink" :size="14" class="text-teal-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mool Nayak (Idols) Section -->
    <div v-if="tirth.moolnayak && tirth.moolnayak.length > 0">
      <div class="flex items-center gap-3 mb-4 sm:mb-6">
        <Icon name="Gem" :size="24" class="sm:w-7 sm:h-7 text-yellow-600" />
        <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Mool Nayak (Main Idols)</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="idol in tirth.moolnayak" 
          :key="idol.name"
          class="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 sm:p-5 rounded-xl border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all transform hover:scale-105 group"
        >
          <div class="flex items-start gap-3 mb-3 sm:mb-4">
            <Icon name="Crown" :size="20" class="sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0 group-hover:animate-bounce" />
            <h4 class="font-bold text-base sm:text-lg text-gray-900">{{ idol.name }}</h4>
          </div>
          
          <div class="space-y-2 ml-8 sm:ml-9 text-sm">
            <div v-if="idol.height" class="flex items-center gap-2 text-gray-700">
              <div class="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
              <span><strong>Height:</strong> {{ idol.height }}</span>
            </div>
            <div v-if="idol.metal" class="flex items-center gap-2 text-gray-700">
              <div class="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
              <span><strong>Metal:</strong> {{ idol.metal }}</span>
            </div>
            <div v-if="idol.year" class="flex items-center gap-2 text-gray-700">
              <div class="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
              <span><strong>Year:</strong> {{ idol.year }}</span>
            </div>
            <div v-if="idol.details" class="pt-2 mt-3 border-t border-yellow-200">
              <p class="text-gray-600 leading-relaxed italic">{{ idol.details }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Special Facts Section -->
    <div v-if="tirth.specialFacts && tirth.specialFacts.length > 0">
      <div class="flex items-center gap-3 mb-4 sm:mb-6">
        <Icon name="Sparkles" :size="24" class="sm:w-7 sm:h-7 text-indigo-600" />
        <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Special Facts</h3>
      </div>
      
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-2xl border-2 border-indigo-200">
        <div class="space-y-3 sm:space-y-4">
          <div v-for="(fact, index) in tirth.specialFacts" :key="index" class="flex items-start gap-3 sm:gap-4 group">
            <div class="flex-shrink-0 p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg group-hover:shadow-lg transition-all transform group-hover:scale-110">
              <Icon name="CheckCircle2" :size="18" class="sm:w-5 sm:h-5 text-white" />
            </div>
            <p class="text-gray-700 leading-relaxed text-base sm:text-lg pt-1">{{ fact }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Rules & Regulations Section -->
    <div v-if="tirth.rules && tirth.rules.length > 0">
      <div class="flex items-center gap-3 mb-4 sm:mb-6">
        <Icon name="Shield" :size="24" class="sm:w-7 sm:h-7 text-red-600" />
        <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Rules & Regulations</h3>
      </div>
      
      <div class="bg-gradient-to-r from-red-50 to-rose-50 p-4 sm:p-6 rounded-2xl border-2 border-red-200">
        <ul class="space-y-2 sm:space-y-3">
          <li v-for="(rule, idx) in tirth.rules" :key="idx" class="flex items-start gap-3 sm:gap-4 group">
            <div class="w-2 h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mt-2 flex-shrink-0" />
            <span class="text-gray-700 leading-relaxed text-base sm:text-lg group-hover:text-gray-900 transition-colors">{{ rule }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'
import { computed } from 'vue'

const props = defineProps<{
  tirth: Tirth
}>()

// Computed property to check if any contact information exists
const hasContactInfo = computed(() => {
  return props.tirth.contact?.phone || 
         props.tirth.contact?.email || 
         props.tirth.contact?.website
})
</script>
