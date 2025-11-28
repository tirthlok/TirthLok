<template>
  <div :class="[
    'min-h-screen flex flex-col',
    themeStore?.isDarkMode 
      ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
      : 'bg-gradient-to-b from-white to-gray-50'
  ]">
    <!-- Header component -->
    <Header />

    <!-- Main Content -->
    <main class="flex-1 mx-auto w-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer :class="[
      'text-light-gray mt-12',
      themeStore?.isDarkMode ? 'bg-gray-950' : 'bg-charcoal'
    ]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-safe">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 :class="[
              'font-bold text-lg mb-4',
              themeStore?.isDarkMode ? 'text-gray-100' : 'text-white'
            ]">About Jain Tirth Explorer</h3>
            <p :class="[
              'text-sm leading-relaxed',
              themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-300'
            ]">Discover and explore sacred Jain pilgrimage sites with comprehensive information, nearby facilities, and interactive maps.</p>
          </div>
          <div>
            <h3 :class="[
              'font-bold mb-4',
              themeStore?.isDarkMode ? 'text-gray-100' : 'text-white'
            ]">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/" :class="[
                'transition-colors',
                themeStore?.isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'hover:text-white'
              ]">Home</NuxtLink></li>
              <li><NuxtLink to="/tirth" :class="[
                'transition-colors',
                themeStore?.isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'hover:text-white'
              ]">Tirth</NuxtLink></li>
              <li><NuxtLink to="/dharamshala" :class="[
                'transition-colors',
                themeStore?.isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'hover:text-white'
              ]">Dharamshala</NuxtLink></li>
              <li><NuxtLink to="/bhojanshala" :class="[
                'transition-colors',
                themeStore?.isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'hover:text-white'
              ]">Bhojanshala</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 :class="[
              'font-bold mb-4',
              themeStore?.isDarkMode ? 'text-gray-100' : 'text-white'
            ]">Help</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#faq" :class="[
                'transition-colors',
                themeStore?.isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'hover:text-white'
              ]">FAQ</a></li>
              <li><a href="#privacy" :class="[
                'transition-colors',
                themeStore?.isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'hover:text-white'
              ]">Privacy</a></li>
              <li><a href="#terms" :class="[
                'transition-colors',
                themeStore?.isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'hover:text-white'
              ]">Terms</a></li>
            </ul>
          </div>
          <div>
            <h3 :class="[
              'font-bold mb-4',
              themeStore?.isDarkMode ? 'text-gray-100' : 'text-white'
            ]">Contact</h3>
            <p :class="[
              'text-sm mb-2',
              themeStore?.isDarkMode ? 'text-gray-400' : ''
            ]">Email: info@jainthirthexplorer.com</p>
            <p :class="[
              'text-sm mb-4',
              themeStore?.isDarkMode ? 'text-gray-400' : ''
            ]">Phone: +91 XXXX-XXXX-XXXX</p>
            <div class="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener" :class="[
                'transition-colors',
                themeStore?.isDarkMode 
                  ? 'text-gray-600 hover:text-white' 
                  : 'text-gray-400 hover:text-white'
              ]">
                <Icon name="Facebook" :size="20" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener" :class="[
                'transition-colors',
                themeStore?.isDarkMode 
                  ? 'text-gray-600 hover:text-white' 
                  : 'text-gray-400 hover:text-white'
              ]">
                <Icon name="Twitter" :size="20" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener" :class="[
                'transition-colors',
                themeStore?.isDarkMode 
                  ? 'text-gray-600 hover:text-white' 
                  : 'text-gray-400 hover:text-white'
              ]">
                <Icon name="Instagram" :size="20" />
              </a>
            </div>
          </div>
        </div>
        <div :class="[
          'border-t pt-8',
          themeStore?.isDarkMode ? 'border-gray-700' : 'border-gray-800'
        ]">
          <p :class="[
            'text-center text-sm',
            themeStore?.isDarkMode ? 'text-gray-500' : 'text-gray-400'
          ]">&copy; 2024 Jain Tirth Explorer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '~/stores/theme'
import Header from '~/components/header/Header.vue'
import Icon from '~/components/common/Icon.vue'

const themeStore = useThemeStore()
</script>
