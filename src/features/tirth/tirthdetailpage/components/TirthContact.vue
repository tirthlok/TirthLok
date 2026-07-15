<template>
  <section v-if="hasContact" id="section-contact" class="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- Section header -->
    <div class="flex items-center gap-3 mb-6 sm:mb-8">
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
        <Icon name="Phone" :size="20" />
      </div>
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Contact</h2>
        <p class="text-sm text-gray-500">Reach out directly</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 sm:gap-4">
      <!-- Call button -->
      <a
        v-if="tirth.contact?.phone"
        :href="`tel:${tirth.contact.phone}`"
        class="flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-teal-100 text-teal-700 rounded-2xl font-bold text-sm hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all duration-300 shadow-sm hover:shadow-md group"
        :aria-label="`Call ${tirth.name}`"
      >
        <div class="w-8 h-8 rounded-xl bg-teal-50 group-hover:bg-teal-500/20 flex items-center justify-center transition-colors">
          <Icon name="Phone" :size="16" />
        </div>
        <div>
          <p class="text-[10px] uppercase tracking-widest opacity-60 mb-0.5">Call Us</p>
          <p>{{ tirth.contact.phone }}</p>
        </div>
      </a>

      <!-- Email button -->
      <a
        v-if="tirth.contact?.email"
        :href="`mailto:${tirth.contact.email}`"
        class="flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-indigo-100 text-indigo-700 rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 shadow-sm hover:shadow-md group"
        :aria-label="`Email ${tirth.name}`"
      >
        <div class="w-8 h-8 rounded-xl bg-indigo-50 group-hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
          <Icon name="Mail" :size="16" />
        </div>
        <div>
          <p class="text-[10px] uppercase tracking-widest opacity-60 mb-0.5">Email</p>
          <p class="truncate max-w-[200px]">{{ tirth.contact.email }}</p>
        </div>
      </a>

      <!-- Website button -->
      <a
        v-if="tirth.contact?.website"
        :href="tirth.contact.website"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-3 px-5 py-3.5 bg-white border-2 border-amber-100 text-amber-700 rounded-2xl font-bold text-sm hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300 shadow-sm hover:shadow-md group"
        :aria-label="`Visit ${tirth.name} website`"
      >
        <div class="w-8 h-8 rounded-xl bg-amber-50 group-hover:bg-amber-500/20 flex items-center justify-center transition-colors">
          <Icon name="Globe" :size="16" />
        </div>
        <div>
          <p class="text-[10px] uppercase tracking-widest opacity-60 mb-0.5">Website</p>
          <p>Visit Website</p>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tirth } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'

const props = defineProps<{ tirth: Tirth }>()

const hasContact = computed(() =>
  !!(props.tirth.contact?.phone || props.tirth.contact?.email || props.tirth.contact?.website)
)
</script>
