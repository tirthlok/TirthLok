
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  
  css: ['~/assets/css/main.css'],
  
  // Use `src/` as the application's source directory. This groups all app code under `src/`.
  srcDir: 'src/',

  ssr: true,
  
  typescript: {
    strict: true,
  },

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  runtimeConfig: {
    public: {
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN || '',
  // Use relative `/api` by default so client-side code talks to the same origin (avoids CORS during dev)
  apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api',
    },
  },

  routeRules: {
    // Cache homepage for 60 seconds
    '/': { cache: { maxAge: 60 } },
    // Cache tirth details for 1 hour
    '/tirth/**': { cache: { maxAge: 3600 } },
  },

  // Components scanning will look under `src/components`
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },

  // Auto-import composables and stores from `src/`
  imports: {
    autoImport: true,
    // directories are relative to `srcDir`
    dirs: ['composables', 'stores'],
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            // Split vendor libraries
            if (id.includes('node_modules')) {
              if (id.includes('vue')) return 'vue'
              if (id.includes('pinia')) return 'pinia'
              if (id.includes('@headlessui')) return 'headlessui'
              return 'vendors'
            }
            
            // Split each store into its own chunk to lazy load them
            if (id.includes('stores/tirth')) return 'store-tirth'
            if (id.includes('stores/dharamshala')) return 'store-dharamshala'
            if (id.includes('stores/bhojanshala')) return 'store-bhojanshala'
            if (id.includes('stores/favorites')) return 'store-favorites'
            if (id.includes('stores/theme')) return 'store-theme'
            if (id.includes('stores/user')) return 'store-user'
            if (id.includes('stores/visited')) return 'store-visited'
            
            // Split pages into separate chunks
            if (id.includes('pages/tirth')) return 'page-tirth'
            if (id.includes('pages/dharamshala')) return 'page-dharamshala'
            if (id.includes('pages/bhojanshala')) return 'page-bhojanshala'
            if (id.includes('pages/index')) return 'page-home'
            
            // Split components
            if (id.includes('components/listings')) return 'component-listings'
            if (id.includes('components/shared')) return 'component-shared'
            if (id.includes('components/common')) return 'component-common'
            if (id.includes('components/header')) return 'component-header'
            
            // Split composables
            if (id.includes('composables/ui')) return 'composable-ui'
            if (id.includes('composables/api')) return 'composable-api'
          },
        } as any,
      } as any,
    } as any,
  },

  devtools: { enabled: true },
})
