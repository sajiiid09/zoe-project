# Backend Development Guide

## Purpose

This document defines the backend development direction for the project before implementation begins.

The project should not be treated as a normal multi-vendor marketplace. The correct model is:

- Vendors act as suppliers.
- Vendors submit products and pricing offers to the platform admin.
- The admin evaluates vendor submissions.
- The admin decides whether to accept a submission.
- Accepted submissions become admin-owned catalog listings.
- Customers buy from the platform, not directly from vendors.
- Vendors are paid their agreed payout amount, not the customer-facing sale price.

This guide is the source of truth for backend architecture, data modeling, API behavior, and implementation sequencing.

## Product Model Decision

We are explicitly rejecting the classic marketplace pattern where vendor products become public after approval.

We are adopting a supplier-submission retail model:

- A vendor can own a store profile for onboarding, identity, branding, and administration.
- A vendor store does not directly power the public storefront.
- A vendor product submission is a supplier offer to the admin.
- A public product is an admin catalog item derived from an accepted vendor submission.

This separation is mandatory. Do not reuse a single `Product` table to represent both internal supplier submissions and customer-facing retail listings.

## Core Domain Entities

The backend should evolve toward the following domain model.

### User

- Supports roles: `ADMIN`, `CUSTOMER`, `VENDOR`.
- Tracks authentication, activation state, and vendor onboarding fee status.
- Vendors may create one supplier/store profile.

### VendorProfile or Store

- Represents the vendor's identity inside the system.
- Used for onboarding, approval, branding, and admin review.
- Does not directly publish items to the marketplace.
- Requires admin approval before the vendor can submit sellable inventory offers.

Recommended fields:

- `id`
- `ownerId`
- `displayName`
- `slug`
- `description`
- `logo`
- `banner`
- `contactEmail`
- `contactPhone`
- `address`
- `approvalStatus`
- `rejectionReason`
- `isActive`
- `createdAt`
- `updatedAt`

### VendorSubmission

This is the key new entity.

- Represents a vendor's offer to supply an item to the platform.
- Contains the vendor's requested payout amount.
- Is reviewed by the admin.
- Never appears directly on the public storefront.

Recommended fields:

