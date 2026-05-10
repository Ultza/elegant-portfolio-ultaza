import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User } from 'lucide-react';
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

interface NewsDetailProps {
  slug: string;
  onBack: () => void;
}

export const NewsDetail = ({ slug, onBack }: NewsDetailProps) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) {
          console.error('Fetch article error:', error);
          setError('Artikel tidak ditemukan');
        } else if (data) {
          setArticle(data);
        } else {
          setError('Artikel tidak ditemukan');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Terjadi kesalahan saat memuat artikel');
      }
      setLoading(false);
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border border-[#00ff9f] border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#0a192f] p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#00ff9f] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Kembali ke Artikel
          </button>

          <div className="text-center py-16">
            <h1 className="text-4xl font-bold text-white mb-4">Artikel Tidak Ditemukan</h1>
            <p className="text-slate-400 text-lg mb-8">
              Artikel yang Anda cari tidak tersedia atau belum dipublikasikan.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-[#00ff9f] text-[#0a192f] font-bold rounded-lg hover:bg-[#00cc7f] transition-colors"
            >
              Kembali ke Daftar Artikel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a192f]">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#00ff9f] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Kembali ke Artikel
        </button>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 pb-16"
      >
        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="mb-8 rounded-xl overflow-hidden border border-slate-700">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-slate-400">
          <div className="flex items-center gap-2">
            <User size={18} />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>
              {new Date(article.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Excerpt */}
        <div className="bg-[#112240] border border-slate-700 rounded-lg p-6 mb-8">
          <p className="text-slate-300 text-lg leading-relaxed italic">
            "{article.excerpt}"
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          <div
            className="text-slate-300 leading-relaxed text-lg space-y-6"
            dangerouslySetInnerHTML={{
              __html: article.content.replace(/\n/g, '<br />')
            }}
          />
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-[#00ff9f] text-[#0a192f] font-bold rounded-lg hover:bg-[#00cc7f] transition-colors"
            >
              ← Kembali ke Artikel
            </button>
            <div className="text-slate-500 text-sm">
              Dibaca pada {new Date().toLocaleDateString('id-ID')}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};