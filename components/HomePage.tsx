import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Search, ArrowRight, Star, Download, Bookmark } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string, designId?: string) => void;
}

const featuredDesigns = [
  {
    id: '1',
    title: 'Modern Living Room',
    category: 'Interior',
    rating: 4.8,
    downloads: '2.3k',
    image: 'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbnRlcmlvciUyMGRlc2lnbiUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU2NzczMTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tags: ['Modern', 'Minimalist', 'Cozy']
  },
  {
    id: '2',
    title: 'Contemporary Kitchen',
    category: 'Interior',
    rating: 4.9,
    downloads: '1.8k',
    image: 'https://images.unsplash.com/photo-1682888813795-192fca4a10d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwZGVzaWdufGVufDF8fHx8MTc1Njc1MDUzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tags: ['Contemporary', 'Open Plan', 'Functional']
  },
  {
    id: '3',
    title: 'Minimalist Bedroom',
    category: 'Interior',
    rating: 4.7,
    downloads: '1.5k',
    image: 'https://images.unsplash.com/photo-1680210850481-66ee30ca2a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NTY4MTc1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tags: ['Minimalist', 'Peaceful', 'Clean']
  },
  {
    id: '4',
    title: 'Luxury Bathroom',
    category: 'Interior',
    rating: 4.6,
    downloads: '1.2k',
    image: 'https://images.unsplash.com/photo-1688786219616-598ed96aa19d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NTY4MDU5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tags: ['Luxury', 'Spa-like', 'Modern']
  }
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-background to-accent/20 px-6 py-12 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl mb-6 text-foreground">
            Discover Beautiful
            <span className="text-primary block md:inline md:ml-3">Design Templates</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your space with our curated collection of interior and exterior design templates. 
            Find inspiration for every room and style.
          </p>
          
          {/* Hero Search */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for living room, kitchen, bathroom designs..."
              className="pl-12 pr-4 py-6 text-lg border-2 border-border focus:border-primary"
            />
            <Button className="absolute right-2 top-2 bottom-2 px-6">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              variant="outline" 
              className="rounded-full"
              onClick={() => onNavigate('gallery')}
            >
              Browse All Designs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="secondary" className="rounded-full">
              Popular Categories
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Designs Section */}
      <section className="px-6 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl mb-2 text-foreground">Featured Designs</h2>
              <p className="text-muted-foreground">Handpicked templates by our design experts</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => onNavigate('gallery')}
              className="hidden md:flex"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDesigns.map((design) => (
              <Card 
                key={design.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={() => onNavigate('detail', design.id)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={design.image}
                    alt={design.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Button 
                    variant="secondary" 
                    size="icon"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {design.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {design.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-foreground">{design.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">{design.downloads}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {design.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <Button onClick={() => onNavigate('gallery')}>
              View All Designs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-accent/30 px-6 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl text-center mb-8 text-foreground">
            Explore by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Living Room', count: '150+', color: 'bg-blue-100 text-blue-700' },
              { name: 'Kitchen', count: '120+', color: 'bg-green-100 text-green-700' },
              { name: 'Bedroom', count: '100+', color: 'bg-purple-100 text-purple-700' },
              { name: 'Bathroom', count: '80+', color: 'bg-orange-100 text-orange-700' },
            ].map((category) => (
              <Card 
                key={category.name}
                className="cursor-pointer hover:shadow-md transition-shadow duration-300 text-center p-6"
                onClick={() => onNavigate('gallery')}
              >
                <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-xl">🏠</span>
                </div>
                <h3 className="mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} designs</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}