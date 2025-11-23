# Quick Reference Guide

## 🚀 Start the Application

```bash
npm install      # First time only
npm run dev      # Visit http://localhost:3000
```

## 📂 File Locations

### Add New Temple Information
**File**: `server/utils/sampleData.ts`

### Add New Page
**Create**: `pages/your-page.vue`

### Add New Component
**Create**: `components/YourComponent.vue`

### Add New Store
**Create**: `stores/yourStore.ts`

### Add API Endpoint
**Create**: `server/api/your-endpoint.ts`

## 🎨 Styling Classes

All components use Tailwind CSS. Common patterns:

```vue
<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Card with shadow -->
<div class="bg-white rounded-lg shadow-md p-6">

<!-- Button -->
<button class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">

<!-- Flex centering -->
<div class="flex items-center justify-center">

<!-- Responsive text -->
<h1 class="text-2xl md:text-4xl lg:text-5xl">
```

## 🏗️ Component Template

```vue
<template>
  <div class="container">
    <!-- Template code -->
  </div>
</template>

<script setup lang="ts">
// TypeScript code
import type { DataType } from '~/types/models'

const myData = ref<DataType>()
</script>

<style scoped>
/* Component styles */
</style>
```

## 📦 Common Imports

```typescript
// Vue utilities
import { ref, computed, reactive, watch } from 'vue'

// Nuxt utilities
import { useRouter, useRoute } from '#app'
import { useAsyncData, useFetch } from '#app'

// Pinia stores
import { useTirthStore } from '~/stores/tirth'
import { useUserStore } from '~/stores/user'

// Types
import type { Tirth, User, Facility } from '~/types/models'
```

## 🔄 State Management (Pinia)

### Using Tirth Store
```typescript
const tithStore = useTirthStore()

// Access state
console.log(tithStore.tirths)

// Call actions
await tithStore.fetchTirths()
tithStore.filterTirths({ state: 'Gujarat' })

// Use getters
const count = tithStore.getTirthsByState('Gujarat')
```

### Using User Store
```typescript
const userStore = useUserStore()

// Add favorite
await userStore.addFavorite('temple-id')

// Check if favorite
const isFav = userStore.isFavorite('temple-id')

// Get all favorites
const favs = userStore.getFavorites
```

## 🔗 Routing

### Navigate Programmatically
```typescript
const router = useRouter()
router.push('/tirth/1')
router.back()
```

### Navigate in Template
```vue
<NuxtLink to="/">Home</NuxtLink>
<NuxtLink to="/tirth/1">Temple Details</NuxtLink>
```

## 🎯 Available Pages

| URL | Purpose |
|-----|---------|
| `/` | Home page with search/filter |
| `/tirth/:id` | Temple details |
| `/favorites` | Saved temples |
| `/admin` | Admin dashboard |

## 📡 API Endpoints

```javascript
// Get all temples
GET /api/tirths
// Response: Tirth[]

// Get single temple
GET /api/tirths/:id
// Response: Tirth

// (Add new endpoints as needed)
```

## 🎯 Modify Sample Data

Edit `server/utils/sampleData.ts`:

```typescript
export const sampleTirths = [
  {
    id: '1',
    name: 'Temple Name',
    description: '...',
    location: {
      latitude: 22.128,
      longitude: 71.828,
      address: 'City, State',
      city: 'City',
      state: 'State'
    },
    // ... other fields
  }
]
```

## 🛠️ Customize Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  colors: {
    primary: '#your-color',
  }
}
```

Then in templates:
```html
<button class="bg-primary hover:bg-primary/80">
```

## 🔐 Environment Variables

Create `.env.local`:

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
NUXT_PUBLIC_MAPBOX_TOKEN=your_token
```

Access in code:
```typescript
const config = useRuntimeConfig()
const apiUrl = config.public.apiBaseUrl
```

## 🧪 Common Tasks

### Add Loading State
```vue
<template>
  <div v-if="loading">Loading...</div>
  <div v-else>Content</div>
</template>

<script setup>
const loading = ref(false)
const fetchData = async () => {
  loading.value = true
  try {
    // fetch data
  } finally {
    loading.value = false
  }
}
</script>
```

### Add Form Validation
```typescript
const form = reactive({
  name: '',
  email: ''
})

const errors = reactive({
  name: '',
  email: ''
})

const validate = () => {
  errors.name = form.name ? '' : 'Name required'
  errors.email = form.email ? '' : 'Email required'
  return !errors.name && !errors.email
}
```

### Add Computed Property
```typescript
const items = ref([])

const itemCount = computed(() => items.value.length)

const filteredItems = computed(() => {
  return items.value.filter(i => i.active)
})
```

### Add Watcher
```typescript
const searchTerm = ref('')

watch(searchTerm, (newVal) => {
  console.log('Search:', newVal)
  performSearch(newVal)
})
```

## 🎨 Component Communication

### Parent → Child (Props)
```vue
<!-- Parent -->
<ChildComponent :title="'Hello'" :data="myData" />

<!-- Child -->
<script setup>
defineProps<{
  title: string
  data: any
}>()
</script>
```

### Child → Parent (Emits)
```vue
<!-- Child -->
<button @click="$emit('clicked', data)">Click</button>

<!-- Parent -->
<ChildComponent @clicked="handleClick" />
```

## 🚀 Build & Deploy

```bash
npm run build     # Build for production
npm run preview   # Test production build
npm run generate  # Generate static site

# Deploy with Vercel
npm i -g vercel
vercel --prod
```

## 🐛 Debugging

### Check Browser Console
```javascript
// View errors
console.error('Error:', error)

// Log data
console.log('Data:', data)
```

### View Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Check API calls and responses

### View Component State
1. Install Vue DevTools extension
2. Inspect component in DevTools
3. View props, data, computed, watchers

## 📚 Useful Links

- [Nuxt Docs](https://nuxt.com)
- [Vue Docs](https://vuejs.org)
- [Tailwind](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

## ❓ Common Issues

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Module not found
```bash
rm -rf node_modules
npm install
```

### Styles not applying
```bash
rm -rf .nuxt
npm run dev
```

### TypeScript errors
Check `tsconfig.json` paths configuration

---

**Need help?** Check the full documentation:
- README.md
- SETUP_GUIDE.md
- DATABASE_SCHEMA.md
- DEPLOYMENT.md
