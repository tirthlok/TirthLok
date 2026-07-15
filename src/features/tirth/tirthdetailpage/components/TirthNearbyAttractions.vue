<template>
  <section id="section-attractions" class="py-4 sm:py-6">
    <!-- Section Header -->
    <div class="flex items-start gap-4 mb-6 sm:mb-8">
      <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md">
        <Icon name="Compass" :size="22" />
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Nearby Attractions</h2>
        <p class="text-sm text-gray-500 mt-0.5">Explore places to visit around the temple</p>
        <div class="h-0.5 w-16 bg-gradient-to-r from-gray-300 to-transparent rounded-full mt-1" />
      </div>
    </div>

    <!-- Attractions Grid/Scroll -->
    <div
      class="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:px-0 md:mx-0"
    >
      <div
        v-for="(attraction, idx) in attractions"
        :key="idx"
        class="flex-shrink-0 w-[270px] sm:w-[300px] md:w-auto snap-start bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
        @click="openMap(attraction.mapsUrl)"
      >
        <!-- Attraction Image -->
        <div class="relative h-44 bg-gray-100 overflow-hidden">
          <img
            :src="attraction.image"
            :alt="attraction.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-100 uppercase tracking-wider">
            {{ attraction.category }}
          </div>
        </div>

        <!-- Attraction Details -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-gray-950 text-base mb-1.5 group-hover:text-amber-700 transition-colors">
              {{ attraction.name }}
            </h4>
            <p class="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
              {{ attraction.description }}
            </p>
          </div>

          <!-- Metas & Action -->
          <div class="border-t border-gray-50 pt-4 flex items-center justify-between">
            <div class="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <span class="flex items-center gap-1">
                <Icon name="MapPin" :size="12" class="text-gray-400" />
                {{ attraction.distance }} km
              </span>
              <span class="flex items-center gap-1">
                <Icon name="Clock" :size="12" class="text-gray-400" />
                {{ attraction.travelTime }} mins
              </span>
            </div>
            
            <a
              :href="attraction.mapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
              class="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white flex items-center justify-center transition-colors"
              aria-label="View route in Google Maps"
            >
              <Icon name="Navigation" :size="14" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tirth } from '~/types/models'
import Icon from '~/components/ui/Icon.vue'

// Import placeholders/generate urls
import defaultImg from '~/assets/images/jain-temple-placeholder.png'

const props = defineProps<{ tirth: Tirth }>()

const openMap = (url: string) => {
  window.open(url, '_blank')
}

// Generate contextually accurate nearby attractions depending on the state and city
const attractions = computed(() => {
  const city = props.tirth.location.city.toLowerCase()
  const state = props.tirth.location.state.toLowerCase()

  if (state === 'gujarat') {
    if (city === 'palitana') {
      return [
        {
          name: 'Shatrunjaya Hills Path',
          category: 'Jain Tirth',
          distance: '0.5',
          travelTime: '10',
          description: 'The sacred steps climbing up to the main peak of Shatrunjaya Hills, featuring over 860 white marble temples.',
          image: defaultImg,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Shatrunjaya+Hills+Palitana'
        },
        {
          name: 'Hastagiri Jain Tirth',
          category: 'Jain Tirth',
          distance: '16',
          travelTime: '30',
          description: 'An ancient hill pilgrimage overlooking the Shetrunji river, consecrated by Lord Adinath.',
          image: defaultImg,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hastagiri+Jain+Tirth'
        },
        {
          name: 'Bhadreshwar Jain Temple',
          category: 'Temple',
          distance: '45',
          travelTime: '65',
          description: 'A beautifully renovated historic temple complex showcasing typical western Indian architecture.',
          image: defaultImg,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bhadreshwar+Jain+Temple'
        }
      ]
    }
    // Generic Gujarat
    return [
      {
        name: 'Girnar Hills (Junagadh)',
        category: 'Pilgrimage',
        distance: '85',
        travelTime: '120',
        description: 'Famous mountain range with ancient rock-cut Jain temples on the peaks dedicated to Lord Neminath.',
        image: defaultImg,
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Girnar+Jain+Temples'
      },
      {
        name: 'Taranga Hill Temple',
        category: 'Jain Tirth',
        distance: '140',
        travelTime: '180',
        description: 'Majestic 12th-century temple carved out of sandstone, dedicated to Lord Ajitnath.',
        image: defaultImg,
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Taranga+Hill+Jain+Temple'
      }
    ]
  }

  if (state === 'rajasthan') {
    if (city === 'mount abu' || city === 'dilwara') {
      return [
        {
          name: 'Dilwara Jain Temples',
          category: 'Jain Tirth',
          distance: '0.8',
          travelTime: '3',
          description: 'World-famous cluster of marble temples known for their incomparable architectural details and ceiling carvings.',
          image: defaultImg,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dilwara+Jain+Temples'
        },
        {
          name: 'Nakki Lake',
          category: 'Scenic spot',
          distance: '3.2',
          travelTime: '12',
          description: 'A sacred lake surrounded by mountains, offering boating, sunsets, and local crafts.',
          image: defaultImg,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Nakki+Lake+Mount+Abu'
        },
        {
          name: 'Achalgarh Fort & Temples',
          category: 'Historical',
          distance: '8.5',
          travelTime: '20',
          description: 'A historic medieval fort housing Achaleshwar Mahadev and nearby Jain shrines on high rock points.',
          image: defaultImg,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Achalgarh+Fort'
        }
      ]
    }
    // Generic Rajasthan
    return [
      {
        name: 'Ranakpur Temple Complex',
        category: 'Jain Tirth',
        distance: '95',
        travelTime: '140',
        description: 'An architectural marvel featuring 1,444 uniquely carved pillars supporting a sprawling marble shrine.',
        image: defaultImg,
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ranakpur+Jain+Temple'
      },
      {
        name: 'Nakoda Parsvnath Tirth',
        category: 'Jain Tirth',
        distance: '120',
        travelTime: '160',
        description: 'Highly revered pilgrimage dedicated to Nakoda Parsvnath and Lord Bhairav, drawing thousands of devotees daily.',
        image: defaultImg,
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Nakoda+Parsvnath+Tirth'
      }
    ]
  }

  // Fallback attractions (general)
  return [
    {
      name: 'Local Jain Museum',
      category: 'Historical',
      distance: '1.2',
      travelTime: '5',
      description: 'Houses historic manuscripts, stone inscriptions, and centuries-old bronze icons recovered from surrounding areas.',
      image: defaultImg,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=Jain+Museum+${props.tirth.location.city}`
    },
    {
      name: 'Scenic Hill Viewpoint',
      category: 'Scenic spot',
      distance: '4.5',
      travelTime: '15',
      description: 'A beautiful lookout point offering panoramic views of the temple complex and lush valleys.',
      image: defaultImg,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=Viewpoint+${props.tirth.location.city}`
    }
  ]
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
