'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  Users, 
  Briefcase, 
  Eye, 
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';

export default function EmployerDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for now
  const stats = {
    activeJobs: 3,
    totalApplications: 47,
    viewsThisWeek: 234,
    interviewsScheduled: 8
  };

  const activeJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      location: "Stockton, CA",
      type: "Full-time",
      postedDate: "2024-01-15",
      applications: 12,
      views: 89,
      status: "active"
    },
    {
      id: 2,
      title: "Marketing Manager",
      location: "Modesto, CA",
      type: "Full-time",
      postedDate: "2024-01-18",
      applications: 23,
      views: 145,
      status: "active"
    },
    {
      id: 3,
      title: "Customer Service Representative",
      location: "Tracy, CA",
      type: "Part-time",
      postedDate: "2024-01-20",
      applications: 12,
      views: 67,
      status: "active"
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Employer Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.firstName || 'Employer'}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">Currently posted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views This Week</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.viewsThisWeek}</div>
            <p className="text-xs text-muted-foreground">+18% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviewsScheduled}</div>
            <p className="text-xs text-muted-foreground">Scheduled this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Post New Job
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active-jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest job postings and applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">New application received</p>
                      <p className="text-sm text-muted-foreground">John Doe applied for Senior Software Engineer</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Job post views milestone</p>
                      <p className="text-sm text-muted-foreground">Marketing Manager position reached 100 views</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">5 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-jobs" className="space-y-4">
          {activeJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </span>
                      <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="secondary">
                        {job.applications} applications
                      </Badge>
                      <Badge variant="outline">
                        {job.views} views
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">View Applications</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Review and manage candidate applications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Application management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Track your job posting performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}