import { Job, JobFilters } from './job';
import { User, JobApplication } from './user';

export interface AppState {
  currentView: string;
  user: User | null;
  jobs: Job[];
  applications: JobApplication[];
  needsOnboarding: boolean;
  filters: JobFilters;
  selectedJob: Job | null;
}

export const initialFilters: JobFilters = {
  search: '',
  location: '',
  category: 'All Categories',
  type: 'All Types',
  remote: false,
  salaryRange: ''
};