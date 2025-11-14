# GitHub Actions Setup Guide

This document explains how to configure GitHub Actions for the PFDH project.

## Current Configuration

The project is configured to use **GitHub-hosted runners** (Ubuntu Latest) for all CI/CD workflows.

## Workflows

### Main Test Workflow (`.github/workflows/tests.yml`)

Runs on:
- Every push to `main`, `develop`, or `claude/**` branches
- Every pull request to `main` or `develop`
- Manual trigger via GitHub UI

**Jobs:**
1. **Unit & Integration Tests** (Required) - ~5-8 minutes
2. **E2E Tests** (Optional) - ~10-15 minutes
3. **Lint** (Required) - ~2-3 minutes
4. **Type Check** (Required) - ~2-3 minutes
5. **Test Summary** - Aggregates results

## GitHub Secrets (Optional)

For full functionality, configure these secrets in your GitHub repository:

### Navigation
`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### Required Secrets for E2E Tests

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google Calendar service account email | `pfdh-service@project.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Google Calendar service account private key | `-----BEGIN PRIVATE KEY-----\n...` |
| `GOOGLE_CALENDAR_ID` | Google Calendar ID | `pabellonfdh@gmail.com` |

### Optional Secrets

| Secret Name | Description | Required For |
|-------------|-------------|--------------|
| `CODECOV_TOKEN` | Codecov upload token | Coverage reporting |

## Notes

- **Unit/Integration tests** use mock credentials and will pass without secrets
- **E2E tests** are marked as optional (`continue-on-error: true`) so they won't block PRs
- **Lint and Type Check** don't require any secrets

## Test Execution Matrix

```yaml
✅ Unit Tests        - Always runs, always required
✅ Integration Tests - Always runs, always required
⚠️  E2E Tests        - Always runs, failures are non-blocking
✅ Lint             - Always runs, always required
✅ Type Check       - Always runs, always required
```

## Running Tests Locally

Before pushing, run tests locally:

```bash
# Unit & Integration tests
pnpm test:run

# Lint
pnpm lint

# Type check
pnpm exec tsc --noEmit

# E2E tests (requires running dev server)
pnpm test:e2e
```

## Workflow Triggers

### Automatic Triggers
- Push to protected branches
- Pull requests to `main` or `develop`

### Manual Trigger
1. Go to `Actions` tab in GitHub
2. Select `Tests` workflow
3. Click `Run workflow`
4. Select branch
5. Click `Run workflow` button

## Caching Strategy

The workflow uses multiple caching strategies for speed:

1. **pnpm Store Cache** - Caches downloaded packages
2. **Node.js Cache** - Caches npm metadata
3. **Playwright Browsers** - Installed per run (lightweight)

## Migrating to Self-Hosted Runners

When ready to migrate to self-hosted runners:

1. Set up self-hosted runner(s)
2. Replace `runs-on: ubuntu-latest` with `runs-on: self-hosted`
3. Ensure runner has:
   - Node.js 20+
   - pnpm 10+
   - Git
   - Docker (optional, for isolated environments)

Example change:
```yaml
# Before (GitHub-hosted)
runs-on: ubuntu-latest

# After (Self-hosted)
runs-on: self-hosted
# Or with labels
runs-on: [self-hosted, linux, x64]
```

## Troubleshooting

### Tests fail on CI but pass locally
- Check Node.js version (should be 20)
- Verify environment variables are set correctly
- Check if secrets are configured (for E2E tests)

### E2E tests timeout
- E2E tests have 15-minute timeout
- Dev server has 60 seconds to start (30 retries × 2s)
- Increase timeout if needed in workflow

### Coverage upload fails
- This is non-blocking (`continue-on-error: true`)
- Ensure `CODECOV_TOKEN` is set if you want coverage reports

### Lint fails
- Run `pnpm lint` locally to see errors
- Run `pnpm lint --fix` to auto-fix issues

## Performance

Typical run times on GitHub-hosted runners:

| Job | Duration | Cost (approx) |
|-----|----------|---------------|
| Unit & Integration | 5-8 min | ~$0.01 |
| E2E Tests | 10-15 min | ~$0.02 |
| Lint | 2-3 min | ~$0.005 |
| Type Check | 2-3 min | ~$0.005 |
| **Total** | **~20-30 min** | **~$0.05/run** |

GitHub provides 2,000 free minutes/month for private repos, 50,000 for public repos.

## Status Badge

Add to your README.md:

```markdown
![Tests](https://github.com/your-org/pabellon-fama/actions/workflows/tests.yml/badge.svg)
```

## Next Steps

1. ✅ Tests are configured for GitHub-hosted runners
2. ⏳ Monitor test runs for stability
3. ⏳ Configure optional secrets for full E2E testing
4. ⏳ Set up Codecov for coverage tracking
5. ⏳ Migrate to self-hosted runners when ready
