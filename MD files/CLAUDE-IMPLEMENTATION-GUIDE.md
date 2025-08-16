# Claude Implementation Guide - Building Your Job Board

## 🚀 How to Use These Plans with Claude

### Step 1: Project Setup (30 minutes)
```bash
# Start fresh with Claude
"Create a new Next.js 14 job board app with:
- App router
- TypeScript  
- Tailwind CSS
- shadcn/ui
- Clerk auth
- Supabase database
- Server actions

Follow JOBBOARD-MASTER-PLAN.md for structure"
```

### Step 2: Database Setup (20 minutes)
```
"Set up Supabase with these 5 tables from JOBBOARD-MASTER-PLAN.md:
- companies
- jobs  
- applications
- (users handled by Clerk)
- (subscriptions handled by Clerk Billing)

Create the migration files and types"
```

### Step 3: Build Pages in Order (2-3 days)

#### Day 1: Public Pages
```
Morning:
"Build the home page with:
- Hero section with search bar
- Featured jobs section (hardcoded for now)
- How it works section
- CTA to post jobs"

"Build the jobs browse page following API-ENDPOINTS-DESIGN.md:
- Server component fetching jobs
- Search and filters in URL params
- Pagination
- Job cards with key info"

Afternoon:
"Build job details page:
- Full job information
- Company sidebar
- Apply button (disabled if not logged in)
- Related jobs section"

"Build companies directory:
- List all companies
- Search/filter
- Link to company profiles"
```

#### Day 2: Auth & User Pages
```
Morning:
"Implement Clerk authentication:
- Sign in/up pages
- Middleware for protected routes
- User button in navbar
- Role-based redirects (employer vs seeker)"

"Build job seeker dashboard:
- Applications overview
- Saved jobs
- Profile completion prompt
- Recent searches"

Afternoon:
"Build employer dashboard:
- Active jobs list
- Recent applicants
- Posting credits remaining
- Quick stats (views, applications)"

"Build job posting form:
- Multi-step if needed
- Rich text editor for description
- Salary range optional
- Preview before submit"
```

#### Day 3: Applications & Payments
```
Morning:
"Build application flow:
- Application form (resume upload + cover letter)
- Confirmation page
- Application tracking page
- Status updates"

"Build employer applicant view:
- List applications by job
- Filter by status
- Bulk actions
- Download resumes"

Afternoon:
"Integrate Clerk Billing:
- Pricing page
- Subscription management
- Feature gates (job posting limits)
- Usage tracking"
```

### Step 4: Polish & Deploy (1 day)
```
"Add these finishing touches:
- Loading states
- Error boundaries
- Empty states
- Mobile responsive fixes
- Meta tags for SEO"

"Deploy to Vercel:
- Environment variables
- Database migrations
- Domain setup
- Monitoring setup"
```

## 🎯 Key Prompts for Claude

### For Server Components:
```
"Build a server component for [page] that:
- Fetches data using Supabase
- Handles loading/error states
- Uses suspense boundaries
- Follows the pattern in API-ENDPOINTS-DESIGN.md"
```

### For Server Actions:
```
"Create a server action for [action] that:
- Validates input with Zod
- Checks authentication
- Verifies permissions
- Updates database
- Revalidates cache
- Handles errors gracefully"
```

### For Client Components:
```
"Build a client component for [feature] that:
- Only handles interactivity
- Uses server actions for mutations
- Shows optimistic updates
- Has proper loading states"
```

## 🚫 What NOT to Ask Claude

Don't ask for:
- Complex state management (use URL + server state)
- Client-side data fetching (use server components)
- Custom auth (use Clerk)
- Custom payments (use Clerk Billing)
- Complex routing (use file-based)

## 📝 Testing Each Feature

After building each feature, test:
1. **Can a visitor browse jobs?**
2. **Can they search and filter?**
3. **Can they sign up easily?**
4. **Can employers post jobs?**
5. **Can seekers apply?**
6. **Do payments work?**
7. **Are limits enforced?**

## 🎨 Figma to Code Process

```
1. Design component in Figma
2. Export colors/spacing to Tailwind config
3. Ask Claude: "Build this component matching the Figma design"
4. Provide screenshots or Figma specs
5. Iterate on responsiveness
```

## ⚡ Speed Tips

1. **Use shadcn/ui components**
   ```
   "Add a data table for jobs using shadcn/ui table component"
   ```

2. **Copy patterns**
   ```
   "Create an applications page similar to the jobs page pattern"
   ```

3. **Batch related features**
   ```
   "Build all employer pages following the same layout pattern"
   ```

## 🐛 Common Issues & Fixes

### "Type errors with Supabase"
```
"Generate TypeScript types from Supabase schema and update the database types"
```

### "Clerk auth not working"
```
"Check middleware.ts matches protected routes and environment variables are set"
```

### "Server actions failing"
```
"Add proper error handling and ensure 'use server' directive is at the top"
```

### "Slow performance"
```
"Convert client components to server components where possible and add Suspense boundaries"
```

## 📊 Progress Tracking

Create a `PROGRESS.md` file:
```markdown
# Implementation Progress

## Phase 1: Core Pages
- [x] Home page
- [x] Jobs browse
- [ ] Job details
- [ ] Company pages

## Phase 2: Auth & Users  
- [ ] Clerk setup
- [ ] User dashboards
- [ ] Protected routes

## Phase 3: Features
- [ ] Job posting
- [ ] Applications
- [ ] Search/filters

## Phase 4: Monetization
- [ ] Clerk Billing
- [ ] Feature limits
- [ ] Subscription management
```

## 🚀 Launch Checklist

Before going live:
- [ ] All pages responsive
- [ ] Forms validated
- [ ] Errors handled gracefully
- [ ] Payment flow tested
- [ ] Emails sending
- [ ] SEO meta tags added
- [ ] Analytics installed
- [ ] Error tracking setup
- [ ] Database backed up
- [ ] Environment variables secured

---

Remember: Start simple, ship fast, iterate based on user feedback. You can build this in 3-4 days with focused effort!