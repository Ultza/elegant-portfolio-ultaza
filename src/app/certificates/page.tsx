import React from 'react';
import { motion } from 'motion/react';
import dicodingLogo from '@/assets/dicoding.png';
import gatakiLogo from '@/assets/logo_PT__GATAKI_KONSTRUKSI_MANDIRI_1634566589.png';
import komdigiLogo from '@/assets/KOMDIGI.png';
import microsoftLogo from '@/assets/microsoft.jpg';
import dinasLogo from '@/assets/Dinas-Kebudayaan-Pariwisata-Pemuda-dan-Olahraga.png';

interface Certificate {
  title: string;
  issuer: string;
  file: string;
  date?: string;
  category?: string;
  logoAsset?: string;
}

const certificates: Certificate[] = [
  { 
    title: 'Supervisor K3 Konstruksi', 
    issuer: 'Kementerian Ketenagakerjaan', 
    file: '/certificates/SERTIFIKAT-SUPERVISOR-K3-KONSTRUKSI-UL-TAZASYAH.pdf', 
    date: '2025', 
    category: 'Safety',
    logoAsset: gatakiLogo
  },
    { 
    title: 'Pelatihan OKP', 
    issuer: 'Organisasi', 
    file: '/certificates/PELATIHAN-OKP-ULTAZA.pdf', 
    date: '2025', 
    category: 'Leadership',
    logoAsset: dinasLogo
  },
  { 
    title: 'Front-End Web Development', 
    issuer: 'Dicoding', 
    file: '/certificates/sertifikat-front-end-dicoding.pdf', 
    date: '2025', 
    category: 'Web Development',
    logoAsset: dicodingLogo
  },
  { 
    title: 'Pemrograman JavaScript', 
    issuer: 'Dicoding', 
    file: '/certificates/sertifikat-pemograman-javascript-dicoding.pdf', 
    date: '2025', 
    category: 'Web Development',
    logoAsset: dicodingLogo
  },
  { 
    title: 'Pemrograman Website Dasar', 
    issuer: 'Dicoding', 
    file: '/certificates/sertifikat-pemrograman-website-dicoding.pdf', 
    date: '2025', 
    category: 'Web Development',
    logoAsset: dicodingLogo
  },
  { 
    title: 'Microsoft Fabric', 
    issuer: 'Dicoding', 
    file: '/certificates/sertifikat-microsoft-fabric-dicoding.pdf', 
    date: '2025', 
    category: 'Data Science',
    logoAsset: dicodingLogo
  },
  { 
    title: 'Ethical Hacker For Dummies', 
    issuer: 'Cyber Academy', 
    file: '/certificates/Sertifikat_ULTAZA-SYAH_Ethical-Hacker-For-Dummies.pdf', 
    date: '2025', 
    category: 'Cybersecurity',
    logoAsset: komdigiLogo
  },
  { 
    title: 'Cyber Security Awareness', 
    issuer: 'Cyber Academy', 
    file: '/certificates/Sertifikat_ULTAZA-SYAH_Introduction-to-Cyber-Security-and-Career-Awareness.pdf', 
    date: '2025', 
    category: 'Cybersecurity',
    logoAsset: komdigiLogo
  },
  { 
    title: 'AI Engineer For Milenial', 
    issuer: 'Cloud Computing ID', 
    file: '/certificates/Sertifikat_ULTAZASYAH_AI-Engineer-For-Milenial.pdf', 
    date: '2025', 
    category: 'AI',
    logoAsset: komdigiLogo
  },
  { 
    title: 'Introduction To Cloud Computing', 
    issuer: 'Cloud Computing ID', 
    file: '/certificates/Sertifikat_ULTAZASYAH_Introduction-To-Cloud-Computing.pdf', 
    date: '2025', 
    category: 'Cloud',
    logoAsset: komdigiLogo
  },
  { 
    title: 'Gen-AI dengan Microsoft Azure', 
    issuer: 'Microsoft', 
    file: '/certificates/Membangun-Aplikasi-Gen-AI-dengan-Microsoft-Azure.pdf', 
    date: '2025', 
    category: 'AI',
    logoAsset: microsoftLogo
  },
  { 
    title: 'Financial Literacy', 
    issuer: 'CIMB Niaga / OJK', 
    file: '/certificates/Introduction-to-Financial-Literacy.pdf', 
    date: '2025', 
    category: 'Finance' 
  },
  { 
    title: 'Computational Thinking', 
    issuer: 'Bebras Indonesia', 
    file: '/certificates/Sertifikat_ULTAZASYAH_Computational-Thinking_Cara-Berpikir-Logis-untuk-Mengatasi-Masalah-Jenjang-SMA.pdf', 
    date: '2025', 
    category: 'Education',
    logoAsset: dinasLogo
  },
  { 
    title: 'Memulai Pemrograman Python', 
    issuer: 'Dicoding', 
    file: '/certificates/Sertifikatt-Memulai-Pemrograman-dengan-Python.pdf', 
    date: '2025', 
    category: 'Web Development' 
  }
];

export const CertificatesPage = ({ onBack }: { onBack?: () => void }) => {
  return (
    <section className="min-h-screen px-6 py-20 bg-[#0a192f] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Certificate Gallery</h1>
            <p className="text-slate-300">Klik card atau tombol untuk membuka file PDF sertifikat di tab baru.</p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-5 py-2 font-semibold rounded-lg bg-[#00ff9f] text-[#0a192f] hover:bg-[#66ffc0] transition-colors"
            >
              Kembali ke Beranda
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <motion.div
              key={cert.file}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="group bg-[#112240] rounded-2xl border border-[#27465f] p-5 shadow-lg hover:border-[#00ff9f]"
            >
              <a href={cert.file} target="_blank" rel="noopener noreferrer" className="block">
                <div className="h-44 bg-slate-900 rounded-xl flex items-center justify-center mb-4 border border-slate-800 p-3">
                  {cert.logoAsset ? (
                    <img
                      src={cert.logoAsset}
                      alt={cert.title}
                      className="h-full w-full object-contain"
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center text-slate-400">
                      <span className="text-sm font-semibold">PDF</span>
                      <span className="text-xs mt-1">No logo available</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{cert.title}</h3>
                <p className="text-slate-300 text-sm mb-1">Issuer: {cert.issuer}</p>
                {cert.date && <p className="text-slate-500 text-xs mb-3">Date: {cert.date}</p>}
              </a>
              <a
                href={cert.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 text-sm font-semibold rounded bg-[#00ff9f] text-[#0a192f] hover:bg-[#66ffc0] transition-all"
              >
                Lihat PDF
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
