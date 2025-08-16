'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building2, Search, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function RoleSwitcher() {
  const { user } = useUser();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<string>('');

  useEffect(() => {
    if (user) {
      const role = localStorage.getItem(`userRole_${user.id}`) || '';
      setCurrentRole(role);
    }
  }, [user]);

  const switchRole = (newRole: 'job-seeker' | 'employer') => {
    if (!user) return;
    
    localStorage.setItem(`userRole_${user.id}`, newRole);
    setCurrentRole(newRole);
    
    // Redirect to appropriate dashboard
    if (newRole === 'job-seeker') {
      router.push('/dashboard');
    } else {
      router.push('/employer');
    }
  };

  if (!user || !currentRole) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {currentRole === 'employer' ? (
            <>
              <Building2 className="h-4 w-4" />
              Employer Mode
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Job Seeker Mode
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Mode</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => switchRole('job-seeker')}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          Job Seeker
          {currentRole === 'job-seeker' && ' ✓'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => switchRole('employer')}
          className="gap-2"
        >
          <Building2 className="h-4 w-4" />
          Employer
          {currentRole === 'employer' && ' ✓'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => router.push('/settings')}
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          Account Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}