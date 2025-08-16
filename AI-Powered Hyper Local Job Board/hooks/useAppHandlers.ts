import { useState, useCallback } from 'react';
import { Job } from '../types/job';
import { User, JobApplication, JobSeekerProfile, EmployerProfile } from '../types/user';
import { mockEmployer, mockAdmin } from '../data/mockUsers';
import { ROUTES } from '../constants/routes';

export function useAppHandlers(
  user: User | null,
  setUser: (user: User | null) => void,
  jobs: Job[],
  setJobs: (jobs: Job[]) => void,
  applications: JobApplication[],
  setApplications: (applications: JobApplication[]) => void,
  setCurrentView: (view: string) => void,
  setNeedsOnboarding: (needs: boolean) => void,
  setSelectedJob: (job: Job | null) => void
) {
  const handleViewDetails = useCallback((job: Job) => {
    setSelectedJob(job);
  }, [setSelectedJob]);

  const handleCloseDetails = useCallback(() => {
    setSelectedJob(null);
  }, [setSelectedJob]);

  const handleSignIn = useCallback((role?: string) => {
    switch (role) {
      case 'employer':
        setUser({
          ...mockEmployer,
          subscription: {
            planId: 'employer-professional',
            status: 'active',
            startDate: '2024-01-01',
            credits: 10,
            usedCredits: 3,
            autoRenew: true
          }
        });
        setCurrentView(ROUTES.EMPLOYER_DASHBOARD);
        break;
      case 'admin':
        setUser(mockAdmin);
        setCurrentView(ROUTES.ADMIN_DASHBOARD);
        break;
      case 'new-employer':
        setNeedsOnboarding(true);
        setCurrentView(ROUTES.EMPLOYER_ONBOARDING);
        break;
      case 'new-job-seeker':
        setNeedsOnboarding(true);
        setCurrentView(ROUTES.JOB_SEEKER_ONBOARDING);
        break;
      default:
        setUser({
          ...mockEmployer,
          subscription: {
            planId: 'seeker-premium',
            status: 'active',
            startDate: '2024-01-01',
            credits: 0,
            usedCredits: 0,
            autoRenew: true
          }
        });
        setCurrentView(ROUTES.DASHBOARD);
    }
  }, [setUser, setCurrentView, setNeedsOnboarding]);

  const handleSignOut = useCallback(() => {
    setUser(null);
    setCurrentView(ROUTES.HOME);
  }, [setUser, setCurrentView]);

  const handleSaveJob = useCallback((job: Partial<Job>) => {
    if (user?.role === 'employer' && user.subscription) {
      const remainingCredits = user.subscription.credits - user.subscription.usedCredits;
      if (remainingCredits <= 0) {
        alert('You need more credits to post a job. Please purchase credits or upgrade your subscription.');
        setCurrentView(ROUTES.EMPLOYER_SUBSCRIPTION);
        return;
      }
      
      setUser({
        ...user,
        subscription: {
          ...user.subscription,
          usedCredits: user.subscription.usedCredits + 1
        }
      });
    }
    
    const newJob: Job = {
      ...job as Job,
      id: Math.random().toString(36).substr(2, 9),
      postedDate: new Date().toISOString().split('T')[0],
      aiMatchScore: Math.floor(Math.random() * 30) + 70
    };
    setJobs([newJob, ...jobs]);
    setCurrentView(ROUTES.EMPLOYER_DASHBOARD);
  }, [user, setUser, jobs, setJobs, setCurrentView]);

  const handlePreviewJob = useCallback((job: Partial<Job>) => {
    setSelectedJob(job as Job);
  }, [setSelectedJob]);

  const handleUpdateApplicationStatus = useCallback((id: string, status: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: status as any } : app
    ));
  }, [applications, setApplications]);

  const handleSaveProfile = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, [setUser]);

  const handleCompleteEmployerOnboarding = useCallback((profile: EmployerProfile) => {
    if (user) {
      setUser({
        ...user,
        profile
      });
    }
    setNeedsOnboarding(false);
    setCurrentView(ROUTES.EMPLOYER_DASHBOARD);
  }, [user, setUser, setNeedsOnboarding, setCurrentView]);

  const handleCompleteJobSeekerOnboarding = useCallback((profile: JobSeekerProfile) => {
    if (user) {
      setUser({
        ...user,
        profile
      });
    }
    setNeedsOnboarding(false);
    setCurrentView(ROUTES.DASHBOARD);
  }, [user, setUser, setNeedsOnboarding, setCurrentView]);

  const handleSkipOnboarding = useCallback(() => {
    setNeedsOnboarding(false);
    if (user?.role === 'employer') {
      setCurrentView(ROUTES.EMPLOYER_DASHBOARD);
    } else {
      setCurrentView(ROUTES.DASHBOARD);
    }
  }, [user, setNeedsOnboarding, setCurrentView]);

  const handleSubscribe = useCallback((planId: string) => {
    if (user) {
      const newSubscription = {
        planId,
        status: 'active' as const,
        startDate: new Date().toISOString().split('T')[0],
        credits: planId.includes('employer') ? 10 : 0,
        usedCredits: 0,
        autoRenew: true
      };
      
      setUser({
        ...user,
        subscription: newSubscription
      });
      
      if (user.role === 'employer') {
        setCurrentView(ROUTES.EMPLOYER_DASHBOARD);
      } else {
        setCurrentView(ROUTES.DASHBOARD);
      }
    }
  }, [user, setUser, setCurrentView]);

  const handlePurchaseCredits = useCallback((packageId: string) => {
    if (user?.role === 'employer') {
      const creditsToAdd = packageId === 'credits-5' ? 5 : 15;
      const bonusCredits = packageId === 'credits-15' ? 3 : 0;
      
      setUser({
        ...user,
        subscription: {
          ...user.subscription,
          planId: user.subscription?.planId || 'pay-per-post',
          status: 'active',
          startDate: user.subscription?.startDate || new Date().toISOString().split('T')[0],
          credits: (user.subscription?.credits || 0) + creditsToAdd + bonusCredits,
          usedCredits: user.subscription?.usedCredits || 0,
          autoRenew: user.subscription?.autoRenew || false
        }
      });
      
      setCurrentView(ROUTES.EMPLOYER_DASHBOARD);
    }
  }, [user, setUser, setCurrentView]);

  const handleAddNote = useCallback((applicationId: string, note: string) => {
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, notes: note } : app
    ));
  }, [applications, setApplications]);

  const handleViewApplication = useCallback((application: JobApplication) => {
    console.log('View application:', application);
  }, []);

  const handleViewUser = useCallback((user: User) => {
    console.log('View user:', user);
  }, []);

  const handleApproveJob = useCallback((jobId: string) => {
    console.log('Approve job:', jobId);
  }, []);

  const handleRejectJob = useCallback((jobId: string) => {
    console.log('Reject job:', jobId);
  }, []);

  return {
    handleViewDetails,
    handleCloseDetails,
    handleSignIn,
    handleSignOut,
    handleSaveJob,
    handlePreviewJob,
    handleUpdateApplicationStatus,
    handleSaveProfile,
    handleCompleteEmployerOnboarding,
    handleCompleteJobSeekerOnboarding,
    handleSkipOnboarding,
    handleSubscribe,
    handlePurchaseCredits,
    handleAddNote,
    handleViewApplication,
    handleViewUser,
    handleApproveJob,
    handleRejectJob
  };
}