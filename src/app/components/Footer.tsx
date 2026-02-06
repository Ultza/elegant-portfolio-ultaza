import React from 'react';
import { Github, Twitter, Linkedin, Instagram, ArrowUp, Cpu } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 bg-[#020c1b] border-t border-slate-900 relative overflow-hidden">
      {/* Footer background decor */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff9f]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <a href="#home" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white mb-4 group">
              <div className="w-10 h-10 rounded bg-[#00ff9f]/20 flex items-center justify-center border border-[#00ff9f]/30">
                <Cpu className="text-[#00ff9f] w-6 h-6" />
              </div>
              <span>UL <span className="text-[#00ff9f]">TAZASYAH</span></span>
            </a>
            <p className="text-slate-500 max-w-sm mb-6">
              Professional IT solutions bridging technical systems with high-impact environmental data management.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Linkedin size={20} />, href: "https://linkedin.com/in/ul-tazasyah-274a2a392" },
                { icon: <Github size={20} />, href: "#" },
                { icon: <Twitter size={20} />, href: "#" },
                { icon: <Instagram size={20} />, href: "#" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-[#112240] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#00ff9f] hover:border-[#00ff9f]/50 transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={scrollToTop}
              className="w-12 h-12 rounded-xl bg-[#00ff9f]/10 border border-[#00ff9f]/20 flex items-center justify-center text-[#00ff9f] hover:bg-[#00ff9f]/20 transition-all cursor-pointer group"
            >
              <ArrowUp className="group-hover:-translate-y-1 transition-transform" />
            </button>
            <p className="text-slate-500 text-sm font-mono tracking-wider">BACK TO TOP</p>
          </div>

          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
            <p className="text-slate-300 font-medium">Built with <span className="text-[#00ff9f]">Precision</span></p>
            <p className="text-slate-500 text-xs">React + Tailwind + Framer Motion</p>
            <p className="text-slate-600 text-[10px] mt-4 uppercase tracking-widest">© 2026 UL TAZASYAH PORTFOLIO</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
