# Job Board Master Plan - Clean Architecture

## 🎯 Core Philosophy
**Keep it simple. Ship fast. Add complexity only when users demand it.**

## 📐 System Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Next.js App   │────▶│  API Routes     │────▶│    Supabase     │
│   (Frontend)    │     │  (Backend)      │     │   (Database)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
    ┌─────────┐           ┌─────────┐            ┌─────────┐
    │  Clerk  │           │ Stripe  │            │   S3    │
    │  (Auth) │           │(Payment)│            │(Storage)│
    └─────────┘           └─────────┘            └─────────┘
```

## 🗂️ Simplified Page Structure (20 pages total)

### Public Pages (7)
1. **Home** (`/`) - Search bar + featured jobs
2. **Browse Jobs** (`/jobs`) - List with filters
3. **Job Details** (`/jobs/[id]`) - Full job info
4. **Companies** (`/companies`) - Company directory
5. **Company Profile** (`/companies/[id]`) - Company details
6. **Pricing** (`/pricing`) - Subscription tiers
7. **Contact** (`/contact`) - Support form

### Auth Pages (3)
8. **Login** (`/login`) - Email/Google
9. **Signup** (`/signup`) - Split employer/seeker
10. **Reset Password** (`/reset-password`)

### Job Seeker Pages (4)
11. **Dashboard** (`/dashboard`) - Overview
12. **Applications** (`/applications`) - Track status
13. **Profile** (`/profile`) - Resume/info
14. **Settings** (`/settings`) - Preferences

### Employer Pages (4)
15. **Employer Dashboard** (`/employer`) - Overview
16. **Post Job** (`/employer/post`) - Create listing
17. **Manage Jobs** (`/employer/jobs`) - Edit/view
18. **Applicants** (`/employer/applicants`) - Review

### Admin Pages (2)
19. **Admin Dashboard** (`/admin`) - Metrics
20. **Admin Jobs** (`/admin/jobs`) - Moderation

## 🗄️ Database Schema (5 tables only)

### 1. `users` (managed by Clerk)
```sql
-- Clerk handles this, we just reference clerk_id
```

### 2. `companies`
```sql
id: uuid
clerk_user_id: string (owner)
name: string
logo_url: string
description: text
website: string
location: string
size: string
industry: string
created_at: timestamp
```

### 3. `jobs`
```sql
id: uuid
company_id: uuid (FK)
title: string
description: text
requirements: text
salary_min: integer
salary_max: integer
location: string
type: string (full-time, part-time, etc)
remote: boolean
status: string (active, closed, draft)
created_at: timestamp
expires_at: timestamp
```

### 4. `applications`
```sql
id: uuid
job_id: uuid (FK)
applicant_clerk_id: string
resume_url: string
cover_letter: text
status: string (pending, reviewed, rejected, accepted)
created_at: timestamp
```

### 5. `subscriptions` (managed by Stripe/Clerk)
```sql
-- Clerk Billing handles this
```

## 🔄 Data Flow Patterns

### Job Posting Flow
```
1. Employer logs in → Check subscription
2. Click "Post Job" → Show form
3. Submit form → Create job record
4. Redirect to manage jobs → Show success
```

### Application Flow
```
1. Seeker views job → Show details
2. Click "Apply" → Check if logged in
3. Submit application → Create application record
4. Send email to employer → Show confirmation
```

### Search Flow
```
1. User types in search → Update URL params
2. URL changes → Trigger server fetch
3. Filter database → Return results
4. Display results → Update UI
```

## 🏗️ Component Structure

```
src/
├── app/
│   ├── (public)/          # No auth required
│   │   ├── page.tsx       # Home
│   │   ├── jobs/
│   │   └── companies/
│   ├── (auth)/            # Auth required
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── applications/
│   ├── (employer)/        # Employer only
│   │   └── employer/
│   └── (admin)/           # Admin only
│       └── admin/
├── components/
│   ├── ui/               # Reusable UI
│   ├── forms/            # Form components
│   └── layouts/          # Layout components
├── lib/
│   ├── actions/          # Server actions
│   ├── utils/            # Utilities
│   └── constants/        # Constants
└── types/                # TypeScript types
```

## 🚀 MVP Features Only

### Phase 1 (Week 1) - Core Job Board
- [ ] Home page with search
- [ ] Job listing page
- [ ] Job details page
- [ ] Basic auth (Clerk)
- [ ] Post a job (simple form)
- [ ] Apply to job (simple form)

### Phase 2 (Week 2) - User Features
- [ ] User dashboards
- [ ] Application tracking
- [ ] Company profiles
- [ ] Job management

### Phase 3 (Week 3) - Monetization
- [ ] Stripe integration
- [ ] Subscription limits
- [ ] Featured jobs
- [ ] Email notifications

## 🛠️ Tech Stack (Minimal)

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Clerk (with billing)
- **Payments**: Stripe (via Clerk)
- **Styling**: Tailwind + shadcn/ui
- **Email**: Resend
- **File Storage**: Supabase Storage
- **Deployment**: Vercel

## 📊 State Management Strategy

```typescript
// URL State (Search, Filters)
/jobs?search=developer&location=209&type=remote

