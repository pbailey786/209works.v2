# API Endpoints Design - Job Board

## 🏗️ API Architecture

All endpoints follow REST principles with Server Actions for mutations.

```
GET    → Fetch data (Server Components)
POST   → Create data (Server Actions)  
PUT    → Update data (Server Actions)
DELETE → Delete data (Server Actions)
```

## 📍 Endpoint Structure

### 🔐 Authentication Endpoints (Handled by Clerk)

```typescript
// Clerk handles these automatically:
POST   /api/auth/signin
POST   /api/auth/signup  
POST   /api/auth/signout
POST   /api/auth/reset-password
GET    /api/auth/user
```

### 📋 Job Endpoints

#### 1. **GET /api/jobs - List all jobs**
```typescript
// URL: /jobs?search=developer&location=209&type=remote&page=1

// Server Component (app/jobs/page.tsx)
async function JobsPage({ searchParams }) {
  // Extract filters
  const filters = {
    search: searchParams.search || '',
    location: searchParams.location || '',
    type: searchParams.type || '',
    page: parseInt(searchParams.page) || 1,
    limit: 20
  }
  
  // Build query
  let query = supabase
    .from('jobs')
    .select('*, companies(*)')
    .eq('status', 'active')
    .gte('expires_at', new Date().toISOString())
  
  // Apply filters
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  if (filters.location) {
    query = query.eq('location', filters.location)
  }
  if (filters.type) {
    query = query.eq('type', filters.type)
  }
  
  // Pagination
  const start = (filters.page - 1) * filters.limit
  query = query.range(start, start + filters.limit - 1)
  
  const { data: jobs, count } = await query
  
  return <JobList jobs={jobs} totalCount={count} filters={filters} />
}
```

#### 2. **GET /api/jobs/[id] - Get single job**
```typescript
// Server Component (app/jobs/[id]/page.tsx)
async function JobDetailsPage({ params }) {
  const { data: job } = await supabase
    .from('jobs')
    .select(`
      *,
      companies(*),
      applications(count)
    `)
    .eq('id', params.id)
    .single()
  
  if (!job) notFound()
  
  // Track view (optional)
  await supabase.rpc('increment_job_views', { job_id: params.id })
  
  return <JobDetails job={job} />
}
```

#### 3. **POST /api/jobs - Create job**
```typescript
// Server Action (app/actions/job-actions.ts)
'use server'

export async function createJob(formData: FormData) {
  // Auth check
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')
  
  // Check subscription
  const canPost = await checkJobPostingLimit(userId)
  if (!canPost) {
    redirect('/pricing?reason=limit_reached')
  }
  
  // Validate input
  const validatedData = jobSchema.parse({
    title: formData.get('title'),
    description: formData.get('description'),
    requirements: formData.get('requirements'),
    salary_min: parseInt(formData.get('salary_min')),
    salary_max: parseInt(formData.get('salary_max')),
    location: formData.get('location'),
    type: formData.get('type'),
    remote: formData.get('remote') === 'true'
  })
  
  // Get company
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()
  
  // Create job
  const { data: job, error } = await supabase
    .from('jobs')
    .insert({
      ...validatedData,
      company_id: company.id,
      status: 'active',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    })
    .select()
    .single()
  
  if (error) throw error
  
  // Send confirmation email
  await sendEmail({
    to: user.email,
    subject: 'Job Posted Successfully',
    template: 'job-posted',
    data: { job }
  })
  
  revalidatePath('/jobs')
  redirect(`/jobs/${job.id}`)
}
```

#### 4. **PUT /api/jobs/[id] - Update job**
```typescript
// Server Action
export async function updateJob(jobId: string, formData: FormData) {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')
  
  // Check ownership
  const { data: job } = await supabase
    .from('jobs')
    .select('company_id, companies(clerk_user_id)')
    .eq('id', jobId)
    .single()
  
  if (job.companies.clerk_user_id !== userId) {
    throw new Error('Unauthorized')
  }
  
  // Update job
  const { error } = await supabase
    .from('jobs')
    .update(validatedData)
    .eq('id', jobId)
  
  if (error) throw error
  
  revalidatePath(`/jobs/${jobId}`)
  revalidatePath('/employer/jobs')
}
```

#### 5. **DELETE /api/jobs/[id] - Delete job**
```typescript
// Server Action
export async function deleteJob(jobId: string) {
  const { userId } = auth()
  // ... ownership check ...
  
  await supabase
    .from('jobs')
    .update({ status: 'closed' })
    .eq('id', jobId)
  
  revalidatePath('/employer/jobs')
}
```

