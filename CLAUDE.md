# CLAUDE.md

> Definitive context document for AI agents and developers working in this repository.
> Updated after full repository cleanup & modernization (June 2026).

---

## Project Overview

**TirthLok** (`package.json` name: `jain-tirth-explorer`) is a full-stack web application for exploring Jain pilgrimage locations. It provides:

- A browsable directory of Jain Tirths (temples) with detailed information (idols, timings, festivals, history)
- Dharamshala (accommodation) listings with room inventory and booking
- Bhojanshala (dining) listings
- User wishlist/favorites
- Booking management with invoice generation and email notifications
- A role-based admin panel for super admins and property managers

---

## Business Purpose

The application serves the Jain community as a pilgrimage planning tool. Core user journeys:

1. **Discover** → Browse/filter Tirths by sect, state, type, or search
2. **Plan** → View detailed Tirth pages (timings, facilities, events, map)
3. **Book** → Reserve rooms at nearby Dharamshalas
4. **Track** → Manage bookings, view invoices, save favorites

> **Note**: `docs/SUPABASE_ARCHITECTURE.md` is outdated. Do not use it as a reference. The authoritative source for database architecture is the actual server routes under `src/server/api/` and the utility clients in `src/server/utils/supabase.ts`.

---

## Architecture Overview

- **Type**: Full-stack SSR monolith
- **Framework**: Nuxt 3 (SSR enabled, `ssr: true` in `nuxt.config.ts`)
- **Source root**: All application code lives under `src/` (`srcDir: 'src/'`)
- **Database**: Supabase (PostgreSQL) with a custom `tirthlok` schema
- **Pattern**: Single-tier feature-module architecture under `src/features/` — the legacy `composables/api/` layer and deprecated `src/stores/` wrappers have been removed

### Dual Supabase Client Pattern
The server uses **two distinct Supabase clients** (`src/server/utils/supabase.ts`):

| Client | Function | Schema | Use |
|--------|----------|--------|-----|
| `getSupabaseAdmin()` | Auth operations | `public` | User auth, session validation |
| `getSupabaseTirthlok()` | All data operations | `tirthlok` | All business data tables |

---

## Repository Structure

```
/
├── nuxt.config.ts          # Framework configuration (SSR, modules, runtimeConfig, auto-imports)
├── tailwind.config.js      # Design system tokens (CSS variables → Tailwind)
├── tsconfig.json           # TypeScript (strict mode, path aliases ~/* and @/*)
├── package.json            # Dependencies and npm scripts
├── docs/
│   └── SUPABASE_ARCHITECTURE.md  # ⚠️ Outdated — do not rely on this file
└── src/
    ├── app.vue             # Root component (NuxtLayout + NuxtPage + BottomNav)
    ├── assets/
    │   └── css/
    │       ├── main.css    # Entry: imports base, pages, Tailwind
    │       └── base/       # CSS custom properties (theme variables)
    ├── components/
    │   ├── admin/
    │   │   └── AdminBanner.vue
    │   ├── layout/
    │   │   └── header/     # Header.vue, SearchSuggestions.vue
    │   └── ui/
    │       ├── BottomNav.vue
    │       ├── Icon.vue
    │       ├── TirthCardSkeleton.vue  ← canonical location (used by pages)
    │       ├── index.ts               ← barrel for active UI exports
    │       ├── buttons/               ← empty dir (orphaned files removed)
    │       ├── cards/                 # BaseCard.vue (active)
    │       ├── carousel/              # ImageCarousel.vue (active)
    │       └── filters/               # TirthFilterPanel.vue, SearchBox.vue (active)
    ├── composables/
    │   ├── useRole.ts      # JWT role extraction (super_admin/manager/customer) — canonical here
    │   └── ui/
    │       ├── index.ts
    │       ├── useFilter.ts    # active — used by TirthFacilities.vue
    │       └── useGrouping.ts  # active — used by tirth.vue, dharamshala.vue
    ├── features/           # CANONICAL LAYER — all feature code lives here
    │   ├── auth/
    │   │   ├── index.ts
    │   │   └── composables/
    │   │       ├── useAuth.ts         # Auth state, session management
    │   │       ├── useSupabase.ts     # Client Supabase singleton
    │   │       └── useCustomerProfile.ts
    │   ├── tirth/
    │   │   ├── index.ts
    │   │   ├── components/
    │   │   │   ├── TirthAbout.vue
    │   │   │   ├── TirthFacilities.vue
    │   │   │   ├── TirthEvents.vue
    │   │   │   └── index.ts
    │   │   ├── composables/
    │   │   │   ├── useTirthStore.ts
    │   │   │   └── useVisitedStore.ts
    │   │   └── services/
    │   │       ├── tirthApi.ts
    │   │       └── eventsApi.ts
    │   ├── dharamshala/
    │   │   ├── index.ts
    │   │   ├── components/            # RoomCard.vue, RoomBookingModal.vue
    │   │   ├── composables/
    │   │   │   ├── useDharamshalaStore.ts
    │   │   │   └── useRoomBooking.ts
    │   │   └── services/
    │   │       ├── dharamshalaApi.ts
    │   │       └── roomBookingApi.ts
    │   ├── bhojanshala/
    │   │   ├── index.ts
    │   │   ├── composables/
    │   │   │   └── useBhojanshalaStore.ts
    │   │   └── services/
    │   │       └── bhojanshalaApi.ts
    │   └── wishlist/
    │       ├── index.ts
    │       ├── components/            # WishlistButton.vue
    │       ├── composables/
    │       │   └── useWishlistStore.ts
    │       └── services/
    │           └── wishlistApi.ts
    ├── layouts/
    │   └── default.vue     # Header + AdminBanner + slot + Footer
    ├── middleware/
    │   └── auth.ts         # Route guard: redirects unauthenticated to /auth/login
    ├── pages/              # File-based routing (all active)
    │   ├── index.vue
    │   ├── tirth.vue / tirth/[id].vue
    │   ├── dharamshala.vue / dharamshala/[id].vue
    │   ├── bhojanshala.vue / bhojanshala/[id].vue
    │   ├── bookings/index.vue / bookings/[id].vue
    │   ├── invoice/[bookingId].vue
    │   ├── profile.vue
    │   ├── settings.vue
    │   ├── auth/           # login.vue, forgot-password.vue, reset-password.vue
    │   └── admin/          # index.vue, bookings.vue, rooms.vue, managers.vue
    ├── plugins/
    │   ├── init-store.ts          # SSR: pre-fetches tirth list on startup
    │   ├── init-auth.client.ts    # Client: restores auth session, syncs wishlist
    │   ├── theme.client.ts        # Client: loads saved theme from localStorage
    │   ├── error-handler.ts
    │   ├── error-handler.client.ts
    │   ├── route-logger.client.ts
    │   └── scroll.client.ts
    ├── server/
    │   ├── api/
    │   │   ├── tirth/             # GET /api/tirth, GET /api/tirth/:id, filter-options
    │   │   ├── dharamshala/       # GET /api/dharamshala, GET /api/dharamshala/:id, rooms, availability
    │   │   ├── bhojanshala/       # GET /api/bhojanshala, GET /api/bhojanshala/:id
    │   │   ├── bookings.post.ts   # POST /api/bookings
    │   │   ├── bookings/          # GET+PATCH /api/bookings/:id, GET /api/bookings/my
    │   │   ├── wishlist.get.ts / wishlist.post.ts
    │   │   ├── wishlist/          # DELETE /api/wishlist/:id
    │   │   ├── invoice/[bookingId].get.ts
    │   │   └── admin/             # stats, bookings, managers, rooms
    │   └── utils/
    │       ├── supabase.ts        # Server Supabase clients + getUserIdFromEvent
    │       ├── adminContext.ts    # JWT role extraction for server-side auth
    │       ├── email.ts           # Resend email: booking confirm, admin notify
    │       └── emailTemplates.ts  # HTML email templates
    ├── stores/             # Only TWO active canonical stores remain here
    │   ├── theme.ts        # useThemeStore (dark/light mode) — no feature home
    │   └── adminMode.ts    # useAdminModeStore (admin panel toggle) — no feature home
    ├── types/
    │   └── models.ts       # All TypeScript interfaces (User/AdminUser removed — use Supabase types)
    └── utils/              # General utility functions
```

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Nuxt 3 | ^3.8.0 |
| UI | Vue 3 | ^3.3.0 |
| State | Pinia | ^2.1.6 |
| CSS | Tailwind CSS | ^6.10.0 |
| Database | Supabase (PostgreSQL) | ^2.87.1 |
| Icons | lucide-vue-next | ^0.292.0 |
| Email | Resend | ^6.12.4 |
| Language | TypeScript | ^5.3.0 (strict) |
| Linting | ESLint + Prettier | — |

