# Supabase Database Schema Reference

This document contains the complete database schema for 209.works, captured on 2025-01-16.

## Core Tables

### companies
Stores employer company profiles.

```sql
id uuid NOT NULL DEFAULT gen_random_uuid()
clerk_user_id text NOT NULL
name text NOT NULL
logo_url text
description text
website text
location text
size text
industry text
created_at timestamp with time zone NOT NULL DEFAULT now()
```

### jobs
Main job listings table.

```sql
id uuid NOT NULL DEFAULT gen_random_uuid()
company_id uuid NOT NULL
title text NOT NULL
description text
requirements text
salary_min integer
salary_max integer
location text
type text DEFAULT 'full-time'::text
remote boolean DEFAULT false
status text DEFAULT 'draft'::text
created_at timestamp with time zone NOT NULL DEFAULT now()
expires_at timestamp with time zone
```

### applications
Links job seekers to jobs they've applied for.

```sql
id uuid NOT NULL DEFAULT gen_random_uuid()
job_id uuid NOT NULL
applicant_clerk_id text NOT NULL
resume_id uuid
resume_url text
cover_letter text
status text DEFAULT 'pending'::text
created_at timestamp with time zone NOT NULL DEFAULT now()
```

### resumes
Tracks uploaded resume files.

```sql
id uuid NOT NULL DEFAULT gen_random_uuid()
owner_clerk_id text NOT NULL
title text
original_filename text
storage_path text NOT NULL
mime_type text
size_bytes integer
created_at timestamp with time zone NOT NULL DEFAULT now()
```

## Views

### public_jobs
A view that combines jobs with company information for public display.

```sql
id uuid
company_id uuid
title text
description text
requirements text
salary_min integer
salary_max integer
location text
type text
remote boolean
status text
created_at timestamp with time zone
expires_at timestamp with time zone
company_name text
logo_url text
```

## Credit System Tables

### employer_credits
Tracks current credit balance for employers.

```sql
clerk_user_id text NOT NULL
balance integer NOT NULL DEFAULT 0
updated_at timestamp with time zone NOT NULL DEFAULT now()
```

### credit_ledger
Transaction history for credits.

```sql
id uuid NOT NULL DEFAULT gen_random_uuid()
clerk_user_id text NOT NULL
delta integer NOT NULL
reason text NOT NULL
stripe_session_id text
created_at timestamp with time zone NOT NULL DEFAULT now()
```

## Key Relationships

1. **companies** → **jobs**: One company can have many jobs (via company_id)
2. **jobs** → **applications**: One job can have many applications (via job_id)
3. **applications** → **resumes**: Each application can link to a resume (via resume_id)
4. **All tables** use Clerk user IDs (clerk_user_id) to link to authenticated users

## Storage Buckets

The database includes Supabase storage configuration for:
- Resume uploads
- Company logos
- Other file attachments

## Notes for Development

- All IDs use UUID format with auto-generation
- Timestamps use `timestamp with time zone` for proper timezone handling
- The `public_jobs` view is perfect for displaying jobs without needing joins
- Status fields use text enums (e.g., 'draft', 'active', 'expired' for jobs)
- Credit system is designed for pay-per-post model
- All tables integrate with Clerk authentication via clerk_user_id fields

## Mock Data Mapping

When transitioning from mock data to real database:

**Mock Job Object** → **jobs table**:
- id → id
- title → title
- company → company_id (need to join with companies)
- location → location
- type → type
- salary → salary_min/salary_max
- description → description
- requirements → requirements
- postedDate → created_at
- remote → remote

**Mock Application** → **applications table**:
- jobId → job_id
- userId → applicant_clerk_id
- resumeUrl → resume_url
- coverLetter → cover_letter
- status → status
- appliedDate → created_at