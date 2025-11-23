# Quick Start: Using Refactored Components

## 🚀 Getting Started

### 1. Import Components
```vue
<script setup>
// Option A: Direct import
import BaseButton from '~/components/base/BaseButton.vue'
import BaseCard from '~/components/base/BaseCard.vue'

// Option B: Barrel import (recommended)
import { BaseButton, BaseCard, BaseModal, BaseBadge } from '~/components/base'

// Import composables
import { useFilter } from '~/composables/useFilter'
import { useTabNavigation } from '~/composables/useTabNavigation'
</script>
```

---

## 📦 Component Quick Reference

### BaseButton
```vue
<!-- Variants: primary (red), secondary (gray), ghost (transparent) -->
<!-- Sizes: sm, md, lg -->

<BaseButton variant="primary" size="md">Click me</BaseButton>
<BaseButton variant="secondary" size="sm">Cancel</BaseButton>
<BaseButton variant="ghost" size="lg" :disabled="false">Disabled</BaseButton>

<!-- With icon -->
<BaseButton variant="primary" size="md">
  <Icon name="Heart" :size="16" />
  Like
</BaseButton>
```

### BaseBadge
```vue
<!-- Variants: primary, secondary, success, warning, danger -->

<BaseBadge variant="primary">Shwetambar</BaseBadge>
<BaseBadge variant="success">Active</BaseBadge>
<BaseBadge variant="danger">Danger</BaseBadge>
```

### BaseCard
```vue
<BaseCard
  image="url-to-image"
  title="Card Title"
  subtitle="Subtitle"
  badge="Badge Text"
  :rating="4.5"
  :reviews="128"
  :is-favorite="true"
  @favorite="handleFavorite"
  :meta-info="[
    { label: 'Founded', value: '1000 AD' },
    { label: 'Type', value: 'Temple' },
    { label: 'Facilities', value: '5' }
  ]"
>
  <template #actions>
    <button @click="viewDetails">View Details</button>
    <button @click="share">Share</button>
  </template>
</BaseCard>
```

### BaseModal
```vue
<button @click="isOpen = true">Open Modal</button>

<BaseModal v-model="isOpen" title="Modal Title" :show-overlay="true">
  <!-- Content goes here -->
  <p>Modal content</p>
  
  <template #footer>
    <BaseButton variant="secondary" @click="isOpen = false">Cancel</BaseButton>
    <BaseButton variant="primary" @click="confirm">OK</BaseButton>
  </template>
</BaseModal>

<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
</script>
```

---

## 🎣 Composable Quick Reference

### useFilter
```vue
<script setup>
import { useFilter } from '~/composables/useFilter'

const items = [
  { id: 1, name: 'Palitana', state: 'Gujarat', sect: 'Shwetambar' },
  { id: 2, name: 'Ranakpur', state: 'Rajasthan', sect: 'Digambar' },
]

const { filters, filteredItems, setFilter, resetFilters } = useFilter(
  items,
  ['state', 'sect'] // keys to filter by
)
</script>

<template>
  <!-- Filter controls -->
  <button @click="setFilter('state', 'Gujarat')">Gujarat</button>
  <button @click="setFilter('sect', 'Shwetambar')">Shwetambar</button>
  <button @click="resetFilters">Reset All</button>
  
  <!-- Display filtered results -->
  <div v-for="item in filteredItems" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

### useSearch
```vue
<script setup>
import { useSearch } from '~/composables/useSearch'

const items = [
  { id: 1, name: 'Palitana', city: 'Bhavnagar' },
  { id: 2, name: 'Ranakpur', city: 'Pali' },
]

const { searchQuery, searchResults, setSearchQuery, clearSearch } = useSearch(
  items,
  ['name', 'city'] // fields to search
)
</script>

<template>
  <input 
    v-model="searchQuery" 
    @input="setSearchQuery"
    placeholder="Search..."
  />
  
  <div v-for="result in searchResults" :key="result.id">
    {{ result.name }}
  </div>
  
  <button @click="clearSearch">Clear</button>
</template>
```

### useTabNavigation
```vue
<script setup>
import { useTabNavigation } from '~/composables/useTabNavigation'

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'festivals', label: 'Festivals' }
]

const { activeTab, activeTabLabel, setActiveTab } = useTabNavigation(tabs)
</script>

<template>
  <!-- Tab buttons -->
  <div class="flex gap-2 border-b">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="setActiveTab(tab.id)"
      :class="{ 'border-b-2 border-red-500': activeTab === tab.id }"
    >
      {{ tab.label }}
    </button>
  </div>
  
  <!-- Tab content -->
  <div v-show="activeTab === 'about'">About content</div>
  <div v-show="activeTab === 'facilities'">Facilities content</div>
  <div v-show="activeTab === 'festivals'">Festivals content</div>
</template>
```

### usePagination
```vue
<script setup>
import { usePagination } from '~/composables/usePagination'

const allItems = ref([...]) // 100+ items

const { 
  currentPage, 
  totalPages, 
  paginatedItems, 
  goToPage, 
  nextPage, 
  prevPage 
} = usePagination(allItems, 12) // 12 items per page
</script>

<template>
  <!-- Display paginated items -->
  <div v-for="item in paginatedItems" :key="item.id">
    {{ item.name }}
  </div>
  
  <!-- Pagination controls -->
  <div class="flex gap-2">
    <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
  </div>
</template>
```

---

## 🎨 Design System Colors

### Primary Colors
- Red: `#FF0000` - Main action color, primary buttons
- White: `#FFFFFF` - Backgrounds, card backgrounds
- Gray: `#111827` - Text, dark elements

