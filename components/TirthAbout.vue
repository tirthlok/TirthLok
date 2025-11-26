<template>
  <div class="space-y-8">
    <!-- Description Section -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div class="flex items-start gap-4">
        <Icon name="BookOpen" :size="28" class="text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Description</h3>
          <p class="text-gray-700 leading-relaxed text-lg">{{ tirth.description }}</p>
        </div>
      </div>
    </div>

    <!-- Historical Background -->
    <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border-l-4 border-amber-600 hover:shadow-lg transition-shadow">
      <div class="flex items-start gap-4">
        <Icon name="History" :size="28" class="text-amber-600 flex-shrink-0 mt-1" />
        <div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Historical Background</h3>
          <p class="text-gray-700 leading-relaxed text-lg">{{ tirth.historicalBackground }}</p>
        </div>
      </div>
    </div>

    <!-- Founding Details -->
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-l-4 border-purple-600 hover:shadow-lg transition-shadow">
      <div class="flex items-start gap-4">
        <Icon name="Landmark" :size="28" class="text-purple-600 flex-shrink-0 mt-1" />
        <div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Founding Details</h3>
          <p class="text-gray-700 leading-relaxed text-lg">{{ tirth.foundingDetails }}</p>
        </div>
      </div>
    </div>

    <!-- Architecture Section -->
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-l-4 border-green-600 hover:shadow-lg transition-shadow">
      <div class="flex items-start gap-4">
        <Icon name="Building" :size="28" class="text-green-600 flex-shrink-0 mt-1" />
        <div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Architecture</h3>
          <p class="text-gray-700 leading-relaxed text-lg">{{ tirth.architecture }}</p>
        </div>
      </div>
    </div>

    <!-- Mool Nayak (Idols) Section -->
    <div>
      <div class="flex items-center gap-3 mb-6">
        <Icon name="Gem" :size="28" class="text-yellow-600" />
        <h3 class="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Mool Nayak (Main Idols)</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="idol in tirth.moolnayak" 
          :key="idol.name"
          class="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-xl border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all transform hover:scale-105 group"
        >
          <div class="flex items-start gap-3 mb-4">
            <Icon name="Crown" :size="24" class="text-yellow-600 flex-shrink-0 group-hover:animate-bounce" />
            <h4 class="font-bold text-lg text-gray-900">{{ idol.name }}</h4>
          </div>
          
          <div class="space-y-2 ml-9 text-sm">
            <div v-if="idol.height" class="flex items-center gap-2 text-gray-700">
              <div class="w-2 h-2 bg-yellow-500 rounded-full" />
              <span><strong>Height:</strong> {{ idol.height }}</span>
            </div>
            <div v-if="idol.metal" class="flex items-center gap-2 text-gray-700">
              <div class="w-2 h-2 bg-amber-500 rounded-full" />
              <span><strong>Metal:</strong> {{ idol.metal }}</span>
            </div>
            <div v-if="idol.year" class="flex items-center gap-2 text-gray-700">
              <div class="w-2 h-2 bg-orange-500 rounded-full" />
              <span><strong>Year:</strong> {{ idol.year }}</span>
            </div>
            <div v-if="idol.details" class="pt-2 mt-3 border-t border-yellow-200">
              <p class="text-gray-600 leading-relaxed italic">{{ idol.details }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Special Facts Section -->
    <div v-if="tirth.specialFacts.length > 0">
      <div class="flex items-center gap-3 mb-6">
        <Icon name="Sparkles" :size="28" class="text-indigo-600" />
        <h3 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Special Facts</h3>
      </div>
      
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-200">
        <div class="space-y-4">
          <div v-for="(fact, index) in tirth.specialFacts" :key="index" class="flex items-start gap-4 group">
            <div class="flex-shrink-0 p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg group-hover:shadow-lg transition-all transform group-hover:scale-110">
              <Icon name="CheckCircle2" :size="20" class="text-white" />
            </div>
            <p class="text-gray-700 leading-relaxed text-lg pt-1">{{ fact }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Rules & Regulations Section -->
    <div v-if="tirth.rules && tirth.rules.length > 0">
      <div class="flex items-center gap-3 mb-6">
        <Icon name="Shield" :size="28" class="text-red-600" />
        <h3 class="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Rules & Regulations</h3>
      </div>
      
      <div class="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-2xl border-2 border-red-200">
        <ul class="space-y-3">
          <li v-for="(rule, idx) in tirth.rules" :key="idx" class="flex items-start gap-4 group">
            <div class="w-2 h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mt-2 flex-shrink-0" />
            <span class="text-gray-700 leading-relaxed text-lg group-hover:text-gray-900 transition-colors">{{ rule }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tirth } from '~/types/models'

defineProps<{
  tirth: Tirth
}>()
</script>
