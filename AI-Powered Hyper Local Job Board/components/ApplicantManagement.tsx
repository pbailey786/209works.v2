import { useState, useMemo } from 'react';
import { User, JobApplication } from '../types/user';
import { Job } from '../types/job';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { 
  Search, 
  Filter, 
  Star, 
  Eye, 
  MessageCircle, 
  Download, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Sparkles,
  TrendingUp,
  Users,
  FileText,
  MapPin,
  Clock,
  Award,
  Zap
} from 'lucide-react';

interface ApplicantManagementProps {
  user: User;
  jobs: Job[];
  applications: JobApplication[];
  onUpdateApplicationStatus: (id: string, status: string) => void;
  onAddNote: (id: string, note: string) => void;
}

export function ApplicantManagement({ 
  user, 
  jobs, 
  applications, 
  onUpdateApplicationStatus, 
  onAddNote 
}: ApplicantManagementProps) {
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('ai-ranking');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [newNote, setNewNote] = useState('');

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = applications.filter(app => {
      const matchesJob = selectedJob === 'all' || app.jobId === selectedJob;
      const matchesSearch = !searchTerm || 
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesJob && matchesSearch && matchesStatus;
    });

    // Sort applications
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ai-ranking':
          return (b.aiRanking || 0) - (a.aiRanking || 0);
        case 'ai-match':
          return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
        case 'date':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'name':
          return a.applicantName.localeCompare(b.applicantName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [applications, selectedJob, searchTerm, statusFilter, sortBy]);

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    interviewed: applications.filter(app => app.status === 'interviewed').length,
    hired: applications.filter(app => app.status === 'hired').length
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

  const getAIRankingColor = (ranking: number) => {
    if (ranking >= 90) return 'text-green-600';
    if (ranking >= 70) return 'text-blue-600';
    if (ranking >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAddNote = () => {
    if (selectedApplication && newNote.trim()) {
      onAddNote(selectedApplication.id, newNote.trim());
      setNewNote('');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-2">Applicant Management</h1>
        <p className="text-muted-foreground">AI-powered candidate ranking and application tracking</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-medium">{stats.total}</p>
              </div>
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-medium">{stats.pending}</p>
              </div>
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviewing</p>
                <p className="text-xl font-medium">{stats.reviewing}</p>
              </div>
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interviewed</p>
                <p className="text-xl font-medium">{stats.interviewed}</p>
              </div>
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hired</p>
                <p className="text-xl font-medium">{stats.hired}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all-applications">All Applications</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="bulk-actions">Bulk Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="all-applications" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Jobs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="interviewed">Interviewed</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-ranking">AI Ranking</SelectItem>
                    <SelectItem value="ai-match">AI Match Score</SelectItem>
                    <SelectItem value="date">Application Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Applications Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>AI Ranking</TableHead>
                    <TableHead>AI Match</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => {
                    const job = jobs.find(j => j.id === application.jobId);
                    return (
                      <TableRow key={application.id} className="cursor-pointer hover:bg-accent/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(application.applicantName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{application.applicantName}</div>
                              <div className="text-sm text-muted-foreground">{application.applicantEmail}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {application.location}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{job?.title}</div>
                            <div className="text-sm text-muted-foreground">{job?.company}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Sparkles className={`w-4 h-4 ${getAIRankingColor(application.aiRanking || 0)}`} />
                            <span className={`font-medium ${getAIRankingColor(application.aiRanking || 0)}`}>
                              {application.aiRanking || 0}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{application.aiMatchScore || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedApplication(application)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Top Candidates This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredApplications.slice(0, 5).map((app, index) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{app.applicantName}</div>
                          <div className="text-sm text-muted-foreground">
                            AI Ranking: {app.aiRanking || 0}%
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Hiring Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Average AI Match Score</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Response Rate</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Interview Conversion</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bulk-actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Select multiple applications to perform bulk actions like status updates, sending messages, or scheduling interviews.
              </p>
              <div className="flex gap-4">
                <Button variant="outline">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Bulk Approve
                </Button>
                <Button variant="outline">
                  <XCircle className="w-4 h-4 mr-2" />
                  Bulk Reject
                </Button>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interviews
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Application Detail Modal */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(selectedApplication.applicantName)}</AvatarFallback>
                  </Avatar>
                  {selectedApplication.applicantName}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Sparkles className={`w-8 h-8 mx-auto mb-2 ${getAIRankingColor(selectedApplication.aiRanking || 0)}`} />
                        <div className={`text-2xl font-medium ${getAIRankingColor(selectedApplication.aiRanking || 0)}`}>
                          {selectedApplication.aiRanking || 0}%
                        </div>
                        <div className="text-sm text-muted-foreground">AI Ranking</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Zap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl font-medium">{selectedApplication.aiMatchScore || 0}%</div>
                        <div className="text-sm text-muted-foreground">AI Match</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <div className="text-2xl font-medium">{selectedApplication.aiResumeScore || 0}%</div>
                        <div className="text-sm text-muted-foreground">Resume Score</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Candidate Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Email:</strong> {selectedApplication.applicantEmail}</div>
                      <div><strong>Location:</strong> {selectedApplication.location}</div>
                      <div><strong>Experience:</strong> {selectedApplication.experience}</div>
                      <div><strong>Applied:</strong> {new Date(selectedApplication.appliedDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedApplication.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedApplication.coverLetter && (
                  <div>
                    <h3 className="font-medium mb-3">Cover Letter</h3>
                    <p className="text-sm text-muted-foreground bg-accent/50 p-4 rounded-lg">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-3">Status & Actions</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <Select 
                      value={selectedApplication.status} 
                      onValueChange={(value) => onUpdateApplicationStatus(selectedApplication.id, value)}
                    >
                      <SelectTrigger className="w-48">
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
                    
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                    
                    <Button variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Interview
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add a note about this candidate..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button onClick={handleAddNote}>Add Note</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}