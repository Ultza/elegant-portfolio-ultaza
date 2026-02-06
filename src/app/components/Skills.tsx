import React from 'react';
import { motion } from 'motion/react';
import { Code, Box, Tool, Layers, Monitor, Database, Terminal } from 'lucide-react';

const skillCategories = [
  {
    title: 'Programming',
    icon: <Code size={20} className="text-[#00ff9f]" />,
    skills: ['HTML', 'CSS', 'PHP', 'JavaScript', 'Kotlin', 'Python', 'C++'],
    color: 'border-[#00ff9f]/30 bg-[#00ff9f]/5'
  },
  {
    title: 'Frameworks',
    icon: <Layers size={20} className="text-[#00d4ff]" />,
    skills: ['Laravel', 'CI3', 'CI4', 'React'],
    color: 'border-[#00d4ff]/30 bg-[#00d4ff]/5'
  },
  {
    title: 'Software & Tools',
    icon: <Terminal size={20} className="text-purple-500" />,
    skills: [
      'Microsoft Office', 'ArcMap', 'Google Earth', 'Visual Studio Code', 
      'Xampp', 'MySQL Workbench', 'MongoDB', 'Android Studio', 'Cisco', 'Burp Suite'
    ],
    color: 'border-purple-500/30 bg-purple-500/5'
  }
];

export const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-[#0a192f]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-[#00ff9f] font-mono text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-10 h-[1px] bg-[#00ff9f]"></span>
            Expertise
            <span className="w-10 h-[1px] bg-[#00ff9f]"></span>
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Technical Arsenal</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-8 rounded-2xl border ${category.color} flex flex-col h-full`}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-lg bg-[#0a192f] border border-slate-800">
                  {category.icon}
                </div>
                <h4 className="text-xl font-bold text-white">{category.title}</h4>
              </div>

              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-md bg-[#0a192f] border border-slate-800 text-slate-300 text-sm font-medium hover:border-[#00ff9f]/50 hover:text-[#00ff9f] transition-all cursor-default"
                  >
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
