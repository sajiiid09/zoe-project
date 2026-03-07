# Frontend Development Phases (Concise)

## Phase 1 — Foundation (completed)
- Standardized architecture, route groups, shell, and data abstractions.
- Established reusable design tokens and base UI primitives.

## Phase 2 — Storefront Discovery (completed)
- Built conversion-oriented homepage with campaign, category shortcuts, trust strip, and reusable product rails.
- Implemented search/listing/category browsing with sort/filter UX and mobile filter drawer.

## Phase 3 — Purchase Flow (completed)
- Implemented cart lifecycle, checkout, address flow, order confirmation, and order management.

## Phase 4 — Auth + Account Layer (completed)
- Added login/register flows, role-aware sessions, signed-in UX, profile editing, and wishlist persistence.

## Phase 5 — Marketplace Operations (completed)
- Implemented protected vendor, affiliate, and admin operational role areas.
- Added vendor onboarding status, store management, legacy product CRUD, and submission CRUD.
- Added affiliate status and profile management with explicit deferred commission/payout scope.
- Added admin operations surfaces for approvals, users, products, submissions, catalog, and orders.

## Phase 6 — Catalog Transition Layer (completed)
- Created a normalized product-domain strategy separating live legacy commerce from the newer marketplace catalog.
- Decoupled UI components from raw backend responses using a unified view model.
- Added `/catalog/[id]` public browsing route for catalog entities with no false purchase flows.
- Improved the vendor submission to catalog bridge in admin UX utilizing status badges.

## Phase 7 — Hardening + Scale
- Performance budgets, test expansion, accessibility audits.
- Internationalization/localization and production observability.
