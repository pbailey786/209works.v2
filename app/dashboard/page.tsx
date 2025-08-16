'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { redirect, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  FileText, 
  User, 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Target,
  BookOpen,
  Star,
  ArrowRight,
  Upload
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isLoaded && !userId) {
      redirect('/sign-in');
    }
    
    // Check if user has completed onboarding
    if (user && !user.publicMetadata?.role) {
      redirect('/onboarding');
    }

    // Redirect employers to their dashboard
    if (user && user.publicMetadata?.role === 'employer') {
      redirect('/employer');
    }
  }, [isLoaded, userId, user]);

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  // Mock data for job seeker
  const stats = {
    applicationsSubmitted: 12,
    applicationsPending: 8,
    applicationsViewed: 3,
    applicationsRejected: 1,
    profileViews: 47,
    savedJobs: 15,
    profileCompleteness: 75,
    resumeUploaded: true
  };

  const recentApplications = [
    {
      id: 1,
      jobTitle: "Frontend Developer",
      company: "Tech Innovations Inc",
      appliedDate: "2024-01-20",
      status: "pending",
      location: "Stockton, CA"
    },
    {
      id: 2,
      jobTitle: "Full Stack Engineer",
      company: "Digital Solutions Co",
      appliedDate: "2024-01-19",
      status: "viewed",
      location: "Modesto, CA"
    },
    {
      id: 3,
      jobTitle: "React Developer",
      company: "StartUp Hub",
      appliedDate: "2024-01-18",
      status: "pending",
      location: "Tracy, CA"
    }
  ];

  const recommendedJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Innovation Labs",
      location: "Stockton, CA",
      type: "Full-time",
      matchScore: 95
    },
    {
      id: 2,
      title: "JavaScript Developer",
      company: "Tech Corp",
      location: "Modesto, CA",
      type: "Full-time",
      matchScore: 88
    },
    {
      id: 3,
      title: "UI/UX Developer",
      company: "Design Studios",
      location: "Lodi, CA",
      type: "Contract",
      matchScore: 82
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'viewed':
        return <AlertCircle className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'viewed':
        return 'default';
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || 'Job Seeker'}!</h1>
        <p className="text-muted-foreground">Track your applications and discover new opportunities</p>
      </div>

      {/* Profile Completion Alert */}
      {stats.profileCompleteness < 100 && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Complete your profile</p>
                  <p className="text-sm text-yellow-700">Your profile is {stats.profileCompleteness}% complete. Complete it to get better job matches!</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/profile')}
              >
                Complete Profile
              </Button>
            </div>
            <Progress value={stats.profileCompleteness} className="mt-3 h-2" />
          </CardContent>
        </Card>
      )}

      {/* Resume Upload Alert */}
      {!stats.resumeUploaded && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Upload your resume</p>
                  <p className="text-sm text-blue-700">Upload your resume to apply for jobs faster</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/profile#resume')}
              >
                Upload Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applicationsSubmitted}</div>
            <p className="text-xs text-muted-foreground">Total submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applicationsPending}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileViews}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedJobs}</div>
            <p className="text-xs text-muted-foreground">To apply later</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button 
          className="h-auto flex flex-col gap-2 p-4"
          variant="outline"
          onClick={() => router.push('/jobs')}
        >
          <Search className="h-6 w-6" />
          <span>Search Jobs</span>
        </Button>
        <Button 
          className="h-auto flex flex-col gap-2 p-4"
          variant="outline"
          onClick={() => router.push('/profile')}
        >
          <User className="h-6 w-6" />
          <span>Update Profile</span>
        </Button>
        <Button 
          className="h-auto flex flex-col gap-2 p-4"
          variant="outline"
          onClick={() => router.push('/applications')}
        >
          <FileText className="h-6 w-6" />
          <span>My Applications</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Recent Applications</TabsTrigger>
          <TabsTrigger value="recommendations">Recommended Jobs</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Your latest job applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentApplications.slice(0, 3).map((application) => (
                  <div key={application.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{application.jobTitle}</p>
                      <p className="text-sm text-muted-foreground">{application.company}</p>
                    </div>
                    <Badge variant={getStatusColor(application.status)} className="gap-1">
                      {getStatusIcon(application.status)}
                      {application.status}
                    </Badge>
                  </div>
                ))}
                <Button 
                  variant="link" 
                  className="w-full"
                  onClick={() => setActiveTab('applications')}
                >
                  View all applications →
                </Button>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>AI Job Matches</CardTitle>
                <CardDescription>Jobs that match your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                      </div>
                      <Badge variant="secondary">{job.matchScore}% match</Badge>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="link" 
                  className="w-full"
                  onClick={() => router.push('/jobs')}
                >
                  See more recommendations →
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {recentApplications.map((application) => (
            <Card key={application.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{application.jobTitle}</h3>
                    <p className="text-muted-foreground">{application.company} • {application.location}</p>
                    <p className="text-sm text-muted-foreground">Applied on {new Date(application.appliedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(application.status)} className="gap-1">
                      {getStatusIcon(application.status)}
                      {application.status}
                    </Badge>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendedJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-muted-foreground">{job.company} • {job.location}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{job.type}</Badge>
                      <Badge variant="secondary">{job.matchScore}% match</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Save</Button>
                    <Button size="sm">Apply Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your job search activity timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Activity tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}