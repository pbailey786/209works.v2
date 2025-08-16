import { Job } from '../types/job';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Sparkles, TrendingUp, MapPin, Zap } from 'lucide-react';

interface AIRecommendationsProps {
  jobs: Job[];
  onViewDetails: (job: Job) => void;
}

export function AIRecommendations({ jobs, onViewDetails }: AIRecommendationsProps) {
  const topMatches = jobs
    .filter(job => job.aiMatchScore && job.aiMatchScore > 75)
    .sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0))
    .slice(0, 3);

  const trendingSkills = ['React', 'TypeScript', 'Python', 'UX Design', 'Data Analysis'];
  const localTrends = [
    { area: 'Downtown District', growth: '+15%', focus: 'Tech startups' },
    { area: 'Arts Quarter', growth: '+8%', focus: 'Creative agencies' },
    { area: 'Medical District', growth: '+12%', focus: 'Healthcare tech' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI-Powered Job Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Based on your profile, location, and preferences, here are your top job matches:
          </p>
          <div className="space-y-3">
            {topMatches.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{job.title}</h4>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      <Zap className="w-3 h-3 mr-1" />
                      {job.aiMatchScore}% match
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                </div>
                <Button size="sm" onClick={() => onViewDetails(job)}>
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Trending Skills in Your Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {trendingSkills.map((skill, index) => (
                <div key={skill} className="flex items-center justify-between">
                  <span>{skill}</span>
                  <Badge variant="outline">#{index + 1}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Local Job Market Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {localTrends.map((trend) => (
                <div key={trend.area} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{trend.area}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {trend.growth}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{trend.focus}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}