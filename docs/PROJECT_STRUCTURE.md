**Project Structure Overview**

This document provides a concise map of client-side and server-side parts of the project, and how they link to each other.

**Summary:**
- **Repo root:** Nuxt 3 application with a small in-repo server API (under `server/api/`) that returns seeded sample data.
- **Client-side:** pages, components, stores, composables, plugins, layouts, assets.
- **Server-side:** `server/api/*` endpoints and `server/utils/sampleData.ts` (in-memory/sample data).

**Client-side Components (what they are and where):**
- `pages/` : top-level routes (e.g., `index.vue`, `tirth.vue`, `profile.vue`, and nested dynamic routes under `bhojanshala/`, `dharamshala/`, etc.). Pages assemble UI and orchestrate data fetches.
- `components/` : reusable UI pieces (e.g., `TirthCard.vue`, `TirthHeader.vue`, `BhojanshalaCard.vue`, `TirthAbout.vue`, `Icon.vue`, etc.). These are used by pages to render lists, cards and details.
- `layouts/` : app layout(s), e.g., `default.vue` which wraps pages.
- `composables/` : lightweight logic helpers like `useApi.ts`, `useSearch.ts`, `usePagination.ts`, `useFilter.ts`, `useTabNavigation.ts`.
- `stores/` : Pinia stores (e.g., `stores/tirth.ts`, `stores/user.ts`, `stores/visited.ts`) hold application state and expose actions/getters used by pages/components.
- `plugins/` : app-wide plugins (`init-store.ts` initializes stores on startup; `error-handler.ts` adds a client-side error listener).
- `assets/` : CSS and images used by client UI (e.g., `assets/css/main.css`).
- `types/` : TypeScript models (`types/models.ts`) used across client and server for consistent typings.

**Server-side Components (what they are and where):**
- `server/api/tirths.get.ts` : GET all tirths — currently returns `sampleTirths` from `server/utils/sampleData.ts`.
- `server/api/tirths/[id].get.ts` : GET tirth by `id` — returns specific tirth from `sampleTirths` or 404.
- `server/api/favorites.get.ts` : GET favorites (in-memory Map keyed by userId).
- `server/api/favorites.post.ts` : POST to add/remove favorites (mutates in-memory Map).
- `server/utils/sampleData.ts` : Seed dataset for tirths, facilities and related metadata. Intended to be replaced by a real DB later.

**How pieces link (data & control flow):**
- Data fetch flow (list of tirths):
  - `pages/index.vue` (or `pages/tirth.vue`) triggers data availability using `stores/tirth.ts`.
  - `stores/tirth.ts` `fetchTirths()` attempts to use seeded `sampleTirths` and falls back to remote fetch via `useRuntimeConfig()` + `$fetch` when needed.
  - `composables/useApi.ts` exposes `fetchTirths()` and `fetchTirthById()` wrappers that call `/api/tirths` and `/api/tirths/:id` respectively (uses runtime `config.public.apiBaseUrl`).
  - On the server side, `server/api/tirths.get.ts` returns the data (currently from `server/utils/sampleData.ts`).

- Data fetch flow (tirth detail):
  - `pages/tirth/[id].vue` or a details page calls `useTirthStore().fetchTirthById(id)`.
  - Store checks local `tirths` first, otherwise calls API endpoint `/api/tirths/:id` (same path handled by `server/api/tirths/[id].get.ts`).

- Favorites flow:
  - UI components (e.g., a favorite button inside `TirthCard.vue`) should call a client method that posts to `/api/favorites` (handled by `server/api/favorites.post.ts`).
  - Favorite listings are retrieved via `/api/favorites` (handled by `server/api/favorites.get.ts`). Server-side favorites are stored in-memory for now.

- Init & hydration:
  - `plugins/init-store.ts` runs at app startup and ensures `stores/tirth.ts` is populated (calls `fetchTirths()`), so direct page navigation has data.
  - `plugins/error-handler.ts` listens for client errors and logs them.

**Key file relationships (examples):**
- `pages/index.vue` → imports `useTirthStore` (`stores/tirth.ts`) → calls `fetchTirths()` → store may call `$fetch` → server `server/api/tirths.get.ts` → `server/utils/sampleData.ts`.
- `components/TirthCard.vue` → receives `tirth` prop and may call store actions or `$fetch('/api/favorites')` to toggle favorites → `server/api/favorites.post.ts`.
- `composables/useApi.ts` → reusable API functions that pages/components may import to avoid repeating `$fetch` usage across the app.

**Notes & recommendations for future work:**
- Replace `server/utils/sampleData.ts` with actual DB calls (e.g., an ORM or external API). Update `stores/tirth.ts` to rely on real API results.
- Consolidate API usage: either let stores call `useApi` wrappers or update `useApi` to be the single source of truth and have pages/stores import it consistently.
- Persist favorites in a database instead of the in-memory Map in `server/api/favorites.*.ts`.
- Add API docs (OpenAPI or short README) for `server/api` endpoints.

**File pointers**
- Client: `pages/`, `components/`, `stores/`, `composables/`, `plugins/`, `layouts/`, `assets/`, `types/`
- Server: `server/api/tirths.get.ts`, `server/api/tirths/[id].get.ts`, `server/api/favorites.get.ts`, `server/api/favorites.post.ts`, `server/utils/sampleData.ts`

If you want, I can also:
- generate a visual diagram (Mermaid) mapping these links, or
- produce a quick OpenAPI spec for the small `server/api/` surface.
