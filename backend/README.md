
# E-Commerce Decor Website

A full-stack e-commerce website built with **Node.js / Express.js** (backend), **Next.js / React** (frontend), and **NeonDB (PostgreSQL)** via Prisma. It features a complete shopping experience with JWT-based authentication, an admin dashboard, and a clean, responsive UI.

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
- PostgreSQL database hosted on NeonDB, accessed via Prisma ORM
- JWT authentication with bcrypt password hashing
- Role-based access control (Customer / Admin)
- Complete order management with stock tracking
- Rate limiting and async error handling middleware

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend:** Node.js, Express.js, Prisma, PostgreSQL (NeonDB)
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
   DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
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

## Usage

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- Admin dashboard: `http://localhost:3000/admin`

