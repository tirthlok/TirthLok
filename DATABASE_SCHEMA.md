# Database Schema Documentation

## Overview
This document outlines the database schema for the Jain Tirth Explorer application.

## Collections/Tables

### 1. Tirth (Temple)

**Purpose**: Store information about Jain temples/pilgrimage sites

**Schema**:
```typescript
{
  id: ObjectId (unique identifier),
  name: String (temple name),
  description: String (brief description),
  historicalBackground: String (history),
  foundingYear: Number (year founded),
  foundingDetails: String (founding details),
  pratisthaYear: Number (year of idol installation),
  acharya: String (founding acharya),
  architecture: String (architectural style),
  moolnayak: [{
    name: String,
    height: String,
    metal: String,
    year: Number,
    details: String
  }],
  specialFacts: [String],
  poojaTimings: String,
  darshanTimings: String,
  festivals: [{
    name: String,
    date: String,
    month: String,
    description: String,
    specialEvent: String
  }],
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  images: [String] (URLs),
  sect: String enum ('Shwetambar', 'Digambar'),
  type: String enum ('Gyan-sthan', 'Siddhakshetra', 'Atishay-Kshetra', 'Other'),
  facilities: [ObjectId] (reference to Facility),
  rating: Number (1-5),
  reviews: Number (review count),
  travelDuration: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Facility

**Purpose**: Store information about nearby facilities

**Schema**:
```typescript
{
  id: ObjectId (unique identifier),
  tithId: ObjectId (reference to Tirth),
  name: String,
  type: String enum (
    'bhojanshala',
    'dharmashala',
    'gaushala',
    'clinic',
    'water',
    'parking',
    'washroom'
  ),
  description: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    city: String,
    state: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  image: String (URL),
  rating: Number (1-5),
  availability: String,
  operatingHours: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. User

**Purpose**: Store user profiles and preferences

**Schema**:
```typescript
{
  id: ObjectId (unique identifier),
  email: String (unique),
  name: String,
  password: String (hashed),
  profile: {
    bio: String,
    avatar: String (URL),
    sect: String ('Shwetambar', 'Digambar')
  },
  favorites: [ObjectId] (reference to Tirth),
  preferences: {
    language: String,
    notifications: Boolean,
    theme: String ('light', 'dark')
  },
  isVerified: Boolean,
  role: String enum ('user', 'admin', 'editor'),
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Review

**Purpose**: Store user reviews and ratings

**Schema**:
```typescript
{
  id: ObjectId (unique identifier),
  tithId: ObjectId (reference to Tirth),
  userId: ObjectId (reference to User),
  rating: Number (1-5),
  title: String,
  content: String,
  images: [String] (URLs),
  helpful: Number (count),
  createdAt: Date,
  updatedAt: Date
}
```

### 5. AdminLog

**Purpose**: Track administrative activities

**Schema**:
```typescript
{
  id: ObjectId (unique identifier),
  adminId: ObjectId (reference to User),
  action: String (create, update, delete),
  entity: String (Tirth, Facility, User),
  entityId: ObjectId,
  changes: Object (old values, new values),
  timestamp: Date
}
```

## Indexes

### Primary Indexes
```javascript
// Tirth Collection
db.tirths.createIndex({ name: 1 })
db.tirths.createIndex({ state: 1, sect: 1 })
db.tirths.createIndex({ type: 1 })
db.tirths.createIndex({ "location.city": 1 })
db.tirths.createIndex({ "location.latitude": 1, "location.longitude": 1 })

// User Collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ favorites: 1 })

// Review Collection
db.reviews.createIndex({ tithId: 1 })
db.reviews.createIndex({ userId: 1 })
db.reviews.createIndex({ createdAt: -1 })

// Facility Collection
db.facilities.createIndex({ tithId: 1 })
db.facilities.createIndex({ type: 1 })
```

## Relationships

```
User
├── favorites: [Tirth]
└── reviews: [Review]

Tirth
├── facilities: [Facility]
├── reviews: [Review]
└── location: Location

Facility
├── tithId: Tirth
└── location: Location

Review
├── tithId: Tirth
└── userId: User

AdminLog
└── adminId: User
```

## Sample Queries

### Find all temples in Gujarat
```javascript
db.tirths.find({ "location.state": "Gujarat" })
```

### Find Shwetambar temples
```javascript
db.tirths.find({ sect: "Shwetambar" })
```

### Find temples with facilities
```javascript
db.tirths.find({ facilities: { $exists: true, $ne: [] } })
```

### Get user's favorite temples
```javascript
db.tirths.find({ _id: { $in: user.favorites } })
```

### Get recent reviews
```javascript
db.reviews.find().sort({ createdAt: -1 }).limit(10)
```

### Find temples near location (geospatial)
```javascript
db.tirths.find({
  "location": {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [73.8, 22.1]
      },
      $maxDistance: 50000
    }
  }
})
```

## Data Validation Rules

### Tirth
- `name`: Required, max 255 characters
- `sect`: Required, must be 'Shwetambar' or 'Digambar'
- `type`: Required, must be valid type
- `rating`: Number between 1-5
- `location`: Required, valid coordinates
- `foundingYear`: 4-digit number

### Facility
- `name`: Required, max 255 characters
- `type`: Required, must be valid facility type
- `location`: Required
- `rating`: Number between 1-5

### User
- `email`: Required, valid email format, unique
- `name`: Required, max 255 characters
- `password`: Required, min 8 characters (hashed)

### Review
- `rating`: Required, 1-5
- `content`: Min 10, max 5000 characters
- `tithId`: Required
- `userId`: Required

## Migration Guide

### MongoDB (Using Mongoose)

```javascript
// Define schemas
const tirthSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  // ... other fields
})

// Create indexes
tirthSchema.index({ name: 1 })
tirthSchema.index({ "location.state": 1, sect: 1 })

// Export model
module.exports = mongoose.model('Tirth', tirthSchema)
```

### PostgreSQL (Using Sequelize)

```javascript
const Tirth = sequelize.define('Tirth', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // ... other fields
})
```

## Backup & Recovery

### MongoDB Backup
```bash
mongodump --db jain-tirth --out ./backup
```

### MongoDB Restore
```bash
mongorestore --db jain-tirth ./backup/jain-tirth
```

### PostgreSQL Backup
```bash
pg_dump jain-tirth > backup.sql
```

### PostgreSQL Restore
```bash
psql jain-tirth < backup.sql
```

---

**Note**: Choose your database based on requirements:
- **MongoDB**: Better for flexible schema, good for content management
- **PostgreSQL**: Better for relational data, strong consistency
