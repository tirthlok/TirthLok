# Tirth Explorer - Modularization & Restructuring Plan

## Overview
This document provides a comprehensive step-by-step plan to modularize your Nuxt 3 application, identify reusable components, and organize code in a proper folder structure following Vue 3 & Nuxt 3 best practices.

---

## Phase 1: Analysis & Planning (Current State)

### 🔍 Current Structure Issues

**Components:**
- `TirthCard.vue`, `DharamshalCard.vue`, `BhojanshalaCard.vue` are 90% identical with different color themes
- Duplicated carousel logic, wishlist toggles, and navigation logic
- Duplicated interfaces (DharamshalItem, BhojanshalaItem should be unified)

**Pages:**
- Hardcoded routes like `girnar.vue`, `palitana.vue`, `ranakpur.vue`, `shikharji.vue` are single-tirth detail pages
- Should be replaced with dynamic routing: `pages/[id].vue` or `pages/tirth/[id].vue`
- Duplicate detail page structures: `bhojanshala-detail/` and `dharamshala-detail/`

**Data & State:**
- API logic scattered between stores and composables
- `useApi.ts` composable exists but may not be fully utilized
- Sample data in `sampleData.ts` mixes different entity types

**Composables:**
- Good separation of concerns (api, ui modules)
- Could benefit from more granular utilities

**Stores:**
- Pinia stores are well-organized but could have separate stores for bhojanshala and dharamshala

---

## Phase 2: Generic Components Identification

### 📦 Reusable Components to Create

#### 1. **BaseCard.vue** (Generic Card Component)
**Purpose:** Replace TirthCard, DharamshalCard, BhojanshalaCard
**Props:**
- `item` (object with standardized structure)
- `cardType` (enum: 'tirth' | 'dharamshala' | 'bhojanshala')
- `colorScheme` (object with color classes)
- `displayFields` (array of field names to display)
- `actionButtons` (array of buttons to show)

**Benefits:**
- Single source of truth for card rendering
- Reduced code duplication (currently ~400 lines duplicated 3x)
- Easy to add new entity types

#### 2. **ImageCarousel.vue** (Generic Carousel)
**Purpose:** Replace duplicated image carousel logic
**Props:**
- `images` (array of strings)
- `title` (string for alt text)
- `accentColor` (for dot indicators)

**Benefits:**
- Reusable in card, detail pages, galleries
- Single carousel logic maintenance point

#### 3. **HeaderWithImage.vue** (Detail Page Header)
**Purpose:** Used in TirthHeader, detail pages
**Props:**
- `title` (string)
- `subtitle` (string)
- `images` (array)
- `metadata` (object with location, rating, etc.)
- `actionSlots` (for wishlist button, share, etc.)

#### 4. **FacilityGrid.vue** (Generic Grid Display)
**Purpose:** Display facilities, features, cuisines in grid layout
**Props:**
- `items` (array of items)
- `columns` (responsive grid)
- `itemTemplate` (component or render function)

#### 5. **InfoSection.vue** (Generic Section Container)
**Purpose:** Display key-value information
**Props:**
- `title` (string)
- `items` (array of {label, value, icon?})
- `layout` ('list' | 'grid' | 'compact')

#### 6. **FavoriteButton.vue** (Generic Wishlist Button)
**Purpose:** Centralize favorite toggle logic
**Props:**
- `itemId` (string)
- `isFavorited` (boolean)
- `entityType` (string for store action)
**Emits:**
- `toggle-favorite` (payload: {id, entityType})

#### 7. **FilterPanel.vue** (Generic Filter Component)
**Purpose:** Replace search and filter UI
**Props:**
- `filters` (array of filter definitions)
- `activeFilters` (object)
- `options` (object with filter options)
**Emits:**
- `update-filters`

---

## Phase 3: Folder Structure Reorganization

