# Interactive Map & Navigation Feature - Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing interactive maps, route suggestions, and navigation features in the Jain Tirth Explorer app.

---

## 1. Leaflet Setup

### Already Installed ✓
```json
"leaflet": "^1.9.4"
```

### Required Additional Packages
```bash
npm install leaflet-routing-machine
npm install leaflet-control-geocoder
npm install @vue-leaflet/vue-leaflet
```

### Types Installation
```bash
npm install --save-dev @types/leaflet
```

---

## 2. Creating the Map Component

### Create file: `components/TirthMap.vue`

```vue
<template>
  <div class="w-full h-96 md:h-[600px] rounded-lg overflow-hidden shadow-md">
    <div ref="mapContainer" class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import type { Tirth } from '~/types/models'

interface Props {
  tirth: Tirth
  showNearbyFacilities?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showNearbyFacilities: true,
})

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null

onMounted(() => {
  if (!mapContainer.value) return

  // Initialize map
  map = L.map(mapContainer.value).setView(
    [props.tirth.location.coordinates.latitude, props.tirth.location.coordinates.longitude],
    13
  )

  // Add base layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  // Add temple marker
  const templeIcon = L.divIcon({
    html: '<div class="flex items-center justify-center w-8 h-8 bg-sage rounded-full shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5m-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11m3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg></div>',
    className: '',
  })

  L.marker(
    [props.tirth.location.coordinates.latitude, props.tirth.location.coordinates.longitude],
    { icon: templeIcon }
  )
    .addTo(map)
    .bindPopup(`<strong>${props.tirth.name}</strong><br/>${props.tirth.location.city}`)
    .openPopup()

  // Add nearby facilities if requested
  if (props.showNearbyFacilities && props.tirth.facilities.length > 0) {
    props.tirth.facilities.forEach((facility) => {
      if (!facility.location?.coordinates) return

      const facilityIcon = L.divIcon({
        html: '<div class="flex items-center justify-center w-6 h-6 bg-saffron rounded-full shadow-md"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-4 h-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg></div>',
        className: '',
      })

      L.marker([facility.location.coordinates.latitude, facility.location.coordinates.longitude], {
        icon: facilityIcon,
      })
        .addTo(map)
        .bindPopup(`<strong>${facility.name}</strong><br/>${facility.type}`)
    })
  }

  // Fit bounds to show all markers
  if (map && props.tirth.facilities.length > 0) {
    const bounds = L.latLngBounds([
      [props.tirth.location.coordinates.latitude, props.tirth.location.coordinates.longitude],
      ...props.tirth.facilities
        .filter((f) => f.location?.coordinates)
        .map((f) => [f.location.coordinates.latitude, f.location.coordinates.longitude]),
    ])
    map.fitBounds(bounds, { padding: [50, 50] })
  }
})

// Cleanup
onUnmounted(() => {
  if (map) {
    map.off()
    map.remove()
  }
})
</script>

<style scoped>
:deep(.leaflet-container) {
  background-color: #f5f5f5;
  z-index: 1;
}

:deep(.leaflet-popup-content) {
  font-family: 'PT Sans', sans-serif;
  color: #2c2c2c;
}

:deep(.leaflet-popup-content strong) {
  color: #88b47f;
}
</style>
```

---

## 3. Integrating Map into Detail Page

### Update: `pages/tirth/[id].vue`

