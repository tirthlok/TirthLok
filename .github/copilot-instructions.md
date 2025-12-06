# TirthLok Copilot Instructions

## Project Overview
TirthLok is a Nuxt 3 full-stack web application for exploring Jain pilgrimage locations (Tirth) with facility information, room bookings, and personalization features. Key entities: **Tirth** (temples), **Dharamshala** (accommodations), **Bhojanshala** (restaurants), and **Facilities**.

**Tech Stack**: Nuxt 3 + Vue 3, Pinia (state), TypeScript (strict), Tailwind CSS, Axios ($fetch)

---

## Architecture & Data Flow

### Three-Layer Communication Pattern
The codebase follows a strict separation between API composables, stores, and components:

1. **API Composables** (`src/composables/api/`): Entity-specific, handle HTTP via `$fetch()` with `runtimeConfig.public.apiBaseUrl`
   - `useTirthApi()` - Tirth CRUD operations
   - `useFavoriteApi()` - Wishlist operations
   - `useDharamshalaApi()`, `useBhojanshalaApi()` - Similar patterns
   - Return raw API responses (not state-aware)

2. **Pinia Stores** (`src/stores/`): Centralized state, call API composables, expose getters/actions
   - `useTirthStore()` - Caches tirths in memory (skips remote fetch if seeded data exists)
   - `useFavoritesStore()` - Favorites array with `isFavorite(id)` getter
   - All data updates go through store actions (not direct API calls from components)

3. **Components**: Always consume from stores, never call API composables directly
   - Listen to store state via `computed()` getters
   - Dispatch actions via store methods
   - Use separate composable per concern (e.g., `useFilter`, `useCardStyles`)

**Data Flow Example**: Component → Store Action → API Composable → $fetch → Response → Store State → Component Re-render

### Sample Data Strategy
- **Development default**: `sampleTirths` seeded in stores (in-memory)
- **Store checks local data first** before fetching remote API (see `useTirthStore.fetchTirths()`)
- API endpoints at `/api/{entity}` are thin wrappers (TODO: replace with DB calls)

---

## Entity & Type System

### Core Types (`src/types/models.ts`)
- **Tirth**: `id`, `name`, `location`, `sector` (Shwetambar/Digambar), `type` (Gyan-sthan/Siddhakshetra/Atishay-Kshetra), `festivals[]`, `facilities[]`
- **Facility**: Nested in Tirth; types = `'bhojanshala' | 'dharmashala' | 'gaushala' | 'clinic' | 'water' | 'parking' | 'washroom'`
- **Room** (in Dharamshala): `id`, `roomNumber`, `type`, `capacity`, `price`, `available`, `amenities[]`
- **Location**: Shared struct with `latitude`, `longitude`, `city`, `state`

**Key Pattern**: All entities use string `id` fields; no implicit type casting.

---

## Component Organization

### Reusable Components (`src/components/shared/`)
Components are exported via **barrel exports** in `src/components/shared/index.ts`:

- **BaseCard**: Generic card for any entity (Tirth/Dharamshala/Bhojanshala)
  - Props: `item` (entity), `cardType`, `showDetails`, `showWishlist`, `imageHeight`, `variant` (default/featured)
  - Composable: `useCard()` for state, `useCardStyles()` for color schemes by entity type
  - Example: `color-amber-600` for Tirth, `color-blue-600` for Dharamshala
  - Auto-handles routing: `@click` triggers navigation based `cardType` prop

- **ImageCarousel**: Displays images with dot indicator, subtitle overlay
  - Props: `images[]`, `title`, `subtitle`, `imageHeight`, `accentDotColor`
  - Composable: `useImageCarousel()` manages current image index

- **FilterPanel + SearchBox**: Dual filtering UI
  - `useFilter<T>()` composable: Generic filter logic for any array/keys
  - `useSearch()` composable: Search suggestions via store

- **HeaderWithImage**: Page header with image carousel + metadata
  - Props: `title`, `subtitle`, `images`, `metadata`, `accentDotColor`

### Entity-Specific Components (`src/components/tirth/`, etc.)
- **TirthAbout**, **TirthFacilities**, **TirthFestivals**: Page sections
- **RoomCard**, **RoomBookingModal**: Dharamshala-specific

