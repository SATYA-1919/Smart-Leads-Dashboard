# Smart Leads Dashboard

A full-stack **Lead Management Dashboard** built with the MERN stack and TypeScript.

> Built as the ServiceHive Full Stack Internship Assignment.

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, TailwindCSS, React Router, React Query, Zustand, React Hook Form, Zod, Axios.
**Backend:** Node.js, Express, TypeScript, Mongoose, JWT, bcryptjs, Zod, Helmet, Morgan, Rate Limit, json2csv.
**Database:** MongoDB.
**Tooling:** Docker, Docker Compose, Nginx (for serving the SPA in production).

## Features

### Authentication
- JWT-based login and registration
- Password hashing with bcrypt
- Auth middleware on protected API routes
- Persisted session via `localStorage` + auto-refresh of the user profile on app boot

### Lead Management (CRUD)
- Create, read, update, delete leads
- Lead fields: `name`, `email`, `status` (New/Contacted/Qualified/Lost), `source` (Website/Instagram/Referral), `createdAt`
- View single lead details modal

### Advanced Filtering, Search & Sort
- Filter by **Status**
- Filter by **Source**
- **Search** by name or email (case-insensitive, regex-safe)
- **Sort** by Latest / Oldest
- All filters compose together (e.g. `status=Qualified&source=Instagram&search=Rahul`)
- **Debounced search** (400 ms) to avoid spamming the API

### Pagination
- **Backend pagination** with `skip` + `limit`
- 10 records per page (configurable via `?limit=`)
- Response includes full meta: `total`, `page`, `limit`, `totalPages`, `hasNextPage`, `hasPrevPage`

### Role-Based Access Control
- Two roles: `Admin` and `SalesUser`
- Admin-only: **delete lead** and **CSV export**
- Both roles: create / update / view leads
- Enforced via `authorize(...roles)` middleware on the server, and conditional UI on the client

### CSV Export
- Exports the **currently filtered** leads (same filters as the list — no pagination)
- Streams a `text/csv` response with proper `Content-Disposition` for browser download

### UI / UX
- Split-screen branded **auth** pages with a "use" button for demo accounts
- Sticky app header with gradient logo, avatar chip, and SVG theme toggle
- **Stats overview** cards (total / new / qualified / lost) on the dashboard
- Polished lead table with avatars, status dots, source pills, and icon-only action buttons
- Sliding modals (slide-up on mobile, centered on desktop) for create / edit / view / delete
- Filter bar with active-filter chip, "clear all" shortcut, and search icon
- Responsive layout (mobile → desktop), full keyboard + screen reader support
- Loading, empty, and error states everywhere
- Form validation (Zod on both client and server)
- **Dark mode** with persisted preference + system preference fallback

### API Standards
- RESTful routes (`/api/auth/*`, `/api/leads/*`)
- Consistent response envelope: `{ success, data, message?, meta?, errors? }`
- Centralized error handler converts `ZodError`, `MongooseValidationError`, duplicate-key, and `ApiError` into proper status codes
- Helmet + CORS + rate limiting on `/api`

## Project Structure

```
smart-leads-dashboard/
├── docker-compose.yml
├── README.md
├── .gitignore
├── client/                   # React + Vite + Tailwind
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── tsconfig*.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── api/              # Axios client + typed API calls
│       ├── components/
│       │   ├── leads/        # LeadTable, LeadForm, LeadFiltersBar, Pagination, ...
│       │   └── ui/           # Modal, Spinner, Alert, EmptyState
│       ├── hooks/            # useDebouncedValue
│       ├── layouts/          # DashboardLayout
│       ├── pages/            # Login, Register, Leads, NotFound
│       ├── store/            # Zustand stores (auth, theme)
│       ├── types/            # Shared TS types
│       ├── utils/
│       ├── App.tsx
│       └── main.tsx
└── server/                   # Express + Mongoose
    ├── Dockerfile
    ├── .env.example
    ├── tsconfig.json
    └── src/
        ├── config/           # env + db
        ├── controllers/      # auth.controller, lead.controller
        ├── middleware/       # auth, validate, errorHandler
        ├── models/           # User, Lead
        ├── routes/
        ├── services/         # lead.service (filter + pagination)
        ├── types/
        ├── utils/            # ApiError, asyncHandler, seed
        ├── validators/       # Zod schemas
        ├── app.ts
        └── index.ts
```

## Running with Docker (recommended)

Prerequisites: **Docker Desktop**.

```bash
# from the repo root
docker compose up --build
```

- Client (Nginx): http://localhost:8080
- API: http://localhost:5000/api
- Mongo: localhost:27017 (volume `mongo-data`)

To override secrets, create a `.env` next to `docker-compose.yml`:

```bash
JWT_SECRET=please_replace_with_a_long_random_value
```

### Seeding sample data (Docker)

The seed script connects from your host machine to the Mongo container, so once the stack is running:

