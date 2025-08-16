import { useState } from 'react';
import { User } from '../types/user';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User as UserIcon, Sparkles, FileText, Settings, Plus, X, Upload, Zap, Target, BookOpen } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onSave: (updatedUser: User) => void;
}

export function ProfilePage({ user, onSave }: ProfilePageProps) {
  const [editedUser, setEditedUser] = useState<User>(user);
  const [newSkill, setNewSkill] = useState('');
  
  const isJobSeeker = user.role === 'job-seeker';
  const profile = editedUser.profile as any;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const updateProfile = (field: string, value: any) => {
    setEditedUser({
      ...editedUser,
      profile: {
        ...editedUser.profile,
        [field]: value
      }
    });
  };

  const updatePreferences = (field: string, value: any) => {
    if (isJobSeeker) {
      setEditedUser({
        ...editedUser,
        profile: {
          ...editedUser.profile,
          preferences: {
            ...(editedUser.profile as any).preferences,
            [field]: value
          }
        }
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && profile.skills) {
      updateProfile('skills', [...profile.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    if (profile.skills) {
      const updated = profile.skills.filter((_: any, i: number) => i !== index);
      updateProfile('skills', updated);
    }
  };

  const handleSave = () => {
    onSave(editedUser);
  };

  const aiRecommendations = isJobSeeker ? profile.aiRecommendations || [] : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-2">
            {isJobSeeker ? 'My Profile' : 'Company Profile'}
          </h1>
          <p className="text-muted-foreground">
            {isJobSeeker 
              ? 'Manage your professional profile and job preferences' 
              : 'Manage your company information and hiring preferences'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                {isJobSeeker && <TabsTrigger value="preferences">Preferences</TabsTrigger>}
                {isJobSeeker && <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>}
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={editedUser.avatar} />
                        <AvatarFallback>{getInitials(editedUser.name)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="title">
                        {isJobSeeker ? 'Professional Title' : 'Company Name'}
                      </Label>
                      <Input
                        id="title"
                        value={isJobSeeker ? profile.title : profile.company}
                        onChange={(e) => updateProfile(isJobSeeker ? 'title' : 'company', e.target.value)}
                        placeholder={isJobSeeker ? 'e.g. Frontend Developer' : 'e.g. TechStart Local'}
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => updateProfile('location', e.target.value)}
                        placeholder="e.g. Downtown District"
                      />
                    </div>

                    {isJobSeeker ? (
                      <div>
                        <Label htmlFor="experience">Experience</Label>
                        <Input
                          id="experience"
                          value={profile.experience}
                          onChange={(e) => updateProfile('experience', e.target.value)}
                          placeholder="e.g. 3 years"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Input
                            id="industry"
                            value={profile.industry}
                            onChange={(e) => updateProfile('industry', e.target.value)}
                            placeholder="e.g. Technology"
                          />
                        </div>
                        <div>
                          <Label htmlFor="size">Company Size</Label>
                          <Select value={profile.size} onValueChange={(value) => updateProfile('size', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-1000">201-1000 employees</SelectItem>
                              <SelectItem value="1000+">1000+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="description">
                        {isJobSeeker ? 'Professional Summary' : 'Company Description'}
                      </Label>
                      <Textarea
                        id="description"
                        value={isJobSeeker ? profile.education : profile.description}
                        onChange={(e) => updateProfile(isJobSeeker ? 'education' : 'description', e.target.value)}
                        placeholder={isJobSeeker 
                          ? 'Tell us about your background and career goals...'
                          : 'Describe your company, culture, and mission...'
                        }
                        className="min-h-24"
                      />
                    </div>

                    {isJobSeeker && (
                      <div>
                        <Label>Skills</Label>
                        <div className="flex gap-2 mb-2">
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
                          {profile.skills?.map((skill: string, index: number) => (
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
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {isJobSeeker && (
                <TabsContent value="preferences" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Job Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Preferred Job Types</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          {['full-time', 'part-time', 'contract', 'remote'].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Switch
                                checked={profile.preferences?.jobTypes?.includes(type)}
                                onCheckedChange={(checked) => {
                                  const currentTypes = profile.preferences?.jobTypes || [];
                                  const updatedTypes = checked
                                    ? [...currentTypes, type]
                                    : currentTypes.filter((t: string) => t !== type);
                                  updatePreferences('jobTypes', updatedTypes);
                                }}
                              />
                              <Label className="capitalize">{type.replace('-', ' ')}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="salary-range">Salary Range</Label>
                        <Input
                          id="salary-range"
                          value={profile.preferences?.salaryRange || ''}
                          onChange={(e) => updatePreferences('salaryRange', e.target.value)}
                          placeholder="e.g. $70,000 - $100,000"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={profile.preferences?.remote || false}
                          onCheckedChange={(checked) => updatePreferences('remote', checked)}
                        />
                        <Label>Open to remote opportunities</Label>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {isJobSeeker && (
                <TabsContent value="ai-insights" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI Profile Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Profile Completeness</span>
                          <span className="font-medium">{profile.aiResumeScore || 0}%</span>
                        </div>
                        <Progress value={profile.aiResumeScore || 0} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">AI Recommendations:</h4>
                        <div className="space-y-2">
                          {aiRecommendations.map((rec: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 p-3 bg-accent/50 rounded">
                              <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Skill Development
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Based on job market analysis, consider developing these skills:
                      </p>
                      <div className="space-y-2">
                        {['TypeScript', 'AWS', 'Docker'].map((skill, index) => (
                          <div key={skill} className="flex items-center justify-between">
                            <span>{skill}</span>
                            <Badge variant="outline">High Demand</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new job matches
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Profile Visibility</h4>
                        <p className="text-sm text-muted-foreground">
                          Allow employers to find your profile
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">AI Recommendations</h4>
                        <p className="text-sm text-muted-foreground">
                          Get personalized job and career advice
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {isJobSeeker && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Resume
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    PDF, DOC or DOCX. Max size 5MB.
                  </p>
                  {profile.resume && (
                    <div className="p-2 bg-accent/50 rounded text-sm">
                      Current: resume.pdf
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isJobSeeker ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Views</span>
                      <span className="font-medium">42</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Applications Sent</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response Rate</span>
                      <span className="font-medium">75%</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Jobs</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Applications</span>
                      <span className="font-medium">28</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Interviews Scheduled</span>
                      <span className="font-medium">5</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}