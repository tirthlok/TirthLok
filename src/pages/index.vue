<template>
  <div class="bg-background min-h-screen font-sans">
    <!-- Hero Section - Revamped based on "Greatest Outdoors" design -->
    <div class="flex flex-1 justify-center md:mx-auto md:px-4 lg:px-8 md:py-6">
      <!-- Make hero full-bleed on mobile (negate container padding), and only apply rounded/shadow at md+ -->
      <div class="max-w-7xl mx-auto relative sm:mx-0 md:rounded-3xl md:overflow-hidden md:shadow-2xl rounded-none h-[75vh] md:h-[600px] w-full group">
        <!-- Background Image (use explicit backgroundSize: 'auto' for asset) -->
        <div 
          class="absolute inset-0 md:scale-110 transition-transform duration-700 group-hover:scale-105"
          :style="{ backgroundImage: `url(${heroImg})`, backgroundSize: 'auto', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }"
        >
          <!-- Gradient Overlay for text readability -->
          <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
        </div>

        <!-- Content Overlay -->
        <div class="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
          <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 leading-tight font-serif">
            Explore Sacred <br/>
            <span class="text-accent">Jain Tirths</span>
          </h1>
          <p class="text-base sm:text-lg md:text-xl text-white mb-8 font-medium max-w-lg">
            Your comprehensive guide to discovering Jain Derasars across the world.
          </p>
          
          <div>
            <NuxtLink 
              to="/tirth" 
              class="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-xl text-sm sm:text-base"
            >
              <span>Start Your Journey</span>
              <Icon name="ArrowRight" :size="20" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Features Section - "Enhance your travel Experiences" style -->
    <section class="px-4 sm:px-6 lg:px-8 py-16 bg-background">
      <div class="max-w-7xl mx-auto">
        <div class="mb-12">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main mb-2 font-serif">Your Spiritual Companion</h2>
          <p class="text-text-muted text-base sm:text-lg">Discover ancient temples, find accommodations, and get answers.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
              <span class="text-2xl group-hover:scale-110 transition-transform duration-300">🏛️</span>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-text-main mb-3">Explore Tirths</h3>
            <p class="text-text-muted leading-relaxed text-sm sm:text-base">
              Browse a vast directory of Jain Tirths. Filter by sect, type, location, and more to find your next destination.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-secondary-light flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors duration-300">
              <span class="text-2xl group-hover:scale-110 transition-transform duration-300">🏨</span>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-text-main mb-3">Find Facilities</h3>
            <p class="text-text-muted leading-relaxed text-sm sm:text-base">
              Easily locate Bhojanshalas and Dharmashalas. View details, timings, and contact information all in one place.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300">
              <span class="text-2xl group-hover:scale-110 transition-transform duration-300">🤖</span>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-text-main mb-3">AI Tirth Assistant</h3>
            <p class="text-text-muted leading-relaxed text-sm sm:text-base">
              Have questions about history, rituals, or facilities? Our AI assistant has the answers you need.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section - Soothing Style -->
    <section class="py-16 bg-surface-muted">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main mb-3 font-serif">How It Works</h2>
          <p class="text-text-muted text-base sm:text-lg">A simple path to planning your Derasar/Tirth Yatra.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            <div class="h-48 bg-cover bg-center relative" :style="{ backgroundImage: `url(${step1Image})` }">
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
                <h4 class="font-bold text-base sm:text-lg text-text-main">Discover & Filter</h4>
              </div>
              <p class="text-text-muted text-sm leading-relaxed">Start by browsing our list of Derasars/Tirth's. Use the powerful search and filter tools.</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            <div class="h-48 bg-cover bg-center relative" :style="{ backgroundImage: `url(${step2Image})` }">
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm">2</div>
                <h4 class="font-bold text-base sm:text-lg text-text-main">Explore Details</h4>
              </div>
              <p class="text-text-muted text-sm leading-relaxed">Dive deep into a Derasar's/Tirth's page. Learn about its history, architecture, and timings.</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            <div class="h-48 bg-cover bg-center relative" :style="{ backgroundImage: `url(${step3Image})` }">
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">3</div>
                <h4 class="font-bold text-base sm:text-lg text-text-main">Plan Your Stay</h4>
              </div>
              <p class="text-text-muted text-sm leading-relaxed">Find all the details you need for your visit, including accommodation options and meal facilities.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section - Soothing Gradient -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div class="max-w-5xl mx-auto rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group">
        <!-- Background Image with Overlay -->
        <div 
          class="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-700 group-hover:scale-100"
          :style="{ backgroundImage: `url(${ctaImg})` }"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
        </div>
        
        <h3 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white relative z-10 font-serif mb-">Begin Your Spiritual Journey Today</h3>
        <p class="text-gray-100 mb-8 text-base sm:text-lg relative z-10 max-w-2xl mx-auto">Let us guide you to the sacred Derasar's/Tirth's that call to your heart.</p>
        
        <NuxtLink to="/tirth" class="inline-block bg-white text-primary px-8 py-3 sm:px-10 sm:py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all relative z-10 text-base sm:text-lg">
          Explore All Tirths
        </NuxtLink>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 p-4 sm:p-6 mx-4 sm:mx-6 lg:mx-8 bg-red-50 border-l-4 border-error rounded-lg">
      <p class="text-error text-sm md:text-base font-semibold">Error loading temples</p>
      <p class="text-error/80 text-xs md:text-sm mt-1">{{ error }}</p>
    </div>

    <!-- Tirth Cards Horizontal Scroll -->
    <div v-if="!loading && filteredTirths.length > 0" class="px-4 sm:px-6 lg:px-8 pb-12 bg-background">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl sm:text-2xl font-bold text-text-main font-serif">Featured Tirths</h3>
          <NuxtLink to="/tirth" class="text-primary font-medium hover:text-primary-hover flex items-center gap-1 text-sm sm:text-base">
            View All <Icon name="ArrowRight" :size="16" />
          </NuxtLink>
        </div>
        
        <div class="overflow-x-auto no-scrollbar -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex gap-6 w-max snap-x snap-mandatory">
            <div
              v-for="tirth in filteredTirths"
              :key="tirth.id"
              class="flex-shrink-0 snap-start w-[280px] transition-transform hover:-translate-y-2 duration-300"
            >
              <BaseCard
                :item="tirth"
                card-type="tirth"
                :show-wishlist="true"
                :show-details="true"
                route-prefix="/tirth"
                :tag-fields="[tirth.sect, tirth.type]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredTirths.length === 0" class="text-center py-12 md:py-16 px-4">
      <Icon name="MapPin" :size="48" class="text-text-muted mx-auto mb-4" />
      <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-text-main mb-2">No Temples Found</h3>
      <p class="text-text-muted text-sm md:text-base mb-6">Try adjusting your search or filter criteria</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTirthStore } from '~/stores/tirth'
import type { Tirth } from '~/types/models'
import { BaseCard } from '~/components/shared'
import Icon from '~/components/common/Icon.vue'

// Import images from assets
import heroImg from '~/assets/images/Jain _Temple_Landing_Page.png'
import ctaImg from '~/assets/images/start_your_journey.png'

definePageMeta({
  layout: 'default',
})

const tithStore = useTirthStore()

// Server-side fetch and hydrate tirth store
const { data: serverTirths } = await useAsyncData<Tirth[]>('tirths', () => $fetch('/api/tirth'))
if (serverTirths?.value) {
  tithStore.$patch((state) => {
    state.tirths = serverTirths.value as Tirth[]
    state.filteredTirths = serverTirths.value as Tirth[]
  })
}

const loading = computed(() => tithStore.loading)
const error = computed(() => tithStore.error)
const filteredTirths = computed(() => tithStore.filteredTirths)

// Hero & section images
const step1Image = 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop' // Temple discovery
const step2Image = 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop' // Ancient architecture
const step3Image = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' // Accommodation/facility

// Data is fetched and stores hydrated on the server via useAsyncData
</script>
