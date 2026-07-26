import React from 'react';
import { motion } from 'motion/react';
import { Code, Layers, Terminal } from 'lucide-react';

const skillCategories = [
  { title: 'Pemrograman', icon: <Code size={20} />, skills: ['HTML', 'CSS', 'PHP', 'JavaScript', 'Kotlin', 'Python', 'C++'], accentVar: '--t-accent' },
  { title: 'Framework', icon: <Layers size={20} />, skills: ['Laravel', 'CI3', 'CI4', 'React'], accentVar: '--t-accent2' },
  { title: 'Perangkat Lunak & Tools', icon: <Terminal size={20} />, skills: ['Microsoft Office', 'ArcMap', 'Google Earth', 'Visual Studio Code', 'Xampp', 'MySQL Workbench', 'MongoDB', 'Android Studio', 'Cisco', 'Burp Suite'], accentVar: '--t-text-sub' },
];

export const Skills = () => {
  return (
    <section id="skills" className="py-24" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="font-mono text-sm tracking-widest uppercase mb-4 flex items-center gap-2" style={{ color: 'var(--t-accent)' }}>
            <span className="w-10 h-[1px]" style={{ background: 'var(--t-accent)' }} />
            Keahlian
            <span className="w-10 h-[1px]" style={{ background: 'var(--t-accent)' }} />
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--t-text)' }}>
            Kemampuan Teknis
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, idx) => (
            <motion.div key={category.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="p-8 rounded-2xl border flex flex-col h-full" style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-lg border" style={{ background: 'var(--t-bg)', color: `var(${category.accentVar})`, borderColor: 'var(--t-border)' }}>
                  {category.icon}
                </div>
                <h4 className="text-xl font-bold" style={{ color: 'var(--t-text)' }}>{category.title}</h4>
              </div>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 rounded-md border text-sm font-medium cursor-default transition-all"
                    style={{ background: 'var(--t-tag-bg)', color: 'var(--t-tag-text)', borderColor: 'var(--t-border)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `color-mix(in srgb, var(${category.accentVar}) 50%, transparent)`; e.currentTarget.style.color = `var(${category.accentVar})`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--t-border)'; e.currentTarget.style.color = 'var(--t-tag-text)'; }}>
                    {skill}
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
