# Jain Tirth Explorer - Visual Architecture & Flow

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     JAIN TIRTH EXPLORER APP                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              PRESENTATION LAYER (UI)                     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │  Home Page   │  │ Detail Page  │  │ Admin Page   │   │   │
│  │  │   (Search)   │  │  (TabView)   │  │ (Dashboard)  │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │         │                  │                 │            │   │
│  │  ┌──────────────────────────────────────────────┐        │   │
│  │  │         COMPONENTS LAYER                     │        │   │
│  │  ├──────────────────────────────────────────────┤        │   │
│  │  │ TirthCard │ TirthHeader │ TirthAbout │       │        │   │
│  │  │ TirthFacilities │ TirthFestivals │ Icon     │        │   │
│  │  └──────────────────────────────────────────────┘        │   │
│  │                                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
├──────────────────────────────┼────────────────────────────────────┤
│                              │                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              STATE MANAGEMENT (PINIA)                  │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │                                                         │     │
│  │  ┌──────────────┐          ┌──────────────┐           │     │
│  │  │ Tirth Store  │          │  User Store  │           │     │
│  │  ├──────────────┤          ├──────────────┤           │     │
│  │  │ • State      │          │ • User data  │           │     │
│  │  │ • Actions    │          │ • Favorites  │           │     │
│  │  │ • Getters    │          │ • Settings   │           │     │
│  │  └──────────────┘          └──────────────┘           │     │
│  │                                                         │     │
│  └────────────────────────────────────────────────────────┘     │
│                              │                                    │
├──────────────────────────────┼────────────────────────────────────┤
│                              │                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                  API/COMPOSABLES LAYER                 │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │         useApi() Composable - API Communication         │     │
│  └────────────────────────────────────────────────────────┘     │
│                              │                                    │
├──────────────────────────────┼────────────────────────────────────┤
│                              │                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │           SERVER/BACKEND LAYER (NUXT)                 │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │  • GET /api/tirths          - Get all temples          │     │
│  │  • GET /api/tirths/:id      - Get single temple        │     │
│  │  • Sample Data (sampleData.ts)                        │     │
│  └────────────────────────────────────────────────────────┘     │
│                              │                                    │
├──────────────────────────────┼────────────────────────────────────┤
│                              │                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              DATABASE LAYER (To Connect)               │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │  • MongoDB  OR  PostgreSQL                             │     │
│  │  • Collections/Tables designed                         │     │
│  │  • Ready for integration                               │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
USER INTERACTION
       │
       ▼
  ┌─────────┐
  │ Page    │ (index.vue, tirth/[id].vue, etc.)
  └────┬────┘
       │
       ▼
  ┌─────────────────┐
  │ Components      │ (TirthCard, TirthHeader, etc.)
  └────┬────────────┘
       │
       ▼
  ┌─────────────────┐
  │ Pinia Stores    │ (tirth.ts, user.ts)
  │ (State)         │
  └────┬────────────┘
       │
       ▼
  ┌─────────────────┐
  │ useApi()        │ (Composable)
  │ Composable      │
  └────┬────────────┘
       │
       ▼
  ┌─────────────────┐
  │ API Routes      │ (server/api/*.ts)
  └────┬────────────┘
       │
       ▼
  ┌─────────────────┐
  │ Sample Data     │ (or Database)
  │ Return Result   │
  └────┬────────────┘
       │
       ▼
  Back to Store & Update UI
```

---

## 🗂️ File Organization Strategy

```
CODE LAYER ORGANIZATION:

┌─ Presentation Layer
│  ├─ pages/             (Route pages - screens)
│  ├─ components/        (Reusable components)
│  └─ layouts/           (Layout wrappers)
│
├─ Logic Layer
│  ├─ stores/            (State management)
│  ├─ composables/       (Reusable functions)
│  ├─ types/             (TypeScript types)
│  └─ plugins/           (Global setup)
│
├─ Data Access Layer
│  └─ server/api/        (API endpoints)
│
├─ Configuration Layer
│  ├─ nuxt.config.ts
│  ├─ tailwind.config.js
│  └─ tsconfig.json
│
└─ Assets & Documentation
   ├─ assets/            (CSS, images)
   └─ *.md files         (Documentation)
```

---

## 🔄 Component Hierarchy

```
layouts/default.vue (Root Layout)
├── header
│   ├── logo
│   ├── navigation
│   └── mobile-menu
├── main (slot)
│   └── pages/
│       ├── index.vue (Home)
│       │   └── TirthCard (multiple)
│       ├── tirth/[id].vue (Details)
│       │   ├── TirthHeader
│       │   ├── Tabs
│       │   │   ├── TirthAbout
│       │   │   ├── TirthFacilities
│       │   │   └── TirthFestivals
│       │   └── RelatedTirths (TirthCard)
│       ├── favorites.vue
│       │   └── TirthCard (multiple)
│       └── admin.vue
│           └── Forms & Tables
└── footer
    ├── links
    ├── social
    └── copyright
```

---

## 🔐 State Management Flow

```
USER ACTION (e.g., "Add to Favorites")
         │
         ▼
    Component
    (TirthCard.vue)
         │
         ▼
    Call Store Action
    (userStore.addFavorite())
         │
         ▼
    Update State
    (user.favorites = [...])
         │
         ▼
    UI Re-renders
    (Computed updates)
```

---

## 📱 Responsive Design Breakpoints

```
Mobile (< 640px)          Tablet (640-1024px)      Desktop (> 1024px)
───────────────────       ─────────────────────    ────────────────────
 ┌─────────────┐           ┌────────────────┐     ┌──────────────────┐
 │             │           │                │     │                  │
 │  Single     │           │  2-Column      │     │  3-Column        │
 │  Column     │           │  Layout        │     │  Layout          │
 │             │           │                │     │                  │
 │  Stack      │           │ Better Space  │     │  Full Width      │
 │  Cards      │           │ Utilization   │     │  Utilization     │
 │             │           │                │     │                  │
 │  Touch      │           │  Balanced      │     │  Desktop         │
 │  Friendly   │           │  UX            │     │  Experience      │
 │             │           │                │     │                  │
 └─────────────┘           └────────────────┘     └──────────────────┘
```

---

## 🎯 User Journey Map

```
VISITOR JOURNEY:

ENTRY POINT
    ↓
  Home Page (index.vue)
    ├─→ Browse temples with cards
    ├─→ Use search bar
    ├─→ Apply filters
    └─→ See filtered results
         ↓
    Select Temple
         ↓
  Detail Page (tirth/[id].vue)
    ├─→ View About
    ├─→ View Facilities
    ├─→ View Festivals
    ├─→ Add to Favorites ✓
    └─→ Get Directions
         ↓
    Return to Home / Check Favorites
         ↓
  Favorites Page (favorites.vue)
    └─→ View all saved temples


ADMIN JOURNEY:

ADMIN LOGIN
    ↓
  Admin Dashboard (admin.vue)
    ├─→ View statistics
    ├─→ Add new temple
    ├─→ Edit temple info
    ├─→ Manage facilities
    └─→ Delete content
         ↓
    Save Changes
         ↓
  Changes Reflected in App
```

---

## 🔌 API Endpoint Structure

```
/api
├── /tirths
│   ├── GET              (Get all temples)
│   ├── POST             (Create - admin)
│   ├── [id]
│   │   ├── GET          (Get single)
│   │   ├── PUT          (Update - admin)
│   │   └── DELETE       (Delete - admin)
│   └── /facilities
│       ├── GET          (Get all facilities)
│       ├── POST         (Create - admin)
│       └── [id]
│           ├── PUT      (Update - admin)
│           └── DELETE   (Delete - admin)
│
├── /users               (Future: Auth)
│   ├── /favorites
│   │   ├── POST         (Add favorite)
│   │   └── DELETE       (Remove favorite)
│   └── /profile
│       ├── GET          (Get profile)
│       └── PUT          (Update profile)
│
└── /admin              (Future: Admin endpoints)
    ├── /stats          (Statistics)
    ├── /logs           (Activity logs)
    └── /users          (User management)
```

---

## 📦 Type Relationships

```
Tirth (Main Temple Model)
├── location: Location
│   ├── latitude: number
│   ├── longitude: number
│   └── address: string
├── moolnayak: Idol[]
│   ├── name: string
│   ├── height: string
│   └── year: number
├── festivals: Festival[]
│   ├── name: string
│   ├── date: string
│   └── description: string
└── facilities: Facility[]
    ├── type: string
    ├── location: Location
    ├── contact: ContactInfo
    │   ├── phone: string
    │   ├── email: string
    │   └── website: string
    └── rating: number

User
├── email: string
├── favorites: string[] (Tirth IDs)
└── profile
    ├── bio: string
    └── sect: string
```

---

## 🚀 Deployment Architecture

```
LOCAL DEVELOPMENT
      ↓
   npm run dev
      ↓
  http://localhost:3000


BUILD & TEST
      ↓
   npm run build
      ↓
   npm run preview
      ↓
  http://localhost:3000 (production build)


PRODUCTION DEPLOYMENT OPTIONS:
      ↓
  ┌────────────┬──────────────┬──────────────┐
  ▼            ▼              ▼              ▼
Vercel      Netlify         Docker        AWS/Self-Hosted
  │            │              │              │
  ▼            ▼              ▼              ▼
Auto      Auto Deploy   Manual Deploy   Full Control
Deploy    from Git      Control         Setup


GLOBAL CDN
      ↓
END USER
```

---

## 🎨 Styling Architecture

```
TAILWIND CSS HIERARCHY:

Global Styles (main.css)
    ↓
Tailwind Base Classes
    ↓
Tailwind Components
    ↓
Tailwind Utilities
    ↓
Component Scoped Styles (optional)
    ↓
Applied to DOM Elements
```

---

## 📚 Development Workflow

```
1. LOCAL DEVELOPMENT
   └─ npm run dev
      └─ Hot reload enabled
      └─ TypeScript checking
      └─ ESLint watching

2. MAKE CHANGES
   ├─ Edit components in /components
   ├─ Update pages in /pages
   ├─ Modify stores in /stores
   └─ Browser auto-refreshes

3. TEST LOCALLY
   ├─ Open http://localhost:3000
   ├─ Test in DevTools
   ├─ Test responsive design
   └─ Check browser console

4. COMMIT & PUSH
   ├─ Git commit changes
   ├─ Git push to repository
   └─ CI/CD pipeline starts

5. BUILD FOR PRODUCTION
   └─ npm run build
      └─ Output to .output/

6. DEPLOY
   ├─ Option 1: Push to GitHub
   │  └─ Vercel/Netlify auto-deploys
   │
   ├─ Option 2: Docker
   │  └─ docker build & docker run
   │
   └─ Option 3: Manual
      └─ Upload .output/ to server
```

---

## 🔍 Debugging Paths

```
Issue: Component not rendering
  └─ Check:
     ├─ Component imported in page
     ├─ Props passed correctly
     ├─ Data initialized
     └─ Template syntax correct

Issue: Styles not applied
  └─ Check:
     ├─ Tailwind classes correct
     ├─ Responsive prefix (md:, lg:)
     ├─ Conflicting CSS
     └─ .nuxt cache cleared

Issue: Store not updating
  └─ Check:
     ├─ Action called correctly
     ├─ State initialized
     ├─ Getters working
     └─ Component watching store

Issue: API returning 404
  └─ Check:
     ├─ Route file exists
     ├─ getRouterParam names match
     ├─ Response formatted correctly
     └─ API base URL correct
```

---

## 🎓 Learning Sequence

```
1. UNDERSTAND STRUCTURE
   ├─ Read FILE_INDEX.md
   ├─ Explore /components
   ├─ Check /pages
   └─ Review /stores

2. MODIFY & LEARN
   ├─ Change colors in tailwind.config.js
   ├─ Edit TirthCard.vue styling
   ├─ Add new filter option
   └─ See changes in real-time

3. UNDERSTAND FLOW
   ├─ Trace component → store → API
   ├─ Follow state updates
   ├─ Review type definitions
   └─ Test in browser DevTools

4. ADD NEW FEATURES
   ├─ Create new component
   ├─ Add to store
   ├─ Create API endpoint
   └─ Integrate in page

5. DEPLOY & SCALE
   ├─ Connect real database
   ├─ Add authentication
   ├─ Deploy to platform
   └─ Monitor performance
```

---

**This visual guide helps understand the complete architecture and flow of the Jain Tirth Explorer application!**
