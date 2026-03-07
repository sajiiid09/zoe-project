# Zoe Market Frontend

A scalable Next.js marketplace frontend with role-aware architecture, browsing and purchase flows, and a complete customer auth/account layer.

## Current status
- **Phase 1 complete:** app foundation, shell, route groups, API/data shaping.
- **Phase 2 complete:** homepage merchandising, search/listing/category browsing.
- **Phase 3 complete:** cart, checkout, order confirmation, and orders management.
- **Phase 4 complete:** login/register, role-aware sessions, profile/account UX, and wishlist persistence.

## Stack
- Next.js 16 + React 19 + TypeScript
- Reusable CSS token system in `src/app/globals.css`
- Route groups for storefront, account, vendor, affiliate, and admin surfaces

## Project structure
- `src/app`: Route scaffolding + role/layout composition
- `src/components`: App shell, UI primitives, commerce, auth/account, and marketplace components
- `src/lib`: Config, auth/session + API client/adapters + purchase/account API wrappers
- `src/types`: Frontend models for catalog, purchase lifecycle, roles, and auth

## Commands
```bash
npm run dev
npm run lint
npm run build
```

## Data direction
- Customer browsing and purchase currently target the **legacy live commerce/order flow**.
- Frontend models/adapters isolate UI from raw backend payloads to ease future migration.
