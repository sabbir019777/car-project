# 📌 ENVIRONMENT VARIABLES CHEAT SHEET

## Copy-Paste Reference

### Local Development Setup

**File: `.env.local` (root directory)**

```bash
VITE_API_BASE=car-rental-plantform.vercel.app
```

**File: `server/.env`**

```bash
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
FRONTIER_URLS=http://localhost:5173
PORT=3000
```

---

## Deployment: Vercel Backend

### Go to: Vercel Dashboard → Project → Settings → Environment Variables

| Key                        | Value                    | Example                       |
| -------------------------- | ------------------------ | ----------------------------- |
| `DB_USERNAME`              | Your MongoDB username    | `admin_user`                  |
| `DB_PASSWORD`              | Your MongoDB password    | `m0ng0db!Pass123`             |
| `FRONTEND_URLS`            | Your Netlify URL         | `https://my-site.netlify.app` |
| `PORT`                     | (Optional)               | `3000`                        |
| `FIREBASE_SERVICE_ACCOUNT` | (Optional) Firebase JSON | (see security section)        |

**When to set:**

- `DB_USERNAME` & `DB_PASSWORD` — immediately (so backend can connect to MongoDB)
- `FRONTIER_URLS` — after you deploy to Netlify (for CORS)

**After adding variables:**

- Click **"Save"** on each
- Go to **Deployments** → **Redeploy** the latest build

---

## Deployment: Netlify Frontend

### Go to: Netlify → Your Site → Site Settings → Build & Deploy → Environment

| Key             | Value                   | Example                           |
| --------------- | ----------------------- | --------------------------------- |
| `VITE_API_BASE` | Your Vercel backend URL | `car-rental-plantform.vercel.app` |

**When to set:**

- After Vercel deployment (so you have the URL)

**After adding variable:**

- Go to **Deploys** → **Trigger deploy** → **Deploy site**

---

## Common Values

| Variable        | Where to Find                                               | Format                    |
| --------------- | ----------------------------------------------------------- | ------------------------- |
| `DB_USERNAME`   | MongoDB Atlas → Database → Connect → Connection String      | plain text                |
| `DB_PASSWORD`   | MongoDB Atlas → Database User → (your user password)        | plain text                |
| `VITE_API_BASE` | Vercel dashboard → Project → Deployments (shown at top)     | `https://xxx.vercel.app`  |
| `FRONTIER_URLS` | Netlify dashboard → Site Info → Site Details (shown at top) | `https://xxx.netlify.app` |

---

## Netlify Build Settings

### Go to: Netlify → Your Site → Site Settings → Build & Deploy → Build Command

| Setting               | Value           |
| --------------------- | --------------- |
| **Build command**     | `npm run build` |
| **Publish directory** | `dist`          |

---

## What Gets Built

**Frontend** (Netlify):

- `npm run build` creates `dist/` folder
- Vite reads `VITE_API_BASE` at build time
- Embeds it in JavaScript
- User downloads optimized HTML/CSS/JS

**Backend** (Vercel):

- No build needed
- Vercel reads `server/vercel.json`
- Deploys `server/index.js` as serverless function
- Vercel reads env vars at runtime

---

## Quick Verification

**Test backend:**

```bash
# In browser, visit:
car-rental-plantform.vercel.app/

# Should see:
Car Rental Server Running Successfully!
```

**Test frontend:**

```bash
# In browser, visit:
https://your-site.netlify.app/

# Click "Browse Cars" → should see car list ✅
```

---

## Troubleshooting Quick Fixes

| Error                  | Check                                                     |
| ---------------------- | --------------------------------------------------------- |
| `localhost:3000` error | `VITE_API_BASE` set on Netlify?                           |
| CORS error             | `FRONTIER_URLS` includes Netlify URL? Backend redeployed? |
| "Backend not running"  | `DB_USERNAME` & `DB_PASSWORD` set on Vercel?              |
| "Can't find cars"      | Both deployed? Both env vars set? Frontend rebuilt?       |

---

## Security Notes

⚠️ **NEVER commit these to Git:**

- `.env` files (use `.gitignore`)
- `server/plantKey.json` (Firebase credentials)
- Plain text passwords

✅ **DO:**

- Set sensitive values in Vercel/Netlify UI, not in Git
- Use `.env.example` as template (for documentation only)

---

## File Locations for Reference

```
├─ .env.local                (local dev, Git ignored)
├─ server/
│  └─ .env                   (local dev, Git ignored)
└─ .env.example              (template, Git tracked)

Vercel Settings:
├─ Project → Environment Variables   (DB_USERNAME, DB_PASSWORD, FRONTIER_URLS)
└─ Deployments → [your deploy]

Netlify Settings:
├─ Site Settings → Environment       (VITE_API_BASE)
└─ Deploys → [your deploy]
```

---

## Copy-Paste Blocks

### Vercel Env Vars (Set These)

```
DB_USERNAME =
DB_PASSWORD =
FRONTIER_URLS =
```

### Netlify Env Vars (Set This)

```
VITE_API_BASE =
```

---

**For detailed instructions, see [00_START_HERE.md](./00_START_HERE.md)**
