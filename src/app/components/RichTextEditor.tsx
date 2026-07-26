import React, { useRef, useCallback, useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image as ImageExt } from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Highlight } from '@tiptap/extension-highlight';
import { Extension } from '@tiptap/core';
import supabase from '../supabaseClient';

const STORAGE_BUCKET = 'article-images';

// ── Custom FontSize extension via TextStyle attribute ──────────────────────
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] }; },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el) => el.style.fontSize || null,
          renderHTML: (attrs) => attrs.fontSize ? { style: `font-size:${attrs.fontSize}` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: (size: string) => ({ chain }: any) =>
        chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize: () => ({ chain }: any) =>
        chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    } as any;
  },
});

// ── Toolbar button ─────────────────────────────────────────────────────────
const Btn = ({
  onClick, active = false, title, children,
}: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
}) => (
  <button
    type="button" title={title}
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    className="flex items-center justify-center w-7 h-7 rounded text-xs font-bold transition-all select-none flex-shrink-0"
    style={{
      background: active ? 'var(--t-accent)' : 'transparent',
      color: active ? 'var(--t-bg)' : 'var(--t-text-muted)',
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--t-accent-bg)'; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
  >
    {children}
  </button>
);

const Sep = () => <div className="w-px h-5 mx-0.5 self-center opacity-30" style={{ background: 'var(--t-text)' }} />;

// ── Select helper ──────────────────────────────────────────────────────────
const Sel = ({ title, children, onChange, defaultValue = '' }: {
  title: string; children: React.ReactNode;
  onChange: (v: string) => void; defaultValue?: string;
}) => (
  <select
    title={title}
    defaultValue={defaultValue}
    className="h-7 px-1.5 rounded text-xs focus:outline-none cursor-pointer flex-shrink-0"
    style={{ background: 'var(--t-bg)', color: 'var(--t-text)', border: '1px solid var(--t-border)', maxWidth: 90 }}
    onChange={(e) => onChange(e.target.value)}
  >
    {children}
  </select>
);

// ── Toolbar ────────────────────────────────────────────────────────────────
const Toolbar = ({ editor, onImg, uploading }: {
  editor: Editor; onImg: (f: File) => Promise<void>; uploading: boolean;
}) => {
  const imgRef = useRef<HTMLInputElement>(null);

  const COLORS = ['#ffffff','#0f172a','#ef4444','#f97316','#eab308',
    '#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#00ff9f','#00d4ff','#a78bfa','#4ade80','#facc15'];

  const curLevel = editor.isActive('heading',{level:1}) ? '1'
    : editor.isActive('heading',{level:2}) ? '2'
    : editor.isActive('heading',{level:3}) ? '3' : '0';

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 p-2 border-b"
      style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)' }}
    >
      {/* Heading */}
      <Sel title="Heading" onChange={(v) => {
        const n = parseInt(v);
        if (n === 0) editor.chain().focus().setParagraph().run();
        else editor.chain().focus().toggleHeading({ level: n as 1|2|3 }).run();
      }}>
        <option value="0">Paragraf</option>
        <option value="1">H1 — Judul Besar</option>
        <option value="2">H2 — Sub Judul</option>
        <option value="3">H3 — Kecil</option>
      </Sel>

      {/* Font family */}
      <Sel title="Font" onChange={(v) => v ? editor.chain().focus().setFontFamily(v).run() : editor.chain().focus().unsetFontFamily().run()}>
        <option value="">Font</option>
        <option value="Inter, sans-serif">Sans-serif</option>
        <option value="Georgia, serif">Serif</option>
        <option value="monospace">Mono</option>
        <option value="cursive">Cursive</option>
      </Sel>

      {/* Font size */}
      <Sel title="Ukuran Font" onChange={(v) => v
        ? (editor.chain().focus() as any).setFontSize(v).run()
        : (editor.chain().focus() as any).unsetFontSize().run()
      }>
        <option value="">Ukuran</option>
        {['12px','14px','16px','18px','20px','24px','28px','32px','36px','48px'].map(s => (
          <option key={s} value={s}>{s.replace('px','')}</option>
        ))}
      </Sel>

      <Sep />

      {/* Format */}
      <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><strong>B</strong></Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><em>I</em></Btn>
      <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><span className="underline">U</span></Btn>
      <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Coret"><span className="line-through">S</span></Btn>
      <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Sorot">
        <span style={{ background:'#fef08a', color:'#000', padding:'0 2px', borderRadius:2 }}>H</span>
      </Btn>

      <Sep />

      {/* Align */}
      <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({textAlign:'left'})} title="Kiri">⬛⬜⬜</Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({textAlign:'center'})} title="Tengah">⬜⬛⬜</Btn>
      <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({textAlign:'right'})} title="Kanan">⬜⬜⬛</Btn>

      <Sep />

      {/* List & blocks */}
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">•≡</Btn>
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Daftar Bernomor">1≡</Btn>
      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Kutipan">"</Btn>
      <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Kode Inline">{'`'}</Btn>
      <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Blok Kode">{'{}'}</Btn>
      <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Garis Pemisah" active={false}>─</Btn>

      <Sep />

      {/* Color swatches */}
      <div className="flex flex-wrap gap-0.5" style={{ maxWidth: 110 }}>
        {COLORS.map(col => (
          <button key={col} type="button" title={col}
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setColor(col).run(); }}
            className="w-3.5 h-3.5 rounded-sm border border-black/20 hover:scale-125 transition-transform flex-shrink-0"
            style={{ background: col }}
          />
        ))}
      </div>

      <Sep />

      {/* Insert image */}
      <Btn onClick={() => imgRef.current?.click()} title="Insert Gambar" active={false}>
        {uploading ? <span className="animate-spin text-[10px]">⟳</span> : '🖼'}
      </Btn>
      <input ref={imgRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" className="hidden"
        onChange={async (e) => { const f = e.target.files?.[0]; if (f) await onImg(f); e.target.value = ''; }} />

      <Sep />

      {/* Undo / Redo */}
      <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</Btn>
      <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</Btn>
    </div>
  );
};

