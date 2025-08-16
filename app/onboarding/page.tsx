'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Briefcase, Search, Building2, Sparkles } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [userType, setUserType] = useState<'job-seeker' | 'employer' | ''>('');

  const handleContinue = async () => {
    if (!userType || !user) return;

    // Update user metadata with their role
    await user.update({
      publicMetadata: {
        role: userType
      }
    });

    // Redirect based on user type
    if (userType === 'job-seeker') {
      router.push('/dashboard');
    } else {
      router.push('/employer');
    }
  };

  return (
    <div className="min-h-screen bg-accent/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to 209.works!</CardTitle>
          <CardDescription>
            Let's get you set up. How would you like to use 209.works?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={userType} onValueChange={(value) => setUserType(value as 'job-seeker' | 'employer')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label htmlFor="job-seeker" className="cursor-pointer">
                <div className={`border-2 rounded-lg p-6 space-y-3 transition-all ${
                  userType === 'job-seeker' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="job-seeker" id="job-seeker" className="sr-only" />
                  <div className="flex items-center justify-between">
                    <Search className="w-8 h-8 text-primary" />
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      userType === 'job-seeker'
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {userType === 'job-seeker' && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">I'm looking for a job</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Browse local opportunities, get AI-powered matches, and track applications
                    </p>
                  </div>
                </div>
              </label>

              <label htmlFor="employer" className="cursor-pointer">
                <div className={`border-2 rounded-lg p-6 space-y-3 transition-all ${
                  userType === 'employer' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}>
                  <RadioGroupItem value="employer" id="employer" className="sr-only" />
                  <div className="flex items-center justify-between">
                    <Building2 className="w-8 h-8 text-primary" />
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      userType === 'employer'
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {userType === 'employer' && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">I'm hiring talent</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Post jobs, review AI-ranked candidates, and manage applications
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </RadioGroup>

          <div className="pt-4">
            <Button 
              onClick={handleContinue} 
              disabled={!userType}
              className="w-full"
              size="lg"
            >
              Continue
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              You can switch between modes anytime from your account settings
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}