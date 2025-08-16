import { useState } from 'react';
import { User } from '../types/user';
import { SubscriptionPlan } from '../types/subscription';
import { jobSeekerPlans } from '../data/subscriptionPlans';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Check, Star, Sparkles, TrendingUp, Target, Zap, Clock, Shield } from 'lucide-react';

interface JobSeekerSubscriptionProps {
  user: User | null;
  onSubscribe: (planId: string) => void;
}

export function JobSeekerSubscription({ user, onSubscribe }: JobSeekerSubscriptionProps) {
  const [isYearly, setIsYearly] = useState(false);
  
  const currentSubscription = user?.subscription;

  const getYearlyPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return Math.floor(monthlyPrice * 12 * 0.75); // 25% discount for yearly
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

  const features = {
    basic: [
      { icon: Target, text: 'Apply to unlimited jobs' },
      { icon: TrendingUp, text: 'Basic job recommendations' },
      { icon: Shield, text: 'Profile visibility to employers' },
      { icon: Clock, text: 'Email job alerts' },
      { icon: TrendingUp, text: 'Basic profile analytics' }
    ],
    premium: [
      { icon: Sparkles, text: 'AI-powered job matching' },
      { icon: Target, text: 'Resume optimization tips' },
      { icon: Star, text: 'Priority application status' },
      { icon: TrendingUp, text: 'Advanced profile analytics' },
      { icon: Zap, text: 'Interview preparation resources' },
      { icon: Shield, text: 'Priority customer support' },
      { icon: Clock, text: 'Early access to new jobs' }
    ]
  };

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Software Engineer',
      text: 'The AI matching helped me find 3 perfect job opportunities in my first week!',
      plan: 'Premium'
    },
    {
      name: 'Michael R.',
      role: 'Marketing Specialist',
      text: 'Premium features gave me the edge I needed. Got hired within 2 weeks.',
      plan: 'Premium'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-medium mb-4">Accelerate Your Job Search</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Get matched with your dream job faster using AI-powered recommendations and premium features
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Label htmlFor="yearly-toggle">Monthly</Label>
          <Switch
            id="yearly-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <Label htmlFor="yearly-toggle" className="flex items-center gap-2">
            Yearly
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Save 25%
            </Badge>
          </Label>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {jobSeekerPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative border-2 transition-all hover:shadow-lg ${
                plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'
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
                {plan.price === 0 && (
                  <Badge variant="outline" className="mx-auto">
                    Forever Free
                  </Badge>
                )}
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
                
                {plan.id === 'seeker-premium' && (
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Premium Benefits
                    </h4>
                    <div className="space-y-2">
                      {features.premium.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Icon className="w-3 h-3 text-primary" />
                            <span>{feature.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={() => onSubscribe(plan.id)}
                  className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {currentSubscription?.planId === plan.id ? 'Current Plan' : 
                   plan.price === 0 ? 'Get Started Free' : 'Upgrade Now'}
                </Button>
                
                {plan.price > 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    7-day free trial • Cancel anytime
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Stories */}
        <div className="bg-accent/30 rounded-lg p-8 mb-12">
          <h3 className="text-xl font-medium text-center mb-8">Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                    <Badge variant="secondary">{testimonial.plan}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h3 className="text-xl font-medium mb-4">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-medium mb-2">How does AI matching work?</h4>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your skills, experience, and preferences to match you with relevant local jobs, increasing your chances of getting hired.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">What's included in the free trial?</h4>
              <p className="text-sm text-muted-foreground">
                The 7-day free trial includes all Premium features so you can experience the full value before committing.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">How quickly will I see results?</h4>
              <p className="text-sm text-muted-foreground">
                Most Premium users see increased job matches within 24 hours and interview requests within the first week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}