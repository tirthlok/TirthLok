# Jain Tirth Explorer

A user-friendly and visually appealing mobile/web application that helps users explore Jain Tirth (pilgrimage places) with accurate, rich, and well-organized information.

## Features

### 1. Tirth Information
- Detailed descriptions for each temple
- Historical background and founding details
- Pratishtha year and Acharya details
- Temple architecture and idol information (Moolnayak)
- Special facts about each temple
- Pooja and Darshan timings
- Festivals and yearly events

### 2. Nearby Essential Facilities
For each Tirth, clearly list and categorize:
- **Bhojanshala** (Restaurants)
- **Dharmashala** (Accommodation)
- **Gaushala** (Animal Shelters)
- **Clinics** (First Aid)
- **Water Availability**
- **Parking**
- **Washrooms**

Each facility includes:
- Images
- Contact details
- Ratings
- Availability information

### 3. Interactive Map & Navigation
- Temple location display
- Nearby accommodations and facilities
- Suggested walking/driving routes
- Distance and travel time calculation
- Integration with Google Maps/Apple Maps

### 4. Personalization Features
- Save favorite tirth locations
- Search and filter by:
  - State
  - Sect (Shwetambar/Digambar)
  - Type (Gyan-sthan, Siddhakshetra, Atishay Kshetra)
  - Travel-friendly categories

### 5. Design & UI
- Airbnb-inspired clean, modern design
- Card-based layout with high-quality imagery
- Minimalistic colors and typography
- Smooth transitions and animations
- Responsive design for:
  - Mobile (primary focus)
  - Tablet
  - Web

### 6. Admin Dashboard
- Upload and update temple details
- Manage facilities information
- Moderate user reviews
- Analytics and statistics

## Tech Stack

### Frontend
- **Framework**: Nuxt 3 with Vue 3
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Icons**: Lucide Vue Next
- **Maps**: Leaflet (optional integration)

### Backend
- **Runtime**: Node.js
- **API**: Nuxt API Routes
- **Database**: Placeholder (connect to your choice: MongoDB, PostgreSQL, etc.)

### Additional Tools
- **HTTP Client**: Axios
- **Build Tool**: Vite (via Nuxt 3)
- **TypeScript**: Full type support

## Project Structure

```
├── components/              # Reusable Vue components
│   ├── TirthCard.vue       # Tirth listing card
│   ├── TirthHeader.vue     # Tirth detail header
│   ├── TirthAbout.vue      # About section
│   ├── TirthFacilities.vue # Facilities section
│   └── TirthFestivals.vue  # Festivals section
├── pages/                   # Page components (routing)
│   ├── index.vue           # Home page
│   ├── favorites.vue       # Favorites page
│   ├── tirth/[id].vue      # Tirth detail page
│   └── admin.vue           # Admin dashboard
├── layouts/                # Layout components
│   └── default.vue         # Default layout
├── stores/                 # Pinia stores
│   ├── tirth.ts           # Tirth store
│   └── user.ts            # User store
├── composables/            # Composable functions
│   └── useApi.ts          # API composable
├── server/                # Server-side files
│   ├── api/               # API routes
│   │   ├── tirths.get.ts
│   │   └── tirths/[id].get.ts
│   └── utils/             # Server utilities
│       └── sampleData.ts
├── types/                 # TypeScript types
│   └── models.ts          # Data models
├── assets/                # Assets
│   └── css/               # CSS files
│       └── main.css       # Global styles
├── plugins/               # Nuxt plugins
│   └── error-handler.ts   # Error handling
├── public/                # Static files
├── nuxt.config.ts         # Nuxt configuration
├── tailwind.config.js     # Tailwind configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jain-tirth-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
   NUXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Development

### Build for Production
```bash
npm run build
npm run preview
```

### Generate Static Site
```bash
npm run generate
```

### Linting
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## Database Setup

The application currently uses sample data. To connect a database:

1. **Install database driver** (e.g., MongoDB, PostgreSQL)
2. **Create database models** in `server/utils/`
3. **Update API routes** in `server/api/`
4. **Configure connection string** in `.env`

### Sample Database Schema

**Tirth Collection**
```typescript
{
  id: string,
  name: string,
  description: string,
  historicalBackground: string,
  foundingYear: number,
  pratisthaYear: number,
  acharya: string,
  architecture: string,
  moolnayak: Idol[],
  specialFacts: string[],
  poojaTimings: string,
  darshanTimings: string,
  festivals: Festival[],
  location: Location,
  images: string[],
  sect: 'Shwetambar' | 'Digambar',
  type: string,
  facilities: Facility[],
  rating: number,
  reviews: number
}
```

**Facility Collection**
```typescript
{
  id: string,
  name: string,
  type: string,
  description: string,
  location: Location,
  contact: ContactInfo,
  image: string,
  rating: number,
  availability: string,
  operatingHours: string
}
```

## API Endpoints

### Get All Tirth Locations
```
GET /api/tirths
```

### Get Single Tirth Details
```
GET /api/tirths/:id
```

### Create New Tirth (Admin)
```
POST /api/tirths
```

### Update Tirth (Admin)
```
PUT /api/tirths/:id
```

### Delete Tirth (Admin)
```
DELETE /api/tirths/:id
```

## Features Implementation Checklist

- [x] Tirth Information Display
- [x] Nearby Facilities Section
- [x] Favorites/Wishlist
- [x] Search and Filter
- [x] Responsive Design
- [x] Admin Dashboard (Basic)
- [ ] Interactive Map Integration
- [ ] Real-time Facility Availability
- [ ] User Reviews and Ratings
- [ ] Virtual Tours
- [ ] AI Chatbot
- [ ] Offline Mode
- [ ] Donation Integration

## Future Enhancements

1. **Virtual Guided Tours**
   - Photo galleries
   - Video content
   - 360° VR experiences

2. **Advanced Features**
   - AI chatbot for temple information
   - Offline mode with downloaded data
   - Real-time availability tracking
   - Donation and volunteering integration

3. **Performance**
   - Image optimization
   - Caching strategies
   - Progressive Web App (PWA)

4. **Internationalization**
   - Multi-language support
   - Regional language content

## Open Source Tools Used

- **Nuxt 3**: Open Source Vue.js framework
- **Vue 3**: Open Source JavaScript framework
- **Tailwind CSS**: Open Source CSS framework
- **Pinia**: Open Source state management
- **Lucide Icons**: Open Source icon library
- **Leaflet**: Open Source mapping library
- **Axios**: Open Source HTTP client

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For support, email info@jainthirthexplorer.com or open an issue in the repository.

## Acknowledgments

- Jain community for guidance and feedback
- All contributors who helped build this project
- Open source community for excellent tools

---

**Note**: This is a template project. Replace sample data with real information and connect to your actual database for production use.
