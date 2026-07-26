import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Clock, Eye, BookOpen, ChevronRight, Filter } from 'lucide-react';
import supabase from '../supabaseClient';

export interface LearningPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  level: 'Pemula' | 'Menengah' | 'Mahir';
  reading_time: number;
  views: number;
  status: 'draft' | 'published';
  published_at: string;
  created_at: string;
}

interface LearningPageProps {
  onTutorialClick: (slug: string) => void;
}

const CATEGORIES = [
  'Semua', 'Excel', 'SQL', 'Power BI', 'Python', 'Data Analyst',
  'IT Support', 'Networking', 'Web Development', 'Laravel', 'React',
  'GIS', 'Linux',
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Excel':          { bg: 'rgba(34,197,94,0.1)',   text: '#22c55e', border: 'rgba(34,197,94,0.3)' },
  'SQL':            { bg: 'rgba(59,130,246,0.1)',   text: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  'Power BI':       { bg: 'rgba(234,179,8,0.1)',    text: '#eab308', border: 'rgba(234,179,8,0.3)' },
  'Python':         { bg: 'rgba(99,102,241,0.1)',   text: '#6366f1', border: 'rgba(99,102,241,0.3)' },
  'Data Analyst':   { bg: 'rgba(20,184,166,0.1)',   text: '#14b8a6', border: 'rgba(20,184,166,0.3)' },
  'IT Support':     { bg: 'rgba(249,115,22,0.1)',   text: '#f97316', border: 'rgba(249,115,22,0.3)' },
  'Networking':     { bg: 'rgba(168,85,247,0.1)',   text: '#a855f7', border: 'rgba(168,85,247,0.3)' },
  'Web Development':{ bg: 'rgba(236,72,153,0.1)',   text: '#ec4899', border: 'rgba(236,72,153,0.3)' },
  'Laravel':        { bg: 'rgba(239,68,68,0.1)',    text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  'React':          { bg: 'rgba(6,182,212,0.1)',    text: '#06b6d4', border: 'rgba(6,182,212,0.3)' },
  'GIS':            { bg: 'rgba(16,185,129,0.1)',   text: '#10b981', border: 'rgba(16,185,129,0.3)' },
  'Linux':          { bg: 'rgba(245,158,11,0.1)',   text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
};

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  'Pemula':   { bg: 'rgba(34,197,94,0.15)',  text: '#22c55e' },
  'Menengah': { bg: 'rgba(234,179,8,0.15)',  text: '#eab308' },
  'Mahir':    { bg: 'rgba(239,68,68,0.15)',  text: '#ef4444' },
};

export const CategoryBadge = ({ category, size = 'sm' }: { category: string; size?: 'sm' | 'xs' }) => {
  const c = CATEGORY_COLORS[category] ?? { bg: 'var(--t-accent-bg)', text: 'var(--t-accent)', border: 'var(--t-border)' };
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border ${size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'}`}
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
    >
      {category}
    </span>
  );
};

export const LevelBadge = ({ level }: { level: string }) => {
  const c = LEVEL_COLORS[level] ?? { bg: 'var(--t-accent-bg)', text: 'var(--t-accent)' };
  return (
    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider"
      style={{ background: c.bg, color: c.text }}>
      {level}
    </span>
  );
};

export const LearningPage = ({ onTutorialClick }: LearningPageProps) => {
  const [posts, setPosts] = useState<LearningPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('learning_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });
        if (error) console.error('LearningPage fetch error:', error);
        setPosts(data ?? []);
      } catch (err) {
        console.error('LearningPage error:', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    let result = posts;
    if (activeCategory !== 'Semua') result = result.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, activeCategory, search]);

  return (
    <section className="py-12 min-h-screen" style={{ background: 'var(--t-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px]" style={{ background: 'var(--t-accent)' }} />
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--t-accent)' }}>Tutorial Teknis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--t-text)' }}>
            Pusat <span style={{ color: 'var(--t-accent)' }}>Learning</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--t-text-muted)' }}>
            Kumpulan tutorial teknis yang ditulis langsung — dari pemula hingga mahir.
          </p>
        </motion.div>

        {/* Search + Filter toggle */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--t-text-sub)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari tutorial, kategori, atau topik..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none transition-all"
              style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)', color: 'var(--t-text)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--t-accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--t-border)')}
            />
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all md:hidden"
            style={{ background: showFilters ? 'var(--t-accent)' : 'var(--t-bg-card)', borderColor: 'var(--t-border)', color: showFilters ? 'var(--t-bg)' : 'var(--t-text-muted)' }}
          >
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Category filter */}
        <div className={`flex flex-wrap gap-2 mb-8 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: activeCategory === cat ? 'var(--t-accent)' : 'var(--t-bg-card)',
                color: activeCategory === cat ? 'var(--t-bg)' : 'var(--t-text-muted)',
                borderColor: activeCategory === cat ? 'var(--t-accent)' : 'var(--t-border)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-sm mb-6" style={{ color: 'var(--t-text-sub)' }}>
            Menampilkan <span style={{ color: 'var(--t-accent)' }}>{filtered.length}</span> tutorial
            {activeCategory !== 'Semua' && <> dalam <span style={{ color: 'var(--t-accent)' }}>{activeCategory}</span></>}
            {search && <> untuk "<span style={{ color: 'var(--t-accent)' }}>{search}</span>"</>}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border overflow-hidden animate-pulse" style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}>
                <div className="h-44" style={{ background: 'var(--t-bg)' }} />
                <div className="p-5 space-y-3">
                  <div className="h-4 rounded w-1/3" style={{ background: 'var(--t-border)' }} />
                  <div className="h-5 rounded w-3/4" style={{ background: 'var(--t-border)' }} />
                  <div className="h-4 rounded w-full" style={{ background: 'var(--t-border)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--t-text-sub)' }} />
            <p className="text-lg font-semibold" style={{ color: 'var(--t-text-muted)' }}>Tidak ada tutorial ditemukan</p>
            <p className="text-sm mt-1" style={{ color: 'var(--t-text-sub)' }}>Coba kata kunci lain atau pilih kategori berbeda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group rounded-2xl border overflow-hidden flex flex-col cursor-pointer transition-all duration-300"
                style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}
                onClick={() => onTutorialClick(post.slug)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--t-accent) 50%, transparent)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px color-mix(in srgb, var(--t-accent) 10%, transparent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--t-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Cover */}
                <div className="relative h-44 overflow-hidden" style={{ background: 'var(--t-bg)' }}>
                  {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen size={40} style={{ color: 'var(--t-accent)', opacity: 0.3 }} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <CategoryBadge category={post.category} />
                  </div>
                  <div className="absolute top-3 right-3">
                    <LevelBadge level={post.level} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-base font-bold mb-2 line-clamp-2 leading-snug group-hover:transition-colors"
                    style={{ color: 'var(--t-text)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--t-accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--t-text)')}>
                    {post.title}
                  </h3>
                  <p className="text-sm mb-4 line-clamp-2 flex-grow" style={{ color: 'var(--t-text-muted)' }}>
                    {post.summary}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs pt-3 border-t" style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-sub)' }}>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Clock size={11} /> {post.reading_time} mnt</span>
                      <span className="flex items-center gap-1"><Eye size={11} /> {post.views ?? 0}</span>
                    </div>
                    <span className="flex items-center gap-1 font-semibold" style={{ color: 'var(--t-accent)' }}>
                      Baca <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
