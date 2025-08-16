import { SubscriptionPlan, CreditPackage } from '../types/subscription';

export const employerPlans: SubscriptionPlan[] = [
  {
    id: 'employer-starter',
    name: 'Starter',
    type: 'employer',
    price: 49,
    interval: 'monthly',
    jobPosts: 3,
    applications: 50,
    aiFeatures: false,
    prioritySupport: false,
    analytics: false,
    teamAccounts: 1,
    features: [
      '3 job posts per month',
      'Up to 50 applications',
      'Basic applicant filtering',
      'Email notifications',
      'Standard support'
    ]
  },
  {
    id: 'employer-professional',
    name: 'Professional',
    type: 'employer',
    price: 149,
    interval: 'monthly',
    jobPosts: 10,
    applications: 200,
    aiFeatures: true,
    prioritySupport: false,
    analytics: true,
    teamAccounts: 3,
    popular: true,
    features: [
      '10 job posts per month',
      'Up to 200 applications',
      'AI-powered applicant ranking',
      'Advanced analytics dashboard',
      'Custom branding',
      'Team collaboration (3 seats)',
      'Priority email support'
    ]
  },
  {
    id: 'employer-enterprise',
    name: 'Enterprise',
    type: 'employer',
    price: 399,
    interval: 'monthly',
    jobPosts: -1, // Unlimited
    applications: -1, // Unlimited
    aiFeatures: true,
    prioritySupport: true,
    analytics: true,
    teamAccounts: -1, // Unlimited
    features: [
      'Unlimited job posts',
      'Unlimited applications',
      'Advanced AI matching & ranking',
      'Custom integrations',
      'Dedicated account manager',
      'White-label solution',
      'Unlimited team accounts',
      '24/7 phone support',
      'Custom reporting'
    ]
  }
];

export const creditPackages: CreditPackage[] = [
  {
    id: 'credits-5',
    name: '5 Job Post Credits',
    credits: 5,
    price: 25,
    popular: false
  },
  {
    id: 'credits-15',
    name: '15 Job Post Credits',
    credits: 15,
    price: 60,
    bonus: 3,
    popular: true
  }
];

export const jobSeekerPlans: SubscriptionPlan[] = [
  {
    id: 'seeker-basic',
    name: 'Basic',
    type: 'job-seeker',
    price: 0,
    interval: 'monthly',
    aiFeatures: false,
    prioritySupport: false,
    features: [
      'Apply to unlimited jobs',
      'Basic job recommendations',
      'Profile visibility to employers',
      'Email job alerts',
      'Basic profile analytics'
    ]
  },
  {
    id: 'seeker-premium',
    name: 'Premium',
    type: 'job-seeker',
    price: 19,
    interval: 'monthly',
    aiFeatures: true,
    prioritySupport: true,
    popular: true,
    features: [
      'Everything in Basic',
      'AI-powered job matching',
      'Resume optimization tips',
      'Priority application status',
      'Advanced profile analytics',
      'Interview preparation resources',
      'Priority customer support',
      'Early access to new jobs'
    ]
  }
];