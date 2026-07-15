<template>
  <div id="top" class="min-h-screen bg-gray-50 py-4 sm:py-8">
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6 sm:space-y-8 animate-pulse">
        <!-- Breadcrumb Skeleton -->
        <div class="hidden md:flex items-center gap-2">
          <div class="h-4 w-12 bg-gray-200 rounded"></div>
          <div class="w-3 h-3 bg-gray-200 rounded-full"></div>
          <div class="h-4 w-24 bg-gray-200 rounded"></div>
          <div class="w-3 h-3 bg-gray-200 rounded-full"></div>
          <div class="h-4 w-48 bg-gray-200 rounded"></div>
        </div>

        <!-- ═══ SECTION 1: Image Gallery Grid Skeleton ═══ -->
        <div class="relative rounded-2xl overflow-hidden h-64 sm:h-96 lg:h-[480px] grid grid-cols-4 grid-rows-2 gap-1.5 bg-gray-100 shadow-lg">
          <div class="col-span-2 row-span-2 bg-gray-200" />
          <div v-for="n in 4" :key="n" class="bg-gray-200" />
        </div>

        <!-- ═══ SECTION 2: Two-column layout Skeleton ═══ -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <!-- ── LEFT COLUMN ── -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Property Header -->
            <div class="space-y-4">
              <div class="h-10 sm:h-12 w-3/4 bg-gray-200 rounded-lg"></div>
              <div class="h-5 w-1/2 sm:w-1/3 bg-gray-200 rounded"></div>
              <div class="flex flex-wrap gap-2.5 mt-4">
                <div class="h-8 w-16 bg-gray-200 rounded-lg"></div>
                <div class="h-8 w-24 bg-gray-200 rounded-lg"></div>
                <div class="h-8 w-24 bg-gray-200 rounded-lg"></div>
                <div class="h-8 w-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            <!-- Quick Highlights strip -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div v-for="n in 4" :key="n" class="flex items-center gap-3 p-4 bg-gray-100/50 rounded-xl border border-gray-100">
                <div class="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div class="space-y-2 flex-1">
                  <div class="h-3 w-16 bg-gray-200 rounded"></div>
                  <div class="h-4 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>

            <!-- About -->
            <div class="space-y-3">
              <div class="flex items-center gap-2 mb-4">
                 <div class="w-1 h-6 bg-gray-200 rounded-full"></div>
                 <div class="h-7 w-48 bg-gray-200 rounded-lg"></div>
              </div>
              <div class="h-4 w-full bg-gray-200 rounded"></div>
              <div class="h-4 w-11/12 bg-gray-200 rounded"></div>
              <div class="h-4 w-full bg-gray-200 rounded"></div>
              <div class="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div class="h-4 w-4/5 bg-gray-200 rounded"></div>
            </div>
            
            <!-- Amenities -->
            <div class="space-y-4">
              <div class="flex items-center gap-2 mb-4">
                 <div class="w-1 h-6 bg-gray-200 rounded-full"></div>
                 <div class="h-7 w-32 bg-gray-200 rounded-lg"></div>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                 <div v-for="n in 6" :key="n" class="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                    <div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div class="h-4 w-20 bg-gray-200 rounded"></div>
                 </div>
              </div>
            </div>
          </div>

          <!-- ── RIGHT COLUMN (sticky) ── -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 space-y-4">
              <!-- Price Card -->
              <div class="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden h-96">
                 <div class="h-32 bg-gray-200"></div>
                 <div class="grid grid-cols-2 border-b border-gray-100">
                    <div class="p-4 space-y-2"><div class="h-3 w-16 bg-gray-200 rounded"></div><div class="h-4 w-20 bg-gray-200 rounded"></div></div>
                    <div class="p-4 space-y-2"><div class="h-3 w-16 bg-gray-200 rounded"></div><div class="h-4 w-20 bg-gray-200 rounded"></div></div>
                 </div>
                 <div class="p-4 space-y-3">
                    <div class="h-12 bg-gray-200 rounded-xl"></div>
                    <div class="h-12 bg-gray-100 rounded-xl"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex justify-center items-center py-32">
        <div class="text-center space-y-6 max-w-md">
          <Icon name="AlertTriangle" :size="48" class="text-red-500 mx-auto" />
          <p class="text-red-600 font-semibold text-lg">{{ error }}</p>
          <NuxtLink to="/dharamshala" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
            Return to List
          </NuxtLink>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="dharamshala" class="space-y-6 sm:space-y-8">

        <!-- Breadcrumb -->
        <div class="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <NuxtLink to="/" class="hover:text-gray-900 transition-colors">Home</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <NuxtLink to="/dharamshala" class="hover:text-gray-900 transition-colors">Dharamshala</NuxtLink>
          <Icon name="ChevronRight" :size="14" />
          <span class="text-gray-900 font-medium truncate">{{ dharamshala.name }}</span>
        </div>

        <!-- ═══ SECTION 1: Image Gallery Grid ═══ -->
        <div class="relative rounded-2xl overflow-hidden h-64 sm:h-96 lg:h-[480px] grid grid-cols-4 grid-rows-2 gap-1.5 bg-gray-200 shadow-lg">
          <!-- Main large image -->
          <div class="col-span-2 row-span-2 relative group overflow-hidden">
            <img
              :src="dharamshala.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'"
              :alt="dharamshala.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <!-- 4 smaller images -->
          <template v-for="(img, idx) in (dharamshala.images || []).slice(1, 5)" :key="idx">
            <div class="relative group overflow-hidden bg-gray-300">
              <img
                :src="img"
                :alt="`${dharamshala.name} ${idx + 2}`"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                v-if="idx === 3 && dharamshala.images && dharamshala.images.length > 5"
                class="absolute inset-0 bg-black/55 flex items-center justify-center cursor-pointer hover:bg-black/65 transition-colors"
                @click="currentImageIndex = 4"
              >
                <span class="text-white font-bold text-sm">+{{ dharamshala.images.length - 5 }} photos</span>
              </div>
            </div>
          </template>
          <!-- Fallback tiles when fewer than 5 images -->
          <template v-if="!dharamshala.images || dharamshala.images.length < 2">
            <div v-for="n in 4" :key="n" class="bg-gradient-to-br from-blue-100 to-cyan-100" />
          </template>
          <!-- Featured badge -->
          <div
            v-if="dharamshala.isFeatured"
            class="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10"
          >
            <Icon name="Star" :size="12" class="fill-white" />
            Featured Property
          </div>
        </div>

        <!-- ═══ SECTION 2: Two-column layout ═══ -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

          <!-- ── LEFT COLUMN ── -->
          <div class="lg:col-span-2 space-y-8">

            <!-- 2A: Property Header -->
            <div class="space-y-4">
              <div>
                <div class="flex items-start justify-between gap-4">
                  <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {{ dharamshala.name }}
                  </h1>
                  <WishlistButton
                    :item-id="dharamshala.id"
                    entity-type="dharamshala"
                    heart-color="text-red-500"
                    class="flex-shrink-0 mt-1"
                  />
                </div>
                <div class="flex items-center gap-2 mt-2 text-gray-500">
                  <Icon name="MapPin" :size="16" class="text-blue-500 flex-shrink-0" />
                  <span class="text-base">
                    {{ dharamshala.location?.address || ((dharamshala.location?.city || '') + ', ' + (dharamshala.location?.state || '')) }}
                  </span>
                </div>
              </div>

              <!-- Rating + tags row -->
              <div class="flex flex-wrap items-center gap-2.5">
                <div class="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-sm">
                  <Icon name="Star" :size="13" class="fill-white" />
                  <span class="font-bold text-sm">{{ dharamshala.rating?.toFixed(1) || '0.0' }}</span>
                </div>
                <span class="text-gray-500 text-sm">{{ dharamshala.reviews || 0 }} reviews</span>
                <span class="text-gray-300 text-sm">•</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold">
                  {{ dharamshala.type }}
                </span>
                <span
                  v-for="tag in dharamshala.dharamshala_tags"
                  :key="tag"
                  class="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-sm font-medium border border-cyan-200"
                >
                  {{ tag }}
                </span>
              </div>

              <p v-if="dharamshala.establishedYear" class="text-sm text-gray-400">
                Established {{ dharamshala.establishedYear }}
              </p>
            </div>

            <!-- 2B: Quick Highlights strip -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                v-if="dharamshala.checkInTime"
                class="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100"
              >
                <div class="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Icon name="LogIn" :size="18" class="text-blue-700" />
                </div>
                <div>
                  <p class="text-xs text-gray-400 font-medium">Check-in</p>
                  <p class="text-sm font-bold text-gray-900">{{ dharamshala.checkInTime }}</p>
                </div>
              </div>
              <div
                v-if="dharamshala.checkOutTime"
                class="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100"
              >
                <div class="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                  <Icon name="LogOut" :size="18" class="text-orange-700" />
                </div>
                <div>
                  <p class="text-xs text-gray-400 font-medium">Check-out</p>
                  <p class="text-sm font-bold text-gray-900">{{ dharamshala.checkOutTime }}</p>
                </div>
              </div>
              <div
                v-if="dharamshala.languagesSpoken?.length"
                class="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100"
              >
                <div class="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <Icon name="MessageSquare" :size="18" class="text-purple-700" />
                </div>
                <div>
                  <p class="text-xs text-gray-400 font-medium">Languages</p>
                  <p class="text-sm font-bold text-gray-900">{{ dharamshala.languagesSpoken.slice(0, 2).join(', ') }}</p>
                </div>
              </div>
              <div
                v-if="dharamshala.diningInfo"
                class="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100"
              >
                <div class="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <Icon name="UtensilsCrossed" :size="18" class="text-green-700" />
                </div>
                <div>
                  <p class="text-xs text-gray-400 font-medium">Dining</p>
                  <p class="text-sm font-bold text-gray-900 line-clamp-1">Veg Only</p>
                </div>
              </div>
            </div>

            <!-- 2C: About -->
            <div v-if="dharamshala.description" class="space-y-3">
              <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div class="w-1 h-6 bg-blue-500 rounded-full" />
                About this Dharamshala
              </h2>
              <p class="text-gray-600 leading-relaxed text-base">{{ dharamshala.description }}</p>
              <div
                v-if="dharamshala.diningInfo"
                class="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200"
              >
                <Icon name="Flower2" :size="18" class="text-green-600 flex-shrink-0 mt-0.5" />
                <p class="text-green-800 text-sm font-medium">{{ dharamshala.diningInfo }}</p>
              </div>
            </div>

            <!-- 2D: Amenities -->
            <div v-if="dharamshala.amenities?.length" class="space-y-4">
              <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div class="w-1 h-6 bg-blue-500 rounded-full" />
                Amenities
              </h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div
                  v-for="amenity in dharamshala.amenities"
                  :key="amenity"
                  class="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm"
                >
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" :size="16" class="text-blue-600" />
                  </div>
                  <span class="text-sm font-medium text-gray-800">{{ amenity }}</span>
                </div>
              </div>
            </div>

            <!-- 2E: Special Services -->
            <div v-if="dharamshala.specialServices?.length" class="space-y-4">
              <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div class="w-1 h-6 bg-amber-500 rounded-full" />
                Special Services
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="service in dharamshala.specialServices"
                  :key="service"
                  class="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200"
                >
                  <Icon name="Sparkles" :size="16" class="text-amber-600 flex-shrink-0" />
                  <span class="text-sm font-medium text-amber-900">{{ service }}</span>
                </div>
              </div>
            </div>

            <!-- 2F: Rules -->
            <div v-if="dharamshala.rules?.length" class="space-y-4">
              <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div class="w-1 h-6 bg-red-400 rounded-full" />
                Property Rules
              </h2>
              <div class="space-y-2">
                <div
                  v-for="(rule, index) in dharamshala.rules"
                  :key="index"
                  class="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100"
                >
                  <div class="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="text-xs font-bold text-red-700">{{ index + 1 }}</span>
                  </div>
                  <span class="text-sm text-gray-700">{{ rule }}</span>
                </div>
              </div>
            </div>

          </div>

          <!-- ── RIGHT COLUMN (sticky) ── -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 space-y-4">

              <!-- Price + Contact Card -->
              <div class="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <!-- Price header -->
                <div class="bg-gradient-to-r from-blue-600 to-cyan-600 p-5">
                  <p class="text-blue-100 text-sm font-medium">Starting from</p>
                  <p class="text-2xl font-bold text-white mt-1 leading-tight">
                    {{ dharamshala.priceRange || 'Contact for pricing' }}
                  </p>
                  <p class="text-blue-200 text-xs mt-1">per room per night</p>
                </div>
                <!-- Check-in/out times -->
                <div class="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
                  <div class="p-4">
                    <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">Check-in</p>
                    <p class="text-sm font-bold text-gray-900 mt-0.5">{{ dharamshala.checkInTime || '12:00 PM' }}</p>
                  </div>
                  <div class="p-4">
                    <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">Check-out</p>
                    <p class="text-sm font-bold text-gray-900 mt-0.5">{{ dharamshala.checkOutTime || '10:00 AM' }}</p>
                  </div>
                </div>
                <!-- Contact buttons -->
                <div class="p-4 space-y-2.5 border-b border-gray-100">
                  <a
                    v-if="dharamshala.contact?.phone"
                    :href="`tel:${dharamshala.contact.phone}`"
                    class="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:shadow-md text-sm"
                  >
                    <Icon name="Phone" :size="16" />
                    {{ dharamshala.contact.phone }}
                  </a>
                  <a
                    v-if="dharamshala.contact?.email"
                    :href="`mailto:${dharamshala.contact.email}`"
                    class="w-full flex items-center justify-center gap-2 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all text-sm"
                  >
                    <Icon name="Mail" :size="16" />
                    Email Us
                  </a>
                  <p
                    v-if="!dharamshala.contact?.phone && !dharamshala.contact?.email"
                    class="text-sm text-gray-400 italic text-center py-1"
                  >
                    Contact details not available
                  </p>
                </div>
                <!-- Payment methods -->
                <div v-if="dharamshala.paymentMethods?.length" class="p-4 border-b border-gray-100">
                  <p class="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Accepted Payments</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="method in dharamshala.paymentMethods"
                      :key="method"
                      class="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                    >
                      {{ method }}
                    </span>
                  </div>
                </div>
                <!-- Nearby attractions -->
                <div v-if="dharamshala.nearbyAttractions?.length" class="p-4 border-b border-gray-100">
                  <p class="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2.5">Nearby</p>
                  <div class="space-y-2">
                    <div
                      v-for="place in dharamshala.nearbyAttractions"
                      :key="place"
                      class="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <Icon name="MapPin" :size="13" class="text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{{ place }}</span>
                    </div>
                  </div>
                </div>
                <!-- Directions button -->
                <div class="p-4">
                  <a
                    :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((dharamshala.location?.address || '') + ' ' + (dharamshala.location?.city || '') + ' ' + (dharamshala.location?.state || ''))}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all text-sm"
                  >
                    <Icon name="MapPin" :size="16" />
                    Get Directions
                  </a>
                </div>
              </div>

              <!-- Trust badges -->
              <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div class="space-y-2.5">
                  <div class="flex items-center gap-2.5 text-sm text-gray-600">
                    <div class="w-7 h-7 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Shield" :size="14" class="text-green-600" />
                    </div>
                    <span>Verified property</span>
                  </div>
                  <div class="flex items-center gap-2.5 text-sm text-gray-600">
                    <div class="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Heart" :size="14" class="text-red-500" />
                    </div>
                    <span>Pilgrimage friendly</span>
                  </div>
                  <div class="flex items-center gap-2.5 text-sm text-gray-600">
                    <div class="w-7 h-7 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                       <Icon name="Flower2" :size="14" class="text-green-600" />
                    </div>
                    <span>100% Vegetarian</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- ═══ SECTION 3: Full-width Rooms ═══ -->
        <div class="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 sm:p-8 rounded-2xl border-2 border-blue-200">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Icon name="Home" :size="28" class="text-blue-600" />
              Available Rooms
            </h2>
            <div v-if="realtimeConnected" class="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span class="text-xs font-semibold text-green-700">Live</span>
            </div>
          </div>
          <p class="text-gray-500 mb-6 text-sm">Book your accommodation with real-time availability</p>

          <!-- Loading Skeleton -->
          <div v-if="dharamshalaStore.roomsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 3" :key="n" class="bg-white rounded-2xl border-2 border-blue-100 overflow-hidden animate-pulse">
              <div class="h-48 bg-gradient-to-br from-blue-100 to-cyan-100" />
              <div class="p-5 space-y-3">
                <div class="flex justify-between">
                  <div class="h-5 bg-blue-100 rounded-lg w-32" />
                  <div class="h-5 bg-blue-100 rounded-lg w-16" />
                </div>
                <div class="h-3 bg-gray-100 rounded w-full" />
                <div class="grid grid-cols-2 gap-2">
                  <div class="h-16 bg-blue-50 rounded-xl" />
                  <div class="h-16 bg-blue-50 rounded-xl" />
                </div>
                <div class="h-10 bg-blue-100 rounded-xl" />
              </div>
            </div>
          </div>

          <!-- Rooms Error -->
          <div v-else-if="dharamshalaStore.roomsError" class="text-center py-12 space-y-4">
            <Icon name="AlertTriangle" :size="48" class="text-red-400 mx-auto" />
            <p class="text-red-600 font-semibold">{{ dharamshalaStore.roomsError }}</p>
            <button
              @click="dharamshalaStore.fetchRoomTypes(dharamshala.id)"
              class="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>

          <!-- Rooms Empty -->
          <div v-else-if="allRooms.length === 0" class="text-center py-12 space-y-4">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Icon name="Home" :size="36" class="text-blue-400" />
            </div>
            <p class="text-gray-500 font-semibold text-lg">No rooms available at this time</p>
            <p class="text-gray-400 text-sm">Please check back later or contact the dharamshala directly</p>
          </div>

          <!-- Rooms Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <RoomCard
              v-for="room in allRooms"
              :key="room.room_type_id"
              :room="room"
              :dharamshala-id="dharamshala.id"
              @select-room="openBookingModal"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- Room Booking Modal -->
    <RoomBookingModal
      v-if="dharamshala"
      :is-open="isBookingModalOpen"
      :room="selectedRoom || undefined"
      :dharamshala-id="dharamshala.id"
      @close="closeBookingModal"
      @booking-confirmed="handleBookingConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import type { Dharamshala, RoomType, Booking } from '~/types/models'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useDharamshalaStore } from '~/features/dharamshala/shared/composables/useDharamshalaStore'
