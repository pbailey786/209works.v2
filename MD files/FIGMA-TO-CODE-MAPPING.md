# Figma to Code Component Mapping

## 🎨 Design System from Figma

### Color Palette
```css
/* From your globals.css - use these CSS variables */
--primary: #030213;        /* Dark slate */
--primary-foreground: #fff;
--secondary: oklch(92.58% 0.042 264.11);
--accent: #e9ebef;
--muted: #717182;
--destructive: #d4183d;
--success: #10b981;        /* For AI match scores */
--ai-accent: #8b5cf6;      /* Purple for AI features */
```

### Typography Scale
```typescript
// Consistent with your Figma
text-2xl → 1.875rem (30px)
text-xl → 1.25rem (20px)
text-lg → 1.125rem (18px)
text-base → 0.875rem (14px)
text-sm → 0.75rem (12px)
```

### Spacing System
```typescript
gap-2 → 0.5rem (8px)
gap-4 → 1rem (16px)
gap-6 → 1.5rem (24px)
gap-8 → 2rem (32px)
p-4 → 1rem padding
p-6 → 1.5rem padding
rounded-[0.625rem] → 10px border radius
```

## 📦 Component Mapping

### 1. HomePage → `/app/page.tsx`
```typescript
// Your Figma components → Code structure
<HomePage>
  <Navigation />           // Use your existing Navigation component
  <HeroSection>           // "AI-Powered Local Jobs" with search
    <SearchBar />         // Location + keyword search
    <QuickFilters />      // Remote, Full-time, etc.
  </HeroSection>
  <FeaturedJobs>          // Grid of JobCard components
    <JobCard />           // Your existing card design
  </FeaturedJobs>
  <AIShowcase>            // "Should I Apply?" demo
    <AIRecommendations /> // Your AI component
  </AIShowcase>
  <Footer />
</HomePage>
```

### 2. Job Browsing → `/app/jobs/page.tsx`
```typescript
// Figma JobListingHomepage → Simplified version
<JobBrowsePage>
  <FilterSidebar>         // Your existing filters
    <LocationFilter />    // With distance slider
    <TypeFilter />        // Full-time, Part-time, etc.
    <SalaryFilter />      // Range slider
    <IndustryFilter />    // Checkboxes
  </FilterSidebar>
  <JobGrid>
    {jobs.map(job => 
      <EnhancedJobCard    // Your Figma card with AI score
        aiMatch={85}      // Show AI match percentage
        {...job}
      />
    )}
  </JobGrid>
</JobBrowsePage>
```

### 3. Job Details → `/app/jobs/[id]/page.tsx`
```typescript
// Use your Figma modal design as full page
<JobDetailsPage>
  <Card className="max-w-4xl mx-auto">
    <CardHeader>
      <div className="flex justify-between">
        <CompanyInfo />   // Logo, name, location
        <AIMatchBadge />  // "85% Match" with sparkles
      </div>
    </CardHeader>
    <CardContent>
      <JobDescription />  // Rich text from your design
      <Requirements />    // Bullet points
      <Benefits />        // Icons + text
    </CardContent>
    <CardFooter>
      <Button>Apply Now</Button>
      <Button variant="outline">
        <Sparkles className="w-4 h-4 mr-2" />
        Should I Apply?
      </Button>
    </CardFooter>
  </Card>
</JobDetailsPage>
```

### 4. "Should I Apply?" → Modal/Sheet Component
```typescript
// Your Figma AIAnalysisModal
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Should I Apply?</Button>
  </SheetTrigger>
  <SheetContent className="w-[400px]">
    <SheetHeader>
      <SheetTitle>AI Career Analysis</SheetTitle>
    </SheetHeader>
    <div className="space-y-4">
      <MatchScore score={85} />         // Circular progress
      <SkillsAnalysis />                // Your design
      <SalaryInsights />                // Chart component
      <RecommendedActions />            // Action items
    </div>
  </SheetContent>
</Sheet>
```

### 5. Dashboards → Role-based Components

#### Job Seeker Dashboard
```typescript
// Your Figma JobSeekerDashboard
<DashboardLayout>
  <StatsCards>                          // Applications, Views, etc.
    <Card>
      <CardContent>
        <Trophy className="w-8 h-8" />
        <p className="text-2xl font-bold">12</p>
        <p className="text-sm text-muted">Applications</p>
      </CardContent>
    </Card>
  </StatsCards>
  <RecentApplications />                // Table component
  <AIRecommendations />                 // Your AI suggestions
  <SavedJobs />                         // Grid of saved JobCards
</DashboardLayout>
```