---

## Auto-Import Configuration

Nuxt auto-imports composables from these directories (relative to `srcDir`):

```typescript
imports.dirs: [
  'composables',          // useRole.ts, composables/ui/*
  'stores',               // useThemeStore, useAdminModeStore
  'features/auth/composables',
  'features/tirth/composables',
  'features/dharamshala/composables',
  'features/bhojanshala/composables',
  'features/wishlist/composables',
]
```

**All feature composables are auto-imported via this config.** Do not create re-export shims in `composables/` — add the feature directory to `imports.dirs` instead.

---

## Application Startup Flow

### Server-Side (SSR)
1. Nuxt boots, evaluates `nuxt.config.ts`
2. Plugin `src/plugins/init-store.ts` runs — imports `useTirthStore` directly from `~/features/tirth/composables/useTirthStore` and calls `fetchTirths()` to pre-populate tirth data
3. Request hits Nuxt server → matches `src/pages/**/*.vue` file-based route
4. Page component runs `useAsyncData()` for its specific data
5. Rendered HTML sent to client with hydration payload

### Client-Side Hydration
1. Vue hydrates the SSR payload
2. Plugin `src/plugins/theme.client.ts` runs — reads `localStorage.appTheme` and applies dark/light class
3. Plugin `src/plugins/init-auth.client.ts` runs:
   - Calls `useAuth().initialize()` to restore Supabase session
   - If authenticated, calls `wishlistStore.fetchWishlist()`
   - Sets up `supabase.auth.onAuthStateChange` listener for session sync

---

## Frontend Architecture

### Routing
File-based routing via Nuxt pages. Key routes:

| Route | File | Notes |
|-------|------|-------|
| `/` | `src/pages/index.vue` | Home + featured tirths |
| `/tirth` | `src/pages/tirth.vue` | Tirth list with grouping/filters |
| `/tirth/:id` | `src/pages/tirth/[id].vue` | Detail page |
| `/dharamshala` | `src/pages/dharamshala.vue` | Accommodation list |
| `/dharamshala/:id` | `src/pages/dharamshala/[id].vue` | Detail + room booking |
| `/bhojanshala` | `src/pages/bhojanshala.vue` | Dining list |
| `/bookings` | `src/pages/bookings/index.vue` | User's booking history |
| `/bookings/:id` | `src/pages/bookings/[id].vue` | Booking detail |
| `/invoice/:bookingId` | `src/pages/invoice/[bookingId].vue` | Printable invoice |
| `/profile` | `src/pages/profile.vue` | Customer profile |
| `/auth/login` | `src/pages/auth/login.vue` | Sign in / sign up |
| `/admin` | `src/pages/admin/index.vue` | Admin dashboard |

**Route caching** (defined in `nuxt.config.ts`):
- `/` → 60 seconds
- `/tirth/**` → 1 hour

**Protected routes** use the `auth` middleware (`src/middleware/auth.ts`).

### Layout
`src/layouts/default.vue` wraps all pages:
```
<Header />
<AdminBanner />  ← only visible to admins
<slot />         ← page content
<Footer />
```

`src/app.vue` adds `<BottomNav />` outside the layout for mobile navigation.

### State Management (Pinia)

All stores follow `defineStore` with `state`, `getters`, `actions`.

| Store | Location | Purpose |
|-------|----------|---------|
| `useTirthStore` | `features/tirth/composables/useTirthStore.ts` | Tirth list, filters, pagination |
| `useDharamshalaStore` | `features/dharamshala/composables/` | Dharamshala list |
| `useBhojanshalaStore` | `features/bhojanshala/composables/` | Bhojanshala list |
| `useWishlistStore` | `features/wishlist/composables/` | User favorites |
| `useVisitedStore` | `features/tirth/composables/useVisitedStore.ts` | Visited tirths |
| `useThemeStore` | `stores/theme.ts` | Dark/light mode |
| `useAdminModeStore` | `stores/adminMode.ts` | Admin panel visibility toggle |

**Rule**: Components always call store actions. Never call API service composables from components directly.

---

## Backend Architecture

### Server Routes (Nuxt H3)

All server API lives under `src/server/api/`. Each file maps to an HTTP route:

```
src/server/api/tirth/index.get.ts            → GET  /api/tirth
src/server/api/tirth/[id].get.ts             → GET  /api/tirth/:id
src/server/api/tirth/filter-options.get.ts   → GET  /api/tirth/filter-options
src/server/api/dharamshala/index.get.ts      → GET  /api/dharamshala
src/server/api/dharamshala/[id].get.ts       → GET  /api/dharamshala/:id
src/server/api/dharamshala/[id]/rooms.get.ts → GET  /api/dharamshala/:id/rooms
src/server/api/dharamshala/[id]/rooms/availability.get.ts → GET /api/dharamshala/:id/rooms/availability
src/server/api/bhojanshala/index.get.ts      → GET  /api/bhojanshala
src/server/api/bhojanshala/[id].get.ts       → GET  /api/bhojanshala/:id
src/server/api/bookings.post.ts              → POST /api/bookings
src/server/api/bookings/[id].get.ts          → GET  /api/bookings/:id
src/server/api/bookings/[id].patch.ts        → PATCH /api/bookings/:id
src/server/api/bookings/my.get.ts            → GET  /api/bookings/my
src/server/api/wishlist.get.ts               → GET  /api/wishlist
src/server/api/wishlist.post.ts              → POST /api/wishlist
src/server/api/wishlist/[id].delete.ts       → DELETE /api/wishlist/:id
src/server/api/invoice/[bookingId].get.ts    → GET  /api/invoice/:bookingId
src/server/api/admin/stats.get.ts            → GET  /api/admin/stats
src/server/api/admin/bookings.get.ts         → GET  /api/admin/bookings
src/server/api/admin/rooms.get.ts            → GET  /api/admin/rooms
src/server/api/admin/managers.get.ts         → GET  /api/admin/managers
src/server/api/admin/managers.post.ts        → POST /api/admin/managers
```

