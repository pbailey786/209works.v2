import { Job, JobFilters } from '../types/job';
import { User, JobApplication } from '../types/user';
import { ROUTES } from '../constants/routes';

import { HomePage } from './HomePage';
import { SmartSearchFilters } from './SmartSearchFilters';
import { EnhancedJobCard } from './EnhancedJobCard';
import { AIRecommendations } from './AIRecommendations';
import { JobSeekerDashboard } from './JobSeekerDashboard';
import { EmployerDashboard } from './EmployerDashboard';
import { AdminDashboard } from './AdminDashboard';
import { VoiceAIJobBuilder } from './VoiceAIJobBuilder';
import { ProfilePage } from './ProfilePage';
import { EmployerSubscription } from './EmployerSubscription';
import { JobSeekerSubscription } from './JobSeekerSubscription';
import { ApplicantManagement } from './ApplicantManagement';
import { EmployerOnboarding } from './EmployerOnboarding';
import { JobSeekerOnboarding } from './JobSeekerOnboarding';
import { AIResumeBuilder } from './AIResumeBuilder';

import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Briefcase } from 'lucide-react';

import { currentUser, mockEmployer, mockAdmin } from '../data/mockUsers';

interface AppRouterProps {
  currentView: string;
  user: User | null;
  jobs: Job[];
  applications: JobApplication[];
  filteredJobs: Job[];
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  handlers: {
    handleViewDetails: (job: Job) => void;
    handleSignIn: (role?: string) => void;
    handleSaveJob: (job: Partial<Job>) => void;
    handlePreviewJob: (job: Partial<Job>) => void;
    handleUpdateApplicationStatus: (id: string, status: string) => void;
    handleSaveProfile: (user: User) => void;
    handleCompleteEmployerOnboarding: (profile: any) => void;
    handleCompleteJobSeekerOnboarding: (profile: any) => void;
    handleSkipOnboarding: () => void;
    handleSubscribe: (planId: string) => void;
    handlePurchaseCredits: (packageId: string) => void;
    handleAddNote: (id: string, note: string) => void;
    handleViewApplication: (application: JobApplication) => void;
    handleViewUser: (user: User) => void;
    handleApproveJob: (jobId: string) => void;
    handleRejectJob: (jobId: string) => void;
  };
  onViewChange: (view: string) => void;
}

