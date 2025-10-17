# Lessons Learned: Android Chrome Production Incident (2025-10-16)

## Incident Summary

**Date**: October 16, 2025
**Severity**: CRITICAL - Production Down for Android Chrome Users
**Duration**: ~3 hours from detection to resolution
**Affected Users**: All Android Chrome users accessing www.pfdh.org
**Root Cause**: Service Worker caching stale webpack chunks causing ChunkLoadError

## Error Symptoms

### User-Facing Error
```
Application error: a client-side exception has occurred while loading www.pfdh.org
(see the browser console for more information)
```

### Console Errors
```
/_next/static/chunks/app/layout-e7b26292f5b46c55.js:1
Failed to load resource: the server responded with a status of 404 ()

Refused to execute script from 'https://www.pfdh.org/_next/static/chunks/app/layout-e7b26292f5b46c55.js'
because its MIME type ('text/plain') is not executable, and strict MIME type checking is enabled.

webpack-8e6d25b3f121755e.js:1
Uncaught ChunkLoadError: Loading chunk 177 failed.
```

### Additional PWA Manifest Errors
```
/icon-192.png:1 GET https://www.pfdh.org/icon-192.png 404 (Not Found)
/screenshots/mobile-directorio.png:1 GET https://www.pfdh.org/screenshots/mobile-directorio.png 404 (Not Found)
Error while trying to use the following icon from the Manifest
```

## Root Cause Analysis

### Primary Cause: Service Worker Cache Poisoning

