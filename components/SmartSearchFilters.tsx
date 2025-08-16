import { useState } from 'react';
import { JobFilters } from '../types/job';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Search, 
  MapPin, 
  Filter, 
  Sparkles, 
  Mic, 
  MicOff, 
  Brain, 
  Zap,
  X,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import { categories, jobTypes } from '../data/mockJobs';

interface SmartSearchFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onAIRecommendations: () => void;
}

export function SmartSearchFilters({ filters, onFiltersChange, onAIRecommendations }: SmartSearchFiltersProps) {
  const [isListening, setIsListening] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const salaryRanges = [
    'Any',
    '$30,000 - $50,000',
    '$50,000 - $70,000', 
    '$70,000 - $100,000',
    '$100,000 - $150,000',
    '$150,000+'
  ];

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
    
    // Simulate AI suggestions based on search input
    if (value.length > 2) {
      setTimeout(() => {
        const suggestions = generateAISuggestions(value);
        setAiSuggestions(suggestions);
      }, 500);
    } else {
      setAiSuggestions([]);
    }
  };

  const generateAISuggestions = (searchTerm: string): string[] => {
    const term = searchTerm.toLowerCase();
    const suggestions: string[] = [];
    
    if (term.includes('react') || term.includes('frontend')) {
      suggestions.push('Frontend Developer jobs in your area');
      suggestions.push('React Developer positions');
      suggestions.push('UI/UX Designer roles');
    }
    
    if (term.includes('marketing')) {
      suggestions.push('Digital Marketing Specialist');
      suggestions.push('Marketing Coordinator roles');
      suggestions.push('Social Media Manager positions');
    }
    
    if (term.includes('remote') || term.includes('work from home')) {
      suggestions.push('Remote-friendly companies');
      suggestions.push('Hybrid work opportunities');
      suggestions.push('Fully remote positions');
    }
    
    if (term.includes('entry') || term.includes('junior')) {
      suggestions.push('Entry-level positions');
      suggestions.push('Junior developer roles');
      suggestions.push('Internship opportunities');
    }

    // Add some generic suggestions
    if (suggestions.length === 0) {
      suggestions.push(`${searchTerm} jobs near you`);
      suggestions.push(`Senior ${searchTerm} positions`);
      suggestions.push(`${searchTerm} with growth opportunities`);
    }
    
    return suggestions.slice(0, 3);
  };

  const handleVoiceSearch = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        const voiceResults = [
          'frontend developer remote',
          'marketing manager downtown',
          'data analyst full time',
          'customer service representative'
        ];
        const randomResult = voiceResults[Math.floor(Math.random() * voiceResults.length)];
        handleSearchChange(randomResult);
        setIsListening(false);
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const processNaturalLanguageQuery = (query: string) => {
    setIsAIProcessing(true);
    
    // Simulate AI processing of natural language
    setTimeout(() => {
      const newFilters = { ...filters };
      
      // Parse location
      if (query.includes('near') || query.includes('in')) {
        const locationMatch = query.match(/(?:near|in)\s+([^,]+)/i);
        if (locationMatch) {
          newFilters.location = locationMatch[1].trim();
        }
      }
      
      // Parse job type
      if (query.includes('remote')) {
        newFilters.remote = true;
        newFilters.type = 'remote';
      } else if (query.includes('part-time')) {
        newFilters.type = 'part-time';
      } else if (query.includes('full-time')) {
        newFilters.type = 'full-time';
      }
      
      // Parse salary
      if (query.includes('$')) {
        const salaryMatch = query.match(/\$[\d,]+/);
        if (salaryMatch) {
          newFilters.salaryRange = `${salaryMatch[0]}+`;
        }
      }
      
      // Parse category
      categories.forEach(category => {
        if (query.toLowerCase().includes(category.toLowerCase())) {
          newFilters.category = category;
        }
      });
      
      onFiltersChange(newFilters);
      setIsAIProcessing(false);
    }, 2000);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      location: '',
      category: 'All Categories',
      type: 'All Types',
      remote: false,
      salaryRange: ''
    });
    setAiSuggestions([]);
  };

  const hasActiveFilters = filters.search || filters.location || 
    filters.category !== 'All Categories' || filters.type !== 'All Types' ||
    filters.remote || filters.salaryRange;

  return (
    <div className="space-y-4">
      {/* Main Search Card */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* AI-Powered Search Bar */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Try 'Frontend developer remote $80k+' or 'Marketing jobs downtown'"
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-12 pr-20 h-12 text-base"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleVoiceSearch}
                    className={`p-2 ${isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-2"
                    onClick={() => processNaturalLanguageQuery(filters.search)}
                    disabled={!filters.search || isAIProcessing}
                  >
                    {isAIProcessing ? (
                      <Sparkles className="w-4 h-4 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4 text-primary" />
                    )}
                  </Button>
                </div>
              </div>
              
              {isListening && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm">Listening... Speak your job search</span>
                  </div>
                </div>
              )}
              
              {isAIProcessing && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is understanding your search...</span>
                  </div>
                </div>
              )}
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">AI Suggestions</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleSearchChange(suggestion)}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
                  className="w-48"
                />
              </div>

              <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Advanced
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 flex items-center justify-center">
                        !
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Advanced Filters</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Job Type</Label>
                      <Select value={filters.type} onValueChange={(value) => onFiltersChange({ ...filters, type: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {jobTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Salary Range</Label>
                      <Select value={filters.salaryRange} onValueChange={(value) => onFiltersChange({ ...filters, salaryRange: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Any salary" />
                        </SelectTrigger>
                        <SelectContent>
                          {salaryRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Remote Work</Label>
                      <Switch
                        checked={filters.remote}
                        onCheckedChange={(checked) => onFiltersChange({ ...filters, remote: checked })}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={clearFilters}>
                        Clear All
                      </Button>
                      <Button onClick={() => setShowAdvancedFilters(false)}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-primary" />
            Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>Frontend jobs +15% this week</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Avg. response time: 2.3 days</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span>Local salary range: $65k-$95k</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}