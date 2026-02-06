import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Monitor, Globe, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const projects = [
  {
    title: 'Website Penjualan Laptop Toko Hasnitaria',
    description: 'A robust e-commerce platform designed for laptop hardware sales, featuring product management and order flows.',
    image: 'https://images.unsplash.com/photo-1558267535-896c0f00b67b?q=80&w=1080',
    tags: ['E-commerce', 'PHP', 'Laravel', 'MySQL'],
    icon: <Monitor size={20} />
  },
  {
    title: 'News Features Integration - Diskominsa',
    description: 'Integrated advanced news categorization and management features into the official Diskominsa Aceh Barat website using CI3.',
    image: 'https://images.unsplash.com/photo-1592323401640-9c24ed330baf?q=80&w=1080',
    tags: ['CodeIgniter 3', 'Web Integration', 'Government'],
    icon: <Globe size={20} />
  },
  {
    title: 'Professional Portfolio Website',
    description: 'A high-fidelity developer portfolio bridging technical IT expertise with environmental data management aesthetics.',
    image: 'https://images.unsplash.com/photo-1722082839833-04f0094ea4ec?q=80&w=1080',
    tags: ['React', 'Tailwind CSS', 'Framer Motion'],
    icon: <Shield size={20} />
  }
];

export const Projects = () => {
  return (
    <section id="projects" className="py-24 bg-[#0a192f]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-[#00ff9f] font-mono text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-10 h-[1px] bg-[#00ff9f]"></span>
            Showcase
            <span className="w-10 h-[1px] bg-[#00ff9f]"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Featured Projects</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-[#112240] rounded-2xl overflow-hidden border border-slate-800 hover:border-[#00ff9f]/30 transition-all flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#0a192f]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="p-3 bg-white text-slate-900 rounded-full hover:bg-[#00ff9f] transition-colors">
                    <ExternalLink size={20} />
                  </button>
                  <button className="p-3 bg-white text-slate-900 rounded-full hover:bg-[#00ff9f] transition-colors">
                    <Github size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-[#00ff9f] mb-4">
                  <div className="p-2 bg-[#0a192f] rounded-lg border border-[#00ff9f]/20">
                    {project.icon}
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">Web Development</span>
                </div>
                
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#00ff9f] transition-colors">
                  {project.title}
                </h4>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-[#0a192f] text-slate-500 text-[10px] font-bold uppercase rounded border border-slate-800">
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
