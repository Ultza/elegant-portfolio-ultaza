import React from 'react';
import { Toaster } from 'sonner';
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

export default function App() {
  const [activePage, setActivePage] = React.useState<'portfolio' | 'profile' | 'admin-login' | 'admin-panel' | 'certificates' | 'news-detail'>('portfolio');
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [newsSlug, setNewsSlug] = React.useState<string>('');

  // Fungsi logout admin
  const handleLogout = () => {
    setIsAdmin(false);
    setActivePage('portfolio');
  };

  // Fungsi untuk membuka detail artikel
  const handleNewsClick = (slug: string) => {
    setNewsSlug(slug);
    setActivePage('news-detail');
  };

  // Fungsi kembali dari detail artikel
  const handleBackFromNews = () => {
    setActivePage('portfolio');
    setNewsSlug('');
    // Scroll ke section news setelah kembali
    setTimeout(() => {
      const newsSection = document.getElementById('news');
      if (newsSection) {
        newsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0a192f] font-sans selection:bg-[#00ff9f]/30 selection:text-[#00ff9f] scroll-smooth">
      <Toaster 
        position="top-right" 
        expand={true} 
        richColors 
        theme="dark"
      />
      {activePage === 'portfolio' && (
        <>
          <Navbar 
            onProfileClick={() => setActivePage('profile')}
            onCertificatesClick={() => setActivePage('certificates')}
            onAdminLoginClick={() => setActivePage('admin-login')}
            isAdmin={isAdmin}
            onLogout={handleLogout}
          />
          <main>
            <Hero onProfileClick={() => setActivePage('profile')} />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Leadership />
            <News onNewsClick={handleNewsClick} />
            <Certificates onCertificatesClick={() => setActivePage('certificates')} />
            <Contact />
            {/* Tombol login tetap muncul di bawah pada mobile */}
            <div className="flex justify-center mt-8 md:hidden">
              <button
                className="bg-[#00ff9f] text-[#0a192f] px-4 py-2 rounded font-bold hover:bg-[#00e08b] transition-all"
                onClick={() => setActivePage('admin-login')}
              >
                Admin Login
              </button>
            </div>
          </main>
          <Footer />
        </>
      )}
      {activePage === 'profile' && (
        <ProfilePage onBack={() => setActivePage('portfolio')} />
      )}
      {activePage === 'certificates' && (
        <>
          <Navbar 
            onProfileClick={() => setActivePage('profile')}
            onCertificatesClick={() => setActivePage('certificates')}
            onAdminLoginClick={() => setActivePage('admin-login')}
            isAdmin={isAdmin}
            onLogout={handleLogout}
          />
          <CertificatesPage onBack={() => setActivePage('portfolio')} />
          <Footer />
        </>
      )}
      {activePage === 'admin-login' && (
        <AdminLogin onLogin={() => { setIsAdmin(true); setActivePage('admin-panel'); }} />
      )}
      {activePage === 'admin-panel' && isAdmin && (
        <AdminPanel onLogout={handleLogout} />
      )}
      {activePage === 'news-detail' && (
        <NewsDetail slug={newsSlug} onBack={handleBackFromNews} />
      )}
    </div>
  );
}
