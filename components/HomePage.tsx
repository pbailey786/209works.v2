'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Briefcase, MapPin, Users, Sparkles, TrendingUp, Building, Star, ArrowRight } from 'lucide-react';

export function HomePage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      router.push('/sign-up');
    }
  };

  const handleViewJobs = () => {
    router.push('/jobs');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };
  const stats = [
    { label: 'Local Jobs', value: '2,500+', icon: Briefcase },
    { label: 'Companies', value: '450+', icon: Building },
    { label: 'Job Seekers', value: '8,200+', icon: Users },
    { label: 'Successful Matches', value: '1,800+', icon: Star }
  ];

  const features = [
    {
      title: 'AI-Powered Matching',
      description: 'Our advanced AI analyzes your skills, preferences, and location to find perfect job matches.',
      icon: Sparkles
    },
    {
      title: 'Hyper-Local Focus',
      description: 'Discover opportunities in your neighborhood and nearby areas with distance-based search.',
      icon: MapPin
    },
    {
      title: 'Real-Time Updates',
      description: 'Get instant notifications about new jobs that match your criteria and application updates.',
      icon: TrendingUp
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      company: 'TechStart Local',
      text: '209.works helped me find my dream job just 3 blocks from my apartment. The AI matching was incredibly accurate!'
    },
    {
      name: 'Mike Chen',
      role: 'Marketing Manager',
      company: 'Creative Agency',
      text: 'As an employer, I love how 209.works connects me with local talent. The quality of candidates is outstanding.'
    },
    {
      name: 'Lisa Rodriguez',
      role: 'UX Designer',
      company: 'Design Studio',
      text: 'The platform made my job search so much easier. I got 3 interview requests in the first week!'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                <Sparkles className="w-3 h-3 mr-1" />
                Powered by AI
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-medium mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Find Local Jobs That Match Your Life
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with employers in your neighborhood. Our AI-powered platform matches you with local opportunities based on your skills, preferences, and location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleViewJobs} className="text-lg px-8">
                Browse Jobs
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-500" />
                <span>4.9/5 from 2,000+ reviews</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Join 10,000+ local professionals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                  <div className="text-2xl font-medium mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-medium mb-6">Why Choose 209.works?</h2>
            <p className="text-lg text-muted-foreground">
              We're revolutionizing local job discovery with cutting-edge AI technology and community-focused approach.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="py-16 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-medium mb-6">Start Your Search</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Enter your job title or skills to discover local opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <Input
                  placeholder="e.g. Frontend Developer, Marketing, Designer..."
                  className="h-12 text-lg"
                />
              </div>
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Your location"
                    className="h-12 text-lg pl-12"
                  />
                </div>
              </div>
              <Button size="lg" onClick={handleViewJobs} className="h-12 px-8">
                Search Jobs
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Or <Button variant="link" onClick={handleSignIn} className="p-0 h-auto">sign in</Button> to get personalized recommendations
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-medium mb-6">Success Stories</h2>
            <p className="text-lg text-muted-foreground">
              Hear from professionals who found their perfect local opportunities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-medium mb-6">Ready to Find Your Next Opportunity?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have discovered their perfect local jobs through our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={handleGetStarted} className="text-lg px-8">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" onClick={handleViewJobs} className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Browse All Jobs
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}