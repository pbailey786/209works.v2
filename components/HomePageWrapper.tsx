'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { HomePage } from './HomePage';

export function HomePageWrapper() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      router.push('/sign-up');
    }
  };

  const handleViewJobs = () => {
    router.push('/jobs');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <HomePage 
      onGetStarted={handleGetStarted}
      onViewJobs={handleViewJobs}
      onSignIn={handleSignIn}
    />
  );
}