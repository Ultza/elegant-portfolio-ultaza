import React from 'react';
import { Github, Twitter, Linkedin, Instagram, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-10 border-t relative overflow-hidden" style={{ background: 'var(--t-footer-bg)', borderColor: 'var(--t-border)' }}>
      <div
        className="absolute bottom-0 left-0 w-full h-1"
        style={{ background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--t-accent) 30%, transparent), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <a href="#home" className="flex items-center gap-2 text-2xl font-bold tracking-tight mb-4">
              <div
                className="w-10 h-10 rounded flex items-center justify-center border"
                style={{
                  background: 'var(--t-accent-bg)',
                  borderColor: 'color-mix(in srgb, var(--t-accent) 30%, transparent)',
                }}
              >
                <Cpu className="w-6 h-6" style={{ color: 'var(--t-accent)' }} />
              </div>
              <span style={{ color: 'var(--t-text)' }}>
                UL <span style={{ color: 'var(--t-accent)' }}>TAZASYAH</span>
              </span>
            </a>
            <p className="max-w-sm mb-6 text-sm" style={{ color: 'var(--t-text-sub)' }}>
              Professional IT solutions bridging technical systems with high-impact environmental data management.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Linkedin size={20} />, href: 'https://linkedin.com/in/ul-tazasyah-274a2a392' },
                { icon: <Github size={20} />, href: '#' },
                { icon: <Twitter size={20} />, href: '#' },
                { icon: <Instagram size={20} />, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
                  style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)', color: 'var(--t-text-muted)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--t-accent)';
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--t-accent) 50%, transparent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--t-text-muted)';
                    e.currentTarget.style.borderColor = 'var(--t-border)';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Back to top — dihapus */}

          {/* Built with */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
            <p className="font-medium" style={{ color: 'var(--t-text-muted)' }}>
              Built with <span style={{ color: 'var(--t-accent)' }}>Precision</span>
            </p>
            <p className="text-xs" style={{ color: 'var(--t-text-sub)' }}>React + Tailwind + Framer Motion</p>
            <p className="text-[10px] mt-4 uppercase tracking-widest" style={{ color: 'var(--t-border)' }}>
              © 2026 UL TAZASYAH PORTFOLIO
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