**No sample data fallbacks exist.** All routes query Supabase directly and return proper HTTP errors (404/500) when data is not found.

### Server-Side Authentication

Every protected endpoint extracts the user from the `Authorization: Bearer <token>` header:

```typescript
const userId = await getUserIdFromEvent(event)
if (!userId) throw createError({ statusCode: 401, ... })
```

Admin endpoints use `requireAdmin(event)` or `requireSuperAdmin(event)` from `src/server/utils/adminContext.ts`.

---

## Data Flow

### Public Browse Flow
```
User visits /tirth
  → SSR: init-store.ts plugin calls tirthStore.fetchTirths()
  → tirthStore calls $fetch('/api/tirth?page=1&limit=10')
  → server/api/tirth/index.get.ts queries Supabase tirthlok.tirth_cards
  → Handler transforms rows to Tirth model
  → tirthStore.tirths populated
  → tirth.vue renders cards using BaseCard component
```

### Booking Flow
```
User selects room on /dharamshala/:id
  → RoomBookingModal opens
  → useRoomBooking composable manages local form state
  → On submit: $fetch('POST /api/bookings', { Authorization: Bearer <token> })
  → server/api/bookings.post.ts:
      1. Validates JWT → getUserIdFromEvent()
      2. Validates input + dates
      3. Verifies room in tirthlok.room_types
      4. Checks total_inventory > 0
      5. INSERT into tirthlok.bookings
      6. DECREMENT room_types.total_inventory
      7. Sends emails (non-blocking)
  → Returns booking record
  → UI redirects to /bookings/:id
```

---

## Authentication & Authorization

### Auth Provider
Supabase Auth (email/password). Session stored in `sessionStorage`.

### Role System (JWT Claims)

| Claim | Values | Source |
|-------|--------|--------|
| `user_role` | `'customer'`, `'manager'`, `'super_admin'` | Supabase JWT |
| `manager_type` | `'tirth'`, `'dharamshala'`, `'both'`, `null` | Supabase JWT |
| `tirth_id` | string or null | Supabase JWT |
| `dharamshala_id` | string or null | Supabase JWT |

**Client-side** role reading: `src/composables/useRole.ts` decodes `session.value.access_token`.
**Server-side** role reading: `src/server/utils/adminContext.ts` decodes `Authorization` header token.

---

## Database Architecture

### Schema: `tirthlok`
| Table | Purpose |
|-------|---------|
| `tirth_cards` | Core tirth listing data |
| `tirth_details` | Extended tirth detail data |
| `tirth_events` | Festival and event data per tirth |
| `dharamshala_cards` | Dharamshala listing data |
| `dharamshala_details` | Extended dharamshala data |
| `bhojanshala_cards` | Bhojanshala listing data |
| `room_types` | Room inventory with pricing (PK: `room_type_id`) |
| `bookings` | Booking records |
| `invoices` | Invoice records |
| `customer_profile` | Extended user profile data |
| `customer_wishlist` | User wishlist |

### Schema: `public`
- `public.v_customer_profile` — filtered view of current user's profile
- `public.v_customer_wishlist` — filtered view of current user's wishlist
- RPC functions for profile and wishlist management

---

## Configuration & Environment Variables

### Public (exposed to client via `runtimeConfig.public`)
| Variable | Purpose |
|----------|---------|
| `NUXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (for client auth) |
| `NUXT_PUBLIC_API_BASE_URL` | API base path (default: `/api/v1`) |

### Private (server-side only)
| Variable | Purpose |
|----------|---------|
| `SUPABASE_SERVICE_KEY` | Supabase service role key (bypasses RLS) |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `RESEND_FROM_EMAIL` | Sender address |
| `RESEND_ADMIN_EMAIL` | Admin notification recipient |

---

## Development Workflow

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:3000
npm run build     # SSR production build (outputs to .output/)
npm run preview   # Preview production build
npm run lint      # ESLint check
npm run format    # Prettier auto-fix
```

---

## Coding Conventions

### Naming
- **Files**: `camelCase.ts` for composables/stores, `PascalCase.vue` for components
- **Composables**: prefix `use` (e.g., `useTirthStore`, `useFilter`)
- **Types/Interfaces**: `PascalCase` in `src/types/models.ts`
- **Server routes**: file name = HTTP method suffix (`.get.ts`, `.post.ts`, `.patch.ts`)

### Imports
- Use `~/*` alias for `src/` (e.g., `import type { Tirth } from '~/types/models'`)
- Feature composables are auto-imported — no explicit import needed in `.vue` files
- For explicit imports, always import directly from the feature path (e.g., `~/features/tirth/composables/useTirthStore`)
- **Never import from the old `~/stores/tirth`, `~/stores/dharamshala`, `~/stores/bhojanshala`** — those files no longer exist

### Component Pattern
```vue
<template>...</template>
<script setup lang="ts">
const store = useTirthStore()  // auto-imported
const data = computed(() => store.tirths)
</script>
```

### Feature Module Structure
```
features/{name}/
├── index.ts          # Barrel exports for the feature
├── components/       # Vue components (feature-specific)
├── composables/      # Pinia stores for this feature
└── services/         # API composables ($fetch wrappers)
```

---

## Common Development Tasks

### Adding a New Entity (e.g., "Gaushala")
1. Add TypeScript interface to `src/types/models.ts`
2. Create Pinia store: `src/features/gaushala/composables/useGaushalaStore.ts`
3. Create API service: `src/features/gaushala/services/gaushalaApi.ts`
4. Create barrel: `src/features/gaushala/index.ts`
5. Add feature composable dir to `nuxt.config.ts` `imports.dirs`
6. Add server routes: `src/server/api/gaushala/index.get.ts`, `[id].get.ts`
7. Create pages: `src/pages/gaushala.vue`, `src/pages/gaushala/[id].vue`

### Adding a Server API Route
- Create `src/server/api/{path}.{method}.ts`
- Use `getSupabaseTirthlok()` for data queries
- Use `getUserIdFromEvent(event)` for auth-protected routes
- Return plain objects; throw `createError({ statusCode, statusMessage })` on failure
- **Never add sample data fallbacks** — all data comes from Supabase only

### Adding a New Store
Add the feature composable directory to `nuxt.config.ts` `imports.dirs`:
```typescript
dirs: [
  // ...existing dirs
  'features/newfeature/composables',
]
```

### Adding a Protected Page
```typescript
definePageMeta({ middleware: 'auth' })
```

---

## AI Agent Instructions

### Files to Read First
1. `src/types/models.ts` — all data structures
2. `nuxt.config.ts` — routing, modules, auto-import dirs, env config
3. `src/features/{feature}/index.ts` — what each feature exports
4. `src/server/utils/supabase.ts` — server DB access pattern
5. `src/server/utils/adminContext.ts` — server-side authorization

### Where to Make Changes