### 📁 Proposed New Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Icon.vue                      (existing)
│   │   ├── FavoriteButton.vue            (new)
│   │   ├── InfoSection.vue               (new)
│   │   ├── FacilityGrid.vue              (new)
│   │   └── BottomNav.vue                 (existing, move here)
│   │
│   ├── shared/
│   │   ├── cards/
│   │   │   ├── BaseCard.vue              (new - replaces 3 card components)
│   │   │   ├── types.ts                  (card type definitions)
│   │   │   └── composables/
│   │   │       ├── useCard.ts            (card logic - navigation, favorites)
│   │   │       └── useCardStyles.ts      (color schemes)
│   │   │
│   │   ├── carousel/
│   │   │   ├── ImageCarousel.vue         (new - replaces duplicated carousels)
│   │   │   └── composables/
│   │   │       └── useImageCarousel.ts   (carousel logic)
│   │   │
│   │   ├── headers/
│   │   │   ├── HeaderWithImage.vue       (new - replaces TirthHeader)
│   │   │   └── DetailPageHeader.vue      (new - for detail pages)
│   │   │
│   │   ├── filters/
│   │   │   ├── FilterPanel.vue           (new - centralized filters)
│   │   │   └── SearchBox.vue             (new - extracted from pages)
│   │   │
│   │   └── buttons/
│   │       ├── ActionButton.vue          (generic button with icon)
│   │       └── TagButton.vue             (for tags, cuisines, features)
│   │
│   ├── tirth/
│   │   ├── TirthCard.vue                 (DEPRECATED - use BaseCard)
│   │   ├── TirthAbout.vue                (existing - keep)
│   │   ├── TirthFacilities.vue           (existing - keep)
│   │   ├── TirthFestivals.vue            (existing - keep)
│   │   └── TirthHeader.vue               (DEPRECATED - use HeaderWithImage)
│   │
│   ├── dharamshala/
│   │   ├── DharamshalCard.vue            (DEPRECATED - use BaseCard)
│   │   └── composables/
│   │       └── useDharamshalaStore.ts    (dharamshala-specific logic)
│   │
│   └── bhojanshala/
│       ├── BhojanshalaCard.vue           (DEPRECATED - use BaseCard)
│       └── composables/
│           └── useBhojanshalAStore.ts    (bhojanshala-specific logic)
│
├── pages/
│   ├── index.vue                         (existing)
│   ├── tirth.vue                         (existing - list page)
│   ├── tirth/
│   │   └── [id].vue                      (NEW - replaces girnar.vue, palitana.vue, etc.)
│   │
│   ├── dharamshala.vue                   (existing)
│   ├── dharamshala/
│   │   └── [id].vue                      (NEW - replaces dharamshala-detail/[id].vue)
│   │
│   ├── bhojanshala.vue                   (existing)
│   ├── bhojanshala/
│   │   └── [id].vue                      (NEW - replaces bhojanshala-detail/[id].vue)
│   │
│   ├── profile.vue                       (existing)
│   ├── settings.vue                      (existing)
│   └── admin/
│       ├── index.vue                     (NEW - admin dashboard)
│       ├── edit-tirth.vue                (NEW - edit tirth details)
│       └── manage-facilities.vue         (NEW - manage facilities)
│
├── layouts/
│   ├── default.vue                       (existing)
│   ├── admin.vue                         (NEW - for admin pages)
│   └── detail.vue                        (NEW - for detail pages)
│
├── composables/
│   ├── api/
│   │   ├── index.ts                      (existing)
│   │   ├── useApi.ts                     (existing)
│   │   ├── useTirthApi.ts                (NEW - extracted tirth endpoints)
│   │   ├── useDharamshalaApi.ts          (NEW - dharamshala endpoints)
│   │   ├── useBhojanshalAApi.ts          (NEW - bhojanshala endpoints)
│   │   └── useFavoriteApi.ts             (NEW - favorite endpoints)
│   │
│   ├── ui/
│   │   ├── index.ts                      (existing)
│   │   ├── useFilter.ts                  (existing)
│   │   ├── usePagination.ts              (existing)
│   │   ├── useSearch.ts                  (existing)
│   │   ├── useTabNavigation.ts           (existing)
│   │   ├── useImageCarousel.ts           (NEW - moved here)
│   │   ├── useCard.ts                    (NEW - moved here)
│   │   └── useCardStyles.ts              (NEW - moved here)
│   │
│   ├── utils/
│   │   ├── useFormatting.ts              (NEW - text formatting utilities)
│   │   ├── useValidation.ts              (NEW - form/data validation)
│   │   └── useGeolocation.ts             (NEW - location utilities)
│   │
│   └── state/
│       ├── useTirthState.ts              (NEW - tirth state logic)
│       ├── useDharamshalaState.ts        (NEW - dharamshala state logic)
│       └── useBhojanshalAState.ts        (NEW - bhojanshala state logic)
│
├── stores/
│   ├── tirth.ts                          (existing - refactor for clarity)
│   ├── dharamshala.ts                    (NEW - separate store)
│   ├── bhojanshala.ts                    (NEW - separate store)
│   ├── user.ts                           (existing)
│   ├── visited.ts                        (existing)
│   ├── favorites.ts                      (NEW - centralized favorites)
│   ├── filters.ts                        (NEW - shared filter state)
│   └── search.ts                         (NEW - search state)
│
├── types/
│   ├── models.ts                         (existing)
│   ├── api.ts                            (NEW - API request/response types)
│   ├── components.ts                     (NEW - component props types)
│   ├── store.ts                          (NEW - store state types)
│   └── common.ts                         (NEW - common/utility types)
│
├── utils/
│   ├── constants.ts                      (NEW - app constants, color schemes)
│   ├── helpers.ts                        (NEW - utility functions)
│   ├── formatters.ts                     (NEW - text formatters)
│   ├── validators.ts                     (NEW - validation functions)
│   └── mappers.ts                        (NEW - data mappers for consistency)
│
├── server/
│   ├── api/
│   │   ├── tirth/
│   │   │   ├── index.get.ts              (NEW - refactor tirths.get.ts)
│   │   │   └── [id].get.ts               (existing location)
│   │   │
│   │   ├── dharamshala/
│   │   │   ├── index.get.ts              (NEW - dharamshala list)
│   │   │   └── [id].get.ts               (NEW - dharamshala detail)
│   │   │
│   │   ├── bhojanshala/
│   │   │   ├── index.get.ts              (NEW - bhojanshala list)
│   │   │   └── [id].get.ts               (NEW - bhojanshala detail)
│   │   │
│   │   └── favorites/
│   │       ├── index.get.ts              (existing: favorites.get.ts)
│   │       └── index.post.ts             (existing: favorites.post.ts)
│   │
│   └── utils/
│       ├── sampleData.ts                 (existing - refactor)
│       ├── tirth-data.ts                 (NEW - separate tirth data)
│       ├── dharamshala-data.ts           (NEW - separate dharamshala data)
│       ├── bhojanshala-data.ts           (NEW - separate bhojanshala data)
│       └── database-utils.ts             (NEW - DB helper functions)
│
├── assets/
│   ├── css/
│   │   ├── main.css                      (existing)
│   │   ├── components.css                (NEW - component-specific styles)
│   │   ├── colors.css                    (NEW - color schemes)
│   │   ├── utilities.css                 (NEW - utility classes)
│   │   └── responsive.css                (NEW - responsive utilities)
│   │
│   └── images/
│       ├── icons/                        (NEW - icon assets)
│       ├── placeholders/                 (NEW - placeholder images)
│       └── logos/                        (NEW - app logos)
│
├── middleware/
│   ├── auth.ts                           (NEW - auth middleware)
│   ├── admin.ts                          (NEW - admin access middleware)
│   └── error-handler.ts                  (maybe move from plugins)
│
├── plugins/
│   ├── init-store.ts                     (existing - refactor)
│   └── error-handler.ts                  (existing)
│
└── config/
    ├── constants.ts                      (NEW - app-wide constants)
    └── colors.ts                         (NEW - color schemes)
