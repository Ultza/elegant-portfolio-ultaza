import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Monitor, Globe, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const assets = {
  TOKOLAPTOP_IMG: new URL('../../assets/TOKOLAPTOP.jpeg', import.meta.url).href,
  DISKOMINSA_IMG: new URL('../../assets/DISKOMINSA.jpeg', import.meta.url).href,
  FORESTWACTH_IMG: new URL('../../assets/FORESTWACTH.jpeg', import.meta.url).href,
};

const projects = [
  {
    title: 'Website Penjualan Laptop Toko Hasnitaria',
    description: 'Platform e-commerce yang dirancang untuk penjualan laptop, dilengkapi fitur manajemen produk dan alur pemesanan.',
    image: assets.TOKOLAPTOP_IMG,
    tags: ['E-commerce', 'PHP', 'Laravel', 'MySQL'],
    icon: <Monitor size={20} />,
    demoUrl: '',
  },
  {
    title: 'Integrasi Fitur Berita - Diskominsa',
    description: 'Mengintegrasikan fitur kategorisasi dan manajemen berita tingkat lanjut ke website resmi Diskominsa Aceh Barat menggunakan CI3.',
    image: assets.DISKOMINSA_IMG,
    tags: ['CodeIgniter 3', 'Integrasi Web', 'Pemerintah'],
    icon: <Globe size={20} />,
    demoUrl: '',
  },
  {
    title: 'Dashboard Forest Guard',
    description: 'Dashboard pemantauan infrastruktur hijau untuk pengelolaan hutan dan peringatan lingkungan secara realtime.',
    image: assets.FORESTWACTH_IMG,
    tags: ['React', 'Tailwind CSS', 'GIS', 'Dashboard'],
    icon: <Shield size={20} />,
    demoUrl: 'https://forest-guard-dashboard.vercel.app/',
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="py-24" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="font-mono text-sm tracking-widest uppercase mb-4 flex items-center gap-2" style={{ color: 'var(--t-accent)' }}>
            <span className="w-10 h-[1px]" style={{ background: 'var(--t-accent)' }} />
            Karya
            <span className="w-10 h-[1px]" style={{ background: 'var(--t-accent)' }} />
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--t-text)' }}>
            Proyek Unggulan
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group rounded-2xl overflow-hidden border transition-all flex flex-col"
              style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--t-accent) 30%, transparent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--t-border)')}>
              <div className="relative aspect-video overflow-hidden">
                <ImageWithFallback src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
                  {project.demoUrl ? (
                    <a href={project.demoUrl} target="_blank" rel="noreferrer" className="p-3 bg-white text-slate-900 rounded-full transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--t-accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}>
                      <ExternalLink size={20} />
                    </a>
                  ) : (
                    <button className="p-3 bg-white text-slate-900 rounded-full transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--t-accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}>
                      <ExternalLink size={20} />
                    </button>
                  )}
                  <button className="p-3 bg-white text-slate-900 rounded-full transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--t-accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}>
                    <Github size={20} />
                  </button>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--t-accent)' }}>
                  <div className="p-2 rounded-lg border" style={{ background: 'var(--t-bg)', borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)' }}>
                    {project.icon}
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">Pengembangan Web</span>
                </div>
                <h4 className="text-xl font-bold mb-3 transition-colors" style={{ color: 'var(--t-text)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--t-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--t-text)')}>
                  {project.title}
                </h4>
                <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: 'var(--t-text-muted)' }}>{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-[10px] font-bold uppercase rounded border" style={{ background: 'var(--t-tag-bg)', color: 'var(--t-tag-text)', borderColor: 'var(--t-border)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
