<template>
  <div class="bg-white min-h-screen">
    <!-- Hero Section - Enhanced with gradient overlay -->
    <section
      class="relative bg-cover bg-center text-white overflow-hidden"
      :style="{ backgroundImage: `url(${heroImage})` }"
    >
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      <div class="relative px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight">
          Explore Sacred Jain <span class="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent animate-shimmer">Tirths</span>
        </h1>
        <p class="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto px-2 font-light mb-8">
          Your comprehensive guide to discovering Jain Derasars across the world.
        </p>
        <NuxtLink to="/tirth" class="inline-block bg-gradient-to-r from-yellow-300 to-yellow-400 text-black px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg">
          ✨ Start Your Journey
        </NuxtLink>
      </div>
    </section>

    <!-- Key Features Section - Enhanced -->
    <section class="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-4xl mx-auto text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">Your Spiritual Companion</h2>
        <p class="text-gray-600 mt-3 text-lg">Discover ancient temples, find accommodations, and get answers to all your questions with our powerful tools.</p>
      </div>

      <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div class="p-8 bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 border-2 border-red-100 hover:border-red-300 text-center group">
          <div class="text-4xl mb-4 group-hover:scale-125 transition-transform">🏛️</div>
          <h3 class="font-bold text-lg mb-3 text-gray-900">Explore Tirths</h3>
          <p class="text-gray-600 text-sm leading-relaxed">Browse a vast directory of Jain Tirths. Filter by sect, type, location, and more to find your next destination.</p>
        </div>

        <div class="p-8 bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 border-2 border-red-100 hover:border-red-300 text-center group">
          <div class="text-4xl mb-4 group-hover:scale-125 transition-transform">🏨</div>
          <h3 class="font-bold text-lg mb-3 text-gray-900">Find Facilities</h3>
          <p class="text-gray-600 text-sm leading-relaxed">Easily locate Bhojanshalas and Dharmashalas. View details, timings, and contact information all in one place.</p>
        </div>

        <div class="p-8 bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 border-2 border-red-100 hover:border-red-300 text-center group">
          <div class="text-4xl mb-4 group-hover:scale-125 transition-transform">🤖</div>
          <h3 class="font-bold text-lg mb-3 text-gray-900">AI Tirth Assistant</h3>
          <p class="text-gray-600 text-sm leading-relaxed">Have questions about history, rituals, or facilities? Our AI assistant has the answers you need.</p>
        </div>
      </div>
    </section>

    <!-- How It Works Section - Enhanced -->
    <section class="bg-gradient-to-r from-red-50 via-white to-red-50 py-16">
      <div class="max-w-4xl mx-auto text-center mb-12 px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">How It Works</h2>
        <p class="text-gray-600 mt-3 text-lg">A simple path to planning your Derasar/Tirth Yatra.</p>
      </div>

      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all hover:scale-105 border-2 border-red-100 hover:border-red-300 group">
          <div class="h-44 bg-cover bg-center overflow-hidden relative" :style="{ backgroundImage: `url(${step1Image})` }">
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
          </div>
          <div class="p-6">
            <h4 class="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2"><span>🔍</span> Discover & Filter</h4>
            <p class="text-gray-600 text-sm leading-relaxed">Start by browsing our list of Derasars/Tirth's. Use the powerful search and filter tools to narrow down your options based on what's important to you.</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all hover:scale-105 border-2 border-red-100 hover:border-red-300 group">
          <div class="h-44 bg-cover bg-center overflow-hidden relative" :style="{ backgroundImage: `url(${step2Image})` }">
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
          </div>
          <div class="p-6">
            <h4 class="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2"><span>📖</span> Explore Details</h4>
            <p class="text-gray-600 text-sm leading-relaxed">Dive deep into a Derasar's/Tirth's page. Learn about its history, architecture, timings, and available facilities like Bhojanshala's, Dharmashala's & Gaushala's etc.</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all hover:scale-105 border-2 border-red-100 hover:border-red-300 group">
          <div class="h-44 bg-cover bg-center overflow-hidden relative" :style="{ backgroundImage: `url(${step3Image})` }">
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
          </div>
          <div class="p-6">
            <h4 class="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2"><span>🏠</span> Plan Your Stay</h4>
            <p class="text-gray-600 text-sm leading-relaxed">Once you've chosen a Derasar's/Tirth's, find all the details you need for your visit, including accommodation options and meal facilities to make your journey comfortable.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section - Enhanced -->
    <section class="py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto bg-gradient-to-r from-red-500 via-red-600 to-red-500 rounded-3xl p-12 text-center shadow-2xl border-4 border-red-400 hover:shadow-3xl transition-all hover:scale-105 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 animate-shimmer"></div>
        <h3 class="text-3xl md:text-4xl font-bold text-white relative z-10">✨ Begin Your Spiritual Journey Today</h3>
        <p class="text-red-100 mt-4 mb-8 text-lg relative z-10 font-light">Let us guide you to the sacred Derasar's/Tirth's that call to your heart.</p>
        <NuxtLink to="/tirth" class="inline-block bg-white text-red-600 px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all relative z-10 text-lg">🚀 Explore All Tirths</NuxtLink>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-gray-900"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="mb-6 p-4 sm:p-6 mx-4 sm:mx-6 lg:mx-8 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p class="text-red-700 text-sm md:text-base font-semibold">Error loading temples</p>
      <p class="text-red-600 text-xs md:text-sm mt-1">{{ error }}</p>
    </div>

    <!-- Tirth Cards Horizontal Scroll -->
    <div v-if="!loading && filteredTirths.length > 0" class="px-4 sm:px-6 lg:px-8 pb-12">
      <div class="overflow-x-auto no-scrollbar -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div class="flex gap-4 sm:gap-5 md:gap-6 w-max snap-x snap-mandatory">
          <div
            v-for="tirth in filteredTirths"
            :key="tirth.id"
            class="flex-shrink-0 snap-start w-[150px] sm:w-[150px] md:w-[160px] lg:w-[180px]"
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

    <!-- Empty State -->
    <div v-if="!loading && filteredTirths.length === 0" class="text-center py-12 md:py-16 px-4">
      <Icon name="MapPin" :size="48" class="text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">No Temples Found</h3>
      <p class="text-gray-600 text-sm md:text-base mb-6">Try adjusting your search or filter criteria</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTirthStore } from '~/stores/tirth'
import { BaseCard } from '~/components/shared'

definePageMeta({
  layout: 'default',
})

const tithStore = useTirthStore()

const loading = computed(() => tithStore.loading)
const error = computed(() => tithStore.error)
const filteredTirths = computed(() => tithStore.filteredTirths)

// Hero & section images (using placeholder images - replace with actual images in /public/images/)
const heroImage = 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=1200&h=600&fit=crop' // Jain temple
const step1Image = 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop' // Temple discovery
const step2Image = 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop' // Ancient architecture
const step3Image = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop' // Accommodation/facility

// Fetch data on mount
onMounted(async () => {
  if (tithStore.tirths.length === 0) {
    await tithStore.fetchTirths()
  } else if (tithStore.filteredTirths.length === 0) {
    // If seeded tirths exist but filtered list is empty, populate it so cards render
    tithStore.filteredTirths = [...tithStore.tirths]
  }
})
</script>
