import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  category: 'Machine Learning' | 'Networking' | 'Cybersecurity' | 'Cloud' | 'Data Science';
}

const certificates: Certificate[] = [
  {
    title: 'Machine Learning Bootcamp',
    issuer: 'Dicoding',
    date: 'Januari 2025',
    imageUrl: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
    category: 'Machine Learning',
  },
  {
    title: 'Networking Fundamentals',
    issuer: 'ID-Networkers',
    date: 'Maret 2025',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    category: 'Networking',
  },
  {
    title: 'Cybersecurity Essentials',
    issuer: 'DQLab',
    date: 'Mei 2025',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    category: 'Cybersecurity',
  },
  {
    title: 'Tower Bersama Cloud Specialist',
    issuer: 'Tower Bersama',
    date: 'Juli 2025',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    category: 'Cloud',
  },
  {
    title: 'Data Science Deep Dive',
    issuer: 'DQLab',
    date: 'Agustus 2025',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981d?auto=format&fit=crop&w=1200&q=80',
    category: 'Data Science',
  },
  {
    title: 'Network Security Expert',
    issuer: 'ID-Networkers',
    date: 'Oktober 2025',
    imageUrl: 'https://images.unsplash.com/photo-1514951739440-ec0bfa368d64?auto=format&fit=crop&w=1200&q=80',
    category: 'Cybersecurity',
  },
];

const categories = ['All', 'Machine Learning', 'Networking', 'Cybersecurity', 'Cloud', 'Data Science'] as const;

type CategoryType = (typeof categories)[number];

export const CertificatesPage = ({ onBack }: { onBack?: () => void }) => {
  const [filter, setFilter] = useState<CategoryType>('All');
  const [selected, setSelected] = useState<Certificate | null>(null);

  const currentCertificates =
    filter === 'All' ? certificates : certificates.filter((c) => c.category === filter);

  return (
    <section className="min-h-screen px-6 py-20 bg-[#0a192f] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Certificate Gallery</h1>
          <p className="text-slate-300 text-sm md:text-base">Lihat prestasi dan sertifikat terbaru saya dalam berbagai kategori.</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 px-4 py-2 text-sm rounded border border-[#00ff9f] text-[#00ff9f] hover:bg-[#00ff9f]/10"
            >
              Kembali ke portfolio
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                filter === cat
                  ? 'bg-[#00ff9f] text-[#0a192f] border border-[#00ff9f]'
                  : 'bg-[#112240] text-slate-300 border border-[#2d4461] hover:bg-[#1e3b60]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCertificates.map((cert) => (
            <motion.div
              layout
              key={cert.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#112240] rounded-2xl border border-[#27465f] overflow-hidden shadow-xl"
            >
              <button type="button" onClick={() => setSelected(cert)} className="group relative block w-full h-56 overflow-hidden">
                <img
                  src={cert.imageUrl}
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-1">{cert.title}</h3>
                <p className="text-slate-300 text-sm">Issuer: {cert.issuer}</p>
                <p className="text-slate-400 text-xs mt-1">Date: {cert.date}</p>
                <p className="text-xs text-[#00ff9f] mt-2">Category: {cert.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative w-full max-w-3xl rounded-2xl bg-[#0a192f] shadow-2xl border border-[#00ff9f]/40 overflow-hidden"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
              <img src={selected.imageUrl} alt={selected.title} className="w-full max-h-[70vh] object-contain bg-slate-900" />
              <div className="p-5">
                <h4 className="text-xl font-bold text-white mb-1">{selected.title}</h4>
                <p className="text-slate-300">{selected.issuer} | {selected.date}</p>
                <p className="text-xs text-[#00ff9f] mt-2">Kategori: {selected.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
