import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Building2, MapPin, ExternalLink } from 'lucide-react';

const experiences = [
  {
    period: '2024 - 2025',
    role: 'Kerja Praktek',
    company: 'Dinas Komunikasi, Informatika, dan Persandian Aceh Barat',
    description: 'Focused on ICT systems and government-level information technology services.',
    tags: ['ICT', 'Networking', 'Web Integration'],
    isLatest: true
  },
  {
    period: '2022 - 2024',
    role: 'Manager GIS dan Data',
    company: 'Yayasan APEL Green Aceh',
    description: 'Managed Geographic Information Systems (GIS) and large-scale environmental data to support conservation efforts.',
    tags: ['GIS', 'ArcMap', 'Data Management'],
    isLatest: false
  },
  {
    period: '2024 (Feb - Apr)',
    role: 'Enumerator',
    company: 'Program Kampung Iklim (Proklim) KLHK',
    description: 'Conducted field data collection for climate resilience mapping and community environmental analysis.',
    tags: ['Survey', 'Environmental Data', 'KLHK'],
    isLatest: false
  }
];

export const Experience = () => {
  return (
    <section id="experience" className="py-24 bg-[#0a192f] border-y border-slate-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-[#00ff9f] font-mono text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-10 h-[1px] bg-[#00ff9f]"></span>
            Timeline
            <span className="w-10 h-[1px] bg-[#00ff9f]"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Professional Path</h3>
        </div>

        <div className="relative border-l border-slate-800 ml-4 md:ml-0">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-16 last:mb-0 relative pl-10"
            >
              {/* Timeline Dot */}
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-[#0a192f] transition-colors ${exp.isLatest ? 'border-[#00ff9f] shadow-[0_0_10px_rgba(0,255,159,0.5)]' : 'border-slate-700'}`} />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                <span className="text-[#00ff9f] font-mono text-sm font-bold flex items-center gap-2">
                  <Calendar size={14} />
                  {exp.period}
                </span>
                {exp.isLatest && (
                  <span className="px-3 py-1 bg-[#00ff9f]/10 text-[#00ff9f] text-[10px] uppercase font-bold tracking-widest rounded-full border border-[#00ff9f]/20 w-fit">
                    Most Recent
                  </span>
                )}
              </div>

              <h4 className="text-2xl font-bold text-white mb-2">{exp.role}</h4>
              <div className="flex items-center gap-2 text-[#00d4ff] mb-4">
                <Building2 size={16} />
                <span className="font-medium">{exp.company}</span>
              </div>
              
              <p className="text-slate-400 mb-6 leading-relaxed max-w-2xl">
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-[#112240] text-slate-400 text-xs rounded border border-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
