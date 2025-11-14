# Vercel Build Configuration

## Issue: pnpm Build Script Warnings

If you see warnings like:
```
Ignored build scripts: @tailwindcss/oxide, sharp, unrs-resolver
```

These warnings indicate pnpm's security feature is blocking install scripts.

## Solutions Implemented

### 1. Package.json Configuration ✅
Added `postinstall` script to rebuild necessary packages:
```json
"scripts": {
  "postinstall": "pnpm rebuild @tailwindcss/oxide sharp"
}
```

Added pnpm configuration:
```json
"pnpm": {
  "onlyBuiltDependencies": [],
  "allowedDeprecatedVersions": {
    "critters": "0.0.25"
  }
}
```

### 2. .npmrc Configuration ✅
Updated with proper flags:
```
enable-pre-post-scripts=true
auto-install-peers=true
strict-peer-dependencies=false
```

### 3. Vercel Environment Configuration (If Issues Persist)

If the warnings persist or cause build failures, add this environment variable in Vercel:

**Dashboard → Project Settings → Environment Variables**
```
Name: PNPM_FLAGS
Value: --shamefully-hoist
```

Or update the build command in Vercel:
```
Build Command: pnpm install && pnpm build
```

### 4. Alternative: vercel.json (If Needed)

If the above doesn't work, create `vercel.json`:
```json
{
  "buildCommand": "pnpm install --ignore-scripts=false && pnpm build",
  "framework": "nextjs"
}
```

## Why These Packages Need Build Scripts

- **@tailwindcss/oxide**: Compiles Rust-based CSS engine for faster builds
- **sharp**: Builds native bindings for image optimization (critical for Next.js)
- **unrs-resolver**: Resolver utilities that need compilation

## Verification

After deploying with these changes:
1. Check build logs for warnings
2. Verify images load correctly (sharp is working)
3. Verify CSS builds properly (Tailwind oxide is working)

## Note

These warnings are informational in most cases. If the build succeeds and the site works correctly, the packages are building properly despite the warnings.
