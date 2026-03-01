# Backend Development Guide

## Goal

Build a platform-controlled commerce system with four roles:

- `ADMIN`: owns the public catalog, pricing, approvals, payouts
- `VENDOR`: supplies products to the platform
- `AFFILIATE`: drives traffic and earns commission on attributed sales
- `CUSTOMER`: buys from the public catalog

This is not a direct vendor marketplace.

## Core Business Rules

- Vendors do not publish directly to the storefront.
- Vendors submit supply offers to admin.
- Admin accepts or rejects vendor submissions.
- Accepted submissions become admin-owned catalog products.
- Customers buy only admin-owned catalog products.
- Vendors earn a fixed supplier payout.
- Affiliates earn commission only when a valid referral converts.
- Platform keeps the remaining margin.

## Required Data Split

Do not reuse one `Product` model for everything.

Use separate entities:

- `VendorProfile`
  - vendor/store identity, approval, branding
- `VendorSubmission`
  - vendor offer to supply an item
- `CatalogProduct`
  - public product sold by platform
- `VendorSupplyAgreement`
  - agreed vendor payout for accepted submission
- `AffiliateProfile`
  - affiliate onboarding, approval, payout details
- `AffiliateLink`
  - shareable referral link per affiliate and product
- `AffiliateClick`
  - click-tracking event
- `AffiliateCommission`
  - commission snapshot tied to order/order item
- `VendorPayout`
  - money owed to vendor
- `AffiliatePayout`
  - money owed to affiliate

## Financial Model Per Sale

For each order item, snapshot these values at purchase time:

- `retailUnitPrice`
- `vendorPayoutUnitPrice`
- `affiliateCommissionUnit`
- `platformMarginUnit`

Rules:

- customer pays retail price
- vendor gets fixed payout
- affiliate gets commission if attributed
- platform margin = retail - vendor payout - affiliate commission

Never calculate these later from mutable product settings.

## Vendor Workflow

1. User registers as `VENDOR`
2. Vendor pays onboarding fee
3. Vendor creates `VendorProfile`
4. Admin approves or rejects vendor profile
5. Approved vendor creates `VendorSubmission`
6. Admin reviews submission
7. If accepted:
   - create `CatalogProduct`
   - create `VendorSupplyAgreement`
8. Customer purchases `CatalogProduct`
9. Vendor payout becomes eligible after delivery + return window

## Affiliate Workflow

1. User registers as `AFFILIATE`
2. Affiliate pays onboarding fee
3. Affiliate creates `AffiliateProfile`
4. Admin approves or rejects affiliate profile
5. Affiliate browses commissionable catalog products
6. Affiliate generates or copies product referral link
7. Visitor lands with referral token
8. System records attribution and click
9. If purchase qualifies, create `AffiliateCommission`
10. Affiliate payout becomes eligible after delivery + return window

## Affiliate Attribution Rules

Recommended v1:

- product-level attribution only
- last-click attribution
- 30-day attribution window
- first-party cookie + server-side click record
- one affiliate link per affiliate per product

Valid commission only if:

- referred product matches purchased product
- click is still within attribution window
- affiliate is active and approved
- buyer is not the same user as the affiliate

Do not rely only on URL code or frontend local storage.

## Commission Rules

Recommended v1 defaults:

- default affiliate rate: `5%`
- commission base: post-discount item subtotal
- exclude tax and shipping from commission base
- void commission on cancel/refund
- only release commission after delivery + return window

Future enhancements like per-product or per-affiliate overrides can come later.

## API Boundaries

Suggested route groups:

- `/api/auth/*`
- `/api/users/*`
- `/api/catalog/*`
- `/api/orders/*`
- `/api/vendor/profile/*`
- `/api/vendor/submissions/*`
- `/api/vendor/payouts/*`
- `/api/affiliate/profile/*`
- `/api/affiliate/links/*`
- `/api/affiliate/commissions/*`
- `/api/affiliate/payouts/*`
- `/api/referrals/*`
- `/api/admin/vendors/*`
- `/api/admin/submissions/*`
- `/api/admin/catalog/*`
- `/api/admin/affiliates/*`
- `/api/admin/payouts/*`

## Access Control

Backend must enforce role boundaries:

- only admin can approve vendors and affiliates
- only admin can accept/reject submissions
- only admin can create or edit public catalog products
- only vendors manage their own profiles and submissions
- only affiliates manage their own links and view their own commissions
- customers only access their own orders

Vendors and affiliates must never access each other's financial data.

## Transaction Rules

Use DB transactions for:

- submission acceptance -> catalog product + supply agreement
- order creation -> order item pricing snapshots
- order cancellation/refund -> stock restoration + commission/payout reversal
- payout release -> payout state updates

## Validation Rules

Enforce server-side validation for:

- role-specific onboarding
- approval state transitions
- positive money values
- non-negative margins
- attribution-window validity
- self-referral blocking

## Reporting Rules

Admin reporting should separately show:

- gross sales
- vendor payout liability
- affiliate commission liability
- paid vendor payouts
- paid affiliate payouts
- net platform margin

Vendor reporting should show:

- accepted submissions
- pending payouts
- paid payouts

Affiliate reporting should show:

- clicks
- attributed conversions
- pending commissions
- paid commissions

## Current Codebase Direction

Keep:

- auth foundation
- vendor fee pattern
- approval-based onboarding pattern

Refactor:

- current vendor product approval flow into submission acceptance flow
- current public product logic into admin-owned catalog logic
- current order flow to use catalog products only

Add:

- `AFFILIATE` role
- affiliate fee flow
- referral tracking
- commission snapshots
- payout ledgers

## Implementation Order

1. Finalize Prisma schema split
2. Add service layer for submissions, attribution, payouts
3. Convert vendor flow to submission model
4. Add affiliate role and referral tracking
5. Refactor order flow to snapshot vendor + affiliate amounts
6. Add payout release logic
7. Add admin reporting

## V1 Scope Limits

Do not build in v1:

- automated payout rails
- site-wide affiliate attribution
- multi-touch attribution
- multi-supplier catalog sourcing
- complex fraud scoring

## One-Line Rule

Vendors supply, affiliates refer, admin sells, customers buy.
