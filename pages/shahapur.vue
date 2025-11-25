<template>
  <div class="min-h-screen bg-gradient-to-b from-cream to-white py-4 sm:py-8 md:py-12">
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <div class="mb-4 sm:mb-6">
        <NuxtLink to="/bhojanshala" class="inline-flex items-center gap-2 text-sage hover:text-opacity-80 font-semibold transition-colors text-sm sm:text-base">
          <Icon name="ArrowLeft" :size="20" />
          Back to Bhojanshala
        </NuxtLink>
      </div>

      <!-- Hero Section -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6 sm:mb-8">
        <div class="flex flex-col md:flex-row gap-6 p-6">
          <div class="md:w-1/2">
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop" alt="Shahapur Bhojanshala" class="w-full h-96 object-cover rounded-lg" />
          </div>

          <div class="md:w-1/2">
            <h1 class="text-4xl font-bold text-charcoal mb-2">Shahapur Bhojanshala</h1>
            <p class="text-lg text-light-gray mb-6">Shahapur, Maharashtra</p>

            <div class="flex items-center gap-4 mb-6 pb-6 border-b">
              <div class="flex items-center gap-2">
                <Icon name="Star" :size="20" class="fill-yellow-400 text-yellow-400" />
                <span class="font-semibold text-lg">4.8</span>
                <span class="text-gray-600">(127 reviews)</span>
              </div>
              <span class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold">Vegetarian</span>
            </div>

            <div class="space-y-4 mb-6">
              <div class="flex items-start gap-3">
                <Icon name="Clock" :size="20" class="text-amber-600 mt-1" />
                <div>
                  <p class="text-sm text-gray-600">Operating Hours</p>
                  <p class="font-semibold text-gray-900">11:00 AM - 9:00 PM (Daily)</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="Phone" :size="20" class="text-amber-600 mt-1" />
                <div>
                  <p class="text-sm text-gray-600">Contact</p>
                  <p class="font-semibold text-gray-900">+91-7275-223445</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Icon name="MapPin" :size="20" class="text-amber-600 mt-1" />
                <div>
                  <p class="text-sm text-gray-600">Address</p>
                  <p class="font-semibold text-gray-900">Main Bazaar, Shahapur, Maharashtra 413509</p>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button class="flex-1 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2">
                <Icon name="Phone" :size="20" />
                Call Now
              </button>
              <button class="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Icon name="MapPin" :size="20" />
                Directions
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- About Section -->
      <div class="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-charcoal mb-4">About</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          Shahapur Bhojanshala is a traditional vegetarian dining facility dedicated to serving authentic Jain cuisine and other pure vegetarian meals. Located in the heart of Shahapur's main bazaar, it serves pilgrims, locals, and visitors seeking wholesome, affordable meals prepared according to strict dietary principles.
        </p>
        <p class="text-gray-700 leading-relaxed">
          The establishment has been serving the community for over 15 years with a commitment to quality, cleanliness, and traditional cooking methods. It's a favorite among both pilgrims visiting nearby temples and local residents.
        </p>
      </div>

      <!-- Features Section -->
      <div class="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-charcoal mb-6">Features & Amenities</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Icon name="CheckCircle" :size="24" class="text-green-600" />
            <span class="text-gray-900 font-medium">Jain Friendly Cuisine</span>
          </div>
          <div class="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Icon name="CheckCircle" :size="24" class="text-green-600" />
            <span class="text-gray-900 font-medium">Budget Friendly Pricing</span>
          </div>
          <div class="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Icon name="CheckCircle" :size="24" class="text-green-600" />
            <span class="text-gray-900 font-medium">No Onion-Garlic</span>
          </div>
          <div class="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Icon name="CheckCircle" :size="24" class="text-green-600" />
            <span class="text-gray-900 font-medium">Hygienic Preparation</span>
          </div>
          <div class="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Icon name="CheckCircle" :size="24" class="text-green-600" />
            <span class="text-gray-900 font-medium">Customizable Meals</span>
          </div>
          <div class="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Icon name="CheckCircle" :size="24" class="text-green-600" />
            <span class="text-gray-900 font-medium">Group Bookings Available</span>
          </div>
        </div>
      </div>

      <!-- Menu Section -->
      <div class="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-charcoal mb-6">Specialty Menu</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 border-l-4 border-amber-600 bg-amber-50">
            <h3 class="font-semibold text-gray-900 mb-1">Thali (Plate)</h3>
            <p class="text-sm text-gray-600">₹80 - ₹150</p>
            <p class="text-xs text-gray-500 mt-1">Rice, dal, vegetables, roti, pickle, dessert</p>
          </div>
          <div class="p-4 border-l-4 border-amber-600 bg-amber-50">
            <h3 class="font-semibold text-gray-900 mb-1">Dal Makhani</h3>
            <p class="text-sm text-gray-600">₹60 - ₹90</p>
            <p class="text-xs text-gray-500 mt-1">Creamy lentils with rice</p>
          </div>
          <div class="p-4 border-l-4 border-amber-600 bg-amber-50">
            <h3 class="font-semibold text-gray-900 mb-1">Paneer Bhurji</h3>
            <p class="text-sm text-gray-600">₹100 - ₹140</p>
            <p class="text-xs text-gray-500 mt-1">Cottage cheese with vegetables</p>
          </div>
          <div class="p-4 border-l-4 border-amber-600 bg-amber-50">
            <h3 class="font-semibold text-gray-900 mb-1">Kheer (Dessert)</h3>
            <p class="text-sm text-gray-600">₹30 - ₹50</p>
            <p class="text-xs text-gray-500 mt-1">Rice pudding with milk & nuts</p>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-charcoal mb-6">Customer Reviews</h2>
        <div class="space-y-4">
          <div class="pb-4 border-b">
            <div class="flex items-center gap-2 mb-2">
              <div class="flex gap-1">
                <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
                <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
                <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
                <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
                <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
              </div>
              <span class="font-semibold text-gray-900">Rajesh Kumar</span>
            </div>
            <p class="text-gray-700">"Excellent authentic vegetarian cuisine! The food is prepared with great care and hygiene. Highly recommended for pilgrims."</p>
          </div>
          <div class="pb-4 border-b">
            <div class="flex items-center gap-2 mb-2">
              <div class="flex gap-1">
                <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
                <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
                <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
                <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
                <Icon name="Star" :size="16" class="fill-yellow-400 text-yellow-400" />
              </div>
              <span class="font-semibold text-gray-900">Priya Sharma</span>
            </div>
            <p class="text-gray-700">"Very affordable and delicious meals. The staff is very courteous and accommodating. Perfect for groups."</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>