```

---

## Phase 4: Step-by-Step Implementation Plan

### **Step 1: Setup & Preparation**
- [ ] Create all new folder structures
- [ ] Create `.ts` type definition files
- [ ] Update `types/models.ts` with unified interfaces
- [ ] Create `types/api.ts`, `types/components.ts`, `types/store.ts`, `types/common.ts`

### **Step 2: Create Generic Components**
- [ ] Create `components/shared/carousel/ImageCarousel.vue`
- [ ] Create `components/shared/carousel/composables/useImageCarousel.ts`
- [ ] Create `components/shared/cards/BaseCard.vue`
- [ ] Create `components/shared/cards/types.ts`
- [ ] Create `components/shared/cards/composables/useCard.ts`
- [ ] Create `components/shared/cards/composables/useCardStyles.ts`
- [ ] Create `components/shared/headers/HeaderWithImage.vue`
- [ ] Create `components/shared/filters/FilterPanel.vue`
- [ ] Create `components/shared/filters/SearchBox.vue`
- [ ] Create `components/common/FavoriteButton.vue`
- [ ] Create `components/common/InfoSection.vue`
- [ ] Create `components/common/FacilityGrid.vue`

### **Step 3: Refactor API Layer**
- [ ] Create `composables/api/useTirthApi.ts` - extract tirth-specific endpoints
- [ ] Create `composables/api/useDharamshalaApi.ts` - dharamshala endpoints
- [ ] Create `composables/api/useBhojanshalAApi.ts` - bhojanshala endpoints
- [ ] Create `composables/api/useFavoriteApi.ts` - favorite endpoints
- [ ] Update `composables/api/useApi.ts` to use new composables
- [ ] Create server-side API routes:
  - [ ] `server/api/tirth/index.get.ts`
  - [ ] `server/api/dharamshala/index.get.ts`
  - [ ] `server/api/dharamshala/[id].get.ts`
  - [ ] `server/api/bhojanshala/index.get.ts`
  - [ ] `server/api/bhojanshala/[id].get.ts`

### **Step 4: Refactor Data Layer**
- [ ] Create `server/utils/tirth-data.ts` - split tirth data
- [ ] Create `server/utils/dharamshala-data.ts` - split dharamshala data
- [ ] Create `server/utils/bhojanshala-data.ts` - split bhojanshala data
- [ ] Create `server/utils/database-utils.ts` - database helper functions
- [ ] Refactor `sampleData.ts`

### **Step 5: Create/Refactor Pinia Stores**
- [ ] Create `stores/dharamshala.ts` - new dharamshala store
- [ ] Create `stores/bhojanshala.ts` - new bhojanshala store
- [ ] Create `stores/favorites.ts` - centralized favorites store
- [ ] Create `stores/filters.ts` - shared filter state
- [ ] Create `stores/search.ts` - search state
- [ ] Refactor `stores/tirth.ts` - simplify & modularize

### **Step 6: Create Utility & Helper Functions**
- [ ] Create `utils/constants.ts` - app constants
- [ ] Create `utils/helpers.ts` - utility functions
- [ ] Create `utils/formatters.ts` - text formatters
- [ ] Create `utils/validators.ts` - validation logic
- [ ] Create `utils/mappers.ts` - data mappers
- [ ] Create `composables/utils/useFormatting.ts`
- [ ] Create `composables/utils/useValidation.ts`
- [ ] Create `composables/utils/useGeolocation.ts`

### **Step 7: Create/Update Pages**
- [ ] Create `pages/tirth/[id].vue` - dynamic tirth detail
- [ ] Create `pages/dharamshala/[id].vue` - dynamic dharamshala detail
- [ ] Create `pages/bhojanshala/[id].vue` - dynamic bhojanshala detail
- [ ] Create `layouts/detail.vue` - detail page layout
- [ ] Create `layouts/admin.vue` - admin layout
- [ ] Update existing list pages to use new components
- [ ] Delete hardcoded detail pages (girnar.vue, palitana.vue, etc.)

### **Step 8: Update Existing Components**
- [ ] Update `pages/tirth.vue` to use `BaseCard` + `FilterPanel`
- [ ] Update `pages/dharamshala.vue` to use new components
- [ ] Update `pages/bhojanshala.vue` to use new components
- [ ] Update `pages/index.vue` to use new components
- [ ] Deprecate old card components

### **Step 9: Create Middleware**
- [ ] Create `middleware/auth.ts` - authentication check
- [ ] Create `middleware/admin.ts` - admin access check

### **Step 10: Update Config & Assets**
- [ ] Create `config/constants.ts` - centralized constants
- [ ] Create `config/colors.ts` - color schemes
- [ ] Create asset folders for icons, placeholders, logos
- [ ] Create CSS files for components, colors, utilities

### **Step 11: Testing & Refactoring**
- [ ] Test all new components in isolation
- [ ] Test page navigation with dynamic routes
- [ ] Test API endpoints
- [ ] Performance testing & optimization
- [ ] Cross-browser testing

### **Step 12: Documentation**
- [ ] Update `PROJECT_STRUCTURE.md` with new structure
- [ ] Create `COMPONENT_GUIDE.md` - component usage guide
- [ ] Create `API_GUIDE.md` - API endpoint documentation
- [ ] Create `STORE_GUIDE.md` - Pinia store documentation

---

## Phase 5: Generic Components Deep Dive

### BaseCard Component Structure

```typescript
// components/shared/cards/types.ts
export type CardType = 'tirth' | 'dharamshala' | 'bhojanshala'

