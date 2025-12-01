# LifeLink - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- A Clerk account (free tier works)
- A Convex account (free tier works)

## Step 1: Install Dependencies (1 min)
```bash
cd lifelink-pwa
npm install
```

## Step 2: Initialize Convex (2 min)
```bash
npx convex dev
```
- Sign in or create a Convex account when prompted
- Select "Create a new project"
- Name it "lifelink" or whatever you prefer
- This will automatically update your `.env.local` file

## Step 3: Set Up Clerk (2 min)

### Create Clerk App
1. Go to https://clerk.com and sign in
2. Click "Add application"
3. Name it "LifeLink"
4. Choose your preferred sign-in methods (Email, Google, etc.)
5. Click "Create application"

### Get API Keys
1. In your Clerk dashboard, go to "API Keys"
2. Copy the keys and add them to `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Create JWT Template
1. In Clerk dashboard, go to "JWT Templates"
2. Click "+ New template"
3. Select "Convex" from the list
4. Copy the "Issuer" URL (looks like `https://xxx.clerk.accounts.dev`)
5. Add to `.env.local`:
```env
CLERK_JWT_ISSUER_DOMAIN=xxx.clerk.accounts.dev
```

### Add to Convex
1. In Convex dashboard, go to "Settings" → "Environment Variables"
2. Add `CLERK_JWT_ISSUER_DOMAIN` with the same value

## Step 4: Run the App!
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Test the Flow
1. Click "GET STARTED" on the landing page
2. Sign up with your email or Google
3. Complete the onboarding form (name + blood type)
4. You'll be redirected to the dashboard
5. Try creating a blood request
6. Navigate through the app using the bottom nav

## Common Issues

### "Module not found: @/convex/_generated/api"
Run `npx convex dev` to generate the Convex files.

### "Invalid Clerk credentials"
Double-check your `.env.local` file has the correct keys from Clerk dashboard.

### Build fails
Make sure Convex is running: `npx convex dev`

## Next Steps
- Replace placeholder icons in `public/icons/`
- Customize the app for your needs
- Deploy to Vercel or your preferred platform

That's it! You now have a fully functional blood donation PWA. 🎉

