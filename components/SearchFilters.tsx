import { JobFilters } from '../types/job';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Search, MapPin, Filter, Sparkles } from 'lucide-react';
import { categories, jobTypes } from '../data/mockJobs';

interface SearchFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onAIRecommendations: () => void;
}

export function SearchFilters({ filters, onFiltersChange, onAIRecommendations }: SearchFiltersProps) {
  const updateFilter = (key: keyof JobFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Find Your Perfect Local Job
        </h2>
        <Button 
          onClick={onAIRecommendations}
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          AI Recommendations
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Job Title or Keywords</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="e.g. Frontend Developer"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="e.g. Downtown District"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Job Type</Label>
          <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="remote"
          checked={filters.remote}
          onCheckedChange={(checked) => updateFilter('remote', checked)}
        />
        <Label htmlFor="remote">Include remote opportunities</Label>
      </div>
    </div>
  );
}