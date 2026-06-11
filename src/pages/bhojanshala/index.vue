<template>
  <div class="min-h-screen bg-background">

    <!-- Page Header -->
    <div class="bg-gradient-to-br from-green-950 via-green-900 to-emerald-900
                border-b border-green-800/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-3xl">🍽️</span>
          <h1 class="text-3xl font-black text-white">Bhojanshala</h1>
        </div>
        <p class="text-green-300 text-sm max-w-xl">
          Free and affordable pure Jain meals for pilgrims at sacred tirths
          across India.
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="sticky top-0 z-20 bg-background/95 backdrop-blur
                border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex flex-wrap items-center gap-3">

          <!-- Search -->
          <div class="flex-1 min-w-48 relative">
            <Icon :name="('Search' as any)" :size="16"
                  class="absolute left-3 top-1/2 -translate-y-1/2
                         text-muted-foreground"/>
            <input
              v-model="filters.search"
              placeholder="Search bhojanshalas..."
              @input="debouncedFetch"
              class="w-full bg-card border border-border rounded-xl
                     pl-9 pr-4 py-2 text-sm text-foreground
                     placeholder-muted-foreground
                     focus:outline-none focus:border-primary transition"
            />
          </div>

          <!-- Type Filter -->
          <div class="flex gap-2">
            <button
              v-for="tab in typeFilters"
              :key="tab.value"
              @click="setFilter('type', tab.value)"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-bold transition border',
                filters.type === tab.value
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-card text-muted-foreground border-border hover:border-green-500'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- State Filter -->
          <select
            v-model="filters.state"
            @change="fetchBhojanshalas"
            class="bg-card border border-border rounded-xl
                   px-4 py-2 text-sm text-foreground
                   focus:outline-none focus:border-primary transition"
          >
            <option value="">All States</option>
            <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
          </select>

        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i"
             class="bg-card rounded-2xl border border-border h-64 animate-pulse"/>
      </div>

      <!-- Empty -->
      <div v-else-if="bhojanshalas.length === 0"
           class="text-center py-20">
        <span class="text-5xl mb-4 block">🍽️</span>
        <p class="text-muted-foreground">No bhojanshalas found</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="b in bhojanshalas"
          :key="b.bhojanshala_id"
          :to="`/bhojanshala/${b.bhojanshala_id}`"
          class="group bg-card rounded-2xl border border-border
                 overflow-hidden hover:border-green-500/50
                 hover:shadow-lg hover:shadow-green-500/10
                 transition-all duration-300 cursor-pointer"
        >
          <!-- Image / Placeholder -->
          <div class="relative h-44 bg-gradient-to-br
                      from-green-900/30 to-emerald-900/30
                      overflow-hidden">
            <img
              v-if="b.bhojanshala_images?.[0]?.url"
              :src="b.bhojanshala_images[0].url"
              :alt="b.bhojanshala_name"
              class="w-full h-full object-cover
                     group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else
                 class="w-full h-full flex items-center justify-center">
              <span class="text-5xl opacity-30">🍽️</span>
            </div>

            <!-- Type Badge -->
            <div class="absolute top-3 left-3">
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-bold capitalize',
                b.bhojanshala_type === 'free'
                  ? 'bg-green-500 text-white'
                  : b.bhojanshala_type === 'donation'
                    ? 'bg-amber-500 text-white'
                    : 'bg-blue-500 text-white'
              ]">
                {{ b.bhojanshala_type === 'free' ? '🙏 Free' :
                   b.bhojanshala_type === 'donation' ? '💛 Donation' : '💰 Paid' }}
              </span>
            </div>

            <!-- Wishlist -->
            <button
              v-if="isAuthenticated"
              @click.prevent="toggleWishlist(b)"
              class="absolute top-3 right-3 w-8 h-8 rounded-full
                     bg-black/40 backdrop-blur flex items-center
                     justify-center hover:bg-black/60 transition"
            >
              <span :class="isWishlisted(b.bhojanshala_id)
                ? 'text-red-400' : 'text-white'">
                {{ isWishlisted(b.bhojanshala_id) ? '♥' : '♡' }}
              </span>
            </button>
          </div>

          <!-- Info -->
          <div class="p-4">
            <h3 class="font-bold text-foreground text-base leading-tight mb-1
                       group-hover:text-green-400 transition">
              {{ b.bhojanshala_name }}
            </h3>
            <p class="text-muted-foreground text-xs mb-3">
              📍 {{ b.bhojanshala_city }}, {{ b.bhojanshala_state }}
            </p>
            <div v-if="b.tirth?.tirth_name"
                 class="flex items-center gap-1.5 text-xs text-green-500">
              <span>🛕</span>
              <span>{{ b.tirth.tirth_name }}</span>
            </div>
            <!-- Tags -->
            <div v-if="b.tags?.length" class="flex flex-wrap gap-1.5 mt-3">
              <span
                v-for="tag in b.tags.slice(0, 3)"
                :key="tag"
                class="px-2 py-0.5 bg-green-500/10 text-green-400
                       rounded-full text-xs border border-green-500/20"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="total > limit"
           class="flex items-center justify-center gap-3 mt-10">
        <button
          :disabled="page === 1"
          @click="page--; fetchBhojanshalas()"
          class="px-4 py-2 bg-card border border-border rounded-xl
                 text-sm font-semibold disabled:opacity-30
                 hover:border-green-500 transition"
        >
          Previous
        </button>
        <span class="text-sm text-muted-foreground">
          Page {{ page }} of {{ Math.ceil(total / limit) }}
        </span>
        <button
          :disabled="page * limit >= total"
          @click="page++; fetchBhojanshalas()"
          class="px-4 py-2 bg-card border border-border rounded-xl
                 text-sm font-semibold disabled:opacity-30
                 hover:border-green-500 transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'
