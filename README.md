# Car Rental Platform

A modern car rental application built with React, Vite, Firebase, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start (Local Development)](#quick-start-local-development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- Browse and filter cars by category
- User authentication with Firebase
- Add/edit/delete car listings (providers)
- Real-time car data from MongoDB
- Responsive design with Tailwind CSS
- Book cars and manage bookings

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, MongoDB
- **Auth:** Firebase Authentication + Admin SDK
- **Deployment:** Netlify (frontend), Vercel (backend)

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 16+
- MongoDB account (Atlas)
- Firebase project
- Git

### Setup

1. **Clone and install**

   ```bash
   git clone <your-repo>
   cd car-rental-platform
   npm install
   cd server && npm install && cd ..
   ```

2. **Create environment files**

   ```bash
   # Frontend (.env.local in root)
   VITE_API_BASE=car-rental-plantform.vercel.app

   # Backend (server/.env)
   DB_USERNAME=your_mongodb_username
   DB_PASSWORD=your_mongodb_password
   FRONTEND_URLS=http://localhost:5173
   PORT=3000
   ```

3. **Add Firebase service account**

   - Copy your Firebase service account JSON to `server/plantKey.json`

4. **Start development servers**

   ```bash
   # Terminal 1: Frontend (from root)
   npm run dev
   # Opens http://localhost:5173

   # Terminal 2: Backend (from root)
   cd server && npm start
   # Runs on car-rental-plantform.vercel.app
   ```

## 🌐 Deployment

### Frontend → Netlify | Backend → Vercel

**The key issue:** Frontend deployed on Netlify needs to know where the backend (Vercel) is located.

**Solution:** Set `VITE_API_BASE` environment variable on Netlify.

👉 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.**

### Quick Checklist

- [ ] Backend deployed on Vercel with env vars (DB_USERNAME, DB_PASSWORD, FRONTEND_URLS)
- [ ] Frontend deployed on Netlify with VITE_API_BASE set to your Vercel URL
- [ ] plantKey.json handled (file or FIREBASE_SERVICE_ACCOUNT env var)
- [ ] CORS configured on backend (FRONTEND_URLS includes Netlify URL)

Run the deployment checker:

```bash
node scripts/deployment-check.js
```

## 🐛 Troubleshooting

### Error: `GET car-rental-plantform.vercel.app/api/cars/top-browse net::ERR_CONNECTION_REFUSED`

→ `VITE_API_BASE` is not set on Netlify. See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

### Error: `Failed to load cars. Please ensure backend server is running on port 3000`

→ Backend is unreachable or database credentials are wrong. Check Vercel logs.

### CORS Error in browser console

→ Add your Netlify URL to `FRONTEND_URLS` on Vercel.

See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting) for detailed fixes.

## 📁 Project Structure

```
├── src/
│   ├── components/      # React components
│   ├── Firebase/        # Firebase config
│   ├── api.js           # API base URL helper (VITE_API_BASE)
│   ├── App.jsx
│   └── main.jsx
├── server/
│   ├── index.js         # Express backend
│   ├── plantKey.json    # Firebase service account (⚠️ don't commit)
│   ├── vercel.json      # Vercel deployment config
│   └── package.json
├── public/              # Static assets
├── .env.example         # Environment variables template
├── .env.local           # Local env vars (git ignored)
├── vite.config.js       # Vite config
├── DEPLOYMENT.md        # Detailed deployment guide
└── package.json
```

## 📖 API Endpoints

| Method | Endpoint               | Auth | Description            |
| ------ | ---------------------- | ---- | ---------------------- |
| GET    | `/api/cars/top-rated`  | No   | Get top-rated cars     |
| GET    | `/api/cars/top-browse` | No   | Get cars for browsing  |
| GET    | `/api/cars/:id`        | No   | Get single car details |
| GET    | `/api/car/my-listings` | Yes  | Get user's listings    |
| POST   | `/api/cars`            | Yes  | Add new car            |
| PUT    | `/api/cars/:id`        | Yes  | Update car             |
| DELETE | `/api/cars/:id`        | Yes  | Delete car             |
| POST   | `/api/cars/:id/book`   | Yes  | Book a car             |

## 🔐 Security Notes

- Never commit `plantKey.json` to Git
- Use environment variables for all secrets
- `FIREBASE_SERVICE_ACCOUNT` recommended for production (Vercel)
- Keep MongoDB credentials safe

## 📞 Support

For issues, check [DEPLOYMENT.md](./DEPLOYMENT.md) or run the deployment checker.
