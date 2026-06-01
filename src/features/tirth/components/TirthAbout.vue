<template>
  <div class="space-y-12 sm:space-y-16">
    <!-- INFO SECTION: Narrative Flow -->
    <div class="grid grid-cols-1 gap-12 sm:gap-16">
      
      <!-- 1. Description Section -->
      <section class="relative group">
        <div class="flex items-start gap-4 sm:gap-6 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Icon name="BookOpen" :size="24" />
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Description</h3>
            <div class="h-1 w-20 bg-gradient-to-r from-amber-500 to-transparent rounded-full mb-4"></div>
            <div 
              class="text-gray-700 leading-relaxed text-lg prose prose-amber max-w-none text-justify"
              :class="{ 'italic text-gray-500': isMissing(tirth.description) }"
            >
              {{ tirth.description || 'To Be Updated Soon' }}
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Sacred Identity & Mythology -->
      <section class="relative group">
        <div class="flex items-start gap-4 sm:gap-6 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-indigo-500/50 transition-all duration-500">
            <Icon name="Sparkles" :size="24" />
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Sacred Identity & Mythology</h3>
            <div class="h-1 w-20 bg-gradient-to-r from-indigo-500 to-transparent rounded-full mb-4"></div>
            
            <div class="flex flex-wrap gap-4 mb-6">
              <div class="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-2">
                <span class="text-xs font-bold text-indigo-400 tracking-widest uppercase">Sect</span>
                <span class="text-lg font-bold text-indigo-900">{{ tirth.sect }}</span>
              </div>
            </div>

            <div 
              class="text-gray-700 leading-relaxed text-lg prose prose-indigo max-w-none text-justify"
              :class="{ 'italic text-gray-500': isMissing(tirth.mythology) }"
            >
              {{ tirth.mythology || 'To Be Updated Soon' }}
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Location Details Section -->
      <section class="relative group">
        <div class="flex items-start gap-4 sm:gap-6 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Icon name="MapPin" :size="24" />
          </div>
          <div class="flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <h3 class="text-2xl font-bold text-gray-900">Location</h3>
              <a 
                v-if="tirth.direction" 
                :href="tirth.direction" 
                target="_blank"
                class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all font-bold text-sm"
              >
                <Icon name="Navigation" :size="16" />
                View on Maps
              </a>
            </div>
            <div class="h-1 w-20 bg-gradient-to-r from-emerald-500 to-transparent rounded-full mb-4"></div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div class="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <div class="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Address</div>
                <div class="text-gray-800 font-medium">{{ tirth.location.address || 'To Be Updated Soon' }}</div>
              </div>
              <div class="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                <div class="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">City & State</div>
                <div class="text-gray-800 font-medium">{{ tirth.location.city }}, {{ tirth.location.state }} {{ tirth.location.zipCode || '' }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Architecture Section -->
      <section class="relative group">
        <div class="flex items-start gap-4 sm:gap-6 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Icon name="Landmark" :size="24" />
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Architecture</h3>
            <div class="h-1 w-20 bg-gradient-to-r from-blue-500 to-transparent rounded-full mb-4"></div>
            <div 
              class="text-gray-700 leading-relaxed text-lg prose prose-blue max-w-none text-justify"
              :class="{ 'italic text-gray-500': isMissing(tirth.architecture) }"
            >
              {{ tirth.architecture || 'To Be Updated Soon' }}
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Founding & Renovations Section -->
      <section class="relative group">
        <div class="flex items-start gap-4 sm:gap-6 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Icon name="History" :size="24" />
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Founding & Renovations</h3>
            <div class="h-1 w-20 bg-gradient-to-r from-rose-500 to-transparent rounded-full mb-4"></div>
            <div 
              class="text-gray-700 leading-relaxed text-lg prose prose-rose max-w-none text-justify"
              :class="{ 'italic text-gray-500': isMissing(tirth.foundingDetails) }"
            >
              {{ tirth.foundingDetails || 'To Be Updated Soon' }}
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Main Temples Section -->
      <section class="relative group">
        <div class="flex items-start gap-4 sm:gap-6 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Icon name="Mandir" :size="24" />
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Main Temples</h3>
            <div class="h-1 w-20 bg-gradient-to-r from-violet-500 to-transparent rounded-full mb-4"></div>
            
            <div v-if="tirth.mainTemples && tirth.mainTemples.length > 0 && !isMissing(tirth.mainTemples[0])" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div 
                v-for="(temple, idx) in tirth.mainTemples" 
                :key="idx"
                class="flex items-center gap-3 p-4 bg-violet-50/50 rounded-xl border border-violet-100 hover:border-violet-300 transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold text-sm">
                  {{ idx + 1 }}
                </div>
                <span class="text-gray-800 font-medium">{{ temple }}</span>
              </div>
            </div>
            <div v-else class="italic text-gray-500 text-lg mt-4">
              To Be Updated Soon
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Mul Nayak Section -->
      <section class="relative group">
        <div class="flex items-start gap-4 sm:gap-6 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Icon name="Star" :size="24" />
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Mul Nayak</h3>
            <div class="h-1 w-20 bg-gradient-to-r from-orange-400 to-transparent rounded-full mb-4"></div>
            
            <div v-if="tirth.moolnayak && tirth.moolnayak.length > 0 && !isMissing(tirth.moolnayak[0]?.name)" class="mt-6 space-y-4">
              <div 
                v-for="(idol, idx) in tirth.moolnayak" 
                :key="idx"
                class="relative bg-gradient-to-br from-orange-50 to-white p-6 rounded-3xl border border-orange-100 overflow-hidden shadow-sm"
              >
                <!-- Decorative background icon -->
                <Icon name="Sparkles" :size="120" class="absolute -right-8 -bottom-8 text-orange-200/20 rotate-12" />
                
                <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 class="text-xl font-bold text-orange-900 mb-2 text-center sm:text-left">{{ idol.name }}</h4>
                    <div class="flex flex-wrap gap-4 text-sm font-semibold text-orange-700">
                      <div v-if="idol.height && !isMissing(idol.height)" class="flex items-center gap-1.5 px-3 py-1 bg-orange-100/50 rounded-full">
                        <Icon name="ArrowUp" :size="12" />
                        Height: {{ idol.height }}
                      </div>
                      <div v-if="idol.metal && !isMissing(idol.metal)" class="flex items-center gap-1.5 px-3 py-1 bg-orange-100/50 rounded-full text-center">
                        <Icon name="Info" :size="12" />
                        {{ idol.metal }}
                      </div>
                    </div>
                  </div>
                  <div v-if="idol.year && !isMissing(idol.year.toString())" class="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-orange-200 shadow-sm min-w-[100px]">
                    <span class="text-[10px] uppercase tracking-widest text-orange-400 font-bold">Year</span>
                    <span class="text-2xl font-black text-orange-600">{{ idol.year }}</span>
                  </div>
                </div>
                <p v-if="idol.details && !isMissing(idol.details)" class="mt-4 text-gray-700 leading-relaxed relative">
                  {{ idol.details }}
                </p>
              </div>
            </div>
            <div v-else class="italic text-gray-500 text-lg mt-4">
              To Be Updated Soon
            </div>
          </div>
        </div>
      </section>

      <!-- 8. Rules & Regulations Section -->
      <section class="relative group">
        <div class="flex items-start gap-4 sm:gap-6 mb-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Icon name="Shield" :size="24" />
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Rules & Regulations</h3>
            <div class="h-1 w-20 bg-gradient-to-r from-red-500 to-transparent rounded-full mb-4"></div>
            
            <div v-if="tirth.rules && tirth.rules.length > 0 && !isMissing(tirth.rules[0])" class="mt-6">
              <div class="bg-red-50/30 p-6 rounded-3xl border border-red-100">
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li 
                    v-for="(rule, idx) in tirth.rules" 
                    :key="idx"
                    class="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-red-50 shadow-sm group/rule hover:translate-x-1 transition-transform"
                  >
                    <Icon name="CheckCircle" :size="16" class="text-red-500 mt-1 flex-shrink-0" />
                    <span class="text-gray-700 font-medium">{{ rule }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div v-else class="italic text-gray-500 text-lg mt-4">
              To Be Updated Soon
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- Contact & Timings Section -->
    <div class="pt-12 border-t border-gray-100">
      <div class="bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-teal-50/30 p-8 rounded-[40px] border border-blue-100 shadow-sm relative overflow-hidden">
        <!-- Background decorative elements -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-100/20 blur-[80px] rounded-full -mr-20 -mt-20"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-teal-100/20 blur-[80px] rounded-full -ml-20 -mb-20"></div>

        <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16">
          <!-- 1. Contact Header (Phone & Email at Top) -->
          <div class="lg:col-span-12">
            <div class="flex flex-col sm:flex-row gap-6 sm:gap-12">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
                  <Icon name="Phone" :size="24" />
                </div>
                <div>
                  <div class="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-0.5">Contact Number</div>
                  <a v-if="tirth.contact?.phone" :href="`tel:${tirth.contact.phone}`" class="text-xl sm:text-2xl font-black text-gray-900 hover:text-teal-600 transition-colors">
                    {{ tirth.contact.phone }}
                  </a>
                  <span v-else class="text-xl sm:text-2xl font-black text-gray-400 italic">To Be Updated Soon</span>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Icon name="Mail" :size="24" />
                </div>
                <div>
                  <div class="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-0.5">Email Inquiries</div>
                  <a v-if="tirth.contact?.email" :href="`mailto:${tirth.contact.email}`" class="text-xl sm:text-2xl font-black text-gray-900 hover:text-indigo-600 transition-colors">
                    {{ tirth.contact.email }}
                  </a>
                  <span v-else class="text-xl sm:text-2xl font-black text-gray-400 italic">To Be Updated Soon</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Timings Below -->
          <div class="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-blue-50">
            <div class="group/time hover:translate-y-[-2px] transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2 bg-amber-100 rounded-xl text-amber-600 shadow-sm group-hover/time:bg-amber-600 group-hover/time:text-white transition-colors duration-500">
                  <Icon name="Sun" :size="20" />
                </div>
                <h5 class="text-lg font-black text-gray-900">Darshan Timings</h5>
              </div>
              <div 
                class="text-2xl font-black text-gray-800 tracking-tight"
                :class="{ 'italic text-base text-gray-400 font-bold': isMissing(tirth.darshanTimings) }"
              >
                {{ tirth.darshanTimings || 'To Be Updated Soon' }}
              </div>
            </div>

            <div class="group/time hover:translate-y-[-2px] transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2 bg-blue-100 rounded-xl text-blue-600 shadow-sm group-hover/time:bg-blue-600 group-hover/time:text-white transition-colors duration-500">
                  <Icon name="Flower2" :size="20" />
                </div>
                <h5 class="text-lg font-black text-gray-900">Pooja Schedule</h5>
              </div>
              <div 
                class="text-2xl font-black text-gray-800 tracking-tight"
                :class="{ 'italic text-base text-gray-400 font-bold': isMissing(tirth.poojaTimings) }"
              >
                {{ tirth.poojaTimings || 'To Be Updated Soon' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'

defineProps<{ tirth: Tirth }>()

const isMissing = (val: string | undefined | null) => {
  if (!val) return true
  const lower = val.toLowerCase()
  return lower.includes('to be updated soon') || lower.includes('to be updated') || lower.trim() === ''
}
</script>

<style scoped>
.prose {
  text-rendering: optimizeLegibility;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.group:hover .flex-shrink-0 {
  animation: float 3s ease-in-out infinite;
}

/* Glassmorphism utility */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Custom scroll refinement */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