export interface CardItem {
  id: string
  name: string
  description?: string
  images?: string[] | string
  location: {
    city: string
    state: string
    address?: string
  }
  rating?: number
  [key: string]: any
}

export interface ColorScheme {
  border: string      // e.g., 'border-red-100'
  borderHover: string // e.g., 'border-red-300'
  accentColor: string // e.g., 'text-red-600'
  tagBg: string      // e.g., 'bg-red-50'
  tagText: string    // e.g., 'text-red-700'
  heart: string      // e.g., 'text-red-500'
  dot: string        // e.g., 'bg-red-400'
}

export interface CardDisplayField {
  key: string
  label: string
  icon?: string
  format?: (value: any) => string
}

export interface CardAction {
  id: string
  label: string
  icon: string
  handler: (item: CardItem) => void
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}
```

### Usage Examples

**Old Way:**
```vue
<TirthCard :tirth="item" />
<DharamshalCard :dharamshala="item" />
<BhojanshalaCard :bhojanshala="item" />
```

**New Way:**
```vue
<BaseCard 
  :item="item"
  :card-type="'tirth'"
  :color-scheme="terthColorScheme"
  :display-fields="terthFields"
/>

<BaseCard 
  :item="item"
  :card-type="'dharamshala'"
  :color-scheme="dharamshalaColorScheme"
  :display-fields="dharamshalaFields"