export function AppRouter({ 
  currentView, 
  user, 
  jobs, 
  applications, 
  filteredJobs, 
  filters, 
  onFiltersChange, 
  handlers,
  onViewChange
}: AppRouterProps) {
  const allUsers = [currentUser, mockEmployer, mockAdmin];

  switch (currentView) {
    case ROUTES.HOME:
      return (
        <HomePage
          onGetStarted={() => handlers.handleSignIn()}
          onViewJobs={() => onViewChange(ROUTES.JOBS)}
          onSignIn={() => onViewChange(ROUTES.SIGN_IN)}
        />
      );

    case ROUTES.SIGN_IN:
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-medium mb-2">Sign In</h1>
              <p className="text-muted-foreground">Choose your account type to continue</p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => handlers.handleSignIn()} className="w-full" size="lg">
                Job Seeker Account
              </Button>
              <Button onClick={() => handlers.handleSignIn('employer')} variant="outline" className="w-full" size="lg">
                Employer Account
              </Button>
              <Button onClick={() => handlers.handleSignIn('admin')} variant="outline" className="w-full" size="lg">
                Admin Account
              </Button>
            </div>
          </div>
        </div>
      );

    case ROUTES.JOBS:
      return (
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="jobs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="jobs">Job Search</TabsTrigger>
              <TabsTrigger value="ai">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-6">
              <SmartSearchFilters 
                filters={filters}
                onFiltersChange={onFiltersChange}
                onAIRecommendations={() => {}}
              />
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium">
                    {filteredJobs.length} Local Jobs Found
                  </h2>
                  <p className="text-muted-foreground">
                    Sorted by relevance and AI match score
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <EnhancedJobCard 
                    key={job.id} 
                    job={job} 
                    onViewDetails={handlers.handleViewDetails}
                    userSkills={user?.role === 'job-seeker' ? (user.profile as any)?.skills : []}
                    userExperience={user?.role === 'job-seeker' ? (user.profile as any)?.experience : ''}
                    userLocation={user?.role === 'job-seeker' ? (user.profile as any)?.location : ''}
                  />
                ))}
              </div>
              
              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No jobs found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or check back later for new opportunities.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <AIRecommendations 
                jobs={jobs}
                onViewDetails={handlers.handleViewDetails}
              />
            </TabsContent>
          </Tabs>
        </main>
      );

    case ROUTES.DASHBOARD:
      return user ? (
        <JobSeekerDashboard
          user={user}
          applications={applications.filter(app => app.applicantId === user.id)}
          recommendedJobs={jobs.filter(job => job.aiMatchScore && job.aiMatchScore > 75)}
          onViewJob={handlers.handleViewDetails}
        />
      ) : null;

    case ROUTES.EMPLOYER_DASHBOARD:
      return user ? (
        <EmployerDashboard
          user={user}
          jobs={jobs.filter(job => job.company === (user.profile as any).company)}
          applications={applications}
          onViewJob={handlers.handleViewDetails}
          onViewApplication={handlers.handleViewApplication}
          onUpdateApplicationStatus={handlers.handleUpdateApplicationStatus}
        />
      ) : null;

    case ROUTES.ADMIN_DASHBOARD:
      return user ? (
        <AdminDashboard
          users={allUsers}
          jobs={jobs}
          applications={applications}
          onViewUser={handlers.handleViewUser}
          onViewJob={handlers.handleViewDetails}
          onApproveJob={handlers.handleApproveJob}
          onRejectJob={handlers.handleRejectJob}
        />
      ) : null;

    case ROUTES.POST_JOB:
      return (
        <VoiceAIJobBuilder
          onSave={handlers.handleSaveJob}
          onPreview={handlers.handlePreviewJob}
        />
      );

    case ROUTES.PROFILE:
    case ROUTES.EMPLOYER_PROFILE:
      return user ? (
        <ProfilePage
          user={user}
          onSave={handlers.handleSaveProfile}
        />
      ) : null;

    case ROUTES.EMPLOYER_SUBSCRIPTION:
      return (
        <EmployerSubscription
          user={user}
          onSubscribe={handlers.handleSubscribe}
          onPurchaseCredits={handlers.handlePurchaseCredits}
        />
      );

    case ROUTES.JOB_SEEKER_SUBSCRIPTION:
      return (
        <JobSeekerSubscription
          user={user}
          onSubscribe={handlers.handleSubscribe}
        />
      );

    case ROUTES.APPLICANT_MANAGEMENT:
      return user ? (
        <ApplicantManagement
          user={user}
          jobs={jobs.filter(job => job.company === (user.profile as any).company)}
          applications={applications}
          onUpdateApplicationStatus={handlers.handleUpdateApplicationStatus}
          onAddNote={handlers.handleAddNote}
        />
      ) : null;

    case ROUTES.EMPLOYER_ONBOARDING:
      return (
        <EmployerOnboarding
          onComplete={handlers.handleCompleteEmployerOnboarding}
          onSkip={handlers.handleSkipOnboarding}
        />
      );

    case ROUTES.JOB_SEEKER_ONBOARDING:
      return (
        <JobSeekerOnboarding
          onComplete={handlers.handleCompleteJobSeekerOnboarding}
          onSkip={handlers.handleSkipOnboarding}
        />
      );

    case ROUTES.AI_RESUME_BUILDER:
      return user ? (
        <AIResumeBuilder
          user={user}
          onSave={(resumeData) => console.log('Save resume:', resumeData)}
        />
      ) : null;

    default:
      return (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-medium mb-4">Page Not Found</h1>
          <Button onClick={() => onViewChange(ROUTES.HOME)}>
            Go Home
          </Button>
        </div>
      );
  }
}