| Task | Location |
|------|----------|
| New entity type | `src/types/models.ts` + new feature module |
| New API endpoint | `src/server/api/` |
| New page | `src/pages/` |
| Shared UI component | `src/components/ui/` |
| Feature-specific component | `src/features/{name}/components/` |
| Store state/actions | `src/features/{name}/composables/use{Name}Store.ts` |
| API HTTP logic | `src/features/{name}/services/` |
| Email templates | `src/server/utils/emailTemplates.ts` |
| Role/permission logic | `src/composables/useRole.ts` (client), `src/server/utils/adminContext.ts` (server) |
| Theme/colors | `src/assets/css/base/` and `tailwind.config.js` |

### Areas Requiring Extra Caution

1. **Booking creation** (`src/server/api/bookings.post.ts`): Modifies `total_inventory` — changes must maintain atomicity
2. **Auth middleware** (`src/middleware/auth.ts`): Guards all protected routes
3. **Supabase schema** (`tirthlok.*`): Server uses service key bypassing RLS; validate data in server routes
4. **JWT claim decoding**: `useRole.ts` (client) and `adminContext.ts` (server) must stay in sync
5. **`init-store.ts` plugin**: Runs on both SSR and client — side effects affect all page renders
6. **`nuxt.config.ts` imports.dirs**: Must include a feature's composables dir for auto-import to work

### Conventions AI Must Follow
- **Never call API service composables from Vue components** — always go through a Pinia store action
- **Never add sample data fallbacks** — all routes return proper HTTP errors (404/500)
- **Never create `~/stores/*.ts` wrappers** — add the feature composable dir to `nuxt.config.ts` instead
- **Never add `~/composables/useXxx.ts` re-export shims** — same as above
- **All new server routes must validate auth** for any write operations
- **Data transformation** belongs in the server route or API service, not in components

---

## Known Constraints

1. **No test suite** — zero test coverage
2. **No CI/CD** — no automated build or deploy pipeline
3. **Supabase dependency** — app is non-functional without valid Supabase credentials
4. **Route cache** (`/tirth/**` cached 1 hour) — data updates won't be visible immediately
5. **`noUnusedLocals: true`** — TypeScript errors on unused imports
6. **Duplicate auto-import warning** — `features/auth/composables/index.ts` re-exports the same composables as the individual files; Nuxt emits a "Duplicated imports" warning at build time but it is harmless

---

## Important Files

| File | Why Important |
|------|--------------|
| `src/types/models.ts` | Single source of truth for all entity types |
| `nuxt.config.ts` | Framework config, auto-import dirs, route caching, env vars |
| `src/server/utils/supabase.ts` | All server Supabase client creation |
| `src/server/utils/adminContext.ts` | Server-side role authorization |
| `src/features/auth/composables/useAuth.ts` | Client auth state, session management |
| `src/features/auth/composables/useSupabase.ts` | Client Supabase singleton |
| `src/composables/useRole.ts` | Client-side role/permission derived state |
| `src/server/api/bookings.post.ts` | Core booking creation with inventory management |
| `src/stores/adminMode.ts` | Admin panel access control |

---

## Project Overview

**TirthLok** (`package.json` name: `jain-tirth-explorer`) is a full-stack web application for exploring Jain pilgrimage locations. It provides:

- A browsable directory of Jain Tirths (temples) with detailed information (idols, timings, festivals, history)
- Dharamshala (accommodation) listings with room inventory and booking
- Bhojanshala (dining) listings
- User wishlist/favorites
- Booking management with invoice generation and email notifications
- A role-based admin panel for super admins and property managers

---

## Business Purpose

The application serves the Jain community as a pilgrimage planning tool. Core user journeys:

1. **Discover** → Browse/filter Tirths by sect, state, type, or search
2. **Plan** → View detailed Tirth pages (timings, facilities, events, map)
3. **Book** → Reserve rooms at nearby Dharamshalas
4. **Track** → Manage bookings, view invoices, save favorites

> **Note**: `docs/SUPABASE_ARCHITECTURE.md` is outdated. Do not use it as a reference. The authoritative source for database architecture is the actual server routes under `src/server/api/` and the utility clients in `src/server/utils/supabase.ts`.

---

## Architecture Overview

- **Type**: Full-stack SSR monolith
- **Framework**: Nuxt 3 (SSR enabled, `ssr: true` in `nuxt.config.ts`)
- **Source root**: All application code lives under `src/` (`srcDir: 'src/'`)
- **Database**: Supabase (PostgreSQL) with a custom `tirthlok` schema
- **Pattern**: Feature-module architecture under `src/features/`; legacy store files in `src/stores/` re-export from features

### Dual Supabase Client Pattern
The server uses **two distinct Supabase clients** (`src/server/utils/supabase.ts`):

| Client | Function | Schema | Use |
|--------|----------|--------|-----|
| `getSupabaseAdmin()` | Auth operations | `public` | User auth, session validation |
| `getSupabaseTirthlok()` | All data operations | `tirthlok` | All business data tables |

---

## Repository Structure

