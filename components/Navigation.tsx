import { User } from '../types/user';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Briefcase, User as UserIcon, Settings, LogOut, PlusCircle, BarChart3, Crown, CreditCard, Users2 } from 'lucide-react';

interface NavigationProps {
  currentUser: User | null;
  currentView: string;
  onViewChange: (view: string) => void;
  onSignOut: () => void;
}

export function Navigation({ currentUser, currentView, onViewChange, onSignOut }: NavigationProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getNavigationItems = () => {
    if (!currentUser) return [];
    
    switch (currentUser.role) {
      case 'job-seeker':
        return [
          { id: 'jobs', label: 'Find Jobs', icon: Briefcase },
          { id: 'dashboard', label: 'My Dashboard', icon: BarChart3 },
          { id: 'profile', label: 'My Profile', icon: UserIcon },
          { id: 'job-seeker-subscription', label: 'Upgrade', icon: Crown }
        ];
      case 'employer':
        return [
          { id: 'employer-dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'applicant-management', label: 'Applicants', icon: Users2 },
          { id: 'post-job', label: 'Post Job', icon: PlusCircle },
          { id: 'employer-profile', label: 'Company Profile', icon: UserIcon },
          { id: 'employer-subscription', label: 'Subscription', icon: CreditCard }
        ];
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'Admin Dashboard', icon: BarChart3 },
          { id: 'jobs', label: 'All Jobs', icon: Briefcase },
          { id: 'users', label: 'Users', icon: UserIcon }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const renderCreditsDisplay = () => {
    if (currentUser?.role === 'employer' && currentUser.subscription) {
      const remaining = currentUser.subscription.credits - currentUser.subscription.usedCredits;
      return (
        <Badge variant="outline" className="ml-2">
          {remaining} credits
        </Badge>
      );
    }
    return null;
  };

  const renderSubscriptionBadge = () => {
    if (currentUser?.subscription?.status === 'active') {
      const planName = currentUser.subscription.planId.includes('premium') || 
                      currentUser.subscription.planId.includes('professional') || 
                      currentUser.subscription.planId.includes('enterprise') ? 'Pro' : 'Free';
      return (
        <Badge variant="secondary" className="ml-2">
          {planName}
        </Badge>
      );
    }
    return null;
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => onViewChange('home')}
            >
              <Briefcase className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-medium">209.works</h1>
                <p className="text-sm text-muted-foreground">AI-powered local job discovery</p>
              </div>
            </div>
            
            {currentUser && (
              <nav className="hidden md:flex items-center gap-6">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onViewChange(item.id)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                      {item.id === 'employer-subscription' && renderCreditsDisplay()}
                    </Button>
                  );
                })}
              </nav>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onViewChange('sign-in')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => onViewChange('sign-up')}>
                  Get Started
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {renderSubscriptionBadge()}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block">{currentUser.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => onViewChange(currentUser.role === 'employer' ? 'employer-profile' : 'profile')}>
                      <UserIcon className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    {currentUser.role === 'job-seeker' && (
                      <DropdownMenuItem onClick={() => onViewChange('job-seeker-subscription')}>
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </DropdownMenuItem>
                    )}
                    {currentUser.role === 'employer' && (
                      <DropdownMenuItem onClick={() => onViewChange('employer-subscription')}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Subscription & Credits
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onViewChange('settings')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}