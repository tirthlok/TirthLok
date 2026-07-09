<template>
  <div v-if="pending" class="min-h-screen bg-background animate-pulse">
    <!-- Hero Skeleton -->
    <div class="bg-green-950/10 border-b border-green-900/10 relative">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 mb-6">
          <div class="h-3 w-12 bg-green-900/20 rounded"></div>
          <div class="w-2 h-2 bg-green-900/20 rounded-full"></div>
          <div class="h-3 w-24 bg-green-900/20 rounded"></div>
          <div class="w-2 h-2 bg-green-900/20 rounded-full"></div>
          <div class="h-3 w-32 bg-green-900/20 rounded"></div>
        </div>
        
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div class="w-full max-w-lg space-y-4">
             <div class="h-6 w-24 bg-green-900/20 rounded-full"></div>
             <div class="h-10 w-3/4 bg-green-900/20 rounded-lg"></div>
             <div class="h-5 w-1/2 bg-green-900/20 rounded"></div>
             <div class="h-5 w-1/3 bg-green-900/20 rounded mt-2"></div>
          </div>
          <div class="flex items-center gap-3">
             <div class="h-10 w-24 bg-green-900/20 rounded-xl"></div>
             <div class="h-10 w-24 bg-green-900/20 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Body Skeleton -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left: Main Content Skeleton -->
        <div class="lg:col-span-2 space-y-6">
          <div v-for="n in 3" :key="n" class="bg-card rounded-2xl border border-border p-6 space-y-4">
             <div class="h-6 w-32 bg-muted rounded-lg mb-4"></div>
             <div class="h-4 w-full bg-muted rounded"></div>
             <div class="h-4 w-11/12 bg-muted rounded"></div>
             <div class="h-4 w-full bg-muted rounded"></div>
             <div class="h-4 w-4/5 bg-muted rounded"></div>
          </div>
        </div>

        <!-- Right: Sidebar Skeleton -->
        <div class="space-y-5">
           <div v-for="n in 2" :key="n" class="bg-card rounded-2xl border border-border p-5 space-y-4">
              <div class="h-6 w-24 bg-muted rounded-lg mb-4"></div>
              <div class="space-y-3">
                 <div class="flex justify-between items-center"><div class="h-4 w-16 bg-muted rounded"></div><div class="h-4 w-20 bg-muted rounded"></div></div>
                 <div class="flex justify-between items-center"><div class="h-4 w-16 bg-muted rounded"></div><div class="h-4 w-24 bg-muted rounded"></div></div>
                 <div class="flex justify-between items-center"><div class="h-4 w-20 bg-muted rounded"></div><div class="h-4 w-16 bg-muted rounded"></div></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="!data"
       class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <span class="text-5xl mb-4 block">🍽️</span>
      <p class="text-muted-foreground">Bhojanshala not found</p>
      <NuxtLink to="/bhojanshala"
        class="mt-4 inline-block text-green-500 hover:text-green-400">
        ← Back to Bhojanshalas
      </NuxtLink>
    </div>
  </div>

  <div v-else class="min-h-screen bg-background">

    <!-- Hero -->
    <div class="bg-gradient-to-br from-green-950 via-green-900/80
                to-background relative">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-xs text-green-400/60 mb-6">
          <NuxtLink to="/" class="hover:text-green-400 transition">Home</NuxtLink>
          <span>›</span>
          <NuxtLink to="/bhojanshala"
            class="hover:text-green-400 transition">
            Bhojanshala
          </NuxtLink>
          <span>›</span>
          <span class="text-green-300">{{ data.bhojanshala_name }}</span>
        </nav>

        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <!-- Type Badge -->
            <span :class="[
              'inline-block px-3 py-1 rounded-full text-xs font-bold mb-3',
              data.bhojanshala_type === 'free'
                ? 'bg-green-500 text-white'
                : data.bhojanshala_type === 'donation'
                  ? 'bg-amber-500 text-white'
                  : 'bg-blue-500 text-white'
            ]">
              {{ data.bhojanshala_type === 'free' ? '🙏 Free Meals' :
                 data.bhojanshala_type === 'donation' ? '💛 Donation Based' :
                 '💰 Paid Meals' }}
            </span>

            <h1 class="text-3xl font-black text-white mb-2">
              {{ data.bhojanshala_name }}
            </h1>
            <p class="text-green-300 flex items-center gap-2">
              <span>📍</span>
              {{ data.bhojanshala_city }}, {{ data.bhojanshala_state }}
            </p>
            <div v-if="data.tirth?.tirth_name"
                 class="flex items-center gap-2 mt-2 text-green-400 text-sm">
              <span>🛕</span>
              <NuxtLink :to="`/tirth/${data.tirth_id}`"
                class="hover:text-green-300 transition underline underline-offset-2">
                {{ data.tirth.tirth_name }}
              </NuxtLink>
            </div>
          </div>

          <!-- Wishlist + Contact -->
          <div class="flex items-center gap-3">
            <button
              v-if="isAuthenticated"
              @click="toggleWishlist"
              :class="[
                'flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition border',
                wishlisted
                  ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              ]"
            >
              {{ wishlisted ? '♥ Saved' : '♡ Save' }}
            </button>
            <a
              v-if="data.bhojanshala_phone"
              :href="`tel:${data.bhojanshala_phone}`"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl
                     bg-green-600 text-white font-semibold text-sm
                     hover:bg-green-500 transition"
            >
              📞 Call
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Left: Main Content -->
        <div class="lg:col-span-2 space-y-6">

          <!-- About -->
          <div v-if="data.details?.about"
               class="bg-card rounded-2xl border border-border p-6">
            <h2 class="font-bold text-foreground text-lg mb-4">About</h2>
            <p class="text-muted-foreground text-sm leading-relaxed">
              {{ data.details.about }}
            </p>
          </div>

          <!-- Meal Timings -->
          <div v-if="data.details?.meal_timings?.length"
               class="bg-card rounded-2xl border border-border p-6">
            <h2 class="font-bold text-foreground text-lg mb-4">
              🕐 Meal Timings
            </h2>
            <div class="space-y-3">
              <div
                v-for="meal in data.details.meal_timings"
                :key="meal.meal_type"
                class="flex items-center justify-between p-3
                       bg-green-500/5 rounded-xl border border-green-500/20"
              >
                <div>
                  <p class="font-semibold text-foreground capitalize text-sm">
                    {{ meal.meal_type }}
                  </p>
                  <p v-if="meal.description"
                     class="text-muted-foreground text-xs mt-0.5">
                    {{ meal.description }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-green-400 text-sm">
                    {{ meal.start_time }} – {{ meal.end_time }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Dietary Information -->
          <div v-if="data.details?.dietary_info"
               class="bg-card rounded-2xl border border-border p-6">
            <h2 class="font-bold text-foreground text-lg mb-3">
              🌱 Dietary Information
            </h2>
            <div class="p-4 bg-green-500/5 rounded-xl border border-green-500/20">
              <p class="text-sm text-green-300 leading-relaxed">
                {{ data.details.dietary_info }}
              </p>
            </div>
          </div>

          <!-- Facilities -->
          <div v-if="data.details?.facilities?.length"
               class="bg-card rounded-2xl border border-border p-6">
            <h2 class="font-bold text-foreground text-lg mb-4">
              ✨ Facilities
            </h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="f in data.details.facilities"
                :key="f"
                class="px-3 py-1.5 bg-card border border-border
                       rounded-xl text-sm text-foreground"
              >
                {{ f }}
              </span>
            </div>
          </div>

          <!-- Rules -->
          <div v-if="data.details?.rules?.length"
               class="bg-card rounded-2xl border border-border p-6">
            <h2 class="font-bold text-foreground text-lg mb-4">
              📋 Rules & Guidelines
            </h2>
            <ul class="space-y-2">
              <li
                v-for="rule in data.details.rules"
                :key="rule"
                class="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span class="text-amber-400 mt-0.5 flex-shrink-0">•</span>
                {{ rule }}
              </li>
            </ul>
          </div>

          <!-- Special Services -->
          <div v-if="data.details?.special_services?.length"
               class="bg-card rounded-2xl border border-border p-6">
            <h2 class="font-bold text-foreground text-lg mb-4">
              ⭐ Special Services
            </h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="s in data.details.special_services"
                :key="s"
                class="px-3 py-1.5 bg-amber-500/10 text-amber-400
                       border border-amber-500/20 rounded-xl text-sm"
              >
                {{ s }}
              </span>
            </div>
          </div>

        </div>

        <!-- Right: Sidebar -->
        <div class="space-y-5">

          <!-- Quick Info -->
          <div class="bg-card rounded-2xl border border-border p-5">
            <h3 class="font-bold text-foreground mb-4">Quick Info</h3>
            <div class="space-y-3 text-sm">
              <div v-if="data.details?.seating_capacity"
                   class="flex items-center justify-between">
                <span class="text-muted-foreground">Capacity</span>
                <span class="font-semibold text-foreground">
                  {{ data.details.seating_capacity }} persons
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Meal Type</span>
                <span class="font-semibold text-foreground capitalize">
                  {{ data.bhojanshala_type }}
                </span>
              </div>
              <div v-if="data.details?.payment_info"
                   class="pt-2 border-t border-border">
                <p class="text-muted-foreground text-xs mb-1">Payment</p>
                <p class="text-foreground text-xs leading-relaxed">
                  {{ data.details.payment_info }}
                </p>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="bg-card rounded-2xl border border-border p-5">
            <h3 class="font-bold text-foreground mb-4">Contact</h3>
            <div class="space-y-3">
              <div v-if="data.details?.manager_name" class="text-sm">
                <p class="text-muted-foreground text-xs mb-0.5">Manager</p>
                <p class="font-semibold text-foreground">
                  {{ data.details.manager_name }}
                </p>
              </div>
              <a v-if="data.bhojanshala_phone"
                 :href="`tel:${data.bhojanshala_phone}`"
                 class="flex items-center gap-2 text-sm text-green-400
                        hover:text-green-300 transition">
                📞 {{ data.bhojanshala_phone }}
              </a>
              <a v-if="data.bhojanshala_email"
                 :href="`mailto:${data.bhojanshala_email}`"
                 class="flex items-center gap-2 text-sm text-green-400
                        hover:text-green-300 transition">
                ✉️ {{ data.bhojanshala_email }}
              </a>
              <div v-if="data.bhojanshala_address"
                   class="text-xs text-muted-foreground leading-relaxed
                          border-t border-border pt-3">
                📍 {{ data.bhojanshala_address }}
              </div>
            </div>
          </div>

          <!-- Languages -->
          <div v-if="data.details?.languages_spoken?.length"
               class="bg-card rounded-2xl border border-border p-5">
            <h3 class="font-bold text-foreground mb-3">Languages</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="lang in data.details.languages_spoken"
                :key="lang"
                class="px-2.5 py-1 bg-card border border-border
                       rounded-lg text-xs text-foreground"
              >
                {{ lang }}
              </span>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="data.tags?.length"
               class="bg-card rounded-2xl border border-border p-5">
            <h3 class="font-bold text-foreground mb-3">Tags</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in data.tags"
                :key="tag"
                class="px-2.5 py-1 bg-green-500/10 text-green-400
                       border border-green-500/20 rounded-lg text-xs"
              >
                {{ tag }}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/features/auth/composables/useAuth'
import { useWishlistStore } from '~/features/wishlist'

const route = useRoute()
const { isAuthenticated } = useAuth()
const wishlistStore = useWishlistStore()

const { data, pending } = await useFetch<any>(
  `/api/bhojanshala/${route.params.id}`
)

useHead(() => ({
  title: data.value
    ? `${data.value.bhojanshala_name} — TirthLok`
    : 'Bhojanshala — TirthLok'
}))

const wishlisted = computed(() =>
  wishlistStore.wishlistItems.some(
    (w: any) => w.entity_type === 'bhojanshala' &&
                w.bhojanshala_id === data.value?.bhojanshala_id
  )
)

const toggleWishlist = async () => {
  if (!data.value) return
  if (wishlisted.value) {
    await wishlistStore.removeFromWishlist(
      data.value.bhojanshala_id, 'bhojanshala'
    )
  } else {
    await wishlistStore.addToWishlist(
      data.value.bhojanshala_id, 'bhojanshala'
    )
  }
}
</script>
