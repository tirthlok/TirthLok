<template>
  <section id="section-important-info" class="py-4 sm:py-6">
    <!-- Section Header -->
    <div class="flex items-start gap-4 mb-6 sm:mb-8">
      <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-md">
        <Icon name="Shield" :size="22" />
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Important Information</h2>
        <p class="text-sm text-gray-500 mt-0.5">Guidelines and visitor policies</p>
        <div class="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-transparent rounded-full mt-1" />
      </div>
    </div>

    <!-- Info Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <!-- 1. Dress Code -->
      <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-rose-50 rounded-xl text-rose-500">
              <Icon name="Info" :size="18" />
            </div>
            <h4 class="font-bold text-gray-900 text-sm sm:text-base">Dress Code</h4>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {{ dressCodeText }}
          </p>
        </div>
        <div class="mt-4 border-t border-gray-50 pt-3">
          <span class="text-[10px] uppercase tracking-wider font-extrabold text-rose-500">Strictly Enforced</span>
        </div>
      </div>

      <!-- 2. Mobile Policy -->
      <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-amber-50 rounded-xl text-amber-500">
              <Icon name="Smartphone" :size="18" />
            </div>
            <h4 class="font-bold text-gray-900 text-sm sm:text-base">Mobile Policy</h4>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Mobiles must be switched off or put on silent mode inside the temple complex. Audio/video recordings of inner sanctuary rituals are strictly prohibited.
          </p>
        </div>
        <div class="mt-4 border-t border-gray-50 pt-3">
          <span class="text-[10px] uppercase tracking-wider font-extrabold text-amber-500">Silent Mode</span>
        </div>
      </div>

      <!-- 3. Photography Rules -->
      <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-blue-50 rounded-xl text-blue-500">
              <Icon name="Camera" :size="18" />
            </div>
            <h4 class="font-bold text-gray-900 text-sm sm:text-base">Photography</h4>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Photography is allowed in the outer courtyard and gardens for non-commercial purposes. Strictly no photography of the main idols (Moolnayak) or inside the Garbhagriha.
          </p>
        </div>
        <div class="mt-4 border-t border-gray-50 pt-3">
          <span class="text-[10px] uppercase tracking-wider font-extrabold text-blue-500">Restricted Zones</span>
        </div>
      </div>

      <!-- 4. Entry Rules -->
      <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-indigo-50 rounded-xl text-indigo-500">
              <Icon name="ShieldCheck" :size="18" />
            </div>
            <h4 class="font-bold text-gray-900 text-sm sm:text-base">Entry Rules</h4>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Entry is free for all visitors. Wash hands and feet before entering the temple platform. Leather items (wallets, belts, bags) are not allowed inside the main shrine.
          </p>
        </div>
        <div class="mt-4 border-t border-gray-50 pt-3">
          <span class="text-[10px] uppercase tracking-wider font-extrabold text-indigo-500">Free Entry</span>
        </div>
      </div>

      <!-- 5. Donations -->
      <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-emerald-50 rounded-xl text-emerald-500">
              <Icon name="Coins" :size="18" />
            </div>
            <h4 class="font-bold text-gray-900 text-sm sm:text-base">Donations</h4>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Voluntary donations for temple maintenance, Dharamshala, and Gaushala can be made at the main office. Official receipts are issued. Digital payments accepted.
          </p>
        </div>
        <div class="mt-4 border-t border-gray-50 pt-3">
          <span class="text-[10px] uppercase tracking-wider font-extrabold text-emerald-500">Receipt Provided</span>
        </div>
      </div>

      <!-- 6. Prasad Information -->
      <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-purple-50 rounded-xl text-purple-500">
              <Icon name="Gift" :size="18" />
            </div>
            <h4 class="font-bold text-gray-900 text-sm sm:text-base">Prasad & Offerings</h4>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Pure vegetarian Jain meals are served as Prasad at the nearby Bhojanshala during designated lunch and dinner hours. No food items allowed inside the temple.
          </p>
        </div>
        <div class="mt-4 border-t border-gray-50 pt-3">
          <span class="text-[10px] uppercase tracking-wider font-extrabold text-purple-500">Bhojanshala Meals</span>
        </div>
      </div>

      <!-- 7. Best Time to Visit -->
      <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-teal-50 rounded-xl text-teal-500">
              <Icon name="Calendar" :size="18" />
            </div>
            <h4 class="font-bold text-gray-900 text-sm sm:text-base">Best Time to Visit</h4>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            October to March offers pleasant weather ideal for travel. Visiting during early mornings or late evenings provides a peaceful darshan environment.
          </p>
        </div>
        <div class="mt-4 border-t border-gray-50 pt-3">
          <span class="text-[10px] uppercase tracking-wider font-extrabold text-teal-500">Winter Season</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tirth } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()

const dressCodeText = computed(() => {
  if (props.tirth.sect === 'Digambar') {
    return 'Strictly traditional, decent attire is required. Men should wear dhoti-dupatta or simple kurta-pyjama. Women should wear sarees or salwar-suits. Avoid western clothing like shorts, skirts, or sleeveless tops.'
  }
  return 'Respectful and modest clothing is required. Dress code strictly mandates avoiding short dresses, sleeveless tops, or beachwear. White or light-colored traditional clothing is highly recommended for darshan.'
})
</script>
