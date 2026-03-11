# E-Commerce Decor Backend

Express + Prisma backend for the Zoe marketplace, using PostgreSQL on Supabase.

## Stack

- Node.js (Express)
- Prisma ORM
- PostgreSQL (Supabase)
- JWT auth (cookie-first for web clients)

## Required Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@<pooler-host>:6543/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require"
JWT_SECRET="replace-with-long-random-secret"
FRONTEND_URL="http://localhost:3000"
PORT="5000"
NODE_ENV="development"
```

Notes:
- `DATABASE_URL` should be the Supabase pooled connection (runtime).
- `DIRECT_URL` should be the direct DB connection (Prisma CLI/migrations).
- App startup should fail if `JWT_SECRET` is missing.

## Local Development

From `backend/`:

```bash
npm install
npm run prisma:generate
npm run seed
npm run dev
```

API health:

```bash
curl http://localhost:5000/api/health
```

## Supabase Data Migration (Neon -> Supabase)

One-shot cutover with short write freeze.

### 1) Pre-cutover checks

1. Create Supabase project and collect:
- pooled URL (`DATABASE_URL`)
- direct URL (`DIRECT_URL`)
2. Verify direct connectivity:

```bash
DIRECT_URL="<supabase-direct-url>" npx prisma db pull
```

3. Ensure tools exist on ops machine:
- `pg_dump`
- `pg_restore`

### 2) Initial copy

```bash
pg_dump "$NEON_DATABASE_URL" --format=custom --no-owner --no-acl --file neon_full.dump
pg_restore --clean --if-exists --no-owner --no-acl --dbname "$SUPABASE_DIRECT_URL" neon_full.dump
```

### 3) Validate copy

Check row counts and spot checks for:
- `User`
- `Order`
- `OrderItem`
- `Product`
- `CatalogProduct`
- `VendorSubmission`
- `AffiliateProfile`

Then run backend tests:

```bash
npm test
```

### 4) Cutover

1. Freeze writes briefly.
2. Run final dump/restore.
3. Update backend env to Supabase:
- `DATABASE_URL` (pooler)
- `DIRECT_URL` (direct)
4. Restart backend.
5. Unfreeze traffic.
6. Smoke test:
- `GET /api/health`
- login
- order creation path

### 5) Rollback

1. Restore previous `DATABASE_URL` and `DIRECT_URL`.
2. Restart backend immediately.
3. Keep Supabase snapshot for next retry.

## Hostinger VPS Deployment Runbook

Keep backend on VPS with PM2 + Nginx reverse proxy.

### 1) Server bootstrap (Ubuntu)

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2
```

### 2) Deploy app code

```bash
cd /var/www
sudo mkdir -p zoe-project
sudo chown -R $USER:$USER zoe-project
cd zoe-project
git clone <your-repo-url> .
cd backend
npm install
npm run prisma:generate
```

Create/update `backend/.env` with production values:
- `DATABASE_URL` (Supabase pooled URL)
- `DIRECT_URL` (Supabase direct URL)
- `JWT_SECRET`
- `FRONTEND_URL` (your frontend domain)
- `NODE_ENV=production`
- `PORT=5000`

### 3) Start backend with PM2

```bash
cd /var/www/zoe-project/backend
pm2 start server.js --name zoe-backend
pm2 save
pm2 startup
```

### 4) Configure Nginx reverse proxy

Create `/etc/nginx/sites-available/zoe-backend`:

```nginx
server {
  listen 80;
  server_name api.your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/zoe-backend /etc/nginx/sites-enabled/zoe-backend
sudo nginx -t
sudo systemctl reload nginx
```

### 5) Enable SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com
```

### 6) Ongoing deploy/update

```bash
cd /var/www/zoe-project
git pull
cd backend
npm install
npm run prisma:generate
pm2 restart zoe-backend --update-env
```

### 7) Rollback

```bash
cd /var/www/zoe-project
git log --oneline -n 10
git checkout <last-known-good-commit>
cd backend
npm install
npm run prisma:generate
pm2 restart zoe-backend --update-env
```

## Backend Smoke Checklist

- `GET /api/health` returns `success: true`
- Login/register/logout works with cookie auth
- Admin, vendor, affiliate protected routes authorize correctly
- Product/catalog/order flows read/write Supabase data