### 💼 Application Endpoints

#### 1. **POST /api/applications - Apply to job**
```typescript
// Server Action
export async function applyToJob(jobId: string, formData: FormData) {
  const { userId } = auth()
  if (!userId) throw new Error('Please login to apply')
  
  // Check if already applied
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('applicant_clerk_id', userId)
    .single()
  
  if (existing) {
    throw new Error('Already applied to this job')
  }
  
  // Upload resume if provided
  let resumeUrl = null
  const resumeFile = formData.get('resume') as File
  if (resumeFile) {
    const { data } = await supabase.storage
      .from('resumes')
      .upload(`${userId}/${jobId}/${resumeFile.name}`, resumeFile)
    resumeUrl = data.path
  }
  
  // Create application
  const { data: application } = await supabase
    .from('applications')
    .insert({
      job_id: jobId,
      applicant_clerk_id: userId,
      resume_url: resumeUrl,
      cover_letter: formData.get('cover_letter'),
      status: 'pending'
    })
    .select()
    .single()
  
  // Notify employer
  await sendApplicationNotification(application)
  
  redirect('/applications?success=true')
}
```

#### 2. **GET /api/applications - List user's applications**
```typescript
// Server Component
async function ApplicationsPage() {
  const { userId } = auth()
  
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      jobs(*, companies(*))
    `)
    .eq('applicant_clerk_id', userId)
    .order('created_at', { ascending: false })
  
  return <ApplicationsList applications={applications} />
}
```

#### 3. **PUT /api/applications/[id] - Update application status**
```typescript
// Server Action (Employer only)
export async function updateApplicationStatus(
  applicationId: string, 
  status: 'reviewed' | 'rejected' | 'accepted'
) {
  const { userId } = auth()
  
  // Verify employer owns the job
  const { data: application } = await supabase
    .from('applications')
    .select('jobs(companies(clerk_user_id))')
    .eq('id', applicationId)
    .single()
  
  if (application.jobs.companies.clerk_user_id !== userId) {
    throw new Error('Unauthorized')
  }
  
  // Update status
  await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId)
  
  // Notify applicant
  await sendStatusUpdateEmail(applicationId, status)
  
  revalidatePath('/employer/applicants')
}
```

### 🏢 Company Endpoints

#### 1. **POST /api/companies - Create company profile**
```typescript
// Server Action
export async function createCompany(formData: FormData) {
  const { userId } = auth()
  
  // Check if company exists
  const { data: existing } = await supabase
    .from('companies')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()
  
  if (existing) {
    return updateCompany(existing.id, formData)
  }
  
  // Upload logo
  let logoUrl = null
  const logoFile = formData.get('logo') as File
  if (logoFile) {
    const { data } = await supabase.storage
      .from('logos')
      .upload(`${userId}/${logoFile.name}`, logoFile)
    logoUrl = data.path
  }
  
  // Create company
  const { data: company } = await supabase
    .from('companies')
    .insert({
      clerk_user_id: userId,
      name: formData.get('name'),
      description: formData.get('description'),
      website: formData.get('website'),
      location: formData.get('location'),
      size: formData.get('size'),
      industry: formData.get('industry'),
      logo_url: logoUrl
    })
    .select()
    .single()
  
  redirect(`/companies/${company.id}`)
}
```

### 🔍 Search Endpoints

#### 1. **GET /api/search - Global search**
```typescript
// Server Component with streaming
async function SearchResults({ query }: { query: string }) {
  // Search jobs
  const jobsPromise = supabase
    .from('jobs')
    .select('id, title, companies(name)')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(5)
  
  // Search companies
  const companiesPromise = supabase
    .from('companies')
    .select('id, name, industry')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(5)
  
  return (
    <>
      <Suspense fallback={<SearchSkeleton />}>
        <JobSearchResults promise={jobsPromise} />
      </Suspense>
      <Suspense fallback={<SearchSkeleton />}>
        <CompanySearchResults promise={companiesPromise} />
      </Suspense>
    </>
  )
}
```

### 📊 Analytics Endpoints (Employer)

#### 1. **GET /api/analytics/jobs - Job performance**
```typescript
// Server Component
async function JobAnalytics() {
  const { userId } = auth()
  
  const { data: analytics } = await supabase
    .rpc('get_job_analytics', { employer_id: userId })
  
  // Returns: views, applications, conversion rate
  return <AnalyticsDashboard data={analytics} />
}
```

### 🪝 Webhook Endpoints

#### 1. **POST /api/webhooks/clerk - User events**
```typescript
// Route Handler (app/api/webhooks/clerk/route.ts)
export async function POST(req: Request) {
  const payload = await req.json()
  const headers = req.headers
  
  // Verify webhook signature
  const svix_id = headers.get("svix-id")
  const svix_timestamp = headers.get("svix-timestamp")
  const svix_signature = headers.get("svix-signature")
  
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
  const evt = wh.verify(payload, {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  })
  
  // Handle events
  switch (evt.type) {
    case 'user.created':
      // Create user profile
      await createUserProfile(evt.data)
      break
    case 'user.deleted':
      // Cleanup user data
      await cleanupUserData(evt.data.id)
      break
  }
  
  return new Response('OK', { status: 200 })
}
```

#### 2. **POST /api/webhooks/stripe - Payment events**
```typescript
// Route Handler
export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  )
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Activate subscription
      await activateSubscription(event.data.object)
      break
    case 'invoice.payment_failed':
      // Handle failed payment
      await handleFailedPayment(event.data.object)
      break
  }
  
  return new Response('OK', { status: 200 })
}
```

## 🔄 Data Flow Examples

### Job Posting Flow
```
1. User fills form → 
2. Server Action validates → 
3. Check subscription limits →
4. Insert to database →
5. Send email →
6. Revalidate cache →
7. Redirect to job page
```

### Application Flow
```
1. User clicks Apply →
2. Check if logged in →
3. Show application form →
4. Upload resume to storage →
5. Create application record →
6. Send email to employer →
7. Show success message
```

### Search Flow
```
1. User types in search →
2. Debounce input (300ms) →
3. Update URL params →
4. Server component re-renders →
5. Fetch filtered results →
6. Stream results to UI
```

## 🛡️ Security Patterns

### Authentication Check
```typescript
// Every protected action
const { userId } = auth()
if (!userId) throw new Error('Unauthorized')
```

### Authorization Check
```typescript
// Verify ownership
const isOwner = await verifyOwnership(userId, resourceId)
if (!isOwner) throw new Error('Forbidden')
```

### Rate Limiting
```typescript
// Using Upstash
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})

