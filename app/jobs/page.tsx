'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { EnhancedJobCard } from '@/components/EnhancedJobCard';
import { JobCard } from '@/components/JobCard';
import { mockJobs, categories, jobTypes } from '@/data/mockJobs';
import { Job } from '@/types/job';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  X,
  Sparkles,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';

export default function JobsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('All Types');
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState(10);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [useEnhancedCards, setUseEnhancedCards] = useState(true);

  // Mock user data for AI matching
  const mockUserData = {
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Python'],
    experience: '3-5 years',
    location: 'Downtown'
  };

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      // Search term filter
      if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !job.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !job.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Location filter
      if (locationSearch && !job.location.toLowerCase().includes(locationSearch.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All Categories' && job.category !== selectedCategory) {
        return false;
      }

      // Type filter
      if (selectedType !== 'All Types' && job.type !== selectedType) {
        return false;
      }

      // Remote filter
      if (showRemoteOnly && !job.remote) {
        return false;
      }

      // Distance filter
      if (job.distance) {
        const distance = parseFloat(job.distance.replace(' miles', ''));
        if (distance > maxDistance) {
          return false;
        }
      }

      return true;
    });
  }, [searchTerm, locationSearch, selectedCategory, selectedType, showRemoteOnly, maxDistance]);

  const handleViewDetails = (job: Job) => {
    router.push(`/jobs/${job.id}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationSearch('');
    setSelectedCategory('All Categories');
    setSelectedType('All Types');
    setShowRemoteOnly(false);
    setMaxDistance(10);
  };

  const activeFiltersCount = [
    searchTerm,
    locationSearch,
    selectedCategory !== 'All Categories',
    selectedType !== 'All Types',
    showRemoteOnly,
    maxDistance < 10
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Local Jobs</h1>
          <p className="text-muted-foreground">
            {filteredJobs.length} jobs found near you
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Location"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:w-80">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground"
                    >
                      Clear all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category Filter */}
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
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
                  </div>

                  {/* Job Type Filter */}
                  <div className="space-y-2">
                    <Label>Job Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type === 'All Types' ? type : type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Remote Only */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remote" 
                      checked={showRemoteOnly}
                      onCheckedChange={(checked) => setShowRemoteOnly(checked as boolean)}
                    />
                    <Label htmlFor="remote" className="cursor-pointer">
                      Remote positions only
                    </Label>
                  </div>

                  {/* Distance Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Max Distance</Label>
                      <span className="text-sm text-muted-foreground">{maxDistance} miles</span>
                    </div>
                    <Slider
                      value={[maxDistance]}
                      onValueChange={([value]) => setMaxDistance(value)}
                      max={25}
                      min={1}
                      step={1}
                    />
                  </div>

                  <Separator />

                  {/* View Options */}
                  <div className="space-y-3">
                    <Label>View Options</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="enhanced" 
                        checked={useEnhancedCards}
                        onCheckedChange={(checked) => setUseEnhancedCards(checked as boolean)}
                      />
                      <Label htmlFor="enhanced" className="cursor-pointer flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        AI-Enhanced Cards
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          )}

          {/* Job Listings */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {activeFiltersCount} filters applied
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Job Grid/List */}
            {filteredJobs.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                {filteredJobs.map((job) => (
                  useEnhancedCards ? (
                    <EnhancedJobCard
                      key={job.id}
                      job={job}
                      onViewDetails={handleViewDetails}
                      userSkills={mockUserData.skills}
                      userExperience={mockUserData.experience}
                      userLocation={mockUserData.location}
                    />
                  ) : (
                    <JobCard
                      key={job.id}
                      job={job}
                      onViewDetails={handleViewDetails}
                    />
                  )
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg">No jobs found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear filters
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}