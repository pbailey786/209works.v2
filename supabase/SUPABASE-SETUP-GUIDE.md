# 209Works - Supabase Setup Guide

## Overview

This guide documents the complete Supabase setup for 209Works, including:
- Database schema with Clerk integration
- Row Level Security (RLS) policies
- Storage buckets for resumes and company logos
- Credit system implementation
- TypeScript utilities and API routes

## Database Schema

### Core Tables

#### 1. Companies Table
```sql
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_clerk_id text not null,
  name text not null,
  description text,
  website text,
  logo_url text,
  location text,
  size text check (size in ('1-10', '11-50', '51-200', '201-500', '500+')),
  industry text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for owner lookups
create index idx_companies_owner on public.companies(owner_clerk_id);
-- Index for company name search
create index idx_companies_name_trgm on public.companies using gin (name gin_trgm_ops);
```

#### 2. Jobs Table
```sql
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  description text not null,
  location text not null,
  location_type text not null check (location_type in ('remote', 'hybrid', 'onsite')),
  salary_min integer,
  salary_max integer,
  currency text default 'USD',
  type text not null check (type in ('full-time', 'part-time', 'contract', 'internship')),
  experience_level text check (experience_level in ('entry', 'mid', 'senior', 'lead', 'executive')),
  skills text[],
  requirements text[],
  benefits text[],
  application_deadline timestamptz,
  is_active boolean default true,
  posted_by_clerk_id text not null,
  featured boolean default false,
  smartmatch boolean default false,
  views_count integer default 0,
  applications_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for job queries
create index idx_jobs_company on public.jobs(company_id);
create index idx_jobs_active on public.jobs(is_active, created_at desc);
create index idx_jobs_location on public.jobs(location);
create index idx_jobs_title_trgm on public.jobs using gin (title gin_trgm_ops);
```

#### 3. Resumes Table
```sql
create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  owner_clerk_id text not null,
  title text not null,
  original_filename text not null,
  storage_path text not null unique,
  mime_type text,
  size_bytes bigint,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_resumes_owner on public.resumes(owner_clerk_id);
```

#### 4. Applications Table
```sql
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  applicant_clerk_id text not null,
  resume_id uuid references public.resumes(id),
  cover_letter text,
  status text default 'pending' check (status in ('pending', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  custom_answers jsonb,
  ai_score numeric(3,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_applications_job on public.applications(job_id);
create index idx_applications_applicant on public.applications(applicant_clerk_id);
create unique index idx_applications_unique on public.applications(job_id, applicant_clerk_id);
```

#### 5. Credit System Tables
```sql
-- Current balance table
create table public.employer_credits (
  clerk_user_id text primary key,
  balance integer not null default 0,
  updated_at timestamptz default now()
);

-- Transaction ledger
create table public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  delta integer not null,
  reason text not null,
  stripe_session_id text,
  job_id uuid references public.jobs(id),
  created_at timestamptz default now()
);

create index idx_credit_ledger_user on public.credit_ledger(clerk_user_id);
create index idx_credit_ledger_created on public.credit_ledger(created_at desc);
```

### RPC Functions

#### Atomic Credit Update Function
```sql
create or replace function update_credit_balance(
  p_clerk_user_id text,
  p_delta integer
) returns void as $$
begin
  insert into public.employer_credits (clerk_user_id, balance)
  values (p_clerk_user_id, greatest(0, p_delta))
  on conflict (clerk_user_id)
  do update set 
    balance = greatest(0, employer_credits.balance + p_delta),
    updated_at = now();
end;
$$ language plpgsql;
```

## Row Level Security (RLS) Policies

### Enable RLS on all tables
```sql
alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.resumes enable row level security;
alter table public.applications enable row level security;
alter table public.employer_credits enable row level security;
alter table public.credit_ledger enable row level security;
```

### Companies Policies
```sql
-- Owners can do everything with their companies
create policy "companies_owner_all" on public.companies
  for all using (auth.jwt() ->> 'sub' = owner_clerk_id);

-- Public can read all companies
create policy "companies_public_read" on public.companies
  for select using (true);
```

### Jobs Policies
```sql
-- Public can read active jobs
create policy "jobs_public_read" on public.jobs
  for select using (is_active = true);

-- Company owners can manage their jobs
create policy "jobs_owner_all" on public.jobs
  for all using (
    exists (
      select 1 from public.companies
      where companies.id = jobs.company_id
      and companies.owner_clerk_id = auth.jwt() ->> 'sub'
    )
  );
```

