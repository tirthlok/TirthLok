export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  
  css: ['~/assets/css/main.css'],
  
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
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    },
  },

  routeRules: {
    // Cache homepage for 60 seconds
    '/': { cache: { maxAge: 60 } },
    // Cache tirth details for 1 hour
    '/tirth/**': { cache: { maxAge: 3600 } },
  },

  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },

  imports: {
    autoImport: true,
    dirs: ['composables', 'stores'],
  },

  devtools: { enabled: true },
})