/>
```

---

## Phase 6: Migration Path (Minimal Breaking Changes)

### Short-term (Immediate)
1. Create generic components alongside existing ones
2. Update one page at a time (e.g., `tirth.vue` first)
3. Keep old components for fallback during transition
4. Deploy incrementally

### Mid-term (2-4 weeks)
1. Migrate all pages to new structure
2. Remove old hardcoded detail pages
3. Setup new API routes
4. Refactor stores

### Long-term (Ongoing)
1. Add admin pages
2. Add advanced features (filters, search)
3. Performance optimization
4. Add tests & documentation

---

## Benefits of This Modularization

### 📊 Code Reduction
- **Before:** 3 card components × 400 lines = 1200 lines
- **After:** 1 BaseCard (300 lines) + type definitions = 350 lines
- **Savings:** ~850 lines (71% reduction)

### 🎯 Maintainability
- Single source of truth for card rendering
- Easy to update card behavior across all entity types
- Consistent styling and interactions

### 🚀 Scalability
- Easy to add new entity types (e.g., gaushala, clinic)
- Reusable components for future features
- Better code organization for team collaboration

### 🔄 Flexibility
- Composable architecture allows feature toggling
- Color schemes easily customizable
- Display fields configurable per entity type

### 📚 Developer Experience
- Clear component contracts via types
- Consistent API patterns
- Better IDE autocomplete
- Easier onboarding for new developers

---

## Files to Remove/Deprecate

```
REMOVE (after migration):
- pages/girnar.vue
- pages/palitana.vue
- pages/ranakpur.vue
- pages/shikharji.vue
- pages/bhojanshala-detail/ (replace with pages/bhojanshala/[id].vue)
- pages/dharamshala-detail/ (replace with pages/dharamshala/[id].vue)
- components/tirth/TirthCard.vue
- components/tirth/TirthHeader.vue
- components/dharamshala/DharamshalCard.vue
- components/bhojanshala/BhojanshalaCard.vue
- server/api/tirths.get.ts (move to server/api/tirth/index.get.ts)
- server/api/tirths/[id].get.ts (move to server/api/tirth/[id].get.ts)
- server/api/favorites.get.ts (move to server/api/favorites/index.get.ts)
- server/api/favorites.post.ts (move to server/api/favorites/index.post.ts)
```

---

## Next Steps

1. **Review & Approve:** Go through this plan and provide feedback
2. **Prioritize:** Select which components to implement first
3. **Start Phase 2:** Begin creating generic components
4. **Iterate:** Test and refactor as you go
5. **Document:** Keep documentation updated

---

## Questions to Consider

1. Do you want to migrate all at once or incrementally?
2. Should we maintain backward compatibility during migration?
3. Are there specific UI patterns you want to enforce?
4. Do you need theme customization (dark mode, multiple themes)?
5. Should filters be global state or local component state?
6. How do you want to handle future entity types?

