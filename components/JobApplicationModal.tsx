'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
  };
  onSuccess?: () => void;
}

export default function JobApplicationModal({ 
  isOpen, 
  onClose, 
  job,
  onSuccess 
}: JobApplicationModalProps) {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses?.[0]?.emailAddress || '',
    phone: '',
    resumeOption: 'existing',
    resumeFile: null as File | null,
    coverLetter: '',
    hasWorkAuthorization: false,
    agreedToTerms: false
  });

  const handleInputChange = (field: string, value: any) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange('resumeFile', file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setStep(3); // Success step
    
    // Call onSuccess after a delay
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 2000);
  };

  const isStepValid = () => {
    if (step === 1) {
      return applicationData.firstName && 
             applicationData.lastName && 
             applicationData.email && 
             applicationData.phone;
    }
    if (step === 2) {
      return applicationData.hasWorkAuthorization && applicationData.agreedToTerms;
    }
    return true;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={applicationData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={applicationData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={applicationData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={applicationData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-3">
              <Label>Resume</Label>
              <RadioGroup 
                value={applicationData.resumeOption}
                onValueChange={(value) => handleInputChange('resumeOption', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <label 
                    htmlFor="existing" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Use my uploaded resume
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <label 
                    htmlFor="new" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Upload a new resume
                  </label>
                </div>
              </RadioGroup>

              {applicationData.resumeOption === 'new' && (
                <div className="border-2 border-dashed rounded-lg p-4">
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                  <label 
                    htmlFor="resume-upload" 
                    className="flex flex-col items-center cursor-pointer"
                  >
                    {applicationData.resumeFile ? (
                      <div className="flex items-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div className="text-left">
                          <p className="text-sm font-medium">
                            {applicationData.resumeFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(applicationData.resumeFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload resume
                        </span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
              <Textarea
                id="coverLetter"
                value={applicationData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                placeholder="Why are you interested in this position?"
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please review your application before submitting
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Application Summary</h4>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Name:</span> {applicationData.firstName} {applicationData.lastName}</p>
                  <p><span className="text-muted-foreground">Email:</span> {applicationData.email}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {applicationData.phone}</p>
                  <p><span className="text-muted-foreground">Resume:</span> {applicationData.resumeOption === 'existing' ? 'Using existing resume' : applicationData.resumeFile?.name}</p>
                  <p><span className="text-muted-foreground">Cover Letter:</span> {applicationData.coverLetter ? 'Included' : 'Not included'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="workAuth"
                    checked={applicationData.hasWorkAuthorization}
                    onCheckedChange={(checked) => handleInputChange('hasWorkAuthorization', checked)}
                  />
                  <label 
                    htmlFor="workAuth" 
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I am authorized to work in the United States
                  </label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms"
                    checked={applicationData.agreedToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreedToTerms', checked)}
                  />
                  <label 
                    htmlFor="terms" 
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I agree that the information provided is accurate and I consent to the processing of my application
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
            <p className="text-muted-foreground mb-4">
              Your application for {job.title} at {job.company} has been successfully submitted.
            </p>
            <p className="text-sm text-muted-foreground">
              You'll receive a confirmation email shortly.
            </p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === 3 ? 'Success!' : `Apply for ${job.title}`}
          </DialogTitle>
          {step !== 3 && (
            <p className="text-sm text-muted-foreground">
              {job.company} • {job.location}
            </p>
          )}
        </DialogHeader>

        {step !== 3 && (
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1">
              <Progress value={step * 50} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground">
              Step {step} of 2
            </span>
          </div>
        )}

        <div className="space-y-6">
          {renderStep()}

          {step !== 3 && (
            <div className="flex justify-between">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
              
              <div className="ml-auto flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                
                {step === 2 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid() || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={!isStepValid()}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}