#### Employer Dashboard
```typescript
// Your Figma EmployerDashboard
<DashboardLayout>
  <StatsOverview />                     // Views, Applications, etc.
  <ActiveJobListings />                 // Manage jobs table
  <ApplicantPipeline />                 // Kanban-style view
  <QuickActions>
    <Button>Post New Job</Button>
    <Button variant="outline">
      <Mic className="w-4 h-4 mr-2" />
      Voice Post Job
    </Button>
  </QuickActions>
</DashboardLayout>
```

### 6. AI Job Builder → `/app/employer/post/page.tsx`
```typescript
// Your VoiceAIJobBuilder component
<JobBuilderPage>
  <Tabs defaultValue="form">
    <TabsList>
      <TabsTrigger value="form">Traditional Form</TabsTrigger>
      <TabsTrigger value="voice">
        <Mic className="w-4 h-4 mr-2" />
        Voice Builder
      </TabsTrigger>
    </TabsList>
    <TabsContent value="form">
      <TraditionalJobForm />            // Your form design
    </TabsContent>
    <TabsContent value="voice">
      <VoiceAIJobBuilder />             // Your voice UI
    </TabsContent>
  </Tabs>
</JobBuilderPage>
```

## 🧩 Reusable Components from Figma

### JobCard Component
```typescript
// Your Figma JobCard design
export function JobCard({ job, showAIMatch = true }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={job.company.logo} />
            </Avatar>
            <div>
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-muted">{job.company.name}</p>
            </div>
          </div>
          {showAIMatch && (
            <Badge variant="secondary" className="bg-purple-100">
              <Sparkles className="w-3 h-3 mr-1" />
              {job.aiMatch}% Match
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 text-sm text-muted">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.location}
          </span>
          <span>•</span>
          <span>{job.salary}</span>
          <span>•</span>
          <span>{job.type}</span>
        </div>
        <p className="mt-2 text-sm line-clamp-2">{job.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-xs text-muted">{job.postedAt}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Save</Button>
          <Button size="sm">Apply</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
```

### AI Match Badge
```typescript
export function AIMatchBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-gray-600 bg-gray-50"
  }
  
  return (
    <Badge className={cn("flex items-center gap-1", getColor())}>
      <Sparkles className="w-3 h-3" />
      {score}% Match
    </Badge>
  )
}
```

### Location Search Component
```typescript
// Your Figma location-aware search
export function LocationSearch() {
  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
      <Input 
        placeholder="City or ZIP code"
        className="pl-10"
      />
      <Button 
        size="sm" 
        variant="ghost"
        className="absolute right-1 top-1/2 -translate-y-1/2"
      >
        <Navigation className="w-4 h-4" />
        Use my location
      </Button>
    </div>
  )
}
```

## 🔄 State Management Patterns

### URL-based State (for filters)
```typescript
// Use searchParams for all filtering
/jobs?location=209&radius=25&type=full-time&industry=tech

// In your component
const searchParams = useSearchParams()
const location = searchParams.get('location')
const radius = searchParams.get('radius')
```

### Form State (for job posting)
```typescript
// Use react-hook-form with your Figma form design
const form = useForm<JobFormData>({
  defaultValues: {
    title: '',
    description: '',
    requirements: [],
    salary: { min: 0, max: 0 },
    location: '',
    remote: false
  }
})
```

### AI State (for real-time features)
```typescript
// For "Should I Apply?" analysis
const [analysis, setAnalysis] = useState({
  loading: false,
  score: null,
  insights: [],
  recommendations: []
})
```

## 🎯 Implementation Order

1. **Set up base layout** with your Navigation and Footer
2. **Create reusable components** (JobCard, AIMatchBadge, etc.)
3. **Build static pages** first (Home, Job Browse)
4. **Add interactivity** (Search, Filters)
5. **Implement auth** with Clerk
6. **Add dashboards** (role-based)
7. **Implement AI features** progressively
8. **Add payment** with Clerk Billing

## 🚀 Quick Wins from Your Design

1. **AI Match Scores** - Add to every job card immediately
2. **"Should I Apply?"** - Start as a simple modal
3. **Voice Job Builder** - Can be a progressive enhancement
4. **Location-aware search** - Use browser geolocation API
5. **Real-time updates** - Use Supabase real-time later

Your Figma design is actually very well thought out. The key is to implement it progressively, starting with the core job board functionality and adding AI features as enhancements.