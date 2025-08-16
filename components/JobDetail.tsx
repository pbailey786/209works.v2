import { Job } from '../types/job';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { MapPin, Clock, DollarSign, Briefcase, Building, Zap, ExternalLink } from 'lucide-react';

interface JobDetailProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetail({ job, isOpen, onClose }: JobDetailProps) {
  if (!job) return null;

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{job.title}</DialogTitle>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span className="font-medium text-foreground">{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                  {job.distance && <span>• {job.distance}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Posted {formatPostedDate(job.postedDate)}</span>
                </div>
              </div>
            </div>
            {job.aiMatchScore && job.aiMatchScore > 80 && (
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                <Zap className="w-3 h-3 mr-1" />
                AI Match: {job.aiMatchScore}%
              </Badge>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline" className="capitalize">{job.type}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{job.salary}</span>
            </div>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              {job.category}
            </Badge>
            {job.remote && (
              <Badge variant="secondary">Remote Friendly</Badge>
            )}
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-3">Job Description</h3>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Requirements</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {job.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          {job.aiMatchScore && (
            <div className="bg-accent/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                AI Match Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                Based on your profile and preferences, this job has a {job.aiMatchScore}% compatibility score. 
                The AI detected strong matches in your skill set and career goals.
              </p>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button className="flex-1">
              Apply Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline">Save Job</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}