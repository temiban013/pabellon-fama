# Service Worker Management Strategy

## Overview

This document defines the strategy for managing Service Workers (SW) in the Pabellón de la Fama application. This strategy was created following a critical production incident on 2025-10-16 where a stale Service Worker caused complete service outage for Android Chrome users.

**Last Updated**: 2025-10-16
**Status**: ENFORCED

## Critical Warning

> ⚠️ **SERVICE WORKERS ARE DANGEROUS IF NOT MANAGED PROPERLY**
>
> - They persist across deployments
> - They survive browser cache clearing
> - They can poison production for all users
> - One bad SW deployment can break all future deployments
> - They require robust update and versioning strategies

## Current Status

**Service Worker**: ❌ NOT IMPLEMENTED (and should remain unimplemented until strategy is in place)

**Current Cleanup**: ✅ Auto-unregister script deployed to clean up any existing Service Workers from all users

**File**: `src/app/layout.tsx:180-201`

```typescript
{/* Service Worker Cleanup - Unregister old SW for all users */}
<Script
  id="sw-cleanup"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister().then(() => {
              console.log('Old service worker unregistered');
              // Force reload to clear any cached chunks
              if (performance.navigation.type !== 1) {
                window.location.reload();
              }
            });
          });
        });
      }
    `,
  }}
/>
```

**Timeline**: This cleanup script should be removed 1-2 weeks after deployment (estimated removal: 2025-10-30).

## The Problem: What Went Wrong

### Incident Timeline (2025-10-16)

1. **Commit `e142d4a`** - Service Worker was registered (Google Analytics implementation)
2. **Service Worker cached** webpack chunk references (e.g., `layout-abc123.js`)
3. **Commit `98e7526`** - New deployment generated NEW chunk hashes (e.g., `layout-xyz789.js`)
4. **Stale Service Worker** attempted to serve old chunk references
5. **Chunks returned 404** because they no longer existed
6. **Browser received 404 HTML page** instead of JavaScript
7. **MIME type error**: 'text/plain' instead of 'application/javascript'
8. **ChunkLoadError**: Android Chrome refused to execute, site completely broken

### Why It Affected Android Chrome But Not Desktop Firefox

- **Android Chrome**: Enforces strict MIME type checking, caught the 404 error page
- **Desktop Firefox**: More lenient, allowed execution despite incorrect MIME type
- **Result**: Production appeared to work on desktop but was broken for mobile users

### Root Cause

**Service Workers persisted across deployments** and Next.js doesn't have built-in SW management. When webpack generates new chunk hashes on each build, old SWs serve stale references.

## When to Use Service Workers

### ✅ Use Service Workers When:

1. **Offline functionality is critical** - App must work without internet
2. **Caching strategy is well-defined** - You know exactly what to cache and when
3. **You have update mechanism** - Reliable way to force SW updates
4. **You have kill switch** - Ability to remotely unregister if things break
5. **You have comprehensive testing** - Tested on ALL target browsers/devices
6. **You have monitoring** - Detect SW issues in production

### ❌ DO NOT Use Service Workers When:

1. **App works fine without offline support** - Don't add complexity unnecessarily
2. **You don't have update strategy** - Dangerous to deploy without this
3. **You're using webpack/Vite code splitting** - SW can cache stale chunk references
4. **You're in early development** - Add SW later when app is stable
5. **Testing is insufficient** - Must test SW updates across deployments

### Current Recommendation for Pabellón de la Fama

**DO NOT implement Service Worker** until:

1. Offline functionality becomes a user requirement
2. We have automated testing pipeline
3. We have comprehensive multi-browser testing
4. We implement proper SW versioning strategy (see below)

## If Service Workers Must Be Implemented

### Required Components

#### 1. Service Worker Versioning

**File**: `public/sw.js` (example)

```javascript
// ALWAYS include version in SW file
const SW_VERSION = 'v1.0.0';
const CACHE_NAME = `pfdh-cache-${SW_VERSION}`;