- `id`
- `vendorId`
- `storeId`
- `title`
- `description`
- `category`
- `vendorQuotedPrice`
- `suggestedRetailPrice` (optional, informational only)
- `currency`
- `stockAvailable`
- `images`
- `materials`
- `dimensions`
- `status` (`DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `ACCEPTED`, `REJECTED`, `ARCHIVED`)
- `rejectionReason`
- `submittedAt`
- `reviewedAt`
- `reviewedBy`
- `createdAt`
- `updatedAt`

### CatalogProduct

- This is the public-facing product customers can browse and buy.
- It is owned by the platform.
- It may be created from an accepted `VendorSubmission`.
- The public retail price is controlled by the admin.

Recommended fields:

- `id`
- `sourceSubmissionId` (nullable if admin-created directly)
- `supplierVendorId` (nullable for fully admin-sourced items)
- `title`
- `description`
- `category`
- `retailPrice`
- `currency`
- `stock`
- `images`
- `isActive`
- `isFeatured`
- `visibilityStatus` (`DRAFT`, `ACTIVE`, `DISCONTINUED`)
- `createdByAdminId`
- `createdAt`
- `updatedAt`

### VendorSupplyAgreement

This records the financial agreement created when a submission is accepted.

- Defines what the vendor is owed if the product sells.
- Prevents later catalog price changes from corrupting supplier compensation.

Recommended fields:

- `id`
- `submissionId`
- `catalogProductId`
- `vendorId`
- `agreedPayoutAmount`
- `currency`
- `effectiveFrom`
- `effectiveTo` (nullable)
- `status` (`ACTIVE`, `REPLACED`, `CLOSED`)
- `createdByAdminId`
- `createdAt`

### Order

- Represents the customer purchase.
- The customer is buying from the platform.
- The order totals must be based on `CatalogProduct` pricing.

### OrderItem

This must snapshot commercial values at the moment of purchase.

Required pricing snapshots:

- `retailUnitPrice`
- `vendorPayoutUnitPrice`
- `platformMarginUnit`
- `quantity`
- `lineRetailTotal`
- `lineVendorPayoutTotal`
- `linePlatformMarginTotal`

Do not calculate these later from mutable product tables.

### VendorPayout

- Tracks how much the platform owes a vendor.
- Created after an order reaches the payout eligibility stage.
- Can be tied to one order item or grouped into batched settlements.

Recommended fields:

- `id`
- `vendorId`
- `orderId`
- `orderItemId`
- `amount`
- `currency`
- `status` (`PENDING`, `APPROVED`, `SCHEDULED`, `PAID`, `VOIDED`)
- `eligibleAt`
- `paidAt`
- `paymentReference`
- `notes`
- `createdAt`
- `updatedAt`

## Required Separation of Concerns

The backend should be organized by business responsibilities, not just route groups.

Recommended service boundaries:

- Auth and identity
- Vendor onboarding
- Store approval
- Submission intake and review
- Catalog publishing
- Cart and checkout
- Order lifecycle
- Vendor payout and settlement
- Admin reporting

Controllers should stay thin.

Controllers should:

- validate request shape
- call service functions
- map service results to HTTP responses

Business rules should live in services, not directly inside controllers.

## Workflow Rules

### Vendor Onboarding

1. User registers as `VENDOR`.
2. Vendor pays the one-time onboarding fee.
3. Vendor creates supplier/store profile.
4. Admin approves or rejects the supplier/store.
5. Only approved vendors can submit supplier offers.

### Submission Intake

1. Approved vendor creates a `VendorSubmission`.
2. Submission enters `SUBMITTED` state.
3. Admin reviews submission details.
4. Admin can reject with reason.
5. Admin can accept and convert it into a `CatalogProduct`.
6. On acceptance, create a `VendorSupplyAgreement`.

### Customer Purchase

1. Customer browses only `CatalogProduct` records that are public and active.
2. Customer adds catalog items to cart.
3. Customer checks out against retail pricing.
4. Order captures retail, vendor payout, and platform margin snapshots per line item.

### Vendor Settlement

1. Order completes platform-defined success criteria.
2. Payout becomes eligible only after delivery and optional return window.
3. `VendorPayout` records are created or unlocked.
4. Finance/admin marks payouts as paid once settled externally.

## Pricing Rules

Pricing must be explicit and immutable where it matters.

Required rules:

- The vendor's quoted price is the vendor's expected payout baseline.
- The admin's retail price is separate and fully controlled by the platform.
- Platform margin is the difference between retail and vendor payout.
- Pricing snapshots are stored on order items.
- Historical orders must never depend on current product price fields.

Validation rules:

- `vendorQuotedPrice` must be greater than zero.
- `retailPrice` must be greater than or equal to `vendorQuotedPrice` unless explicitly overridden by an admin exception workflow.
- Negative margins must be blocked by default.
- Currency mismatches between related records must be blocked.

## Approval Rules

Approval must be modeled explicitly.

Recommended approval states:

- Vendor/store approval
- Submission review status
- Catalog publication status
- Vendor payout approval

These are separate states and should not share one generic approval field unless the implementation can preserve full semantic clarity.

## API Design Standards

The backend should move to resource-oriented APIs with explicit admin and vendor scopes.

Recommended route groups:

- `/api/auth/*`
- `/api/users/*`
- `/api/vendor/profile/*`
- `/api/vendor/submissions/*`
- `/api/admin/vendors/*`
- `/api/admin/submissions/*`
- `/api/admin/catalog/*`
- `/api/catalog/*`
- `/api/orders/*`
- `/api/admin/orders/*`
- `/api/admin/payouts/*`

### Vendor-Facing Endpoints

Vendors need endpoints for:

- profile/store creation and editing
- submission drafts
- submission finalization
- submission history
- rejection feedback
- payout history

Vendors should not directly manage public retail products.

### Admin-Facing Endpoints

Admins need endpoints for:

- vendor approval queue
- submission review queue
- accept/reject submission actions
- catalog item creation and editing
- price overrides
- order operations
- payout review and payout marking

### Public Endpoints

Customers should only access:

- published catalog products
- categories/filters
- product detail
- checkout/order endpoints relevant to their own purchases

Supplier submissions must never be exposed via public APIs.

## Data Integrity Rules

All critical state transitions should be wrapped in transactions.

Use database transactions for:

- accepting a submission and creating its catalog product + supply agreement
- creating an order and capturing financial snapshots
- cancelling an order and restoring stock
- generating or releasing payouts

Add database constraints where possible:

- unique vendor profile per vendor
- unique active supply agreement per `catalogProductId` + vendor combination
- check constraints for non-negative amounts
- indexed foreign keys on all review and payout lookup paths

## Security and Access Control

Role-based access control must be enforced on the backend even if frontend guards exist.

Minimum enforcement:

- only admins can approve vendors
- only admins can accept/reject submissions
- only admins can set public retail prices
- only vendors can manage their own profiles and submissions
- only customers can view their own orders
- vendors may only view vendor-safe reporting related to their submissions and payouts

Vendors should not be able to:

- directly publish to marketplace
- change approval states
- edit admin-owned catalog listings
- view other vendors' commercial data

## Inventory Rules

Inventory should be tied to `CatalogProduct`, but traceable to supplier intent.

Recommended approach:

- `VendorSubmission.stockAvailable` represents supplier-declared available quantity
- `CatalogProduct.stock` represents sellable stock
- Acceptance may initialize catalog stock from submission stock
- Admin can adjust catalog stock independently if the business requires manual control

If the platform later supports multiple suppliers for the same public product, that should be modeled as a separate sourcing layer, not forced into the first implementation.

## Reporting Rules

Reporting must distinguish platform revenue from vendor obligations.

Admin reporting should separately show:

- gross merchandise value
- retail revenue
- vendor payout liability
- platform margin
- pending payout liability
- paid payout totals

Vendor reporting should show:

- accepted submissions
- units sold
- earned payout amount
- pending payouts
- paid payouts

Do not label retail order totals as vendor revenue.

## Error Handling Standards

Use consistent API response envelopes.

Recommended shape:

- `success`
- `message`
- `data`
- `errors` (optional)

Use clear, business-readable error messages for:

- missing permissions
- approval restrictions
- invalid workflow state
- payout eligibility failures
- pricing violations

## Validation Standards

Add request validation before service logic.

Recommended:

- schema-based validation for request payloads
- explicit validation for enums and status transitions
- decimal-safe monetary parsing
- server-side normalization of images and optional fields

Avoid trusting frontend validation.

## Test Expectations

Implementation should not proceed without test coverage for the business rules that matter.

Minimum required tests:

- vendor registration and fee gating
- vendor profile approval
- vendor submission creation
- submission acceptance creates catalog product + supply agreement
- retail checkout snapshots vendor payout and platform margin
- rejected or unpublished products cannot be purchased
- payout eligibility rules
- access control boundaries for admin vs vendor vs customer

Priority should be integration tests around business workflows, not only unit tests.

## Migration Strategy

The current backend already has user roles, store approval, and vendor fee handling.

The implementation should not try to patch the current `Product` model into the final business model.

Recommended migration path:

1. Keep current user auth and vendor fee flow.
2. Keep current vendor profile/store approval flow, but clarify its purpose as supplier onboarding.
3. Introduce new tables for `VendorSubmission`, `CatalogProduct`, `VendorSupplyAgreement`, and `VendorPayout`.
4. Deprecate direct vendor-to-public product publishing.
5. Refactor order creation to only use `CatalogProduct`.
6. Add payout lifecycle support.
7. Replace old product approval endpoints with submission review endpoints.

## Implementation Phases

### Phase 1: Foundation

- Finalize schema changes
- Add validation layer
- Add service layer
- Preserve auth and payment flow

### Phase 2: Supplier Workflow

- Vendor profile approval
- Submission creation and review
- Admin acceptance and rejection

### Phase 3: Retail Catalog

- Admin-owned catalog products
- Public catalog APIs
- Proper storefront filtering

### Phase 4: Orders and Financial Snapshots

- Checkout against catalog only
- Order item pricing snapshots
- Margin calculation

### Phase 5: Payouts and Reporting

- Vendor payout ledger
- Admin payout review
- Financial reporting

## Non-Goals for the First Implementation

The initial implementation should avoid expanding scope into:

- automated payout disbursement rails
- multi-supplier bidding for one catalog product
- vendor-direct customer messaging
- vendor-managed public pricing
- complex returns automation

These can be added later if needed.

## Current Direction Summary

The backend will move forward as a controlled supplier-submission platform with admin-owned retail listings.

The most important implementation rule is:

- Vendors submit supply offers.
- Admin publishes customer-facing products.
- Orders snapshot vendor payout and platform margin.
- Vendors are paid the agreed supplier amount, not the storefront sale price.
