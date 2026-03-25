# Placement Management System

Full-stack placement management platform with a React + Tailwind client and a Node.js + Express + Sequelize + MySQL server.

## Tech Stack

- Client: React (Vite), Tailwind CSS, React Router, Axios
- Server: Node.js, Express.js, Sequelize ORM
- Database: MySQL

## Project Structure

```text
placement_manager/
  server/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    seeders/
    sql/
    utils/
    server.js
  client/
    src/
      components/
      hooks/
      layouts/
      pages/
      services/
```

## Prerequisites

- Node.js 18+
- npm 9+
- MySQL 8+

## Monorepo Setup

From repository root:

```bash
npm install
```

Run both server and client together:

```bash
npm run dev
```

## 1. Server Setup

```bash
cd server
cp .env.example .env
npm install
```

Edit `server/.env` with your local MySQL credentials.

### Create Database Tables

Option A (recommended, SQL-first):

```bash
mysql -u root -p < sql/schema.sql
```

Option B (ORM sync):

- Set `DB_SYNC=true` in `server/.env`
- Start server once, then set it back to `false`

### Seed Sample Data

```bash
npm run seed
```

### Run Server

```bash
npm run dev
```

Server base URL: `http://localhost:5000/api`

Health endpoint: `http://localhost:5000/api/health`

## 2. Client Setup

```bash
cd ../client
cp .env.example .env
npm install
npm run dev
```

Client URL: `http://localhost:5173`

## Root Workspace Scripts

From repository root:

- `npm run dev` (runs both server and client)
- `npm run dev:server`
- `npm run dev:client`
- `npm run build`
- `npm run seed`

## End-to-End Checklist

1. Start MySQL and ensure credentials in `server/.env` are valid.
2. Create schema using `server/sql/schema.sql`.
3. Optionally seed demo data with `npm run seed` from root.
4. Start full stack with `npm run dev` from root.
5. Open client at `http://localhost:5173`.

## Troubleshooting

### UI shows "Cannot reach the API server"

- Confirm server is running on port `5000`.
- Confirm `client/.env` (if present) points to the correct API URL.
- Check server health endpoint: `http://localhost:5000/api/health`.

### API returns unavailable/database message

- Server now stays online even if DB is unavailable and returns `503` for API routes.
- Fix DB settings in `server/.env` and MySQL access.
- Server retries DB connection automatically every 15 seconds.

## API Summary

All routes are prefixed with `/api`.

- Departments: `GET/POST /departments`, `GET/PUT/DELETE /departments/:id`
- Students: `GET/POST /students`, `GET/PUT/DELETE /students/:id`
  - Supports search, pagination, and `DeptID` filter
- Companies: `GET/POST /companies`, `GET/PUT/DELETE /companies/:id`
- Jobs: `GET/POST /jobs`, `GET/PUT/DELETE /jobs/:id`
  - Supports `CompanyID` filter and role/company search
- Applications:
  - Apply: `POST /applications/apply`
  - List: `GET /applications`
  - Update status: `PATCH /applications/:id/status`
  - Duplicate applies blocked with `(StudentID, JobID)` uniqueness
- Placements:
  - Create: `POST /placements`
  - List: `GET /placements`
  - Enforces 1:1 with `Application` and only `Selected` applications
- Dashboard stats: `GET /dashboard/stats`

## Production Notes

- CORS accepts configured `CORS_ORIGIN` and localhost origins for development.
- Database logging can be toggled with `DB_LOGGING`.
- Keep `DB_SYNC=false` in production.
- Use process manager (PM2/systemd) and reverse proxy (Nginx) for production deployment.

## Validation Performed

- Server syntax check passed for all server JavaScript files.
- Client production build passed (`npm run build`).
