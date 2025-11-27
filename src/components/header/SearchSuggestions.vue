<template>
  <teleport to="body">
    <div v-if="visible" ref="root" :style="containerStyle" class="z-50">
      <ul role="listbox" class="bg-white rounded-xl shadow-2xl border border-gray-100 max-h-80 overflow-auto">
        <li
          v-for="(item, idx) in matched"
          :key="item"
          :id="optionId(idx)"
          role="option"
          @mousedown.prevent="select(item)"
          @mousemove="activeIndex = idx"
          :class="['px-4 py-3 cursor-pointer flex items-center gap-3', activeIndex===idx ? 'bg-gray-50' : '']"
        >
          <span v-html="highlight(item)" class="text-sm font-medium text-gray-900"></span>
        </li>
        <li v-if="matched.length === 0" class="px-4 py-3 text-sm text-gray-500">No results</li>
      </ul>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  items: { type: Array as () => string[], required: true },
  query: { type: String, required: true },
  minChars: { type: Number, default: 1 },
  maxResults: { type: Number, default: 6 },
  matchMode: { type: String as () => 'startsWith' | 'contains', default: 'startsWith' },
  visible: { type: Boolean, default: true },
  // Anchor element (pass a template ref from the input wrapper)
  anchor: { type: Object as () => HTMLElement | null, default: null },
})
const emit = defineEmits(['select', 'close'])

const activeIndex = ref(-1)
const root = ref<HTMLElement | null>(null)
const containerStyle = ref<Record<string, string>>({ position: 'absolute', left: '0px', top: '0px', width: '300px' })

const matched = computed(() => {
  const q = props.query?.trim().toLowerCase()
  if (!q || q.length < props.minChars) return []
  const filtered = props.items.filter((i) => {
    const s = i.toLowerCase()
    return props.matchMode === 'startsWith' ? s.startsWith(q) : s.includes(q)
  })
  return filtered.slice(0, props.maxResults)
})

function onKey(e: KeyboardEvent) {
  if (!matched.value.length) return
  if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex.value = Math.min(activeIndex.value + 1, matched.value.length - 1) }
  if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex.value = Math.max(activeIndex.value - 1, 0) }
  if (e.key === 'Enter') { e.preventDefault(); if (activeIndex.value >= 0) select(matched.value[activeIndex.value]) }
  if (e.key === 'Escape') { emit('close'); activeIndex.value = -1 }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

// Positioning: compute based on anchor bounding rect
function updatePosition() {
  const aProp = (props as any).anchor
  const a = aProp?.value ?? aProp
  if (!a || !root.value) return
  const rect = (a as HTMLElement).getBoundingClientRect()
  const left = `${Math.max(8, rect.left)}px`
  const top = `${rect.bottom + window.scrollY + 8}px`
  const width = `${rect.width}px`
  containerStyle.value = {
    position: 'absolute',
    left,
    top,
    width,
  }
}

let rafId: number | null = null
function scheduleUpdate() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => { updatePosition(); rafId = null })
}

onMounted(() => {
  window.addEventListener('resize', scheduleUpdate)
  window.addEventListener('scroll', scheduleUpdate, true)
  scheduleUpdate()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', scheduleUpdate)
  window.removeEventListener('scroll', scheduleUpdate, true)
  if (rafId) cancelAnimationFrame(rafId)
})

// Recompute when anchor, query, visible change
import { watch } from 'vue'
watch(() => (props as any).anchor, scheduleUpdate)
watch(() => props.visible, (v) => { if (v) scheduleUpdate() })

function select(item: string) {
  emit('select', item)
  // also notify parent to close the dropdown
  emit('close')
  activeIndex.value = -1
}

function optionId(i: number) { return `search-suggestion-${i}` }

function highlight(text: string) {
  const q = props.query?.trim()
  if (!q) return escapeHtml(text)
  if (props.matchMode === 'startsWith') {
    const len = q.length
    return `<strong class="font-semibold">${escapeHtml(text.slice(0, len))}</strong>${escapeHtml(text.slice(len))}`
  } else {
    const idx = text.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return escapeHtml(text)
    return `${escapeHtml(text.slice(0, idx))}<strong class="font-semibold">${escapeHtml(text.slice(idx, idx+q.length))}</strong>${escapeHtml(text.slice(idx+q.length))}`
  }
}

function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]!))
}
</script>

<style scoped>
/* small visual polish if needed */
</style>