// On install, delete old caches
self.addEventListener('install', (event) => {
  console.log(`SW ${SW_VERSION} installing...`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('pfdh-cache-') && name !== CACHE_NAME)
          .map((name) => {
            console.log(`Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    })
  );
  // Force immediate activation
  self.skipWaiting();
});

// On activate, claim all clients immediately
self.addEventListener('activate', (event) => {
  console.log(`SW ${SW_VERSION} activated`);
  event.waitUntil(self.clients.claim());
});

// Fetch strategy: Network first, fall back to cache
self.addEventListener('fetch', (event) => {
  // NEVER cache webpack chunks
  if (event.request.url.includes('/_next/static/chunks/')) {
    return; // Let browser handle, don't cache
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request);
      })
  );
});
```

#### 2. Service Worker Registration with Update Check

**File**: `src/app/layout.tsx` (example)

```typescript
{/* Service Worker Registration - ONLY if needed */}
<Script
  id="sw-register"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
              console.log('SW registered:', registration);

              // Check for updates every 60 seconds
              setInterval(() => {
                registration.update();
              }, 60000);

              // Listen for updates
              registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'activated') {
                    // New SW activated, reload page
                    window.location.reload();
                  }
                });
              });
            })
            .catch((error) => {
              console.error('SW registration failed:', error);
            });
        });
      }
    `,
  }}
/>
```

#### 3. Remote Kill Switch

**File**: `src/app/layout.tsx` (additional script)

```typescript
{/* SW Kill Switch - Check server for kill signal */}
<Script
  id="sw-kill-switch"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      if ('serviceWorker' in navigator) {
        // Check if SW should be killed
        fetch('/api/sw-status')
          .then(res => res.json())
          .then(data => {
            if (data.kill === true) {
              // Kill switch activated
              navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => {
                  registration.unregister();
                  console.log('SW killed by remote signal');
                });
              });
              // Clear caches
              caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
              });
              // Reload page
              window.location.reload();
            }
          });
      }
    `,
  }}
/>
```

**API Endpoint**: `src/app/api/sw-status/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  // Check environment variable or database flag
  const killSwitch = process.env.SW_KILL_SWITCH === 'true';

  return NextResponse.json({
    kill: killSwitch,
    version: process.env.SW_VERSION || 'v1.0.0',
  });
}
```

**Usage**: Set `SW_KILL_SWITCH=true` in Vercel environment variables to kill all SWs remotely.

#### 4. Critical: Never Cache Webpack Chunks

**Rule**: Service Workers MUST NEVER cache Next.js webpack chunks.

**Reason**: Chunk hashes change on every build. If SW caches them, they become stale and cause 404s.

**Implementation**:

```javascript
// In sw.js fetch handler
self.addEventListener('fetch', (event) => {
  // NEVER cache webpack chunks
  if (
    event.request.url.includes('/_next/static/chunks/') ||
    event.request.url.includes('/_next/static/css/')
  ) {
    // Let browser handle these, don't cache
    return;
  }

  // Cache other resources...
});
```

**What CAN be cached**:
- Static images (`/images/`)
- Fonts (`/fonts/`)
- Static assets (`/favicon.ico`, etc.)
- API responses (with TTL)

**What CANNOT be cached**:
- Webpack chunks (`/_next/static/chunks/`)
- Build manifests (`/_next/static/buildId/`)
- Dynamic routes (unless explicitly designed for offline)

### Testing Requirements for Service Workers

✅ **Before deploying ANY Service Worker:**

- [ ] SW registers successfully on first visit
- [ ] SW updates tested across 3 deployments
- [ ] Old SW unregisters when new version deploys
- [ ] Cached resources update correctly
- [ ] No webpack chunk caching occurs
- [ ] Kill switch tested (can remotely unregister)
- [ ] Tested on Desktop Chrome
- [ ] Tested on Desktop Firefox
- [ ] **Tested on Android Chrome (MANDATORY)**
- [ ] **Tested on iOS Safari** (if supporting iOS)
- [ ] Update check interval works (60 seconds)
- [ ] Page reloads after SW update
- [ ] No infinite reload loops

