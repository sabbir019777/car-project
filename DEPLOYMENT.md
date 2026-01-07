# Deployment Guide: Car Rental Platform

## Problem Summary

When deployed to Netlify, the frontend tries to reach `car-rental-plantform.vercel.app` (the fallback), which doesn't exist in production. The backend is deployed to Vercel, but the frontend doesn't know the URL.

**Solution:** Set `VITE_API_BASE` environment variable on Netlify pointing to your Vercel backend.

---

## Step 1: Deploy Backend to Vercel (First Time Only)

### Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- Git repo (GitHub/GitLab/Bitbucket) with your code

### Deploy Steps

1. **Push your code to Git**

   ```bash
   git add .
   git commit -m "Add API configuration and deployment setup"
   git push origin main
   ```

2. **Connect to Vercel**

   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"Add New"** → **"Project"**
   - Select your Git repository
   - Choose the **root folder** (not `/server`)
   - Click **"Deploy"** (it will auto-detect `vercel.json` config)

3. **Set Environment Variables on Vercel**

   - After deployment starts, go to **Project Settings** → **Environment Variables**
   - Add the following:
     - **Name:** `DB_USERNAME` | **Value:** Your MongoDB username
     - **Name:** `DB_PASSWORD` | **Value:** Your MongoDB password
     - **Name:** `FRONTEND_URLS` | **Value:** `https://your-site.netlify.app` (replace with your actual Netlify URL)

4. **Handle Firebase Service Account**

   - ⚠️ **Important:** `plantKey.json` contains sensitive credentials. Do NOT commit it to Git.
   - Option A (Recommended): Store Firebase service account JSON as a Vercel environment variable
     - Name: `FIREBASE_SERVICE_ACCOUNT`
     - Value: Paste the entire `plantKey.json` content
     - Modify `server/index.js` line 8 to load from env:
       ```javascript
       const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
       ```
   - Option B: Upload `plantKey.json` manually to Vercel project (less secure)

5. **Redeploy** after setting env vars

   - Go to **Deployments** → **Redeploy** the latest build

6. **Note your backend URL** (e.g., `car-rental-plantform.vercel.app`)

---

## Step 2: Deploy Frontend to Netlify

### Deploy Steps

1. **Connect to Netlify**

   - Go to [netlify.com](https://netlify.com)
   - Sign up / Log in with your Git provider
   - Click **"Add new site"** → **"Import an existing project"**
   - Select your GitHub repository
   - Choose the **root folder** (not `/server`)

2. **Configure Build Settings**

   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Click **"Deploy"**

3. **Set Environment Variables on Netlify**

   - Go to **Site settings** → **Build & deploy** → **Environment**
   - Click **"Edit variables"**
   - Add:
     - **Key:** `VITE_API_BASE`
     - **Value:** `car-rental-plantform.vercel.app` (replace with your actual Vercel backend URL)

4. **Trigger a New Build**
   - Go to **Deploys**
   - Click **"Trigger deploy"** → **"Deploy site"**
   - Wait for the build to complete

---

## Step 3: Test the Deployed Application

1. **Get your Netlify URL** from the deployment summary (e.g., `https://your-site.netlify.app`)

2. **Open the site** in your browser and try:
   - Click **"Browse Cars"** → should load cars from MongoDB
   - If you see cars, ✅ Backend connection is working!
   - If you see the error from the screenshot, check the next section

---

## Troubleshooting

### Error: `GET car-rental-plantform.vercel.app/api/cars/top-browse net::ERR_CONNECTION_REFUSED`

**Cause:** `VITE_API_BASE` is not set on Netlify.

**Fix:**

1. Go to Netlify Site Settings → Environment
2. Confirm `VITE_API_BASE` is set to your Vercel URL
3. Trigger a **new deploy** (previous builds cached the old fallback)
4. Wait for the build to complete and test again

### Error: `Failed to load cars. Please ensure backend server is running on port 3000`

**Cause:** Backend is not reachable or database credentials are wrong.

**Fix:**

1. Test backend directly in browser:
   ```
   car-rental-plantform.vercel.app/api/cars/top-rated
   ```
   - Should return JSON cars data or error message
2. Check Vercel function logs:
   - Go to Vercel dashboard → Project → **Logs**
   - Look for MongoDB connection errors
3. Verify env vars on Vercel:
   - **Project Settings** → **Environment Variables**
   - Ensure `DB_USERNAME`, `DB_PASSWORD`, `FRONTEND_URLS` are set

### CORS Error in Browser Console

**Cause:** Frontend URL not allowed on backend CORS.

**Fix:**

1. Check Netlify deployment URL (e.g., `https://your-site.netlify.app`)
2. Update `FRONTEND_URLS` on Vercel to include it:
   - **Value:** `http://localhost:5173,https://your-site.netlify.app`
3. Redeploy backend on Vercel

---

## Local Development

To test locally before deploying:

```bash
# Terminal 1: Start backend
cd server
npm install
npm start
# Backend logs: "✅ Server running on port 3000"

# Terminal 2: Start frontend
# (from root directory)
npm install
npm run dev
# Frontend at http://localhost:5173
```

Make sure `.env` in the root has:

```
VITE_API_BASE=car-rental-plantform.vercel.app
```

---

## File Reference

- **Frontend config:** [vite.config.js](vite.config.js)
- **API helper:** [src/api.js](src/api.js)
- **Server config:** [server/vercel.json](server/vercel.json)
- **Server entry:** [server/index.js](server/index.js)
- **Env template:** [.env.example](.env.example)

---

## Quick Command Reference

```bash
# Local development
npm run dev              # Start frontend at localhost:5173
cd server && npm start   # Start backend at localhost:3000

# Build for production
npm run build            # Creates dist/ folder
npm run preview          # Preview production build locally

# Push to Git (triggers Vercel/Netlify auto-deploy)
git push origin main
```