```
/
├── nuxt.config.ts          # Framework configuration (SSR, modules, runtimeConfig)
├── tailwind.config.js      # Design system tokens (CSS variables → Tailwind)
├── tsconfig.json           # TypeScript (strict mode, path aliases ~/* and @/*)
├── package.json            # Dependencies and npm scripts
├── docs/
│   └── SUPABASE_ARCHITECTURE.md  # ⚠️ Outdated — do not rely on this file
└── src/
    ├── app.vue             # Root component (NuxtLayout + NuxtPage + BottomNav)
    ├── assets/
    │   └── css/
    │       ├── main.css    # Entry: imports base, pages, Tailwind
    │       └── base/       # CSS custom properties (theme variables)
    ├── components/
    │   ├── admin/          # AdminBanner.vue (shown to admins in layout)
    │   ├── layout/
    │   │   └── header/     # Header.vue, SearchSuggestions.vue
    │   └── ui/
    │       ├── cards/      # BaseCard.vue (entity-agnostic card)
    │       ├── carousel/   # ImageCarousel.vue
    │       ├── buttons/    # WishlistButton, etc.
    │       ├── filters/    # FilterPanel, SearchBox
    │       ├── hero/       # HeroSection components
    │       └── navigation/ # Navigation components
    ├── composables/
    │   ├── useAuth.ts      # Re-exports from features/auth
    │   ├── useRole.ts      # JWT role extraction (super_admin/manager/customer)
    │   ├── useSupabase.ts  # Re-exports from features/auth
    │   ├── api/            # Legacy API composables (re-export from features)
    │   └── ui/             # useFilter, useSearch, usePagination, useGrouping
    ├── features/           # PRIMARY FEATURE MODULES
    │   ├── auth/           # Supabase auth, customer profile, session
    │   ├── tirth/          # Tirth data, store, API service
    │   ├── dharamshala/    # Dharamshala data, rooms, booking logic
    │   ├── bhojanshala/    # Bhojanshala data and store
    │   └── wishlist/       # Wishlist state and API
    ├── layouts/
    │   └── default.vue     # Header + AdminBanner + slot + Footer
    ├── middleware/
    │   └── auth.ts         # Route guard: redirects unauthenticated to /auth/login
    ├── pages/              # File-based routing
    │   ├── index.vue       # Home (hero + featured tirths)
    │   ├── tirth.vue       # Tirth list with filters/grouping
    │   ├── tirth/[id].vue  # Tirth detail
    │   ├── dharamshala.vue / dharamshala/[id].vue
    │   ├── bhojanshala.vue / bhojanshala/[id].vue
    │   ├── bookings/       # User booking list and detail
    │   ├── invoice/[bookingId].vue
    │   ├── profile.vue     # Customer profile management
    │   ├── settings.vue
    │   ├── auth/           # login.vue, forgot-password.vue, reset-password.vue
    │   └── admin/          # index.vue, bookings.vue, rooms.vue, managers.vue
    ├── plugins/
    │   ├── init-store.ts          # SSR: pre-fetches tirth list on startup
    │   ├── init-auth.client.ts    # Client: restores auth session, syncs wishlist
    │   ├── theme.client.ts        # Client: loads saved theme from localStorage
    │   ├── error-handler.ts       # Server error handler
    │   ├── error-handler.client.ts
    │   ├── route-logger.client.ts
    │   └── scroll.client.ts
    ├── server/
    │   ├── api/            # Nuxt server routes
    │   │   ├── tirth/      # GET /api/tirth, GET /api/tirth/:id, filter-options
    │   │   ├── dharamshala/ # GET /api/dharamshala, GET /api/dharamshala/:id
    │   │   ├── bhojanshala/
    │   │   ├── bookings/   # GET /api/bookings/:id, PATCH /api/bookings/:id
    │   │   ├── bookings.post.ts   # POST /api/bookings (create booking)
    │   │   ├── wishlist/   # Wishlist CRUD
    │   │   ├── wishlist.get.ts / wishlist.post.ts
    │   │   ├── events/
    │   │   ├── invoice/[bookingId].get.ts
    │   │   └── admin/      # stats, bookings, managers, rooms
    │   └── utils/
    │       ├── supabase.ts        # Server Supabase clients + getUserIdFromEvent
    │       ├── adminContext.ts    # JWT role extraction for server-side auth
    │       ├── email.ts           # Resend email: booking confirm, admin notify
    │       ├── emailTemplates.ts  # HTML email templates
    │       └── sampleData.ts      # Legacy sample data (mostly unused)
    ├── stores/             # DEPRECATED wrappers — re-export from features
    │   ├── tirth.ts        # → features/tirth/composables/useTirthStore
    │   ├── dharamshala.ts  # → features/dharamshala
    │   ├── bhojanshala.ts  # → features/bhojanshala
    │   ├── theme.ts        # useThemeStore (dark/light mode)
    │   ├── adminMode.ts    # useAdminModeStore (admin panel toggle)
    │   └── visited.ts
    ├── types/
    │   └── models.ts       # All TypeScript interfaces for the domain
    └── utils/              # General utility functions
```

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Nuxt 3 | ^3.8.0 |
| UI | Vue 3 | ^3.3.0 |
| State | Pinia | ^2.1.6 |
| CSS | Tailwind CSS | ^6.10.0 |
| Database | Supabase (PostgreSQL) | ^2.87.1 |
| Icons | lucide-vue-next | ^0.292.0 |
| Maps | Leaflet | ^1.9.4 |
| Email | Resend | ^6.12.4 |
| Language | TypeScript | ^5.3.0 (strict) |
| Linting | ESLint + Prettier | — |

---

## Application Startup Flow

### Server-Side (SSR)
1. Nuxt boots, evaluates `nuxt.config.ts`
2. Plugin `src/plugins/init-store.ts` runs — calls `tirthStore.fetchTirths()` to pre-populate tirth data before pages render
3. Request hits Nuxt server → matches `src/pages/**/*.vue` file-based route
4. Page component runs `useAsyncData()` for its specific data
5. Rendered HTML sent to client with hydration payload

### Client-Side Hydration
1. Vue hydrates the SSR payload
2. Plugin `src/plugins/theme.client.ts` runs — reads `localStorage.appTheme` and applies dark/light class
3. Plugin `src/plugins/init-auth.client.ts` runs:
   - Calls `useAuth().initialize()` to restore Supabase session
   - If authenticated, calls `wishlistStore.fetchWishlist()`
   - Sets up `supabase.auth.onAuthStateChange` listener for session sync

---

## Frontend Architecture

### Routing
File-based routing via Nuxt pages. Key routes:

| Route | File | Notes |
|-------|------|-------|
| `/` | `src/pages/index.vue` | Home + featured tirths |
| `/tirth` | `src/pages/tirth.vue` | Tirth list with grouping/filters |
| `/tirth/:id` | `src/pages/tirth/[id].vue` | Detail page |
| `/dharamshala` | `src/pages/dharamshala.vue` | Accommodation list |
| `/dharamshala/:id` | `src/pages/dharamshala/[id].vue` | Detail + room booking |
| `/bhojanshala` | `src/pages/bhojanshala.vue` | Dining list |
| `/bookings` | `src/pages/bookings/index.vue` | User's booking history |
| `/bookings/:id` | `src/pages/bookings/[id].vue` | Booking detail |
| `/invoice/:bookingId` | `src/pages/invoice/[bookingId].vue` | Printable invoice |
| `/profile` | `src/pages/profile.vue` | Customer profile |
| `/auth/login` | `src/pages/auth/login.vue` | Sign in / sign up |
| `/auth/forgot-password` | — | Password reset flow |
| `/admin` | `src/pages/admin/index.vue` | Admin dashboard |
| `/admin/bookings` | `src/pages/admin/bookings.vue` | Manage bookings |
| `/admin/rooms` | `src/pages/admin/rooms.vue` | Manage room inventory |
| `/admin/managers` | `src/pages/admin/managers.vue` | Manage managers |

**Route caching** (defined in `nuxt.config.ts`):
- `/` → 60 seconds
- `/tirth/**` → 1 hour

**Protected routes** use the `auth` middleware (`src/middleware/auth.ts`) which calls `useAuth().initialize()` and redirects to `/auth/login?redirect=<path>` if not fully authenticated.

### Layout
`src/layouts/default.vue` wraps all pages:
```
<Header />
<AdminBanner />  ← only visible to admins
<slot />         ← page content
<Footer />
```

`src/app.vue` adds `<BottomNav />` outside the layout for mobile navigation.

### Component Organization

**Reusable UI** (`src/components/ui/`):
- `cards/BaseCard.vue` — entity-agnostic card. Props: `item`, `cardType` (`'tirth'|'dharamshala'|'bhojanshala'`), `showWishlist`, `showDetails`, `variant` (`'default'|'featured'`), `imageHeight`, `tagFields`, `routePrefix`
- `carousel/ImageCarousel.vue` — image gallery with dot indicator
- `buttons/WishlistButton.vue` — heart toggle button, integrates with `useWishlistStore`
- `filters/FilterPanel.vue` + `filters/SearchBox.vue` — filtering UI

**Feature components** live inside their feature module:
- `src/features/tirth/components/` — `TirthAbout.vue`, `TirthFacilities.vue`, `TirthEvents.vue`
- `src/features/dharamshala/components/` — `RoomCard.vue`, `RoomBookingModal.vue`
- `src/features/wishlist/components/` — `WishlistButton.vue`

### State Management (Pinia)

All stores follow a consistent pattern: `defineStore` with `state`, `getters`, `actions`.

