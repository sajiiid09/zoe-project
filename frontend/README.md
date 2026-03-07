# Zoe Market Frontend

A scalable Next.js marketplace frontend spanning storefront, customer purchase/account flows, and operational role surfaces.

## Current status
- **Phase 1 complete:** app foundation, shell, route groups, API/data shaping.
- **Phase 2 complete:** homepage merchandising, search/listing/category browsing.
- **Phase 3 complete:** cart, checkout, order confirmation, and customer orders.
- **Phase 4 complete:** login/register, role-aware sessions, profile/account UX, wishlist persistence.
- **Phase 5 complete:** vendor/affiliate/admin operational dashboards and management surfaces.

## Stack
- Next.js 16 + React 19 + TypeScript
- Reusable CSS token system in `src/app/globals.css`
- Route groups for storefront, account, vendor, affiliate, and admin surfaces

## Project structure
- `src/app`: Route scaffolding + role/layout composition
- `src/components`: Shell, UI primitives, commerce, auth/account, marketplace, and operations components
- `src/lib`: API clients/adapters, auth/session logic, and role-specific data services
- `src/types`: Models for catalog, purchase lifecycle, auth, and operations

## Commands
```bash
npm run dev
npm run lint
npm run build
```

## Data direction
- Customer purchasing remains on the legacy live commerce flow.
- Operational role UIs are backend-first with local fallback to support robust development while integrations mature.
