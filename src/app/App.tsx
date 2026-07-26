import React from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Leadership } from './components/Leadership';
import { News } from './components/News';
import { NewsDetail } from './components/NewsDetail';
import { Certificates } from './components/Certificates';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProfilePage } from './components/ProfilePage';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { CertificatesPage } from './certificates/page';
import { LearningPage } from './components/LearningPage';
import { LearningDetail } from './components/LearningDetail';

export type SectionPage =
  | 'home'
  | 'about'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'leadership'
  | 'news'
  | 'certificates'
  | 'contact'
  | 'profile'
  | 'admin-login'
  | 'admin-panel'
  | 'certificates-full'
  | 'news-detail'
  | 'learning'
  | 'learning-detail';

export default function App() {
  const [activePage, setActivePage] = React.useState<SectionPage>('home');
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [newsSlug, setNewsSlug] = React.useState<string>('');
  const [learningSlug, setLearningSlug] = React.useState<string>('');

  const handleLogout = () => {
    setIsAdmin(false);
    setActivePage('home');
  };

  const handleNewsClick = (slug: string) => {
    setNewsSlug(slug);
    setActivePage('news-detail');
  };

  const handleTutorialClick = (slug: string) => {
    setLearningSlug(slug);
    setActivePage('learning-detail');
  };

  // Pages yang tampilkan Navbar + Footer
  const withNav: SectionPage[] = [
    'home', 'about', 'experience', 'skills', 'projects',
    'leadership', 'news', 'certificates', 'contact', 'certificates-full',
    'learning', 'learning-detail',
  ];

  const showNavFooter = withNav.includes(activePage);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Hero onProfileClick={() => setActivePage('profile')} />;
      case 'about':
        return <About />;
      case 'experience':
        return <Experience />;
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects />;
      case 'leadership':
        return <Leadership />;
      case 'news':
        return <News onNewsClick={handleNewsClick} />;
      case 'certificates':
        return <Certificates onCertificatesClick={() => setActivePage('certificates-full')} />;
      case 'contact':
        return <Contact />;
      case 'certificates-full':
        return <CertificatesPage onBack={() => setActivePage('certificates')} />;
      case 'learning':
        return <LearningPage onTutorialClick={handleTutorialClick} />;
      case 'learning-detail':
        return (
          <LearningDetail
            slug={learningSlug}
            onBack={() => setActivePage('learning')}
            onTutorialClick={handleTutorialClick}
          />
        );
      case 'profile':
        return <ProfilePage onBack={() => setActivePage('home')} />;
      case 'admin-login':
        return <AdminLogin onLogin={() => { setIsAdmin(true); setActivePage('admin-panel'); }} />;
      case 'admin-panel':
        return isAdmin ? <AdminPanel onLogout={handleLogout} /> : null;
      case 'news-detail':
        return (
          <NewsDetail
            slug={newsSlug}
            onBack={() => setActivePage('news')}
          />
        );
      default:
        return <Hero onProfileClick={() => setActivePage('profile')} />;
    }
  };

  return (
    <ThemeProvider>
      <div
        className="min-h-screen font-sans"
        style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}
      >
        <Toaster position="top-right" expand={true} richColors theme="dark" />

        {showNavFooter && (
          <Navbar
            activePage={activePage}
            onNavigate={(page) => setActivePage(page as SectionPage)}
            onProfileClick={() => setActivePage('profile')}
            onCertificatesClick={() => setActivePage('certificates')}
            onAdminLoginClick={() => setActivePage('admin-login')}
            isAdmin={isAdmin}
            onLogout={handleLogout}
          />
        )}

        <main className={showNavFooter ? 'pt-20 min-h-screen' : ''}>
          {renderPage()}
        </main>

        {showNavFooter && <Footer />}
      </div>
    </ThemeProvider>
  );
}
