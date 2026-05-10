import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import supabase from '../supabaseClient';

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  unoptimized?: boolean;
};

const Image: React.FC<ImageProps> = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={className} />
);

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

export const CertificatesPage = ({ onBack }: { onBack?: () => void }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sanitize file path for display and opening
  const sanitizeFilePath = (filePath: string): string => {
    if (!filePath) return '';

    // If it's already a web path, return as is
    if (filePath.startsWith('/certificates/')) {
      return filePath;
    }

    // If it's a file:// URL, extract filename and convert to web path
    if (filePath.startsWith('file:///')) {
      try {
        // Extract filename from Windows path
        const url = new URL(filePath);
        const pathname = decodeURIComponent(url.pathname);
        const filename = pathname.split('\\').pop() || pathname.split('/').pop() || '';
        return `/certificates/${filename}`;
      } catch (error) {
        console.error('Error parsing file URL:', error);
        return filePath;
      }
    }

    // If it's just a filename, add certificates path
    if (!filePath.includes('/') && !filePath.includes('\\')) {
      return `/certificates/${filePath}`;
    }

    // For other cases, try to extract filename
    const filename = filePath.split('\\').pop() || filePath.split('/').pop() || '';
    return `/certificates/${filename}`;
  };

  // Handle opening PDF
  const handleOpenPDF = (filePath: string) => {
    const pdfUrl = sanitizeFilePath(filePath);
    console.log('Opening PDF:', pdfUrl);
    if (!pdfUrl) {
      alert('File sertifikat belum tersedia');
      return;
    }
    window.open(pdfUrl, '_blank');
  };

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Supabase certificates table not found, using fallback data');
          // Fallback to static data if Supabase table doesn't exist
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

  if (loading) {
    return (
      <section className="min-h-screen px-6 py-20 bg-[#0a192f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border border-[#00ff9f] border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg">Loading certificates...</p>
        </div>
      </section>
    );
  }

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

        {certificates.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">Belum ada sertifikat yang ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="group bg-[#112240] rounded-2xl border border-[#27465f] p-5 shadow-lg hover:border-[#00ff9f] cursor-pointer"
                onClick={() => handleOpenPDF(cert.file)}
              >
                <div className="h-44 bg-slate-900 rounded-xl relative mb-4 border border-slate-800 p-3 overflow-hidden">
                  {cert.logo_url ? (
                    <Image
                      src={cert.logo_url}
                      alt={`${cert.issuer} logo`}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-500">
                      <span className="text-sm">No Logo</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{cert.title}</h3>
                <p className="text-slate-300 text-sm mb-1">Issuer: {cert.issuer}</p>
                <p className="text-slate-300 text-sm mb-1">Category: {cert.category}</p>
                {cert.date && <p className="text-slate-500 text-xs mb-3">Date: {cert.date}</p>}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPDF(cert.file);
                  }}
                  className="inline-block mt-2 px-4 py-2 text-sm font-semibold rounded bg-[#00ff9f] text-[#0a192f] hover:bg-[#66ffc0] transition-all"
                >
                  Lihat PDF
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
