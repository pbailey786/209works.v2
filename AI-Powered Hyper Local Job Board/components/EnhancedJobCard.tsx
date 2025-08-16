import { useState } from 'react';
import { Job } from '../types/job';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Eye, 
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  Brain,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';

interface EnhancedJobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  userSkills?: string[];
  userExperience?: string;
  userLocation?: string;
}

export function EnhancedJobCard({ 
  job, 
  onViewDetails, 
  userSkills = [], 
  userExperience = '',
  userLocation = ''
}: EnhancedJobCardProps) {
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{
    shouldApply: boolean;
    confidence: number;
    reasons: string[];
    concerns: string[];
    skillMatch: number;
    experienceMatch: number;
    locationScore: number;
  } | null>(null);

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const generateAIRecommendation = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const skillsInJob = job.skills || [];
      const matchedSkills = userSkills.filter(skill => 
        skillsInJob.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );
      
      const skillMatch = skillsInJob.length > 0 ? (matchedSkills.length / skillsInJob.length) * 100 : 50;
      
      // Experience matching logic
      const experienceYears = userExperience.includes('1-3') ? 2 : 
                             userExperience.includes('3-5') ? 4 :
                             userExperience.includes('5-10') ? 7 : 5;
      
      const experienceMatch = Math.min(100, (experienceYears / 5) * 100);
      
      // Location scoring
      const locationScore = userLocation && job.location.toLowerCase().includes(userLocation.toLowerCase()) ? 100 : 
                           job.remote ? 90 : 60;
      
      const overallScore = (skillMatch * 0.4 + experienceMatch * 0.3 + locationScore * 0.3);
      const shouldApply = overallScore >= 65;
      
      const reasons = [];
      const concerns = [];
      
      if (skillMatch >= 70) {
        reasons.push(`Strong skill match (${Math.round(skillMatch)}% of required skills)`);
      } else if (skillMatch >= 50) {
        reasons.push(`Good skill match (${Math.round(skillMatch)}% of required skills)`);
      } else {
        concerns.push(`Limited skill overlap (${Math.round(skillMatch)}% match)`);
      }
      
      if (experienceMatch >= 80) {
        reasons.push('Your experience level is ideal for this role');
      } else if (experienceMatch >= 60) {
        reasons.push('Your experience is well-suited for this position');
      } else {
        concerns.push('This role may require more experience than you have');
      }
      
      if (locationScore >= 90) {
        reasons.push('Perfect location match or remote opportunity');
      } else if (locationScore >= 70) {
        reasons.push('Good location compatibility');
      } else {
        concerns.push('Location may require significant commuting');
      }
      
      if (job.aiMatchScore && job.aiMatchScore >= 80) {
        reasons.push('High AI compatibility score for your profile');
      }
      
      if (shouldApply && reasons.length < 2) {
        reasons.push('Company culture appears to align with your preferences');
      }
      
      if (!shouldApply && concerns.length < 2) {
        concerns.push('Consider developing additional skills before applying');
      }
      
      setAiRecommendation({
        shouldApply,
        confidence: Math.round(overallScore),
        reasons: reasons.slice(0, 3),
        concerns: concerns.slice(0, 2),
        skillMatch: Math.round(skillMatch),
        experienceMatch: Math.round(experienceMatch),
        locationScore: Math.round(locationScore)
      });
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleShouldIApply = () => {
    if (!aiRecommendation) {
      generateAIRecommendation();
    }
    setShowAIAnalysis(true);
  };

  return (
    <>
      <Card className="border border-border hover:shadow-lg transition-all duration-200 hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-2 line-clamp-1">{job.title}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{job.company}</span>
              </div>
            </div>
            {job.aiMatchScore && (
              <Badge variant="secondary" className="bg-accent text-accent-foreground flex items-center gap-1 flex-shrink-0">
                <Sparkles className="w-3 h-3" />
                {job.aiMatchScore}% match
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              {job.remote && (
                <Badge variant="outline" className="text-xs">
                  Remote
                </Badge>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{timeAgo(job.postedDate)}</span>
              </div>
            </div>

            {job.salary && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-600">{job.salary}</span>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>
              
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {job.skills.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skills.length - 4} more
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={() => onViewDetails(job)}
                variant="outline"
                size="sm"
                className="flex-1 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Button>
              <Button
                onClick={handleShouldIApply}
                size="sm"
                className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Brain className="w-4 h-4" />
                Should I Apply?
              </Button>
            </div>

            {/* Quick stats */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {Math.floor(Math.random() * 50) + 10} applicants
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {Math.floor(Math.random() * 100) + 50} views
                </span>
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {job.type}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Dialog */}
      <Dialog open={showAIAnalysis} onOpenChange={setShowAIAnalysis}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Application Analysis
            </DialogTitle>
          </DialogHeader>
          
          {isAnalyzing ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary animate-spin" />
              </div>
              <div>
                <h3 className="font-medium mb-2">Analyzing your fit for this role...</h3>
                <Progress value={66} className="h-2 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Comparing your skills, experience, and preferences
                </p>
              </div>
            </div>
          ) : aiRecommendation ? (
            <div className="space-y-6">
              {/* Overall Recommendation */}
              <div className="text-center space-y-4">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                  aiRecommendation.shouldApply ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {aiRecommendation.shouldApply ? (
                    <ThumbsUp className="w-10 h-10 text-green-600" />
                  ) : (
                    <AlertCircle className="w-10 h-10 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h3 className={`text-xl font-medium ${
                    aiRecommendation.shouldApply ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {aiRecommendation.shouldApply ? 'You should apply!' : 'Consider carefully'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    AI Confidence: {aiRecommendation.confidence}%
                  </p>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-medium text-blue-600">
                      {aiRecommendation.skillMatch}%
                    </div>
                    <div className="text-xs text-muted-foreground">Skill Match</div>
                    <Progress value={aiRecommendation.skillMatch} className="h-1" />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-medium text-green-600">
                      {aiRecommendation.experienceMatch}%
                    </div>
                    <div className="text-xs text-muted-foreground">Experience</div>
                    <Progress value={aiRecommendation.experienceMatch} className="h-1" />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-medium text-purple-600">
                      {aiRecommendation.locationScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Location</div>
                    <Progress value={aiRecommendation.locationScore} className="h-1" />
                  </div>
                </div>
              </div>

              {/* Reasons to Apply */}
              {aiRecommendation.reasons.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    Why you should apply
                  </h4>
                  <div className="space-y-2">
                    {aiRecommendation.reasons.map((reason, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concerns */}
              {aiRecommendation.concerns.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2 text-yellow-700">
                    <AlertCircle className="w-4 h-4" />
                    Things to consider
                  </h4>
                  <div className="space-y-2">
                    {aiRecommendation.concerns.map((concern, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-yellow-600 mt-1.5 flex-shrink-0" />
                        <span>{concern}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => onViewDetails(job)}
                  variant="outline" 
                  className="flex-1"
                >
                  View Full Job Details
                </Button>
                {aiRecommendation.shouldApply && (
                  <Button className="flex-1">
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Click "Analyze" to get AI recommendations</p>
              <Button onClick={generateAIRecommendation} className="mt-4">
                <Brain className="w-4 h-4 mr-2" />
                Analyze Fit
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}