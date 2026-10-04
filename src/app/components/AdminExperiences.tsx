import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

interface ExperienceRecord {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  is_latest: boolean;
  created_at: string;
}

interface ExperienceFormData {
  role: string;
  company: string;
  period: string;
  description: string;
  skillsText: string;
  is_latest: boolean;
}

const parseSkills = (value: string | string[] | null | undefined): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeExperience = (item: Partial<ExperienceRecord> | null | undefined): ExperienceRecord | null => {
  if (!item) return null;

  return {
    id: String(item.id ?? crypto.randomUUID()),
    role: String(item.role ?? '').trim(),
    company: String(item.company ?? '').trim(),
    period: String(item.period ?? '').trim(),
    description: String(item.description ?? '').trim(),
    skills: parseSkills(item.skills),
    is_latest: Boolean(item.is_latest),
    created_at: String(item.created_at ?? new Date().toISOString()),
  };
};

export const AdminExperiences = () => {
  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState<ExperienceFormData>({
    role: '',
    company: '',
    period: '',
    description: '',
    skillsText: '',
    is_latest: false,
  });

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('is_latest', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch experiences error:', error);
        setExperiences([]);
        return;
      }

      const mapped = (data ?? [])
        .map(normalizeExperience)
        .filter((item): item is ExperienceRecord => Boolean(item));

      setExperiences(mapped);
    } catch (error) {
      console.error('Unexpected fetch experiences error:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const role = formData.role.trim();
      const company = formData.company.trim();

      if (!role || !company) {
        setSubmitError('Posisi/Jabatan dan perusahaan wajib diisi.');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        role,
        company,
        period: formData.period.trim() || 'Tidak ditentukan',
        description: formData.description.trim(),
        skills: parseSkills(formData.skillsText),
        is_latest: formData.is_latest,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('experiences')
        .insert([payload])
        .select();

      if (error) {
        throw error;
      }

      const inserted = normalizeExperience(Array.isArray(data) ? data[0] : null);
      if (inserted) {
        setExperiences((prev) => [inserted, ...prev]);
      }

      setFormData({
        role: '',
        company: '',
        period: '',
        description: '',
        skillsText: '',
        is_latest: false,
      });

      setSuccessMessage('Pengalaman kerja berhasil ditambahkan.');
    } catch (error) {
      console.error('Insert experience error:', error);
      const message = error instanceof Error ? error.message : 'Gagal menambahkan pengalaman kerja.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('experiences').delete().eq('id', id);

      if (error) {
        throw error;
      }

      setExperiences((prev) => prev.filter((item) => item.id !== id));
      setDeleteConfirm(null);
      setSuccessMessage('Pengalaman kerja berhasil dihapus.');
    } catch (error) {
      console.error('Delete experience error:', error);
      const message = error instanceof Error ? error.message : 'Gagal menghapus pengalaman kerja.';
      setSubmitError(message);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) {
    return (
      <div className="text-white text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border border-[#00ff9f] border-t-transparent" />
        <p className="mt-4">Memuat pengalaman…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg">
          {successMessage}
        </div>
      )}

      {submitError && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#112240] p-6 rounded-lg border border-slate-700 space-y-4">
        <h3 className="text-xl font-bold text-white">Tambah Pengalaman Kerja</h3>

        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Posisi/Jabatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
            placeholder="Contoh: IT Support / Frontend Developer"
            required
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Perusahaan/Instansi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
            placeholder="Contoh: Diskominfo Aceh Barat"
            required
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Periode Kerja
          </label>
          <input
            type="text"
            name="period"
            value={formData.period}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
            placeholder="Contoh: 2024 - Sekarang"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Deskripsi Pekerjaan
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
            placeholder="Jelaskan tugas dan tanggung jawab utama..."
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Keahlian / Tech Stack
          </label>
          <input
            type="text"
            name="skillsText"
            value={formData.skillsText}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
            placeholder="Contoh: TIK, Jaringan, Integrasi Web"
          />
          <p className="text-xs text-slate-400 mt-1">Dipisahkan dengan koma, lalu akan otomatis diubah menjadi array.</p>
        </div>

        <label className="flex items-center gap-3 text-white text-sm font-medium">
          <input
            type="checkbox"
            name="is_latest"
            checked={formData.is_latest}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-slate-600 bg-[#0a192f] text-[#00ff9f] focus:ring-[#00ff9f]"
          />
          Tandai sebagai pekerjaan terbaru
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-[#00ff9f] text-[#0a192f] font-bold rounded-lg hover:bg-[#00cc7f] disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Menyimpan...' : 'Tambah Pengalaman'}
        </button>
      </form>

      <div className="bg-[#112240] rounded-lg border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">Daftar Pengalaman</h3>
        </div>

        {experiences.length === 0 ? (
          <div className="p-6 text-slate-400 text-center">Belum ada pengalaman kerja.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#112240]">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-[#00ff9f] text-sm">Posisi</th>
                  <th className="px-4 py-3 text-left text-[#00ff9f] text-sm">Perusahaan</th>
                  <th className="px-4 py-3 text-left text-[#00ff9f] text-sm">Periode</th>
                  <th className="px-4 py-3 text-left text-[#00ff9f] text-sm">Terbaru</th>
                  <th className="px-4 py-3 text-left text-[#00ff9f] text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((exp) => (
                  <tr key={exp.id} className="border-t border-slate-800">
                    <td className="px-4 py-3 text-white text-sm">{exp.role}</td>
                    <td className="px-4 py-3 text-white text-sm">{exp.company}</td>
                    <td className="px-4 py-3 text-white text-sm">{exp.period}</td>
                    <td className="px-4 py-3 text-white text-sm">{exp.is_latest ? 'Ya' : 'Tidak'}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(exp.id)}
                        className="px-3 py-2 text-xs font-semibold border border-red-500/50 text-red-400 rounded hover:bg-red-500/10 transition-colors"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#112240] border border-slate-700 rounded-lg p-6 max-w-sm">
            <h4 className="text-white font-bold text-lg mb-4">Hapus Pengalaman?</h4>
            <p className="text-slate-300 mb-6">
              Apakah Anda yakin ingin menghapus pengalaman kerja ini?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
              <button
                type="button"
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
