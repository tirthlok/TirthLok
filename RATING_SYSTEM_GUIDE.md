# TirthLok Rating System - Developer Guide

## Overview

The TirthLok Rating System is an Airbnb-like rating and review feature for Dharamshala (accommodation) listings. After users complete their stays, they receive a popup to rate their experience across multiple dimensions (cleanliness, comfort, hospitality, value for money).

## Architecture

### Three-Layer Pattern (Following TirthLok Design)

1. **API Composable** (`src/composables/api/useRatingApi.ts`)
   - Handles HTTP requests via `$fetch()`
   - Returns raw API responses
   - No state management

2. **Pinia Store** (`src/stores/rating.ts`)
   - Centralized rating state
   - Calls API composable for data
   - Exposes getters for calculations (averages, counts, etc.)
   - Actions: `fetchRatings`, `fetchDharamshalaRatings`, `addRating`, `deleteRating`

3. **Components**
   - `RatingModal.vue` - Airbnb-style popup for submitting ratings
   - `RatingDisplay.vue` - Shows ratings and reviews on detail page

### Data Flow

```
Component (dharamshala/[id].vue) 
  → Rating Modal (submit)
    → Store Action (addRating)
      → API Composable (createRating)
        → Server Endpoint (POST /api/ratings)
          → Response stored in memory
            → Store state updated
              → Component re-renders
```

---

## Key Entities

### Rating Interface

```typescript
interface Rating {
  id: string                           // Auto-generated: RATING-{timestamp}-{random}
  dharamshalaId: string               // FK to dharamshala
  guestName: string                   // Guest who submitted rating
  guestEmail: string                  // Guest email (optional)
  bookingId: string                   // FK to booking (for tracking purposes)
  overallRating: number               // 1-5 stars (required)
  cleanliness: number                 // 1-5 (optional, default 0)
  comfort: number                     // 1-5 (optional, default 0)
  hospitality: number                 // 1-5 (optional, default 0)
  value: number                       // 1-5 (optional, default 0)
  comment: string                     // Review text (max 500 chars, optional)
  visitDate: string                   // Date of visit (YYYY-MM-DD)
  createdAt: string                   // ISO timestamp
}
```

---

## Features

### 1. Rating Modal (Airbnb Style)

**Location:** `src/components/rating/RatingModal.vue`

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `booking?: Booking` - Pre-fills guest name and email
- `dharamshalaName?: string` - Dharamshala name in header

**Events:**
- `@close` - Emitted when user closes modal
- `@ratingSubmitted` - Emitted when rating is successfully submitted

**Features:**
- 5-star overall rating (required)
- Category ratings: Cleanliness, Comfort, Hospitality, Value for Money
- Text comment (max 500 chars)
- Guest information (name, email)
- Real-time validation
- Loading state
- Error handling

### 2. Rating Display

**Location:** `src/components/rating/RatingDisplay.vue`

**Props:**
- `ratings: Rating[]` - Array of ratings to display

**Features:**
- Overall rating with star visualization
- Category breakdown (cleanliness, comfort, hospitality, value)
- Recent reviews (latest 3)
- Expandable full review list
- Guest names and visit dates
- Rating date formatting
- Empty state message

### 3. Rating Store

**Location:** `src/stores/rating.ts`

**Getters:**
- `getRatingsByDharamshala(id)` - Get all ratings for a dharamshala
- `getAverageRating(id)` - Get average overall rating (1 decimal place)
- `getAverageCategoryRating(id, category)` - Get average for specific category
- `getRatingCount(id)` - Get number of ratings
- `hasBookingBeenRated(bookingId)` - Check if booking already rated

**Actions:**
- `fetchRatings()` - Fetch all ratings
- `fetchDharamshalaRatings(dharamshalaId)` - Fetch ratings for specific dharamshala
- `addRating(ratingData)` - Submit new rating
- `deleteRating(ratingId, dharamshalaId)` - Delete a rating (admin)
- `clearRatings()` - Clear all ratings (dev/testing)

---

## Developer Workflow

### Testing the Rating System

#### Method 1: Browser Console (Recommended)

After navigating to any Dharamshala detail page:

```javascript
// Complete a booking and trigger rating popup
window.completeBookingForRating('BOOKING-ID', 'dharamshala-id', 'Guest Name', 'guest@email.com')
```

Example:
```javascript
window.completeBookingForRating(
  'test-booking-123', 
  'shanti-dharamshala', 
  'John Doe', 
  'john@example.com'
)
```

#### Method 2: Using Composable

```typescript
import { useBookingCompletion } from '~/composables/useBookingCompletion'

const { completeBookingAndRate, submitRating } = useBookingCompletion()

// Complete booking and show rating popup
const booking = await completeBookingAndRate(
  'BOOKING-123',
  'shanti-dharamshala',
  'Guest Name',
  'guest@email.com'
)

// Or submit rating directly
const rating = await submitRating(
  'BOOKING-123',
  'shanti-dharamshala',
  {
    guestName: 'Guest Name',
    guestEmail: 'guest@email.com',
    overallRating: 5,
    cleanliness: 5,
    comfort: 4,
    hospitality: 5,
    value: 4,
    comment: 'Amazing stay!'
  }
)
```

---

## Server Endpoints

### GET /api/ratings
**Fetch all ratings**

```bash
curl http://localhost:3000/api/ratings
```