// Server State (Database)
- Use React Server Components
- Server Actions for mutations

// Client State (UI only)
- useState for forms
- useOptimistic for instant feedback
```

## 🔐 Security Model

```typescript
// Route Protection
middleware.ts → Check auth → Allow/Redirect

// Data Access
Server Action → Check user role → Query DB → Return data

// API Protection
Rate limiting → Input validation → Auth check → Process
```

## 💡 Key Principles

1. **No Over-Engineering**
   - Start with RSC (React Server Components)
   - Add client components only for interactivity
   - Use Server Actions for all mutations

2. **Database Simplicity**
   - 5 tables maximum for MVP
   - Let Clerk handle users
   - Let Stripe/Clerk handle billing

3. **Feature Flags**
   ```typescript
   const FEATURES = {
     MAGIC_JOB_POST: false,  // Add later
     AI_MATCHING: false,     // Add later
     BULK_UPLOAD: false,     // Add later
   }
   ```

4. **Progressive Enhancement**
   - Works without JavaScript
   - Enhanced with JavaScript
   - Optimal with all features

## 📝 File Naming Conventions

```
/app
  /(public)              # Public routes group
    /jobs
      /page.tsx          # List page
      /[id]/page.tsx     # Details page
  /(auth)                # Authenticated routes
    /dashboard/page.tsx  # User dashboard
  /(employer)            # Employer routes
    /employer/...        # Employer pages
  /api                   # API routes (if needed)
    /webhooks           # Stripe/Clerk webhooks
```

## 🎨 UI Component Patterns

```typescript
// Page Component (Server)
async function JobsPage({ searchParams }) {
  const jobs = await getJobs(searchParams)
  return <JobList jobs={jobs} />
}

// Interactive Component (Client)
'use client'
function ApplyButton({ jobId }) {
  return <button onClick={() => applyToJob(jobId)}>Apply</button>
}

// Form Component (Progressive)
function JobForm() {
  return (
    <form action={createJob}>
      {/* Works without JS */}
    </form>
  )
}
```

## 🚦 Development Workflow

1. **Start Simple**
   - Build pages with static data first
   - Add database queries
   - Add authentication checks
   - Add client interactivity last

2. **Test Flow**
   - Can I post a job?
   - Can I apply to a job?
   - Can I see applications?
   - Does payment work?

3. **Ship Early**
   - Deploy after Phase 1
   - Get user feedback
   - Iterate based on real usage

## ⚡ Performance Goals

- **First Load**: < 3s on 3G
- **Navigation**: < 500ms
- **Search**: < 1s
- **Forms**: Optimistic updates

## 🎯 Success Metrics

1. **Technical**
   - 90+ Lighthouse score
   - < 5% error rate
   - < 2s page load

2. **Business**
   - First job posted in < 5 min
   - First application in < 2 min
   - First payment in < 1 week

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone [new-repo]
cd job-board
npm install

# Environment setup
cp .env.example .env.local
# Add Clerk, Supabase, Stripe keys

# Database setup
npm run db:migrate
npm run db:seed

# Development
npm run dev

# Pre-deployment
npm run type-check
npm run lint
npm run build
```

---

## 🎬 Next Steps

1. Set up Figma with these 20 pages
2. Create component library in Figma
3. Design mobile-first
4. Use this plan with Claude to build
5. Follow API-ENDPOINTS-DESIGN.md for implementation

Remember: **Every feature you don't build is a bug you don't have to fix.**