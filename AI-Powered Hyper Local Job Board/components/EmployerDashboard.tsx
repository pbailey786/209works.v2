import { User, JobApplication } from '../types/user';
import { Job } from '../types/job';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Eye, Users, Briefcase, Calendar, TrendingUp, Star, MessageCircle, CheckCircle } from 'lucide-react';

interface EmployerDashboardProps {
  user: User;
  jobs: Job[];
  applications: JobApplication[];
  onViewJob: (job: Job) => void;
  onViewApplication: (application: JobApplication) => void;
  onUpdateApplicationStatus: (id: string, status: string) => void;
}

export function EmployerDashboard({ 
  user, 
  jobs, 
  applications, 
  onViewJob, 
  onViewApplication, 
  onUpdateApplicationStatus 
}: EmployerDashboardProps) {
  const profile = user.profile as any; // Type assertion for employer profile

  const stats = {
    activeJobs: jobs.filter(job => job.id).length,
    totalApplications: applications.length,
    newApplications: applications.filter(app => app.status === 'pending').length,
    interviews: applications.filter(app => app.status === 'interviewed').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-2">Employer Dashboard</h1>
        <p className="text-muted-foreground">Manage your job postings and applications for {profile.company}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-medium">{stats.activeJobs}</p>
              </div>
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-medium">{stats.totalApplications}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Applications</p>
                <p className="text-2xl font-medium">{stats.newApplications}</p>
              </div>
              <Star className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interviews</p>
                <p className="text-2xl font-medium">{stats.interviews}</p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Job Postings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{job.title}</h4>
                        <Badge variant="outline" className="capitalize">{job.type}</Badge>
                        {job.remote && <Badge variant="secondary">Remote</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {Math.floor(Math.random() * 100) + 50} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {applications.filter(app => app.jobId === job.id).length} applications
                        </span>
                        <span>Posted {formatPostedDate(job.postedDate)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => onViewJob(job)}>
                        View
                      </Button>
                      <Button size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{application.applicantName}</h4>
                        {application.aiMatchScore && (
                          <Badge variant="secondary" className="bg-accent text-accent-foreground">
                            {application.aiMatchScore}% AI match
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Job #{application.jobId}</span>
                        <span>{application.applicantEmail}</span>
                        <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={application.status}
                        onValueChange={(value) => onUpdateApplicationStatus(application.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewing">Reviewing</SelectItem>
                          <SelectItem value="interviewed">Interviewed</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" onClick={() => onViewApplication(application)}>
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Hiring Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Applications per Job</span>
                    <span className="font-medium">
                      {(applications.length / Math.max(jobs.length, 1)).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Interview Rate</span>
                    <span className="font-medium">
                      {((stats.interviews / Math.max(stats.totalApplications, 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Response Time</span>
                    <span className="font-medium">2.3 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'New application received', job: 'Frontend Developer', time: '2 hours ago' },
                    { action: 'Interview scheduled', job: 'Marketing Coordinator', time: '1 day ago' },
                    { action: 'Job posting published', job: 'UX Designer', time: '3 days ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.job} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}