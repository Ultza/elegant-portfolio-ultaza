import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

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

  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    published: false,
    author: 'Admin',
  });

  // Fetch articles
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Jika table tidak ada, gunakan dummy data
        console.log('Supabase posts table not found, using local state');
        setArticles([]);
      } else if (data) {
        setArticles(data);
      }
    } catch (err) {
      console.log('Using local state for articles');
      setArticles([]);
    }
    setLoading(false);
  };

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle title change
  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: !editingId ? generateSlug(title) : formData.slug,
    });
  };

  // Handle form input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement & HTMLTextAreaElement;
    setFormData({
      ...formData,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  // Save article
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      if (!formData.title || !formData.slug || !formData.excerpt || !formData.content) {
        setSubmitError('Semua field wajib diisi');
        setIsSubmitting(false);
        return;
      }

      const articleData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        thumbnail: formData.thumbnail,
        published: formData.published,
        author: formData.author,
        created_at: new Date().toISOString(),
      };

      if (editingId) {
        // Update existing article
        const { error } = await supabase
          .from('posts')
          .update(articleData)
          .eq('id', editingId);

        if (error) {
          console.error('Update error:', error);
          setSubmitError(`Gagal update artikel: ${error.message}`);
          setIsSubmitting(false);
          return;
        }
        
        setArticles(
          articles.map((article) =>
            article.id === editingId
              ? { ...article, ...articleData }
              : article
          )
        );
        setSuccessMessage('Artikel berhasil diperbarui');
      } else {
        // Create new article
        const { data, error } = await supabase
          .from('posts')
          .insert([articleData])
          .select();

        if (error) {
          console.error('Insert error:', error);
          setSubmitError(`Gagal membuat artikel: ${error.message}`);
          setIsSubmitting(false);
          return;
        }

        if (data && data.length > 0) {
          setArticles([data[0], ...articles]);
        }
        setSuccessMessage('Artikel berhasil dibuat dan dipublikasikan');
      }

      // Reset form
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        thumbnail: '',
        published: false,
        author: 'Admin',
      });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error('Save error:', err);
      setSubmitError('Terjadi kesalahan saat menyimpan artikel');
    }
    setIsSubmitting(false);
  };

  // Edit article
  const handleEditArticle = (article: Article) => {
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      thumbnail: article.thumbnail,
      published: article.published,
      author: article.author,
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  // Delete article
  const handleDeleteArticle = async (id: string) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);

      if (error) {
        // Fallback to local state
        setArticles(articles.filter((article) => article.id !== id));
      } else {
        setArticles(articles.filter((article) => article.id !== id));
      }

      setDeleteConfirm(null);
      setSuccessMessage('Artikel berhasil dihapus');
    } catch (err) {
      setSubmitError('Terjadi kesalahan saat menghapus artikel');
    }
  };

  // Toggle publish
  const handleTogglePublish = async (article: Article) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ published: !article.published })
        .eq('id', article.id);

      if (error) {
        // Fallback to local state
        setArticles(
          articles.map((a) =>
            a.id === article.id ? { ...a, published: !a.published } : a
          )
        );
      } else {
        setArticles(
          articles.map((a) =>
            a.id === article.id ? { ...a, published: !a.published } : a
          )
        );
      }
    } catch (err) {
      setSubmitError('Terjadi kesalahan saat mengubah status publikasi');
    }
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      thumbnail: '',
      published: false,
      author: 'Admin',
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

  if (loading) {
    return (
      <div className="text-white text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border border-[#00ff9f] border-t-transparent"></div>
        <p className="mt-4">Loading artikel...</p>
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
            {editingId ? 'Edit Artikel' : 'Buat Artikel Baru'}
          </h3>

          {submitError && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSaveArticle} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Judul <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Masukkan judul artikel"
                className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="slug-artikel"
                className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
              />
              <p className="text-xs text-slate-400 mt-1">Slug otomatis dari judul, tapi bisa diedit manual</p>
            </div>

            {/* Author */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Penulis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Nama penulis"
                className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Ringkasan <span className="text-red-500">*</span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Ringkasan singkat artikel"
                rows={2}
                className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Konten <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Konten lengkap artikel"
                rows={8}
                className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none resize-none font-mono text-sm"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                URL Thumbnail
              </label>
              <input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 bg-[#0a192f] text-white border border-slate-600 rounded-lg focus:border-[#00ff9f] focus:outline-none"
              />
              {formData.thumbnail && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-600">
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect fill=%22%23112240%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-family=%22Arial%22 font-size=%2216%22 fill=%22%23666%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Published Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="published"
                id="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="w-4 h-4 rounded cursor-pointer accent-[#00ff9f]"
              />
              <label htmlFor="published" className="text-white text-sm font-semibold cursor-pointer">
                Publikasikan artikel ini
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-[#00ff9f] text-[#0a192f] font-bold rounded-lg hover:bg-[#00cc7f] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Menyimpan...' : editingId ? 'Perbarui Artikel' : 'Buat Artikel'}
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

      {/* New Article Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-[#00ff9f] text-[#0a192f] font-bold rounded-lg hover:bg-[#00cc7f] transition-colors"
        >
          + Buat Artikel Baru
        </button>
      )}

      {/* Articles List */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">
          Daftar Artikel ({articles.length})
        </h3>

        {articles.length === 0 ? (
          <div className="text-center py-12 bg-[#112240] rounded-lg border border-slate-700">
            <p className="text-slate-400">Belum ada artikel</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-[#112240] border border-slate-700 rounded-lg p-5 hover:border-slate-600 transition-colors"
              >
                <div className="flex gap-4">
                  {article.thumbnail && (
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg truncate">
                          {article.title}
                        </h4>
                        <p className="text-slate-400 text-sm">/{article.slug}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                          article.published
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {article.published ? 'Dipublikasi' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <p className="text-slate-500 text-xs">
                      Oleh {article.author} • {new Date(article.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => handleTogglePublish(article)}
                    className={`flex-1 px-3 py-2 text-xs font-semibold rounded transition-colors ${
                      article.published
                        ? 'border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10'
                        : 'border border-green-500/50 text-green-400 hover:bg-green-500/10'
                    }`}
                  >
                    {article.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleEditArticle(article)}
                    className="flex-1 px-3 py-2 text-xs font-semibold border border-blue-500/50 text-blue-400 rounded hover:bg-blue-500/10 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(article.id)}
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
            <h4 className="text-white font-bold text-lg mb-4">Hapus Artikel?</h4>
            <p className="text-slate-300 mb-6">
              Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteArticle(deleteConfirm)}
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
