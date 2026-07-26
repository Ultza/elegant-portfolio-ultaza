import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import supabase from '../supabaseClient';
import { Mail, MapPin, Linkedin, ArrowRight } from 'lucide-react';

export const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase.from('contacts').insert([{
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      toast.success('Pesan terkirim! Saya akan segera menghubungi Anda.');
      reset();
    } catch {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.');
    }
  };

  return (
    <section
      id="contact"
      className="py-24 border-t"
      style={{ background: 'var(--t-bg)', borderColor: 'var(--t-border)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left */}
          <div>
            <h2 className="font-mono text-sm tracking-widest uppercase mb-4" style={{ color: 'var(--t-accent)' }}>
              Kontak
            </h2>
            <h3 className="text-5xl font-bold mb-8 tracking-tight" style={{ color: 'var(--t-text)' }}>
              Ayo terhubung.
            </h3>
            <p className="text-xl mb-12 max-w-md leading-relaxed" style={{ color: 'var(--t-text-muted)' }}>
              Baik itu proyek teknis, tantangan data GIS, atau sekadar ingin menyapa, kotak pesan saya selalu terbuka.
            </p>

            <div className="space-y-6">
              <a
                href="mailto:ultazanagan111@gmail.com"
                className="group flex items-center gap-4 p-4 rounded-xl border transition-all"
                style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--t-accent) 30%, transparent)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--t-border)')}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center border flex-shrink-0"
                  style={{
                    background: 'var(--t-bg)',
                    color: 'var(--t-accent)',
                    borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)',
                  }}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: 'var(--t-text-sub)' }}>Kirim Email</p>
                  <p className="text-lg transition-colors" style={{ color: 'var(--t-text)' }}>
                    ultazanagan111@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/ul-tazasyah-274a2a392"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-xl border transition-all"
                style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--t-accent2) 30%, transparent)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--t-border)')}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center border flex-shrink-0"
                  style={{
                    background: 'var(--t-bg)',
                    color: 'var(--t-accent2)',
                    borderColor: 'color-mix(in srgb, var(--t-accent2) 20%, transparent)',
                  }}
                >
                  <Linkedin size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: 'var(--t-text-sub)' }}>LinkedIn</p>
                  <p className="text-lg" style={{ color: 'var(--t-text)' }}>Ul Tazasyah</p>
                </div>
              </a>

              <div
                className="flex items-center gap-4 p-4 rounded-xl border"
                style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center border flex-shrink-0"
                  style={{ background: 'var(--t-bg)', color: 'var(--t-text-sub)', borderColor: 'var(--t-border)' }}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: 'var(--t-text-sub)' }}>Lokasi</p>
                  <p className="text-lg" style={{ color: 'var(--t-text)' }}>Nagan Raya, Aceh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div
            className="p-8 md:p-12 rounded-3xl border shadow-2xl relative overflow-hidden"
            style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-5"
              style={{ background: 'var(--t-accent)' }}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--t-accent)' }}>Nama Anda</label>
                  <input {...register('name', { required: true })} className="w-full border rounded-lg px-4 py-3 focus:outline-none transition-all"
                    style={{ background: 'var(--t-bg-input)', borderColor: errors.name ? '#ef4444' : 'var(--t-border)', color: 'var(--t-text)' }}
                    placeholder="Budi Santoso"
                    onFocus={(e) => (e.target.style.borderColor = 'var(--t-accent)')}
                    onBlur={(e) => (e.target.style.borderColor = errors.name ? '#ef4444' : 'var(--t-border)')} />
                  {errors.name && <p className="text-red-500 text-xs">Nama wajib diisi</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--t-accent)' }}>Alamat Email</label>
                  <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} className="w-full border rounded-lg px-4 py-3 focus:outline-none transition-all"
                    style={{ background: 'var(--t-bg-input)', borderColor: errors.email ? '#ef4444' : 'var(--t-border)', color: 'var(--t-text)' }}
                    placeholder="budi@contoh.com"
                    onFocus={(e) => (e.target.style.borderColor = 'var(--t-accent)')}
                    onBlur={(e) => (e.target.style.borderColor = errors.email ? '#ef4444' : 'var(--t-border)')} />
                  {errors.email && <p className="text-red-500 text-xs">Email yang valid wajib diisi</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--t-accent)' }}>Subjek</label>
                <input {...register('subject')} className="w-full border rounded-lg px-4 py-3 focus:outline-none transition-all"
                  style={{ background: 'var(--t-bg-input)', borderColor: 'var(--t-border)', color: 'var(--t-text)' }}
                  placeholder="Pertanyaan tentang Proyek"
                  onFocus={(e) => (e.target.style.borderColor = 'var(--t-accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--t-border)')} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--t-accent)' }}>Pesan</label>
                <textarea {...register('message', { required: true })} rows={5} className="w-full border rounded-lg px-4 py-3 focus:outline-none transition-all resize-none"
                  style={{ background: 'var(--t-bg-input)', borderColor: errors.message ? '#ef4444' : 'var(--t-border)', color: 'var(--t-text)' }}
                  placeholder="Apa yang bisa saya bantu?"
                  onFocus={(e) => (e.target.style.borderColor = 'var(--t-accent)')}
                  onBlur={(e) => (e.target.style.borderColor = errors.message ? '#ef4444' : 'var(--t-border)')} />
                {errors.message && <p className="text-red-500 text-xs">Pesan wajib diisi</p>}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg group"
                style={{ background: 'var(--t-accent)', color: 'var(--t-bg)' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Kirim Pesan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