---

## Styling & Theme System

### Tailwind + Runtime Config
- **Dark mode**: `useThemeStore()` manages `isDarkMode` state (toggles via plugin)
- **Color schemes**: `useCardStyles()` returns color objects:
  ```typescript
  const scheme = colorSchemesByType(entity.type)
  // Returns: { bg, text, border, borderHover, accentColor, dot }
  ```
- **Responsive**: Breakpoints used: `sm:`, `md:`, `lg:` (mobile-first)

---

## Page Routing & Layouts

### File-Based Routing
- `/` → `src/pages/index.vue` (home)
- `/tirth` → `src/pages/tirth.vue` (list)
- `/tirth/[id]` → `src/pages/tirth/[id].vue` (detail with breadcrumb)
- `/dharamshala`, `/bhojanshala` follow same pattern
- `/profile`, `/settings` for user pages

### Layout Usage
- All pages use `default.vue` layout (BottomNav, Header)
- Pages fetch data on mount via `onMounted() → store.action()`

---

## Development Patterns & Commands

### Build & Run
```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # SSR production build
npm run lint     # ESLint check
npm run format   # Prettier (auto-fix)
```

### Adding a New Entity
1. Add TypeScript interface to `src/types/models.ts`
2. Create Pinia store: `src/stores/{entity}.ts` (copy `tirth.ts` pattern)
3. Create API composable: `src/composables/api/use{Entity}Api.ts`
4. Create server endpoint: `src/server/api/{entity}/index.get.ts`
5. Create page: `src/pages/{entity}.vue` and `src/pages/{entity}/[id].vue`
6. Use **BaseCard** with entity-specific `cardType` prop

### Common Tasks
- **Add filter field**: Extend `useFilter()` hook with new key; add UI in FilterPanel
- **Add favorite button**: Use existing `FavoriteButton` component (reusable)
- **Fetch with store**: Always use `await store.action()`; never call API composable directly from component
- **Handle errors**: All API errors logged to console; UI shows generic "Failed to fetch" message

---

## Key Files & Their Roles

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Modules (Tailwind, Pinia), SSR settings, route caching rules, `srcDir: 'src/'` |
| `src/types/models.ts` | Shared TypeScript interfaces for all entities |
| `src/stores/*.ts` | Pinia stores; state + getters + actions |
| `src/composables/api/*.ts` | HTTP clients; return raw responses |
| `src/components/shared/index.ts` | Barrel exports for all reusable components |
| `src/server/api/**/*.get.ts` | Server-side endpoints (use sampleData currently) |
| `src/plugins/*.ts` | Global error handlers, theme initialization |

---

## Important Notes for AI Agents

- **Never** import API composables in components; always go through stores
- **Always** use strict TypeScript (`tsconfig.json`: `strict: true`)
- **Card color schemes** are determined by entity `type`, not entity name (see `useCardStyles`)
- **Sample data** blocks remote fetches in dev (check store logic before assuming API calls)
- **Favorites** are entity-agnostic (one store for all types); include `entityType` param in API
- **Dark mode** is managed globally via `useThemeStore()` + CSS classes; use `isDarkMode` to conditional render
- **Routes are cached** per `nuxt.config.ts` (homepage 60s, tirth detail 1h)
- **API client**: Uses Nuxt auto-import `$fetch()` (not manual axios); baseURL configured via `runtimeConfig.public.apiBaseUrl`
- **Server-side only**: Write and implement code on the NODE.JS/server side only. Never write client-side JavaScript unless explicitly requested.
- **No client-side storage**: Never use localStorage, sessionStorage, cookies, IndexedDB, or browser storage. Use server-side solutions (database, server sessions) for persistent data.
- **No styling changes**: Never modify CSS, Tailwind classes, or design code unless explicitly asked. If asked about styling, confirm first before proceeding.
- **No unsolicited changes**: Only edit the exact code requested. Do not add improvements, comments, or refactor unrelated code unless explicitly requested.
- **No documentation generation**: Never create documentation files, README updates, JSDoc, or API docs unless explicitly requested.