const { success } = await ratelimit.limit(userId)
if (!success) throw new Error('Rate limit exceeded')
```

### Input Validation
```typescript
// Using Zod
const schema = z.object({
  title: z.string().min(3).max(100),
  salary_min: z.number().min(0),
  email: z.string().email()
})

const validated = schema.parse(input)
```

## 🚀 Performance Optimizations

### 1. **Parallel Data Fetching**
```typescript
const [jobs, companies, stats] = await Promise.all([
  getJobs(),
  getCompanies(),
  getStats()
])
```

### 2. **Streaming Responses**
```typescript
// Stream large lists
return new Response(
  new ReadableStream({
    async start(controller) {
      for await (const chunk of fetchJobsInChunks()) {
        controller.enqueue(chunk)
      }
      controller.close()
    }
  })
)
```

### 3. **Optimistic Updates**
```typescript
// Client component
const [optimisticJobs, setOptimisticJobs] = useOptimistic(jobs)

async function handleDelete(id) {
  setOptimisticJobs(jobs.filter(j => j.id !== id))
  await deleteJob(id)
}
```

### 4. **Edge Caching**
```typescript
export const revalidate = 3600 // Cache for 1 hour
export const dynamic = 'force-static' // For static pages
```

## 📝 Error Handling

```typescript
// Consistent error format
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400
  ) {
    super(message)
  }
}

// Usage
throw new AppError('Job not found', 'JOB_NOT_FOUND', 404)

// Global error boundary
export function ErrorBoundary({ error }) {
  return <ErrorPage error={error} />
}
```

## 🧪 Testing Patterns

```typescript
// API endpoint test
test('GET /api/jobs returns jobs', async () => {
  const response = await GET('/api/jobs')
  expect(response.status).toBe(200)
  expect(response.data).toHaveLength(20)
})

// Server action test
test('createJob creates job', async () => {
  const formData = new FormData()
  formData.append('title', 'Test Job')
  
  const job = await createJob(formData)
  expect(job.title).toBe('Test Job')
})
```

---

This design provides clear patterns for every endpoint you'll need. Each follows the same structure: authenticate → authorize → validate → execute → respond.