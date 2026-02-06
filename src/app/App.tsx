import React from 'react';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Leadership } from './components/Leadership';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProfilePage } from './components/ProfilePage';

export default function App() {
  const [activePage, setActivePage] = React.useState<'portfolio' | 'profile'>('portfolio');

  return (
    <div className="min-h-screen bg-[#0a192f] font-sans selection:bg-[#00ff9f]/30 selection:text-[#00ff9f] scroll-smooth">
      <Toaster 
        position="top-right" 
        expand={true} 
        richColors 
        theme="dark"
      />
      
      {activePage === 'portfolio' ? (
        <>
          <Navbar onProfileClick={() => setActivePage('profile')} />
          <main>
            <Hero onProfileClick={() => setActivePage('profile')} />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Leadership />
            <Contact />
          </main>
          <Footer />
        </>
      ) : (
        <ProfilePage onBack={() => setActivePage('portfolio')} />
      )}
    </div>
  );
}