Response:
```json
[
  {
    "id": "RATING-1701000000-abc123",
    "dharamshalaId": "shanti-dharamshala",
    "guestName": "Raj Patel",
    "overallRating": 5,
    ...
  }
]
```

### POST /api/ratings
**Create a new rating**

```bash
curl -X POST http://localhost:3000/api/ratings \
  -H "Content-Type: application/json" \
  -d '{
    "dharamshalaId": "shanti-dharamshala",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "bookingId": "BOOKING-123",
    "overallRating": 5,
    "cleanliness": 5,
    "comfort": 4,
    "hospitality": 5,
    "value": 4,
    "comment": "Great stay!",
    "visitDate": "2025-12-07"
  }'
```

### GET /api/ratings/dharamshala/:id
**Fetch ratings for specific dharamshala**

```bash
curl http://localhost:3000/api/ratings/dharamshala/shanti-dharamshala
```

### POST /api/bookings/:id/complete
**Mark booking as completed (triggers rating popup)**

```bash
curl -X POST http://localhost:3000/api/bookings/BOOKING-123/complete
```

---

## Sample Data

Sample ratings are pre-loaded from `src/server/utils/sampleData.ts` in the `sampleRatings` array.

**Pre-configured ratings for:**
- `shanti-dharamshala` - 3 ratings (5★, 4★, 5★)
- `divya-nivas` - 2 ratings (4★, 5★)
- `jain-rest-house` - 1 rating (3★)

### Loading Sample Ratings

The first API call to `/api/ratings` loads all sample data:

```javascript
// In browser console
const ratings = await fetch('/api/ratings').then(r => r.json())
console.log(ratings) // Shows all sample ratings
```

---

## Real-Time Workflow (When Integrated with Real Bookings)

### Phase 1: Booking Creation
```
1. User books a room → Booking created with status 'confirmed'
2. System stores: booking ID, dharamshala ID, guest info
```

### Phase 2: Check-Out
```
1. User checks out → Status changes to 'checked-out'
2. System triggers: Check if booking has rating (GET /api/ratings/booking/:id/check)
```

### Phase 3: Rating Popup
```
1. If not rated → Show RatingModal component
2. User fills form and submits
3. Rating stored → Updates dharamshala average
```

### Phase 4: Display
```
1. RatingDisplay component fetches ratings for dharamshala
2. Shows aggregated stats and recent reviews
```

---

## Configuration (Future Database Integration)

When integrating with a real database:

### Server Endpoints to Update:
1. `src/server/api/ratings/index.get.ts` - Fetch from DB instead of Map
2. `src/server/api/ratings/index.post.ts` - Store in DB
3. `src/server/api/ratings/dharamshala/[id].get.ts` - Query by dharamshalaId
4. `src/server/api/bookings/[id]/complete.post.ts` - Update booking status to 'checked-out'

### Store Changes:
- No changes needed - store layer is DB-agnostic
- Just update API composable responses

---

## Testing Checklist

- [ ] Load dharamshala detail page with sample data
- [ ] Verify ratings section displays with averages
- [ ] See "No ratings yet" message for dharamshala without ratings
- [ ] Use browser console to trigger rating popup
- [ ] Fill out all rating fields
- [ ] Submit rating (should appear immediately in display)
- [ ] Check category breakdowns update
- [ ] Test expandable reviews list
- [ ] Verify form validation (no overall rating → disabled submit)
- [ ] Test error handling (network error simulation)

---

## Styling & Theme

**Color Scheme:**
- Overall Rating: `amber-500` (⭐)
- Cleanliness: `blue-500` (✨)
- Comfort: `green-500` (🪑)
- Hospitality: `red-500` (❤️)
- Value: `purple-500` (💰)

**Responsive Design:**
- Mobile: Full-width modal, stacked categories
- Tablet: 2-column category grid
- Desktop: 4-column category grid

---

## Troubleshooting

### Rating Popup Not Showing
1. Check browser console for errors
2. Verify `isRatingModalOpen` is true in component
3. Check if `completeBookingForRating` is accessible: `console.log(window.completeBookingForRating)`

### Ratings Not Displaying
1. Check `/api/ratings` endpoint returns data
2. Verify dharamshalaId matches in rating and dharamshala
3. Check `dharamshalaRatings` ref is populated in component

### Sample Data Not Loading
1. Ensure `sampleRatings` export exists in `sampleData.ts`
2. Check server logs for import errors
3. Manually test endpoint: `curl http://localhost:3000/api/ratings`

---

## Next Steps (Future Enhancements)

1. **Database Integration**
   - Connect to MongoDB/PostgreSQL
   - Add admin moderation for reviews
   - Filter inappropriate comments

2. **Real Booking Integration**
   - Auto-trigger popup after real check-out
   - Track booking-to-rating conversion rate
   - Send email reminder if rating not submitted

3. **Advanced Features**
   - Photo reviews (guests upload images)
   - Helpful votes on reviews
   - Response mechanism (dharamshala owner reply)
   - Rating filters (sort by helpful, recent, highest)

4. **Analytics**
   - Rating trends over time
   - Category performance comparison
   - Seasonal rating variations

---

## References

- **Airbnb Rating System:** https://www.airbnb.com/help/article/1257
- **TirthLok Instructions:** `.github/copilot-instructions.md`
- **Vue 3 Docs:** https://vuejs.org/
- **Nuxt 3 Docs:** https://nuxt.com/
- **Pinia Docs:** https://pinia.vuejs.org/