import Icon from '~/components/ui/Icon.vue'
import RoomCard from '~/features/dharamshala/dharamshaladetailpage/components/RoomCard.vue'
import RoomBookingModal from '~/features/dharamshala/dharamshaladetailpage/components/RoomBookingModal.vue'
import { WishlistButton } from '~/features/wishlist'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const dharamshalaStore = useDharamshalaStore()

const currentImageIndex = ref(0)
const dharamshala = ref<Dharamshala | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const isBookingModalOpen = ref(false)
const selectedRoom = ref<RoomType | null>(null)
const realtimeConnected = ref(false)
let realtimeChannel: any = null

/** Merged rooms: Supabase room_types + legacy sample rooms */
const allRooms = computed<RoomType[]>(() => {
  // Prefer Supabase room_types from store
  if (dharamshalaStore.roomTypes.length > 0) {
    return dharamshalaStore.roomTypes
  }
  // Fallback: transform legacy Room[] from sample data to RoomType shape
  if (dharamshala.value?.rooms && dharamshala.value.rooms.length > 0) {
    return dharamshala.value.rooms.map((room) => ({
      room_type_id: room.id,
      dharamshala_id: dharamshala.value!.id,
      name: `Room ${room.roomNumber}`,
      room_category: room.type as any,
      description: room.description || null,
      bed_configuration: room.bedType || 'Single Bed',
      capacity: room.capacity,
      max_guests: room.maxGuests,
      base_price: room.price,
      total_inventory: room.available ? 3 : 0,
      amenities: room.amenities || [],
      room_type_images: room.image ? [room.image] : [],
      is_available_ui: room.available,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
  }
  return []
})



const openBookingModal = (room: RoomType) => {
  selectedRoom.value = room
  isBookingModalOpen.value = true
}

const closeBookingModal = () => {
  isBookingModalOpen.value = false
  selectedRoom.value = null
}

const handleBookingConfirmed = (booking: Booking) => {
  console.log('Booking confirmed:', booking)
  // Refresh rooms to get updated inventory
  if (dharamshala.value) {
    dharamshalaStore.fetchRoomTypes(dharamshala.value.id)
  }
}

// ─── Supabase Realtime ─────────────────────────────────

const setupRealtime = async (dharamshalaId: string) => {
  try {
    const { useSupabase } = await import('~/features/auth/composables/useSupabase')
    const { supabase } = useSupabase()

    // Cleanup previous channel
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
    }

    realtimeChannel = supabase
      .channel(`rooms-${dharamshalaId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'tirthlok',
          table: 'room_types',
          filter: `dharamshala_id=eq.${dharamshalaId}`,
        },
        (payload: any) => {
          console.log('🔴 Realtime room update:', payload.eventType)

          if (payload.eventType === 'INSERT') {
            dharamshalaStore.addRoomFromRealtime(payload.new as RoomType)
          } else if (payload.eventType === 'UPDATE') {
            dharamshalaStore.updateRoomFromRealtime(payload.new as RoomType)
          } else if (payload.eventType === 'DELETE') {
            dharamshalaStore.removeRoomFromRealtime(payload.old?.room_type_id)
          }
        }
      )
      .subscribe((status: string) => {
        realtimeConnected.value = status === 'SUBSCRIBED'
        console.log(`📡 Realtime status: ${status}`)
      })
  } catch (err) {
    console.warn('Realtime subscription failed (non-critical):', err)
    realtimeConnected.value = false
  }
}

const cleanupRealtime = async () => {
  if (realtimeChannel) {
    try {
      const { useSupabase } = await import('~/features/auth/composables/useSupabase')
      const { supabase } = useSupabase()
      supabase.removeChannel(realtimeChannel)
    } catch {
      // Ignore cleanup errors
    }
    realtimeChannel = null
    realtimeConnected.value = false
  }
}

// ─── Data Loading ──────────────────────────────────────

// Back-to-top behavior handled by global `scroll.client.ts` plugin and anchor link

const loadData = async (idParam?: string) => {
  try {
    loading.value = true
    error.value = null
    const id = (idParam ?? route.params.dharamshalaId) as string

    // Fetch data if not in store
    if (dharamshalaStore.dharamshalas.length === 0) {
      await dharamshalaStore.fetchDharamshalas()
    }

    const found = dharamshalaStore.getDharamshalaById(id)
    if (found) {
      // Set store data immediately so the page renders without waiting
      dharamshala.value = found
      currentImageIndex.value = 0

      // Fetch rooms from Supabase
      dharamshalaStore.fetchRoomTypes(id)

      // Setup realtime subscription
      setupRealtime(id)

      // Always fetch full detail so we get contact, priceRange, rules etc.
      // from dharamshala_details. Using $fetch directly — composables that call
      // useRuntimeConfig() cannot be used inside async functions in production.
      try {
        const detail = await $fetch<any>(`/api/dharamshala/${encodeURIComponent(id)}`)
        if (detail?.contact) {
          dharamshala.value = {
            ...found,
            contact: detail.contact,
            priceRange: detail.priceRange || found.priceRange,
            description: detail.description || found.description,
            rules: detail.rules?.length ? detail.rules : (found.rules ?? []),
            amenities: detail.amenities?.length ? detail.amenities : (found.amenities ?? []),
            checkInTime: detail.checkInTime,
            checkOutTime: detail.checkOutTime,
            languagesSpoken: detail.languagesSpoken,
            nearbyAttractions: detail.nearbyAttractions,
            diningInfo: detail.diningInfo,
            specialServices: detail.specialServices,
            paymentMethods: detail.paymentMethods,
            reviews: detail.reviews || found.reviews,
            isFeatured: detail.isFeatured,
            establishedYear: detail.establishedYear,
          }
        }
      } catch (detailErr) {
        console.warn('[dharamshala] detail fetch failed (contact may be missing):', detailErr)
      }
    } else {
      error.value = `Dharamshala with ID "${id}" not found`
    }
  } catch (err) {
    error.value = 'Failed to load dharamshala data'
    console.error('Error loading dharamshala:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

onUnmounted(() => {
  cleanupRealtime()
})

onBeforeRouteUpdate((to) => {
  cleanupRealtime()
  const nextId = to.params.dharamshalaId as string
  loadData(nextId)
})
</script>
