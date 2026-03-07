# Zoe Market Frontend

Phase 1 establishes a production-ready marketplace foundation using Next.js App Router.

## Tech
- Next.js 16 + React 19 + TypeScript
- CSS token system in `src/app/globals.css`
- Route groups for storefront, account, vendor, affiliate, and admin surfaces

## Structure
- `src/app`: Route scaffolding + role/layout composition
- `src/components`: App shell, UI primitives, marketplace cards, state blocks
- `src/lib`: Config, auth/session strategy, API client + adapters
- `src/types`: Frontend models for legacy and future catalog flows

## Commands
```bash
npm run dev
npm run lint
npm run build
```

## Notes
- Customer buying flow currently targets legacy product/order model.
- Adapters in `src/lib/api/adapters.ts` isolate UI from backend payload shape and keep catalog migration flexible.
