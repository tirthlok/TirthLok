# Deployment Guide

## Table of Contents
1. [Development Environment](#development-environment)
2. [Production Build](#production-build)
3. [Deployment Platforms](#deployment-platforms)
4. [Environment Variables](#environment-variables)
5. [Performance Optimization](#performance-optimization)
6. [Security Considerations](#security-considerations)
7. [Monitoring & Logging](#monitoring--logging)

## Development Environment

### Prerequisites
- Node.js 18+ or higher
- npm or yarn package manager
- Git for version control

### Local Setup
```bash
# Clone repository
git clone <repository-url>
cd jain-tirth-explorer

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Start development server
npm run dev

# Open browser at http://localhost:3000
```

## Production Build

### Build Optimization
```bash
# Create optimized production build
npm run build

# Output directory: .output/

# Preview production build locally
npm run preview
```

### Build Output
- **Size**: ~500KB (gzipped)
- **Format**: Optimized for SSR and static deployment
- **Files**: Located in `.output/public/` (static files)

## Deployment Platforms

### 1. Vercel (Recommended for Nuxt)

#### Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Configuration (`vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output/public",
  "env": {
    "NUXT_PUBLIC_API_BASE_URL": "@api_url"
  }
}
```

#### Vercel Environment Variables
1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add:
   - `NUXT_PUBLIC_API_BASE_URL`: Your API URL
   - `NUXT_PUBLIC_MAPBOX_TOKEN`: Mapbox token (if using maps)

#### Performance Metrics (Vercel)
- **Deployment time**: ~2-3 minutes
- **Auto scaling**: Enabled
- **CDN**: Global
- **HTTPS**: Automatic

### 2. Netlify

#### Setup
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Connect repository (interactive)
netlify connect

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = ".output/public"

[env]
  NUXT_PUBLIC_API_BASE_URL = "your_api_url"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Docker (Self-hosted)

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "run", "preview"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NUXT_PUBLIC_API_BASE_URL: ${API_URL}
      NUXT_PUBLIC_MAPBOX_TOKEN: ${MAPBOX_TOKEN}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
```

#### Build and Run
```bash
# Build image
docker build -t jain-tirth-explorer .

# Run container
docker run -p 3000:3000 \
  -e NUXT_PUBLIC_API_BASE_URL=your_api_url \
  jain-tirth-explorer

# Or use Docker Compose
docker-compose up -d
```

### 4. AWS (EC2/AppRunner)

#### Deploy to AppRunner
```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker build -t jain-tirth .
docker tag jain-tirth:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/jain-tirth:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/jain-tirth:latest

# Create AppRunner service via AWS Console
```

#### EC2 Deployment
```bash
# SSH into instance
ssh -i key.pem ubuntu@<instance-ip>

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and deploy
git clone <repo-url>
cd jain-tirth-explorer
npm install
npm run build

# Install PM2
npm install -g pm2
pm2 start "npm run preview" --name "jain-tirth"
pm2 startup
pm2 save
```

### 5. Railway.app

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Init and deploy
railway init
railway up
```

### 6. Heroku

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create jain-tirth-explorer

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

## Environment Variables

### Required Variables
```env
# API Configuration
NUXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com

# Optional: Maps
NUXT_PUBLIC_MAPBOX_TOKEN=your_token_here

# Database (if applicable)
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db

# Admin secret (if applicable)
ADMIN_SECRET_KEY=your_secret_key
```

### Development vs Production
Create separate `.env.development` and `.env.production` files or use platform-specific environment variable settings.

## Performance Optimization

### 1. Image Optimization
```bash
# Install image optimization
npm install sharp

# Configured in nuxt.config.ts for automatic optimization
```

### 2. Caching Strategy
```typescript
// nuxt.config.ts
routeRules: {
  '/': { cache: { maxAge: 60 } },
  '/tirth/**': { cache: { maxAge: 3600 } },
  '/api/**': { cache: { maxAge: 0 } }
}
```

### 3. Code Splitting
- Automatic by Nuxt
- Each route gets its own chunk
- Dynamic imports for large components

### 4. Compression
- Gzip: Enabled by default
- Brotli: Can be enabled via CDN (Vercel/Netlify)
- Size reduction: ~70%

### 5. CDN Integration
```typescript
// Configure baseURL for CDN assets
export default defineNuxtConfig({
  app: {
    cdnURL: 'https://cdn.yourdomain.com/'
  }
})
```

## Security Considerations

### 1. HTTPS/TLS
- All platforms provide automatic HTTPS
- Use strong certificates
- Enable HSTS headers

### 2. Environment Variables
- Never commit `.env` files
- Use platform-specific secret management
- Rotate secrets regularly

### 3. Content Security Policy
```typescript
// Add to app.vue or middleware
useHead({
  meta: [
    {
      'http-equiv': 'Content-Security-Policy',
      content: "default-src 'self'; script-src 'self' 'unsafe-inline'"
    }
  ]
})
```

### 4. Rate Limiting
```typescript
// server/middleware/rateLimit.ts
export default defineEventHandler((event) => {
  // Implement rate limiting logic
})
```

### 5. CORS Configuration
```typescript
// nuxt.config.ts
nitro: {
  prerender: {
    crawlLinks: true,
    routes: ['/sitemap.xml']
  },
  headers: {
    'Access-Control-Allow-Origin': 'https://yourdomain.com'
  }
}
```

### 6. API Security
- Use authentication tokens
- Validate all inputs
- Implement rate limiting
- Use CORS headers properly

## Monitoring & Logging

### 1. Error Tracking (Sentry)
```bash
npm install @sentry/nuxt
```

```typescript
// nuxt.config.ts
import * as Sentry from "@sentry/nuxt"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
})
```

### 2. Analytics
```typescript
// Track page views, events
const analytics = useRouter()
analytics.afterEach((to) => {
  gtag.config({ page_path: to.path })
})
```

### 3. Performance Monitoring
```typescript
// Web Vitals
export default defineNuxtPlugin(() => {
  if (process.client) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
  }
})
```

### 4. Server Logs
```bash
# View logs in different platforms
# Vercel
vercel logs

# Netlify
netlify logs:functions

# Docker
docker logs <container-id>

# PM2
pm2 logs
```

## Health Checks

### Deployment Health Check
```typescript
// server/api/health.get.ts
export default defineEventHandler(() => {
  return {
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  }
})
```

## Rollback Strategy

### Vercel/Netlify
- Automatic rollback available in dashboard
- Previous deployments accessible

### Docker/Self-hosted
```bash
# Keep previous versions
git tag v1.0.0
git push origin v1.0.0

# Rollback to previous version
git checkout v1.0.0
npm run build
```

## CI/CD Pipeline Example

### GitHub Actions
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

**Choose deployment platform based on:**
- **Vercel**: Best for Nuxt, minimal config, free tier available
- **Netlify**: Good alternative, excellent DX, free tier available
- **Docker**: Maximum control, self-hosted, requires more setup
- **AWS/Heroku**: Enterprise solutions, more complex configuration

For most users, **Vercel** is recommended for its Nuxt optimization and ease of use.
