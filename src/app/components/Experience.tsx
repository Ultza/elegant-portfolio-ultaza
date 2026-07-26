import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Building2 } from 'lucide-react';

const experiences = [
  {
    period: '2024 - 2025',
    role: 'Kerja Praktek',
    company: 'Dinas Komunikasi, Informatika, dan Persandian Aceh Barat',
    description: 'Berfokus pada sistem TIK dan layanan teknologi informasi tingkat pemerintah.',
    tags: ['TIK', 'Jaringan', 'Integrasi Web'],
    isLatest: true,
  },
  {
    period: '2022 - 2024',
    role: 'Manager GIS dan Data',
    company: 'Yayasan APEL Green Aceh',
    description: 'Mengelola Sistem Informasi Geografis (GIS) dan data lingkungan skala besar untuk mendukung upaya konservasi.',
    tags: ['GIS', 'ArcMap', 'Manajemen Data'],
    isLatest: false,
  },
  {
    period: '2024 (Feb - Apr)',
    role: 'Enumerator',
    company: 'Program Kampung Iklim (Proklim) KLHK',
    description: 'Melakukan pengumpulan data lapangan untuk pemetaan ketahanan iklim dan analisis lingkungan masyarakat.',
    tags: ['Survei', 'Data Lingkungan', 'KLHK'],
    isLatest: false,
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="py-24 border-y" style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="font-mono text-sm tracking-widest uppercase mb-4 flex items-center gap-2" style={{ color: 'var(--t-accent)' }}>
            <span className="w-10 h-[1px]" style={{ background: 'var(--t-accent)' }} />
            Linimasa
            <span className="w-10 h-[1px]" style={{ background: 'var(--t-accent)' }} />
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--t-text)' }}>
            Jalur Profesional
          </h3>
        </div>

        <div className="relative border-l ml-4 md:ml-0" style={{ borderColor: 'var(--t-border)' }}>
          {experiences.map((exp, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="mb-16 last:mb-0 relative pl-10">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-colors" style={{ background: 'var(--t-dot-bg)', borderColor: exp.isLatest ? 'var(--t-accent)' : 'var(--t-border)', boxShadow: exp.isLatest ? '0 0 10px color-mix(in srgb, var(--t-accent) 50%, transparent)' : 'none' }} />

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                <span className="font-mono text-sm font-bold flex items-center gap-2" style={{ color: 'var(--t-accent)' }}>
                  <Calendar size={14} /> {exp.period}
                </span>
                {exp.isLatest && (
                  <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border w-fit" style={{ background: 'var(--t-accent-bg)', color: 'var(--t-accent)', borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)' }}>
                    Terbaru
                  </span>
                )}
              </div>

              <h4 className="text-2xl font-bold mb-2" style={{ color: 'var(--t-text)' }}>{exp.role}</h4>
              <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--t-accent2)' }}>
                <Building2 size={16} />
                <span className="font-medium">{exp.company}</span>
              </div>
              <p className="mb-6 leading-relaxed max-w-2xl" style={{ color: 'var(--t-text-muted)' }}>{exp.description}</p>

              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs rounded border" style={{ background: 'var(--t-bg-card)', color: 'var(--t-text-muted)', borderColor: 'var(--t-border)' }}>
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
