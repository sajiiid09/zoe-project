# Zoe Market Frontend

A scalable Next.js marketplace frontend with role-aware architecture, browsing surfaces, and a customer purchase flow.

## Current status
- **Phase 1 complete:** app foundation, shell, route groups, API/data shaping.
- **Phase 2 complete:** homepage merchandising, search/listing/category browsing.
- **Phase 3 complete:** cart, checkout, address handling, order confirmation, and customer orders management.

## Stack
- Next.js 16 + React 19 + TypeScript
- Reusable CSS token system in `src/app/globals.css`
- Route groups for storefront, account, vendor, affiliate, and admin surfaces

## Project structure
- `src/app`: Route scaffolding + role/layout composition
- `src/components`: App shell, UI primitives, commerce + marketplace components
- `src/lib`: Config, auth/session strategy, API client/adapters, purchase API wrappers
- `src/types`: Frontend models for catalog, roles, and purchase lifecycle

## Commands
```bash
npm run dev
npm run lint
npm run build
```

## Data direction
- Customer purchase flow currently targets the **legacy order engine**.
- Browsing and purchase layers remain UI-model driven to ease future backend migration.
