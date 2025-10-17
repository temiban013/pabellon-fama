# Testing Requirements - Pabellón de la Fama

## Overview

This document defines MANDATORY testing requirements for all development phases, sprints, and deployments to production. These requirements were established following the Android Chrome production incident on 2025-10-16.

**Last Updated**: 2025-10-16
**Status**: ENFORCED

## Critical Rule

> **NO DEPLOYMENT TO PRODUCTION WITHOUT COMPLETING ALL MANDATORY TESTS**

## Mandatory Test Matrix

Every feature, bug fix, or change MUST be tested on ALL platforms below before production deployment.

### Browser/Device Matrix

| Platform | Browser | Version | Status | Notes |
|----------|---------|---------|--------|-------|
| **Android** | Chrome | Latest | **MANDATORY** | Primary user segment |
| **Desktop** | Chrome | Latest | **MANDATORY** | Development standard |
| **Desktop** | Firefox | Latest | **MANDATORY** | Cross-browser validation |
| **iOS** | Safari | Latest | Recommended | If iOS users are expected |
| **Desktop** | Safari | Latest | Optional | macOS users |
| **Desktop** | Edge | Latest | Optional | Windows users |

### Why Android Chrome is MANDATORY

**Incident**: On 2025-10-16, production was tested ONLY on Desktop Firefox and deployed. Android Chrome users experienced complete service outage for 3 hours.

**Reason**: Android Chrome enforces:
- Stricter MIME type checking
- Stricter Service Worker behavior
- Stricter PWA manifest validation
- Different caching strategies than desktop

**Lesson**: Desktop testing ≠ Mobile testing. ALWAYS test on actual devices.

## Testing Checklist by Phase

### Phase 1: Development (Local Testing)

✅ **Before marking any feature as "complete":**

- [ ] Feature works on `localhost:3000`
- [ ] No console errors in Chrome DevTools
- [ ] No console warnings (unless documented)
- [ ] Responsive design works (mobile, tablet, desktop viewports)
- [ ] All links navigate correctly
- [ ] All images load correctly
- [ ] No 404 errors in Network tab

**Tools**:
- Chrome DevTools Device Emulation
- Firefox Responsive Design Mode
- `pnpm dev` running locally

### Phase 2: Pre-Commit Testing

✅ **Before committing ANY code:**

- [ ] `pnpm build` completes successfully
- [ ] `pnpm type-check` passes (no TypeScript errors)
- [ ] `pnpm test` passes (when tests are implemented)
- [ ] No build warnings (or documented if intentional)
- [ ] Git diff reviewed for accidental changes

**Commands**:
```bash
pnpm build
pnpm type-check
pnpm test  # when implemented
git diff
```

### Phase 3: Vercel Preview Testing

✅ **After pushing to branch, BEFORE merging to main:**

- [ ] Vercel preview deployment successful
- [ ] Preview URL tested on Desktop Chrome
- [ ] Preview URL tested on Desktop Firefox
- [ ] **Preview URL tested on Android Chrome (MANDATORY)**
- [ ] No console errors on any platform
- [ ] Network tab shows no 404s
- [ ] PWA manifest loads correctly (if applicable)

**How to Test on Android**:
1. Push branch to GitHub
2. Get Vercel preview URL from GitHub PR
3. Open preview URL on actual Android device with Chrome
4. Open Chrome DevTools on device: `chrome://inspect`
5. Check console for errors
6. Check Network tab for 404s
7. Test all core functionality

### Phase 4: Production Testing

✅ **After deploying to production (www.pfdh.org):**

- [ ] Production URL tested on Desktop Chrome
- [ ] Production URL tested on Desktop Firefox
- [ ] **Production URL tested on Android Chrome (MANDATORY)**
- [ ] Verify Analytics tracking (GTM/GA4)
- [ ] Verify no Service Worker errors (if SW is used)
- [ ] Test all navigation paths
- [ ] Test all critical user flows

**Critical User Flows**:
1. Home page → Directorio → Athlete profile
2. Home page → Historia → About
3. Mobile menu navigation
4. PWA install prompt (if applicable)
5. External links (Enlaces page)

### Phase 5: Post-Deployment Monitoring