| Store | Location | Purpose |
|-------|----------|---------|
| `useTirthStore` | `features/tirth/composables/useTirthStore.ts` | Tirth list, filters, pagination |
| `useDharamshalaStore` | `features/dharamshala/composables/` | Dharamshala list |
| `useBhojanshalaStore` | `features/bhojanshala/composables/` | Bhojanshala list |
| `useWishlistStore` | `features/wishlist/composables/` | User favorites |
| `useThemeStore` | `stores/theme.ts` | Dark/light mode |
| `useAdminModeStore` | `stores/adminMode.ts` | Admin panel visibility toggle |
| `useVisitedStore` | `features/tirth/composables/useVisitedStore.ts` | Visited tirths |

**Rule**: Components always call store actions. Never call API composables from components directly.

### Theme System
- Dark/light mode via `useThemeStore` (Pinia)
- Theme persisted in `localStorage.appTheme`
- Applied as `.dark` class on `<html>` element
- CSS custom properties defined in `src/assets/css/base/` drive Tailwind semantic tokens

---

## Backend Architecture

### Server Routes (Nuxt H3)

All server API lives under `src/server/api/`. Each file maps to an HTTP route:

```
src/server/api/tirth/index.get.ts    → GET  /api/tirth
src/server/api/tirth/[id].get.ts     → GET  /api/tirth/:id
src/server/api/dharamshala/index.get.ts → GET /api/dharamshala
src/server/api/dharamshala/[id].get.ts  → GET /api/dharamshala/:id
src/server/api/bookings.post.ts      → POST /api/bookings
src/server/api/bookings/[id].get.ts  → GET  /api/bookings/:id
src/server/api/bookings/[id].patch.ts → PATCH /api/bookings/:id
src/server/api/bookings/my.get.ts    → GET  /api/bookings/my
src/server/api/wishlist.get.ts       → GET  /api/wishlist
src/server/api/wishlist.post.ts      → POST /api/wishlist
src/server/api/invoice/[bookingId].get.ts → GET /api/invoice/:bookingId
src/server/api/admin/stats.get.ts    → GET  /api/admin/stats
src/server/api/admin/bookings.get.ts → GET  /api/admin/bookings
src/server/api/admin/rooms.get.ts    → GET  /api/admin/rooms
src/server/api/admin/managers.get.ts → GET  /api/admin/managers
src/server/api/admin/managers.post.ts → POST /api/admin/managers
```

### Server-Side Authentication

Every protected endpoint extracts the user from the `Authorization: Bearer <token>` header:

```typescript
// src/server/utils/supabase.ts
const userId = await getUserIdFromEvent(event)
if (!userId) throw createError({ statusCode: 401, ... })
```

Admin endpoints use `requireAdmin(event)` or `requireSuperAdmin(event)` from `src/server/utils/adminContext.ts`, which decodes the JWT to extract `user_role`, `manager_type`, `dharamshala_id`, and `tirth_id` claims.

### Email System
`src/server/utils/email.ts` uses **Resend** to send:
- `sendBookingConfirmation()` — sent to the guest after booking
- `sendAdminNotification()` — sent to `RESEND_ADMIN_EMAIL` after booking
- `sendCancellationEmail()` — sent when booking is cancelled

Email failures are caught and logged but **never block the primary operation**.

---

## Data Flow

### Public Browse Flow
```
User visits /tirth
  → SSR: init-store.ts plugin calls tirthStore.fetchTirths()
  → tirthStore calls $fetch('/api/tirth?page=1&limit=10')
  → server/api/tirth/index.get.ts queries Supabase tirthlok.tirth_cards
  → Supabase returns rows
  → Handler transforms rows to Tirth model
  → tirthStore.tirths populated
  → tirth.vue renders cards using BaseCard component
```

### Booking Flow
```
User selects room on /dharamshala/:id
  → RoomBookingModal opens (features/dharamshala/components/RoomBookingModal.vue)
  → useRoomBooking composable manages local form state
  → On submit: $fetch('POST /api/bookings', { Authorization: Bearer <token> })
  → server/api/bookings.post.ts:
      1. Validates JWT → getUserIdFromEvent()
      2. Validates input fields and dates
      3. Verifies room exists in tirthlok.room_types
      4. Checks total_inventory > 0
      5. INSERT into tirthlok.bookings
      6. DECREMENT room_types.total_inventory
      7. Calls sendBookingConfirmation() + sendAdminNotification()
  → Returns booking record
  → UI redirects to /bookings/:id
```

### Auth Flow
```
User visits /auth/login
  → Enters email + password
  → useAuth().signIn() calls supabase.auth.signInWithPassword()
  → Supabase returns session with JWT containing user_role claim
  → onAuthStateChange fires → currentSession updated
  → wishlistStore.fetchWishlist() called
  → User redirected to intended page (from ?redirect= query)

Protected route access:
  → middleware/auth.ts runs on navigation
  → useAuth().initialize() restores existing session
  → If isFullyAuthenticated === false → redirect to /auth/login
```

---

## Authentication & Authorization

### Auth Provider
Supabase Auth (email/password). The client-side Supabase instance stores session in `sessionStorage` (configured in `features/auth/composables/useSupabase.ts`).

### Password Recovery
Special `isRecoveryMode` flag in `useAuth` prevents full access during password reset. Detected from URL hash (`type=recovery`) or `sessionStorage.isRecoveryMode`. Cleared after `USER_UPDATED` event.

### Role System (JWT Claims)
Roles are embedded as custom JWT claims by Supabase:

| Claim | Values | Source |
|-------|--------|--------|
| `user_role` | `'customer'`, `'manager'`, `'super_admin'` | Supabase JWT |
| `manager_type` | `'tirth'`, `'dharamshala'`, `'both'`, `null` | Supabase JWT |
| `tirth_id` | string or null | Supabase JWT |
| `dharamshala_id` | string or null | Supabase JWT |

**Client-side** role reading: `src/composables/useRole.ts` decodes `session.value.access_token` (base64 JWT).

**Server-side** role reading: `src/server/utils/adminContext.ts` decodes `Authorization` header token.

### Admin Access
- `useAdminModeStore.isAdminMode` toggles the admin panel UI
- `canAccessAdmin` requires `isAdmin` (manager or super_admin)
- Managers see only their own property's data (filtered by `dharamshala_id` from JWT)
- Super admins see all data

---

## Database Architecture

### Schema: `tirthlok` (private data)
All business tables live in the `tirthlok` PostgreSQL schema. Key tables:

| Table | Purpose |
|-------|---------|
| `tirth_cards` | Core tirth listing data (name, location, sect, images) |
| `tirth_details` | Extended tirth detail data (history, architecture, idols) |
| `tirth_events` | Festival and event data per tirth |
| `dharamshala_cards` | Dharamshala listing data |
| `dharamshala_details` | Extended dharamshala data |
| `room_types` | Room inventory with pricing (UUID PK: `room_type_id`) |
| `bookings` | Booking records (linked to user_id, dharamshala, room) |
| `invoices` | Invoice records linked to bookings |
| `customer_profile` | Extended user profile data |
| `customer_wishlist` | User wishlist (entity_type + tirth_id/dharamshala_id) |

### Schema: `public` (secure access layer)
Views and RPC functions the frontend uses directly (inferred from `src/features/auth/composables/useCustomerProfile.ts` and wishlist composables):
- `public.v_customer_profile` — filtered view of current user's profile
- `public.v_customer_wishlist` — filtered view of current user's wishlist
- `public.create_customer_profile(...)` — RPC to create profile
- `public.update_customer_profile(...)` — RPC to update profile
- `public.add_to_wishlist(p_tirth_name)` — RPC for wishlist add
- `public.remove_from_wishlist(p_tirth_name)` — RPC for wishlist remove

