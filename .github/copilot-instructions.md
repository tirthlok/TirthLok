<!-- Copilot / AI agent instructions for the Tirth_Exp repo -->
# Quick AI Agent Guide — Tirth_Exp

This file contains concise, repository-specific guidance for AI coding agents (Copilot-style assistants) to be productive immediately in this Nuxt 3 + TypeScript codebase.

1) Project purpose & stack
- Purpose: a Nuxt 3 (Vue 3) mobile/web app to explore "Tirth" (pilgrimage) locations. Data is seeded locally and surfaced through Nuxt server routes.
- Stack: `nuxt 3`, `vue 3`, `pinia`, `tailwindcss`, `axios` (client), `leaflet` (maps), TypeScript.

2) Big-picture architecture (what to read first)
- App source root: `src/` (see `nuxt.config.ts` `srcDir`). Read `nuxt.config.ts` for runtime config and auto-imports.
- UI: `src/components/` (shared components exported via `src/components/shared/index.ts`). Look in `src/components/tirth/` for page-specific components (`TirthAbout.vue`, `TirthFacilities.vue`, `TirthFestivals.vue`).
- Pages / routing: `src/pages/` (example: `src/pages/tirth/[id].vue` for tirth detail). Pages use auto-imported composables and Pinia stores.
- State: Pinia stores live in `src/stores/` (e.g. `src/stores/tirth.ts`). Stores may be pre-seeded with `sampleData` from the server utils.
- Server/API: Nuxt server routes are under `server/api/`. Many endpoints use local seed data (see `server/utils/sampleData.ts`). Use `$fetch` against `useRuntimeConfig().public.apiBaseUrl`.

3) Developer workflows & commands (exact)
- Install: `npm install` (Node.js 18+ recommended).
- Dev server: `npm run dev` (uses `nuxt dev`).
- Build / preview: `npm run build` then `npm run preview`.
- Static generation: `npm run generate`.
- Lint: `npm run lint` and format: `npm run format`.

4) Important runtime configuration
- `nuxt.config.ts` exposes `runtimeConfig.public.apiBaseUrl` (defaults to `/api`). Client code uses that so `dev` runs same-origin API calls (no CORS during development).
- `NUXT_PUBLIC_MAPBOX_TOKEN` is the Mapbox key used by map components; if absent map features may be disabled.

5) Common patterns & conventions unique to this repo
- `srcDir` is `src/`: always reference project files relative to `~/` (e.g. `~/stores/tirth`).
- Auto-imports: composables and stores are auto-imported (see `nuxt.config.ts` `imports.dirs`). Use composable names directly (e.g. `useTirthStore`).
- Stores may be seeded by local sample data: `src/stores/tirth.ts` imports `sampleTirths` from `~/server/utils/sampleData`. When implementing network fetching, stores prefer local seed first, then remote fetch with `$fetch`.
- API conventions: Server endpoints under `server/api` are simple GET/POST handlers. Client code often uses `$fetch` or store actions which call `$fetch`. Example: `useTirthStore.fetchTirthById(id)` uses `useRuntimeConfig().public.apiBaseUrl`.
- Shared components index: `src/components/shared/index.ts` re-exports shared components — import from that path when composing pages (see `src/pages/tirth/[id].vue`).

6) Typical data flow
- UI page (e.g. `src/pages/tirth/[id].vue`) calls Pinia store (`useTirthStore`).
- Store action `fetchTirths()` or `fetchTirthById()` resolves from local `tirths` seed or calls the API (`/api/tirths` or `/api/tirths/:id`).
- Server API handlers in `server/api/*` return data (currently from `server/utils/sampleData.ts`).

7) Files worth referencing for examples
- `nuxt.config.ts` — runtimeConfig, `srcDir`, auto-imports, route rules
- `package.json` — exact `npm` scripts: `dev`, `build`, `preview`, `generate`, `lint`, `format`
- `src/stores/tirth.ts` — store patterns, fetch-first-from-local seed behavior, `useRuntimeConfig()` usage, $fetch usage
- `src/pages/tirth/[id].vue` — canonical page wiring: route params, store usage, error/loading patterns, tabs and component composition
- `server/utils/sampleData.ts` — canonical data shape for Tirth and facilities
- `src/composables/api/*` — API wrapper composables exported from `src/composables/api/index.ts`

8) How to make safe, repo-consistent edits
- Match styling: TypeScript + Vue SFCs with `lang="ts"` and `script setup`.
- Use Pinia stores for state; prefer store actions for shared data fetching logic rather than duplicating `$fetch` calls in pages.
- Respect `useRuntimeConfig().public.apiBaseUrl` rather than hardcoding `/api` or `http://localhost:3000`.
- When adding endpoints, put simple route files under `server/api/` matching the Nuxt API route structure.

9) Quick code examples
- Fetch from API using runtime config (preferred):
```ts
const config = useRuntimeConfig()
const resp = await $fetch(`${config.public.apiBaseUrl}/tirths/${id}`)
```

- Use store pattern (see `src/stores/tirth.ts`):
```ts
const tirthStore = useTirthStore()
await tirthStore.fetchTirthById(id)
const tirth = tirthStore.getTirthById(id)
```

10) What not to assume
- There are no automated tests present; don't add references to test runners unless you add configuration.
- The repository uses seeded sample data; production database wiring is intentionally left to developers.

11) When to ask the human
- If changes require connecting a real DB or external API keys (Mapbox), ask for credentials and desired driver (Mongo/Postgres).
- If adding global runtime config, confirm whether it should be public vs private (use `runtimeConfig.public` vs `runtimeConfig`).

If anything here is unclear or you want more/less detail (for example, more code examples, or CI rules), tell me which sections to expand.
