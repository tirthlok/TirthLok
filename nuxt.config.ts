
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
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api/v1',
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

  devtools: { enabled: true },
})
