import React, { useEffect, useState, useRef } from 'react';
import { Eye, EyeOff, Plus, Pencil, Trash2, X, Upload, Link, Clock, BookOpen } from 'lucide-react';
import supabase from '../supabaseClient';
import { RichTextEditor } from './RichTextEditor';
import { CategoryBadge, LevelBadge } from './LearningPage';

const STORAGE_BUCKET = 'article-images';

const CATEGORIES = [
  'Excel','SQL','Power BI','Python','Data Analyst',
  'IT Support','Networking','Web Development','Laravel','React','GIS','Linux',
];

interface LPost {
  id: string; title: string; slug: string; summary: string;
  content: string; cover_image: string; category: string;
  tags: string[]; level: string; reading_time: number;
  views: number; status: 'draft'|'published';
  seo_title: string; seo_desc: string;
  published_at: string; created_at: string;
}

interface FD {
  title: string; slug: string; summary: string; content: string;
  cover_image: string; category: string; tags: string;
  level: string; reading_time: number; status: 'draft'|'published';
  seo_title: string; seo_desc: string;
}

const empty: FD = {
  title:'', slug:'', summary:'', content:'', cover_image:'',
  category:'Web Development', tags:'', level:'Pemula',
  reading_time: 5, status:'draft', seo_title:'', seo_desc:'',
};