```vue
<template>
  <div v-if="tirth">
    <!-- ... existing tabs ... -->
    
    <div v-show="activeTab === 'map'" class="space-y-6 animate-fade-in">
      <!-- Map -->
      <TirthMap :tirth="tirth" :show-nearby-facilities="true" />

      <!-- Navigation Options -->
      <div class="bg-white rounded-lg border border-gray-100 p-6">
        <h3 class="text-lg font-bold text-charcoal mb-4">Get Directions</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Google Maps -->
          <a
            :href="`https://www.google.com/maps/search/${tirth.name}/@${tirth.location.coordinates.latitude},${tirth.location.coordinates.longitude},15z`"
            target="_blank"
            rel="noopener"
            class="p-4 bg-cream rounded-lg hover:shadow-md transition-all text-center group"
          >
            <Icon name="MapPin" :size="32" class="text-sage mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p class="font-semibold text-charcoal">Google Maps</p>
            <p class="text-xs text-light-gray mt-1">Get directions</p>
          </a>

          <!-- Apple Maps -->
          <a
            :href="`https://maps.apple.com/?q=${tirth.name}&address=${tirth.location.city}`"
            target="_blank"
            rel="noopener"
            class="p-4 bg-cream rounded-lg hover:shadow-md transition-all text-center group"
          >
            <Icon name="Map" :size="32" class="text-sage mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p class="font-semibold text-charcoal">Apple Maps</p>
            <p class="text-xs text-light-gray mt-1">Open in Maps</p>
          </a>

          <!-- In-App Navigator -->
          <button
            @click="startNavigation"
            class="p-4 bg-sage text-white rounded-lg hover:shadow-md transition-all text-center group"
          >
            <Icon name="Navigation" :size="32" class="mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p class="font-semibold">Navigate</p>
            <p class="text-xs mt-1 opacity-90">In-app directions</p>
          </button>
        </div>
      </div>

      <!-- Travel Information -->
      <div class="bg-white rounded-lg border border-gray-100 p-6">
        <h3 class="text-lg font-bold text-charcoal mb-4">Travel Information</h3>
        
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <Icon name="Car" :size="24" class="text-sage mt-1 flex-shrink-0" />
            <div>
              <p class="font-semibold text-charcoal">By Car</p>
              <p class="text-sm text-light-gray">{{ getApproximateDriveTime() }} from city center</p>
              <p class="text-xs text-light-gray mt-1">{{ tirth.location.address }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <Icon name="Users" :size="24" class="text-sage mt-1 flex-shrink-0" />
            <div>
              <p class="font-semibold text-charcoal">By Public Transport</p>
              <p class="text-sm text-light-gray">Bus/Train available</p>
              <p class="text-xs text-light-gray mt-1">Check local schedules</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <Icon name="Footprints" :size="24" class="text-sage mt-1 flex-shrink-0" />
            <div>
              <p class="font-semibold text-charcoal">Walking</p>
              <p class="text-sm text-light-gray">Temple located in {{ tirth.location.city }}</p>
              <p class="text-xs text-light-gray mt-1">Parking available on-site</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ... existing script setup ...

const startNavigation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const origin = `${position.coords.latitude},${position.coords.longitude}`
      const destination = `${tirth.value?.location.coordinates.latitude},${tirth.value?.location.coordinates.longitude}`
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`,
        '_blank'
      )
    })
  } else {
    alert('Geolocation not available')
  }
}

const getApproximateDriveTime = () => {
  // Placeholder - in production, use routing service
  return '2-4 hours'
}
</script>
```

---

## 4. Add "Map" Tab

### Update Tab Configuration in `pages/tirth/[id].vue`

```vue
<template>
  <!-- Tab Navigation -->
  <div class="flex gap-4 mb-8 border-b border-gray-100 overflow-x-auto pb-4">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="activeTab = tab.id"
      :class="[
        'px-4 py-2 font-semibold text-sm whitespace-nowrap transition-colors',
        activeTab === tab.id
          ? 'text-sage border-b-2 border-sage'
          : 'text-light-gray hover:text-charcoal'
      ]"
    >
      {{ tab.label }}
    </button>
  </div>

  <!-- Tab Content -->
  <div v-show="activeTab === 'about'" class="animate-fade-in">
    <TirthAbout :tirth="tirth" />
  </div>
  <div v-show="activeTab === 'facilities'" class="animate-fade-in">
    <TirthFacilities :tirth="tirth" />
  </div>
  <div v-show="activeTab === 'festivals'" class="animate-fade-in">
    <TirthFestivals :tirth="tirth" />
  </div>
  <div v-show="activeTab === 'map'" class="animate-fade-in">
    <!-- Map tab content -->
  </div>
</template>

<script setup lang="ts">
const tabs = [
  { id: 'about', label: 'About' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'festivals', label: 'Festivals' },
  { id: 'map', label: 'Map & Navigation' },
]
</script>
```

---

## 5. Creating Campus Layout Component (Optional Advanced)

### Create: `components/CampusLayout.vue`

```vue
<template>
  <div class="bg-white rounded-lg border border-gray-100 p-6">
    <h3 class="text-lg font-bold text-charcoal mb-4">Campus Layout</h3>
    
    <div class="bg-cream rounded-lg p-4 overflow-x-auto">
      <svg viewBox="0 0 400 300" class="w-full min-w-96">
        <!-- Grid -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e5e5" stroke-width="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#grid)" />

        <!-- Buildings/Structures -->
        <!-- Main Temple -->
        <rect x="150" y="50" width="100" height="100" fill="#88b47f" stroke="#2c2c2c" stroke-width="2" />
        <text x="200" y="105" text-anchor="middle" font-size="12" font-weight="bold" fill="white">
          Main Temple
        </text>

        <!-- Dharmashala -->
        <rect x="50" y="180" width="80" height="80" fill="#efc65a" stroke="#2c2c2c" stroke-width="2" />
        <text x="90" y="225" text-anchor="middle" font-size="11" fill="#2c2c2c">Dharmashala</text>

        <!-- Bhojanshala -->
        <rect x="270" y="180" width="80" height="80" fill="#efc65a" stroke="#2c2c2c" stroke-width="2" />
        <text x="310" y="225" text-anchor="middle" font-size="11" fill="#2c2c2c">Bhojanshala</text>

        <!-- Parking -->
        <rect x="50" y="50" width="70" height="70" fill="#9a9a9a" stroke="#2c2c2c" stroke-width="1" stroke-dasharray="5" />
        <text x="85" y="90" text-anchor="middle" font-size="10" fill="white">Parking</text>

        <!-- Legend -->
        <rect x="10" y="270" width="380" height="25" fill="white" stroke="#e5e5e5" stroke-width="1" />
        <text x="20" y="285" font-size="10" fill="#2c2c2c">
          Sacred • 🟩 Accommodation ▮ 🟨 Services ▮ 🟦 Facilities
        </text>
      </svg>
    </div>

    <p class="text-sm text-light-gray mt-4">Click on buildings for more information</p>
  </div>
</template>

<script setup lang="ts">
// Campus layout visualization
</script>
```

---

## 6. Distance Calculation Utility

### Create: `utils/distance.ts`

```typescript
/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Estimate travel time based on distance and mode
 */
export function estimateTravelTime(
  distance: number,
  mode: 'driving' | 'walking' | 'public' = 'driving'
): string {
  const speeds = {
    driving: 60, // km/h
    walking: 5, // km/h
    public: 30, // km/h average
  }

  const hours = distance / speeds[mode]
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutes`
  }
  return `${Math.round(hours)} hours`
}
```

---

## 7. Implementation Checklist

- [ ] Install Leaflet and dependencies
- [ ] Create TirthMap.vue component
- [ ] Add map tab to detail page
- [ ] Implement navigation options
- [ ] Add campus layout component
- [ ] Create distance utility functions
- [ ] Test on mobile and desktop
- [ ] Optimize map performance
- [ ] Add geolocation permission handling
- [ ] Style map markers with branding

---

## 8. API Integration (When Ready)

### Distance Matrix API (Google Maps)

```typescript
// For real-time distance calculation
export async function getDistanceMatrix(
  origins: [number, number],
  destinations: [number, number][]
) {
  const apiKey = useRuntimeConfig().public.googleMapsApiKey
  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json')
  
  url.searchParams.append('origins', origins.join(','))
  destinations.forEach(d => {
    url.searchParams.append('destinations', d.join(','))
  })
  url.searchParams.append('key', apiKey)

  return $fetch(url.toString())
}
```

---

## Next Steps

1. Install the required packages
2. Create TirthMap.vue component
3. Add to detail page
4. Test map rendering
5. Add navigation functionality
6. Implement geolocation
7. Deploy and test on production

