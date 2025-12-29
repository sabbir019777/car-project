#!/usr/bin/env node

/**
 * Deployment Checklist Script
 * Run: node scripts/deployment-check.js
 * Verifies all required env vars and configurations
 */

const fs = require("fs");
const path = require("path");

console.log("\n=== CAR RENTAL PLATFORM DEPLOYMENT CHECKLIST ===\n");

const checks = [
  {
    name: "Frontend: .env.local exists",
    check: () => fs.existsSync(".env.local"),
    fix: "Copy .env.example to .env.local and update VITE_API_BASE",
  },
  {
    name: "Backend: server/.env exists",
    check: () => fs.existsSync("server/.env"),
    fix: "Create server/.env with DB_USERNAME, DB_PASSWORD, and FRONTEND_URLS",
  },
  {
    name: "Firebase: plantKey.json exists (OR FIREBASE_SERVICE_ACCOUNT set)",
    check: () =>
      fs.existsSync("server/plantKey.json") ||
      process.env.FIREBASE_SERVICE_ACCOUNT,
    fix: "Place plantKey.json in server/ folder OR set FIREBASE_SERVICE_ACCOUNT env var",
  },
  {
    name: "Git: Repository initialized",
    check: () => fs.existsSync(".git"),
    fix: "Run: git init && git remote add origin <your-repo-url>",
  },
  {
    name: "API helper: src/api.js exists",
    check: () => fs.existsSync("src/api.js"),
    fix: "API helper file should be created (it is)",
  },
  {
    name: "Deployment guide: DEPLOYMENT.md exists",
    check: () => fs.existsSync("DEPLOYMENT.md"),
    fix: "DEPLOYMENT.md should exist for setup instructions",
  },
];

let passed = 0;
let failed = 0;

checks.forEach(({ name, check, fix }) => {
  const result = check();
  const status = result ? "✅" : "❌";
  console.log(`${status} ${name}`);
  if (!result) {
    console.log(`   → Fix: ${fix}`);
    failed++;
  } else {
    passed++;
  }
});

console.log(`\n=== SUMMARY: ${passed}/${checks.length} passed ===\n`);

if (failed === 0) {
  console.log("✅ All checks passed! Ready to deploy.\n");
  console.log("Next steps:");
  console.log("1. Push to Git: git push origin main");
  console.log(
    "2. Set env vars on Vercel (DB_USERNAME, DB_PASSWORD, FRONTEND_URLS)"
  );
  console.log("3. Set env vars on Netlify (VITE_API_BASE)");
  console.log("4. See DEPLOYMENT.md for detailed instructions\n");
} else {
  console.log(`❌ ${failed} check(s) failed. Fix them before deploying.\n`);
}
