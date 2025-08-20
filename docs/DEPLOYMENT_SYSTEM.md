# Sistema de Deployment

## Descripción General

El sistema de deployment proporciona una estrategia completa para desplegar la aplicación en producción de manera segura, eficiente y escalable. Incluye configuración de entornos, CI/CD, monitoreo y optimizaciones de rendimiento.

## Arquitectura de Deployment

### Entornos

1. **Development**: Entorno local para desarrollo
2. **Staging**: Entorno de pruebas previo a producción
3. **Production**: Entorno de producción para usuarios finales

### Plataformas de Deployment

- **Vercel**: Plataforma principal para Next.js
- **Firebase Hosting**: Alternativa para hosting estático
- **Docker**: Contenedores para deployment flexible
- **GitHub Actions**: CI/CD pipeline

## Configuración de Entornos

### Variables de Entorno

**Archivo**: `.env.local` (Development)

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_dev_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=DimSure Dev
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_SEARCH_SUGGESTIONS=true

# Performance
NEXT_PUBLIC_IMAGE_OPTIMIZATION=true
NEXT_PUBLIC_LAZY_LOADING=true
```

**Archivo**: `.env.production` (Production)

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_prod_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com

# Application Configuration
NEXT_PUBLIC_APP_URL=https://dimsure.com
NEXT_PUBLIC_APP_NAME=DimSure
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_SEARCH_SUGGESTIONS=true

# Performance
NEXT_PUBLIC_IMAGE_OPTIMIZATION=true
NEXT_PUBLIC_LAZY_LOADING=true

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Configuración de Next.js

**Archivo**: `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de rendimiento
  // Nota: En versiones recientes de Next.js muchas optimizaciones están habilitadas por defecto
  // y opciones experimentales como `optimizeCss`/`optimizePackageImports` ya no son necesarias.

  // Configuración de imágenes
  images: {
    domains: ["firebasestorage.googleapis.com", "lh3.googleusercontent.com"],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },

  // Redirecciones
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Rewrites para API
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },

  // Configuración de compresión
  compress: true,

  // Configuración de PWA
  // Desde Next.js 13+, la minificación con SWC está habilitada por defecto
  // y la opción `swcMinify` fue eliminada.
  ...(process.env.NODE_ENV === "production" && {}),
};

export default nextConfig;
```

## Vercel Deployment

### Configuración de Vercel

**Archivo**: `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_APP_ENV": "production"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Configuración de Dominio

```bash
# Configurar dominio personalizado
vercel domains add dimsure.com

# Configurar SSL automático
vercel domains verify dimsure.com

# Configurar DNS
# A     dimsure.com     76.76.19.36
# CNAME www.dimsure.com cname.vercel-dns.com
```

## Firebase Deployment

### Configuración de Firebase

**Archivo**: `firebase.json`

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|avif|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### Reglas de Firestore

**Archivo**: `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer productos públicos
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         request.auth.token.email == resource.data.adminEmail);
      allow delete: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         request.auth.token.email == resource.data.adminEmail);
    }

    // Solo admins pueden acceder a configuración
    match /admin/{document=**} {
      allow read, write: if request.auth != null &&
        request.auth.token.email == resource.data.adminEmail;
    }

    // Usuarios pueden gestionar sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == userId;
    }

    // Disputas públicas para lectura, creación para usuarios autenticados
    match /disputes/{disputeId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         request.auth.token.email == resource.data.adminEmail);
    }
  }
}
```

## CI/CD Pipeline

### GitHub Actions

**Archivo**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: "${{ secrets.GITHUB_TOKEN }}"
          firebaseServiceAccount: "${{ secrets.FIREBASE_SERVICE_ACCOUNT }}"
          channelId: live
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}

      - name: Notify deployment
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-type: application/json' \
            -d '{"text":"🚀 DimSure deployed to production successfully!"}'
```

### Docker Deployment

**Archivo**: `Dockerfile`

```dockerfile
# Multi-stage build
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Archivo**: `docker-compose.yml`

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_FIREBASE_API_KEY=${FIREBASE_API_KEY}
      - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
      - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

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
    restart: unless-stopped
```

## Monitoreo y Observabilidad

### Configuración de Sentry

**Archivo**: `sentry.client.config.js`

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

**Archivo**: `sentry.server.config.js`

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});
```

### Configuración de Analytics

**Archivo**: `lib/analytics.ts`

```typescript
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
    </>
  );
}

// Google Analytics
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

## Optimizaciones de Rendimiento

### Configuración de Caché

**Archivo**: `lib/cache.ts`

```typescript
import { LRUCache } from "lru-cache";

// Cache para productos
export const productCache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutos
  updateAgeOnGet: true,
});

