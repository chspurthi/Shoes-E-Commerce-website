# VoltStride — Shoe Brand E-Commerce App

A full-stack e-commerce web app for a shoe brand: product catalog, cart,
checkout, user auth with role-based access (Admin/User), and an admin
dashboard for managing products and order status.

**Stack:** React + Vite + Tailwind (frontend), Node + Express (backend),
SQLite via better-sqlite3 (database), JWT for auth.

The database is a single file, `backend/voltstride.db`, created automatically
the first time the server runs. There's nothing to install or start
separately — no database server, no signup, no connection string.

## Project structure

```
shoe-store/
  backend/     Express API (auth, products, orders)
  frontend/    React storefront + admin dashboard
```

## 1. Prerequisites

- Node.js 18+ (SQLite support and everything else needs this; check with `node -v`)

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set:
- `JWT_SECRET` — any long random string

Seed the database with an admin account, a test user, and starter products
(this creates `voltstride.db` automatically):

```bash
npm run seed
```

This prints demo logins:
- Admin: `admin@voltstride.com` / `admin123`
- User: `user@voltstride.com` / `user123`

Start the API server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 3. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The storefront runs at `http://localhost:3000` and proxies `/api` requests
to the backend automatically (see `vite.config.js`).

## 4. Using the app

- Browse the catalog, filter by category, search, and sort by price.
- Add shoes to your cart (a size must be picked first) and check out —
  checking out requires being signed in.
- Sign in as the seeded admin account and visit **Admin** in the nav bar to:
  - Add, edit, and delete products
  - View all orders and update their status (Processing → Shipped → Delivered)
- Sign in as a regular user to place orders and view order history under **Orders**.

## 5. API overview

| Method | Route                     | Access        | Description                  |
|--------|---------------------------|---------------|-------------------------------|
| POST   | /api/auth/register        | Public        | Create a user account         |
| POST   | /api/auth/login           | Public        | Log in, returns JWT           |
| GET    | /api/auth/profile         | Logged in     | Current user info             |
| GET    | /api/products             | Public        | List products (filter/sort)   |
| GET    | /api/products/:id         | Public        | Product detail                |
| POST   | /api/products             | Admin         | Create product                |
| PUT    | /api/products/:id         | Admin         | Update product                |
| DELETE | /api/products/:id         | Admin         | Delete product                |
| POST   | /api/orders               | Logged in     | Place an order                |
| GET    | /api/orders/myorders      | Logged in     | Own order history             |
| GET    | /api/orders               | Admin         | All orders                    |
| GET    | /api/orders/:id           | Owner/Admin   | Order detail                  |
| PUT    | /api/orders/:id/status    | Admin         | Update order status           |

## 6. Notes for extending this

- Passwords are hashed with bcrypt; JWTs expire after 7 days.
- Order totals and stock levels are recalculated server-side at checkout,
  never trusted from the client.
- Product images in the seed data are placeholder Unsplash URLs — swap in
  your own product photography for a real store.
- To add real payments, integrate Stripe/PayPal in `Checkout.jsx` and the
  `POST /api/orders` route.
- To move to PostgreSQL/MySQL instead of SQLite, swap `backend/config/db.js`
  and the files in `backend/models/` for an ORM like Prisma or Sequelize;
  the route logic in `backend/routes/` stays the same.
- Deleting `backend/voltstride.db` and re-running `npm run seed` gives you
  a fully fresh database at any time.
