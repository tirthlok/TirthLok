# Jain Tirth Explorer - Setup & Development Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Project Overview

This is a **Nuxt 3 + Vue 3** application built with **TypeScript**, **Tailwind CSS**, and **Pinia** for state management.

### Key Technologies
- **Framework**: Nuxt 3 (Vue 3 meta-framework)
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Icons**: Lucide Vue Next
- **Build Tool**: Vite (via Nuxt)
- **Type Safety**: TypeScript

## Available Scripts

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Static Generation
npm run generate     # Generate static site
```

## Project Structure

### Components (`/components`)
Reusable Vue 3 components:
- **TirthCard.vue**: Displays tirth in card format (home page)
- **TirthHeader.vue**: Tirth detail header with images
- **TirthAbout.vue**: About, history, and architecture section
- **TirthFacilities.vue**: Nearby facilities with filtering
- **TirthFestivals.vue**: Festivals and events timeline

### Pages (`/pages`)
Route-based pages (auto-routed by Nuxt):
- **index.vue**: Home page with search and filters
- **favorites.vue**: Saved favorite tirths
- **tirth/[id].vue**: Individual tirth detail page
- **admin.vue**: Admin dashboard for managing content

### Layouts (`/layouts`)
- **default.vue**: Main layout with header, footer, and navigation

### State Management (`/stores`)
Pinia stores:
- **tirth.ts**: Tirth data store (CRUD operations, filtering)
- **user.ts**: User data store (favorites, authentication)

### API Routes (`/server/api`)
- **tirths.get.ts**: Get all tirths
- **tirths/[id].get.ts**: Get single tirth details

### Utilities
- **composables/useApi.ts**: API utility composable
- **types/models.ts**: TypeScript data models
- **server/utils/sampleData.ts**: Sample temple data

## Features Implementation Guide

### 1. Tirth Information Display ✅
**Location**: `/components/TirthHeader.vue` and `/components/TirthAbout.vue`

Shows:
- Temple name, location, and basic info
- Historical background
- Architecture details
- Main idols (Moolnayak)
- Special facts

### 2. Facilities Management ✅
**Location**: `/components/TirthFacilities.vue`

Lists and categorizes:
- Bhojanshala (Restaurants)
- Dharmashala (Accommodation)
- Gaushala (Animal Care)
- Clinics (First Aid)
- Water, Parking, Washrooms

Features:
- Filtering by facility type
- Contact information
- Operating hours
- Direct call/email buttons

### 3. Search & Filter ✅
**Location**: `/pages/index.vue`

Filter by:
- Search term (name, city, state)
- State
- Sect (Shwetambar/Digambar)
- Type (Gyan-sthan, Siddhakshetra, etc.)

### 4. Favorites System ✅
**Location**: `/stores/user.ts`

- Add/remove favorites
- View saved tirths
- Persistent storage (ready for backend)

### 5. Admin Dashboard ✅
**Location**: `/pages/admin.vue`

- Statistics overview
- Add/edit/delete tirths
- Manage facilities
- User management (ready)

### 6. Responsive Design ✅
All components support:
- Mobile (primary)
- Tablet
- Desktop

### 7. Festivals & Events ✅
**Location**: `/components/TirthFestivals.vue`

Displays:
- Festival name and date
- Description
- Special events

## Adding New Tirth Data

### Option 1: Update Sample Data
Edit `/server/utils/sampleData.ts`:

```typescript
export const sampleTirths = [
  {
    id: '3',
    name: 'New Temple',
    description: '...',
    // ... other fields
  },
]
```

### Option 2: Connect Database
1. Install database driver:
   ```bash
   npm install mongoose  # or your preferred DB
   ```

2. Create database connection in `/server/`:
   ```typescript
   // server/db/connection.ts
   import mongoose from 'mongoose'
   
   export async function connectDB() {
     await mongoose.connect(process.env.DATABASE_URL)
   }
   ```

3. Update API routes to use database

## Customization Guide

### Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#color-code', // Replace with your color
    }
  }
}
```

### Fonts
Update in `tailwind.config.js` and `assets/css/main.css`

### Navigation
Edit header in `/layouts/default.vue`

### Filtering Options
Update filter dropdowns in `/pages/index.vue`

## Connecting to Backend API

Update `/nuxt.config.ts`:
```typescript
runtimeConfig: {
  public: {
    apiBaseUrl: 'https://your-api-domain.com',
  }
}
```

## Adding Maps Integration

1. Install Leaflet:
   ```bash
   npm install leaflet vue-leaflet
   ```

2. Create map component:
   ```typescript
   // components/TirthMap.vue
   import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
   ```

3. Use in tirth detail page

## Authentication Setup

1. Create auth store:
   ```typescript
   // stores/auth.ts
   export const useAuthStore = defineStore('auth', {
     // auth logic
   })
   ```

2. Add login/signup pages
3. Protect admin routes with middleware

## SEO Optimization

Already configured in `app.vue` with:
- Meta tags
- Open Graph tags (ready to add)
- Structured data (JSON-LD ready)

## Performance Tips

1. **Image Optimization**: Use next-gen formats (WebP)
2. **Lazy Loading**: Images load on scroll
3. **Code Splitting**: Nuxt auto-splits by routes
4. **Caching**: Configure in `nuxt.config.ts`
5. **CDN**: Deploy assets on CDN for faster delivery

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- -p 3001  # Use different port
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Styles Not Applying
Clear `.nuxt` directory:
```bash
rm -rf .nuxt
npm run dev
```

## Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy 'dist' folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Next Steps

1. **Connect Real Database** (MongoDB/PostgreSQL)
2. **Implement Authentication** (JWT/OAuth)
3. **Add Maps Integration** (Leaflet/Google Maps)
4. **Create Admin Features** (User management)
5. **Set Up CI/CD** (GitHub Actions)
6. **Deploy** (Vercel/Netlify/AWS)

## Support & Resources

- [Nuxt 3 Documentation](https://nuxt.com)
- [Vue 3 Guide](https://vuejs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Pinia Documentation](https://pinia.vuejs.org)

---

**Happy Building! 🎉**
