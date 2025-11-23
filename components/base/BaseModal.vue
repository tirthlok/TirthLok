<template>
  <div v-if="isOpen" :class="['fixed inset-0 z-50 flex items-end sm:items-center justify-center']">
    <!-- Overlay -->
    <div
      v-if="showOverlay"
      class="fixed inset-0 bg-black transition-opacity"
      :class="isOpen ? 'bg-opacity-50' : 'bg-opacity-0'"
      @click="isOpen && close()"
    />

    <!-- Modal -->
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="translate-y-full sm:scale-95 opacity-0"
      enter-to-class="translate-y-0 sm:scale-100 opacity-100"
      leave-active-class="transition duration-200"
      leave-from-class="translate-y-0 sm:scale-100 opacity-100"
      leave-to-class="translate-y-full sm:scale-95 opacity-0"
    >
      <div v-if="isOpen" class="relative bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-md max-h-96 overflow-y-auto z-50">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
          <button
            @click="close()"
            class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="X" :size="20" class="text-gray-600" />
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-4">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="border-t border-gray-200 px-6 py-4 flex gap-2">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    showOverlay?: boolean
  }>(),
  {
    showOverlay: true,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const close = () => {
  isOpen.value = false
}

// Prevent body scroll when modal is open
watch(isOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = 'auto'
})
</script>
