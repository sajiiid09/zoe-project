
# E-Commerce Decor Website

A full-stack e-commerce website built with **Node.js / Express.js** (backend), **Next.js / React** (frontend), and **Supabase PostgreSQL** via Prisma. It features a complete shopping experience with JWT-based authentication, an admin dashboard, and a clean, responsive UI.

## Features

### Frontend

- Responsive design that works on all devices
- Product listings with sorting and filtering
- Dedicated product detail pages with reviews
- Fully functional shopping cart with localStorage persistence
- Multi-step checkout flow
- JWT-based user authentication (login / register)
- Admin dashboard for products, orders, users, and revenue

### Backend

- RESTful API built with Express.js
- PostgreSQL database hosted on Supabase, accessed via Prisma ORM
- JWT authentication with bcrypt password hashing
- Role-based access control (Customer / Admin)
- Complete order management with stock tracking
- Rate limiting and async error handling middleware

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend:** Node.js, Express.js, Prisma, PostgreSQL (Supabase)
- **Auth:** JSON Web Tokens (JWT), bcryptjs
- **Deployment:** Render

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/your_username/decor-website.git
   ```
2. Install backend dependencies:
   ```sh
   npm install
   ```
3. Install frontend dependencies:
   ```sh
   cd frontend && pnpm install
   ```
4. Create a `.env` file in the root directory:
   ```
   DATABASE_URL="postgresql://postgres.<project-ref>:<password>@<pooler-host>:6543/postgres?sslmode=require"
   DIRECT_URL="postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require"
   JWT_SECRET="your-secret-key"
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```
5. Generate Prisma client and run migrations:
   ```sh
   npx prisma generate
   npx prisma db push
   ```
6. Start the backend:
   ```sh
   npm run dev
   ```
7. Start the frontend (in another terminal):
   ```sh
   cd frontend && pnpm dev
   ```

## NeonDB to Supabase Migration Runbook

Use this for one-shot cutover with full data copy.

### 1) Pre-cutover validation

1. Create a Supabase project and get both URLs:
   - pooled runtime URL for `DATABASE_URL`
   - direct database URL for `DIRECT_URL`
2. Verify direct connectivity:
   ```sh
   DIRECT_URL="<your-supabase-direct-url>" npx prisma db pull
   ```
3. Ensure `pg_dump` and `pg_restore` are available in your ops environment.

### 2) Initial data copy

```sh
pg_dump "$NEON_DATABASE_URL" --format=custom --no-owner --no-acl --file neon_full.dump
pg_restore --clean --if-exists --no-owner --no-acl --dbname "$SUPABASE_DIRECT_URL" neon_full.dump
```

### 3) Post-copy checks

1. Compare row counts for critical tables:
   - `User`
   - `Order`
   - `OrderItem`
   - `Product`
   - `CatalogProduct`
   - `VendorSubmission`
   - `AffiliateProfile`
2. Spot-check relationships (orders -> order items, users -> addresses).
3. Run backend tests against Supabase-backed env:
   ```sh
   npm test
   ```

### 4) Cutover

1. Freeze writes (short maintenance window).
2. Run final `pg_dump` + `pg_restore` to capture last changes.
3. Update Render environment variables:
   - `DATABASE_URL` -> Supabase pooled URL
   - `DIRECT_URL` -> Supabase direct URL
4. Redeploy backend.
5. Unfreeze traffic.
6. Smoke test:
   - `GET /api/health`
   - login
   - order creation flow

### 5) Rollback

1. Restore prior Neon `DATABASE_URL` in Render.
2. Redeploy immediately.
3. Keep the Supabase dataset for retry after fix.

## Usage

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- Admin dashboard: `http://localhost:3000/admin`
