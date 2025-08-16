import { useState } from 'react';
import { User, EmployerProfile } from '../types/user';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Building, MapPin, Users, Globe, Upload, CheckCircle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface EmployerOnboardingProps {
  onComplete: (profile: EmployerProfile) => void;
  onSkip: () => void;
}

export function EmployerOnboarding({ onComplete, onSkip }: EmployerOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<Partial<EmployerProfile>>({
    company: '',
    industry: '',
    size: '',
    location: '',
    description: '',
    website: '',
    verified: false
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
    'Manufacturing', 'Marketing', 'Real Estate', 'Food & Beverage',
    'Non-profit', 'Government', 'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees', 
    '51-200 employees',
    '201-1000 employees',
    '1000+ employees'
  ];

  const updateProfile = (field: keyof EmployerProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
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

  const handleComplete = () => {
    const completeProfile: EmployerProfile = {
      company: profile.company || '',
      industry: profile.industry || '',
      size: profile.size || '',
      location: profile.location || '',
      description: profile.description || '',
      website: profile.website,
      logo: profile.logo,
      verified: false
    };
    onComplete(completeProfile);
  };

  const generateAIDescription = () => {
    if (profile.company && profile.industry) {
      const aiDescription = `${profile.company} is a ${profile.size?.toLowerCase() || 'dynamic'} company in the ${profile.industry?.toLowerCase()} industry${profile.location ? ` based in ${profile.location}` : ''}. We are committed to innovation, excellence, and creating value for our customers and employees. Our team is passionate about delivering high-quality solutions and fostering a collaborative work environment where talent thrives.

Join us as we continue to grow and make a meaningful impact in the ${profile.industry?.toLowerCase()} sector. We offer competitive benefits, professional development opportunities, and a culture that values creativity and teamwork.`;
      
      updateProfile('description', aiDescription);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profile.company && profile.industry;
      case 2:
        return profile.size && profile.location;
      case 3:
        return profile.description;
      case 4:
        return true;
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
              <Building className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-medium mb-2">Company Information</h2>
              <p className="text-muted-foreground">Let's start with the basics about your company</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  placeholder="e.g. TechStart Solutions"
                  value={profile.company}
                  onChange={(e) => updateProfile('company', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={profile.industry} onValueChange={(value) => updateProfile('industry', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    placeholder="https://yourcompany.com"
                    value={profile.website}
                    onChange={(e) => updateProfile('website', e.target.value)}
                    className="pl-10 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-medium mb-2">Company Details</h2>
              <p className="text-muted-foreground">Tell us about your company size and location</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="size">Company Size *</Label>
                <Select value={profile.size} onValueChange={(value) => updateProfile('size', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="How many employees?" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Primary Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g. Downtown District, City Name"
                    value={profile.location}
                    onChange={(e) => updateProfile('location', e.target.value)}
                    className="pl-10 mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logo">Company Logo (Optional)</Label>
                <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-medium mb-2">Company Description</h2>
              <p className="text-muted-foreground">Describe your company culture and mission</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description">Company Description *</Label>
                  <Button 
                    onClick={generateAIDescription}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Generate
                  </Button>
                </div>
                <Textarea
                  id="description"
                  placeholder="Tell potential employees about your company culture, mission, and what makes you unique..."
                  value={profile.description}
                  onChange={(e) => updateProfile('description', e.target.value)}
                  className="min-h-32"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will appear on your job postings and company profile
                </p>
              </div>

              <div className="bg-accent/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Pro Tips:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Highlight your company values and culture</li>
                  <li>• Mention benefits and perks you offer</li>
                  <li>• Include what makes your company unique</li>
                  <li>• Keep it engaging but professional</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-medium mb-2">All Set!</h2>
              <p className="text-muted-foreground">Review your company profile before we get started</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{profile.company}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{profile.industry}</Badge>
                      <Badge variant="outline">{profile.size}</Badge>
                      <Badge variant="outline">{profile.location}</Badge>
                    </div>
                  </div>
                  
                  {profile.website && (
                    <div>
                      <Label>Website</Label>
                      <p className="text-sm text-muted-foreground">{profile.website}</p>
                    </div>
                  )}

                  <div>
                    <Label>Description</Label>
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                      {profile.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What's Next?</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• You can post your first job immediately</li>
                <li>• We'll help you find the best local talent</li>
                <li>• AI will rank candidates based on fit</li>
                <li>• You can edit your profile anytime</li>
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
            <h1 className="text-3xl font-medium mb-4">Welcome to LocalJobs AI</h1>
            <p className="text-muted-foreground">
              Let's set up your employer profile to start finding amazing local talent
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
                disabled={!isStepValid()}
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
                Complete Setup
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}