// Cache para búsquedas
export const searchCache = new LRUCache<string, any>({
  max: 1000,
  ttl: 1000 * 60 * 2, // 2 minutos
  updateAgeOnGet: true,
});

// Cache para traducciones
export const translationCache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 60, // 1 hora
  updateAgeOnGet: true,
});

// Función para limpiar cache
export const clearCache = () => {
  productCache.clear();
  searchCache.clear();
  translationCache.clear();
};
```

### Optimización de Imágenes

**Archivo**: `lib/image-optimization.ts`

```typescript
import { getImageSize } from "next/image";

export const optimizeImage = async (
  imageUrl: string,
  options: {
    width: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "jpeg";
  }
) => {
  const { width, height, quality = 80, format = "webp" } = options;

  // Usar Next.js Image Optimization
  const optimizedUrl = `/_next/image?url=${encodeURIComponent(
    imageUrl
  )}&w=${width}&q=${quality}&f=${format}`;

  return optimizedUrl;
};

export const preloadImage = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};
```

## Seguridad

### Configuración de CSP

**Archivo**: `middleware.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self'",
    "connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

### Configuración de Rate Limiting

**Archivo**: `lib/rate-limit.ts`

```typescript
import { LRUCache } from "lru-cache";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options: Options) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;
        tokenCache.set(token, tokenCount);

        if (isRateLimited) {
          reject(new Error("Rate limit exceeded"));
        } else {
          resolve();
        }
      }),
  };
}
```

## Scripts de Deployment

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:ci": "jest --ci --coverage",
    "deploy:staging": "vercel --prod",
    "deploy:production": "vercel --prod && firebase deploy",
    "deploy:docker": "docker-compose up -d --build",
    "analyze": "ANALYZE=true npm run build",
    "generate-sitemap": "node scripts/generate-sitemap.js",
    "generate-robots": "node scripts/generate-robots.js"
  }
}
```

## Versionado de la aplicación

La UI muestra la versión como `v<version>` debajo del botón de autenticación en la navegación. La fuente de la versión es:

- `NEXT_PUBLIC_APP_VERSION` si está definida en el entorno de build/deploy.
- En su defecto, la propiedad `version` de `package.json`.

Actualización manual de versión (SemVer):

```bash
pnpm version patch   # 1.0.0 -> 1.0.1
pnpm version minor   # 1.0.0 -> 1.1.0
pnpm version major   # 1.0.0 -> 2.0.0
```

Notas:

- Tras actualizar la versión, realizar build y deploy para reflejarla en la UI.
- También puede definirse `NEXT_PUBLIC_APP_VERSION` en el proveedor (por ejemplo Vercel/Firebase) para forzar un valor específico.

### Scripts de Utilidad

**Archivo**: `scripts/deploy.sh`

```bash
#!/bin/bash

# Script de deployment automatizado
set -e

echo "🚀 Starting deployment..."

# Verificar que estamos en la rama correcta
if [ "$(git branch --show-current)" != "main" ]; then
  echo "❌ Must be on main branch to deploy"
  exit 1
fi

# Verificar que no hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ There are uncommitted changes"
  exit 1
fi

# Ejecutar tests
echo "🧪 Running tests..."
npm run test:ci

# Ejecutar build
echo "🔨 Building application..."
npm run build

# Deploy a Vercel
echo "📦 Deploying to Vercel..."
npm run deploy:production

# Deploy a Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy

# Generar sitemap
echo "🗺️ Generating sitemap..."
npm run generate-sitemap

# Notificar deployment exitoso
echo "✅ Deployment completed successfully!"

# Enviar notificación
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-type: application/json' \
  -d '{"text":"🚀 DimSure deployed successfully to production!"}'
```

## Troubleshooting

### Problemas Comunes

1. **Build falla en producción**

   - Verificar variables de entorno
   - Comprobar dependencias
   - Revisar configuración de Next.js

2. **Deployment lento**

   - Optimizar tamaño del bundle
   - Usar cache de dependencias
   - Configurar CDN

3. **Errores de runtime**
   - Verificar logs de Sentry
   - Comprobar configuración de Firebase
   - Revisar reglas de Firestore

## Consideraciones Futuras

### Mejoras Planificadas

1. **Blue-Green Deployment**: Zero-downtime deployments
2. **Canary Releases**: Rollout gradual de features
3. **Multi-region**: Distribución global
4. **Auto-scaling**: Escalado automático
5. **Disaster Recovery**: Plan de recuperación

### Optimizaciones

1. **Edge Functions**: Computación en el edge
2. **Static Generation**: Más páginas estáticas
3. **Service Workers**: Caché offline
4. **CDN Optimization**: Mejor distribución de contenido
