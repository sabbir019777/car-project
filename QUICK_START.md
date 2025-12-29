# ⚡ Quick Start to Fix: 5-Minute Action Plan

## The Problem

Netlify frontend was hitting `localhost:3000` instead of your Vercel backend because `VITE_API_BASE` wasn't set.

## The Solution (3 Steps)

### Step 1️⃣: Deploy Backend to Vercel (15 min)

```bash
# Push to Git
git push origin main

# Then go to vercel.com/dashboard
# - Import your GitHub repo
# - Wait for deploy
# - Go to Project Settings → Environment Variables
# - Add these 3 variables:
#   DB_USERNAME = your_mongo_username
#   DB_PASSWORD = your_mongo_password
#   FRONTEND_URLS = [YOUR_NETLIFY_URL] (set this after step 2)
# - Click Deployments → Redeploy
# - SAVE the Vercel URL it gives you
```

### Step 2️⃣: Deploy Frontend to Netlify (15 min)

```bash
# Go to netlify.com
# - Add new site → Import from Git
# - Select your GitHub repo
# - Build: npm run build | Publish: dist
# - Deploy
# - SAVE the Netlify URL it gives you
# - Go to Site Settings → Environment
# - Add VITE_API_BASE = [YOUR_VERCEL_URL]
# - Trigger deploy
```

### Step 3️⃣: Final Setup (5 min)

```bash
# Back to Vercel (use Vercel URL from Step 1)
# - Update FRONTEND_URLS to include Netlify URL from Step 2
# - Example: https://your-site.netlify.app
# - Redeploy backend
```

## Test It Works

1. Open your Netlify URL in browser
2. Click "Browse Cars"
3. Should see cars ✅

If not, check:

- Netlify env vars set? (VITE_API_BASE = Vercel URL)
- Vercel env vars set? (DB_USERNAME, DB_PASSWORD, FRONTEND_URLS)
- Both redeployed? (Don't forget this!)

## Files That Changed

- ✨ NEW: `src/api.js` (API base URL helper)
- ✨ NEW: `.env.example`, `.env.local`, `DEPLOYMENT.md`, `netlify.toml`, `FIX_SUMMARY.md`, `CHECKLIST.md`
- Updated: `server/index.js`, `server/package.json`, 6 React components, `README.md`, `.gitignore`

## Full Docs

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Step-by-step with screenshots
- **[FIX_SUMMARY.md](./FIX_SUMMARY.md)** — What was fixed and why
- **[CHECKLIST.md](./CHECKLIST.md)** — Detailed checklist
- **[README.md](./README.md)** — Project overview

---

**Ready to deploy? Follow the 3 steps above, then test!** 🚀
