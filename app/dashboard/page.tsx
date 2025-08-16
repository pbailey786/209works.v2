'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Clock, TrendingUp, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && !userId) {
      redirect('/sign-in');
    }
    
    // Check if user has completed onboarding
    if (user && !user.publicMetadata?.role) {
      redirect('/onboarding');
    }
  }, [isLoaded, userId, user]);

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  // Mock data for dashboard
  const stats = {
    appliedJobs: 12,
    savedJobs: 8,
    profileViews: 45,
    matchScore: 85
  };

  const recentApplications = [
    { id: 1, company: 'TechStart Local', position: 'Frontend Developer', status: 'reviewing', date: '2 days ago' },
    { id: 2, company: 'Creative Agency', position: 'Web Designer', status: 'pending', date: '5 days ago' },
    { id: 3, company: 'StartupHub', position: 'Full Stack Developer', status: 'interviewed', date: '1 week ago' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.firstName || 'there'}!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your job search activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applied Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.appliedJobs}</div>
              <Briefcase className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.savedJobs}</div>
              <Star className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.profileViews}</div>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Match Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.matchScore}%</div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">AI</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>
            <Link href="/applications">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{app.position}</h4>
                  <p className="text-sm text-muted-foreground">{app.company}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={app.status === 'reviewing' ? 'default' : app.status === 'interviewed' ? 'secondary' : 'outline'}
                  >
                    {app.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {app.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <Link href="/jobs">
          <Button size="lg">
            Browse New Jobs
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant="outline" size="lg">
            Update Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}