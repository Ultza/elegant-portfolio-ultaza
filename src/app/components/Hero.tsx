import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Github, Linkedin, Mail, MapPin, ChevronRight } from 'lucide-react';
import userPortrait from "../../assets/bdf3cd406212a8881b29220053c03e271bedd103.png";

export const Hero = ({ onProfileClick }: { onProfileClick?: () => void }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#0a192f]">
      {/* Matrix-like Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00ff9f 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#00ff9f]/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#00d4ff]/10 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff9f]/10 border border-[#00ff9f]/20 text-[#00ff9f] text-xs font-mono mb-6">
            <Terminal size={14} />
            <span>Ready for new opportunities</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Hi, I'm <span className="text-[#00ff9f]">Ul Tazasyah</span>
          </h1>

          <div className="mb-8 space-y-3 pl-2 border-l-2 border-[#00ff9f]">
            {[
              "Fullstack Developer",
              "IT Support",
              "Mobile Developer"
            ].map((role) => (
              <p key={role} className="text-[#00ff9f] text-lg md:text-xl font-medium">
                {role}
              </p>
            ))}
          </div>
          
          <p className="text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-light">
            "Bridging technical expertise in IT systems with environmental data management."
          </p>
          
          <div className="flex flex-wrap gap-5 mb-12">
            <a
              href="#projects"
              className="px-8 py-4 bg-[#00ff9f] text-[#0a192f] rounded-lg font-bold flex items-center gap-2 hover:bg-[#00e08b] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#00ff9f]/20"
            >
              View Projects <ChevronRight size={20} />
            </a>
            <button
              onClick={onProfileClick}
              className="px-8 py-4 bg-[#112240] text-[#00ff9f] rounded-lg font-bold border border-[#00ff9f]/30 hover:bg-[#1d2d50] transition-all transform hover:-translate-y-1"
            >
              Personal Profile
            </button>
            <div className="flex items-center gap-4 px-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#112240] text-slate-400 rounded-lg hover:text-[#00ff9f] hover:bg-[#1d2d50] transition-all border border-slate-800">
                <Linkedin size={20} />
              </a>
              <a href="mailto:ultazanagan111@gmail.com" className="p-3 bg-[#112240] text-slate-400 rounded-lg hover:text-[#00ff9f] hover:bg-[#1d2d50] transition-all border border-slate-800">
                <Mail size={20} />
              </a>
              <div className="flex items-center gap-2 text-slate-500 text-sm ml-2">
                <MapPin size={16} className="text-[#00ff9f]/50" />
                <span>Nagan Raya, Aceh</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative w-full aspect-square md:max-w-md mx-auto">
            {/* Animated Ring Decor */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -inset-4 border border-dashed border-[#00ff9f]/20 rounded-full"
            />
            
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#00ff9f]/20 to-[#00d4ff]/20 rounded-3xl blur-2xl opacity-50" />
            
            {/* Container Foto dengan Background Merah */}
            <div className="relative h-full w-full rounded-3xl overflow-hidden border-2 border-slate-800/50 shadow-2xl bg-red-600 group transition-colors duration-700 hover:bg-[#00ff9f]">
              <img
                src={userPortrait}
                alt="Ul Tazasyah Portrait"
                className="w-full h-full object-cover object-top grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              {/* Overlay gradasi halus agar foto menyatu dengan tema dark */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/40 via-transparent to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
