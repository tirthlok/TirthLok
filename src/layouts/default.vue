<template>
  <div :class="[
    'min-h-screen flex flex-col',
    themeStore?.isDarkMode 
      ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
      : 'bg-gradient-to-b from-white to-gray-50'
  ]">
    <!-- Header component (hidden on auth pages and admin mode) -->
    <Header v-if="!isAuthPage && !adminStore.isAdminMode" />
    <AdminBanner v-if="adminStore.isAdminMode" />
    <AdminAuthModal
      :show="adminStore.showAuthModal"
      @verified="onAdminVerified"
      @cancelled="adminStore.cancelAdminEntry()"
    />

    <!-- Main Content -->
    <main class="flex-1 mx-auto w-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer v-if="!isAuthPage" :class="[
      'text-light-gray',
      themeStore?.isDarkMode ? 'bg-gray-950' : 'bg-charcoal'
    ]">
      <div class="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-safe">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mb-10">
          <div>
            <h3 :class="[
              'font-bold text-lg mb-3',
              themeStore?.isDarkMode ? 'text-gray-100' : 'text-white'
            ]">About Tirthlok</h3>
            <p :class="[
              'text-sm leading-relaxed',
              themeStore?.isDarkMode ? 'text-gray-400' : 'text-gray-300'
            ]">Discover and explore sacred Jain Tirths with comprehensive information, nearby facilities, and interactive maps.</p>
          </div>
          <div>
            <h3 :class="[
              'font-bold mb-3',
              themeStore?.isDarkMode ? 'text-gray-100' : 'text-white'
            ]">Quick Links</h3>
            <ul class="space-y-2.5 text-sm">
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
              'font-bold mb-3',
              themeStore?.isDarkMode ? 'text-gray-100' : 'text-white'
            ]">Help</h3>
            <ul class="space-y-2.5 text-sm">
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
              'font-bold mb-3',
              themeStore?.isDarkMode ? 'text-gray-100' : 'text-white'
            ]">Contact</h3>
            <p :class="[
              'text-sm mb-3',
              themeStore?.isDarkMode ? 'text-gray-400' : ''
            ]">
              Email: 
              <a 
                href="mailto:tirthlok.contact@gmail.com" 
                :class="[
                  'hover:text-white transition-colors underline',
                  themeStore?.isDarkMode ? 'text-gray-300' : 'text-gray-200'
                ]"
              >
                tirthlok.contact@gmail.com
              </a>
            </p>
            <p :class="[
              'text-sm mb-4',
              themeStore?.isDarkMode ? 'text-gray-400' : ''
            ]">Phone: +91 XXXX-XXXX-XXXX</p>
            <div class="flex gap-4">
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
          'border-t pt-6',
          themeStore?.isDarkMode ? 'border-gray-700' : 'border-gray-800'
        ]">
          <p :class="[
            'text-center text-sm',
            themeStore?.isDarkMode ? 'text-gray-500' : 'text-gray-400'
          ]">&copy; 2026 Tirthlok. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/theme'
import { useAdminModeStore } from '~/stores/adminMode'
import { useRouter, useRoute } from 'vue-router'
import Header from '~/components/layout/header/Header.vue'
import AdminBanner from '~/features/admin/components/AdminBanner.vue'
import AdminAuthModal from '~/features/admin/components/AdminAuthModal.vue'
import Icon from '~/components/ui/Icon.vue'

const themeStore = useThemeStore()
const adminStore = useAdminModeStore()
const router = useRouter()
const route = useRoute()

const isAuthPage = computed(() => route.path.startsWith('/auth'))

const onAdminVerified = () => {
  adminStore.confirmAdminEntry()
  router.push('/admin')
}
</script>
