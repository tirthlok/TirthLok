<template>
  <div class="bg-background min-h-screen font-sans">
    <!-- Hero Section - Revamped based on "Greatest Outdoors" design -->
    <div class="flex flex-1 justify-center md:mx-auto md:px-4 lg:px-8 md:py-6">
      <!-- Make hero full-bleed on mobile (negate container padding), and only apply rounded/shadow at md+ -->
      <div class="max-w-7xl mx-auto relative sm:mx-0 md:rounded-3xl md:overflow-hidden md:shadow-2xl rounded-none h-[60vh] md:h-[65vh] lg:h-[500px] w-full group">
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

    <!-- Tirth Cards Horizontal Scroll -->
    <div v-if="!loading && filteredTirths.length > 0" class="px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-background">
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div class="flex-1">
            <h3 class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main font-serif mb-2">Featured Tirths</h3>
          </div>
          <NuxtLink to="/tirth" class="text-primary font-medium hover:text-primary-hover flex items-center gap-2 text-sm sm:text-base px-5 py-2.5 rounded-full hover:bg-primary/10 transition-all duration-300 border border-primary/20 hover:border-primary/50">
            Explore All <Icon name="ArrowRight" :size="18" />
          </NuxtLink>
        </div>
        
        <div class="overflow-x-auto no-scrollbar -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 scroll-smooth">
          <div class="flex gap-6 w-max snap-x snap-mandatory">
            <div
              v-for="tirth in filteredTirths"
              :key="tirth.id"
              class="flex-shrink-0 snap-start w-[280px] transition-transform hover:-translate-y-2 duration-300 group relative"
            >
              <!-- New badge with animation -->
              <div class="absolute -top-3 -right-3 z-10">
                <span class="inline-block bg-gradient-to-r from-accent to-pink-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/20">✨ New</span>
              </div>
              <BaseCard
                :item="tirth"
                card-type="tirth"
                :show-wishlist="true"
                :show-details="false"
                variant="featured"
                :image-height="'h-72'"
                route-prefix="/tirth"
                :tag-fields="[tirth.sect, tirth.type]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Key Features Section - "Enhance your travel Experiences" style -->
    <section class="px-4 sm:px-6 lg:px-8 py-8 md:py-8 bg-background">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main mb-2 font-serif">Your Spiritual Companion</h2>
          <p class="text-text-muted text-base sm:text-lg">Discover ancient temples, find accommodations, and get answers.</p>
        </div>

         <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <!-- Desktop connecting lines (hidden on mobile) -->
          <div class="hidden md:block absolute top-20 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent transform -translate-x-8"></div>
          
          <!-- Feature 1 -->
          <div class="group rounded-2xl bg-gradient-to-br from-indigo-100/60 to-purple-100/60 p-px hover:p-[1px] transition-all duration-300 hover:from-indigo-200/80 hover:to-purple-200/80">
              
            <div class="p-6 rounded-[14px] bg-white/95 backdrop-blur-sm border border-white/80 transition-all duration-300 hover:-translate-y-1 group-hover:shadow-lg" style="box-shadow: 0 8px 24px rgba(99,102,241,0.08);">            
              <div class="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                <span class="text-2xl group-hover:scale-110 transition-transform duration-300">🏛️</span>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-text-main mb-3">Explore Tirths</h3>
              <p class="text-text-muted leading-relaxed text-sm sm:text-base mb-4">
                Browse a vast directory of Jain Tirths. Filter by sect, type, location, and more to find your next destination.
              </p>
              <button class="text-primary text-sm font-semibold hover:gap-2 transition-all flex items-center gap-1">
                Learn More <Icon name="ArrowRight" :size="14" />
              </button>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="group rounded-2xl bg-gradient-to-br from-blue-100/60 to-cyan-100/60 p-px hover:p-[1px] transition-all duration-300 hover:from-blue-200/80 hover:to-cyan-200/80">
            <div class="p-6 rounded-[14px] bg-white/95 backdrop-blur-sm border border-white/80 transition-all duration-300 hover:-translate-y-1 group-hover:shadow-lg" style="box-shadow: 0 8px 24px rgba(59,130,246,0.08);">

              <div class="w-14 h-14 rounded-xl bg-secondary-light flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors duration-300">
                <span class="text-2xl group-hover:scale-110 transition-transform duration-300">🏨</span>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-text-main mb-3">Find Facilities</h3>
              <p class="text-text-muted leading-relaxed text-sm sm:text-base mb-4">
                Easily locate Bhojanshalas and Dharmashalas. View details, timings, and contact information all in one place.
              </p>
              <button class="text-primary text-sm font-semibold hover:gap-2 transition-all flex items-center gap-1">
                Learn More <Icon name="ArrowRight" :size="14" />
              </button>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="group rounded-2xl bg-gradient-to-br from-rose-100/60 to-pink-100/60 p-px hover:p-[1px] transition-all duration-300 hover:from-rose-200/80 hover:to-pink-200/80">
            <div class="p-6 rounded-[14px] bg-white/95 backdrop-blur-sm border border-white/80 transition-all duration-300 hover:-translate-y-1 group-hover:shadow-lg" style="box-shadow: 0 8px 24px rgba(244,63,94,0.08);">
              
              <div class="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300">
                <span class="text-2xl group-hover:scale-110 transition-transform duration-300">🤖</span>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-text-main mb-3">AI Tirth Assistant</h3>
              <p class="text-text-muted leading-relaxed text-sm sm:text-base mb-4">
                Have questions about history, rituals, or facilities? Our AI assistant has the answers you need.
              </p>
              <button class="text-primary text-sm font-semibold hover:gap-2 transition-all flex items-center gap-1">
                Learn More <Icon name="ArrowRight" :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section - Soothing Style -->
    <section class="py-8 md:py-12 bg-surface-muted">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main mb-3 font-serif">How It Works</h2>
          <p class="text-text-muted text-base sm:text-lg">A simple path to planning your Derasar/Tirth Yatra.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            <div class="h-48 bg-contain bg-center relative" :style="{ backgroundImage: `url(${step1Image})` }">
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
            <div class="h-48 bg-contain bg-center relative" :style="{ backgroundImage: `url(${step2Image})` }">
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
            <div class="h-48 bg-contain bg-center relative" :style="{ backgroundImage: `url(${step3Image})` }">
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
    <section class="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div class="max-w-5xl mx-auto rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group">
        <!-- Background Image with Overlay -->
        <div 
          class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-100"
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

    
    <!-- Empty State -->
    <div v-if="!loading && filteredTirths.length === 0" class="text-center py-8 md:py-12 px-4">
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
import heroImg from '~/assets/images/hero-jain-temple.png'
import ctaImg from '~/assets/images/cta-start-your-journey.png'
// Hero & section images
import step1Image from '~/assets/images/discover.png' // Temple discovery
import step2Image from '~/assets/images/explore.png' // Ancient architecture
import step3Image from '~/assets/images/stay.png' // Accommodation/facility


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


// Data is fetched and stores hydrated on the server via useAsyncData
</script>
