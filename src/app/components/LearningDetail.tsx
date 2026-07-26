import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Eye, Calendar, User, ChevronLeft, ChevronRight, List, X } from 'lucide-react';
import supabase from '../supabaseClient';
import { CategoryBadge, LevelBadge, LearningPost } from './LearningPage';

interface TocItem { id: string; text: string; level: number; }

interface LearningDetailProps {
  slug: string;
  onBack: () => void;
  onTutorialClick: (slug: string) => void;
}

// Generate TOC from HTML content
function extractToc(html: string): TocItem[] {
  const div = document.createElement('div');
  div.innerHTML = html;
  const headings = div.querySelectorAll('h1,h2,h3,h4,h5,h6');
  const items: TocItem[] = [];
  headings.forEach((h, i) => {
    const level = parseInt(h.tagName[1]);
    const text = h.textContent ?? '';
    const id = `heading-${i}`;
    h.id = id;
    items.push({ id, text, level });
  });
  return items;
}

// Add IDs to headings in HTML
function addIdsToHeadings(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  div.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h, i) => { h.id = `heading-${i}`; });
  return div.innerHTML;
}

export const LearningDetail = ({ slug, onBack, onTutorialClick }: LearningDetailProps) => {
  const [post, setPost] = useState<LearningPost | null>(null);
  const [allPosts, setAllPosts] = useState<LearningPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [processedContent, setProcessedContent] = useState('');
  const [activeHeading, setActiveHeading] = useState('');
  const [showToc, setShowToc] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        console.log('Loading tutorial with slug:', slug);

        // Coba cari dengan ilike dulu (case-insensitive) sebagai fallback
        const { data: postData, error: postError } = await supabase
          .from('learning_posts')
          .select('*')
          .ilike('slug', slug.trim())
          .maybeSingle();

        console.log('Query result:', { postData, postError });

        if (postError) {
          console.error('Learning post error:', postError);
          setPost(null);
          setLoading(false);
          return;
        }

        if (!postData) {
          console.warn('No post found for slug:', slug);
          setPost(null);
          setLoading(false);
          return;
        }

        setPost(postData);
        const tocItems = extractToc(postData.content ?? '');
        setToc(tocItems);
        setProcessedContent(addIdsToHeadings(postData.content ?? ''));

        // increment views — fire and forget
        supabase.rpc('increment_learning_views', { post_id: postData.id })
          .then(() => {}).catch(() => {});

        // Load semua post untuk prev/next/related
        const { data: allData } = await supabase
          .from('learning_posts')
          .select('id,title,slug,cover_image,category,level,reading_time,views,summary')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        setAllPosts(allData ?? []);
      } catch (err) {
        console.error('LearningDetail load error:', err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo({ top: 0 });
  }, [slug]);

  // Active heading on scroll
  useEffect(() => {
    const handler = () => {
      const headings = contentRef.current?.querySelectorAll('h1,h2,h3,h4,h5,h6') ?? [];
      let current = '';
      headings.forEach(h => {
        if (h.getBoundingClientRect().top < 140) current = h.id;
      });
      setActiveHeading(current);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [processedContent]);

  const scrollToHeading = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setShowToc(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--t-bg)' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border border-t-transparent mx-auto mb-4" style={{ borderColor: 'var(--t-accent)' }} />
        <p style={{ color: 'var(--t-text-muted)' }}>Memuat tutorial...</p>
      </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--t-bg)' }}>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--t-text)' }}>Tutorial Tidak Ditemukan</h2>
        <button onClick={onBack} className="px-6 py-3 rounded-lg font-bold transition-all" style={{ background: 'var(--t-accent)', color: 'var(--t-bg)' }}>
          ← Kembali ke Learning
        </button>
      </div>
    </div>
  );

  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const related = allPosts.filter(p => p.slug !== slug && p.category === post.category).slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: 'var(--t-bg)' }}>

      {/* Mobile TOC toggle */}
      {toc.length > 0 && (
        <button
          onClick={() => setShowToc(s => !s)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl font-semibold text-sm lg:hidden"
          style={{ background: 'var(--t-accent)', color: 'var(--t-bg)' }}
        >
          {showToc ? <X size={16} /> : <List size={16} />}
          Daftar Isi
        </button>
      )}

      {/* Mobile TOC drawer */}
      {showToc && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowToc(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute right-0 top-0 bottom-0 w-72 overflow-y-auto p-6 shadow-2xl" style={{ background: 'var(--t-bg-card)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold" style={{ color: 'var(--t-text)' }}>Daftar Isi</h4>
              <button onClick={() => setShowToc(false)} style={{ color: 'var(--t-text-muted)' }}><X size={18} /></button>
            </div>
            <TocContent toc={toc} activeHeading={activeHeading} onClickItem={scrollToHeading} />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-10">

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Back */}
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium mb-8 transition-colors"
              style={{ color: 'var(--t-text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--t-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--t-text-muted)')}>
              <ArrowLeft size={18} /> Kembali ke Learning
            </button>

            {/* Cover */}
            {post.cover_image && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--t-border)', background: 'var(--t-bg-card)' }}>
                <img src={post.cover_image} alt={post.title} className="w-full max-h-[420px] object-contain"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </motion.div>
            )}

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex flex-wrap gap-2 mb-4">
                <CategoryBadge category={post.category} />
                <LevelBadge level={post.level} />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight" style={{ color: 'var(--t-text)' }}>
                {post.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-5 mb-6 pb-6 border-b text-sm" style={{ borderColor: 'var(--t-border)', color: 'var(--t-text-muted)' }}>
                <span className="flex items-center gap-1.5"><User size={15} /> Ul Tazasyah</span>
                <span className="flex items-center gap-1.5"><Calendar size={15} />
                  {new Date(post.published_at ?? post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5"><Clock size={15} /> {post.reading_time} menit membaca</span>
                <span className="flex items-center gap-1.5"><Eye size={15} /> {post.views ?? 0} dilihat</span>
              </div>

              {/* Summary */}
              {post.summary && (
                <div className="mb-8 p-5 rounded-xl border-l-4" style={{ background: 'var(--t-bg-card)', borderLeftColor: 'var(--t-accent)' }}>
                  <p className="text-base leading-relaxed italic" style={{ color: 'var(--t-text-muted)' }}>
                    {post.summary}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="learning-content"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Prev / Next */}
            <div className="mt-16 pt-8 border-t grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: 'var(--t-border)' }}>
              {prevPost ? (
                <button onClick={() => onTutorialClick(prevPost.slug)}
                  className="flex items-start gap-3 p-4 rounded-xl border text-left transition-all group"
                  style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--t-accent) 40%, transparent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--t-border)')}>
                  <ChevronLeft size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--t-accent)' }} />
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--t-text-sub)' }}>Tutorial Sebelumnya</p>
                    <p className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--t-text)' }}>{prevPost.title}</p>
                  </div>
                </button>
              ) : <div />}

              {nextPost && (
                <button onClick={() => onTutorialClick(nextPost.slug)}
                  className="flex items-start gap-3 p-4 rounded-xl border text-right justify-end transition-all"
                  style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--t-accent) 40%, transparent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--t-border)')}>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--t-text-sub)' }}>Tutorial Selanjutnya</p>
                    <p className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--t-text)' }}>{nextPost.title}</p>
                  </div>
                  <ChevronRight size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--t-accent)' }} />
                </button>
              )}
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--t-text)' }}>
                  Tutorial Terkait
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {related.map(r => (
                    <button key={r.id} onClick={() => onTutorialClick(r.slug)}
                      className="group rounded-xl border overflow-hidden text-left transition-all"
                      style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--t-accent) 40%, transparent)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--t-border)')}>
                      {r.cover_image && (
                        <img src={r.cover_image} alt={r.title} className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                      <div className="p-3">
                        <CategoryBadge category={r.category} size="xs" />
                        <p className="text-sm font-semibold mt-2 line-clamp-2" style={{ color: 'var(--t-text)' }}>{r.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar TOC — desktop only */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 rounded-xl border p-4 max-h-[75vh] overflow-y-auto" style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}>
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--t-text)' }}>
                  <List size={14} style={{ color: 'var(--t-accent)' }} /> Daftar Isi
                </h4>
                <TocContent toc={toc} activeHeading={activeHeading} onClickItem={scrollToHeading} />
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Content styles */}
      <style>{`
        .learning-content { color: var(--t-text-muted); font-size: 1rem; line-height: 1.85; }
        .learning-content h1,.learning-content h2,.learning-content h3,
        .learning-content h4,.learning-content h5,.learning-content h6 { color: var(--t-text); font-weight: 700; margin: 1.5em 0 0.5em; scroll-margin-top: 100px; }
        .learning-content h1 { font-size: 1.875rem; }
        .learning-content h2 { font-size: 1.5rem; padding-bottom: 0.4em; border-bottom: 1px solid var(--t-border); }
        .learning-content h3 { font-size: 1.25rem; }
        .learning-content h4 { font-size: 1.1rem; }
        .learning-content p { margin: 0.75em 0; }
        .learning-content strong { font-weight: 700; color: var(--t-text); }
        .learning-content em { font-style: italic; }
        .learning-content u { text-decoration: underline; }
        .learning-content ul { list-style: disc; padding-left: 1.6em; margin: 0.75em 0; }
        .learning-content ol { list-style: decimal; padding-left: 1.6em; margin: 0.75em 0; }
        .learning-content li { margin: 0.35em 0; }
        .learning-content blockquote { border-left: 4px solid var(--t-accent); padding: 0.6em 1.2em; margin: 1.2em 0; background: var(--t-bg-card); border-radius: 0 8px 8px 0; color: var(--t-text-muted); font-style: italic; }
        .learning-content pre { background: #020c1b; color: #00ff9f; border-radius: 10px; padding: 16px 20px; font-family: 'Fira Code', 'Cascadia Code', monospace; font-size: 0.875rem; overflow-x: auto; margin: 1.2em 0; border: 1px solid var(--t-border); }
        .learning-content code { background: var(--t-accent-bg); color: var(--t-accent); border-radius: 4px; padding: 2px 7px; font-family: monospace; font-size: 0.875em; }
        .learning-content pre code { background: transparent; color: inherit; padding: 0; font-size: inherit; }
        .learning-content img { max-width: 100%; border-radius: 10px; margin: 1.4em auto; display: block; box-shadow: 0 6px 28px rgba(0,0,0,0.25); border: 1px solid var(--t-border); }
        .learning-content hr { border: none; border-top: 1px solid var(--t-border); margin: 2em 0; }
        .learning-content a { color: var(--t-accent2); text-decoration: underline; }
        .learning-content a:hover { color: var(--t-accent); }
        .learning-content mark { background: #fef08a; color: #000; border-radius: 3px; padding: 0 3px; }
        .learning-content table { width: 100%; border-collapse: collapse; margin: 1.2em 0; font-size: 0.9rem; }
        .learning-content th { background: var(--t-bg-card); color: var(--t-text); font-weight: 700; padding: 10px 14px; border: 1px solid var(--t-border); text-align: left; }
        .learning-content td { padding: 9px 14px; border: 1px solid var(--t-border); color: var(--t-text-muted); }
        .learning-content tr:nth-child(even) td { background: color-mix(in srgb, var(--t-bg-card) 50%, transparent); }
        .learning-content input[type="checkbox"] { margin-right: 6px; accent-color: var(--t-accent); }
        .learning-content iframe { max-width: 100%; border-radius: 10px; margin: 1.2em 0; border: 1px solid var(--t-border); }
      `}</style>
    </div>
  );
};

// TOC sub-component
const TocContent = ({ toc, activeHeading, onClickItem }: { toc: TocItem[]; activeHeading: string; onClickItem: (id: string) => void; }) => (
  <nav>
    {toc.map(item => (
      <button key={item.id} onClick={() => onClickItem(item.id)}
        className="block w-full text-left py-1 text-xs leading-snug transition-colors rounded px-2 hover:opacity-80"
        style={{
          paddingLeft: `${(item.level - 1) * 10 + 8}px`,
          color: activeHeading === item.id ? 'var(--t-accent)' : 'var(--t-text-muted)',
          fontWeight: activeHeading === item.id ? 600 : 400,
          borderLeft: activeHeading === item.id ? '2px solid var(--t-accent)' : '2px solid transparent',
        }}>
        {item.text}
      </button>
    ))}
  </nav>
);