> Verify actual schema, RLS policies, and RPC signatures in the Supabase dashboard — do not rely on `docs/SUPABASE_ARCHITECTURE.md`.

### Tirth ID Format
Tirth records use structured IDs: `TL-{STATE_CODE}-{NNNN}` (e.g., `TL-GJ-0001`). The server route accepts both ID and name resolution (see `src/server/api/tirth/[id].get.ts`).

---

## API Architecture

### Client → Server Communication
All client-to-backend calls use Nuxt's auto-imported `$fetch()`. The base URL is configured via `runtimeConfig.public.apiBaseUrl` (defaults to `/api/v1`).

### API Composables (Service Layer)
Located in `src/features/*/services/` and `src/composables/api/`:

- `useTirthApi` — `fetchTirths(params)`, `fetchTirthById(id)`
- `useDharamshalaApi` — `fetchDharamshalas()`, `fetchDharamshalaById(id)`
- `useBhojanshalaApi` — `fetchBhojanshalas()`
- `useRoomBookingApi` — `createBooking(data)`, `getUserBookings()`, `cancelBooking(id)`
- `useWishlistApi` — `getWishlist()`, `addToWishlist(id, type)`, `removeFromWishlist(id, type)`
- `useEventsApi` — `fetchEventsByTirthId(id)`

**Note**: `src/composables/api/useTirthApi.ts` is a legacy file containing the same transformation logic as `src/features/tirth/services/tirthApi.ts`. The features directory version is canonical.

### Response Transformation
Raw Supabase rows are transformed to TypeScript models in both server routes and API composables. Key transformations:
- `mool_nayak` JSON field → `Idol[]` array (handled by `parseMoolNayak()`)
- `tirth_tags` string/JSON → `string[]` (handled by `parseTags()`)
- Image fields: parsed from JSON string if stored as string

---

## Shared Libraries

No separate npm packages. Shared code is:
- **Types**: `src/types/models.ts` — single source of truth for all entity interfaces
- **UI Composables**: `src/composables/ui/` — `useFilter<T>()`, `useSearch()`, `usePagination()`, `useGrouping()`, `useTabNavigation()`
- **Server Utils**: `src/server/utils/` — Supabase clients, auth helpers, email utilities

---

## Configuration & Environment Variables

Environment variables are loaded from `.env` (gitignored). Required variables:

### Public (exposed to client via `runtimeConfig.public`)
| Variable | Purpose |
|----------|---------|
| `NUXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (for client auth) |
| `NUXT_PUBLIC_MAPBOX_TOKEN` | Mapbox token for maps |
| `NUXT_PUBLIC_API_BASE_URL` | API base path (default: `/api/v1`) |

### Private (server-side only)
| Variable | Purpose |
|----------|---------|
| `SUPABASE_SERVICE_KEY` | Supabase service role key (bypasses RLS) |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `RESEND_FROM_EMAIL` | Sender address (default: `bookings@tirthlok.in`) |
| `RESEND_ADMIN_EMAIL` | Admin notification recipient |

---

## Development Workflow

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev        # Start dev server at http://localhost:3000
```

Requires `.env` file with Supabase credentials. Without credentials, the app will throw on any data fetch.

### Building
```bash
npm run build      # SSR production build (outputs to .output/)
npm run preview    # Preview production build
npm run generate   # Static site generation (not typical for this app)
```

### Linting
```bash
npm run lint       # ESLint check (config: .eslintrc.json)
npm run format     # Prettier auto-fix (config: .prettierrc)
```

ESLint uses `eslint-config-prettier` to avoid conflicts with Prettier.
Stylelint config exists at `.stylelintrc.json` for CSS.

### Testing
No test framework is configured in `package.json`. There are no test files in the repository.

---

## CI/CD Pipeline

No `.github/workflows/` CI files exist. No `Dockerfile` or `docker-compose` found in the repository.

---

## Deployment Architecture

Not documented in the codebase. The `.output/` directory (gitignored) is the Nuxt SSR build output, compatible with Node.js hosting (e.g., Vercel, Railway, Render).

---

## Coding Conventions

### Naming
- **Files**: `camelCase.ts` for composables/stores, `PascalCase.vue` for components
- **Composables**: prefix `use` (e.g., `useTirthStore`, `useFilter`)
- **Stores**: defined with `defineStore('storeName', ...)` — name matches the composable name
- **Types/Interfaces**: `PascalCase` in `src/types/models.ts`
- **Server routes**: file name = HTTP method suffix (`.get.ts`, `.post.ts`, `.patch.ts`)

### Imports
- Use `~/*` alias for `src/` (e.g., `import type { Tirth } from '~/types/models'`)
- Nuxt auto-imports composables from `src/composables/` and `src/stores/`
- Feature modules export via `index.ts` barrel files

### TypeScript
- `strict: true` — no implicit `any`, strict null checks
- All entity data uses typed interfaces from `src/types/models.ts`
- Server-side raw data typed as `any` and transformed before returning

### Component Pattern
```vue
<template>...</template>
<script setup lang="ts">
// Composition API with <script setup>
const store = useTirthStore()
const data = computed(() => store.tirths)
</script>
```

### Feature Module Structure
Each feature follows this layout:
```
features/{name}/
├── index.ts          # Barrel exports for the feature
├── components/       # Vue components (feature-specific)
├── composables/      # Pinia stores for this feature
└── services/         # API composables ($fetch wrappers)
```

---

## Common Development Tasks

### Adding a New Entity (e.g., "Gaushala")
1. Add TypeScript interface to `src/types/models.ts`
2. Create Pinia store: `src/features/gaushala/composables/useGaushalaStore.ts`
3. Create API service: `src/features/gaushala/services/gaushalaApi.ts`
4. Create barrel: `src/features/gaushala/index.ts`
5. Add server routes: `src/server/api/gaushala/index.get.ts`, `[id].get.ts`
6. Create pages: `src/pages/gaushala.vue`, `src/pages/gaushala/[id].vue`
7. Use `BaseCard` with `cardType="gaushala"` prop

### Adding a Server API Route
- Create `src/server/api/{path}.{method}.ts`
- Use `getSupabaseTirthlok()` for data queries
- Use `getUserIdFromEvent(event)` for auth-protected routes
- Use `requireAdmin(event)` for admin-only routes
- Return plain objects (auto-serialized to JSON)

### Adding a Store Action
```typescript
// In features/{name}/composables/use{Name}Store.ts
actions: {
  async fetchItems() {
    this.loading = true
    try {
      const data = await $fetch('/api/{name}')
      this.items = data
    } catch (e) {
      this.error = 'Failed to load'
    } finally {
      this.loading = false
    }
  }
}
```

### Adding a Protected Page
Add `definePageMeta({ middleware: 'auth' })` at the top of the page `<script setup>`:
```typescript
definePageMeta({ middleware: 'auth' })
```

### Modifying Booking Logic
- Server: `src/server/api/bookings.post.ts` (creation) and `src/server/api/bookings/[id].patch.ts` (status updates)
- Email: `src/server/utils/email.ts`
- Client state: `src/features/dharamshala/composables/useRoomBooking.ts`

