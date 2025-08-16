'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { mockJobs } from '@/data/mockJobs';
import JobApplicationModal from '@/components/JobApplicationModal';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Calendar,
  Users,
  Briefcase,
  Globe,
  Heart,
  Share2,
  Flag,
  Sparkles,
  CheckCircle,
  Brain,
  TrendingUp,
  Star,
  ArrowLeft
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  // Find the job from mock data
  const job = mockJobs.find(j => j.id === params.id);

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/jobs')}>
              Browse All Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApplicationSuccess = () => {
    setHasApplied(true);
    setShowApplicationModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Mock company data
  const companyData = {
    size: '50-200 employees',
    founded: '2015',
    website: 'www.example.com',
    benefits: ['Health Insurance', 'Flexible Hours', 'Remote Work', 'Professional Development', '401k Match']
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building className="w-5 h-5" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                    </div>
                    {job.aiMatchScore && (
                      <Badge variant="secondary" className="bg-accent text-accent-foreground">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {job.aiMatchScore}% match
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{job.location}</span>
                      {job.distance && <span className="text-muted-foreground">• {job.distance}</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Posted {formatDate(job.postedDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge>{job.category}</Badge>
                    {job.remote && <Badge variant="outline">Remote</Badge>}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {hasApplied ? (
                    <Button disabled className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Applied
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setShowApplicationModal(true)}
                      className="min-w-32"
                    >
                      Apply Now
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Analysis
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>AI Job Match Analysis</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="text-center">
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary">{job.aiMatchScore}%</span>
                          </div>
                          <p className="text-lg font-medium mb-2">Excellent Match!</p>
                          <p className="text-sm text-muted-foreground">
                            This role aligns well with your skills and experience
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Skills Match</span>
                              <span className="text-sm text-muted-foreground">85%</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Experience Level</span>
                              <span className="text-sm text-muted-foreground">90%</span>
                            </div>
                            <Progress value={90} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Location Fit</span>
                              <span className="text-sm text-muted-foreground">100%</span>
                            </div>
                            <Progress value={100} className="h-2" />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Key Strengths</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>Your React and TypeScript skills match perfectly</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>Experience level aligns with requirements</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>Location is within your preferred distance</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>{job.description}</p>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">Key Responsibilities</h3>
                <ul className="space-y-2">
                  <li>Develop and maintain high-quality web applications</li>
                  <li>Collaborate with cross-functional teams to define and implement new features</li>
                  <li>Write clean, maintainable, and efficient code</li>
                  <li>Participate in code reviews and provide constructive feedback</li>
                  <li>Stay up-to-date with emerging trends and technologies</li>
                </ul>

                <h3 className="text-lg font-semibold mt-6 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>

                <h3 className="text-lg font-semibold mt-6 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About {job.company}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{companyData.size}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Founded {companyData.founded}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{companyData.website}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-3">Benefits</h4>
                  <div className="space-y-2">
                    {companyData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Applications</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">23</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Views</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">157</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Saved</span>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="font-medium">42</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Job */}
            <Card>
              <CardContent className="p-4">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                  <Flag className="w-4 h-4 mr-2" />
                  Report this job
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Jobs */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockJobs.slice(0, 3).filter(j => j.id !== job.id).map((similarJob) => (
              <Card 
                key={similarJob.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/jobs/${similarJob.id}`)}
              >
                <CardHeader>
                  <h3 className="font-medium">{similarJob.title}</h3>
                  <p className="text-sm text-muted-foreground">{similarJob.company}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{similarJob.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{similarJob.salary}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Modal */}
        <JobApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          job={{
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location
          }}
          onSuccess={handleApplicationSuccess}
        />
      </div>
    </div>
  );
}