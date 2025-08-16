# ✅ Clerk Feature & Plan Setup – Pre-Production Checklist

## 📦 Plan Keys & Pricing

- [ ] **Free** plan created in Clerk (`free`) with correct price $0
- [ ] **Starter** plan created in Clerk (`starter`) with price $129/mo (annual discount if needed)
- [ ] **Standard** plan created in Clerk (`standard`) with price $249/mo
- [ ] **Pro** plan created in Clerk (`pro`) with price $399/mo
- [ ] All plans set to **Publicly available**
- [ ] Each plan has correct **included features** (see below)

---

## 🛠 Feature Keys in Clerk (exact match)
*Verify spelling — these keys must match your code for `has({ feature: ... })` checks*

### Base / Free

- [ ] `email_applicants_only` — Applications directly to your email
- [ ] `basic_employer_dashboard` — Basic Employer Dashboard
- [ ] `buy_credits` — Can buy additional credits for $49 each
- [ ] `credits_never_expire` — Credits never expire

### Starter & Up

- [ ] `in_app_applicant_mgmt` — In-app applicant management
- [ ] `status_tracking` — Application status tracking
- [ ] `analytics_basic` — Basic analytics (views, applies, sources)
- [ ] `custom_questions_5` — Up to 5 screening questions
- [ ] `save_candidate_profiles` — Save candidate profiles (talent pool)
- [ ] `plan_credits_monthly_3` — 3 credits per month

### Standard & Up

- [ ] `ai_copilot` — AI Hiring Copilot (JD drafts, interview Qs, emails, comparisons, best-fit)
- [ ] `ai_applicant_ranking` — AI applicant ranking
- [ ] `job_performance_insights` — Job performance insights + A/B tips
- [ ] `analytics_advanced` — Advanced analytics (funnels, time-to-hire)
- [ ] `exports` — Export apps/analytics as CSV/PDF
- [ ] `plan_credits_monthly_6` — 6 credits per month

### Pro Only

- [ ] `premium_discount_50` — 50% off premium features (Featured = 1 credit, SmartMatch = 1 credit)
- [ ] `api_access` — API access (ATS/HRIS)
- [ ] `talent_pool_search` — Search across past applicants
- [ ] `plan_credits_monthly_12` — 12 credits per month
- [ ] `your_branded_job_page` — Your Branded Job Page
- [ ] `featured_post_discount_50` — Featured Post Discount 50%
- [ ] `smartmatch_discount_50` — SmartMatch Discount 50%

---

## 🔍 Plan → Feature Mapping Check

- [ ] Free has only **Free tier features**
- [ ] Starter includes Free + Starter features (no Standard/Pro exclusives)
- [ ] Standard includes Starter + Standard features (no Pro exclusives)
- [ ] Pro includes Standard + Pro features

---

## ⚡ Functionality Testing

- [ ] `<PricingTable />` shows all plans & features correctly
- [ ] `<UserProfile />` allows upgrade/downgrade between all plans
- [ ] `has({ feature: ... })` returns `true`/`false` correctly for each plan
- [ ] Supabase credit system grants correct monthly credits (`+3`, `+6`, `+12`)
- [ ] Free users can buy **+1** and **+5** top-ups and see balance update
- [ ] Credits never expire on cancel/downgrade

---

## 🚀 Go-Live Safety

- [ ] All plan & feature descriptions are final and typo-free
- [ ] Test user accounts for **Free**, **Starter**, **Standard**, **Pro** exist for QA
- [ ] Stripe products/prices linked to Clerk plans are live & tested
- [ ] Webhooks for subscription start/renewal + top-ups fully tested in staging

---

## 📂 Implementation Folders Checklist

### Core Directories
- [x] `/app` - Next.js app directory
- [x] `/components` - React components
- [x] `/components/ui` - shadcn/ui components
- [x] `/types` - TypeScript type definitions
- [x] `/constants` - App constants and routes
- [x] `/data` - Mock data and static content
- [x] `/utils` - Utility functions
- [x] `/hooks` - Custom React hooks

### Feature-Specific Directories (To Create)
- [ ] `/app/api` - API routes
- [ ] `/app/api/webhooks` - Webhook handlers
- [ ] `/app/api/credits` - Credit management endpoints
- [ ] `/app/api/jobs` - Job posting endpoints
- [ ] `/app/api/applications` - Application management
- [ ] `/app/api/analytics` - Analytics endpoints
- [ ] `/app/api/ai` - AI features endpoints

### Page Routes (To Implement)
- [x] `/app/jobs` - Browse jobs page
- [x] `/app/dashboard` - User dashboard
- [ ] `/app/employer` - Employer dashboard
- [ ] `/app/employer/post` - Post a job
- [ ] `/app/employer/jobs` - Manage jobs
- [ ] `/app/employer/applicants` - Manage applicants
- [ ] `/app/employer/analytics` - View analytics
- [ ] `/app/employer/talent-pool` - Saved candidates
- [ ] `/app/profile` - User profile
- [ ] `/app/settings` - User settings
- [ ] `/app/pricing` - Pricing page
- [ ] `/app/credits` - Buy credits page
- [ ] `/app/applications` - Job seeker applications

### Database/Supabase Tables (To Create)
- [ ] `profiles` - Extended user profiles
- [ ] `jobs` - Job postings
- [ ] `applications` - Job applications
- [ ] `credits` - Credit transactions
- [ ] `analytics` - Job/application analytics
- [ ] `saved_candidates` - Talent pool
- [ ] `custom_questions` - Employer screening questions
- [ ] `ai_rankings` - AI-generated rankings
- [ ] `subscriptions` - Subscription history

### Integration Files (To Create)
- [ ] `/lib/supabase.ts` - Supabase client
- [ ] `/lib/clerk-features.ts` - Feature checking utilities
- [ ] `/lib/credits.ts` - Credit management logic
- [ ] `/lib/ai.ts` - AI integration (OpenAI/Anthropic)
- [ ] `/lib/analytics.ts` - Analytics tracking
- [ ] `/lib/email.ts` - Email notifications (Resend)

---

## 📝 Notes

- Update this checklist as features are implemented
- Check off items when they're fully tested and working
- Add new items if additional features are discovered
- Use this as the single source of truth for feature completion

---

## 🔧 Quick Testing Script

```typescript
// Add to /scripts/audit-features.ts
import { auth } from '@clerk/nextjs/server';

export async function auditUserFeatures() {
  const { has } = await auth();
  
  const features = [
    'email_applicants_only',
    'basic_employer_dashboard',
    'buy_credits',
    'credits_never_expire',
    'in_app_applicant_mgmt',
    'status_tracking',
    'analytics_basic',
    'custom_questions_5',
    'save_candidate_profiles',
    'plan_credits_monthly_3',
    'ai_copilot',
    'ai_applicant_ranking',
    'job_performance_insights',
    'analytics_advanced',
    'exports',
    'plan_credits_monthly_6',
    'premium_discount_50',
    'api_access',
    'talent_pool_search',
    'plan_credits_monthly_12',
    'your_branded_job_page',
    'featured_post_discount_50',
    'smartmatch_discount_50'
  ];
  
  console.log('User Feature Audit:');
  for (const feature of features) {
    const hasFeature = await has({ feature });
    console.log(`${feature}: ${hasFeature ? '✅' : '❌'}`);
  }
}
```