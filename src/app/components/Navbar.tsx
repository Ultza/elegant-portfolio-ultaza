import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Code2, Cpu, Laptop } from 'lucide-react';

export const Navbar = ({ onProfileClick }: { onProfileClick?: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0a192f]/90 backdrop-blur-md py-3 border-b border-[#00ff9f]/10 shadow-lg shadow-[#00ff9f]/5' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white group">
          <div className="w-8 h-8 rounded bg-[#00ff9f]/20 flex items-center justify-center border border-[#00ff9f]/30 group-hover:bg-[#00ff9f]/40 transition-colors">
            <Cpu className="text-[#00ff9f] w-5 h-5" />
          </div>
          <span>UL <span className="text-[#00ff9f]">TAZASYAH</span></span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-400 hover:text-[#00ff9f] transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00ff9f] transition-all group-hover:w-full"></span>
            </a>
          ))}
          <button
            onClick={onProfileClick}
            className="text-sm font-medium text-[#00ff9f] hover:text-[#00ff9f]/80 transition-all cursor-pointer"
          >
            Personal Profile
          </button>
          <a
            href="#contact"
            className="px-5 py-2 border border-[#00ff9f] text-[#00ff9f] text-sm rounded hover:bg-[#00ff9f]/10 transition-colors"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white hover:text-[#00ff9f] transition-colors"
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
            className="absolute top-full left-0 right-0 bg-[#112240] border-b border-[#00ff9f]/10 overflow-hidden md:hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg text-slate-300 hover:text-[#00ff9f]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                className="w-full py-3 text-center border border-[#00ff9f] text-[#00ff9f] rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
