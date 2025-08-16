export interface User {
  id: string;
  name: string;
  email: string;
  role: 'job-seeker' | 'employer' | 'admin';
  avatar?: string;
  createdAt: string;
  profile: JobSeekerProfile | EmployerProfile;
  subscription?: UserSubscription;
}

export interface JobSeekerProfile {
  title: string;
  location: string;
  skills: string[];
  experience: string;
  education: string;
  resume?: string;
  preferences: {
    jobTypes: string[];
    salaryRange: string;
    remote: boolean;
    categories: string[];
  };
  aiResumeScore?: number;
  aiRecommendations?: string[];
}

export interface EmployerProfile {
  company: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  website?: string;
  logo?: string;
  verified: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  status: 'pending' | 'reviewing' | 'interviewed' | 'hired' | 'rejected';
  appliedDate: string;
  notes?: string;
  resumeUrl?: string;
  coverLetter?: string;
  aiMatchScore?: number;
  aiResumeScore?: number;
  aiRanking?: number;
  skills: string[];
  experience: string;
  location: string;
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate?: string;
  credits: number;
  usedCredits: number;
  autoRenew: boolean;
}