### Applications Policies
```sql
-- Applicants can manage their own applications
create policy "applications_applicant_all" on public.applications
  for all using (auth.jwt() ->> 'sub' = applicant_clerk_id);

-- Company owners can view applications to their jobs
create policy "applications_employer_read" on public.applications
  for select using (
    exists (
      select 1 from public.jobs
      join public.companies on companies.id = jobs.company_id
      where jobs.id = applications.job_id
      and companies.owner_clerk_id = auth.jwt() ->> 'sub'
    )
  );
```

### Resumes Policies
```sql
-- Owners can manage their resumes
create policy "resumes_owner_all" on public.resumes
  for all using (auth.jwt() ->> 'sub' = owner_clerk_id);

-- Employers can view resumes linked to applications
create policy "resumes_employer_read" on public.resumes
  for select using (
    exists (
      select 1 from public.applications
      join public.jobs on jobs.id = applications.job_id
      join public.companies on companies.id = jobs.company_id
      where applications.resume_id = resumes.id
      and companies.owner_clerk_id = auth.jwt() ->> 'sub'
    )
  );
```

### Credits Policies
```sql
-- Users can view their own balance
create policy "credits_owner_read" on public.employer_credits
  for select using (auth.jwt() ->> 'sub' = clerk_user_id);

-- Users can view their own ledger
create policy "ledger_owner_read" on public.credit_ledger
  for select using (auth.jwt() ->> 'sub' = clerk_user_id);
```

## Storage Setup

### Create Buckets
```sql
-- In Supabase Dashboard > Storage
-- Create two buckets:
-- 1. resumes (private)
-- 2. company_logos (public or private based on preference)
```

### Storage Policies

#### Resume Bucket Policies
```sql
-- Owners can upload/manage their resumes
create policy "resumes_owner_all" on storage.objects
  for all using (
    bucket_id = 'resumes' 
    and auth.jwt() ->> 'sub' = split_part(name, '/', 2)
  );

-- Employers can read resumes linked to their job applications
create policy "resumes_employer_read" on storage.objects
  for select using (
    bucket_id = 'resumes'
    and exists (
      select 1 from public.resumes
      join public.applications on applications.resume_id = resumes.id
      join public.jobs on jobs.id = applications.job_id
      join public.companies on companies.id = jobs.company_id
      where resumes.storage_path = storage.objects.name
      and companies.owner_clerk_id = auth.jwt() ->> 'sub'
    )
  );
```

#### Company Logo Policies (if private bucket)
```sql
-- Owners can manage their logos
create policy "logos_owner_all" on storage.objects
  for all using (
    bucket_id = 'company_logos'
    and auth.jwt() ->> 'sub' = split_part(name, '/', 2)
  );

-- Public can read all logos
create policy "logos_public_read" on storage.objects
  for select using (bucket_id = 'company_logos');
```

## TypeScript Implementation

### Update lib/credits.ts
```typescript
import { createClient } from '@supabase/supabase-js';

// Service-role client for webhooks/cron (bypasses RLS)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getCreditsBalance(clerkUserId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('employer_credits')
    .select('balance')
    .eq('clerk_user_id', clerkUserId)
    .single();
  
  if (error || !data) return 0;
  return data.balance;
}

export async function adjustCredits(
  clerkUserId: string,
  delta: number,
  reason: string,
  stripeSessionId?: string,
  jobId?: string
) {
  // Add to ledger first (audit trail)
  const { error: ledgerErr } = await supabaseAdmin
    .from('credit_ledger')
    .insert({
      clerk_user_id: clerkUserId,
      delta,
      reason,
      stripe_session_id: stripeSessionId,
      job_id: jobId
    });
  
  if (ledgerErr) throw ledgerErr;

  // Atomic balance update
  const { error: rpcErr } = await supabaseAdmin.rpc('update_credit_balance', {
    p_clerk_user_id: clerkUserId,
    p_delta: delta
  });
  
  if (rpcErr) throw rpcErr;
}

export async function grantMonthlyCreditsIfDue(
  clerkUserId: string,
  monthlyAmount: number
) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Check if already granted this month
  const { data } = await supabaseAdmin
    .from('credit_ledger')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .eq('reason', `monthly_grant_${monthlyAmount}`)
    .gte('created_at', startOfMonth.toISOString())
    .maybeSingle();

  if (!data) {
    await adjustCredits(
      clerkUserId, 
      monthlyAmount, 
      `monthly_grant_${monthlyAmount}`
    );
  }
}
```

