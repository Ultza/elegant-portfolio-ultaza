import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Cpu } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavbarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
  onProfileClick?: () => void;
  onAdminLoginClick?: () => void;
  onCertificatesClick?: () => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export const Navbar = ({
  activePage,
  onNavigate,
  onProfileClick,
  onAdminLoginClick,
  onCertificatesClick,
  isAdmin,
  onLogout,
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activePage]);

  const navLinks = [
    { name: 'Tentang',      page: 'about'          },
    { name: 'Pengalaman',   page: 'experience'     },
    { name: 'Keahlian',     page: 'skills'         },
    { name: 'Proyek',       page: 'projects'       },
    { name: 'Artikel',      page: 'news'           },
    { name: 'Learning',     page: 'learning'       },
    { name: 'Sertifikat',   page: 'certificates'   },
    { name: 'Kontak',       page: 'contact'        },
  ];

  const handleNav = (page: string) => {
    onNavigate?.(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={isScrolled ? {
        background: 'var(--t-nav-blur)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--t-border)',
        padding: '12px 0',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
      } : {
        background: 'transparent',
        padding: '20px 0',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex flex-row items-center gap-2 text-xl font-bold tracking-tight group flex-shrink-0"
        >
          <div
            className="w-8 h-8 rounded flex items-center justify-center border transition-colors flex-shrink-0"
            style={{
              background: 'var(--t-accent-bg)',
              borderColor: 'color-mix(in srgb, var(--t-accent) 30%, transparent)',
            }}
          >
            <Cpu className="w-5 h-5" style={{ color: 'var(--t-accent)' }} />
          </div>
          <span className="whitespace-nowrap" style={{ color: 'var(--t-text)' }}>
            Ul <span style={{ color: 'var(--t-accent)' }}>Tazasyah</span>
          </span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-5">
          {navLinks.map((link) => {
            const isActive = activePage === link.page;
            return (
              <button
                key={link.name}
                onClick={() => handleNav(link.page)}
                className="text-sm font-medium transition-all relative group"
                style={{ color: isActive ? 'var(--t-accent)' : 'var(--t-text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--t-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? 'var(--t-accent)' : 'var(--t-text-muted)')}
              >
                {link.name}
                {/* Active underline */}
                <span
                  className="absolute -bottom-1 left-0 h-0.5 transition-all"
                  style={{
                    background: 'var(--t-accent)',
                    width: isActive ? '100%' : '0%',
                  }}
                />
                {/* Hover underline */}
                {!isActive && (
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all"
                    style={{ background: 'var(--t-accent)' }} />
                )}
              </button>
            );
          })}

          <button
            onClick={() => { onProfileClick?.(); setIsMobileMenuOpen(false); }}
            className="text-sm font-medium transition-all"
            style={{ color: activePage === 'profile' ? 'var(--t-accent)' : 'var(--t-accent)' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Personal Profile
          </button>

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Admin */}
          {!isAdmin ? (
            <button
              onClick={() => { onAdminLoginClick?.(); setIsMobileMenuOpen(false); }}
              className="ml-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
              style={{ background: 'var(--t-accent)', color: 'var(--t-bg)' }}
            >
              Admin Login
            </button>
          ) : (
            <button
              onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }}
              className="ml-2 px-4 py-2 text-sm rounded transition-colors border"
              style={{ borderColor: '#ef4444', color: '#ef4444' }}
            >
              Log Out
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden transition-colors"
          style={{ color: 'var(--t-text)' }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 border-b overflow-hidden md:hidden"
            style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => {
                const isActive = activePage === link.page;
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNav(link.page)}
                    className="text-left text-lg transition-colors"
                    style={{ color: isActive ? 'var(--t-accent)' : 'var(--t-text-muted)' }}
                  >
                    {link.name}
                  </button>
                );
              })}

              <button
                onClick={() => { onProfileClick?.(); setIsMobileMenuOpen(false); }}
                className="text-left text-lg transition-colors"
                style={{ color: 'var(--t-text-muted)' }}
              >
                Personal Profile
              </button>

              <div className="pt-2">
                <ThemeSwitcher />
              </div>

              {!isAdmin ? (
                <button
                  onClick={() => { onAdminLoginClick?.(); setIsMobileMenuOpen(false); }}
                  className="w-full py-3 font-semibold rounded-lg transition-colors"
                  style={{ background: 'var(--t-accent)', color: 'var(--t-bg)' }}
                >
                  Admin Login
                </button>
              ) : (
                <button
                  onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }}
                  className="w-full py-3 rounded border transition-colors"
                  style={{ borderColor: '#ef4444', color: '#ef4444' }}
                >
                  Log Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
