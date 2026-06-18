
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
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api',
    },
  },

  routeRules: {
    // Security headers on every route
    '/**': {
      headers: {
        'X-Frame-Options':        'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy':        'strict-origin-when-cross-origin',
        'X-XSS-Protection':       '1; mode=block',
        'Permissions-Policy':     'camera=(), microphone=(), geolocation=()',
      },
    },
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
    dirs: [
      'composables',
      'stores',
      'features/auth/composables',
      'features/tirth/composables',
      'features/dharamshala/composables',
      'features/bhojanshala/composables',
      'features/wishlist/composables',
    ],
  },

  devtools: { enabled: true },

  build: {
    transpile: ['@supabase/ssr'],
  },

  vite: {}
})
