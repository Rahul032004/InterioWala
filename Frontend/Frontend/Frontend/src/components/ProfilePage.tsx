import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { EditProfileModal } from './EditProfileModal';
import { useAuth } from './useAuth';
import { User, Mail, Calendar, Settings, LogOut, Camera, Phone, MapPin, Globe, Edit3 } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, updateProfile, logout } = useAuth();
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);



  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateProfile({ avatar: result });
        setShowAvatarDialog(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xl">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Update Profile Picture</DialogTitle>
                      <DialogDescription>
                        Choose a new profile picture to upload.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="cursor-pointer"
                      />
                      <div className="text-sm text-muted-foreground">
                        Supported formats: JPG, PNG, GIF (max 5MB)
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2 text-center">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-base">{user.email}</CardDescription>
                {user.bio && (
                  <p className="text-sm text-muted-foreground max-w-md">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Full Name</h4>
                  <p className="text-muted-foreground">{user.name}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-1">Email Address</h4>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                </div>

                {user.phone && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Phone Number</h4>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {user.phone}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {user.location && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Location</h4>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </p>
                  </div>
                )}

                {user.website && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Website</h4>
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      {user.website}
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-foreground mb-1">Member Since</h4>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {user.bio && (
              <div className="pt-4 border-t">
                <h4 className="font-medium text-foreground mb-2">About</h4>
                <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => onNavigate('dashboard')}
            >
              <User className="mr-2 h-4 w-4" />
              My Dashboard
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => onNavigate('contact')}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={showEditModal} onOpenChange={setShowEditModal} />
    </div>
  );
}