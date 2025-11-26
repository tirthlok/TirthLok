import { resolve } from 'path'

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
    injectPosition: 'first',
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
        path: '~/src/components',
        pathPrefix: false,
      },
    ],
  },

  // Alias server imports that should resolve to the project root `server/` folder
  alias: {
    '~/server': resolve(__dirname, 'server'),
    '~/server/': resolve(__dirname, 'server'),
    '/server': resolve(__dirname, 'server'),
  },

  // Auto-import composables and stores from `src/`
  imports: {
    autoImport: true,
    dirs: ['src/composables', 'src/stores'],
  },

  devtools: { enabled: true },
})
