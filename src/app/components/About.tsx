import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Briefcase, Users, Star } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-24 bg-[#0a192f] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-[#00ff9f] font-mono text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-10 h-[1px] bg-[#00ff9f]"></span>
            About Me
            <span className="w-10 h-[1px] bg-[#00ff9f]"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Identity & Vision</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-[#112240] p-8 rounded-2xl border border-slate-800 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff9f]/5 blur-3xl group-hover:bg-[#00ff9f]/10 transition-colors" />
              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#0a192f] rounded-xl text-[#00ff9f] border border-[#00ff9f]/20">
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Education</h4>
                  <p className="text-slate-300 font-medium">S1 Teknologi Informasi</p>
                  <p className="text-[#00ff9f] text-sm mb-4">Universitas Teuku Umar</p>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span>GPA <span className="text-white font-bold">3.29</span> / 4.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#112240] p-8 rounded-2xl border border-slate-800 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d4ff]/5 blur-3xl group-hover:bg-[#00d4ff]/10 transition-colors" />
              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#0a192f] rounded-xl text-[#00d4ff] border border-[#00d4ff]/20">
                  <Briefcase size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">ICT Internship</h4>
                  <p className="text-slate-300">Experienced in Information and Communication Technology (TIK) from an intensive internship at Diskominsa Aceh Barat.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col h-full"
          >
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              I am a highly motivated and proactive IT professional who thrives in collaborative environments. My approach combines a strong technical foundation in fullstack development with a specialized focus on GIS and environmental data management.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-auto">
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800/50">
                <h5 className="text-[#00ff9f] font-mono text-xs uppercase mb-3">Personality</h5>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-center gap-2">• Highly Motivated</li>
                  <li className="flex items-center gap-2">• Proactive</li>
                  <li className="flex items-center gap-2">• Strong Team Player</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800/50">
                <h5 className="text-[#00d4ff] font-mono text-xs uppercase mb-3">Organizations</h5>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-center gap-2">• Ketua OSIS SMKN 3 Seunagan</li>
                  <li className="flex items-center gap-2">• HIMATIF UTU Member</li>
                  <li className="flex items-center gap-2">• APEL Green Aceh Member</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
