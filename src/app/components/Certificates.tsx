import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import supabase from '../supabaseClient';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  file: string;
  date: string;
  category: string;
  logo_url: string;
  created_at: string;
}

interface CertificatesProps {
  onCertificatesClick: () => void;
}

export const Certificates = ({ onCertificatesClick }: CertificatesProps) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6); // Show only 6 certificates on homepage

        if (error) {
          console.log('Supabase certificates table not found');
          setCertificates([]);
        } else if (data) {
          setCertificates(data);
        }
      } catch (err) {
        console.log('Error fetching certificates:', err);
        setCertificates([]);
      }
      setLoading(false);
    };

    fetchCertificates();
  }, []);

  // Sanitize file path for display and opening
  const sanitizeFilePath = (filePath: string): string => {
    if (!filePath) return '';

    // If it's already a web path starting with /certificates/, return as is
    if (filePath.startsWith('/certificates/')) {
      // Handle double slashes
      return filePath.replace(/\/certificates\/+/, '/certificates/');
    }

    // If it's a file:// URL, extract filename and convert to web path
    if (filePath.startsWith('file:///')) {
      try {
        const url = new URL(filePath);
        const pathname = decodeURIComponent(url.pathname);
        const filename = pathname.split('\\').pop() || pathname.split('/').pop() || '';
        return `/certificates/${filename}`;
      } catch (error) {
        console.error('Error parsing file URL:', error);
        return '';
      }
    }

    // If it's a Windows path, extract filename
    if (filePath.includes('\\') || filePath.includes('/')) {
      const filename = filePath.split('\\').pop() || filePath.split('/').pop() || '';
      if (filename) {
        return `/certificates/${filename}`;
      }
    }

    // If it's just a filename, add certificates path
    if (!filePath.includes('/') && !filePath.includes('\\')) {
      return `/certificates/${filePath}`;
    }

    return '';
  };

  // Handle opening PDF
  const handleOpenPDF = (filePath: string) => {
    const pdfUrl = sanitizeFilePath(filePath);
    console.log('Original file path:', filePath);
    console.log('Sanitized PDF URL:', pdfUrl);

    if (!pdfUrl) {
      alert('File sertifikat belum tersedia atau path tidak valid');
      return;
    }

    try {
      // Check if the file exists by trying to fetch it
      fetch(pdfUrl, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            window.open(pdfUrl, '_blank');
          } else {
            console.error('File not found:', pdfUrl);
            alert('File sertifikat tidak ditemukan. Pastikan file sudah diupload dengan benar.');
          }
        })
        .catch(error => {
          console.error('Error checking file:', error);
          alert('Terjadi kesalahan saat membuka sertifikat. Silakan coba lagi.');
        });
    } catch (error) {
      console.error('Error opening PDF:', error);
      alert('Terjadi kesalahan saat membuka sertifikat.');
    }
  };

  if (loading) {
    return (
      <section id="certificates" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border border-[#00ff9f] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-400">Loading certificates...</p>
        </div>
      </section>
    );
  }

  if (certificates.length === 0) {
    return null; // Don't show section if no certificates
  }

  return (
    <section id="certificates" className="py-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          My <span className="text-[#00ff9f]">Certificates</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Professional certifications and achievements in technology and development.
        </p>
        <button
          onClick={onCertificatesClick}
          className="px-6 py-3 bg-[#00ff9f] text-[#0a192f] font-bold rounded-lg hover:bg-[#00cc7f] transition-colors"
        >
          View All Certificates
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group bg-[#112240] rounded-2xl border border-[#27465f] p-5 shadow-lg hover:border-[#00ff9f] cursor-pointer transition-all duration-300"
            onClick={() => handleOpenPDF(cert.file)}
          >
            <div className="h-32 bg-slate-900 rounded-xl relative mb-4 border border-slate-800 p-3 overflow-hidden">
              {cert.logo_url ? (
                <img
                  src={cert.logo_url}
                  alt={`${cert.issuer} logo`}
                  className="object-contain w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-slate-500">
                  <span className="text-sm">Certificate</span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{cert.title}</h3>
            <p className="text-slate-300 text-sm mb-1">Issuer: {cert.issuer}</p>
            <p className="text-slate-300 text-sm mb-1">Category: {cert.category}</p>
            {cert.date && <p className="text-slate-500 text-xs mb-3">Date: {cert.date}</p>}
            <div className="text-[#00ff9f] text-sm font-semibold group-hover:text-white transition-colors">
              Click to view PDF →
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};