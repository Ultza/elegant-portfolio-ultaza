import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useTheme, THEMES, Theme } from '../context/ThemeContext';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div ref={ref} className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-all"
        style={{
          background: 'var(--t-bg-card)',
          borderColor: 'var(--t-border)',
          color: 'var(--t-accent)',
        }}
      >
        <Palette size={16} />
        <span className="hidden sm:inline">{current.emoji} {current.label}</span>
        <span className="sm:hidden">{current.emoji}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border z-50 overflow-hidden"
          style={{
            background: 'var(--t-bg-card)',
            borderColor: 'var(--t-border)',
          }}
        >
          <p
            className="px-4 pt-3 pb-2 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--t-text-sub)' }}
          >
            Choose Theme
          </p>

          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id as Theme); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:opacity-80"
              style={{
                background: theme === t.id ? 'var(--t-accent-bg)' : 'transparent',
              }}
            >
              {/* Color Preview */}
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 border-2 overflow-hidden"
                style={{
                  background: t.preview.bg,
                  borderColor: theme === t.id ? t.preview.accent : 'transparent',
                }}
              >
                <div
                  className="w-full h-1/2"
                  style={{ background: t.preview.card }}
                />
                <div
                  className="w-1/2 h-[3px] mx-auto mt-1 rounded-full"
                  style={{ background: t.preview.accent }}
                />
              </div>

              <div className="text-left">
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{
                    color: theme === t.id ? 'var(--t-accent)' : 'var(--t-text)',
                  }}
                >
                  {t.emoji} {t.label}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--t-text-sub)' }}>
                  {t.description}
                </p>
              </div>

              {/* Active indicator */}
              {theme === t.id && (
                <div
                  className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: 'var(--t-accent)' }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
