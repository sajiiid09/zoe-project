# Frontend Development Guide

## Goal

Build a role-based frontend for four users:

- `CUSTOMER`
- `VENDOR`
- `AFFILIATE`
- `ADMIN`

The storefront is platform-owned. Vendors do not sell directly. Affiliates do not manage products. They only drive traffic and earn commission on attributed conversions.

## Core UX Rules

- Public storefront shows only admin-owned catalog products.
- Vendor UI is a supplier portal, not a seller storefront.
- Affiliate UI is a referral portal, not a store.
- Admin UI is the control center for approvals, catalog, orders, and payouts.

Use short, accurate copy:

- vendor: "submit", "review", "payout"
- affiliate: "share", "clicks", "commissions"
- admin: "approve", "publish", "settle"

Avoid misleading marketplace copy like "your product is live" unless it is truly public.

## Route Model

### Public

- `/`
- `/shop`
- `/shop/[id]`
- `/about`
- `/contact`
- `/login`
- `/register`
- `/checkout`

### Vendor

- `/vendor`
- `/vendor/profile`
- `/vendor/submissions`
- `/vendor/submissions/new`
- `/vendor/payouts`

### Affiliate

- `/affiliate`
- `/affiliate/profile`
- `/affiliate/links`
- `/affiliate/commissions`
- `/affiliate/payouts`

### Admin

- `/admin`
- `/admin/vendors`
- `/admin/submissions`
- `/admin/catalog`
- `/admin/affiliates`
- `/admin/orders`
- `/admin/payouts`
- `/admin/revenue`

## Route Protection

Frontend should redirect by role:

- unauthenticated -> `/login`
- vendor without fee paid -> vendor payment page
- affiliate without fee paid -> affiliate payment page
- `ADMIN` login -> `/admin`
- `VENDOR` login -> `/vendor`
- `AFFILIATE` login -> `/affiliate`
- `CUSTOMER` login -> `/`

Frontend guards are for UX only. Backend remains the real authority.

## Vendor UI

Vendor experience should be framed as supplier management.

### Vendor Dashboard

Show:

- profile approval status
- total submissions
- pending submissions
- accepted submissions
- rejected submissions
- pending payouts
- paid payouts

Do not show retail order totals as vendor earnings.

### Vendor Profile

This is the current store concept, but treated as a supplier profile.

Use for:

- business name
- logo/banner
- contact details
- approval state
- rejection reason

### Vendor Submissions

Replace "My Products" semantics with supplier offers.

Each item should show:

- title
- vendor quoted price
- status
- rejection reason if any
- submission date

### New Submission

Form should collect:

- title
- description
- category
- vendor quoted price
- optional suggested retail price
- available stock
- images

Success copy should confirm submission for review, not marketplace publication.

### Vendor Payouts

Show:

- pending payouts
- approved payouts
- paid payouts
- linked order reference if allowed

## Affiliate UI

Affiliate experience is a referral workspace.

### Affiliate Dashboard

Show:

- approval status
- total tracked clicks
- attributed conversions
- pending commissions
- paid commissions

### Affiliate Product Browser

Affiliates should browse public catalog products that are commissionable.

For each product:

- show product info
- show commission rate or "earn from this product"
- allow generating/copying referral link

### Affiliate Links

Show:

- product
- referral link
- clicks
- conversions

### Affiliate Commissions

Show:

- pending
- approved
- paid
- voided

### Affiliate Payouts

Show payout history and payment references.

## Admin UI

Admin pages should be separated by responsibility.

### Admin Dashboard

Show real metrics:

- pending vendor approvals
- pending affiliate approvals
- pending product submissions
- active catalog products
- gross sales
- vendor payout liability
- affiliate commission liability
- platform margin

### Vendor Review

Approve or reject vendor profiles.

### Submission Review

Review vendor submissions separately from the public catalog.

Actions:

- accept
- reject
- set retail price on acceptance

### Catalog Management

Manage public products only:

- retail price
- stock
- active/inactive
- featured

### Affiliate Review

Approve or reject affiliate profiles.

### Orders and Payouts

Admin must see:

- order totals
- vendor payout amount
- affiliate commission amount
- platform margin
- payout statuses

## Storefront Rules

The public shop must use real catalog APIs and only display:

- active catalog products
- admin-approved public products

Never expose:

- vendor submissions
- pending offers
- affiliate internal data

## Referral UX Rules

When a visitor lands through an affiliate link:

- keep the experience invisible and frictionless
- capture attribution in a first-party cookie/session
- do not show raw tracking codes in UI

No special customer flow is required. Attribution should happen quietly in the background.

## State and Data Rules

Keep role/session state centralized.

Recommended frontend responsibilities:

- persist token and user profile
- expose role helpers
- redirect after login by role
- refresh user state after payment/approval-sensitive actions

Keep API calls consistent:

- shared API client or wrapper
- centralized auth headers
- normalized error handling

## Current Codebase Direction

Keep:

- current auth/session foundation
- vendor fee gating pattern

Refactor:

- vendor pages from "store/products" to "profile/submissions"
- admin product page into separate submission review + catalog management
- login redirects by role

Add:

- affiliate registration option
- affiliate fee flow
- affiliate dashboard/pages
- referral link capture flow
- admin affiliate management

## Implementation Order

1. Add role-based redirects and route guards
2. Fix vendor UI semantics
3. Add affiliate portal shell
4. Split admin review pages
5. Connect storefront to real catalog APIs
6. Add payout and commission views

## V1 Scope Limits

Do not build in v1:

- advanced affiliate analytics
- multi-touch attribution UI
- affiliate campaign builder
- complex payout automation UX

## One-Line Rule

Customers shop the catalog, vendors submit supply, affiliates share links, admin controls everything.