// ── Public component ───────────────────────────────────────────────────────
interface Props { value: string; onChange: (html: string) => void; placeholder?: string; }

export const RichTextEditor = ({ value, onChange, placeholder }: Props) => {
  const [uploading, setUploading] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExt.configure({ inline: false, allowBase64: false }),
      TextStyle,
      FontSize,
      Color,
      FontFamily,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder ?? 'Tulis konten artikel di sini...' }),
      Highlight,
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: 'rte-content' } },
  });

  // sync when editing existing article
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleImg = useCallback(async (file: File) => {
    if (!editor) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const name = `inline-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from(STORAGE_BUCKET)
        .upload(name, file, { cacheControl: '3600', upsert: false, contentType: file.type });
      if (error) throw new Error(error.message);
      const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
      editor.chain().focus().setImage({ src: pub.publicUrl, alt: file.name }).run();
    } catch (err: any) {
      alert(`Gagal upload: ${err.message}`);
    } finally { setUploading(false); }
  }, [editor]);

  return (
    <>
      <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--t-border)' }}>
        {editor && <Toolbar editor={editor} onImg={handleImg} uploading={uploading} />}
        <div style={{ background: 'var(--t-bg-input)', minHeight: 300 }}>
          <EditorContent editor={editor} />
        </div>
      </div>
      <style>{`
        .rte-content{padding:16px;min-height:300px;outline:none;color:var(--t-text);font-size:15px;line-height:1.8;}
        .rte-content h1{font-size:2em;font-weight:700;margin:.5em 0 .25em;color:var(--t-text);}
        .rte-content h2{font-size:1.5em;font-weight:700;margin:.5em 0 .25em;color:var(--t-text);}
        .rte-content h3{font-size:1.25em;font-weight:600;margin:.4em 0 .2em;color:var(--t-text);}
        .rte-content p{margin:.4em 0;}
        .rte-content strong{font-weight:700;}
        .rte-content em{font-style:italic;}
        .rte-content u{text-decoration:underline;}
        .rte-content s{text-decoration:line-through;}
        .rte-content ul{list-style:disc;padding-left:1.5em;margin:.4em 0;}
        .rte-content ol{list-style:decimal;padding-left:1.5em;margin:.4em 0;}
        .rte-content li{margin:.2em 0;}
        .rte-content blockquote{border-left:4px solid var(--t-accent);padding-left:1em;margin:1em 0;color:var(--t-text-muted);font-style:italic;}
        .rte-content pre{background:#020c1b;color:#00ff9f;border-radius:8px;padding:12px 16px;font-family:monospace;font-size:13px;overflow-x:auto;margin:.75em 0;}
        .rte-content code{background:var(--t-accent-bg);color:var(--t-accent);border-radius:4px;padding:2px 6px;font-family:monospace;font-size:.875em;}
        .rte-content img{max-width:100%;border-radius:8px;margin:1em auto;display:block;box-shadow:0 4px 20px rgba(0,0,0,.3);}
        .rte-content img.ProseMirror-selectednode{outline:3px solid var(--t-accent);}
        .rte-content hr{border:none;border-top:1px solid var(--t-border);margin:1.5em 0;}
        .rte-content a{color:var(--t-accent2);text-decoration:underline;}
        .rte-content mark{background:#fef08a;color:#000;border-radius:2px;padding:0 2px;}
        .rte-content p.is-editor-empty:first-child::before{content:attr(data-placeholder);float:left;color:var(--t-text-sub);pointer-events:none;height:0;}
      `}</style>
    </>
  );
};
