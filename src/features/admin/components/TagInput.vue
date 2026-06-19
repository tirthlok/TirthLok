<template>
  <div>
    <div class="flex gap-2 mb-2">
      <input
        v-model="inputVal"
        :placeholder="placeholder"
        @keydown.enter.prevent="add"
        class="flex-1 bg-gray-800 border border-gray-700 rounded-xl
               px-3 py-2 text-sm text-white placeholder-gray-500
               focus:outline-none focus:border-green-500 transition"
      />
      <button @click="add" type="button"
        class="px-3 py-2 bg-green-500/20 text-green-400 rounded-xl
               text-sm font-bold hover:bg-green-500/30 transition
               border border-green-500/30">
        +
      </button>
    </div>
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="(item, i) in modelValue"
        :key="i"
        class="flex items-center gap-1 px-2.5 py-1 bg-gray-800
               text-gray-300 rounded-full text-xs border border-gray-700"
      >
        {{ item }}
        <button @click="remove(i)"
          class="text-gray-500 hover:text-red-400 transition ml-0.5">
          ×
        </button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string[]
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string[]): void
}>()

const inputVal = ref('')

const add = () => {
  const val = inputVal.value.trim()
  if (!val || props.modelValue.includes(val)) return
  emit('update:modelValue', [...props.modelValue, val])
  inputVal.value = ''
}

const remove = (i: number) => {
  emit('update:modelValue', props.modelValue.filter((_, idx) => idx !== i))
}
</script>
