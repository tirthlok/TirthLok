<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-sage to-saffron rounded-lg flex items-center justify-center shadow-md">
            <Icon name="Palmtree" :size="24" class="text-white" />
          </div>
          <span class="text-2xl font-bold text-sage font-serif hidden sm:inline">Tirth Explorer</span>
          <span class="text-xl font-bold text-sage sm:hidden">Tirth</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink to="/" class="text-charcoal hover:text-sage font-medium transition-colors" active-class="text-sage">
            Explore
          </NuxtLink>
          <NuxtLink to="/favorites" class="text-charcoal hover:text-sage font-medium transition-colors flex items-center gap-2" active-class="text-sage">
            <Icon name="Heart" :size="20" />
            Favorites
          </NuxtLink>
          <NuxtLink to="/admin" class="text-charcoal hover:text-sage font-medium transition-colors" active-class="text-sage">
            Admin
          </NuxtLink>
        </nav>

        <!-- Mobile Menu Button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 hover:bg-cream rounded-lg transition-colors">
          <Icon name="Menu" :size="24" class="text-charcoal" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-show="mobileMenuOpen" class="md:hidden border-t border-gray-100 bg-cream">
        <div class="px-4 py-4 space-y-4">
          <NuxtLink to="/" class="block text-charcoal hover:text-sage font-medium transition-colors">Explore</NuxtLink>
          <NuxtLink to="/favorites" class="block text-charcoal hover:text-sage font-medium transition-colors flex items-center gap-2">
            <Icon name="Heart" :size="20" />
            Favorites
          </NuxtLink>
          <NuxtLink to="/admin" class="block text-charcoal hover:text-sage font-medium transition-colors">Admin</NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-32 md:pb-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-charcoal text-light-gray mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-safe">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-white font-bold text-lg mb-4">About Jain Tirth Explorer</h3>
            <p class="text-sm leading-relaxed">Discover and explore sacred Jain pilgrimage sites with comprehensive information, nearby facilities, and interactive maps.</p>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink></li>
              <li><NuxtLink to="/favorites" class="hover:text-white transition-colors">Favorites</NuxtLink></li>
              <li><a href="#about" class="hover:text-white transition-colors">About</a></li>
              <li><a href="#contact" class="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4">Help</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#faq" class="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#privacy" class="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#terms" class="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-bold mb-4">Contact</h3>
            <p class="text-sm mb-2">Email: info@jainthirthexplorer.com</p>
            <p class="text-sm mb-4">Phone: +91 XXXX-XXXX-XXXX</p>
            <div class="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener" class="text-gray-400 hover:text-white transition-colors">
                <Icon name="Facebook" :size="20" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener" class="text-gray-400 hover:text-white transition-colors">
                <Icon name="Twitter" :size="20" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener" class="text-gray-400 hover:text-white transition-colors">
                <Icon name="Instagram" :size="20" />
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8">
          <p class="text-center text-sm text-gray-400">&copy; 2024 Jain Tirth Explorer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)
</script>