```bash
cd server
cp .env.example .env
# edit .env if needed (defaults to mongodb://localhost:27017/smart_leads)
npm install
npm run seed
```

This wipes the `users` and `leads` collections and inserts:

| Role       | Email                   | Password   |
|------------|-------------------------|------------|
| Admin      | admin@smartleads.dev    | admin123   |
| SalesUser  | sales@smartleads.dev    | sales123   |

Plus 20 sample leads.

## Running locally (without Docker)

You will need Node 20+ and a local MongoDB (or update `MONGO_URI` to an Atlas connection string).

### Backend

```bash
cd server
cp .env.example .env
npm install
npm run seed      # optional but recommended
npm run dev       # http://localhost:5000
```

### Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev       # http://localhost:5173 (proxies /api to :5000)
```

## Environment Variables

### `server/.env`

| Variable          | Description                                  | Default                                |
|-------------------|----------------------------------------------|----------------------------------------|
| `PORT`            | API port                                     | `5000`                                 |
| `NODE_ENV`        | `development` / `production` / `test`        | `development`                          |
| `MONGO_URI`       | MongoDB connection string                    | `mongodb://localhost:27017/smart_leads`|
| `JWT_SECRET`      | JWT signing secret (min 16 chars)            | —                                      |
| `JWT_EXPIRES_IN`  | JWT expiry (e.g. `7d`, `1h`)                 | `7d`                                   |
| `CLIENT_ORIGIN`   | Allowed CORS origin                          | `http://localhost:5173`                |

### `client/.env`

| Variable                 | Description                                                |
|--------------------------|------------------------------------------------------------|
| `VITE_API_BASE_URL`      | Base URL for API requests (default `/api`)                 |
| `VITE_API_PROXY_TARGET`  | Used by the Vite dev server proxy (default `:5000`)        |

## API Documentation

Base path: `/api`

### Auth

| Method | Path                | Auth | Body / Query                              | Description                            |
|--------|---------------------|------|-------------------------------------------|----------------------------------------|
| POST   | `/auth/register`    | ❌   | `{ name, email, password, role? }`        | Create a user, returns `{ token, user }` |
| POST   | `/auth/login`       | ❌   | `{ email, password }`                     | Login, returns `{ token, user }`       |
| GET    | `/auth/me`          | ✅   | —                                         | Get the current user                   |

### Leads

All routes require `Authorization: Bearer <token>`.

| Method | Path                  | Role         | Description                          |
|--------|-----------------------|--------------|--------------------------------------|
| GET    | `/leads`              | Any          | List leads (filters + pagination)    |
| POST   | `/leads`              | Any          | Create a lead                        |
| GET    | `/leads/:id`          | Any          | Get a single lead                    |
| PATCH  | `/leads/:id`          | Any          | Update a lead                        |
| DELETE | `/leads/:id`          | **Admin**    | Delete a lead                        |
| GET    | `/leads/export`       | **Admin**    | Export filtered leads as CSV         |
| GET    | `/leads/stats`        | Any          | Total leads + counts grouped by status |

**Query parameters for `GET /leads` and `GET /leads/export`:**

- `page` — integer, default `1` (ignored for export)
- `limit` — integer 1–100, default `10` (ignored for export)
- `status` — `New | Contacted | Qualified | Lost`
- `source` — `Website | Instagram | Referral`
- `search` — case-insensitive match on `name` or `email`
- `sort` — `latest | oldest`, default `latest`

**Sample response — `GET /leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1&limit=10`:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65a...",
      "name": "Rahul Sharma",
      "email": "rahul.sharma@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "createdBy": "65a...",
      "createdAt": "2026-05-19T08:12:00.000Z",
      "updatedAt": "2026-05-19T08:12:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

**Error response shape:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email"],
    "name": ["Name must be at least 2 characters"]
  }
}
```

## Scripts

### Server

| Script             | Purpose                                      |
|--------------------|----------------------------------------------|
| `npm run dev`      | Run with `tsx watch`                         |
| `npm run build`    | Compile TS to `dist/`                        |
| `npm start`        | Run the compiled server                      |
| `npm run seed`     | Seed users + sample leads                    |
| `npm run type-check` | TypeScript only, no emit                   |

### Client

| Script             | Purpose                                      |
|--------------------|----------------------------------------------|
| `npm run dev`      | Vite dev server with API proxy               |
| `npm run build`    | Type-check + production build                |
| `npm run preview`  | Preview the production build                 |
| `npm run type-check` | TypeScript only, no emit                   |

## Notes

- Search uses an **escaped, case-insensitive regex** against `name` and `email` (no regex-injection risk).
- The CSV export reuses the **same filter builder** as the list endpoint, guaranteeing parity.
- TypeScript `strict` is enabled on both apps; use of `any` is avoided.
- Rate limiter: 300 requests / 15 min / IP on `/api`.
