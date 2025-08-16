import { Job } from '../types/job';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechStart Local',
    location: 'Downtown District',
    type: 'full-time',
    salary: '$80,000 - $120,000',
    description: 'Join our innovative team building next-generation web applications. We are looking for a passionate frontend developer with expertise in React and modern web technologies.',
    requirements: ['5+ years experience', 'React expertise', 'TypeScript', 'Modern CSS'],
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
    postedDate: '2024-01-15',
    category: 'Technology',
    remote: false,
    distance: '0.8 miles',
    aiMatchScore: 95
  },
  {
    id: '2',
    title: 'Marketing Coordinator',
    company: 'Local Marketing Agency',
    location: 'Arts Quarter',
    type: 'full-time',
    salary: '$45,000 - $55,000',
    description: 'Creative marketing role focused on local business growth. Perfect for someone passionate about community engagement and digital marketing strategies.',
    requirements: ['2+ years marketing experience', 'Social media expertise', 'Content creation'],
    skills: ['Social Media', 'Content Marketing', 'Analytics', 'Canva', 'Photography'],
    postedDate: '2024-01-14',
    category: 'Marketing',
    remote: false,
    distance: '1.2 miles',
    aiMatchScore: 78
  },
  {
    id: '3',
    title: 'Barista - Morning Shift',
    company: 'Corner Coffee Co.',
    location: 'University District',
    type: 'part-time',
    salary: '$16 - $18/hour + tips',
    description: 'Join our friendly coffee shop team! Perfect for students or anyone looking for flexible morning hours in a vibrant local community.',
    requirements: ['Customer service experience', 'Morning availability', 'Friendly attitude'],
    skills: ['Customer Service', 'Coffee Making', 'Cash Handling', 'Team Work'],
    postedDate: '2024-01-13',
    category: 'Hospitality',
    remote: false,
    distance: '0.3 miles',
    aiMatchScore: 88
  },
  {
    id: '4',
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Creative District',
    type: 'contract',
    salary: '$60 - $80/hour',
    description: 'Exciting contract opportunity for a UX designer to work on local business digital transformation projects. Remote-friendly with occasional in-person collaboration.',
    requirements: ['3+ years UX experience', 'Portfolio required', 'Local project experience preferred'],
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Adobe Creative Suite'],
    postedDate: '2024-01-12',
    category: 'Design',
    remote: true,
    distance: '2.1 miles',
    aiMatchScore: 72
  },
  {
    id: '5',
    title: 'Local Delivery Driver',
    company: 'QuickDelivery Local',
    location: 'Various Locations',
    type: 'part-time',
    salary: '$20 - $25/hour + tips',
    description: 'Flexible delivery driver position serving local restaurants and businesses. Perfect for earning extra income with flexible scheduling.',
    requirements: ['Valid driver license', 'Own vehicle', 'Smartphone', 'Clean driving record'],
    skills: ['Driving', 'Navigation', 'Customer Service', 'Time Management'],
    postedDate: '2024-01-11',
    category: 'Transportation',
    remote: false,
    distance: '0.5 miles',
    aiMatchScore: 65
  },
  {
    id: '6',
    title: 'Data Analyst',
    company: 'Local Health Network',
    location: 'Medical District',
    type: 'full-time',
    salary: '$65,000 - $75,000',
    description: 'Analyze healthcare data to improve local community health outcomes. Join our mission-driven team making a real impact in our neighborhood.',
    requirements: ['SQL proficiency', 'Python or R', 'Healthcare data experience preferred'],
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics'],
    postedDate: '2024-01-10',
    category: 'Healthcare',
    remote: false,
    distance: '1.7 miles',
    aiMatchScore: 82
  }
];

export const categories = [
  'All Categories',
  'Technology',
  'Marketing',
  'Design',
  'Healthcare',
  'Hospitality',
  'Transportation',
  'Education',
  'Finance',
  'Retail'
];

export const jobTypes = [
  'All Types',
  'full-time',
  'part-time',
  'contract',
  'remote'
];