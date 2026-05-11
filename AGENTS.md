# AGENTS.md — Pabellón de la Fama del Deporte Humacaeño

<!-- BEGIN:nextjs-agent-rules -->
When writing Next.js code, consult the version-matched docs at
`node_modules/next/dist/docs/` BEFORE writing or modifying code.
<!-- END:nextjs-agent-rules -->

## Quick Facts
- Stack: Next.js 16.2.6, React 19, TypeScript 5 (strict), Tailwind CSS 3.4.17
- Entry: `src/app/page.tsx`
- Run: `npm run build` (no type-check script available)
- Language: ALL Spanish (mandatory)
- Status: 100% MVP complete - Active maintenance + retainer

## Project-Specific Rules

**Validation (MANDATORY)**
- `npm run build` must succeed
- Test pre-deploy on Android Chrome (ACTUAL DEVICE)
- Desktop Chrome + Firefox testing required
- Service Worker testing (.project/docs/SERVICE_WORKER_STRATEGY.md)

**Billing Classification** (see file:line refs for details)
- Retainer (NON-BILLABLE): Bug fixes, hosting, content updates <2 hrs/month, infrastructure
- MVP (NON-BILLABLE): 8 sections (Inicio, Exaltados, Directores, Historia, Museo, Enlaces, Horario, Calendario)
- New Features (BILLABLE @ $10/hr): Requires client approval first

**Git Commit Tags (MANDATORY)**
- [RETAINER-HOSTING] for infrastructure
- [RETAINER-MAINT] for bug fixes
- [RETAINER-SUPPORT] for support requests
- [MVP-IMPLEMENTATION] for MVP work
- [BILLABLE-NEW-FEATURE] for billable features

**Spanish UI (MANDATORY)**
- ALL user-facing text in Spanish
- PR locale: es_PR for dates, phone format 787-XXX-XXXX

**Critical: Google Calendar Integration**
- Calendar ID: pabellonfdh@gmail.com
- Timezone: ALWAYS America/Puerto_Rico
- Cache: 1 hour revalidate

**Next.js 15 Async Params**
- Server components require: `async function Page({ params }: { params: Promise<{ id: string }> })`

## Pointers
- Service Worker strategy: `.project/docs/SERVICE_WORKER_STRATEGY.md`
- Status: `.project/STATUS.md`
