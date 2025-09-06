import React, { useState, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Star, 
  Download, 
  Heart, 
  Bookmark, 
  Share2, 
  Palette, 
  Ruler, 
  Eye,
  ShoppingCart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProjectDetailProps {
  onNavigate: (page: string) => void;
  designId?: string;
}

const designData = {
  '1': {
    title: 'Modern Living Room',
    category: 'Interior',
    subcategory: 'Living Room',
    rating: 4.8,
    totalRatings: 127,
    downloads: '2.3k',
    likes: 156,
    price: 'Free',
    author: 'Sarah Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    description: 'A stunning modern living room design featuring clean lines, neutral tones, and sophisticated furniture arrangements. This template includes detailed layouts, color palettes, and furniture specifications that can be easily customized to fit your space.',
    images: [
      'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbnRlcmlvciUyMGRlc2lnbiUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU2NzczMTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1551298370-75ca9207e576?w=800'
    ],
    tags: ['Modern', 'Minimalist', 'Cozy', 'Neutral Colors'],
    specifications: {
      dimensions: '20\' × 15\' (6m × 4.5m)',
      style: 'Modern Minimalist',
      colors: ['#F5F5F5', '#2C2C2C', '#8B7355', '#FFFFFF'],
      furniture: ['Sectional Sofa', 'Coffee Table', 'Floor Lamp', 'Area Rug', 'Wall Art']
    },
    features: [
      'High-resolution images included',
      'Detailed floor plan',
      'Color palette guide',
      'Furniture shopping list',
      'Styling tips and instructions'
    ]
  }
};

export const ProjectDetail = React.memo(function ProjectDetail({ onNavigate, designId = '1' }: ProjectDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const design = useMemo(() => {
    return designData[designId as keyof typeof designData] || designData['1'];
  }, [designId]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % design.images.length);
  }, [design.images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + design.images.length) % design.images.length);
  }, [design.images.length]);

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={useCallback(() => onNavigate('gallery'), [onNavigate])}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              variant={isSaved ? "default" : "outline"} 
              size="sm"
              onClick={useCallback(() => setIsSaved(prev => !prev), [])}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                <ImageWithFallback
                  src={design.images[currentImageIndex]}
                  alt={design.title}
                  className="w-full h-full object-cover"
                />
                {design.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {design.images.length}
                </div>
              </div>
              
              {/* Thumbnail Strip */}
              {design.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {design.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 overflow-hidden rounded-md border-2 transition-colors ${
                        currentImageIndex === index ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${design.title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Design Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{design.subcategory}</Badge>
                  {design.price === 'Free' ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">Free</Badge>
                  ) : (
                    <Badge variant="outline">{design.price}</Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl mb-3">{design.title}</h1>
                <p className="text-muted-foreground">{design.description}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{design.rating}</span>
                  <span className="text-muted-foreground">({design.totalRatings} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span>{design.downloads} downloads</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span>{design.likes} likes</span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 p-4 bg-accent/30 rounded-lg">
                <ImageWithFallback
                  src={design.authorAvatar}
                  alt={design.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">Created by {design.author}</p>
                  <p className="text-sm text-muted-foreground">Interior Designer</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  {design.price === 'Free' ? 'Download Free' : `Purchase ${design.price}`}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview in AR
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Palette className="w-4 h-4 mr-2" />
                  Customize
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shop Items
                </Button>
              </div>
            </div>
          </div>

          {/* Details Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg mb-4">What's Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {design.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h4 className="mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {design.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg mb-4">Room Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Dimensions:</span>
                          <span>{design.specifications.dimensions}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Style:</span>
                          <span>{design.specifications.style}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg mb-4">Color Palette</h3>
                      <div className="flex gap-2">
                        {design.specifications.colors.map((color, index) => (
                          <div key={index} className="flex flex-col items-center gap-2">
                            <div 
                              className="w-10 h-10 rounded-full border-2 border-border"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs text-muted-foreground">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg mb-4">Furniture List</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {design.specifications.furniture.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{design.rating}</div>
                      <div className="flex items-center gap-1 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(design.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{design.totalRatings} reviews</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Sample reviews */}
                    <div className="border-b border-border pb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                          <span className="text-sm">JD</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">Jane Doe</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">2 days ago</p>
                          <p>Beautiful design! I used this template for my own living room and it turned out amazing. The instructions were clear and easy to follow.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-b border-border pb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                          <span className="text-sm">MS</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">Mike Smith</span>
                            <div className="flex gap-1">
                              {[...Array(4)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                              <Star className="w-3 h-3 text-muted-foreground" />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">1 week ago</p>
                          <p>Great template with detailed specifications. Would have liked more color variations, but overall very satisfied.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
});