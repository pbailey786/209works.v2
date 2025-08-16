'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  FileText,
  Eye,
  ArrowUpDown
} from 'lucide-react';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  type: string;
  appliedDate: string;
  status: 'pending' | 'viewed' | 'interviewing' | 'accepted' | 'rejected';
  salary?: string;
  matchScore?: number;
  coverLetter: boolean;
  lastActivity?: string;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Mock data - would come from database
  const applications: Application[] = [
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'Tech Innovations Inc',
      location: 'Stockton, CA',
      type: 'Full-time',
      appliedDate: '2024-01-20',
      status: 'pending',
      salary: '$120k - $150k',
      matchScore: 95,
      coverLetter: true,
      lastActivity: '2 days ago'
    },
    {
      id: '2',
      jobTitle: 'Full Stack Engineer',
      company: 'Digital Solutions Co',
      location: 'Modesto, CA',
      type: 'Full-time',
      appliedDate: '2024-01-19',
      status: 'viewed',
      salary: '$100k - $130k',
      matchScore: 88,
      coverLetter: true,
      lastActivity: 'Today'
    },
    {
      id: '3',
      jobTitle: 'React Developer',
      company: 'StartUp Hub',
      location: 'Tracy, CA',
      type: 'Full-time',
      appliedDate: '2024-01-18',
      status: 'interviewing',
      salary: '$90k - $120k',
      matchScore: 82,
      coverLetter: false,
      lastActivity: '1 week ago'
    },
    {
      id: '4',
      jobTitle: 'UI/UX Developer',
      company: 'Design Studios',
      location: 'Lodi, CA',
      type: 'Contract',
      appliedDate: '2024-01-15',
      status: 'rejected',
      salary: '$80k - $100k',
      matchScore: 75,
      coverLetter: true,
      lastActivity: '2 weeks ago'
    },
    {
      id: '5',
      jobTitle: 'JavaScript Developer',
      company: 'Web Agency',
      location: 'Manteca, CA',
      type: 'Full-time',
      appliedDate: '2024-01-14',
      status: 'pending',
      salary: '$85k - $110k',
      matchScore: 90,
      coverLetter: false,
      lastActivity: '2 weeks ago'
    }
  ];

  // Filter and sort applications
  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      } else if (sortBy === 'company') {
        return a.company.localeCompare(b.company);
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'viewed':
        return <Eye className="h-4 w-4" />;
      case 'interviewing':
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
      case 'interviewing':
        return 'default';
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Application Sent';
      case 'viewed':
        return 'Viewed by Employer';
      case 'interviewing':
        return 'Interview Process';
      case 'accepted':
        return 'Offer Extended';
      case 'rejected':
        return 'Not Selected';
      default:
        return status;
    }
  };

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    viewed: applications.filter(app => app.status === 'viewed').length,
    interviewing: applications.filter(app => app.status === 'interviewing').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">Track and manage all your job applications in one place</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Card className="cursor-pointer hover:border-primary" onClick={() => setStatusFilter('all')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{statusCounts.all}</div>
            <p className="text-xs text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary" onClick={() => setStatusFilter('pending')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary" onClick={() => setStatusFilter('viewed')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.viewed}</div>
            <p className="text-xs text-muted-foreground">Viewed</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary" onClick={() => setStatusFilter('interviewing')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{statusCounts.interviewing}</div>
            <p className="text-xs text-muted-foreground">Interviewing</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary" onClick={() => setStatusFilter('accepted')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.accepted}</div>
            <p className="text-xs text-muted-foreground">Accepted</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary" onClick={() => setStatusFilter('rejected')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Applied</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No applications found matching your criteria</p>
              <Button onClick={() => router.push('/jobs')}>Browse Jobs</Button>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                        {application.jobTitle}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {application.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {application.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {application.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Applied {new Date(application.appliedDate).toLocaleDateString()}
                      </span>
                      {application.salary && (
                        <span className="text-muted-foreground">{application.salary}</span>
                      )}
                      {application.matchScore && (
                        <Badge variant="outline">{application.matchScore}% match</Badge>
                      )}
                      {application.coverLetter && (
                        <Badge variant="outline" className="gap-1">
                          <FileText className="h-3 w-3" />
                          Cover Letter
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(application.status)} className="gap-1">
                        {getStatusIcon(application.status)}
                        {getStatusLabel(application.status)}
                      </Badge>
                      {application.lastActivity && (
                        <span className="text-xs text-muted-foreground">
                          Last activity: {application.lastActivity}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/jobs/${application.id}`)}
                    >
                      View Job
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      View Application
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}