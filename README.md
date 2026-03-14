# Zoe Marketplace

Zoe Marketplace is a multi-role e-commerce platform built for customers, vendors, affiliates, and administrators, with a modern web frontend, a Node.js API layer, and a PostgreSQL database.

## Features

- Customer storefront with product discovery, category browsing, cart, checkout, orders, and saved addresses
- Vendor workflows for role-aware signup, pay-now or review-first onboarding, store management, and submission tracking
- Affiliate workflows for role-aware signup, pay-now or review-first onboarding, profile management, and approval-based access
- Admin dashboards for user oversight, account activation, catalog review, vendor and affiliate approvals, and order monitoring
- Authentication, role-based access control, and Stripe-powered payment flows

## Current Development Notes

- Vendor and affiliate onboarding now follow the same intended product flow:
  - users can pay immediately or review onboarding first
  - onboarding can be saved before payment
  - admin review begins only after payment + complete onboarding
- User-facing onboarding states should be treated as `pending`, `approved`, or `needs_changes`.
- `blocked` is reserved for account-level moderation and fraud/security handling.
- Development seed data includes approved active storefront inventory across every public category.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Prisma
- Database: PostgreSQL on Supabase
- Payments: Stripe
