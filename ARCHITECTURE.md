# 🏗️ Architecture & Data Flow

## Current Setup (After Fixes)

```
┌─────────────────────────────────────────────────────────────────┐
│                      YOUR APPLICATION                           │
└─────────────────────────────────────────────────────────────────┘

LOCAL DEVELOPMENT:
┌──────────────────────────────────────────────────────────────┐
│ Browser: http://localhost:5173                               │
├──────────────────────────────────────────────────────────────┤
│ Frontend (Vite + React)                                      │
│  ├─ src/api.js reads: VITE_API_BASE = car-rental-plantform.vercel.app │
│  └─ All API calls → car-rental-plantform.vercel.app/api/*             │
├──────────────────────────────────────────────────────────────┤
│            ↕ HTTP (Axios, Fetch)                            │
├──────────────────────────────────────────────────────────────┤
│ Backend (Express + Node.js): car-rental-plantform.vercel.app          │
│  ├─ CORS allows: http://localhost:5173                      │
│  ├─ MongoDB connected locally                               │
│  └─ Firebase auth enabled                                   │
├──────────────────────────────────────────────────────────────┤
│            ↕ TCP Connection                                 │
├──────────────────────────────────────────────────────────────┤
│ MongoDB (Local or Atlas)                                     │
│  └─ Stores: cars, bookings, users                           │
└──────────────────────────────────────────────────────────────┘


PRODUCTION DEPLOYMENT:
┌──────────────────────────────────────────────────────────────┐
│ Browser (User's device)                                      │
├──────────────────────────────────────────────────────────────┤
│ Frontend (Deployed on Netlify)                               │
│ https://your-site.netlify.app                                │
│  ├─ Vite reads: VITE_API_BASE env var during build          │
│  ├─ = car-rental-plantform.vercel.app              │
│  └─ All API calls → https://car-rental-plantform.../* │
├──────────────────────────────────────────────────────────────┤
│            ↕ HTTPS                                          │
├──────────────────────────────────────────────────────────────┤
│ Backend (Deployed on Vercel)                                 │
│ car-rental-plantform.vercel.app                     │
│  ├─ CORS allows: https://your-site.netlify.app             │
│  ├─ MongoDB Atlas connected                                 │
│  └─ Firebase auth enabled                                   │
├──────────────────────────────────────────────────────────────┤
│            ↕ TCP Connection                                 │
├──────────────────────────────────────────────────────────────┤
│ MongoDB Atlas (Cloud)                                        │
│  └─ Stores: cars, bookings, users                           │
└──────────────────────────────────────────────────────────────┘
```

---

## API Flow Example: "Browse Cars"

### LOCAL:

```
User clicks "Browse Cars" on http://localhost:5173
          ↓
React component (BrowseCarsPage.jsx) loads
          ↓
Calls: endpoint("/api/cars/top-browse")
          ↓
src/api.js resolves to: car-rental-plantform.vercel.app/api/cars/top-browse
          ↓
Axios GET request sent to backend
          ↓
Express server (server/index.js) receives request
          ↓
Queries MongoDB: carsCollection.find({}).limit(27)
          ↓
Returns JSON array of cars
          ↓
Frontend displays cars to user ✅
```

### PRODUCTION (WITH FIX):

```
User clicks "Browse Cars" on https://your-site.netlify.app
          ↓
React component (BrowseCarsPage.jsx) loads
          ↓
Calls: endpoint("/api/cars/top-browse")
          ↓
src/api.js reads VITE_API_BASE env var (set during Netlify build)
          ↓
= car-rental-plantform.vercel.app/api/cars/top-browse
          ↓
Axios GET request sent to Vercel backend
          ↓
Vercel function receives request
          ↓
Express server (server/index.js) receives request
          ↓
Queries MongoDB Atlas: carsCollection.find({})
          ↓
Returns JSON array of cars
          ↓
Frontend displays cars to user ✅
```

---

## Environment Variables: Where They Go

```
┌─ DEVELOPMENT ─────────────────────────┐
│ .env.local (root folder)              │
│ ├─ VITE_API_BASE=car-rental-plantform.vercel.app│
│ └─ (ignored by Git)                   │
│                                        │
│ server/.env                            │
│ ├─ DB_USERNAME=...                    │
│ ├─ DB_PASSWORD=...                    │
│ ├─ FRONTEND_URLS=http://localhost:5173│
│ └─ (ignored by Git)                   │
└────────────────────────────────────────┘

┌─ PRODUCTION (NETLIFY) ────────────────┐
│ Netlify Site Settings                 │
│ → Build & deploy → Environment        │
│ ├─ VITE_API_BASE=https://[VERCEL_URL] │
│ │  (embedded in JavaScript at build)  │
│ └─ Vars only at Netlify                │
│   (NOT in Git)                         │
└────────────────────────────────────────┘

┌─ PRODUCTION (VERCEL) ──────────────────┐
│ Vercel Project Settings                │
│ → Environment Variables                │
│ ├─ DB_USERNAME=...                     │
│ ├─ DB_PASSWORD=...                     │
│ ├─ FRONTEND_URLS=https://[NETLIFY_URL]│
│ ├─ PORT=3000 (optional)                │
│ └─ Vars read by Node.js at runtime    │
│   (NOT in Git)                         │
└────────────────────────────────────────┘
```

