# Frontend Development Guide

## Purpose

This document defines the frontend development direction for the project before implementation begins.

The frontend must reflect the supplier-submission business model defined in the backend guide.

This is not a classic marketplace UI where vendors publish directly to customers.

The frontend must communicate the correct platform behavior:

- Vendors onboard as suppliers.
- Vendors submit products for admin review.
- Admin creates and controls the public catalog.
- Customers buy from the platform storefront only.

## Product Experience Decision

The storefront should only display admin-owned catalog products.

The vendor-facing UI should never imply that a vendor's submitted item automatically becomes public.

All vendor language should be updated to reflect:

- submission
- review
- acceptance
- payout

Avoid wording such as:

- "list on marketplace"
- "your store is live"
- "your product is now public after approval"

Unless those statements are explicitly true in the final implementation.

## Frontend Roles

The frontend should support three distinct user experiences.

### Customer

- Browse public catalog
- View product details
- Manage cart
- Checkout
- View personal order history

### Vendor

- Complete onboarding fee payment
- Create and manage supplier profile
- Submit supplier offers
- Track submission statuses
- View payout history

### Admin

- Review vendor profiles
- Review supplier submissions
- Accept or reject submissions
- Create and manage catalog products
- Manage orders
- Review vendor payout obligations

## Route Ownership and Access Rules

Frontend route protection is required for user experience, but backend authorization remains the source of truth.

### Public Routes

Examples:

- `/`
- `/shop`
- `/shop/[id]`
- `/about`
- `/contact`
- `/login`
- `/register`

### Vendor-Protected Routes

Examples:

- `/vendor`
- `/vendor/profile`
- `/vendor/submissions`
- `/vendor/submissions/new`
- `/vendor/payouts`
- `/vendor/orders` (only if vendor-safe summary is intentionally supported)

Requirements:

- user must be authenticated
- role must be `VENDOR`
- vendor fee must be paid

### Admin-Protected Routes

Examples:

- `/admin`
- `/admin/vendors`
- `/admin/submissions`
- `/admin/catalog`
- `/admin/orders`
- `/admin/payouts`
- `/admin/revenue`

Requirements:

- user must be authenticated
- role must be `ADMIN`

## Route Guarding Standards

The current frontend should be upgraded to real route protection.

Required frontend protections:

- client-side auth guards in role-specific layouts
- route-aware redirects after login
- optional middleware-based protection where appropriate

Recommended behavior:

- unauthenticated vendor/admin access redirects to `/login`
- vendor without paid onboarding fee redirects to `/vendor-payment`
- authenticated admin should not be sent to the customer storefront by default after login

Post-login redirect rules:

- `ADMIN` -> admin dashboard
- `VENDOR` with paid fee -> vendor dashboard
- `VENDOR` without paid fee -> vendor payment page
- `CUSTOMER` -> storefront or profile

## Vendor Experience Requirements

The vendor UI should be reframed as a supplier portal.

### Vendor Dashboard

The dashboard should show:

- supplier profile status
- total submissions
- submissions by status
- accepted submissions
- rejected submissions
- payout summary
- pending payout total
- paid payout total

Do not label gross customer sales as vendor revenue unless that number truly represents vendor earnings.

### Vendor Profile

The existing store page should be treated as a supplier profile page.

Recommended rename in UI copy:

- "My Store" -> "Supplier Profile" or "Vendor Profile"

The page should support:

- business name
- branding
- contact details
- address
- approval state
- rejection reason

### Vendor Submissions

This should replace direct vendor product listing language.

Recommended page structure:

- submission list
- filters by status
- draft and submitted states
- rejection feedback

Each submission should clearly display:

- item title
- vendor quoted price
- suggested retail price if provided
- status
- admin review note or rejection reason
- submitted date

### New Submission Form

The current "Add Product" flow should become "Submit Product Offer" or "New Submission."

Required form fields:

- title
- description
- category
- vendor quoted price
- optional suggested retail price
- available stock
- images
- optional product metadata

The confirmation message should say the item is being reviewed for possible catalog placement, not guaranteed publication.

### Vendor Payouts

A dedicated vendor payouts page is required.

It should show:

- pending payouts
- approved payouts
- paid payouts
- payout references
- linked order references where allowed

## Admin Experience Requirements

The admin UI is the control center for the platform's commercial model.

### Admin Dashboard

The admin dashboard should eventually show real data, not placeholders.

Required metrics:

- total approved vendors
- pending vendor approvals
- pending submissions
- active catalog products
- gross sales
- payout liability
- realized platform margin

### Vendor Review Queue

Admin needs a vendor approval page for:

- reviewing vendor profile data
- approving supplier profiles
- rejecting supplier profiles with reason

### Submission Review Queue

