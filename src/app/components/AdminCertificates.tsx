import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  file: string;
  pdf_url?: string;
  date: string;
  category: string;
  logo_url: string;
  created_at: string;
}

interface FormData {
  title: string;
  issuer: string;
  pdf_file: File | null;
  date: string;
  category: string;
  logo_url: string;
}

export const AdminCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    issuer: '',
    pdf_file: null,
    date: '',
    category: '',
    logo_url: '',
  });

  // Fetch certificates
  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Supabase certificates table not found, using local state');
        setCertificates([]);
      } else if (data) {
        setCertificates(data);
      }
    } catch (err) {
      console.log('Using local state for certificates');
      setCertificates([]);
    }
    setLoading(false);
  };

  // Sanitize file path - convert local Windows paths to web paths
  const sanitizeFilePath = (filePath: string): string => {
    if (!filePath) return '';

    if (filePath.startsWith('/certificates/')) {
      return filePath.replace(/\/certificates\/+/, '/certificates/');
    }

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

    if (filePath.includes('\\') || filePath.includes('/')) {
      const filename = filePath.split('\\').pop() || filePath.split('/').pop() || '';
      if (filename) {
        return `/certificates/${filename}`;
      }
    }

    if (!filePath.includes('/') && !filePath.includes('\\')) {
      return `/certificates/${filePath}`;
    }

    return '';
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file && file.type !== 'application/pdf') {
      setSubmitError('File yang diunggah harus berformat PDF.');
      e.target.value = '';
      setFormData((prev) => ({ ...prev, pdf_file: null }));
      return;
    }

    setSubmitError(null);
    setFormData((prev) => ({ ...prev, pdf_file: file }));
  };

  const saveCertificateRecord = async (payload: Record<string, unknown>, isEditing: boolean) => {
    if (isEditing && editingId) {
      const { error } = await supabase.from('certificates').update(payload).eq('id', editingId);
      if (error) {
        if (error.message.toLowerCase().includes('pdf_url') || error.message.toLowerCase().includes('column')) {
          const { error: fallbackError } = await supabase
            .from('certificates')
            .update({ ...payload, pdf_url: undefined })
            .eq('id', editingId);

          if (fallbackError) {
            throw fallbackError;
          }
          return;
        }
        throw error;
      }
      return;
    }

    const { data, error } = await supabase.from('certificates').insert([payload]).select();
    if (error) {
      if (error.message.toLowerCase().includes('pdf_url') || error.message.toLowerCase().includes('column')) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('certificates')
          .insert([{ ...payload, pdf_url: undefined }])
          .select();

        if (fallbackError) {
          throw fallbackError;
        }

        return fallbackData;
      }
      throw error;
    }

    return data;
  };

  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const existingCertificate = editingId
        ? certificates.find((cert) => cert.id === editingId)
        : null;
      const existingPdfUrl = existingCertificate?.pdf_url || existingCertificate?.file || '';

      if (!formData.title || !formData.issuer || !formData.category) {
        setSubmitError('Judul, penerbit, dan kategori wajib diisi.');
        setIsSubmitting(false);
        return;
      }

      const pdfFile = formData.pdf_file;
      const hasExistingPdf = Boolean(existingPdfUrl);

      if (!pdfFile && !hasExistingPdf) {
        setSubmitError('Harus upload file PDF baru atau pilih sertifikat yang sudah memiliki file.');
        setIsSubmitting(false);
        return;
      }

      let finalPdfUrl = existingPdfUrl;

      if (pdfFile) {
        const uniqueFileName = `${Date.now()}-${pdfFile.name.replace(/\s+/g, '-')}`;
        const storagePath = `${uniqueFileName}`;

        const { data: uploadedFile, error: uploadError } = await supabase
          .storage
          .from('certificates')
          .upload(storagePath, pdfFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'application/pdf',
          });

        if (uploadError) {
          throw uploadError;
        }

        if (!uploadedFile) {
          throw new Error('Upload PDF gagal: file tidak tersedia.');
        }

        const { data: publicUrlData } = supabase
          .storage
          .from('certificates')
          .getPublicUrl(uploadedFile.path);

        finalPdfUrl = publicUrlData.publicUrl;
      }

      const certificateData = {
        title: formData.title,
        issuer: formData.issuer,
        file: finalPdfUrl,
        pdf_url: finalPdfUrl,
        date: formData.date,
        category: formData.category,
        logo_url: formData.logo_url,
        created_at: new Date().toISOString(),
      };

      if (editingId) {
        await saveCertificateRecord(certificateData, true);
        setCertificates((prev) =>
          prev.map((cert) =>
            cert.id === editingId
              ? { ...cert, ...certificateData, file: finalPdfUrl, pdf_url: finalPdfUrl }
              : cert
          )
        );
        setSuccessMessage('Sertifikat berhasil diperbarui');
      } else {
        const result = await saveCertificateRecord(certificateData, false);
        const createdCertificate = Array.isArray(result) ? result[0] : result;

        if (createdCertificate) {
          setCertificates((prev) => [createdCertificate, ...prev]);
        }
        setSuccessMessage('Sertifikat berhasil dibuat');
      }

      setFormData({
        title: '',
        issuer: '',
        pdf_file: null,
        date: '',
        category: '',
        logo_url: '',
      });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error('Save error:', err);
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan sertifikat';
      setSubmitError(message);
    }
    setIsSubmitting(false);
  };

  const handleEditCertificate = (certificate: Certificate) => {
    setFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      pdf_file: null,
      date: certificate.date,
      category: certificate.category,
      logo_url: certificate.logo_url,
    });
    setEditingId(certificate.id);
    setShowForm(true);
  };

  const handleDeleteCertificate = async (id: string) => {
    try {
      const { error } = await supabase.from('certificates').delete().eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        setSubmitError(`Gagal hapus sertifikat: ${error.message}`);
        return;
      }

      setCertificates(certificates.filter((cert) => cert.id !== id));
      setDeleteConfirm(null);
      setSuccessMessage('Sertifikat berhasil dihapus');
    } catch (err) {
      setSubmitError('Terjadi kesalahan saat menghapus sertifikat');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      issuer: '',
      pdf_file: null,
      date: '',
      category: '',
      logo_url: '',
    });
    setSubmitError(null);
  };

  // Auto-dismiss success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const categoryOptions = [
    'Web Development',
    'Data Science',
    'AI',
    'Cloud',
    'Cybersecurity',
    'Safety',
    'Leadership',
    'Finance',
    'Education',
    'Other'
  ];

  if (loading) {
    return (
      <div className="text-white text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border border-[#00ff9f] border-t-transparent"></div>
        <p className="mt-4">Loading sertifikat...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {fetchError && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
          Error: {fetchError}
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <div className="bg-[#112240] p-6 rounded-lg border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingId ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
          </h3>

          {submitError && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSaveCertificate} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Judul Sertifikat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Masukkan judul sertifikat"
                className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
              />
            </div>

            {/* Issuer */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Penerbit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="issuer"
                value={formData.issuer}
                onChange={handleInputChange}
                placeholder="Masukkan nama penerbit"
                className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
              >
                <option value="">Pilih kategori</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Tahun
              </label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="2025"
                className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
              />
            </div>

            {/* PDF File Upload */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                File PDF Sertifikat {editingId ? '' : <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#00ff9f] file:text-[#0a192f] file:font-semibold file:cursor-pointer"
              />
              <p className="text-xs text-slate-400 mt-1">
                {isSubmitting
                  ? 'Mengunggah dan menyimpan PDF ke Supabase Storage...'
                  : formData.pdf_file
                    ? `File dipilih: ${formData.pdf_file.name}`
                    : editingId
                      ? 'Biarkan kosong jika tidak ingin mengganti PDF lama.'
                      : 'Pilih file PDF yang akan diunggah.'}
              </p>
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                URL Logo Penerbit
              </label>
              <input
                type="text"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
              />
              {formData.logo_url && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-600 w-24 h-24">
                  <img
                    src={formData.logo_url}
                    alt="Logo preview"
                    className="w-full h-full object-contain bg-slate-900 p-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect fill=%22%23112240%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-family=%22Arial%22 font-size=%2216%22 fill=%22%23666%22 text-anchor=%22middle%22 dy=%22.3em%22%3ELogo not found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-[#00ff9f] text-[#0a192f] font-bold rounded-lg hover:bg-[#00cc7f] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Menyimpan...' : editingId ? 'Perbarui Sertifikat' : 'Tambah Sertifikat'}
              </button>
              <button
                type="button"
                onClick={handleCancelForm}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-slate-600 text-white rounded-lg hover:border-slate-400 disabled:opacity-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Certificate Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-[#00ff9f] text-[#0a192f] font-bold rounded-lg hover:bg-[#00cc7f] transition-colors"
        >
          + Tambah Sertifikat Baru
        </button>
      )}

      {/* Certificates List */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">
          Daftar Sertifikat ({certificates.length})
        </h3>

        {certificates.length === 0 ? (
          <div className="text-center py-12 bg-[#112240] rounded-lg border border-slate-700">
            <p className="text-slate-400">Belum ada sertifikat</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-[#112240] border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-colors"
              >
                {/* Logo */}
                {cert.logo_url && (
                  <div className="h-24 bg-slate-900 rounded-lg border border-slate-800 p-2 mb-4 overflow-hidden">
                    <img
                      src={cert.logo_url}
                      alt={`${cert.issuer} logo`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg mb-2 line-clamp-2">
                    {cert.title}
                  </h4>
                  <p className="text-slate-300 text-sm mb-1">Penerbit: {cert.issuer}</p>
                  <p className="text-slate-300 text-sm mb-1">Kategori: {cert.category}</p>
                  {cert.date && <p className="text-slate-500 text-xs mb-3">Tahun: {cert.date}</p>}
                  <p className="text-slate-500 text-xs mb-4 truncate">File: {cert.file}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => handleEditCertificate(cert)}
                    className="flex-1 px-3 py-2 text-xs font-semibold border border-blue-500/50 text-blue-400 rounded hover:bg-blue-500/10 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(cert.id)}
                    className="flex-1 px-3 py-2 text-xs font-semibold border border-red-500/50 text-red-400 rounded hover:bg-red-500/10 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#112240] border border-slate-700 rounded-lg p-6 max-w-sm">
            <h4 className="text-white font-bold text-lg mb-4">Hapus Sertifikat?</h4>
            <p className="text-slate-300 mb-6">
              Apakah Anda yakin ingin menghapus sertifikat ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteCertificate(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-slate-600 text-white rounded hover:border-slate-400 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};