import { useState } from 'react';
import { User, JobSeekerProfile } from '../types/user';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  User as UserIcon,
  MapPin,
  Briefcase,
  Target,
  Zap,
  Brain
} from 'lucide-react';

interface JobSeekerOnboardingProps {
  onComplete: (profile: JobSeekerProfile) => void;
  onSkip: () => void;
}

export function JobSeekerOnboarding({ onComplete, onSkip }: JobSeekerOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [profile, setProfile] = useState<Partial<JobSeekerProfile>>({
    title: '',
    location: '',
    skills: [],
    experience: '',
    education: '',
    preferences: {
      jobTypes: [],
      salaryRange: '',
      remote: false,
      categories: []
    }
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const jobTypes = ['full-time', 'part-time', 'contract', 'remote'];
  const categories = ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Design', 'Other'];
  const experienceLevels = ['Entry Level (0-1 years)', '1-3 years', '3-5 years', '5-10 years', '10+ years'];

  const updateProfile = (field: keyof JobSeekerProfile, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  const updatePreferences = (field: string, value: any) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        [field]: value
      }
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedResume(file);
      setIsParsingResume(true);

      // Simulate resume parsing with AI
      setTimeout(() => {
        // Mock parsed data - in real app, this would come from AI service
        const parsedData = {
          title: 'Frontend Developer',
          skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js', 'Git'],
          experience: '3-5 years',
          education: 'Bachelor\'s Degree in Computer Science',
          location: 'Downtown District'
        };

        setProfile({
          ...profile,
          ...parsedData
        });
        
        setIsParsingResume(false);
        nextStep();
      }, 3000);
    }
  };

  const addSkill = (skill: string) => {
    if (!profile.skills?.includes(skill)) {
      updateProfile('skills', [...(profile.skills || []), skill]);
    }
  };

  const removeSkill = (skill: string) => {
    updateProfile('skills', profile.skills?.filter(s => s !== skill) || []);
  };

  const toggleJobType = (type: string, checked: boolean) => {
    const currentTypes = profile.preferences?.jobTypes || [];
    if (checked) {
      updatePreferences('jobTypes', [...currentTypes, type]);
    } else {
      updatePreferences('jobTypes', currentTypes.filter(t => t !== type));
    }
  };

  const toggleCategory = (category: string, checked: boolean) => {
    const currentCategories = profile.preferences?.categories || [];
    if (checked) {
      updatePreferences('categories', [...currentCategories, category]);
    } else {
      updatePreferences('categories', currentCategories.filter(c => c !== category));
    }
  };

  const handleComplete = () => {
    const completeProfile: JobSeekerProfile = {
      title: profile.title || '',
      location: profile.location || '',
      skills: profile.skills || [],
      experience: profile.experience || '',
      education: profile.education || '',
      preferences: {
        jobTypes: profile.preferences?.jobTypes || [],
        salaryRange: profile.preferences?.salaryRange || '',
        remote: profile.preferences?.remote || false,
        categories: profile.preferences?.categories || []
      },
      aiResumeScore: 85,
      aiRecommendations: [
        'Your skills are in high demand in the local market',
        'Consider adding more specific technologies to your profile',
        'Your experience level is perfect for mid-level positions'
      ]
    };
    onComplete(completeProfile);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
      case 2: // Resume upload step
        return true;
      case 3:
        return profile.title && profile.location && profile.experience;
      case 4:
        return profile.skills && profile.skills.length > 0;
      case 5:
        return profile.preferences?.jobTypes && profile.preferences.jobTypes.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <UserIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-medium mb-2">Welcome!</h2>
              <p className="text-muted-foreground">
                Let's build your professional profile to find the perfect local jobs
              </p>
            </div>

            <div className="bg-accent/50 p-6 rounded-lg space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI-Powered Profile Creation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span>Resume parsing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>Job matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Smart recommendations</span>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p>We'll help you create a compelling profile that attracts employers.</p>
              <p className="text-sm text-muted-foreground">This takes about 3-4 minutes to complete.</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-medium mb-2">Upload Your Resume</h2>
              <p className="text-muted-foreground">
                Our AI will extract your information to build your profile automatically
              </p>
            </div>

            {!uploadedResume && !isParsingResume && (
              <div>
                <label htmlFor="resume-upload">
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <div className="space-y-2">
                      <p className="font-medium">Drop your resume here or click to browse</p>
                      <p className="text-sm text-muted-foreground">
                        Supports PDF, DOC, DOCX • Max 5MB
                      </p>
                    </div>
                  </div>
                </label>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {isParsingResume && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">AI is analyzing your resume...</h3>
                  <Progress value={66} className="h-2 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Extracting skills, experience, and qualifications
                  </p>
                </div>
              </div>
            )}

            {uploadedResume && !isParsingResume && (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
                <div>
                  <h3 className="font-medium mb-2">Resume parsed successfully!</h3>
                  <p className="text-sm text-muted-foreground">
                    We've extracted your information. Let's review and refine it.
                  </p>
                </div>
              </div>
            )}

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(3)}
                className="mr-4"
              >
                Skip - Enter manually
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-medium mb-2">Professional Information</h2>
              <p className="text-muted-foreground">
                {uploadedResume ? 'Review and update your information' : 'Tell us about your professional background'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title / Role *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Frontend Developer, Marketing Manager"
                  value={profile.title}
                  onChange={(e) => updateProfile('title', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g. Downtown District"
                    value={profile.location}
                    onChange={(e) => updateProfile('location', e.target.value)}
                    className="pl-10 mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="experience">Experience Level *</Label>
                <Select value={profile.experience} onValueChange={(value) => updateProfile('experience', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  placeholder="e.g. Bachelor's in Computer Science"
                  value={profile.education}
                  onChange={(e) => updateProfile('education', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Zap className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-medium mb-2">Your Skills</h2>
              <p className="text-muted-foreground">
                {uploadedResume ? 'We found these skills in your resume. Add or remove as needed.' : 'Add your key skills and technologies'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Current Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2 p-4 border border-border rounded-lg min-h-16">
                  {profile.skills?.map((skill, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                  {(!profile.skills || profile.skills.length === 0) && (
                    <p className="text-sm text-muted-foreground">No skills added yet</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Suggested Skills (Click to add)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    'JavaScript', 'React', 'Python', 'Node.js', 'SQL', 'HTML/CSS',
                    'Git', 'AWS', 'TypeScript', 'Project Management', 'Marketing',
                    'Data Analysis', 'Photoshop', 'Excel'
                  ].filter(skill => !profile.skills?.includes(skill)).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => addSkill(skill)}
                    >
                      + {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="custom-skill">Add Custom Skill</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="custom-skill"
                    placeholder="Enter a skill"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          addSkill(input.value.trim());
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <Button 
                    onClick={(e) => {
                      const input = document.getElementById('custom-skill') as HTMLInputElement;
                      if (input?.value.trim()) {
                        addSkill(input.value.trim());
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-medium mb-2">Job Preferences</h2>
              <p className="text-muted-foreground">Help us find jobs that match what you're looking for</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Job Types</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {jobTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={profile.preferences?.jobTypes?.includes(type)}
                        onCheckedChange={(checked) => toggleJobType(type, checked as boolean)}
                      />
                      <Label htmlFor={`type-${type}`} className="capitalize">
                        {type.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Industries of Interest</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={profile.preferences?.categories?.includes(category)}
                        onCheckedChange={(checked) => toggleCategory(category, checked as boolean)}
                      />
                      <Label htmlFor={`cat-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="salary">Desired Salary Range</Label>
                <Input
                  id="salary"
                  placeholder="e.g. $60,000 - $80,000"
                  value={profile.preferences?.salaryRange}
                  onChange={(e) => updatePreferences('salaryRange', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label className="text-base font-medium">Open to Remote Work</Label>
                  <p className="text-sm text-muted-foreground">Include remote and hybrid positions</p>
                </div>
                <Switch
                  checked={profile.preferences?.remote}
                  onCheckedChange={(checked) => updatePreferences('remote', checked)}
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-medium mb-2">Profile Complete!</h2>
              <p className="text-muted-foreground">Your AI-powered job search is ready to begin</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">{profile.title}</h3>
                    <p className="text-sm text-muted-foreground">{profile.location} • {profile.experience}</p>
                  </div>

                  <div>
                    <Label>Skills</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.skills?.slice(0, 5).map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                      {profile.skills && profile.skills.length > 5 && (
                        <Badge variant="outline">+{profile.skills.length - 5} more</Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Preferences</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.preferences?.jobTypes?.map((type, index) => (
                        <Badge key={index} variant="outline" className="capitalize">
                          {type.replace('-', ' ')}
                        </Badge>
                      ))}
                      {profile.preferences?.remote && (
                        <Badge variant="outline">Remote OK</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                What's Next?
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• AI will immediately start finding relevant jobs</li>
                <li>• You'll get personalized job recommendations</li>
                <li>• Employers can discover your profile</li>
                <li>• Access to premium AI features and insights</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-accent/20 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium mb-4">Build Your Profile</h1>
            <p className="text-muted-foreground">
              AI-powered profile creation for better job matches
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid() || isParsingResume}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid()}
                className="flex items-center gap-2"
              >
                Start Job Search
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}