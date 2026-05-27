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

## Phase 7 — Hardening & Scale (completed)
- Hardened Affiliate Dashboard with practical next-step placeholders for upcoming modules.
- Refined cross-role layouts (`RoleLayout`, `StoreHeader`) with active state logic and dropdown click-away management.
- Hardened global CSS with focus-visible accessibility rings, smooth button transitions, and robust responsive table overflows.
- Added global `.empty-view` styling and header utility links for consistent edge-case handling.

## Phase 8 — Public Storefront UI Polish (completed)
- Redesigned visual design tokens (`globals.css`) for softer `16px/20px` borders and deeper, modern cubic-bezier shadows (`--shadow-hover`).
- Transformed `.store-header` into a premium glassmorphic nav bar (`backdrop-filter: blur(12px)`).
- Upgraded the Homepage Hero with vibrant gradients, glowing CTA buttons, and ambient background blooms.
- Added interactive micro-animations (Y-axis lift, scaling deal tags, and color-transitioning wishlist buttons) across all primary interactive surfaces (Product Cards, Cart Lines, Summary Boxes).

## Phase 9 — Dashboard Experience Unification (completed)
- Standardized dashboard navigation with reusable sidebar + navbar patterns across admin, vendor, affiliate, and account areas.
- Refactored role layout composition into modular shell components to improve consistency, maintainability, and extensibility.
- Added and polished admin operations analytics views (`Revenue`, `Transactions`) while preserving existing API contracts and role workflows.

## Phase 10 — Role Onboarding + Admin Contract Hardening (completed)
- Rebuilt public auth to support role-aware signup for `customer`, `vendor`, and `affiliate` from one frontend flow.
- Added dedicated payment entry/success routes for role onboarding fees:
  - `/vendor-payment`
  - `/vendor-payment-success`
  - `/affiliate-payment`
  - `/affiliate-payment-success`
- Added a payment-required login path that preserves the authenticated session for unpaid vendor and affiliate users, then routes them toward payment instead of treating the login as a hard failure.
- Standardized vendor and affiliate onboarding UX around the same visible lifecycle:
  - `setup_required`
  - `payment_required`
  - `pending`
  - `approved`
  - `needs_changes`
- Kept `blocked` as an account-level moderation state only. User-facing onboarding rejection should be presented as `needs_changes`, not `blocked`.
- Updated vendor and affiliate dashboards so unpaid users can still access onboarding surfaces, but operational tools remain hidden or gated until approval.
- Adjusted onboarding forms so users can review and save setup details before payment, then pay when ready to submit for admin review.
- Hardened admin operations so:
  - the `Users` page manages account activation only
  - the `Approvals` page shows only real pending store/profile approvals
  - submission acceptance requires an explicit `retailPrice`
- Fixed the false `blocked` badge issue in the admin `Users` table by restoring the backend `isActive` field in the admin user payload and treating only explicit `false` as blocked on the frontend.

## Phase 11 — Vendor Media Upload Pipeline (completed)
- Added signed direct-upload Cloudinary support for vendor product images, vendor submission images, store logo, and store banner uploads.
- Kept the existing persistence model intact: Cloudinary `secure_url` values are still stored in `product.images`, `vendorSubmission.images`, `store.logo`, and `store.banner`.
- Added a vendor-authenticated backend signature endpoint and kept file bytes out of the application server by uploading directly from the browser to Cloudinary.
- Updated remote image allow-lists so Cloudinary-hosted media renders in the vendor dashboard, admin review surfaces, storefront cards, and PDP views.

## Cloudinary Setup
1. Create or log in to your Cloudinary account at [cloudinary.com](https://cloudinary.com/).
2. Open the Cloudinary dashboard and copy these three values:
   - `Cloud name`
   - `API Key`
   - `API Secret`
3. Open `backend/.env`.
4. Add these variables:
   - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
   - `CLOUDINARY_API_KEY=your_api_key`
   - `CLOUDINARY_API_SECRET=your_api_secret`
5. Restart the backend server so the new environment variables are loaded.
6. Sign in as a vendor and test:
   - store logo upload
   - store banner upload
   - product image upload
   - submission image upload
7. Verify that the saved media URLs start with `https://res.cloudinary.com/`.
