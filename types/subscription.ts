export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'employer' | 'job-seeker';
  price: number;
  interval: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  popular?: boolean;
  credits?: number;
  jobPosts?: number;
  applications?: number;
  aiFeatures?: boolean;
  prioritySupport?: boolean;
  analytics?: boolean;
  teamAccounts?: number;
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

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  bonus?: number;
  popular?: boolean;
}