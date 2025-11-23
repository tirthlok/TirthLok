# Jain Tirth Explorer - Architecture & Design Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Browser)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      │
│  │   Home Page  │      │ Detail Page  │      │Favorites Page│      │
│  │  (Browse)    │      │ (View Tirth) │      │ (Wishlist)   │      │
│  └──────────────┘      └──────────────┘      └──────────────┘      │
│                                                                       │
│         ┌──────────────────────────────────────┐                    │
│         │      Reusable Components             │                    │
│         │  ┌────────────────────────────────┐  │                    │
│         │  │ TirthCard    │ SearchBar      │  │                    │
│         │  │ TirthHeader  │ BottomNav      │  │                    │
│         │  │ TirthAbout   │ Facilities     │  │                    │
│         │  │ TirthMap     │ Festivals      │  │                    │
│         │  └────────────────────────────────┘  │                    │
│         └──────────────────────────────────────┘                    │
│                            ▲                                         │
│                            │ (State & Events)                       │
│         ┌──────────────────┴──────────────────┐                    │
│         │      Pinia Store Management         │                    │
│         │  ┌────────────────────────────────┐ │                    │
│         │  │ tirth.ts (Temple Data)         │ │                    │
│         │  │ user.ts  (User Preferences)    │ │                    │
│         │  └────────────────────────────────┘ │                    │
│         └──────────────────┬──────────────────┘                    │
│                            │ (API Calls)                            │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Browser Storage │
                    │ LocalStorage    │
                    │ SessionStorage  │
                    └────────┬────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NETWORK LAYER (HTTP)                           │
├─────────────────────────────────────────────────────────────────────┤
│                   REST API / GraphQL                                │
│         (GET, POST, PUT, DELETE endpoints)                         │
└────────────────┬──────────────────────────────┬────────────────────┘
                 │                              │
                 ▼                              ▼
        ┌─────────────────┐          ┌─────────────────┐
        │ Vercel/Netlify  │          │ Database Layer  │
        │ (Edge Functions)│          │                 │
        └─────────────────┘          └─────────────────┘
```

---

## Component Hierarchy

```
NuxtLayout (default.vue)
├── Header
│   ├── Logo + Brand
│   ├── Desktop Nav
│   └── Mobile Menu
│
├── Main Content (Slot)
│   ├── pages/index.vue
│   │   ├── SearchBar.vue
│   │   ├── Category Showcase
│   │   └── TirthCard.vue (Grid)
│   │
│   ├── pages/tirth/[id].vue
│   │   ├── TirthHeader.vue
│   │   ├── Tabs Navigation
│   │   ├── TirthAbout.vue
│   │   ├── TirthFacilities.vue
│   │   ├── TirthFestivals.vue
│   │   └── TirthMap.vue
│   │
│   ├── pages/favorites.vue
│   │   └── TirthCard.vue (Filtered)
│   │
│   └── pages/admin.vue
│       ├── Statistics Cards
│       ├── Add/Edit Form
│       └── Data Table
│
├── BottomNav.vue (Mobile Only)
│   ├── Home Link
│   ├── Explore Link
│   ├── Favorites Link
│   ├── Chat Button
│   └── Profile Link
│
└── Footer
    ├── About Section
    ├── Quick Links
    ├── Help Links
    └── Contact Info
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                         │
│  (Click, Type, Search, Filter, Add to Favorites)           │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │  Vue Component (reactive state)   │
        │  └─ searchQuery ref('')          │
        │  └─ activeTab ref('about')       │
        │  └─ favorites[] reactive         │
        └────────────────────┬──────────────┘
                             │
                             ▼
        ┌────────────────────────────────────┐
        │  Pinia Store (central store)      │
        │  ├─ tirth.ts (fetchTirths)        │
        │  ├─ user.ts (addFavorite)         │
        │  └─ Actions & Getters             │
        └────────────────────┬──────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
        ┌───────────────────┐  ┌────────────────┐
        │ Browser Storage   │  │ API Endpoint   │
        │ (localStorage)    │  │ ($fetch)       │
        │ - favorites[]     │  │ /api/tirths    │
        │ - preferences     │  │ /api/users     │
        └───────────────────┘  └────────┬───────┘
                                         │
                                         ▼
                            ┌────────────────────┐
                            │  Backend Database  │
                            │  (MongoDB/PostgreSQL)
                            │                    │
                            │ Collections:       │
                            │ - Tirth            │
                            │ - Facility         │
                            │ - User             │
                            │ - Booking (future) │
                            └────────────────────┘
```

---

## State Management Architecture

### Pinia Stores

```typescript
// tirth.ts
state: {
  tirths: Tirth[]           // All temples
  selectedTirth: Tirth      // Current detail view
  filteredTirths: Tirth[]   // Search/filter results
  loading: boolean          // Loading state
  error: string             // Error messages
}

actions: {
  fetchTirths()             // Load all temples
  fetchTirthById(id)        // Load specific temple
  filterTirths(filters)     // Apply filters
  setSelectedTirth(tirth)   // Set current view
}