### Create lib/supabaseClient.ts
```typescript
import { createClient } from '@supabase/supabase-js';

// Client that forwards Clerk auth for RLS
export function supabaseWithAuth(authorization?: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      global: { 
        headers: authorization ? { Authorization: authorization } : {} 
      } 
    }
  );
}
```

## API Routes Examples

### Resume Upload Route
```typescript
// app/api/resumes/upload/route.ts
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const title = formData.get('title') as string || 'Resume';

  if (!file) {
    return new Response('No file provided', { status: 400 });
  }

  const supabase = supabaseWithAuth(req.headers.get('authorization') || undefined);
  
  const fileExt = file.name.split('.').pop() || 'pdf';
  const objectName = `resumes/${userId}/${crypto.randomUUID()}.${fileExt}`;
  
  const bytes = await file.arrayBuffer();

  // Upload to storage
  const { error: uploadErr } = await supabase.storage
    .from('resumes')
    .upload(objectName, bytes, {
      contentType: file.type,
      upsert: false
    });

  if (uploadErr) {
    return new Response(uploadErr.message, { status: 400 });
  }

  // Create database record
  const { data, error: insertErr } = await supabase
    .from('resumes')
    .insert({
      owner_clerk_id: userId,
      title,
      original_filename: file.name,
      storage_path: objectName,
      mime_type: file.type,
      size_bytes: file.size
    })
    .select()
    .single();

  if (insertErr) {
    return new Response(insertErr.message, { status: 400 });
  }

  return Response.json(data);
}
```

### Job Posting Route (with credit check)
```typescript
// app/api/jobs/create/route.ts
import { auth } from '@clerk/nextjs/server';
import { getCreditsBalance, adjustCredits } from '@/lib/credits';
import { supabaseWithAuth } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  // Check credits
  const balance = await getCreditsBalance(userId);
  if (balance < 1) {
    return new Response('Insufficient credits', { status: 402 });
  }

  const jobData = await req.json();
  const supabase = supabaseWithAuth(req.headers.get('authorization') || undefined);

  // Create job
  const { data: job, error } = await supabase
    .from('jobs')
    .insert({
      ...jobData,
      posted_by_clerk_id: userId
    })
    .select()
    .single();

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  // Deduct credit
  await adjustCredits(userId, -1, 'job_post', undefined, job.id);

  return Response.json(job);
}
```

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_TOPUP_1=price_...
STRIPE_PRICE_TOPUP_5=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Checklist

- [ ] Enable pgcrypto extension in Supabase
- [ ] Enable pg_trgm extension for text search
- [ ] Create all tables in order (companies → jobs → resumes → applications → credits)
- [ ] Create RPC functions
- [ ] Enable RLS on all tables
- [ ] Create all RLS policies
- [ ] Create storage buckets (resumes, company_logos)
- [ ] Apply storage policies
- [ ] Test with sample data

## Testing Guide

1. **Test Company Creation**
   - Create company as user A
   - Verify user A can read/update
   - Verify user B can read but not update

2. **Test Job Posting**
   - Check credit balance
   - Post job (should deduct 1 credit)
   - Verify public can see active job
   - Verify only owner can edit

3. **Test Resume Upload**
   - Upload as job seeker
   - Apply to job with resume
   - Verify employer can access resume
   - Verify other users cannot

4. **Test Credit System**
   - Run top-up flow
   - Verify webhook adds credits
   - Test monthly grant function
   - Ensure atomic updates work

## Common Issues & Solutions

1. **"relation does not exist"** - Create tables before indexes
2. **RLS blocking access** - Check JWT is being forwarded correctly
3. **Storage upload fails** - Verify bucket exists and policies are correct
4. **Credits not updating** - Check RPC function and service role key

## Future Improvements

- Add database triggers for updated_at timestamps
- Create views for common queries (active jobs, etc.)
- Add full-text search indexes
- Implement soft deletes
- Add database functions for complex operations