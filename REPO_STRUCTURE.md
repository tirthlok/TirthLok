# TirthLok — Repository Structure

> A Nuxt 3 (SSR) application for discovering and booking Jain pilgrimage sites (Tirth), dharamshalas, and bhojanshala facilities. Built with TypeScript, Tailwind CSS, Pinia stores, and Supabase as the backend.

---

## Table of Contents

- [Root Level](#root-level)
- [src/](#src)
  - [assets/](#assets)
  - [components/](#components)
  - [composables/](#composables)
  - [features/](#features)
  - [layouts/](#layouts)
  - [middleware/](#middleware)
  - [pages/](#pages)
  - [plugins/](#plugins)
  - [server/](#server)
  - [stores/](#stores)
  - [types/](#types)
- [Architecture Notes](#architecture-notes)

---

## Root Level

```
TirthLok/
├── nuxt.config.ts              # Nuxt framework config: SSR mode, modules, runtimeConfig,
│                               #   auto-imports, srcDir → "src/"
├── tailwind.config.js          # Design system tokens mapping CSS variables → Tailwind utilities
├── tsconfig.json               # TypeScript config: strict mode, path aliases ~/* and @/*
├── package.json                # npm scripts (dev, build, preview) and all dependencies
├── package-lock.json           # Locked dependency tree
├── .env                        # Environment variables (Supabase URLs, keys, etc.) — NOT committed
├── .eslintrc.json              # ESLint rules for code quality
├── .prettierrc                 # Prettier formatting config
├── .stylelintrc.json           # Stylelint rules for CSS/SCSS linting
├── .gitignore                  # Git ignore rules
├── .nuxtrc                     # Nuxt runtime config overrides
├── CLAUDE.md                   # AI assistant context: architecture decisions, patterns, conventions
├── REPO_STRUCTURE.md           # ← This file
├── README.md                   # Project overview, setup, and usage guide
├── build_debug.log             # Build debug output (local, not committed ideally)
├── build_debug_verbose.log     # Verbose build debug log
├── build_fail.log              # Build failure log
├── docs/                       # (Empty) Reserved for future documentation
└── .github/                    # (Empty) Reserved for GitHub Actions / issue templates
```

---

## `src/`

All application source code lives under `src/`. This is configured as the `srcDir` in `nuxt.config.ts`.

```
src/
├── app.vue                     # Root Vue component — sets up <NuxtLayout> and <NuxtPage>
├── assets/
├── components/
├── composables/
├── features/
├── layouts/
├── middleware/
├── pages/
├── plugins/
├── server/
├── stores/
└── types/
```

---

### `assets/`

Static assets processed by the Vite/Nuxt build pipeline.

```
src/assets/
├── css/
│   ├── main.css                # Global CSS entry point — imports base and page styles
│   ├── base/
│   │   ├── index.css           # Barrel: imports all base stylesheets
│   │   └── theme.css           # CSS custom properties (design tokens: colors, spacing, fonts)
│   └── pages/
│       ├── index.css           # Barrel: imports all page-level stylesheets
│       ├── auth.css            # Styles specific to auth pages (login, register, reset)
│       └── profile.css         # Styles specific to the user profile page
└── images/
    ├── logo-tirthlok.png           # Primary application logo
    ├── hero-jain-temple.png        # Homepage hero section background
    ├── auth-bg.png                 # Background for auth pages
    ├── discover.png                # "Discover" section image (homepage)
    ├── explore.png                 # "Explore" section image (homepage)
    ├── stay.png                    # "Stay" section image (homepage)
    ├── cta-start-your-journey.png  # Call-to-action banner image
    └── jain-temple-placeholder.png # Fallback/placeholder for missing tirth images
```

---

### `components/`

Globally auto-imported Vue components (Nuxt auto-import). Organized by role/concern.

```
src/components/
├── admin/
│   ├── AdminAuthModal.vue     # Re-authentication modal for admin mode entry;
│   │                          #   validates password against Supabase, emits verified/cancelled
│   ├── AdminBanner.vue        # Banner shown in admin context; role indicator strip
│   └── TagInput.vue           # Reusable tag/chip input with add/remove;
│                              #   v-model string[] for lists (facilities, rules, tags)
│
├── layout/
│   ├── index.ts                # Barrel export for layout components
│   └── header/
│       ├── Header.vue          # Main site header: nav, search bar, user menu, mobile toggle;
│       │                       #   supports scroll-collapse behavior and dark/light theme
│       └── SearchSuggestions.vue  # Typeahead dropdown for the header search input
│
├── tirth/                      # (Empty) Tirth-specific components (reserved for future)
│
└── ui/
    ├── index.ts                # Barrel: exports all UI primitives
    ├── BottomNav.vue           # Mobile bottom navigation bar (4 tabs: Home, Explore, Wishlist, Profile)
    ├── Icon.vue                # SVG icon wrapper component — renders named icons
    ├── TirthCardSkeleton.vue   # Loading skeleton for tirth listing cards
    ├── cards/
    │   ├── BaseCard.vue        # Reusable card shell (image, title, meta slots)
    │   ├── types.ts            # TypeScript types for card props/slots
    │   └── composables/
    │       ├── useCard.ts      # Card-level reactive state and interactions
    │       └── useCardStyles.ts # Card styling utilities and computed classes
    ├── carousel/
    │   ├── ImageCarousel.vue   # Full-featured image carousel with prev/next controls
    │   └── composables/
    │       └── useImageCarousel.ts  # Carousel index, transition, and autoplay composable
    └── filters/
        ├── DharamshalaFilterPanel.vue  # Sidebar filter for dharamshala listings
        ├── TirthFilterPanel.vue        # Sidebar filter for tirth listings
        └── SearchBox.vue              # Standalone search input used in filter panels
```

---

### `composables/`

Global, cross-feature Vue composables (auto-imported by Nuxt).

```
src/composables/
├── useRole.ts                  # Resolves current user role (admin / manager / customer)
│                               #   — reads from auth store, exposes isAdmin, isManager, etc.
└── ui/
    ├── index.ts                # Barrel export
    ├── useFilter.ts            # Generic list filtering logic (query param ↔ reactive state)
    └── useGrouping.ts          # Groups flat arrays into categorized sections (used in listings)
```

---

### `features/`

Self-contained feature modules. Each feature owns its components, composables, services, and an `index.ts` barrel for clean imports.

```
src/features/
│
├── auth/
│   ├── index.ts                # Barrel export
│   └── composables/
│       ├── useAuth.ts          # Core auth: login, logout, register, session management
│       ├── useCustomerProfile.ts  # Fetch & update customer profile data
│       └── useSupabase.ts      # Client-side Supabase instance accessor
│
├── bhojanshala/
│   ├── index.ts                # Barrel export
│   ├── components/             # (Empty) Reserved for future bhojanshala-specific components
│   ├── composables/
│   │   └── useBhojanshalaStore.ts  # Reactive bhojanshala data: fetch, filter state
│   └── services/
│       └── bhojanshalaApi.ts   # API calls: GET /api/bhojanshala, GET /api/bhojanshala/[id]
│
├── dharamshala/
│   ├── index.ts                # Barrel export
│   ├── components/
│   │   ├── RoomCard.vue        # Individual room display card (image, type, price, availability)
│   │   └── RoomBookingModal.vue  # Full booking flow modal: date picker, guest count, confirmation
│   ├── composables/
│   │   ├── useDharamshalaStore.ts  # Reactive dharamshala data: fetch, filter, pagination state
│   │   └── useRoomBooking.ts       # Booking form state, validation, submission logic
│   └── services/
│       ├── dharamshalaApi.ts   # API calls: GET /api/dharamshala, GET /api/dharamshala/[id]
│       └── roomBookingApi.ts   # API calls: POST /api/bookings, GET /api/bookings/my
│
├── tirth/
│   ├── index.ts                # Barrel export
│   ├── components/
│   │   ├── index.ts            # Barrel for tirth components
│   │   ├── TirthAbout.vue      # Tirth detail: history, description, significance section
│   │   ├── TirthEvents.vue     # Tirth detail: upcoming events/festivals section
│   │   └── TirthFacilities.vue # Tirth detail: facilities grid (parking, water, food, etc.)
│   ├── composables/
│   │   ├── useTirthStore.ts    # Reactive tirth listing/detail data with filters
│   │   └── useVisitedStore.ts  # Tracks which tirths the user has viewed (local state)
│   └── services/
│       ├── tirthApi.ts         # API calls: GET /api/tirth, GET /api/tirth/[id]
│       └── eventsApi.ts        # API calls: GET /api/events (tirth events)
│
└── wishlist/
    ├── index.ts                # Barrel export
    ├── components/
    │   └── WishlistButton.vue  # Heart/bookmark toggle button to add/remove from wishlist
    ├── composables/
    │   └── useWishlistStore.ts # Reactive wishlist: fetch, optimistic add/remove
    └── services/
        └── wishlistApi.ts      # API calls: GET /api/wishlist, POST /api/wishlist,
                                #            DELETE /api/wishlist/[id]
```

---

### `layouts/`

Nuxt layout wrappers applied per-page via `definePageMeta({ layout: '...' })`.

```
src/layouts/
└── default.vue                 # Default layout: renders <Header>, <slot> (page content),
                                #   <BottomNav> for mobile; handles scroll restoration
```

---

### `middleware/`

Nuxt route middleware — runs before page navigation.

```
src/middleware/
└── auth.ts                     # Guards authenticated routes; redirects unauthenticated users
                                #   to /auth/login with ?redirect= query param
```

---

### `pages/`

File-based routing. Each `.vue` file maps directly to a URL route.

```
src/pages/
├── index.vue                   # / — Homepage: hero, featured tirths, categories, CTA sections
├── tirth.vue                   # /tirth — Tirth listing with filters and search
├── dharamshala.vue             # /dharamshala — Dharamshala listing with filters and search
├── bhojanshala.vue             # /bhojanshala — Bhojanshala listing page (top-level route)
├── profile.vue                 # /profile — User profile: details, avatar, preferences
├── settings.vue                # /settings — Account settings: password, notifications, etc.
│
├── tirth/
│   └── [id].vue                # /tirth/:id — Tirth detail page (about, events, facilities)
│
├── dharamshala/
│   └── [id].vue                # /dharamshala/:id — Dharamshala detail + room booking
│
├── bhojanshala/
│   ├── index.vue               # /bhojanshala — Bhojanshala listing with search, type/state
│   │                           #   filters, wishlist integration, and pagination
│   └── [id].vue                # /bhojanshala/:id — Bhojanshala detail page
│
├── bookings/
│   ├── index.vue               # /bookings — User's booking list (upcoming + past)
│   └── [id].vue                # /bookings/:id — Single booking detail/confirmation
│
├── invoice/
│   └── [bookingId].vue         # /invoice/:bookingId — Printable invoice for a booking
│
├── auth/
│   ├── login.vue               # /auth/login — Email + password sign-in form
│   ├── forgot-password.vue     # /auth/forgot-password — Request password reset email
│   └── reset-password.vue      # /auth/reset-password — Set new password (from email link)
│
└── admin/
    ├── index.vue               # /admin — Admin dashboard: stats overview
    ├── bookings.vue            # /admin/bookings — All bookings management table
    ├── bhojanshala.vue         # /admin/bhojanshala — Full CRUD management for
    │                           #   bhojanshala entries (add, edit, delete, meal timings,
    │                           #   facilities, tags); scoped by manager tirth assignment
    ├── managers.vue            # /admin/managers — Manager user management
    └── rooms.vue               # /admin/rooms — Room inventory management
```

---

### `plugins/`

Nuxt plugins — run once on app initialization. `.client.ts` = browser only; `.ts` = universal.

```
src/plugins/
├── init-auth.client.ts         # Initializes auth state from Supabase session on page load;
│                               #   sets up onAuthStateChange listener
├── init-store.ts               # Universal: pre-fetches initial store data (e.g. wishlist count)
├── error-handler.client.ts     # Client-side global error handler (Vue error boundary)
├── error-handler.ts            # Universal: Nuxt error hook for server-side errors
├── route-logger.client.ts      # Logs route changes to console in development
├── scroll.client.ts            # Restores scroll position on back-navigation
└── theme.client.ts             # Reads user theme preference (dark/light) and applies CSS class
```

---

### `server/`

Nuxt server routes (H3 event handlers). All API endpoints live here. Runs in Node.js.

```
src/server/
├── api/
│   ├── bookings.post.ts            # POST /api/bookings — Create a new booking; handles:
│   │                               #   room availability check, price calculation, ledger update,
│   │                               #   invoice creation, confirmation email dispatch
│   ├── wishlist.get.ts             # GET /api/wishlist — Fetch user's wishlist items
│   ├── wishlist.post.ts            # POST /api/wishlist — Add item to wishlist
│   │
│   ├── tirth/
│   │   ├── index.get.ts            # GET /api/tirth — List all tirths (with filters/pagination)
│   │   ├── [id].get.ts             # GET /api/tirth/:id — Single tirth detail + facilities
│   │   └── filter-options.get.ts   # GET /api/tirth/filter-options — Available filter values
│   │
│   ├── dharamshala/
│   │   ├── index.get.ts            # GET /api/dharamshala — List dharamshalas (with filters)
│   │   ├── [id].get.ts             # GET /api/dharamshala/:id — Dharamshala detail + rooms
│   │   └── [id]/
│   │       ├── rooms.get.ts        # GET /api/dharamshala/:id/rooms — Rooms for a dharamshala
│   │       ├── bookings.get.ts     # GET /api/dharamshala/:id/bookings — Bookings for a property
│   │       └── rooms/
│   │           └── availability.get.ts  # GET /api/dharamshala/:id/rooms/availability
│   │                                    #   — Check room availability for date range and guest count;
│   │                                    #   validates dates, resolves dharamshala ID, filters by capacity
│   │
│   ├── bhojanshala/
│   │   ├── index.get.ts            # GET /api/bhojanshala — List bhojanshala facilities
│   │   └── [id].get.ts             # GET /api/bhojanshala/:id — Single bhojanshala detail
│   │
│   ├── bookings/
│   │   ├── my.get.ts               # GET /api/bookings/my — Authenticated user's bookings
│   │   ├── [id].get.ts             # GET /api/bookings/:id — Single booking detail
│   │   └── [id].patch.ts           # PATCH /api/bookings/:id — Update booking status
│   │
│   ├── invoice/
│   │   └── [bookingId].get.ts      # GET /api/invoice/:bookingId — Fetch invoice data
│   │
│   ├── wishlist/
│   │   └── [id].delete.ts          # DELETE /api/wishlist/:id — Remove from wishlist
│   │
│   └── admin/
│       ├── stats.get.ts            # GET /api/admin/stats — Dashboard KPIs (counts, revenue)
│       ├── bookings.get.ts         # GET /api/admin/bookings — All bookings (admin view)
│       ├── bhojanshala.get.ts      # GET /api/admin/bhojanshala — List all bhojanshalas
│       │                           #   (admin view with tirth association + details join)
│       ├── bhojanshala.post.ts     # POST /api/admin/bhojanshala — Create new bhojanshala;
│       │                           #   validates BL-XX-0000 ID format, inserts card + details,
│       │                           #   rolls back card on detail failure
│       ├── managers.get.ts         # GET /api/admin/managers — List all manager accounts
│       ├── managers.post.ts        # POST /api/admin/managers — Create new manager account
│       ├── rooms.get.ts            # GET /api/admin/rooms — All rooms across properties
│       ├── rooms.post.ts           # POST /api/admin/rooms — Create new room type;
│       │                           #   validates required fields, price bounds, manager scoping
│       ├── bookings/
│       │   └── [id].patch.ts       # PATCH /api/admin/bookings/:id — Admin update booking
│       ├── managers/
│       │   ├── [id].patch.ts       # PATCH /api/admin/managers/:id — Update manager details
│       │   └── [id].delete.ts      # DELETE /api/admin/managers/:id — Hard-delete manager
│       │                           #   (super admin only)
│       ├── rooms/
│       │   ├── [id].patch.ts       # PATCH /api/admin/rooms/:id — Update room details
│       │   └── [id].delete.ts      # DELETE /api/admin/rooms/:id — Soft-delete room
│       │                           #   (sets is_active + is_available_ui = false); manager-scoped
│       └── bhojanshala/
│           ├── [id].patch.ts       # PATCH /api/admin/bhojanshala/:id — Update bhojanshala
│           │                       #   card + details fields; manager ownership check via tirth
│           └── [id].delete.ts      # DELETE /api/admin/bhojanshala/:id — Soft-delete
│                                   #   bhojanshala (sets is_active = false); manager-scoped
│
├── middleware/
│   └── session.ts                  # Runs on every server request.
│                                   #   Reads the HttpOnly Supabase cookie,
│                                   #   refreshes the token if expired,
│                                   #   attaches event.context.accessToken
│                                   #   and event.context.session for API routes.
│                                   #   Uses getSession() for extraction only —
│                                   #   getUserIdFromEvent() calls getUser() for
│                                   #   actual server-side verification.
│
└── utils/
    ├── supabase.ts                 # Dual Supabase client factory:
    │                               #   getSupabaseAdmin()    → public schema (auth operations)
    │                               #   getSupabaseTirthlok() → tirthlok schema (business data)
    ├── adminContext.ts             # Reads and validates admin context from request headers;
    │                               #   exports requireAdmin() and requireSuperAdmin()
    ├── email.ts                    # Email dispatch helper using Resend SDK
    └── emailTemplates.ts           # HTML email templates: booking confirmation, invoice, etc.
```

---

### `stores/`

Pinia global stores (auto-imported by Nuxt).

```
src/stores/
├── theme.ts                    # Dark/light mode preference; persisted to localStorage
└── adminMode.ts                # Admin mode toggle state with secure re-authentication;
                                #   manages auth states, idle timeout (30 min), exposes
                                #   isAdminMode, isSuperAdmin, enterAdminMode(), exitAdminMode()
```

---

### `types/`

Shared TypeScript type definitions.

```
src/types/
├── models.ts                   # Core domain models:
│                               #   - Tirth, Dharamshala, Room, Booking, Invoice
│                               #   - Bhojanshala, Event, Festival
│                               #   - User, CustomerProfile, Manager
│                               #   - WishlistItem, FilterOptions, PaginationMeta
├── h3.d.ts                     # TypeScript module augmentation for H3EventContext.
│                               #   Declares accessToken (string | null) and
│                               #   session (Session | null) set by
│                               #   server/middleware/session.ts on every
│                               #   authenticated request.
└── tirthlok.ts                 # Comprehensive Supabase-aligned type definitions:
                                #   - TirthCard, TirthDetails, TirthImage, MulNayak, TirthEvent
                                #   - DharamshalaCard, DharamshalaDetails, DharamshalaImage
                                #   - RoomType, RoomImage
                                #   - BhojanshalaCard, BhojanshalaDetails, MealTiming, BhojanshalaImage
                                #   - Booking, BookingStatus
                                #   - ManagerProfile, CustomerProfile
                                #   - WishlistItem, Invoice
```

---

## Architecture Notes

### Nuxt 3 with SSR
- `nuxt.config.ts` sets `ssr: true` with `srcDir: "src/"`.
- Server routes under `src/server/api/` are auto-discovered as H3 event handlers.
- Auto-imports cover: `src/components/`, `src/composables/`, `src/stores/` — no manual imports needed.

### Feature-Sliced Design
The `src/features/` directory follows a feature-sliced pattern:
```
features/<name>/
  ├── index.ts          ← barrel export (public API of the feature)
  ├── components/       ← feature-specific Vue components
  ├── composables/      ← reactive state / business logic hooks
  └── services/         ← raw API call functions (fetch wrappers)
```

### Dual Supabase Client Pattern
The server uses **two distinct Supabase clients** (`src/server/utils/supabase.ts`):

| Client | Function | Schema | Use |
|--------|----------|--------|-----|
| `getSupabaseAdmin()` | Auth operations | `public` | User auth, session validation |
| `getSupabaseTirthlok()` | All data operations | `tirthlok` | All business data tables |

### Route Naming Conventions
| Pattern | Example | Description |
|---------|---------|-------------|
| `[id].get.ts` | `/api/tirth/[id].get.ts` | Dynamic route, GET method |
| `[id].patch.ts` | `/api/bookings/[id].patch.ts` | Dynamic route, PATCH method |
| `[id].delete.ts` | `/api/admin/rooms/[id].delete.ts` | Dynamic route, DELETE method |
| `index.get.ts` | `/api/dharamshala/index.get.ts` | Collection route, GET method |
| `name.post.ts` | `/api/bookings.post.ts` | Root-level POST handler |
| `name.get.ts` | `/api/admin/bhojanshala.get.ts` | Root-level GET handler |

### Admin API Scoping
Admin endpoints use a dual-access model via `requireAdmin()` / `requireSuperAdmin()`:
- **Super Admin**: Full access to all resources across all tirths/dharamshalas
- **Tirth Manager**: Scoped to their assigned `tirth_id` or `dharamshala_id`; ownership checks enforced at the API layer

### CSS Architecture
- **Design tokens**: Defined as CSS custom properties in `src/assets/css/base/theme.css`
- **Tailwind**: Consumes those CSS variables via `tailwind.config.js`
- **Page CSS**: Scoped page-level styles in `src/assets/css/pages/`
- **Component styles**: Scoped `<style>` blocks within `.vue` files

### Middleware Flow
```
Route change
  → auth.ts middleware         (checks session, redirects if needed)
  → page component loads
  → plugin: init-auth.client   (syncs Supabase session → auth store)
  → plugin: init-store         (pre-fetches wishlist, profile data)
```