getters: {
  getTirthById(id)          // Find temple by ID
  getTirthsByState(state)   // Filter by state
  getTirthsBySect(sect)     // Filter by sect
}

// user.ts
state: {
  user: User                // Current user
  isAuthenticated: boolean  // Auth status
  favorites: string[]       // Favorite temple IDs
  preferences: object       // User settings
  loading: boolean
}

actions: {
  setUser(user)             // Set current user
  clearUser()               // Logout
  addFavorite(id)           // Add to wishlist
  removeFavorite(id)        // Remove from wishlist
}

getters: {
  getFavorites()            // Get favorite temples
  isFavorite(id)            // Check if favorited
}
```

---

## API Route Structure

```
server/
├── api/
│   ├── tirths.get.ts
│   │   GET /api/tirths
│   │   Returns: Tirth[]
│   │
│   ├── tirths/[id].get.ts
│   │   GET /api/tirths/:id
│   │   Returns: Tirth
│   │
│   ├── facilities/
│   │   ├── index.get.ts
│   │   │   GET /api/facilities
│   │   │   Returns: Facility[]
│   │   │
│   │   └── [id].get.ts
│   │       GET /api/facilities/:id
│   │       Returns: Facility
│   │
│   ├── users/
│   │   ├── favorites.get.ts
│   │   │   GET /api/users/favorites
│   │   │
│   │   └── favorites.post.ts
│   │       POST /api/users/favorites
│   │
│   └── admin/
│       ├── tirth.post.ts (Create)
│       ├── tirth.put.ts (Update)
│       └── tirth.delete.ts (Delete)
│
└── utils/
    └── sampleData.ts (Mock data)
