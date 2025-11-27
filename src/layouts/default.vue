<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
    <!-- Header component -->
    <Header />

    <!-- Main Content -->
    <main class="flex-1 mx-auto w-full">
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
              <li><NuxtLink to="/tirth" class="hover:text-white transition-colors">Tirth</NuxtLink></li>
              <li><NuxtLink to="/dharamshala" class="hover:text-white transition-colors">Dharamshala</NuxtLink></li>
              <li><NuxtLink to="/bhojanshala" class="hover:text-white transition-colors">Bhojanshala</NuxtLink></li>
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
import Header from '~/components/header/Header.vue'
import Icon from '~/components/common/Icon.vue'
</script>