import { useWishlistStore } from '~/features/wishlist'
import Icon from '~/components/ui/Icon.vue'

useHead({ title: 'Bhojanshala — TirthLok' })

const { isAuthenticated } = useAuth()
const wishlistStore = useWishlistStore()

const bhojanshalas = ref<any[]>([])
const total        = ref(0)
const loading      = ref(false)
const page         = ref(1)
const limit        = 12

const filters = ref({
  search: '',
  type:   '',
  state:  '',
})

const states = [
  'Gujarat', 'Rajasthan', 'Maharashtra', 'Madhya Pradesh',
  'Uttar Pradesh', 'Uttarakhand', 'Karnataka', 'Tamil Nadu',
]

const typeFilters = [
  { value: '', label: 'All' },
  { value: 'free',     label: '🙏 Free'     },
  { value: 'donation', label: '💛 Donation' },
  { value: 'paid',     label: '💰 Paid'     },
]

const fetchBhojanshalas = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page:  String(page.value),
      limit: String(limit),
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.type   && { type:   filters.value.type   }),
      ...(filters.value.state  && { state:  filters.value.state  }),
    })
    const data = await $fetch<any>(`/api/bhojanshala?${params}`)
    bhojanshalas.value = Array.isArray(data)
      ? data
      : (data?.bhojanshalas || [])
    total.value = data?.total || bhojanshalas.value.length
  } catch (err) {
    console.error('[bhojanshala] fetch error:', err)
    bhojanshalas.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const setFilter = (key: string, value: string) => {
  (filters.value as any)[key] = value
  page.value = 1
  fetchBhojanshalas()
}

let debounceTimer: ReturnType<typeof setTimeout>
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    fetchBhojanshalas()
  }, 350)
}

const isWishlisted = (id: string) =>
  wishlistStore.wishlistItems.some(
    (w: any) => w.entity_type === 'bhojanshala' &&
                w.bhojanshala_id === id
  )

const toggleWishlist = async (b: any) => {
  if (isWishlisted(b.bhojanshala_id)) {
    await wishlistStore.removeFromWishlist(b.bhojanshala_id, 'bhojanshala')
  } else {
    await wishlistStore.addToWishlist(b.bhojanshala_id, 'bhojanshala')
  }
}

onMounted(fetchBhojanshalas)
</script>
