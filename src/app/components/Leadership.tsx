import React from 'react';
import { motion } from 'motion/react';
import { Award, Users, ShieldCheck, Trophy } from 'lucide-react';

const leaderItems = [
  {
    role: 'Ketua OSIS',
    org: 'SMAN 3 Seunagan',
    period: '2019 - 2021',
    achievement: 'Ranked 1st in class & led major student initiatives.',
    icon: <Trophy className="text-[#00ff9f]" />
  },
  {
    role: 'Project Manager',
    org: 'APEL Green Aceh',
    period: '2022',
    achievement: 'Protected Area Monitoring project lead.',
    icon: <ShieldCheck className="text-[#00d4ff]" />
  },
  {
    role: 'Active Member',
    org: 'HIMATIF UTU',
    period: 'Active',
    achievement: 'Member of Himpunan Mahasiswa Teknologi Informasi.',
    icon: <Users className="text-purple-500" />
  }
];

export const Leadership = () => {
  return (
    <section id="leadership" className="py-24 bg-[#0a192f]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-[#00ff9f] font-mono text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-10 h-[1px] bg-[#00ff9f]"></span>
            Influence
            <span className="w-10 h-[1px] bg-[#00ff9f]"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Leadership & Impact</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaderItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#112240] p-8 rounded-2xl border border-slate-800 flex flex-col items-center text-center relative group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#0a192f] border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="text-white text-xl font-bold mb-2">{item.role}</h4>
              <p className="text-[#00ff9f] font-mono text-xs mb-4 uppercase tracking-widest">{item.org}</p>
              <p className="text-slate-400 text-sm mb-4">{item.period}</p>
              <div className="w-full h-[1px] bg-slate-800 mb-6" />
              <p className="text-slate-300 italic text-sm">
                "{item.achievement}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
