import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, Star, Download, Bookmark, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { designService, favoriteService } from '../lib/services';
import type { Design } from '../lib/types';
import { useAuth } from './useAuth';

interface DesignGalleryProps {
  onNavigate: (page: string, designId?: string) => void;
}

export const DesignGallery = React.memo(({ onNavigate }: DesignGalleryProps) => {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('created_at');
  const [favoriteDesigns, setFavoriteDesigns] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDesigns();
    if (user) {
      loadUserFavorites();
    }
  }, [user]);

  const loadDesigns = useCallback(async () => {
    setLoading(true);
    try {
      const allDesigns = await designService.getAll();
      setDesigns(allDesigns || []);
    } catch (error) {
      console.error('Error loading designs:', error);
      // Set empty array if there's an error
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserFavorites = useCallback(async () => {
    if (!user) return;
    
    try {
      const favorites = await favoriteService.getUserFavorites(user.id);
      const favoriteIds = new Set((favorites || []).map(fav => fav.design_id));
      setFavoriteDesigns(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Keep existing favorites if there's an error
      setFavoriteDesigns(new Set());
    }
  }, [user]);

  const toggleFavorite = useCallback(async (designId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      onNavigate('auth');
      return;
    }

    const isFavorited = favoriteDesigns.has(designId);
    
    if (isFavorited) {
      const success = await favoriteService.removeFavorite(designId);
      if (success) {
        const newFavorites = new Set(favoriteDesigns);
        newFavorites.delete(designId);
        setFavoriteDesigns(newFavorites);
      }
    } else {
      const success = await favoriteService.addFavorite(designId);
      if (success) {
        const newFavorites = new Set(favoriteDesigns);
        newFavorites.add(designId);
        setFavoriteDesigns(newFavorites);
      }
    }
  }, [user, favoriteDesigns, onNavigate]);

  const performSearch = useCallback(async (query: string) => {
    if (query.trim()) {
      const results = await designService.search(query);
      setDesigns(results);
    } else {
      loadDesigns();
    }
  }, [loadDesigns]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    performSearch(query);
  }, [performSearch]);

  const filteredDesigns = useMemo(() => {
    return designs
      .filter(design => {
        const matchesCategory = selectedCategory === 'all' || 
                              design.category.toLowerCase() === selectedCategory ||
                              design.room_type.toLowerCase() === selectedCategory;
        return matchesCategory;
      })
      .sort((a, b) => {
        switch (selectedSort) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'category':
            return a.category.localeCompare(b.category);
          default: // created_at
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [designs, selectedCategory, selectedSort]);

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Header Section */}
      <div className="bg-background border-b border-border px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl mb-4">Design Gallery</h1>
          <p className="text-muted-foreground mb-6">
            Discover thousands of professionally curated interior and exterior design templates
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search designs, styles, rooms..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="living room">Living Room</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="bathroom">Bathroom</SelectItem>
                  <SelectItem value="dining room">Dining Room</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Newest</SelectItem>
                  <SelectItem value="title">Name</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {filteredDesigns.length} design{filteredDesigns.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {/* Design Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-[4/3] bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDesigns.map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  isFavorite={favoriteDesigns.has(design.id)}
                  onNavigate={onNavigate}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
          
          {filteredDesigns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No designs found matching your criteria.</p>
              <Button variant="outline" onClick={() => handleSearch('')}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

interface DesignCardProps {
  design: Design;
  isFavorite: boolean;
  onNavigate: (type: string, id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const DesignCard = React.memo(({ design, isFavorite, onNavigate, onToggleFavorite }: DesignCardProps) => {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
      onClick={() => onNavigate('detail', design.id)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={design.image_url}
          alt={design.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button 
            variant="secondary" 
            size="icon"
            className={`w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
              isFavorite ? 'text-red-500' : ''
            }`}
            onClick={(e) => onToggleFavorite(design.id, e)}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {design.title}
          </h3>
          <Badge variant="outline" className="text-xs ml-2 shrink-0">
            {design.room_type}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {design.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {design.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {design.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{design.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
});