### Gray Shades
- Gray-50: `#F9FAFB` - Lightest backgrounds
- Gray-100: `#F3F4F6` - Light gray backgrounds
- Gray-200: `#E5E7EB` - Borders, dividers
- Gray-600: `#4B5563` - Secondary text
- Gray-900: `#111827` - Primary text

### Usage in Components
```vue
<!-- Red primary actions -->
<BaseButton variant="primary">Action</BaseButton>

<!-- Gray secondary actions -->
<BaseButton variant="secondary">Cancel</BaseButton>

<!-- Gray backgrounds -->
<div class="bg-gray-50 p-4">Content</div>

<!-- Red borders -->
<div class="border-b-2 border-red-500">Underline</div>
```

---

## 💡 Common Patterns

### Favorite Toggle with BaseCard
```vue
<template>
  <BaseCard
    :is-favorite="userStore.isFavorite(tirth.id)"
    @favorite="toggleFavorite"
  />
</template>

<script setup>
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const toggleFavorite = async () => {
  if (userStore.isFavorite(tirth.id)) {
    await userStore.removeFavorite(tirth.id)
  } else {
    await userStore.addFavorite(tirth.id)
  }
}
</script>
```

### Filter List with useFilter
```vue
<template>
  <div>
    <!-- Filter tabs -->
    <BaseButton
      v-for="type in types"
      :key="type"
      :variant="filters.type === type ? 'primary' : 'secondary'"
      @click="setFilter('type', type)"
    >
      {{ type }}
    </BaseButton>
    
    <!-- Filtered list -->
    <div v-for="item in filteredItems" :key="item.id">
      <TirthCard :tirth="item" />
    </div>
  </div>
</template>

<script setup>
import { useFilter } from '~/composables/useFilter'

const { filters, filteredItems, setFilter } = useFilter(
  tirthList,
  ['type']
)

const types = [...new Set(tirthList.map(t => t.type))]
</script>
```

### Tabbed Interface with useTabNavigation
```vue
<template>
  <div>
    <!-- Tab navigation -->
    <div class="flex gap-2 border-b">
      <BaseButton
        v-for="tab in tabs"
        :key="tab.id"
        :variant="activeTab === tab.id ? 'primary' : 'secondary'"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
      </BaseButton>
    </div>
    
    <!-- Tab content -->
    <TirthAbout v-if="activeTab === 'about'" :tirth="tirth" />
    <TirthFacilities v-if="activeTab === 'facilities'" :tirth="tirth" />
    <TirthFestivals v-if="activeTab === 'festivals'" :tirth="tirth" />
  </div>
</template>

<script setup>
import { useTabNavigation } from '~/composables/useTabNavigation'

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'festivals', label: 'Festivals' }
]

const { activeTab, setActiveTab } = useTabNavigation(tabs)
</script>
```

---

## 🧪 Testing Tips

### Test BaseButton Click
```vue
<template>
  <BaseButton @click="count++">Count: {{ count }}</BaseButton>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
```

### Test useFilter
- Set filter
- Verify filteredItems updates
- Reset and verify all items return
- Try multiple filters at once

### Test useTabNavigation
- Click tabs
- Verify activeTab changes
- Verify activeTabLabel reflects current

### Test BaseModal
- Open/close with button
- Verify overlay appears
- Verify scroll is locked when open
- Test escape key to close

---

## 📚 Component Props Reference

### BaseButton Props
| Prop | Type | Default | Values |
|------|------|---------|--------|
| variant | string | 'primary' | 'primary', 'secondary', 'ghost' |
| size | string | 'md' | 'sm', 'md', 'lg' |
| type | string | 'button' | 'button', 'submit', 'reset' |
| disabled | boolean | false | true, false |
| icon | boolean | false | true, false |
| iconSize | number | 20 | any number |

### BaseCard Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| image | string | '' | Image URL |
| title | string | '' | Card title |
| subtitle | string | '' | Card subtitle |
| badge | string | '' | Badge text |
| rating | number | 0 | Star rating 0-5 |
| reviews | number | 0 | Review count |
| isFavorite | boolean | false | Favorite state |
| showFavorite | boolean | true | Show favorite button |
| metaInfo | array | [] | Info grid items |

### BaseModal Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | boolean | false | Open state (v-model) |
| title | string | '' | Modal title |
| showOverlay | boolean | true | Show overlay |

---

## ⚡ Performance Tips

1. **Use v-for keys** - Always provide key prop when looping
2. **Lazy load images** - Use native loading="lazy" or similar
3. **Debounce search** - Wrap setSearchQuery in debounce for large lists
4. **Virtual scrolling** - For 1000+ items, consider virtual scrolling
5. **Memoize filters** - Use computed() for filter results to avoid recalculation

---

## 🐛 Troubleshooting

### Modal not showing
- Check v-model binding is correct
- Verify showOverlay prop if overlay needed
- Check z-index of overlays

### Filter not working
- Verify filter keys match your data object keys
- Check that items array is passed
- Use console.log to debug filters object

### Tab navigation showing all content
- Use v-show instead of v-if for tab content
- Verify activeTab id matches tab id
- Check template conditions

### Button styling not applying
- Verify variant prop value (primary/secondary/ghost)
- Check parent class isn't overriding
- Inspect computed classes in browser DevTools

---

## 📞 Support

For issues or questions:
1. Check existing refactoring documentation
2. Review component prop definitions
3. Test in isolation first
4. Check browser console for warnings
5. Review similar working examples

---

**Last Updated**: 2024
**Status**: Production Ready ✅
**All Tests Passing**: ✅
