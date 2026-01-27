# 🚀 FIX SUMMARY: MongoDB Data Not Loading on Netlify

## Root Cause

Frontend deployed on Netlify was trying to reach `car-project-server-side.vercel.app` (fallback) instead of the actual Vercel backend URL, because the `VITE_API_BASE` environment variable was never set during the Netlify build.

## ✅ What Was Fixed

### 1. **API Configuration Made Dynamic**

- Created `src/api.js` that reads `VITE_API_BASE` env var
- Updated all frontend components to use the new `endpoint()` helper:
  - `TopRatedCard.jsx`
  - `BrowseCarsPage.jsx`
  - `AddCarPage.jsx`
  - `MyListings.jsx`
  - `UpdateCarModal.jsx`

### 2. **Backend Made Production-Ready**

- Updated `server/index.js` to:
  - Load CORS allowed origins from `FRONTEND_URLS` env var (configurable per deployment)
  - Attempt real MongoDB connection (not commented out)
  - Add helpful error logs for missing credentials
  - Handle Firebase service account from env var (secure for Vercel)
- Added `start` script to `server/package.json`

### 3. **Deployment Configuration**

- Created `.env.example` — template for all required env vars
- Created `.env.local` — local dev setup instructions
- Created `DEPLOYMENT.md` — detailed step-by-step guide for Vercel & Netlify
- Created `netlify.toml` — Netlify build config
- Updated `.gitignore` to protect `server/plantKey.json` and `.env` files
- Updated `README.md` with deployment info and troubleshooting

## 📋 IMMEDIATE ACTION ITEMS

### **Step 1: Deploy Backend (Vercel)**

1. Push code to Git: `git push origin main`
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click **"Add New Project"** → select your GitHub repo
4. After deployment starts, go to **Project Settings** → **Environment Variables**
5. Add these three env vars:
   ```
   DB_USERNAME = your_mongodb_username
   DB_PASSWORD = your_mongodb_password
   FRONTEND_URLS = https://your-site.netlify.app
   ```
6. Click **Deployments** → **Redeploy** the latest build
7. **Save the Vercel URL** (e.g., `car-project-server-side.vercel.app`)

### **Step 2: Deploy Frontend (Netlify)**

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your GitHub repo (same one)
4. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **"Deploy"** and wait for build to complete
6. Go to **Site Settings** → **Build & deploy** → **Environment**
7. Click **"Edit variables"** and add:
   ```
   VITE_API_BASE = car-project-server-side.vercel.app
   ```
   (Replace with your actual Vercel URL from Step 1)
8. Go to **Deploys** → **Trigger deploy** → **Deploy site**
9. **Get your Netlify URL** from the deployment summary

### **Step 3: Test the Fix**

1. Open your Netlify site (e.g., `https://your-site.netlify.app`)
2. Click **"Browse Cars"** — should now load cars from MongoDB ✅
3. If error persists:
   - Check browser console for actual error message
   - Check Vercel function logs for MongoDB/CORS errors
   - Verify `VITE_API_BASE` is set on Netlify (and rebuild)

---

## 🔧 Local Testing (Before Deploying)

Test everything locally first:

```bash
# Terminal 1: Start backend
cd server
npm install
npm start
# Should log: ✅ Server running on port 3000

# Terminal 2: Start frontend (from root)
npm install
npm run dev
# Opens http://localhost:5173 → should load cars ✅
```

If local works, deployment will too. Use the steps above.

---

## 📁 Files Modified/Created

| File                          | Change                                      |
| ----------------------------- | ------------------------------------------- |
| `src/api.js`                  | ✨ NEW — API base URL helper                |
| `server/index.js`             | Updated — Firebase/CORS/Mongo improvements  |
| `server/package.json`         | Updated — Added `start` script              |
| `src/components/*.jsx`        | Updated — Use `endpoint()` helper (6 files) |
| `.env.example`                | ✨ NEW — Env vars template                  |
| `.env.local`                  | ✨ NEW — Local dev setup                    |
| `DEPLOYMENT.md`               | ✨ NEW — Detailed deployment guide          |
| `netlify.toml`                | ✨ NEW — Netlify build config               |
| `.gitignore`                  | Updated — Protect secrets                   |
| `README.md`                   | Updated — Added deployment section          |
| `scripts/deployment-check.js` | ✨ NEW — Checklist script                   |

---

## ✨ Quick Reference: Env Vars Needed

### Vercel (Backend)

```
DB_USERNAME = your_mongo_username
DB_PASSWORD = your_mongo_password
FRONTEND_URLS = https://your-netlify-site.netlify.app
FIREBASE_SERVICE_ACCOUNT = (optional, for Vercel security)
```

### Netlify (Frontend)

```
VITE_API_BASE = https://your-vercel-backend.vercel.app
```

### Local Development

```
# Root .env.local
VITE_API_BASE=car-project-server-side.vercel.app

# server/.env
DB_USERNAME=local_mongo_user
DB_PASSWORD=local_mongo_pass
FRONTEND_URLS=http://localhost:5173
```

---

## 🔒 Security Note

- **NEVER** commit `server/plantKey.json` (Firebase credentials)
- **NEVER** commit `.env` files (contains DB credentials)
- Both are in `.gitignore` ✅

For Vercel, consider using `FIREBASE_SERVICE_ACCOUNT` env var instead of the file.

---

## 📞 If You Still Get Errors

1. **"GET car-project-server-side.vercel.app/api/cars/top-browse net::ERR_CONNECTION_REFUSED"**
   → `VITE_API_BASE` not set on Netlify. Check Netlify env vars and rebuild.

2. **"Failed to load cars. Please ensure backend server is running on port 3000"**
   → Backend unreachable. Check Vercel logs and MongoDB credentials.

3. **CORS error in console**
   → Your Netlify URL not in `FRONTEND_URLS` on Vercel. Update and redeploy.

See `DEPLOYMENT.md` for more troubleshooting.
