import React from 'react';
import { motion } from 'motion/react';
import { Users, ShieldCheck, Trophy } from 'lucide-react';

const leaderItems = [
  { role: 'Ketua OSIS', org: 'SMAN 3 Seunagan', period: '2019 - 2021', achievement: 'Peringkat 1 di kelas & memimpin berbagai inisiatif siswa.', iconEl: <Trophy size={28} />, accentVar: '--t-accent' },
  { role: 'Manajer Proyek', org: 'APEL Green Aceh', period: '2022', achievement: 'Pemimpin proyek Pemantauan Kawasan Lindung.', iconEl: <ShieldCheck size={28} />, accentVar: '--t-accent2' },
  { role: 'Anggota Aktif', org: 'HIMATIF UTU', period: 'Aktif', achievement: 'Anggota Himpunan Mahasiswa Teknologi Informasi.', iconEl: <Users size={28} />, accentVar: '--t-text-sub' },
];

export const Leadership = () => {
  return (
    <section id="leadership" className="py-24" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="font-mono text-sm tracking-widest uppercase mb-4 flex items-center gap-2" style={{ color: 'var(--t-accent)' }}>
            <span className="w-10 h-[1px]" style={{ background: 'var(--t-accent)' }} />
            Pengaruh
            <span className="w-10 h-[1px]" style={{ background: 'var(--t-accent)' }} />
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--t-text)' }}>
            Kepemimpinan & Dampak
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaderItems.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl border flex flex-col items-center text-center relative group"
              style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}>
              <div className="w-16 h-16 rounded-2xl border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)', color: `var(${item.accentVar})` }}>
                {item.iconEl}
              </div>
              <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--t-text)' }}>{item.role}</h4>
              <p className="font-mono text-xs mb-4 uppercase tracking-widest" style={{ color: `var(${item.accentVar})` }}>{item.org}</p>
              <p className="text-sm mb-4" style={{ color: 'var(--t-text-muted)' }}>{item.period}</p>
              <div className="w-full h-[1px] mb-6" style={{ background: 'var(--t-border)' }} />
              <p className="italic text-sm" style={{ color: 'var(--t-text-muted)' }}>"{item.achievement}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
