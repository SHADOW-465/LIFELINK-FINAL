# LifeLink PWA - Setup Instructions

## Overview
LifeLink is a complete, production-ready Progressive Web App (PWA) for blood donation management. This guide will help you set up and run the application.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A Clerk account (for authentication)
- A Convex account (for database)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
cd lifelink-pwa
npm install
```

### 2. Set Up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. In the Clerk dashboard, go to **API Keys**
4. Copy your keys to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 3. Set Up Convex Database

1. Go to [convex.dev](https://convex.dev) and create an account
2. Run the following command to initialize Convex:
   ```bash
   npx convex dev
   ```
3. Follow the prompts to create a new project
4. The command will automatically update your `.env.local` with:
   - `NEXT_PUBLIC_CONVEX_URL`
   - `CONVEX_DEPLOYMENT`

### 4. Configure Clerk-Convex Integration

1. In your Clerk dashboard, go to **JWT Templates**
2. Create a new template called "convex"
3. Copy the **Issuer URL** from the template
4. Add it to `.env.local`:
   ```
   CLERK_JWT_ISSUER_DOMAIN=your-issuer-domain.clerk.accounts.dev
   ```
5. In Convex dashboard, go to **Settings** → **Environment Variables**
6. Add the Clerk JWT Issuer Domain there as well

### 5. Complete Environment Variables

Your `.env.local` should look like this:
```env
# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex Keys
NEXT_PUBLIC_CONVEX_URL=https://xxxxx.convex.cloud
CONVEX_DEPLOYMENT=prod:xxxxx

# Clerk <> Convex Integration
CLERK_JWT_ISSUER_DOMAIN=xxxxx.clerk.accounts.dev
```

### 6. Generate PWA Icons

Replace the placeholder icon files in `public/icons/` with actual PNG images:
- `icon-192x192.png` (192x192 pixels)
- `icon-512x512.png` (512x512 pixels)

You can use tools like [RealFaviconGenerator](https://realfavicongenerator.net/) to generate these.

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 8. Build for Production

```bash
npm run build
npm start
```

## Features

### ✅ Implemented Features

1. **Authentication Flow**
   - Sign up / Sign in with Clerk
   - Automatic user profile creation
   - Onboarding modal for new users

2. **Dashboard**
   - Personalized welcome screen
   - Eligibility banner
   - Emergency blood requests
   - Nearby requests list
   - Community updates

3. **Blood Requests**
   - Create new blood requests
   - View all requests
   - Filter by status (all, my requests, urgent)
   - Search functionality
   - Real-time updates

4. **Schedule**
   - View upcoming blood donation events
   - Event management
   - Quick actions

5. **Profile**
   - User information display
   - Activity history
   - Statistics
   - Achievements

6. **PWA Features**
   - Installable on mobile and desktop
   - Offline support
   - App manifest configured
   - Mobile-optimized UI

### 🔄 User Flow

1. **New User**:
   - Lands on welcome page → Clicks "GET STARTED"
   - Signs up with Clerk
   - Completes onboarding (name, blood type)
   - Redirected to dashboard

2. **Returning User**:
   - Signs in → Dashboard
   - Can view/create requests
   - Can check schedule
   - Can update profile

### 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide Icons
- **Authentication**: Clerk
- **Database**: Convex (real-time, serverless)
- **PWA**: next-pwa
- **Animations**: Framer Motion

## Troubleshooting

### Convex Not Initializing
If `npx convex dev` fails, make sure you're in the `lifelink-pwa` directory and have a stable internet connection.

### Build Errors
If you see "Module not found" errors, make sure all Convex files are generated:
```bash
npx convex dev --once
```

### Authentication Issues
Make sure your Clerk environment variables are correct and the JWT template is properly configured.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables
4. Deploy!

### Other Platforms
Make sure to:
1. Set all environment variables
2. Run `npm run build`
3. Ensure Node.js 18+ is available

## Support

For issues or questions, refer to the documentation:
- [Next.js Docs](https://nextjs.org/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Convex Docs](https://docs.convex.dev)

---

**Built with ❤️ for the blood donation community**

