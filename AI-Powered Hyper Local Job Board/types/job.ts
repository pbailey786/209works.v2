export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedDate: string;
  category: string;
  remote: boolean;
  distance?: string;
  aiMatchScore?: number;
}

export interface JobFilters {
  search: string;
  location: string;
  category: string;
  type: string;
  remote: boolean;
  salaryRange: string;
}