import { useState } from 'react';
import { User } from '../types/user';
import { SubscriptionPlan, CreditPackage } from '../types/subscription';
import { employerPlans, creditPackages } from '../data/subscriptionPlans';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Check, Star, Zap, CreditCard, Users, BarChart3, Sparkles } from 'lucide-react';

interface EmployerSubscriptionProps {
  user: User | null;
  onSubscribe: (planId: string) => void;
  onPurchaseCredits: (packageId: string) => void;
}

export function EmployerSubscription({ user, onSubscribe, onPurchaseCredits }: EmployerSubscriptionProps) {
  const [isYearly, setIsYearly] = useState(false);
  
  const currentSubscription = user?.subscription;
  const currentCredits = currentSubscription?.credits || 0;
  const usedCredits = currentSubscription?.usedCredits || 0;

  const getYearlyPrice = (monthlyPrice: number) => {
    return Math.floor(monthlyPrice * 12 * 0.83); // 17% discount for yearly
  };

  const formatPrice = (plan: SubscriptionPlan) => {
    if (plan.price === 0) return 'Free';
    const price = isYearly ? getYearlyPrice(plan.price) : plan.price;
    const period = isYearly ? 'year' : 'month';
    return `$${price}/${period}`;
  };

  const formatSavings = (plan: SubscriptionPlan) => {
    if (plan.price === 0 || !isYearly) return null;
    const savings = (plan.price * 12) - getYearlyPrice(plan.price);
    return `Save $${savings}/year`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-medium mb-4">Choose Your Hiring Plan</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find the perfect plan to attract top local talent with AI-powered hiring tools
          </p>
          
          {currentSubscription && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-lg mb-6">
              <CreditCard className="w-4 h-4" />
              <span>Current Credits: {currentCredits - usedCredits} remaining</span>
            </div>
          )}
        </div>

        <Tabs defaultValue="subscriptions" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto">
            <TabsTrigger value="subscriptions">Monthly Plans</TabsTrigger>
            <TabsTrigger value="credits">Pay-Per-Post</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-8">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <Label htmlFor="yearly-toggle">Monthly</Label>
              <Switch
                id="yearly-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <Label htmlFor="yearly-toggle" className="flex items-center gap-2">
                Yearly
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Save 17%
                </Badge>
              </Label>
            </div>

            {/* Subscription Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {employerPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative border-2 transition-all hover:shadow-lg ${
                    plan.popular ? 'border-primary shadow-md' : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="text-3xl font-medium">
                        {formatPrice(plan)}
                      </div>
                      {formatSavings(plan) && (
                        <div className="text-sm text-green-600">
                          {formatSavings(plan)}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          Job Posts
                        </span>
                        <span className="font-medium">
                          {plan.jobPosts === -1 ? 'Unlimited' : plan.jobPosts}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Applications
                        </span>
                        <span className="font-medium">
                          {plan.applications === -1 ? 'Unlimited' : plan.applications}
                        </span>
                      </div>
                      
                      {plan.aiFeatures && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            AI Features
                          </span>
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      
                      {plan.analytics && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                          </span>
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => onSubscribe(plan.id)}
                      className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {currentSubscription?.planId === plan.id ? 'Current Plan' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="credits" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium mb-4">Pay-Per-Post Credits</h2>
              <p className="text-muted-foreground">
                Perfect for occasional hiring. Each credit allows you to post one job for 30 days.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {creditPackages.map((pkg) => (
                <Card 
                  key={pkg.id}
                  className={`border-2 transition-all hover:shadow-lg ${
                    pkg.popular ? 'border-primary shadow-md' : 'border-border'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Best Value
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle>{pkg.name}</CardTitle>
                    <div className="text-3xl font-medium">${pkg.price}</div>
                    <div className="text-sm text-muted-foreground">
                      ${(pkg.price / (pkg.credits + (pkg.bonus || 0))).toFixed(2)} per post
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                      <div className="text-lg font-medium">
                        {pkg.credits} Credits
                        {pkg.bonus && (
                          <span className="text-green-600"> + {pkg.bonus} Bonus</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {pkg.credits + (pkg.bonus || 0)} job posts total
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>30-day job visibility</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Unlimited applications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Basic applicant filtering</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>No expiration</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => onPurchaseCredits(pkg.id)}
                      className="w-full"
                      variant={pkg.popular ? 'default' : 'outline'}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Purchase Credits
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Feature Comparison */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-medium mb-4">Not sure which plan is right for you?</h3>
          <p className="text-muted-foreground mb-6">
            All plans include our core features: local job posting, candidate applications, and basic analytics.
          </p>
          <Button variant="outline" size="lg">
            Compare All Features
          </Button>
        </div>
      </div>
    </div>
  );
}