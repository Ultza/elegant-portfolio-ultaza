import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Briefcase, Star } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-24 relative" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="font-mono text-sm tracking-widest uppercase mb-4 flex items-center gap-2" style={{ color: 'var(--t-accent)' }}>
            <span className="w-10 h-[1px]" style={{ background: 'var(--t-accent)' }} />
            Tentang Saya
            <span className="w-10 h-[1px]" style={{ background: 'var(--t-accent)' }} />
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--t-text)' }}>
            Identitas & Visi
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
            {/* Pendidikan */}
            <div className="p-8 rounded-2xl border relative group overflow-hidden" style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 group-hover:opacity-10 transition-opacity" style={{ background: 'var(--t-accent)' }} />
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl border flex-shrink-0" style={{ background: 'var(--t-bg)', color: 'var(--t-accent)', borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)' }}>
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--t-text)' }}>Pendidikan</h4>
                  <p className="font-medium mb-1" style={{ color: 'var(--t-text-muted)' }}>S1 Teknologi Informasi</p>
                  <p className="text-sm mb-4" style={{ color: 'var(--t-accent)' }}>Universitas Teuku Umar</p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--t-text-muted)' }}>
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span>IPK <span className="font-bold" style={{ color: 'var(--t-text)' }}>3.29</span> / 4.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Magang */}
            <div className="p-8 rounded-2xl border relative group overflow-hidden" style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 group-hover:opacity-10 transition-opacity" style={{ background: 'var(--t-accent2)' }} />
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl border flex-shrink-0" style={{ background: 'var(--t-bg)', color: 'var(--t-accent2)', borderColor: 'color-mix(in srgb, var(--t-accent2) 20%, transparent)' }}>
                  <Briefcase size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--t-text)' }}>Kerja Praktek TIK</h4>
                  <p style={{ color: 'var(--t-text-muted)' }}>
                    Berpengalaman di bidang Teknologi Informasi dan Komunikasi melalui kerja praktek intensif di Diskominsa Aceh Barat.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col h-full">
            <p className="text-xl leading-relaxed mb-8" style={{ color: 'var(--t-text-muted)' }}>
              Saya adalah profesional IT yang sangat termotivasi dan proaktif, yang tumbuh subur dalam lingkungan kolaboratif. Pendekatan saya menggabungkan fondasi teknis yang kuat dalam pengembangan fullstack dengan fokus khusus pada GIS dan pengelolaan data lingkungan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-auto">
              <div className="p-6 rounded-xl border" style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border-sub)' }}>
                <h5 className="font-mono text-xs uppercase mb-3" style={{ color: 'var(--t-accent)' }}>Kepribadian</h5>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--t-text-muted)' }}>
                  <li>• Sangat Termotivasi</li>
                  <li>• Proaktif</li>
                  <li>• Pemain Tim yang Kuat</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl border" style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border-sub)' }}>
                <h5 className="font-mono text-xs uppercase mb-3" style={{ color: 'var(--t-accent2)' }}>Organisasi</h5>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--t-text-muted)' }}>
                  <li>• Ketua OSIS SMAN 3 Seunagan</li>
                  <li>• Anggota HIMATIF UTU</li>
                  <li>• Anggota APEL Green Aceh</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
