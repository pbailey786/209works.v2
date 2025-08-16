import { User, JobApplication } from '../types/user';
import { Job } from '../types/job';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Users, Briefcase, Building, TrendingUp, AlertCircle, CheckCircle, XCircle, Eye } from 'lucide-react';

interface AdminDashboardProps {
  users: User[];
  jobs: Job[];
  applications: JobApplication[];
  onViewUser: (user: User) => void;
  onViewJob: (job: Job) => void;
  onApproveJob: (jobId: string) => void;
  onRejectJob: (jobId: string) => void;
}

export function AdminDashboard({ 
  users, 
  jobs, 
  applications, 
  onViewUser, 
  onViewJob, 
  onApproveJob, 
  onRejectJob 
}: AdminDashboardProps) {
  const stats = {
    totalUsers: users.length,
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.id).length,
    totalApplications: applications.length,
    jobSeekers: users.filter(user => user.role === 'job-seeker').length,
    employers: users.filter(user => user.role === 'employer').length,
    pendingJobs: Math.floor(Math.random() * 5) + 1
  };

  const recentActivity = [
    { type: 'job', action: 'New job posted', details: 'Senior Developer at TechStart', time: '2 hours ago' },
    { type: 'user', action: 'New employer registered', details: 'Creative Agency Co.', time: '4 hours ago' },
    { type: 'application', action: 'Application submitted', details: 'Frontend Developer position', time: '6 hours ago' },
    { type: 'job', action: 'Job approved', details: 'Marketing Coordinator', time: '1 day ago' },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management tools</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-medium">{stats.totalUsers}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.jobSeekers} seekers, {stats.employers} employers
                </p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-medium">{stats.totalJobs}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.activeJobs} active
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-medium">{stats.totalApplications}</p>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Jobs</p>
                <p className="text-2xl font-medium">{stats.pendingJobs}</p>
                <p className="text-xs text-muted-foreground">
                  Need review
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Platform Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>System Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Job Approval Rate</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Response Time</span>
                    <span className="font-medium">1.2 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>User Satisfaction</span>
                    <span className="font-medium">4.8/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.slice(0, 10).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => onViewUser(user)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{formatDate(job.postedDate)}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => onViewJob(job)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                      <p className="text-xs text-muted-foreground">Posted {formatDate(job.postedDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => onViewJob(job)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={() => onApproveJob(job.id)}>
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onRejectJob(job.id)}>
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}