This is a distinct admin page and should not be mixed with the public product catalog.

Required actions:

- review vendor submission details
- accept submission
- reject submission
- set retail price during acceptance
- optionally adjust catalog title, description, category, and stock during acceptance

Acceptance should feel like converting a supplier offer into a platform catalog listing.

### Catalog Management

The admin catalog page should manage public retail listings only.

This page should include:

- catalog search and filters
- retail price editing
- stock adjustments
- active/inactive visibility
- featured state

It should not double as the supplier submission queue.

### Order Management

Admin order UI should show:

- customer-facing totals
- payout liability per order
- platform margin per order
- shipment state
- cancellation state

### Payout Management

Admin needs a payout review page that can:

- view pending payouts
- filter by vendor
- mark payouts approved
- mark payouts paid
- record payment references

## Storefront Requirements

The storefront must be driven by real public catalog APIs.

The public shop should:

- load active catalog products from the backend
- support category and price filters
- support search and sorting
- show only admin-approved public items

The current hardcoded mock product list should be replaced when implementation begins.

The storefront must never show:

- raw vendor submissions
- pending supplier items
- rejected supplier items

## Product Detail Page Rules

A public product detail page should describe the platform-sold catalog item.

It may optionally reference that the item is sourced from an artisan/vendor, but only if that is a deliberate business decision.

If vendor branding is displayed publicly, it should be treated as merchandising information, not as proof of direct vendor selling rights.

## Copy and Messaging Standards

Language matters because the current project can easily mislead users if it uses marketplace wording.

### Vendor Copy

Use:

- "Submit item for review"
- "Supplier payout"
- "Pending review"
- "Accepted into catalog"

Avoid:

- "Publish to marketplace"
- "Set your selling price"
- "Customers buy from your store"

### Customer Copy

Use:

- "Sold by Decormade" or equivalent platform identity
- retail pricing only

Do not expose internal supplier payout details.

### Admin Copy

Use language that distinguishes:

- supplier submissions
- public catalog products
- vendor payouts

## State Management Standards

The frontend should keep role-aware session state centralized.

Recommended responsibilities of auth state:

- persist token and user data
- expose role helpers
- support post-login redirect decisions
- refresh profile data after important mutations

Recommended data-fetching standards:

- use a consistent API layer or service wrapper
- centralize auth headers
- centralize response normalization
- avoid scattering raw `fetch` patterns everywhere

## UI Data Boundaries

The frontend should present the correct numbers for the correct audience.

### Vendor Views

Show:

- quoted payout amount
- payout earned
- payout pending

Do not show:

- full retail margin breakdown unless intentionally allowed
- admin internal financial controls unrelated to the vendor

### Admin Views

Show:

- retail price
- vendor payout amount
- platform margin
- order gross and net figures

### Customer Views

Show:

- retail price only

## Error and Empty-State Standards

Each major view should have explicit:

- loading state
- empty state
- permission error state
- workflow-blocked state

Important workflow-blocked examples:

- vendor exists but fee unpaid
- vendor fee paid but supplier profile not approved
- vendor profile approved but no submissions yet
- admin queue has no pending submissions

## Recommended Page Map

### Public

- `/`
- `/shop`
- `/shop/[id]`
- `/checkout`
- `/profile`

### Vendor

- `/vendor`
- `/vendor/profile`
- `/vendor/submissions`
- `/vendor/submissions/new`
- `/vendor/payouts`

### Admin

- `/admin`
- `/admin/vendors`
- `/admin/submissions`
- `/admin/catalog`
- `/admin/orders`
- `/admin/payouts`
- `/admin/revenue`

## Implementation Priorities

### Phase 1: Correct Role Navigation

- add admin route protection
- add proper post-login redirects
- keep vendor fee gating in place

### Phase 2: Fix Vendor Portal Semantics

- rename store/product flows to profile/submission flows
- update copy to reflect supplier model

### Phase 3: Build Real Admin Review UX

- separate vendor review, submission review, and catalog management
- replace placeholder admin pages

### Phase 4: Connect the Public Storefront

- replace mock product data
- use real catalog endpoints

### Phase 5: Add Financial Visibility

- vendor payout pages
- admin payout and margin pages

## Non-Goals for the First Frontend Pass

The first implementation should avoid scope expansion into:

- advanced analytics visualizations
- vendor-to-customer messaging
- vendor-controlled public merchandising
- complex live notifications

The focus is correctness of workflow and data boundaries.

## Current Direction Summary

The frontend will be built around a platform-controlled catalog with a supplier portal behind it.

The key UX rule is:

- Vendors submit items.
- Admin curates and prices what customers can buy.
- Customers shop the admin catalog.
- Vendors track submissions and payouts, not direct storefront sales.
