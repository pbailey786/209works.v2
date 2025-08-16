export const ROUTES = {
  HOME: 'home',
  SIGN_IN: 'sign-in',
  JOBS: 'jobs',
  DASHBOARD: 'dashboard',
  EMPLOYER_DASHBOARD: 'employer-dashboard',
  ADMIN_DASHBOARD: 'admin-dashboard',
  POST_JOB: 'post-job',
  PROFILE: 'profile',
  EMPLOYER_PROFILE: 'employer-profile',
  EMPLOYER_SUBSCRIPTION: 'employer-subscription',
  JOB_SEEKER_SUBSCRIPTION: 'job-seeker-subscription',
  APPLICANT_MANAGEMENT: 'applicant-management',
  EMPLOYER_ONBOARDING: 'employer-onboarding',
  JOB_SEEKER_ONBOARDING: 'job-seeker-onboarding',
  AI_RESUME_BUILDER: 'ai-resume-builder'
} as const;

export type RouteType = typeof ROUTES[keyof typeof ROUTES];