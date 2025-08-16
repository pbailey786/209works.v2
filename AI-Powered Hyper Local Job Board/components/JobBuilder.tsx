import { useState } from 'react';
import { Job } from '../types/job';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Sparkles, Plus, X, MapPin, DollarSign, Briefcase, Eye } from 'lucide-react';
import { categories, jobTypes } from '../data/mockJobs';

interface JobBuilderProps {
  onSave: (job: Partial<Job>) => void;
  onPreview: (job: Partial<Job>) => void;
}

export function JobBuilder({ onSave, onPreview }: JobBuilderProps) {
  const [jobData, setJobData] = useState<Partial<Job>>({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: '',
    description: '',
    requirements: [],
    skills: [],
    category: '',
    remote: false
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    'Consider adding "2+ years experience" to requirements',
    'Include specific technologies in the skills section',
    'Mention company culture and benefits in description'
  ]);

  const updateJobData = (field: keyof Job, value: any) => {
    setJobData({ ...jobData, [field]: value });
  };

  const addRequirement = () => {
    if (newRequirement.trim() && jobData.requirements) {
      updateJobData('requirements', [...jobData.requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    if (jobData.requirements) {
      const updated = jobData.requirements.filter((_, i) => i !== index);
      updateJobData('requirements', updated);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && jobData.skills) {
      updateJobData('skills', [...jobData.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    if (jobData.skills) {
      const updated = jobData.skills.filter((_, i) => i !== index);
      updateJobData('skills', updated);
    }
  };

  const generateAIDescription = () => {
    const aiDescription = `We are seeking a talented ${jobData.title} to join our dynamic team at ${jobData.company}. This ${jobData.type} position offers an exciting opportunity to contribute to innovative projects while working in our ${jobData.location} office${jobData.remote ? ' with remote work flexibility' : ''}.\n\nIn this role, you will be responsible for delivering high-quality solutions and collaborating with cross-functional teams to drive success. We offer competitive compensation${jobData.salary ? ` (${jobData.salary})` : ''} and a comprehensive benefits package.\n\nJoin us in creating exceptional experiences and growing your career in a supportive environment.`;
    
    updateJobData('description', aiDescription);
  };

  const handleSave = () => {
    const completeJob = {
      ...jobData,
      id: Math.random().toString(36).substr(2, 9),
      postedDate: new Date().toISOString().split('T')[0],
      requirements: jobData.requirements || [],
      skills: jobData.skills || []
    };
    onSave(completeJob);
  };

  const handlePreview = () => {
    onPreview(jobData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-2">Create Job Posting</h1>
          <p className="text-muted-foreground">AI-powered job builder to attract the best local talent</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={jobData.title || ''}
                      onChange={(e) => updateJobData('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Your company name"
                      value={jobData.company || ''}
                      onChange={(e) => updateJobData('company', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. Downtown District"
                        value={jobData.location || ''}
                        onChange={(e) => updateJobData('location', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Salary Range</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. $80,000 - $120,000"
                        value={jobData.salary || ''}
                        onChange={(e) => updateJobData('salary', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Job Type</Label>
                    <Select value={jobData.type || 'full-time'} onValueChange={(value) => updateJobData('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.filter(type => type !== 'All Types').map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={jobData.category || ''} onValueChange={(value) => updateJobData('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat !== 'All Categories').map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="remote"
                    checked={jobData.remote || false}
                    onCheckedChange={(checked) => updateJobData('remote', checked)}
                  />
                  <Label htmlFor="remote">Remote work available</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Job Description
                  <Button
                    onClick={generateAIDescription}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Generate
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe the role, responsibilities, and what makes your company great..."
                  value={jobData.description || ''}
                  onChange={(e) => updateJobData('description', e.target.value)}
                  className="min-h-32"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a requirement..."
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                  />
                  <Button onClick={addRequirement} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {jobData.requirements?.map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                      <span>{req}</span>
                      <Button
                        onClick={() => removeRequirement(index)}
                        size="sm"
                        variant="ghost"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobData.skills?.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      <Button
                        onClick={() => removeSkill(index)}
                        size="sm"
                        variant="ghost"
                        className="p-0 h-auto ml-1"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    AI suggestions to improve your job posting:
                  </p>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-2 bg-accent/50 rounded text-sm">
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handlePreview} variant="outline" className="w-full flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview Job
                </Button>
                <Button onClick={handleSave} className="w-full">
                  Publish Job
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Your job will be reviewed and published within 24 hours
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}