import React, { useEffect, useState, useRef } from 'react';
import { Upload, X, Link, Image, Eye, EyeOff, Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import supabase from '../supabaseClient';
import { RichTextEditor } from './RichTextEditor';

const STORAGE_BUCKET = 'article-images';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  created_at: string;
  published: boolean;
  author: string;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  published: boolean;
  author: string;
}

const emptyForm: FormData = {
  title: '', slug: '', excerpt: '', content: '', thumbnail: '', published: false, author: 'Admin',
};

export const AdminPublish = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Thumbnail states
  const [thumbnailMode, setThumbnailMode] = useState<'upload' | 'url'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>(emptyForm);

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      setArticles(error ? [] : (data ?? []));
    } catch { setArticles([]); }
    setLoading(false);
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const handleTitleChange = (title: string) => {
    setFormData(f => ({ ...f, title, slug: !editingId ? generateSlug(title) : f.slug }));
  };

  // ── Image file handlers ──
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg','image/jpg','image/png','image/webp','image/gif'];
    if (!allowed.includes(file.type)) { setSubmitError('Format tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.'); return; }
    if (file.size > 5 * 1024 * 1024) { setSubmitError('Ukuran gambar maks 5 MB.'); return; }
    setImageFile(file);
    setSubmitError(null);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    setIsUploadingImage(true);
    setUploadProgress('Mengupload gambar...');
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `thumbnail-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from(STORAGE_BUCKET)
        .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType: file.type });
      if (error) throw new Error(`Upload gagal: ${error.message}`);
      const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
      setUploadProgress('Upload berhasil!');
      return pub.publicUrl;
    } finally { setIsUploadingImage(false); }
  };

  const handleRemoveImage = () => {
    setImageFile(null); setImagePreview('');
    setFormData(f => ({ ...f, thumbnail: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const fakeEv = { target: { files: [file] } } as any;
    handleImageFileChange(fakeEv);
  };

  const resetForm = () => {
    setFormData(emptyForm); setEditingId(null); setShowForm(false); setPreviewMode(false);
    setImageFile(null); setImagePreview(''); setUploadProgress(''); setSubmitError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Save article ──
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); setSubmitError(null); setSuccessMessage(null);
    try {
      if (!formData.title || !formData.slug || !formData.excerpt || !formData.content) {
        setSubmitError('Judul, slug, ringkasan, dan konten wajib diisi.');
        setIsSubmitting(false); return;
      }
      let thumbnailUrl = formData.thumbnail;
      if (thumbnailMode === 'upload' && imageFile) {
        try { thumbnailUrl = await uploadImageToStorage(imageFile); }
        catch (err: any) {
          setSubmitError(err.message || 'Gagal upload gambar thumbnail.');
          setIsSubmitting(false); return;
        }
      }
      const articleData = {
        title: formData.title, slug: formData.slug, excerpt: formData.excerpt,
        content: formData.content, thumbnail: thumbnailUrl,
        published: formData.published, author: formData.author,
        created_at: new Date().toISOString(),
      };
      if (editingId) {
        const { error } = await supabase.from('posts').update(articleData).eq('id', editingId);
        if (error) { setSubmitError(`Gagal update: ${error.message}`); setIsSubmitting(false); return; }
        setArticles(articles.map(a => a.id === editingId ? { ...a, ...articleData } : a));
        setSuccessMessage('Artikel berhasil diperbarui!');
      } else {
        const { data, error } = await supabase.from('posts').insert([articleData]).select();
        if (error) { setSubmitError(`Gagal membuat artikel: ${error.message}`); setIsSubmitting(false); return; }
        if (data?.[0]) setArticles([data[0], ...articles]);
        setSuccessMessage('Artikel berhasil dipublikasikan!');
      }
      resetForm();
    } catch { setSubmitError('Terjadi kesalahan, coba lagi.'); }
    setIsSubmitting(false);
  };

  const handleEditArticle = (article: Article) => {
    setFormData({ title: article.title, slug: article.slug, excerpt: article.excerpt,
      content: article.content, thumbnail: article.thumbnail,
      published: article.published, author: article.author });
    setEditingId(article.id);
    setThumbnailMode(article.thumbnail ? 'url' : 'upload');
    setImagePreview(article.thumbnail || '');
    setImageFile(null); setUploadProgress('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowForm(true); setPreviewMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await supabase.from('posts').delete().eq('id', id);
      setArticles(articles.filter(a => a.id !== id));
      setDeleteConfirm(null); setSuccessMessage('Artikel berhasil dihapus.');
    } catch { setSubmitError('Gagal menghapus artikel.'); }
  };

  const handleTogglePublish = async (article: Article) => {
    try {
      await supabase.from('posts').update({ published: !article.published }).eq('id', article.id);
      setArticles(articles.map(a => a.id === article.id ? { ...a, published: !a.published } : a));
    } catch { setSubmitError('Gagal mengubah status publikasi.'); }
  };

  useEffect(() => {
    if (successMessage) { const t = setTimeout(() => setSuccessMessage(null), 3500); return () => clearTimeout(t); }
  }, [successMessage]);

  if (loading) return (
    <div className="text-white text-center py-12">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border border-[#00ff9f] border-t-transparent mb-3" />
      <p className="text-slate-400">Loading artikel...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-lg flex items-center gap-2">
          <span>✓</span> {successMessage}
        </div>
      )}
      {fetchError && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg">{fetchError}</div>
      )}

      {/* ── Form ── */}
      {showForm ? (
        <div className="bg-[#112240] rounded-xl border border-slate-700 overflow-hidden">
          {/* Form header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-[#0d1b30]">
            <h3 className="text-lg font-bold text-white">
              {editingId ? '✏️ Edit Artikel' : '📝 Buat Artikel Baru'}
            </h3>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setPreviewMode(p => !p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors"
                style={{ borderColor: '#00ff9f44', color: previewMode ? '#0a192f' : '#00ff9f',
                  background: previewMode ? '#00ff9f' : 'transparent' }}>
                {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Preview mode */}
          {previewMode ? (
            <div className="p-6">
              {imagePreview && (
                <img src={imagePreview} alt="thumbnail" className="w-full max-h-72 object-contain rounded-xl mb-6 bg-[#0a192f] border border-slate-700" />
              )}
              <h1 className="text-3xl font-bold text-white mb-3">{formData.title || 'Judul Artikel'}</h1>
              <p className="text-slate-400 text-sm mb-6 italic border-l-4 border-[#00ff9f] pl-4">{formData.excerpt}</p>
              <div className="tiptap-preview-content prose-article"
                dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-slate-500">Konten belum ada...</p>' }} />
            </div>
          ) : (
          <form onSubmit={handleSaveArticle} className="p-6 space-y-5">
              {submitError && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">{submitError}</div>
              )}

              {/* Row 1: Title + Author */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Judul *</label>
                  <input type="text" value={formData.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="Masukkan judul artikel"
                    className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Penulis *</label>
                  <input type="text" value={formData.author}
                    onChange={e => setFormData(f => ({ ...f, author: e.target.value }))}
                    placeholder="Nama penulis"
                    className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm" />
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Slug *</label>
                <input type="text" value={formData.slug}
                  onChange={e => setFormData(f => ({ ...f, slug: e.target.value }))}
                  placeholder="slug-artikel-anda"
                  className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm font-mono" />
                <p className="text-[11px] text-slate-500 mt-1">Otomatis dari judul, bisa diedit manual</p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Ringkasan *</label>
                <textarea value={formData.excerpt} rows={2}
                  onChange={e => setFormData(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Ringkasan singkat artikel (ditampilkan di card)"
                  className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none resize-none text-sm" />
              </div>

              {/* Rich Text Content */}
              <div>
                <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">
                  Konten Artikel * <span className="text-slate-500 normal-case font-normal">(gunakan toolbar untuk format & insert gambar)</span>
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={content => setFormData(f => ({ ...f, content }))}
                  placeholder="Mulai menulis konten artikel di sini..."
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Thumbnail Artikel</label>
                <div className="flex gap-2 mb-3">
                  {(['upload','url'] as const).map(mode => (
                    <button key={mode} type="button"
                      onClick={() => { setThumbnailMode(mode); if (mode==='upload') { setImagePreview(''); setImageFile(null); setFormData(f=>({...f,thumbnail:''})); if(fileInputRef.current) fileInputRef.current.value=''; } }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      style={{ background: thumbnailMode===mode ? '#00ff9f' : '#0a192f', color: thumbnailMode===mode ? '#0a192f' : '#94a3b8', border: '1px solid', borderColor: thumbnailMode===mode ? '#00ff9f' : '#475569' }}>
                      {mode === 'upload' ? <><Upload size={13} /> Upload dari PC</> : <><Link size={13} /> Dari URL</>}
                    </button>
                  ))}
                </div>
                {thumbnailMode === 'upload' ? (
                  <div>
                    {!imagePreview ? (
                      <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-[#00ff9f]/50 bg-[#0a192f] transition-colors"
                        onClick={() => fileInputRef.current?.click()} onDragOver={handleDragOver} onDrop={handleDrop}>
                        <Image size={28} className="mx-auto mb-3 text-[#00ff9f]" />
                        <p className="text-white text-sm font-semibold">Klik atau drag & drop gambar</p>
                        <p className="text-slate-500 text-xs mt-1">JPG, PNG, WEBP, GIF — Maks. 5 MB</p>
                        <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={handleImageFileChange} className="hidden" />
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden border border-slate-600 bg-[#0a192f]">
                        <img src={imagePreview} alt="preview" className="w-full max-h-60 object-contain" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button type="button" onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-2 bg-[#00ff9f] text-[#0a192f] text-xs font-bold rounded">Ganti</button>
                          <button type="button" onClick={handleRemoveImage}
                            className="p-2 bg-red-500 text-white rounded"><X size={14} /></button>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" onChange={handleImageFileChange} className="hidden" />
                      </div>
                    )}
                    {imageFile && <p className="text-xs text-slate-400 mt-1">📎 {imageFile.name} ({(imageFile.size/1024).toFixed(1)} KB)</p>}
                    {uploadProgress && <p className={`text-xs mt-1 ${uploadProgress.includes('berhasil') ? 'text-green-400' : 'text-[#00ff9f]'}`}>{uploadProgress}</p>}
                  </div>
                ) : (
                  <div>
                    <input type="text" value={formData.thumbnail}
                      onChange={e => { setFormData(f=>({...f, thumbnail: e.target.value})); setImagePreview(e.target.value); }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm" />
                    {imagePreview && <div className="mt-2 rounded-lg overflow-hidden border border-slate-600 bg-[#0a192f]">
                      <img src={imagePreview} alt="preview" className="w-full max-h-48 object-contain"
                        onError={e => (e.target as HTMLImageElement).style.display='none'} />
                    </div>}
                  </div>
                )}
              </div>

              {/* Publish toggle */}
              <div className="flex items-center gap-3 p-4 bg-[#0a192f] rounded-lg border border-slate-700">
                <input type="checkbox" id="published" checked={formData.published}
                  onChange={e => setFormData(f => ({ ...f, published: e.target.checked }))}
                  className="w-4 h-4 accent-[#00ff9f] cursor-pointer" />
                <label htmlFor="published" className="text-white text-sm font-semibold cursor-pointer">
                  Publikasikan artikel ini sekarang
                </label>
                <span className={`ml-auto px-2 py-0.5 rounded text-xs font-bold ${formData.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {formData.published ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting || isUploadingImage}
                  className="flex-1 py-3 bg-[#00ff9f] text-[#0a192f] font-bold rounded-lg hover:bg-[#00cc7f] disabled:opacity-50 transition-colors text-sm">
                  {isUploadingImage ? '⏳ Mengupload gambar...' : isSubmitting ? '⏳ Menyimpan...' : editingId ? '💾 Perbarui Artikel' : '🚀 Simpan Artikel'}
                </button>
                <button type="button" onClick={resetForm} disabled={isSubmitting || isUploadingImage}
                  className="px-6 py-3 border border-slate-600 text-white rounded-lg hover:border-slate-400 disabled:opacity-50 transition-colors text-sm">
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#00ff9f] text-[#0a192f] font-bold rounded-lg hover:bg-[#00cc7f] transition-colors">
          <Plus size={18} /> Buat Artikel Baru
        </button>
      )}

      {/* ── Articles List ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Daftar Artikel <span className="text-slate-500 font-normal text-sm">({articles.length})</span></h3>
        </div>
        {articles.length === 0 ? (
          <div className="text-center py-16 bg-[#112240] rounded-xl border border-slate-700">
            <p className="text-slate-400 text-lg">📭 Belum ada artikel</p>
            <p className="text-slate-600 text-sm mt-1">Klik "Buat Artikel Baru" untuk mulai menulis</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map(article => (
              <div key={article.id} className="bg-[#112240] border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors">
                <div className="flex gap-4 p-5">
                  {article.thumbnail && (
                    <img src={article.thumbnail} alt={article.title}
                      className="w-28 h-20 object-cover rounded-lg flex-shrink-0 bg-[#0a192f]"
                      onError={e => (e.target as HTMLImageElement).style.display='none'} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="text-white font-bold text-base leading-tight line-clamp-1">{article.title}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex-shrink-0 ${article.published ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'}`}>
                        {article.published ? '● Live' : '○ Draft'}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mb-2 font-mono">/{article.slug}</p>
                    <p className="text-slate-300 text-sm line-clamp-2 mb-2">{article.excerpt}</p>
                    <p className="text-slate-600 text-xs">{article.author} · {new Date(article.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}</p>
                  </div>
                </div>
                <div className="flex border-t border-slate-700">
                  <button onClick={() => handleTogglePublish(article)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${article.published ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-green-400 hover:bg-green-500/10'}`}>
                    {article.published ? <><EyeOff size={13}/> Unpublish</> : <><Eye size={13}/> Publish</>}
                  </button>
                  <div className="w-px bg-slate-700" />
                  <button onClick={() => handleEditArticle(article)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/10 transition-colors">
                    <Pencil size={13}/> Edit
                  </button>
                  <div className="w-px bg-slate-700" />
                  <button onClick={() => setDeleteConfirm(article.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={13}/> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#112240] border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h4 className="text-white font-bold text-lg mb-3">🗑 Hapus Artikel?</h4>
            <p className="text-slate-400 text-sm mb-6">Tindakan ini tidak dapat dibatalkan. Artikel akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteArticle(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">Hapus</button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-slate-600 text-white rounded-lg hover:border-slate-400 transition-colors">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview styles */}
      <style>{`
        .tiptap-preview-content { color: #e2e8f0; line-height: 1.8; font-size: 15px; }
        .tiptap-preview-content h1 { font-size: 2em; font-weight: 700; margin: 0.8em 0 0.4em; color: #fff; }
        .tiptap-preview-content h2 { font-size: 1.5em; font-weight: 700; margin: 0.7em 0 0.35em; color: #fff; }
        .tiptap-preview-content h3 { font-size: 1.25em; font-weight: 600; margin: 0.6em 0 0.3em; color: #fff; }
        .tiptap-preview-content p { margin: 0.6em 0; }
        .tiptap-preview-content ul { list-style: disc; padding-left: 1.5em; margin: 0.6em 0; }
        .tiptap-preview-content ol { list-style: decimal; padding-left: 1.5em; margin: 0.6em 0; }
        .tiptap-preview-content blockquote { border-left: 4px solid #00ff9f; padding-left: 1em; margin: 1em 0; color: #94a3b8; font-style: italic; }
        .tiptap-preview-content pre { background: #020c1b; color: #00ff9f; border-radius: 8px; padding: 12px 16px; font-family: monospace; font-size: 13px; overflow-x: auto; }
        .tiptap-preview-content code { background: rgba(0,255,159,0.1); color: #00ff9f; border-radius: 4px; padding: 2px 6px; font-family: monospace; font-size: 0.875em; }
        .tiptap-preview-content img { max-width: 100%; border-radius: 8px; margin: 1em auto; display: block; }
        .tiptap-preview-content hr { border: none; border-top: 1px solid #1e3a5f; margin: 1.5em 0; }
        .tiptap-preview-content a { color: #00d4ff; text-decoration: underline; }
        .tiptap-preview-content mark { background: #fef08a; color: #000; border-radius: 2px; padding: 0 2px; }
        .tiptap-preview-content strong { font-weight: 700; }
        .tiptap-preview-content em { font-style: italic; }
        .tiptap-preview-content u { text-decoration: underline; }
        .tiptap-preview-content s { text-decoration: line-through; }
      `}</style>
    </div>
  );
};
