'use client';

import { Job } from '@/types/job';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Briefcase, Zap } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
}

export function JobCard({ job, onViewDetails }: JobCardProps) {
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
    <Card className="hover:shadow-lg transition-shadow cursor-pointer border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-lg">{job.title}</h3>
              {job.aiMatchScore && job.aiMatchScore > 80 && (
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Match: {job.aiMatchScore}%
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-1">{job.company}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
                {job.distance && <span>• {job.distance}</span>}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatPostedDate(job.postedDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline" className="capitalize">{job.type}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{job.salary}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 4} more
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              {job.category}
            </Badge>
            <Button 
              onClick={() => onViewDetails(job)}
              size="sm"
              className="font-medium"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}