✅ **Within 24 hours of production deployment:**

- [ ] Monitor Vercel Analytics for errors
- [ ] Monitor Google Analytics for traffic drops
- [ ] Monitor browser console (Chrome DevTools remote for Android)
- [ ] Check for increased 404s in Network tab
- [ ] Verify no Service Worker issues

## PWA-Specific Testing

### When PWA Features Are Implemented

✅ **Additional mandatory tests:**

- [ ] `manifest.webmanifest` accessible at `/manifest.webmanifest`
- [ ] All icons referenced in manifest exist (check `/icon-192.png`, `/icon-512.png`, etc.)
- [ ] All screenshots referenced in manifest exist (check `/screenshots/`)
- [ ] Service Worker registration works (if implemented)
- [ ] Service Worker update mechanism works (if implemented)
- [ ] PWA install prompt appears on Android Chrome
- [ ] PWA install prompt appears on Desktop Chrome
- [ ] Installed PWA works offline (if offline support implemented)

**How to Validate Manifest**:
```bash
# Build production version
pnpm build

# Check manifest generation
curl http://localhost:3000/manifest.webmanifest

# Verify all icon files exist
ls -lh public/icon-*.png public/screenshots/
```

**Chrome DevTools Validation**:
1. Open DevTools → Application tab
2. Check "Manifest" section
3. Verify all icons show preview (no broken images)
4. Verify all fields populated correctly

## Service Worker Testing (CRITICAL)

### If Service Worker is Implemented

⚠️ **WARNING**: Service Workers are EXTREMELY DANGEROUS if not managed properly. See `docs/SERVICE_WORKER_STRATEGY.md`.

✅ **Mandatory Service Worker tests:**

- [ ] SW registers successfully on first visit
- [ ] SW updates on code change (versioning works)
- [ ] SW can be force-unregistered remotely (kill switch exists)
- [ ] SW doesn't cache webpack chunks (or has cache-busting strategy)
- [ ] SW update tested across deployments
- [ ] Old SW unregisters when new version deploys

**How to Test SW Updates**:
1. Deploy version A with SW
2. Verify SW registered: DevTools → Application → Service Workers
3. Deploy version B with code changes
4. Hard refresh (Cmd/Ctrl + Shift + R)
5. Verify OLD SW unregistered, NEW SW registered
6. Test that cached resources updated

**Never Deploy SW Without**:
- Versioning in SW filename (`sw-v1.js`, `sw-v2.js`)
- Update check on every page load
- Remote kill switch (script to unregister)
- Comprehensive cross-browser testing

## Testing Tools

### Required Tools

1. **Chrome DevTools** - Desktop development
2. **Firefox DevTools** - Cross-browser testing
3. **Android Device with Chrome** - Mobile testing
4. **Chrome Remote Debugging** - Android console access

### Chrome Remote Debugging Setup (Android)

**Enable USB Debugging on Android**:
1. Settings → About Phone → Tap "Build Number" 7 times
2. Settings → Developer Options → Enable "USB Debugging"
3. Connect phone to computer via USB
4. Allow USB debugging prompt on phone

**Connect Chrome DevTools**:
1. Desktop Chrome → `chrome://inspect`
2. Enable "Discover USB devices"
3. Phone should appear in devices list
4. Click "Inspect" next to www.pfdh.org
5. DevTools opens with console/network access

**Alternative: Wireless Debugging**:
1. Settings → Developer Options → Wireless Debugging
2. Pair device with code
3. Chrome DevTools → `chrome://inspect` → Wireless devices

### Optional Testing Tools

- **Lighthouse** - Performance, SEO, accessibility audits
- **WebPageTest** - Performance testing
- **BrowserStack** - Multi-browser cloud testing (paid)
- **Real Device Lab** - If budget allows, multiple physical devices

## Feature-Specific Testing

### Testing Images

