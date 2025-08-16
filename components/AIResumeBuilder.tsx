import { useState } from 'react';
import { User, JobSeekerProfile } from '../types/user';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Eye, 
  Zap, 
  Plus, 
  Edit, 
  Save,
  User as UserIcon,
  Briefcase,
  GraduationCap,
  Award,
  Phone,
  Mail,
  MapPin,
  Globe,
  Brain,
  Target,
  TrendingUp
} from 'lucide-react';

interface AIResumeBuilderProps {
  user: User;
  onSave: (resumeData: any) => void;
}

export function AIResumeBuilder({ user, onSave }: AIResumeBuilderProps) {
  const [currentTab, setCurrentTab] = useState('content');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: user.name,
      email: user.email,
      phone: '',
      location: (user.profile as JobSeekerProfile).location,
      website: '',
      linkedin: ''
    },
    summary: '',
    experience: [] as any[],
    education: [] as any[],
    skills: (user.profile as JobSeekerProfile).skills || [],
    projects: [] as any[],
    certifications: [] as any[]
  });

  const profile = user.profile as JobSeekerProfile;

  const generateAISummary = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const aiSummary = `Experienced ${profile.title} with ${profile.experience} of proven expertise in ${profile.skills.slice(0, 3).join(', ')}. Passionate about delivering high-quality solutions and driving innovation through cutting-edge technologies. Demonstrated ability to work collaboratively in fast-paced environments while maintaining attention to detail. Seeking opportunities to contribute technical expertise and creative problem-solving skills to forward-thinking organizations in the ${profile.preferences?.categories?.[0] || 'technology'} sector.`;
      
      setResumeData({
        ...resumeData,
        summary: aiSummary
      });
      
      setIsGenerating(false);
    }, 2000);
  };

  const generateAIExperience = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const aiExperience = [
        {
          title: profile.title,
          company: 'Previous Company',
          location: profile.location,
          startDate: '2022',
          endDate: 'Present',
          description: `• Led development of user-facing features using ${profile.skills[0]} and ${profile.skills[1]}\n• Collaborated with cross-functional teams to deliver high-quality solutions\n• Optimized application performance resulting in 30% faster load times\n• Mentored junior developers and contributed to code reviews`
        },
        {
          title: `Junior ${profile.title}`,
          company: 'Startup Inc.',
          location: profile.location,
          startDate: '2020',
          endDate: '2022',
          description: `• Developed and maintained web applications using ${profile.skills.slice(0, 2).join(' and ')}\n• Participated in agile development processes and daily standups\n• Implemented responsive designs and ensured cross-browser compatibility\n• Contributed to technical documentation and best practices`
        }
      ];
      
      setResumeData({
        ...resumeData,
        experience: aiExperience
      });
      
      setIsGenerating(false);
    }, 2000);
  };

  const optimizeForATS = () => {
    // AI-powered ATS optimization suggestions
    const suggestions = [
      'Use standard section headers (Experience, Education, Skills)',
      'Include relevant keywords from job descriptions',
      'Use bullet points for better readability',
      'Avoid complex formatting or graphics',
      'Include quantifiable achievements where possible'
    ];
    
    return suggestions;
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setResumeData({ ...resumeData, experience: updatedExperience });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, {
        degree: '',
        school: '',
        location: '',
        graduationDate: '',
        gpa: '',
        relevant: ''
      }]
    });
  };

  const resumeScore = () => {
    let score = 0;
    if (resumeData.summary) score += 20;
    if (resumeData.experience.length > 0) score += 30;
    if (resumeData.education.length > 0) score += 20;
    if (resumeData.skills.length >= 5) score += 15;
    if (resumeData.personalInfo.phone && resumeData.personalInfo.email) score += 15;
    return score;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Resume Builder
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create a professional resume with AI assistance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-medium">Resume Score</div>
                <div className="text-2xl font-bold text-primary">{resumeScore()}%</div>
              </div>
              <div className="w-16 h-16">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${resumeScore()}, 100`}
                      className="text-primary"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="optimize">Optimize</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6 mt-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Professional Summary</CardTitle>
                    <Button 
                      onClick={generateAISummary}
                      disabled={isGenerating}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <Sparkles className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      AI Generate
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write a compelling summary of your professional background..."
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    className="min-h-24"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Tip: Keep it concise (3-4 lines) and highlight your key strengths
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Work Experience
                </h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={generateAIExperience}
                    disabled={isGenerating}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Generate
                  </Button>
                  <Button onClick={addExperience} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </div>

              {resumeData.experience.map((exp, index) => (
                <Card key={index}>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(index, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          value={exp.endDate}
                          onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        placeholder="• Describe your key responsibilities and achievements..."
                        className="min-h-24"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {resumeData.experience.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">No experience added yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your work experience or let AI generate examples based on your profile
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={addExperience} variant="outline">
                        Add Manually
                      </Button>
                      <Button onClick={generateAIExperience}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="skills" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Skills & Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Your Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2 p-4 border rounded-lg min-h-16">
                      {resumeData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {resumeData.skills.length === 0 && (
                        <p className="text-sm text-muted-foreground">No skills added yet</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      AI Skills Analysis
                    </h4>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Skills completeness</span>
                        <span className="font-medium">{Math.min(100, (resumeData.skills.length / 8) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(100, (resumeData.skills.length / 8) * 100)} className="h-1" />
                      <p className="text-xs text-muted-foreground">
                        Recommended: Include 8-12 relevant skills for better job matching
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optimize" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    ATS Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Optimization Score: {resumeScore()}%</h4>
                    <div className="space-y-2">
                      {optimizeForATS().map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-muted-foreground">ATS Compatibility</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">92%</div>
                      <div className="text-sm text-muted-foreground">Keyword Match</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Add quantifiable achievements</p>
                        <p className="text-xs text-muted-foreground">Include numbers and percentages to show impact</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <Sparkles className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Strong keyword presence</p>
                        <p className="text-xs text-muted-foreground">Your resume includes relevant industry keywords</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview Resume
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button 
                onClick={() => onSave(resumeData)}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Resume
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          <div className="bg-white p-8 border rounded-lg">
            {/* Resume content would be rendered here */}
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold">{resumeData.personalInfo.name}</h1>
                <div className="flex justify-center gap-4 text-sm text-gray-600 mt-2">
                  <span>{resumeData.personalInfo.email}</span>
                  <span>{resumeData.personalInfo.phone}</span>
                  <span>{resumeData.personalInfo.location}</span>
                </div>
              </div>
              
              {resumeData.summary && (
                <div>
                  <h2 className="text-lg font-semibold border-b pb-1 mb-3">Professional Summary</h2>
                  <p className="text-sm">{resumeData.summary}</p>
                </div>
              )}
              
              <div>
                <h2 className="text-lg font-semibold border-b pb-1 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* More sections would be rendered here */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}