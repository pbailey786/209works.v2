'use client';

import { Navigation } from './Navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/user';

export function NavigationWrapper() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  // For now, default to job-seeker role
  const userRole: UserRole = 'job-seeker';

  const currentUser = user ? {
    id: user.id,
    name: user.fullName || 'User',
    email: user.primaryEmailAddress?.emailAddress || '',
    role: userRole,
    avatar: user.imageUrl,
    credits: 100,
  } : null;

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <Navigation
      currentUser={currentUser}
      onNavigate={handleNavigate}
    />
  );
}