**Testing Update Flow**:

1. Deploy version 1 with SW version `v1.0.0`
2. Verify SW registers
3. Deploy version 2 with SW version `v1.0.1`
4. Wait 60 seconds (update check interval)
5. Verify old SW unregisters, new SW registers
6. Verify page reloads once
7. Verify new SW is active
8. Repeat for version 3

**Testing Kill Switch**:

1. Set `SW_KILL_SWITCH=true` in Vercel env vars
2. Visit site
3. Verify SW unregisters within 60 seconds
4. Verify caches cleared
5. Verify page reloads
6. Set `SW_KILL_SWITCH=false`
7. Verify SW re-registers on next visit

## Recommended Alternatives to Service Workers

### For PWA Functionality

**Use Next.js Built-in Features**:

1. **App Shell**: Use Next.js App Router layout
2. **Static Generation**: Use `generateStaticParams()` for offline-ready pages
3. **Metadata**: Use Next.js metadata API instead of SW-managed manifest
4. **Icons**: Use static icons in `public/` folder

### For Offline Support

**Use Browser Caching**:

1. Set proper `Cache-Control` headers in `next.config.js`
2. Use CDN caching (Vercel Edge Network)
3. Use `stale-while-revalidate` strategy

**Example**: `next.config.js`

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### For Performance

**Use React Server Components**:

1. Render content on server (faster initial load)
2. Use streaming SSR
3. Prefetch critical routes with `<Link prefetch>`

**Use Next.js Image Optimization**:

1. `<Image>` component with lazy loading
2. Automatic WebP conversion
3. Responsive images with `sizes` prop

## Monitoring Service Workers

### If SW is Deployed

**Metrics to Monitor**:

1. SW registration success rate
2. SW update success rate
3. Cache hit/miss ratio
4. SW-related errors in console
5. ChunkLoadError occurrences

**Monitoring Tools**:

1. **Vercel Analytics** - Track JS errors
2. **Google Analytics** - Custom SW events
3. **Sentry** - Error tracking
4. **Console Logs** - Remote debugging on Android

**Custom SW Events** (example):

```javascript
// In sw.js
self.addEventListener('install', () => {
  // Track SW install
  fetch('/api/analytics/sw-install', { method: 'POST' });
});

self.addEventListener('activate', () => {
  // Track SW activate
  fetch('/api/analytics/sw-activate', { method: 'POST' });
});

self.addEventListener('fetch', () => {
  // Track cache hits
  if (cachedResponse) {
    fetch('/api/analytics/sw-cache-hit', { method: 'POST' });
  }
});
```

## Summary

### Current Guidance

**DO NOT implement Service Workers** unless:

1. Offline functionality is a user requirement
2. All testing requirements can be met
3. Update mechanism is implemented
4. Kill switch is implemented
5. Monitoring is in place

### If SW Must Be Implemented

**Required Components**:

1. ✅ Versioning in SW file
2. ✅ Auto-update check (every 60 seconds)
3. ✅ Remote kill switch
4. ✅ Never cache webpack chunks
5. ✅ Comprehensive testing on all platforms
6. ✅ Monitoring and alerting

### Current Cleanup

**Temporary Script**: Auto-unregister script deployed to clean up old SWs

**Removal Date**: ~2025-10-30 (1-2 weeks after deployment)

**Location**: `src/app/layout.tsx:180-201`

---

**Related Documents**:
- `docs/LESSONS_LEARNED_ANDROID_CHROME_INCIDENT.md` - Incident that created this strategy
- `docs/TESTING_REQUIREMENTS.md` - Testing requirements for SW deployment
- Next.js PWA Guide: https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps

**Document Owner**: Portfolio Orchestrator
**Status**: ENFORCED - No SW deployment without approval
**Last Updated**: 2025-10-16
