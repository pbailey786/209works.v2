import { useState, useMemo } from 'react';
import { mockJobs } from './data/mockJobs';
import { mockApplications } from './data/mockUsers';
import { initialFilters } from './types/appState';
import { ROUTES } from './constants/routes';
import { filterJobs } from './utils/jobFilters';
import { useAppHandlers } from './hooks/useAppHandlers';

import { Navigation } from './components/Navigation';
import { AppRouter } from './components/AppRouter';
import { JobDetail } from './components/JobDetail';

export default function App() {
  const [currentView, setCurrentView] = useState(ROUTES.HOME);
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState(mockJobs);
  const [applications, setApplications] = useState(mockApplications);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);

  const handlers = useAppHandlers(
    user,
    setUser,
    jobs,
    setJobs,
    applications,
    setApplications,
    setCurrentView,
    setNeedsOnboarding,
    setSelectedJob
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentUser={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        onSignOut={handlers.handleSignOut}
      />
      
      <AppRouter
        currentView={currentView}
        user={user}
        jobs={jobs}
        applications={applications}
        filteredJobs={filteredJobs}
        filters={filters}
        onFiltersChange={setFilters}
        handlers={handlers}
        onViewChange={setCurrentView}
      />

      <JobDetail 
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={handlers.handleCloseDetails}
      />
    </div>
  );
}