1. **Service Worker was registered** in commit `e142d4a` (Google Analytics implementation)
2. **Service Worker persisted** across deployments, caching webpack chunk references
3. **New deployment** (`98e7526` - Sprint 3, Revista #03) generated new chunk hashes
4. **Stale Service Worker** attempted to serve old chunk references that no longer existed
5. **Android Chrome enforced strict MIME checks**, caught the 404 HTML error page being served as JavaScript
6. **Firefox was more lenient**, didn't catch the issue

### Secondary Cause: Missing PWA Assets

1. **manifest.ts referenced non-existent files**: `icon-192.png`, `icon-512.png`, `icon-96.png`, screenshots
2. **Next.js generates manifest.webmanifest** from `src/app/manifest.ts` (NOT `public/manifest.json`)
3. **Browser attempted to load missing assets** causing additional console errors

## What We Learned

### 1. Service Workers Are Persistent and Dangerous

**Lesson**: Service Workers survive deployments and can poison production for all users.

**Why It Matters**:
- SW caches are independent of browser cache
- SW doesn't automatically update when new code deploys
- One bad SW deployment can break all future deployments

**Action**: Never register a Service Worker unless you have a robust update/cleanup strategy in place.

### 2. Android Chrome vs Desktop Firefox Behave Differently

**Lesson**: Desktop Firefox testing is NOT sufficient. Mobile browsers enforce stricter checks.

**Why It Matters**:
- Android Chrome caught MIME type mismatches that Firefox ignored
- Mobile browsers have stricter PWA manifest requirements
- Desktop testing gave false confidence

**Action**: ALWAYS test on actual Android Chrome before declaring production ready.

### 3. Misleading Error Messages

**Lesson**: "Application error: a client-side exception" suggested React hydration, but was actually webpack chunk loading.

**Investigation Mistakes Made**:
1. Initially focused on React hydration (Date objects, etc.)
2. Wasted time debugging calendario page when error was on home page
3. Should have looked at Network tab first, not just console errors

**Action**: Always check Network tab for 404s before assuming hydration errors.

### 4. Commit Comparison Reveals Truth

**Lesson**: Comparing working commit (`e142d4a`) vs broken commit (`98e7526`) revealed the Service Worker registration.

**Why It Worked**:
- User rolled back production to identify last working state
- Git diff showed exactly what changed
- Checking out broken commit locally reproduced issue

**Action**: When production breaks, immediately identify last working commit and diff against current.

### 5. PWA Manifest Has Two Sources

**Lesson**: Next.js uses `src/app/manifest.ts` to generate the manifest, NOT `public/manifest.json`.

**Why It Matters**:
- Editing `public/manifest.json` has no effect in Next.js 15
- Must understand framework conventions
- Icon references in manifest.ts must exist as actual files

**Action**: Always verify which manifest source Next.js actually uses.

## Solutions Implemented

### 1. Service Worker Auto-Cleanup Script

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

**How It Works**:
- Runs for ALL users on next page load
- Unregisters any existing Service Workers
- Forces one-time reload to clear cached chunks
- Prevents issue from affecting other users

**Temporary**: Should be removed after 1-2 weeks when all users have been cleaned up.

### 2. Created Missing PWA Assets

**Files Created**:
- `public/icon-192.png` (192x192)
- `public/icon-512.png` (512x512)
- `public/icon-96.png` (96x96) - for shortcuts
- `public/screenshots/desktop-home.png` (1280x720)
- `public/screenshots/mobile-directorio.png` (375x812)

**Also Created** (earlier in development):
- `public/android-chrome-192x192.png`
- `public/android-chrome-512x512.png`
- `public/apple-touch-icon.png`
- `public/favicon-96x96.png`
- `public/favicon-32x32.png`
- `public/favicon-16x16.png`
- `public/favicon.ico`

## Preventative Measures Going Forward

### 1. Never Use Service Workers Without Strategy

**Rule**: Do NOT register Service Workers unless we have:
- Versioning strategy
- Auto-update mechanism
- Kill switch (ability to unregister remotely)
- Comprehensive testing on all target browsers

### 2. Mandatory Android Chrome Testing

**Rule**: NO deployment to production without testing on:
- Android Chrome (actual device, not just DevTools)
- Desktop Chrome
- Desktop Firefox
- iOS Safari (if budget allows)

**How**: See updated `docs/TESTING_REQUIREMENTS.md`

### 3. PWA Manifest Validation

**Rule**: Before any PWA-related deployment:
- Verify all icon files exist in `public/`
- Verify all screenshot files exist in `public/screenshots/`
- Run `pnpm build` and check for manifest warnings
- Test manifest.webmanifest endpoint in browser

### 4. Git Workflow for Production Issues

**Process**:
1. Identify last working production commit
2. Identify current broken production commit
3. Git diff between them to see what changed
4. Checkout broken commit locally to reproduce
5. Test fix on that commit before deploying

### 5. Better Error Diagnosis Process

**Checklist When Production Breaks**:
1. ✅ Check Network tab for 404s FIRST
2. ✅ Check Console for actual error stack traces
3. ✅ Test on ACTUAL target device (not just DevTools)
4. ✅ Compare working vs broken commits
5. ✅ Reproduce locally on broken commit
6. ⚠️ Don't assume error message is accurate (hydration vs chunk loading)

## Related Commits

| Commit | Description | Impact |
|--------|-------------|--------|
| `e142d4a` | Google Analytics implementation | Last WORKING commit (rolled back to this) |
| `98e7526` | Sprint 3 - Revista #03 integration | BROKE production (new chunk hashes, old SW cached) |
| `1e4a2b1` | Auto-unregister old service worker | FIXED primary issue for all users |
| `4ee1406` | PWA manifest errors and service worker cleanup | FIXED secondary PWA asset 404s |

## Files Modified During Incident Resolution

1. `src/app/layout.tsx` - SW cleanup script, GTM timing, removed preload
2. `src/components/analytics/CookieConsent.tsx` - Hydration fix (preventative, not main issue)
3. `src/components/layout/Footer.tsx` - Static year (preventative)
4. `src/components/SEO/IconLinks.tsx` - Icon references, mobile-web-app-capable meta
5. `public/manifest.json` - Updated icon references (though manifest.ts is actual source)
6. Created all missing icon and screenshot files

## Timeline

| Time | Event |
|------|-------|
| ~18:00 | User reports Android Chrome error in production |
| ~18:15 | Initial investigation focused on hydration (WRONG PATH) |
| ~18:30 | User corrects: "issue is on main page, not calendario" |
| ~18:45 | User rolls back to `e142d4a`, identifies `98e7526` as breaking commit |
| ~19:00 | User provides actual console errors - ChunkLoadError, not hydration |
| ~19:15 | Identified Service Worker as root cause |
| ~19:30 | Created SW auto-unregister script, deployed |
| ~19:45 | Primary issue resolved, discovered secondary PWA manifest 404s |
| ~20:30 | Created all missing icon/screenshot files |
| ~21:00 | All errors resolved, production stable |

## Cost of Incident

**User Impact**:
- ALL Android Chrome users couldn't access site for ~3 hours
- No data loss, but complete service outage for primary user segment

**Engineering Time**:
- ~3 hours debugging and resolution
- ~1 hour documentation and process improvement

**Lessons**:
- Insufficient testing process (desktop only)
- Lack of Service Worker management strategy
- Missing PWA asset validation before deployment

## Success Factors

**What Went Well**:
1. User provided critical information (last working commit, actual console errors)
2. Git history made it possible to identify exact breaking change
3. Service Worker auto-cleanup script fixes issue for all users automatically
4. Comprehensive fix addresses both primary (SW) and secondary (PWA assets) issues

## References

- Next.js PWA Documentation: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
- Service Worker Lifecycle: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
- Chrome DevTools for Android: https://developer.chrome.com/docs/devtools/remote-debugging/

## Action Items

- [x] Create lessons learned document (this file)
- [ ] Update `docs/TESTING_REQUIREMENTS.md` with mandatory Android Chrome testing
- [ ] Create `docs/SERVICE_WORKER_STRATEGY.md` with management guidelines
- [ ] Update orchestrator memory with critical findings
- [ ] Schedule removal of SW cleanup script (1-2 weeks after deployment)
- [ ] Add PWA manifest validation to CI/CD pipeline (future enhancement)

---

**Document Owner**: Portfolio Orchestrator
**Last Updated**: 2025-10-16
**Status**: Complete
