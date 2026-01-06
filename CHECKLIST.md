# 📋 Deployment Checklist

Use this checklist to track your deployment progress.

## Phase 1: Preparation ✅

- [ ] Review [FIX_SUMMARY.md](./FIX_SUMMARY.md) for what was fixed
- [ ] Read [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed steps
- [ ] Verify local setup works: `npm run dev` (frontend) + `npm start` (server)
- [ ] Push code to Git: `git push origin main`

## Phase 2: Deploy Backend (Vercel)

- [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Click "Add New Project" and import your GitHub repo
- [ ] Wait for deployment to complete
- [ ] Note the Vercel URL: `https://_____.vercel.app`
- [ ] Go to **Project Settings** → **Environment Variables**
- [ ] Add `DB_USERNAME`: Your MongoDB username
- [ ] Add `DB_PASSWORD`: Your MongoDB password
- [ ] Add `FRONTEND_URLS`: Your Netlify URL (will get this later)
- [ ] Click **Deployments** → **Redeploy** latest build
- [ ] Verify backend is live: Open Vercel URL in browser, should see "Car Rental Server Running Successfully!"

## Phase 3: Deploy Frontend (Netlify)

- [ ] Go to [netlify.com](https://netlify.com)
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Select your GitHub repo
- [ ] Set **Build command**: `npm run build`
- [ ] Set **Publish directory**: `dist`
- [ ] Click "Deploy"
- [ ] Wait for deployment (takes 2-5 minutes)
- [ ] Note your Netlify URL: `https://_____.netlify.app`
- [ ] Go to **Site Settings** → **Build & deploy** → **Environment**
- [ ] Click "Edit variables"
- [ ] Add `VITE_API_BASE`: Your Vercel URL from Phase 2
- [ ] Go to **Deploys** → **Trigger deploy** → **Deploy site**
- [ ] Wait for build to complete

## Phase 4: Verification ✅

- [ ] Open your Netlify site in browser
- [ ] Click "Browse Cars" or go to home page
- [ ] Should see a list of cars from MongoDB
- [ ] Try adding a car (if logged in) — should work
- [ ] Try booking a car — should work
- [ ] **If you see cars loading:** 🎉 **Success!**
- [ ] **If you see the error:** Go to [Troubleshooting](#troubleshooting) below

## Phase 5: Finalize (One-Time)

- [ ] Update `FRONTEND_URLS` on Vercel with your final Netlify URL
- [ ] Redeploy backend on Vercel (so CORS allows your site)
- [ ] Test again to ensure everything works

---

## Troubleshooting

### Error: `GET https://car-rental-plantform-1on34o919-cardioy.vercel.app/api/cars/top-browse net::ERR_CONNECTION_REFUSED`

**Problem:** Frontend still trying to hit localhost.

**Solution:**

1. Check Netlify `VITE_API_BASE` is set correctly (go to Site Settings → Environment)
2. Verify Vercel URL is correct (e.g., `https://car-rental-plantform-1on34o919-cardioy.vercel.app`)
3. **Trigger a new deploy** on Netlify (previous build cached old fallback)
4. Wait for build to complete and test again

### Error: `Failed to load cars. Please ensure backend server is running on port 3000`

**Problem:** Backend is unreachable or database error.

**Solution:**

1. Test backend directly: Open Vercel URL in browser
2. Check Vercel logs: **Project** → **Logs** → look for errors
3. Verify Vercel env vars are set correctly (DB_USERNAME, DB_PASSWORD)
4. Redeploy backend on Vercel

### CORS Error in Browser Console

**Problem:** Netlify URL not allowed by backend CORS.

**Solution:**

1. Get your Netlify URL (e.g., `https://your-site.netlify.app`)
2. Update `FRONTEND_URLS` on Vercel to include it
3. Example: `http://localhost:5173,https://your-site.netlify.app`
4. Redeploy backend on Vercel

---

## Need Help?

- Full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- What was fixed: [FIX_SUMMARY.md](./FIX_SUMMARY.md)
- Main docs: [README.md](./README.md)

---

## One-Liner Commands for Testing

```bash
# Local frontend (root)
npm run dev

# Local backend (from root)
cd server && npm start

# Build frontend
npm run build

# Run deployment checks
node scripts/deployment-check.js
```

---

**Status:** ⏳ Ready to deploy. Follow the checklist above.
