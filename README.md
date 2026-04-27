# Placement Management System

Full-stack placement management platform with a React + Tailwind client and a Node.js + Express + Sequelize server.

## Tech Stack

- Client: React (Vite), Tailwind CSS, React Router, Axios
- Server: Node.js, Express.js, Sequelize ORM
- Database: PostgreSQL or MySQL (via Sequelize)

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
- PostgreSQL 14+ or MySQL 8+

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

Edit `server/.env` with one of the supported DB configurations:

- `DATABASE_URL` (recommended for hosted Postgres providers like Neon)
- or `DB_*` credentials for local MySQL/Postgres

### Create Database Tables

Option A (MySQL SQL-first):

```bash
mysql -u root -p < sql/schema.sql
```

Option B (dialect-agnostic Sequelize sync):

- Set `DB_SYNC=true` in `server/.env`
- Start server once, then set it back to `false`

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

## End-to-End Checklist

1. Start MySQL and ensure credentials in `server/.env` are valid.
2. Create schema using `server/sql/schema.sql`.
3. Start full stack with `npm run dev` from root.
4. Open client at `http://localhost:5173`.

## Troubleshooting

### UI shows "Cannot reach the API server"

- Confirm server is running on port `5000`.
- Confirm `client/.env` (if present) points to the correct API URL.
- Check server health endpoint: `http://localhost:5000/api/health`.

### API returns unavailable/database message

- Server now stays online even if DB is unavailable and returns `503` for API routes.
- Fix DB settings in `server/.env` and DB access.
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
  - On placement creation, other active applications of the same student are auto-marked `Rejected`
- A student who already has a placement cannot apply to new jobs
- Dashboard stats: `GET /dashboard/stats`

## RBAC Authorization

Backend RBAC is implemented with three roles:

- `admin`: full access (including delete operations)
- `officer`: create/update/read access for operational modules
- `student`: read access + apply for jobs

### Enable RBAC

Set `RBAC_ENABLED=true` in `server/.env`.
Set `RBAC_ADMIN_EMAILS=24z218@psgtech.ac.in` (comma-separated if needed for multiple admins).
Set `VITE_RBAC_ADMIN_EMAIL=24z218@psgtech.ac.in` in `client/.env` for matching UI role behavior.

When enabled, each request must include:

- `x-user-id`: any non-empty user identifier
- `x-user-email`: user email (used to resolve admin from `RBAC_ADMIN_EMAILS`)
- `x-user-role`: optional override (`admin`, `officer`, `student`) for non-admin emails; defaults to `student`

### Student data isolation rules

- Student role can only access applications that belong to their own email.
- Student role can only apply using a student profile with matching email.
- Student role can only see placements tied to their own applications.

Example:

```bash
curl -H "x-user-id: u123" -H "x-user-role: officer" http://localhost:5000/api/dashboard/stats
```

## Production Notes

- CORS accepts configured `CORS_ORIGIN` and localhost origins for development.
- Database logging can be toggled with `DB_LOGGING`.
- Keep `DB_SYNC=false` in production.
- Use process manager (PM2/systemd) and reverse proxy (Nginx) for production deployment.

## Validation Performed

- Server syntax check passed for all server JavaScript files.
- Client production build passed (`npm run build`).