- [ ] All images have `alt` attributes
- [ ] Images use Next.js `<Image>` component with proper sizing
- [ ] Images load correctly on slow connections (throttle in DevTools)
- [ ] Fallback images work if primary image fails
- [ ] Lazy loading works (images below fold don't load immediately)

### Testing Forms (When Implemented)

- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Form submission works
- [ ] Form data persists on error (doesn't lose user input)
- [ ] Form works on mobile (large enough touch targets)

### Testing Analytics

- [ ] Google Tag Manager loads (check Network tab)
- [ ] Google Analytics events fire (check GA4 DebugView)
- [ ] Cookie consent banner works
- [ ] Analytics respect cookie preferences
- [ ] No analytics errors in console

### Testing Accessibility (Recommended)

- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Screen reader compatible (test with VoiceOver/TalkBack)
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible
- [ ] Skip to main content link works

**Tools**:
- Chrome Lighthouse Accessibility Audit
- axe DevTools browser extension
- WAVE browser extension

## Sprint-Specific Testing Requirements

### Every Sprint MUST Include:

1. **Functional Testing** - Does the feature work as designed?
2. **Cross-Browser Testing** - Works on all mandatory platforms?
3. **Regression Testing** - Did we break existing features?
4. **Performance Testing** - Did we slow down the site?

### Sprint Completion Checklist

✅ **Before marking sprint as "complete":**

- [ ] All features tested on Desktop Chrome
- [ ] All features tested on Desktop Firefox
- [ ] **All features tested on Android Chrome**
- [ ] All old features still work (regression test)
- [ ] No new console errors introduced
- [ ] No new 404s introduced
- [ ] Build completes successfully
- [ ] Type checking passes
- [ ] Performance acceptable (Lighthouse score > 90)

## Emergency Production Issues

### When Production Breaks

**Immediate Actions**:

1. **Identify Last Working Commit**
   ```bash
   # Check recent production commits
   git log --oneline -10

   # Roll back if needed
   git checkout <last-working-commit>
   git push origin main --force  # Only in emergencies!
   ```

2. **Reproduce Locally**
   ```bash
   # Checkout broken commit
   git checkout <broken-commit>

   # Build and test
   pnpm build
   pnpm start

   # Open on Android Chrome
   # Check console for errors
   ```

3. **Compare Commits**
   ```bash
   # See what changed
   git diff <working-commit> <broken-commit>

   # Focus on:
   # - Service Worker changes
   # - Build configuration changes
   # - Dependency updates
   ```

4. **Test Fix Before Deploying**
   ```bash
   # Test on broken commit first
   # Verify fix works
   # Then merge to main
   ```

### Post-Incident Review

After every production incident:

1. Document in `docs/LESSONS_LEARNED_*.md`
2. Update this testing requirements doc if needed
3. Add specific test to prevent recurrence
4. Update CI/CD pipeline if possible

## Automated Testing (Future)

### Recommended Automation

Once testing is mature, automate:

1. **Unit Tests** - Test individual functions
2. **Integration Tests** - Test component interactions
3. **E2E Tests** - Test full user flows (Playwright/Cypress)
4. **Visual Regression Tests** - Catch UI breakage
5. **Lighthouse CI** - Automated performance testing
6. **PWA Validation** - Automated manifest/icon checking

### CI/CD Pipeline (Future Enhancement)

```yaml
# .github/workflows/test.yml (example)
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm type-check
      - run: pnpm test
      - run: pnpm build
      - run: pnpm lighthouse-ci  # Automated Lighthouse
      - run: pnpm validate-pwa   # Check manifest/icons exist
```

## Summary

### The Golden Rules

1. **NEVER deploy without Android Chrome testing**
2. **ALWAYS check Network tab for 404s**
3. **ALWAYS run `pnpm build` before committing**
4. **NEVER use Service Workers without proper strategy**
5. **ALWAYS test on actual devices, not just DevTools emulation**

### When in Doubt

- Test more, not less
- Real device > DevTools emulation
- Slow down and test thoroughly
- It's faster to test now than to fix production later

---

**Related Documents**:
- `docs/LESSONS_LEARNED_ANDROID_CHROME_INCIDENT.md` - Incident that created these requirements
- `docs/SERVICE_WORKER_STRATEGY.md` - Service Worker management guidelines
- `~/.claude/orchestrator_memory.md` - Sprint planning and tracking

**Document Owner**: Portfolio Orchestrator
**Enforcement**: MANDATORY for all sprints
**Review**: After every production incident