export const AdminLearning = () => {
  const [posts, setPosts] = useState<LPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string|null>(null);
  const [successMsg, setSuccessMsg] = useState<string|null>(null);
  const [errorMsg, setErrorMsg] = useState<string|null>(null);
  const [coverMode, setCoverMode] = useState<'upload'|'url'>('upload');
  const [coverPreview, setCoverPreview] = useState('');
  const [coverFile, setCoverFile] = useState<File|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fd, setFd] = useState<FD>(empty);

  useEffect(() => { fetchPosts(); }, []);
  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(null), 3500); return () => clearTimeout(t); }
  }, [successMsg]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from('learning_posts').select('*').order('created_at', { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  const genSlug = (s: string) => s.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim();

  const handleTitleChange = (title: string) => {
    setFd(f => ({ ...f, title, slug: editingId ? f.slug : genSlug(title) }));
  };

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5*1024*1024) { setErrorMsg('Gambar maks 5 MB.'); return; }
    setCoverFile(file); setErrorMsg(null);
    const r = new FileReader();
    r.onload = ev => setCoverPreview(ev.target?.result as string);
    r.readAsDataURL(file);
  };

  const uploadCover = async (file: File): Promise<string> => {
    setIsUploadingImg(true);
    const ext = file.name.split('.').pop() ?? 'jpg';
    const name = `learning-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET)
      .upload(name, file, { cacheControl:'3600', upsert:false, contentType:file.type });
    setIsUploadingImg(false);
    if (error) throw new Error(error.message);
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path).data.publicUrl;
  };

  const resetForm = () => {
    setFd(empty); setEditingId(null); setShowForm(false); setPreviewMode(false);
    setCoverFile(null); setCoverPreview(''); setErrorMsg(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleEdit = (p: LPost) => {
    setFd({ title:p.title, slug:p.slug, summary:p.summary, content:p.content,
      cover_image:p.cover_image, category:p.category, tags:(p.tags??[]).join(', '),
      level:p.level, reading_time:p.reading_time, status:p.status,
      seo_title:p.seo_title??'', seo_desc:p.seo_desc??'' });
    setEditingId(p.id);
    setCoverMode(p.cover_image ? 'url' : 'upload');
    setCoverPreview(p.cover_image ?? '');
    setCoverFile(null);
    setShowForm(true); setPreviewMode(false);
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleDelete = async (id: string) => {
    await supabase.from('learning_posts').delete().eq('id', id);
    setPosts(p => p.filter(x => x.id !== id));
    setDeleteConfirm(null); setSuccessMsg('Tutorial berhasil dihapus.');
  };

  const handleToggleStatus = async (p: LPost) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    const updates: any = { status: newStatus };
    if (newStatus === 'published') updates.published_at = new Date().toISOString();
    await supabase.from('learning_posts').update(updates).eq('id', p.id);
    setPosts(list => list.map(x => x.id === p.id ? { ...x, ...updates } : x));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fd.title || !fd.slug || !fd.summary || !fd.content) {
      setErrorMsg('Judul, slug, ringkasan, dan konten wajib diisi.'); return;
    }
    setIsSubmitting(true); setErrorMsg(null);
    let coverUrl = fd.cover_image;
    if (coverMode === 'upload' && coverFile) {
      try { coverUrl = await uploadCover(coverFile); }
      catch (err: any) { setErrorMsg(err.message); setIsSubmitting(false); return; }
    }
    const row: any = {
      title: fd.title, slug: fd.slug, summary: fd.summary, content: fd.content,
      cover_image: coverUrl, category: fd.category,
      tags: fd.tags ? fd.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      level: fd.level, reading_time: Number(fd.reading_time),
      status: fd.status, seo_title: fd.seo_title, seo_desc: fd.seo_desc,
      updated_at: new Date().toISOString(),
    };
    if (fd.status === 'published' && !editingId) row.published_at = new Date().toISOString();

    if (editingId) {
      const { error } = await supabase.from('learning_posts').update(row).eq('id', editingId);
      if (error) { setErrorMsg(error.message); setIsSubmitting(false); return; }
      setPosts(list => list.map(x => x.id === editingId ? { ...x, ...row } : x));
      setSuccessMsg('Tutorial berhasil diperbarui!');
    } else {
      row.created_at = new Date().toISOString(); row.views = 0;
      const { data, error } = await supabase.from('learning_posts').insert([row]).select();
      if (error) { setErrorMsg(error.message); setIsSubmitting(false); return; }
      if (data?.[0]) setPosts(list => [data[0], ...list]);
      setSuccessMsg('Tutorial berhasil disimpan!');
    }
    setIsSubmitting(false);
    resetForm();
  };

  if (loading) return (
    <div className="text-white text-center py-12">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border border-[#00ff9f] border-t-transparent mb-3" />
      <p className="text-slate-400">Memuat tutorial...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {successMsg && <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-lg">✓ {successMsg}</div>}

      {/* Form */}
      {showForm ? (
        <div className="bg-[#112240] rounded-xl border border-slate-700 overflow-hidden">
          {/* Form header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-[#0d1b30]">
            <h3 className="text-lg font-bold text-white">{editingId ? '✏️ Edit Tutorial' : '📚 Tutorial Baru'}</h3>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setPreviewMode(p => !p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors"
                style={{ borderColor:'#00ff9f44', color: previewMode?'#0a192f':'#00ff9f', background: previewMode?'#00ff9f':'transparent' }}>
                {previewMode ? <EyeOff size={14}/> : <Eye size={14}/>}
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
            </div>
          </div>

          {/* Preview */}
          {previewMode ? (
            <div className="p-6">
              {coverPreview && <img src={coverPreview} alt="cover" className="w-full max-h-64 object-contain rounded-xl mb-6 bg-[#0a192f] border border-slate-700" />}
              <div className="flex gap-2 mb-3"><CategoryBadge category={fd.category}/><LevelBadge level={fd.level}/></div>
              <h1 className="text-3xl font-bold text-white mb-3">{fd.title || 'Judul Tutorial'}</h1>
              <p className="text-slate-400 italic border-l-4 border-[#00ff9f] pl-4 mb-6">{fd.summary}</p>
              <div className="learning-content prose-article" dangerouslySetInnerHTML={{ __html: fd.content || '<p class="text-slate-500">Konten belum ada...</p>' }} />
            </div>
          ) : (
          <form onSubmit={handleSave} className="p-6 space-y-5">
              {errorMsg && <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">{errorMsg}</div>}

              {/* Title + Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Judul *</label>
                  <input type="text" value={fd.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Judul tutorial"
                    className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Kategori</label>
                  <select value={fd.category} onChange={e => setFd(f => ({...f, category: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Slug *</label>
                <input type="text" value={fd.slug} onChange={e => setFd(f => ({...f, slug: e.target.value}))}
                  className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm font-mono" />
              </div>

              {/* Level + Reading time + Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Level</label>
                  <select value={fd.level} onChange={e => setFd(f => ({...f, level: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm">
                    {['Pemula','Menengah','Mahir'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Estimasi Baca (mnt)</label>
                  <input type="number" min={1} max={180} value={fd.reading_time} onChange={e => setFd(f => ({...f, reading_time: Number(e.target.value)}))}
                    className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Status</label>
                  <select value={fd.status} onChange={e => setFd(f => ({...f, status: e.target.value as 'draft'|'published'}))}
                    className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Tags (pisahkan koma)</label>
                <input type="text" value={fd.tags} onChange={e => setFd(f => ({...f, tags: e.target.value}))} placeholder="sql, query, database"
                  className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm" />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Ringkasan *</label>
                <textarea value={fd.summary} rows={2} onChange={e => setFd(f => ({...f, summary: e.target.value}))} placeholder="Ringkasan singkat tutorial"
                  className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none resize-none text-sm" />
              </div>

              {/* Content */}
              <div>
                <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">
                  Konten Tutorial * <span className="text-slate-500 normal-case font-normal">(toolbar: format, gambar, code, tabel)</span>
                </label>
                <RichTextEditor value={fd.content} onChange={c => setFd(f => ({...f, content: c}))} placeholder="Tulis isi tutorial di sini..." />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-[#00ff9f] text-xs font-bold uppercase tracking-wider mb-1.5">Cover Image</label>
                <div className="flex gap-2 mb-3">
                  {(['upload','url'] as const).map(m => (
                    <button key={m} type="button"
                      onClick={() => { setCoverMode(m); if(m==='upload'){setCoverPreview('');setCoverFile(null);setFd(f=>({...f,cover_image:''}));if(fileRef.current)fileRef.current.value='';} }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      style={{ background:coverMode===m?'#00ff9f':'#0a192f', color:coverMode===m?'#0a192f':'#94a3b8', border:'1px solid', borderColor:coverMode===m?'#00ff9f':'#475569' }}>
                      {m==='upload'?<><Upload size={13}/>Upload dari PC</>:<><Link size={13}/>Dari URL</>}
                    </button>
                  ))}
                </div>
                {coverMode==='upload' ? (
                  !coverPreview ? (
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-[#00ff9f]/50 bg-[#0a192f] transition-colors" onClick={()=>fileRef.current?.click()}>
                      <BookOpen size={28} className="mx-auto mb-2 text-[#00ff9f]"/>
                      <p className="text-white text-sm font-semibold">Klik untuk pilih cover</p>
                      <p className="text-slate-500 text-xs mt-1">JPG, PNG, WEBP — Maks. 5 MB</p>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverFile} className="hidden"/>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border border-slate-600 bg-[#0a192f]">
                      <img src={coverPreview} alt="preview" className="w-full max-h-52 object-contain"/>
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button type="button" onClick={()=>fileRef.current?.click()} className="px-3 py-2 bg-[#00ff9f] text-[#0a192f] text-xs font-bold rounded">Ganti</button>
                        <button type="button" onClick={()=>{setCoverFile(null);setCoverPreview('');setFd(f=>({...f,cover_image:''}));if(fileRef.current)fileRef.current.value='';}} className="p-2 bg-red-500 text-white rounded"><X size={14}/></button>
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverFile} className="hidden"/>
                    </div>
                  )
                ) : (
                  <div>
                    <input type="text" value={fd.cover_image} onChange={e=>{setFd(f=>({...f,cover_image:e.target.value}));setCoverPreview(e.target.value);}} placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm"/>
                    {coverPreview && <div className="mt-2 rounded-lg overflow-hidden border border-slate-600 bg-[#0a192f]"><img src={coverPreview} alt="preview" className="w-full max-h-44 object-contain" onError={e=>(e.target as HTMLImageElement).style.display='none'}/></div>}
                  </div>
                )}
                {coverFile && <p className="text-xs text-slate-400 mt-1">📎 {coverFile.name}</p>}
              </div>

              {/* SEO */}
              <details className="rounded-lg border border-slate-700 overflow-hidden">
                <summary className="px-4 py-3 bg-[#0d1b30] text-[#00ff9f] text-xs font-bold uppercase tracking-wider cursor-pointer">SEO (opsional)</summary>
                <div className="p-4 space-y-3 bg-[#0a192f]">
                  <input type="text" value={fd.seo_title} onChange={e=>setFd(f=>({...f,seo_title:e.target.value}))} placeholder="SEO Title"
                    className="w-full px-4 py-2.5 bg-[#112240] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none text-sm"/>
                  <textarea value={fd.seo_desc} rows={2} onChange={e=>setFd(f=>({...f,seo_desc:e.target.value}))} placeholder="SEO Description"
                    className="w-full px-4 py-2.5 bg-[#112240] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none resize-none text-sm"/>
                </div>
              </details>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting||isUploadingImg}
                  className="flex-1 py-3 bg-[#00ff9f] text-[#0a192f] font-bold rounded-lg hover:bg-[#00cc7f] disabled:opacity-50 transition-colors text-sm">
                  {isUploadingImg?'⏳ Mengupload...':isSubmitting?'⏳ Menyimpan...':editingId?'💾 Perbarui':'🚀 Simpan Tutorial'}
                </button>
                <button type="button" onClick={resetForm} disabled={isSubmitting||isUploadingImg}
                  className="px-6 py-3 border border-slate-600 text-white rounded-lg hover:border-slate-400 disabled:opacity-50 transition-colors text-sm">
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <button onClick={()=>setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-[#00ff9f] text-[#0a192f] font-bold rounded-lg hover:bg-[#00cc7f] transition-colors">
          <Plus size={18}/> Tutorial Baru
        </button>
      )}

      {/* List */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Daftar Tutorial <span className="text-slate-500 font-normal text-sm">({posts.length})</span></h3>
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-[#112240] rounded-xl border border-slate-700">
            <BookOpen size={40} className="mx-auto mb-3 text-slate-600"/>
            <p className="text-slate-400">Belum ada tutorial. Klik "Tutorial Baru" untuk memulai.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map(p => (
              <div key={p.id} className="bg-[#112240] border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors">
                <div className="flex gap-4 p-5">
                  {p.cover_image && <img src={p.cover_image} alt={p.title} className="w-28 h-20 object-cover rounded-lg flex-shrink-0 bg-[#0a192f]" onError={e=>(e.target as HTMLImageElement).style.display='none'}/>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="text-white font-bold text-base leading-tight line-clamp-1">{p.title}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex-shrink-0 ${p.status==='published'?'bg-green-500/15 text-green-400 border border-green-500/30':'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'}`}>
                        {p.status==='published'?'● Live':'○ Draft'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <CategoryBadge category={p.category} size="xs"/>
                      <LevelBadge level={p.level}/>
                    </div>
                    <p className="text-slate-300 text-sm line-clamp-1 mb-1">{p.summary}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1"><Clock size={11}/> {p.reading_time} mnt</span>
                      <span className="flex items-center gap-1">👁 {p.views??0}</span>
                      <span>{new Date(p.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</span>
                    </div>
                  </div>
                </div>
                <div className="flex border-t border-slate-700">
                  <button onClick={()=>handleToggleStatus(p)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${p.status==='published'?'text-yellow-400 hover:bg-yellow-500/10':'text-green-400 hover:bg-green-500/10'}`}>
                    {p.status==='published'?<><EyeOff size={13}/>Unpublish</>:<><Eye size={13}/>Publish</>}
                  </button>
                  <div className="w-px bg-slate-700"/>
                  <button onClick={()=>handleEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/10 transition-colors">
                    <Pencil size={13}/> Edit
                  </button>
                  <div className="w-px bg-slate-700"/>
                  <button onClick={()=>setDeleteConfirm(p.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={13}/> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#112240] border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h4 className="text-white font-bold text-lg mb-3">🗑 Hapus Tutorial?</h4>
            <p className="text-slate-400 text-sm mb-6">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={()=>handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">Hapus</button>
              <button onClick={()=>setDeleteConfirm(null)} className="flex-1 py-2.5 border border-slate-600 text-white rounded-lg hover:border-slate-400 transition-colors">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
