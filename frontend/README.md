# Zoe Market Frontend

A scalable Next.js marketplace frontend with role-aware architecture and a production-ready customer browsing storefront.

## Current status
- **Phase 1 complete:** app foundation, shell, route groups, API/data shaping.
- **Phase 2 complete:** homepage merchandising, search/listing/category browsing, filter/sort UX, and improved product cards.

## Stack
- Next.js 16 + React 19 + TypeScript
- Reusable CSS token system in `src/app/globals.css`
- Route groups for storefront, account, vendor, affiliate, and admin surfaces

## Project structure
- `src/app`: Route scaffolding + role/layout composition
- `src/components`: App shell, UI primitives, marketplace merchandising + listing components
- `src/lib`: Config, auth/session strategy, API client + adapters
- `src/types`: Frontend models for legacy and future catalog flows

## Commands
```bash
npm run dev
npm run lint
npm run build
```

## Data direction
- Customer browsing currently prioritizes the **legacy product flow**.
- `src/lib/api/adapters.ts` keeps UI decoupled from backend payload shape.
- `src/lib/api/products.ts` supports backend calls with safe local fallback for resilient development.