```

---

## Database Schema

```sql
-- Tirth Table
CREATE TABLE tirth (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  historicalBackground TEXT,
  pratisthaYear INTEGER,
  acharya VARCHAR(255),
  sect ENUM('Shwetambar', 'Digambar'),
  category ENUM('Gyan-sthan', 'Siddhakshetra', 'Atishay-Kshetra'),
  
  -- Location
  city VARCHAR(100),
  state VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  
  -- Media
  images TEXT[],  -- Array of image URLs
  gallery TEXT[],
  
  -- Meta
  rating FLOAT,
  reviews INTEGER,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Facility Table
CREATE TABLE facility (
  id UUID PRIMARY KEY,
  tirthId UUID REFERENCES tirth(id),
  name VARCHAR(255),
  type VARCHAR(100),
  description TEXT,
  
  -- Contact
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  
  -- Location
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  
  -- Details
  rating FLOAT,
  availability VARCHAR(100),
  operatingHours VARCHAR(100),
  
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- User Table
CREATE TABLE user (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),  -- Hashed
  name VARCHAR(255),
  
  -- Preferences
  favorites TEXT[],  -- Array of Tirth IDs
  preferences JSONB,
  
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Idol Table
CREATE TABLE idol (
  id UUID PRIMARY KEY,
  tirthId UUID REFERENCES tirth(id),
  name VARCHAR(255),
  type VARCHAR(100),  -- Moolnayak, etc.
  material VARCHAR(100),
  height INTEGER,  -- in cm
  createdAt TIMESTAMP
);

-- Festival Table
CREATE TABLE festival (
  id UUID PRIMARY KEY,
  tirthId UUID REFERENCES tirth(id),
  name VARCHAR(255),
  date DATE,
  month INTEGER,
  year INTEGER,
  description TEXT,
  traditions TEXT[],
  createdAt TIMESTAMP
);
```

---

## File Organization by Concern

### UI/Presentation Layer
```
components/
├── TirthCard.vue           (Display temple card)
├── TirthHeader.vue         (Temple header section)
├── TirthAbout.vue          (Historical info)
├── TirthFacilities.vue     (Facilities display)
├── TirthFestivals.vue      (Event timeline)
├── SearchBar.vue           (Search component)
├── BottomNav.vue           (Mobile navigation)
└── Icon.vue                (Icon wrapper)

pages/
├── index.vue               (Browse/search page)
├── tirth/[id].vue          (Detail page)
├── favorites.vue           (Wishlist page)
└── admin.vue               (Admin dashboard)

layouts/
└── default.vue             (Main layout)
```

### State Management Layer
```
stores/
├── tirth.ts                (Temple data store)
└── user.ts                 (User preferences store)
```

### API/Data Layer
```
server/
├── api/                    (API endpoints)
│   ├── tirths.get.ts
│   ├── facilities.get.ts
│   ├── users/              (Future: user endpoints)
│   └── admin/              (Future: admin endpoints)
│
└── utils/
    └── sampleData.ts       (Mock data)
```

### Type Definition Layer
```
types/
└── models.ts               (TypeScript interfaces)
```

### Styling Layer
```
assets/
└── css/
    └── main.css            (Global styles)

tailwind.config.js          (Tailwind configuration)
```

---

## Component Communication Patterns

### Pattern 1: Parent → Child (Props)
```vue
<!-- Parent.vue -->
<TirthCard :tirth="selectedTirth" />

<!-- Child (TirthCard.vue) -->
<script setup lang="ts">
interface Props {
  tirth: Tirth
}
defineProps<Props>()
</script>
```

### Pattern 2: Child → Parent (Emits)
```vue
<!-- Child (SearchBar.vue) -->
<script setup lang="ts">
const emit = defineEmits<{
  search: [query: string]
  filter: [filterId: string]
}>()

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<!-- Parent (index.vue) -->
<SearchBar @search="handleSearch" @filter="handleFilter" />
```

### Pattern 3: Global State (Pinia Store)
```vue
<!-- Any component -->
<script setup lang="ts">
import { useTirthStore } from '~/stores/tirth'

const tirthStore = useTirthStore()
const temples = computed(() => tirthStore.tirths)

onMounted(async () => {
  await tirthStore.fetchTirths()
})
</script>
```

### Pattern 4: Composition Functions (Composables)
```typescript
// composables/useDistance.ts
export const useDistance = () => {
  const calculate = (lat1, lon1, lat2, lon2) => {
    // Haversine calculation
  }
  
  return { calculate }
}

// In component
<script setup lang="ts">
const { calculate } = useDistance()
</script>
```

---

## Routing Architecture

```
URL Structure:
/                      → Home page (browse temples)
/tirth/:id            → Temple detail page
/tirth/:id?tab=about  → Detail with tab
/favorites            → Wishlist
/admin                → Admin dashboard

Route Parameters:
- [id]: Dynamic temple ID parameter

Query Parameters:
- tab: Active tab on detail page
- search: Search query
- filter: Filter type
```

---

## Deployment Architecture (Vercel Example)

```
┌─────────────────────────────────────┐
│     GitHub Repository               │
│  (Push triggers deployment)         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     Vercel CI/CD Pipeline           │
│  1. Clone repo                      │
│  2. Install dependencies            │
│  3. Build (npm run build)           │
│  4. Run tests                       │
│  5. Deploy                          │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    ▼                     ▼
┌─────────────┐     ┌──────────────┐
│ Edge Network│     │ Serverless   │
│ (CDN)       │     │ Functions    │
│             │     │ (API Routes) │
└─────────────┘     └──────────────┘
    │                     │
    └──────────┬──────────┘
               ▼
        ┌────────────────┐
        │  Database      │
        │  (MongoDB/     │
        │   PostgreSQL)  │
        └────────────────┘
```

---

## Performance Optimization Strategy

```
┌─────────────────────────────────────┐
│  Image Optimization                 │
│  - WebP format                      │
│  - Responsive sizing                │
│  - Lazy loading                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Code Splitting                     │
│  - Route-based splitting            │
│  - Component lazy loading           │
│  - Async imports                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Caching Strategy                   │
│  - Browser cache headers            │
│  - CDN caching                      │
│  - API response caching             │
│  - Service worker (PWA)             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Bundle Analysis                    │
│  - Minification                     │
│  - Tree shaking                     │
│  - CSS purging (Tailwind)           │
│  - Asset optimization               │
└─────────────────────────────────────┘
```

---

## Security Layers

```
┌──────────────────────────────────────┐
│  Client-Side Security                │
│  - Input validation                  │
│  - XSS prevention (Vue escaping)     │
│  - CSRF tokens                       │
│  - Secure headers                    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  API-Level Security                  │
│  - Authentication (JWT/Sessions)    │
│  - Authorization (Role-based)        │
│  - Rate limiting                     │
│  - Input validation                  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Database-Level Security             │
│  - SQL injection prevention          │
│  - Parameterized queries             │
│  - Encryption at rest                │
│  - Access control                    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Infrastructure Security             │
│  - HTTPS/TLS                         │
│  - Firewall rules                    │
│  - DDoS protection                   │
│  - Regular backups                   │
└──────────────────────────────────────┘
```

---

## Monitoring & Analytics

```
Real-time Monitoring:
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- User analytics (Google Analytics 4)
- Uptime monitoring (Uptime Robot)

Metrics to Track:
- Page load times
- User engagement
- Conversion rates
- Error rates
- API response times
- Database performance
```

---

## Future Scalability Plan

```
Phase 1 (Current): Single-page app
├─ All features in one app
├─ Centralized database
└─ CDN for static assets

Phase 2 (Scaling): Microservices
├─ API service (separate)
├─ Auth service
├─ Image service
└─ Notification service

Phase 3 (Growth): Advanced Features
├─ Machine learning recommendations
├─ Real-time notifications (WebSockets)
├─ Advanced caching (Redis)
├─ Multi-region deployment
└─ Analytics platform

Phase 4 (Enterprise): Full Platform
├─ Native mobile apps
├─ Admin analytics dashboard
├─ Partner integrations
├─ API marketplace
└─ Community features
```

---

*This architecture is designed to be scalable, maintainable, and production-ready.*

