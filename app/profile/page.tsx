'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Upload,
  X,
  Plus,
  Edit2,
  Save,
  Globe,
  Linkedin,
  Github
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  description: string;
}

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  // Profile data state
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses?.[0]?.emailAddress || '',
    phone: '',
    location: '',
    title: '',
    bio: '',
    website: '',
    linkedin: '',
    github: '',
  });

  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'JavaScript' },
    { id: '2', name: 'React' },
    { id: '3', name: 'TypeScript' },
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'Tech Company',
      location: 'Stockton, CA',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: 'Building modern web applications with React and TypeScript.'
    }
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of the Pacific',
      location: 'Stockton, CA',
      graduationDate: '2021-05',
      description: ''
    }
  ]);

  const [newSkill, setNewSkill] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Calculate profile completeness
  const calculateCompleteness = () => {
    const fields = [
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.phone,
      profile.location,
      profile.title,
      profile.bio,
      skills.length > 0,
      experiences.length > 0,
      education.length > 0,
      resumeFile !== null
    ];
    
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  const handleSave = () => {
    // In real app, save to database
    console.log('Saving profile:', { profile, skills, experiences, education });
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { id: Date.now().toString(), name: newSkill }]);
      setNewSkill('');
    }
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      // In real app, upload to storage
      console.log('Uploading resume:', file);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your professional information</p>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="gap-2"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Completeness */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Completeness</span>
              <span className="text-sm font-bold">{completeness}%</span>
            </div>
            <Progress value={completeness} className="h-2" />
            {completeness < 100 && (
              <p className="text-xs text-muted-foreground mt-2">
                Complete your profile to improve job match accuracy
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    disabled={!isEditing}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    disabled={!isEditing}
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={profile.title}
                  onChange={(e) => setProfile({...profile, title: e.target.value})}
                  disabled={!isEditing}
                  placeholder="e.g., Frontend Developer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Social Links</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedin"
                        value={profile.linkedin}
                        onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="github"
                        value={profile.github}
                        onChange={(e) => setProfile({...profile, github: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Add your professional experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{exp.title}</h4>
                        <p className="text-muted-foreground">{exp.company} • {exp.location}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                          {exp.current ? ' Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                        <p className="mt-2 text-sm">{exp.description}</p>
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {isEditing && (
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Add your educational background</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-muted-foreground">{edu.school} • {edu.location}</p>
                        <p className="text-sm text-muted-foreground">
                          Graduated: {new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                        {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {isEditing && (
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Add your professional skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="gap-1">
                      {skill.name}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill}>Add</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resume" id="resume">
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload your resume for quick job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resumeFile ? (
                  <div className="border-2 border-dashed rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{resumeFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setResumeFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">No resume uploaded</p>
                    {isEditing && (
                      <div>
                        <input
                          type="file"
                          id="resume-upload"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                        />
                        <label htmlFor="resume-upload">
                          <Button asChild>
                            <span>Choose File</span>
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground mt-2">
                          PDF, DOC, or DOCX up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}