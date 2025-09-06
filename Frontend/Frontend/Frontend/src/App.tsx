import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { DesignGallery } from './components/DesignGallery';
import { ProjectDetail } from './components/ProjectDetail';
import { UserDashboard } from './components/UserDashboard';
import { ContactPage } from './components/ContactPage';
import { AuthPage } from './components/AuthPage';
import { ProfilePage } from './components/ProfilePage';
import { AuthProvider } from './components/AuthProvider';
import { Toaster } from './components/ui/sonner';

type PageType = 'home' | 'gallery' | 'detail' | 'dashboard' | 'contact' | 'auth' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedDesignId, setSelectedDesignId] = useState<string | undefined>();

  const handleNavigate = (page: string, designId?: string) => {
    setCurrentPage(page as PageType);
    if (designId) {
      setSelectedDesignId(designId);
    }
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'gallery':
        return <DesignGallery onNavigate={handleNavigate} />;
      case 'detail':
        return <ProjectDetail onNavigate={handleNavigate} designId={selectedDesignId} />;
      case 'dashboard':
        return <UserDashboard onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'auth':
        return <AuthPage onAuthSuccess={() => handleNavigate('dashboard')} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        {currentPage !== 'auth' && (
          <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
        )}
        {renderPage()}
        <Toaster />
      </div>
    </AuthProvider>
  );
}