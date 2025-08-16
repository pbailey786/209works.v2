import { User, JobApplication } from '../types/user';
import { Job } from '../types/job';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Eye, FileText, MapPin, Calendar, Zap, TrendingUp, Target, BookOpen } from 'lucide-react';

interface JobSeekerDashboardProps {
  user: User;
  applications: JobApplication[];
  recommendedJobs: Job[];
  onViewJob: (job: Job) => void;
}

export function JobSeekerDashboard({ user, applications, recommendedJobs, onViewJob }: JobSeekerDashboardProps) {
  const profile = user.profile as any; // Type assertion for job seeker profile
  
  const stats = {
    applied: applications.length,
    viewed: applications.filter(app => app.status === 'reviewing').length,
    interviews: applications.filter(app => app.status === 'interviewed').length,
    offers: applications.filter(app => app.status === 'hired').length
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-2">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground">Here's your job search progress and recommendations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-medium">{stats.applied}</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-2xl font-medium">{stats.viewed}</p>
              </div>
              <Eye className="w-8 h-8 text-muted-foreground" />
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
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offers</p>
                <p className="text-2xl font-medium">{stats.offers}</p>
              </div>
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  AI Profile Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Profile Completeness</span>
                    <span className="font-medium">{profile.aiResumeScore}%</span>
                  </div>
                  <Progress value={profile.aiResumeScore} className="h-2" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">AI Recommendations:</h4>
                  <ul className="space-y-1">
                    {profile.aiRecommendations?.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendedJobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 cursor-pointer" onClick={() => onViewJob(job)}>
                      <div className="flex-1">
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                        {job.aiMatchScore && (
                          <Badge variant="secondary" className="mt-1 bg-accent text-accent-foreground">
                            <Zap className="w-3 h-3 mr-1" />
                            {job.aiMatchScore}% match
                          </Badge>
                        )}
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">Applied for job #{application.jobId}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                        {application.aiMatchScore && (
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {application.aiMatchScore}% match
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Skill Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Based on local job market trends, consider developing these skills:
                  </p>
                  <div className="space-y-2">
                    {['TypeScript', 'Node.js', 'AWS'].map((skill, index) => (
                      <div key={skill} className="flex items-center justify-between">
                        <span>{skill}</span>
                        <Badge variant="outline">High Demand</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Job opportunities in your preferred areas:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Downtown District</span>
                      <Badge variant="secondary">25 new jobs</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tech Quarter</span>
                      <Badge variant="secondary">18 new jobs</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Remote</span>
                      <Badge variant="secondary">42 new jobs</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}