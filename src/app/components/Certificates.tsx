import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Award, ExternalLink } from 'lucide-react';
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
          .limit(6);
        if (error) { setCertificates([]); }
        else if (data) { setCertificates(data); }
      } catch { setCertificates([]); }
      setLoading(false);
    };
    fetchCertificates();
  }, []);

  const sanitizeFilePath = (filePath: string): string => {
    if (!filePath) return '';
    if (filePath.startsWith('/certificates/'))
      return filePath.replace(/\/certificates\/+/, '/certificates/');
    if (filePath.startsWith('file:///')) {
      try {
        const url = new URL(filePath);
        const pathname = decodeURIComponent(url.pathname);
        const filename = pathname.split('\\').pop() || pathname.split('/').pop() || '';
        return `/certificates/${filename}`;
      } catch { return ''; }
    }
    if (filePath.includes('\\') || filePath.includes('/')) {
      const filename = filePath.split('\\').pop() || filePath.split('/').pop() || '';
      if (filename) return `/certificates/${filename}`;
    }
    if (!filePath.includes('/') && !filePath.includes('\\'))
      return `/certificates/${filePath}`;
    return '';
  };

  const handleOpenPDF = (filePath: string) => {
    const pdfUrl = sanitizeFilePath(filePath);
    if (!pdfUrl) { alert('File sertifikat belum tersedia atau path tidak valid'); return; }
    fetch(pdfUrl, { method: 'HEAD' })
      .then(res => {
        if (res.ok) window.open(pdfUrl, '_blank');
        else alert('File sertifikat tidak ditemukan.');
      })
      .catch(() => alert('Terjadi kesalahan saat membuka sertifikat.'));
  };

  if (loading) {
    return (
      <section id="certificates" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border border-t-transparent mx-auto mb-4"
            style={{ borderColor: 'var(--t-accent)' }}
          />
          <p style={{ color: 'var(--t-text-muted)' }}>Memuat sertifikat...</p>
        </div>
      </section>
    );
  }

  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-24" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <h2
            className="font-mono text-sm tracking-widest uppercase mb-4 flex items-center gap-2"
            style={{ color: 'var(--t-accent)' }}
          >
            <span className="w-10 h-[1px]" style={{ background: 'var(--t-accent)' }} />
            Pencapaian
            <span className="w-10 h-[1px]" style={{ background: 'var(--t-accent)' }} />
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--t-text)' }}>
            Sertifikat <span style={{ color: 'var(--t-accent)' }}>Saya</span>
          </h3>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--t-text-muted)' }}>
            Sertifikasi profesional dan pencapaian di bidang teknologi dan pengembangan.
          </p>
          <button onClick={onCertificatesClick}
            className="px-6 py-3 font-bold rounded-lg transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--t-accent)', color: 'var(--t-bg)', boxShadow: '0 4px 16px color-mix(in srgb, var(--t-accent) 25%, transparent)' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
            Lihat Semua Sertifikat
          </button>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden flex flex-col"
              style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}
              onClick={() => handleOpenPDF(cert.file)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--t-accent) 50%, transparent)';
                e.currentTarget.style.boxShadow = '0 8px 32px color-mix(in srgb, var(--t-accent) 10%, transparent)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--t-border)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Logo area */}
              <div
                className="h-32 relative flex items-center justify-center p-4 border-b"
                style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}
              >
                {cert.logo_url ? (
                  <img
                    src={cert.logo_url}
                    alt={`${cert.issuer} logo`}
                    className="object-contain w-full h-full"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Award size={32} style={{ color: 'var(--t-accent)', opacity: 0.5 }} />
                    <span className="text-xs font-mono" style={{ color: 'var(--t-text-sub)' }}>Sertifikat</span>
                  </div>
                )}
                {/* Category badge */}
                {cert.category && (
                  <span
                    className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                    style={{
                      background: 'var(--t-accent-bg)',
                      color: 'var(--t-accent)',
                      border: '1px solid color-mix(in srgb, var(--t-accent) 20%, transparent)',
                    }}
                  >
                    {cert.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h3
                  className="text-base font-bold mb-2 line-clamp-2 leading-snug"
                  style={{ color: 'var(--t-text)' }}
                >
                  {cert.title}
                </h3>
                <p className="text-sm mb-1" style={{ color: 'var(--t-accent)' }}>
                  {cert.issuer}
                </p>
                {cert.date && (
                  <p className="text-xs mb-3" style={{ color: 'var(--t-text-sub)' }}>
                    {cert.date}
                  </p>
                )}

                {/* View link */}
                <div
                  className="mt-auto flex items-center gap-1.5 text-sm font-semibold transition-colors"
                  style={{ color: 'var(--t-accent)' }}
                >
                  <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  Lihat Sertifikat
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
