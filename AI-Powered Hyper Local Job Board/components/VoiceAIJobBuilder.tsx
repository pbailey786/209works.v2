import { useState } from 'react';
import { Job } from '../types/job';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { 
  Sparkles, 
  Plus, 
  X, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Eye,
  Mic,
  MicOff,
  MessageCircle,
  Send,
  Volume2,
  VolumeX,
  Bot,
  User,
  Wand2,
  RefreshCw
} from 'lucide-react';
import { categories, jobTypes } from '../data/mockJobs';

interface VoiceAIJobBuilderProps {
  onSave: (job: Partial<Job>) => void;
  onPreview: (job: Partial<Job>) => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function VoiceAIJobBuilder({ onSave, onPreview }: VoiceAIJobBuilderProps) {
  const [jobData, setJobData] = useState<Partial<Job>>({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: '',
    description: '',
    requirements: [],
    skills: [],
    category: '',
    remote: false
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [showVoiceAI, setShowVoiceAI] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI hiring assistant. I'll help you create an amazing job posting. To get started, tell me about the position you're looking to fill. What's the job title?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [aiProgress, setAiProgress] = useState(0);

  const updateJobData = (field: keyof Job, value: any) => {
    setJobData({ ...jobData, [field]: value });
  };

  const addRequirement = () => {
    if (newRequirement.trim() && jobData.requirements) {
      updateJobData('requirements', [...jobData.requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    if (jobData.requirements) {
      const updated = jobData.requirements.filter((_, i) => i !== index);
      updateJobData('requirements', updated);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && jobData.skills) {
      updateJobData('skills', [...jobData.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    if (jobData.skills) {
      const updated = jobData.skills.filter((_, i) => i !== index);
      updateJobData('skills', updated);
    }
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        const voiceInputs = [
          "I need to hire a frontend developer for our startup",
          "We're looking for a marketing manager with 3-5 years of experience",
          "I want to post a remote position for a data analyst",
          "Can you help me write a job description for a UX designer?"
        ];
        const randomInput = voiceInputs[Math.floor(Math.random() * voiceInputs.length)];
        handleUserMessage(randomInput);
        setIsListening(false);
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleUserMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate AI processing
    setAiProgress(20);
    
    setTimeout(() => {
      setAiProgress(60);
      const aiResponse = generateAIResponse(message);
      
      setTimeout(() => {
        setAiProgress(100);
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, aiMessage]);
        
        // Apply AI suggestions to job data
        applyAISuggestions(message, aiResponse);
        
        setTimeout(() => setAiProgress(0), 1000);
      }, 1000);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('frontend') || message.includes('developer') || message.includes('react')) {
      return "Great! A frontend developer position. I can see this is a technical role. Let me help you create a compelling job posting. What's your company name and location? Also, what's the experience level you're looking for - junior, mid-level, or senior?";
    }
    
    if (message.includes('marketing') || message.includes('manager')) {
      return "Perfect! Marketing roles are crucial for business growth. I'll help you attract top marketing talent. Can you tell me more about your company and the specific marketing areas you want to focus on - digital marketing, content, social media, or general marketing management?";
    }
    
    if (message.includes('remote') || message.includes('work from home')) {
      return "Remote positions are very popular! I'll make sure to highlight the remote work benefits. What type of role is this, and what time zones or regions are you considering for candidates?";
    }
    
    if (message.includes('salary') || message.includes('pay') || message.includes('compensation')) {
      return "Compensation is key to attracting great candidates. What's your budget range for this position? I can help you structure a competitive offer including salary, benefits, and any other perks.";
    }
    
    if (message.includes('experience') || message.includes('years')) {
      return "Experience requirements help filter the right candidates. Based on what you've told me, I'll help structure the requirements. Should I also include any specific skills or certifications that are must-haves vs nice-to-haves?";
    }
    
    return "I understand. Let me help you refine that further. Can you provide more details about the role, company culture, or specific requirements? The more context you give me, the better job posting I can create for you.";
  };

  const applyAISuggestions = (userMessage: string, aiResponse: string) => {
    const message = userMessage.toLowerCase();
    
    // Auto-fill based on conversation
    if (message.includes('frontend developer') && !jobData.title) {
      setJobData(prev => ({
        ...prev,
        title: 'Frontend Developer',
        category: 'Technology',
        skills: ['React', 'JavaScript', 'HTML/CSS', 'TypeScript']
      }));
    }
    
    if (message.includes('marketing manager') && !jobData.title) {
      setJobData(prev => ({
        ...prev,
        title: 'Marketing Manager',
        category: 'Marketing',
        skills: ['Digital Marketing', 'Analytics', 'Content Creation', 'Social Media']
      }));
    }
    
    if (message.includes('remote')) {
      setJobData(prev => ({
        ...prev,
        remote: true,
        location: prev.location || 'Remote'
      }));
    }
  };

  const generateJobDescription = () => {
    if (jobData.title && jobData.company) {
      const aiDescription = `We are seeking a talented ${jobData.title} to join our dynamic team at ${jobData.company}. This ${jobData.type} position offers an exciting opportunity to contribute to innovative projects while working ${jobData.remote ? 'remotely' : `in our ${jobData.location} office`}.

In this role, you will be responsible for delivering high-quality solutions and collaborating with cross-functional teams to drive success. We offer competitive compensation${jobData.salary ? ` (${jobData.salary})` : ''} and a comprehensive benefits package.

Key Responsibilities:
• Lead development of user-facing features and functionality
• Collaborate with design and product teams to implement solutions
• Optimize applications for maximum speed and scalability  
• Participate in code reviews and maintain high coding standards
• Mentor junior team members and contribute to best practices

What We Offer:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible working arrangements and remote-friendly culture
• Professional development opportunities and learning budget
• Collaborative and inclusive work environment

Join us in creating exceptional experiences and growing your career in a supportive environment where innovation thrives!`;
      
      updateJobData('description', aiDescription);
    }
  };

  const speakText = (text: string) => {
    setIsAISpeaking(true);
    // Simulate text-to-speech
    setTimeout(() => {
      setIsAISpeaking(false);
    }, 3000);
  };

  const completionPercentage = () => {
    let completed = 0;
    const fields = ['title', 'company', 'location', 'description'];
    fields.forEach(field => {
      if (jobData[field as keyof Job]) completed += 25;
    });
    return completed;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium mb-2">AI-Powered Job Builder</h1>
              <p className="text-muted-foreground">Create compelling job postings with AI assistance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">Completion</div>
                <div className="text-2xl font-medium text-primary">{completionPercentage()}%</div>
              </div>
              <Button
                onClick={() => setShowVoiceAI(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600"
              >
                <Bot className="w-4 h-4" />
                AI Assistant
              </Button>
            </div>
          </div>
          <Progress value={completionPercentage()} className="mt-4 h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Job Details</CardTitle>
                  <Button
                    onClick={generateJobDescription}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" />
                    AI Generate
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={jobData.title || ''}
                      onChange={(e) => updateJobData('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Your company name"
                      value={jobData.company || ''}
                      onChange={(e) => updateJobData('company', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. Downtown District"
                        value={jobData.location || ''}
                        onChange={(e) => updateJobData('location', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Salary Range</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. $80,000 - $120,000"
                        value={jobData.salary || ''}
                        onChange={(e) => updateJobData('salary', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Job Type</Label>
                    <Select value={jobData.type || 'full-time'} onValueChange={(value) => updateJobData('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.filter(type => type !== 'All Types').map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={jobData.category || ''} onValueChange={(value) => updateJobData('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat !== 'All Categories').map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="remote"
                    checked={jobData.remote || false}
                    onCheckedChange={(checked) => updateJobData('remote', checked)}
                  />
                  <Label htmlFor="remote">Remote work available</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe the role, responsibilities, and what makes your company great..."
                  value={jobData.description || ''}
                  onChange={(e) => updateJobData('description', e.target.value)}
                  className="min-h-32"
                />
              </CardContent>
            </Card>

            {/* Requirements and Skills sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a requirement..."
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                    />
                    <Button onClick={addRequirement} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {jobData.requirements?.map((req, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                        <span className="text-sm">{req}</span>
                        <Button
                          onClick={() => removeRequirement(index)}
                          size="sm"
                          variant="ghost"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills & Technologies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
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
                    {jobData.skills?.map((skill, index) => (
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
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Suggestions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={() => setShowVoiceAI(true)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat with AI
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={() => onPreview(jobData)}
                >
                  <Eye className="w-4 h-4" />
                  Preview Job
                </Button>
                <Button 
                  className="w-full"
                  onClick={() => onSave(jobData)}
                >
                  Publish Job
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Include specific skills and experience requirements</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Mention company culture and benefits</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Use clear, engaging language</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Voice AI Assistant Dialog */}
      <Dialog open={showVoiceAI} onOpenChange={setShowVoiceAI}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Hiring Assistant
              {isAISpeaking && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  Speaking
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col min-h-0">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-accent/20 rounded-lg mb-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-white border'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    {message.type === 'ai' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1 h-auto mt-2"
                        onClick={() => speakText(message.content)}
                      >
                        {isAISpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {aiProgress > 0 && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white border p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                    <Progress value={aiProgress} className="h-1 mt-2 w-24" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message or use voice..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && currentMessage.trim()) {
                      handleUserMessage(currentMessage);
                      setCurrentMessage('');
                    }
                  }}
                  className="pr-12"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleVoiceInput}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 ${
                    isListening ? 'text-red-500' : ''
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              <Button
                onClick={() => {
                  if (currentMessage.trim()) {
                    handleUserMessage(currentMessage);
                    setCurrentMessage('');
                  }
                }}
                disabled={!currentMessage.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {isListening && (
              <div className="text-center mt-2">
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm">Listening...</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}