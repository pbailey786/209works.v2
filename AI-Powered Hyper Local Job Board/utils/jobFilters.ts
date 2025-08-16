import { Job, JobFilters } from '../types/job';

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter(job => {
    const matchesSearch = !filters.search || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesLocation = !filters.location || 
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesCategory = filters.category === 'All Categories' || 
      job.category === filters.category;
    
    const matchesType = filters.type === 'All Types' || 
      job.type === filters.type;
    
    const matchesRemote = !filters.remote || job.remote;
    
    return matchesSearch && matchesLocation && matchesCategory && matchesType && matchesRemote;
  });
}