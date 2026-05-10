import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
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

interface NewsProps {
  onNewsClick: (slug: string) => void;
}

export const News = ({ onNewsClick }: NewsProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublishedArticles = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Fetch articles error:', error);
          setArticles([]);
        } else if (data) {
          setArticles(data);
        }
      } catch (err) {
        console.log('Error fetching articles:', err);
        setArticles([]);
      }
      setLoading(false);
    };

    fetchPublishedArticles();
  }, []);

  return (
    <section id="news" className="py-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Latest <span className="text-[#00ff9f]">Articles</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Insights, tutorials, dan tips seputar development & technology
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border border-[#00ff9f] border-t-transparent"></div>
        </div>
      ) : fetchError ? (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg max-w-2xl mx-auto text-center">
          Error loading articles
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>Belum ada artikel yang dipublikasikan</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-[#112240] border border-slate-700 rounded-xl overflow-hidden hover:border-[#00ff9f]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#00ff9f]/10 cursor-pointer"
              onClick={() => onNewsClick(article.slug)}
            >
              {/* Thumbnail */}
              {article.thumbnail && (
                <div className="relative overflow-hidden h-48 bg-gradient-to-b from-[#1a2a4f] to-[#0a192f]">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex flex-col h-full">
                {/* Meta */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <span>{new Date(article.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                  <span>•</span>
                  <span>{article.author}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00ff9f] transition-colors line-clamp-2">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-slate-300 text-sm mb-6 flex-grow line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Read More */}
                <div className="flex items-center gap-2 text-[#00ff9f] hover:text-white transition-colors font-semibold text-sm">
                  Baca Selengkapnya
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