---

## Debugging Guide

### Data Not Loading
1. Check `.env` has `NUXT_PUBLIC_SUPABASE_URL` and `NUXT_PUBLIC_SUPABASE_ANON_KEY`
2. Check browser console for Supabase connection errors from `useSupabase.ts`
3. Check network tab for `/api/tirth` response
4. Check `init-store.ts` plugin logs: `🔌 Plugin: ...`

### Auth Issues
1. Check browser console for `[Auth]` prefixed logs from `useAuth.ts`
2. Verify Supabase project has email auth enabled
3. `isRecoveryMode` flag may be stuck — clear `sessionStorage.isRecoveryMode`

### Admin Panel Not Visible
1. User must have `user_role = 'super_admin'` or `'manager'` in JWT claims
2. Must call `useAdminModeStore().enterAdminMode()` after auth
3. Check `AdminBanner.vue` — it reads from `useAdminModeStore`

### Booking Failures
- `401` → Token missing or expired; check `Authorization` header
- `404 Room not found` → `room_type_id` mismatch in `tirthlok.room_types`
- `409 No inventory` → `total_inventory <= 0` in `room_types`
- Email failures are non-blocking (caught in try/catch in `email.ts`)

---

## AI Agent Instructions

### Files to Read First
1. `src/types/models.ts` — understand all data structures
2. `nuxt.config.ts` — understand routing, modules, env config
3. `src/features/{feature}/index.ts` — understand what each feature exports
4. `src/server/utils/supabase.ts` — understand how server DB access works
5. `src/server/utils/adminContext.ts` — understand server-side authorization

### Where to Make Changes

| Task | Location |
|------|----------|
| New entity type | `src/types/models.ts` + new feature module |
| New API endpoint | `src/server/api/` (new `.method.ts` file) |
| New page | `src/pages/` (file = route) |
| Shared UI component | `src/components/ui/` |
| Feature-specific component | `src/features/{name}/components/` |
| Store state/actions | `src/features/{name}/composables/use{Name}Store.ts` |
| API HTTP logic | `src/features/{name}/services/` |
| Email templates | `src/server/utils/emailTemplates.ts` |
| Role/permission logic | `src/composables/useRole.ts` (client), `src/server/utils/adminContext.ts` (server) |
| Theme/colors | `src/assets/css/base/` (CSS vars) and `tailwind.config.js` |

### Areas Requiring Extra Caution

1. **Booking creation** (`src/server/api/bookings.post.ts`): Modifies `total_inventory` — any change must maintain atomicity
2. **Auth middleware** (`src/middleware/auth.ts`): Guards all protected routes — test redirect logic carefully
3. **Supabase schema** (`tirthlok.*`): Server uses service key bypassing RLS; data validation must happen in server routes
4. **JWT claim decoding**: Both `useRole.ts` (client) and `adminContext.ts` (server) decode JWT manually — must stay in sync with Supabase custom claims
5. **`init-store.ts` plugin**: Runs on both SSR and client — side effects here affect all page renders
6. **`useSupabase.ts` singleton**: Module-level `supabaseInstance` — reset to `null` is not supported; restart dev server if credentials change

### Conventions AI Must Follow
- **Never call API composables from Vue components** — always go through a Pinia store action
- **Never add client-side storage** (localStorage/sessionStorage/cookies) except where already used (theme, auth recovery mode)
- **Never modify CSS or Tailwind classes** unless explicitly asked
- **Keep store files in `src/features/`** — the `src/stores/*.ts` wrappers are deprecated; only add new stores under the relevant feature
- **All new server routes must validate auth** for any write operations
- **Data transformation** (raw DB row → TypeScript model) belongs in the server route or API service, not in components

---

## Important Files

| File | Why Important |
|------|--------------|
| `src/types/models.ts` | Single source of truth for all entity types |
| `nuxt.config.ts` | Framework config, route caching, env vars |
| `src/server/utils/supabase.ts` | All server Supabase client creation |
| `src/server/utils/adminContext.ts` | Server-side role authorization |
| `src/features/auth/composables/useAuth.ts` | Client auth state, session management |
| `src/features/auth/composables/useSupabase.ts` | Client Supabase singleton |
| `src/composables/useRole.ts` | Client-side role/permission derived state |
| `src/server/api/bookings.post.ts` | Core booking creation with inventory management |
| `src/stores/adminMode.ts` | Admin panel access control |

---

## Known Constraints

1. **No test suite** — zero test coverage; changes carry risk of regression
2. **No CI/CD** — no automated build or deploy pipeline
3. **Supabase dependency** — app is non-functional without valid Supabase credentials
4. **Singleton Supabase client** — `useSupabase.ts` uses module-level singleton; not safe for multi-tenant SSR (mitigated by `persistSession: false` on server client)
5. **Route cache** (`/tirth/**` cached for 1 hour) — Tirth detail updates won't be visible immediately after Supabase data changes
6. **`noUnusedLocals: true` in tsconfig** — TypeScript will error on unused imports; clean up carefully when refactoring

---

## Technical Debt

1. **Duplicate API service files**: `src/composables/api/useTirthApi.ts` is a copy of `src/features/tirth/services/tirthApi.ts` — the `src/composables/api/` directory is legacy. New code should only use `src/features/*/services/`.
2. **`src/stores/*.ts` wrappers**: Most files in `src/stores/` are one-liner re-exports marked `@deprecated`. New stores go in feature modules.
3. **`sampleData.ts`** (`src/server/utils/sampleData.ts`): Legacy sample data file, likely unused — verify before deleting.
4. **`debug-details.js` / `debug-schema.js`** at root: Development debug scripts — not part of the application, should be cleaned up.
5. **No error boundary components**: Error states are handled ad-hoc per page (v-if="error"), not via a centralized error component.

---

## Assumptions Made

- The Supabase database schema matches what is documented in `docs/SUPABASE_ARCHITECTURE.md` and inferred from server routes — no direct schema inspection was performed
- The `src/server/utils/sampleData.ts` file is unused in production (no imports found in server routes)
- Bhojanshala has no dedicated components directory (only `composables/` and `services/`) — the listing uses generic `BaseCard`
- Mapbox (`NUXT_PUBLIC_MAPBOX_TOKEN`) is configured but no map component was found in the explored files; Leaflet (`leaflet` package) may be used instead

## Areas Requiring Human Verification

- Actual Supabase table columns and RLS policies (must be verified in the Supabase dashboard — `docs/SUPABASE_ARCHITECTURE.md` is outdated and should not be used)
- Whether `src/composables/api/` is fully dead code or still consumed somewhere
- Deployment target and hosting configuration
- Whether `debug-details.js` and `debug-schema.js` at the root are safe to delete
- Email delivery configuration (Resend domain verification status)

## Confidence Rating

| Section | Confidence |
|---------|-----------|
| Project Overview & Purpose | High |
| Repository Structure | High |
| Technology Stack | High |
| Frontend Architecture | High |
| Backend Architecture | High |
| Data Flow | High |
| Authentication | High |
| Database Architecture | Medium (inferred from code, not live schema) |
| API Architecture | High |
| CI/CD & Deployment | Low (no config found) |
| Testing | High (confirmed: none) |
| Technical Debt | Medium (based on code review, not runtime behavior) |