---

## Key Improvements Made

| Component              | Before                                       | After                                                                 |
| ---------------------- | -------------------------------------------- | --------------------------------------------------------------------- |
| **Frontend API URL**   | Hardcoded: `car-rental-plantform.vercel.app` | Dynamic: reads `VITE_API_BASE` env var                                |
| **Backend CORS**       | Hardcoded allowed origins                    | Reads `FRONTEND_URLS` env var                                         |
| **MongoDB Connection** | Commented out `await client.connect()`       | Actually connects + logs errors                                       |
| **Firebase Config**    | Only from file (`plantKey.json`)             | From env var (Vercel) or file (local)                                 |
| **Error Logging**      | Minimal                                      | Helpful: logs allowed origins, DB connection status                   |
| **Deployment Guide**   | None                                         | [DEPLOYMENT.md](./DEPLOYMENT.md) + [QUICK_START.md](./QUICK_START.md) |

---

## Why It Broke (Before Fix)

```
OLD SETUP:
Frontend URL hardcoded to: car-rental-plantform.vercel.app

When deployed to NETLIFY:
  → Vite builds frontend
  → Hardcoded URL embedded in JavaScript
  → Even if backend was down or different URL, code couldn't change
  → User deployed a NEW Netlify site (different URL)
  → CORS rejected requests (old Vercel URL not in FRONTEND_URLS)
  → Frontend fell back to localhost:3000 (default)
  → Localhost doesn't exist on Netlify → Connection refused ❌

WHY LOCALHOST IS FALLBACK:
  → src/api.js: import.meta.env.VITE_API_BASE || "car-rental-plantform.vercel.app"
  → If VITE_API_BASE not set, use localhost
  → If VITE_API_BASE not set on Netlify → uses localhost → error
```

---

## Why It Works Now (After Fix)

```
NEW SETUP:
frontend: No hardcoded URLs, uses endpoint() helper
backend: Reads CORS origins from env var
api.js: Reads API_BASE from VITE_API_BASE env var

When deployed to NETLIFY:
  → Set VITE_API_BASE env var on Netlify before build
  → Vite reads env var during build
  → Hardcodes actual Vercel URL in JavaScript
  → User clicks "Browse Cars"
  → Frontend makes request to Vercel URL (not localhost)
  → Backend CORS allows Netlify URL (from FRONTEND_URLS env var)
  → Data flows from MongoDB → Express → Netlify frontend ✅
```

---

## Files & Their Roles

```
FRONTEND (Netlify)
├─ src/
│  ├─ api.js ⭐ (NEW) — Central API configuration
│  ├─ components/
│  │  ├─ BrowseCarsPage.jsx (uses endpoint())
│  │  ├─ TopRatedCard.jsx (uses endpoint())
│  │  ├─ AddCarPage.jsx (uses endpoint())
│  │  ├─ MyListings.jsx (uses endpoint())
│  │  └─ UpdateCarModal.jsx (uses endpoint())
│  └─ main.jsx
├─ vite.config.js (no changes needed)
└─ package.json (build: npm run build)

BACKEND (Vercel)
├─ server/
│  ├─ index.js ⭐ (UPDATED) — Express + CORS + MongoDB
│  ├─ vercel.json (no changes)
│  └─ package.json (added start script)
└─ [other files]

DOCS (Git)
├─ .env.example ⭐ (NEW) — Template for env vars
├─ .env.local ⭐ (NEW) — Local dev setup
├─ DEPLOYMENT.md ⭐ (NEW) — Detailed deployment guide
├─ QUICK_START.md ⭐ (NEW) — 5-minute action plan
├─ FIX_SUMMARY.md ⭐ (NEW) — What was fixed
├─ CHECKLIST.md ⭐ (NEW) — Step-by-step checklist
├─ netlify.toml ⭐ (NEW) — Netlify build config
└─ README.md (UPDATED) — Added deployment section
```

⭐ = New or significantly updated

---

## Testing Checklist

- [ ] Local: `npm run dev` (frontend) + `npm start` (backend) → works?
- [ ] Vercel: Backend deploys → returns cars JSON?
- [ ] Netlify: Frontend deploys → loads cars?
- [ ] Env vars set on both Vercel & Netlify?
- [ ] VITE_API_BASE points to correct Vercel URL?
- [ ] FRONTEND_URLS includes correct Netlify URL?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed steps.
