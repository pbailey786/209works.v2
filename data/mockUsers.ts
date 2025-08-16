import { User, JobApplication } from '../types/user';

export const currentUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  role: 'job-seeker',
  createdAt: '2024-01-01',
  profile: {
    title: 'Frontend Developer',
    location: 'Downtown District',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js'],
    experience: '3 years',
    education: 'Bachelor\'s in Computer Science',
    preferences: {
      jobTypes: ['full-time', 'remote'],
      salaryRange: '$70,000 - $100,000',
      remote: true,
      categories: ['Technology', 'Design']
    },
    aiResumeScore: 85,
    aiRecommendations: [
      'Consider adding more backend skills to increase opportunities',
      'Your React skills are highly sought after in your area',
      'Consider pursuing TypeScript certification'
    ]
  }
};

export const mockEmployer: User = {
  id: '2',
  name: 'Sarah Chen',
  email: 'sarah@techstart.com',
  role: 'employer',
  createdAt: '2024-01-01',
  profile: {
    company: 'TechStart Local',
    industry: 'Technology',
    size: '10-50 employees',
    location: 'Downtown District',
    description: 'Innovative startup building next-generation web applications',
    website: 'https://techstart.local',
    verified: true
  }
};

export const mockAdmin: User = {
  id: '3',
  name: 'Admin User',
  email: 'admin@209works.com',
  role: 'admin',
  createdAt: '2024-01-01',
  profile: {
    company: '209.works',
    industry: 'Technology',
    size: '1-10 employees',
    location: 'Platform',
    description: 'AI-powered local job board platform',
    verified: true
  }
};

export const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobId: '1',
    applicantId: '1',
    applicantName: 'Alex Johnson',
    applicantEmail: 'alex@example.com',
    status: 'reviewing',
    appliedDate: '2024-01-16',
    coverLetter: 'I am excited to apply for this position and believe my frontend development skills would be a great fit for your team.',
    aiMatchScore: 92,
    aiResumeScore: 88,
    aiRanking: 94,
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js'],
    experience: '3 years',
    location: 'Downtown District'
  },
  {
    id: '2',
    jobId: '2',
    applicantId: '4',
    applicantName: 'Jordan Smith',
    applicantEmail: 'jordan@example.com',
    status: 'pending',
    appliedDate: '2024-01-15',
    aiMatchScore: 78,
    aiResumeScore: 82,
    aiRanking: 80,
    skills: ['Marketing', 'Social Media', 'Content Creation', 'Analytics'],
    experience: '2 years',
    location: 'Arts Quarter'
  },
  {
    id: '3',
    jobId: '1',
    applicantId: '5',
    applicantName: 'Maria Garcia',
    applicantEmail: 'maria@example.com',
    status: 'interviewed',
    appliedDate: '2024-01-14',
    notes: 'Great interview, strong technical skills',
    aiMatchScore: 88,
    aiResumeScore: 91,
    aiRanking: 87,
    skills: ['React', 'Vue.js', 'JavaScript', 'Python', 'AWS'],
    experience: '5 years',
    location: 'Tech Quarter'
  },
  {
    id: '4',
    jobId: '3',
    applicantId: '6',
    applicantName: 'David Kim',
    applicantEmail: 'david@example.com',
    status: 'pending',
    appliedDate: '2024-01-13',
    aiMatchScore: 65,
    aiResumeScore: 70,
    aiRanking: 68,
    skills: ['Customer Service', 'Coffee Making', 'Cash Handling'],
    experience: '1 year',
    location: 'University District'
  },
  {
    id: '5',
    jobId: '4',
    applicantId: '7',
    applicantName: 'Emily Rodriguez',
    applicantEmail: 'emily@example.com',
    status: 'reviewing',
    appliedDate: '2024-01-12',
    aiMatchScore: 95,
    aiResumeScore: 93,
    aiRanking: 96,
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Adobe Creative Suite'],
    experience: '4 years',
    location: 'Creative District'
  },
  {
    id: '6',
    jobId: '6',
    applicantId: '8',
    applicantName: 'Michael Chen',
    applicantEmail: 'michael@example.com',
    status: 'hired',
    appliedDate: '2024-01-10',
    aiMatchScore: 89,
    aiResumeScore: 85,
    aiRanking: 91,
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics'],
    experience: '6 years',
    location: 'Medical District'
  }
];