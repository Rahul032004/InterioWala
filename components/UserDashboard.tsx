import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Plus, 
  Heart, 
  Settings, 
  Palette,
  Home,
  MoreVertical
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from './useAuth';
import { projectService, favoriteService } from '../lib/services';
import type { Project, UserFavorite } from '../lib/types';

interface UserDashboardProps {
  onNavigate: (page: string, designId?: string) => void;
}

export function UserDashboard({ onNavigate }: UserDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    const [userProjects, userFavorites] = await Promise.all([
      projectService.getUserProjects(user.id),
      favoriteService.getUserFavorites(user.id)
    ]);
    
    setProjects(userProjects);
    setFavorites(userFavorites);
    setLoading(false);
  };

  const quickActions = [
    { 
      title: 'Browse Templates', 
      description: 'Discover new designs',
      icon: Home,
      color: 'bg-blue-100 text-blue-700',
      action: () => onNavigate('gallery')
    },
    { 
      title: 'View Favorites', 
      description: 'Your saved designs',
      icon: Heart,
      color: 'bg-red-100 text-red-700',
      action: () => setActiveTab('saved')
    },
    { 
      title: 'My Projects', 
      description: 'Manage your projects',
      icon: Palette,
      color: 'bg-purple-100 text-purple-700',
      action: () => setActiveTab('projects')
    },
    { 
      title: 'Profile Settings', 
      description: 'Update your profile',
      icon: Settings,
      color: 'bg-gray-100 text-gray-700',
      action: () => onNavigate('profile')
    }
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl mb-4">Please log in to view your dashboard</h2>
          <Button onClick={() => onNavigate('auth')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-background to-accent/20 px-6 py-8 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="text-lg">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl">Welcome back, {user.name}!</h1>
                <p className="text-muted-foreground">Ready to create something beautiful today?</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate('profile')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{favorites.length}</div>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{projects.length}</div>
                <p className="text-sm text-muted-foreground">Projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {projects.filter(p => p.status === 'completed').length}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Date(user.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                </div>
                <p className="text-sm text-muted-foreground">Member Since</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="saved">Favorites</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Quick Actions */}
              <div>
                <h2 className="text-xl mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Card 
                        key={action.title} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={action.action}
                      >
                        <CardContent className="p-6 text-center">
                          <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mx-auto mb-3`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <h3 className="font-medium mb-1">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Recent Projects */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl">Recent Projects</h2>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('projects')}>
                    View All
                  </Button>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="aspect-[16/10] bg-muted animate-pulse" />
                        <CardContent className="p-4">
                          <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                          <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.slice(0, 4).map((project) => (
                      <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <div className="aspect-[16/10] overflow-hidden">
                          <ImageWithFallback
                            src={project.design?.image_url || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium">{project.title}</h3>
                              <p className="text-sm text-muted-foreground">{project.design?.room_type}</p>
                            </div>
                            <Badge variant="outline">{project.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(project.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Palette className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg mb-2">No projects yet</h3>
                      <p className="text-muted-foreground mb-4">Start creating your first design project</p>
                      <Button onClick={() => onNavigate('gallery')}>
                        Browse Templates
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl">Favorite Designs</h2>
                <Button onClick={() => onNavigate('gallery')}>
                  Browse More
                </Button>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-[4/3] bg-muted animate-pulse" />
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                        <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((favorite) => (
                    <Card 
                      key={favorite.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onNavigate('detail', favorite.design_id)}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <ImageWithFallback
                          src={favorite.design?.image_url || ''}
                          alt={favorite.design?.title || ''}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{favorite.design?.title}</h3>
                            <p className="text-sm text-muted-foreground">{favorite.design?.room_type}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Saved {new Date(favorite.created_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground mb-4">Save designs you love to see them here</p>
                    <Button onClick={() => onNavigate('gallery')}>
                      Browse Designs
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl">My Projects</h2>
                <Button onClick={() => onNavigate('gallery')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-[16/10] bg-muted animate-pulse" />
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                        <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <div className="aspect-[16/10] overflow-hidden">
                        <ImageWithFallback
                          src={project.design?.image_url || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{project.title}</h3>
                            <p className="text-sm text-muted-foreground">{project.design?.room_type}</p>
                          </div>
                          <Badge variant="outline">{project.status}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(project.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button size="sm">Continue</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Palette className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first design project</p>
                    <Button onClick={() => onNavigate('gallery')}>
                      Browse Templates
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}