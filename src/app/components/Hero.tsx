import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Linkedin, Mail, MapPin, ChevronRight } from 'lucide-react';
import userPortrait from "../../assets/bdf3cd406212a8881b29220053c03e271bedd103.png";

// ── Typewriter ─────────────────────────────────────────────────────────────
const ROLES = ['Pengembang Fullstack', 'IT Support', 'Pengembang Mobile', 'Spesialis GIS'];
const TYPE_SPEED = 80;
const DELETE_SPEED = 40;
const PAUSE_AFTER = 1800;
const PAUSE_BEFORE = 300;

function useTypewriter(words: string[]) {
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'deleting'>('typing');

  useEffect(() => {
    const current = words[wordIndex];
    if (phase === 'typing') {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), TYPE_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('deleting'), PAUSE_AFTER);
        return () => clearTimeout(t);
      }
    }
    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), DELETE_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setWordIndex((i) => (i + 1) % words.length);
          setPhase('typing');
        }, PAUSE_BEFORE);
        return () => clearTimeout(t);
      }
    }
  }, [displayed, phase, wordIndex, words]);

  return displayed;
}

// ── Count-up ───────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1600, trigger = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return count;
}

// ── Hero Component ─────────────────────────────────────────────────────────
export const Hero = ({ onProfileClick }: { onProfileClick?: () => void }) => {
  const typedRole = useTypewriter(ROLES);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-start pt-10 overflow-hidden"
      style={{ background: 'var(--t-bg)' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(var(--t-accent) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 blur-[100px] rounded-full opacity-10"
        style={{ background: 'var(--t-accent)' }} />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 blur-[100px] rounded-full opacity-10"
        style={{ background: 'var(--t-accent2)' }} />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* ── Left ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7"
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-6 border"
            style={{
              background: 'var(--t-accent-bg)',
              borderColor: 'color-mix(in srgb, var(--t-accent) 30%, transparent)',
              color: 'var(--t-accent)',
            }}
          >
            <Terminal size={14} />
            <span>Siap untuk peluang baru</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight" style={{ color: 'var(--t-text)' }}>
            Halo, Saya <span style={{ color: 'var(--t-accent)' }}>Ul Tazasyah</span>
          </h1>

          {/* Typewriter */}
          <div
            className="mb-8 pl-3 border-l-2 min-h-[2.25rem] flex items-center"
            style={{ borderColor: 'var(--t-accent)' }}
          >
            <span className="text-lg md:text-2xl font-mono font-semibold" style={{ color: 'var(--t-accent)' }}>
              {typedRole}
              <span
                className="inline-block w-[2px] h-5 ml-0.5 align-middle animate-pulse"
                style={{ background: 'var(--t-accent)' }}
              />
            </span>
          </div>

          <p className="text-xl max-w-2xl mb-10 leading-relaxed font-light" style={{ color: 'var(--t-text-muted)' }}>
            "Menjembatani keahlian teknis di bidang sistem IT dengan pengelolaan data lingkungan."
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-5">
            <a
              href="#projects"
              className="px-8 py-4 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:-translate-y-1 shadow-lg"
              style={{
                background: 'var(--t-accent)',
                color: 'var(--t-bg)',
                boxShadow: '0 8px 24px color-mix(in srgb, var(--t-accent) 25%, transparent)',
              }}
            >
              Lihat Proyek <ChevronRight size={20} />
            </a>
            <button
              onClick={onProfileClick}
              className="px-8 py-4 rounded-lg font-bold border transition-all transform hover:-translate-y-1"
              style={{
                background: 'var(--t-bg-card)',
                color: 'var(--t-accent)',
                borderColor: 'color-mix(in srgb, var(--t-accent) 30%, transparent)',
              }}
            >
              Profil Pribadi
            </button>

            <div className="flex items-center gap-4 px-2">
              <a
                href="https://linkedin.com/in/ul-tazasyah-274a2a392"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border transition-all"
                style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)', color: 'var(--t-text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--t-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--t-text-muted)')}
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:ultazanagan111@gmail.com"
                className="p-3 rounded-lg border transition-all"
                style={{ background: 'var(--t-bg-card)', borderColor: 'var(--t-border)', color: 'var(--t-text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--t-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--t-text-muted)')}
              >
                <Mail size={20} />
              </a>
              <div className="flex items-center gap-2 text-sm ml-2" style={{ color: 'var(--t-text-sub)' }}>
                <MapPin size={16} style={{ color: 'var(--t-accent)', opacity: 0.5 }} />
                <span>Nagan Raya, Aceh</span>
              </div>
            </div>
          </div>

        </motion.div>

        {/* ── Right: Photo ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative w-full aspect-square md:max-w-md mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
              className="absolute -inset-4 border border-dashed rounded-full"
              style={{ borderColor: 'color-mix(in srgb, var(--t-accent) 20%, transparent)' }}
            />
            <div
              className="absolute -inset-2 rounded-3xl blur-2xl opacity-50"
              style={{ background: 'linear-gradient(to top right, color-mix(in srgb, var(--t-accent) 20%, transparent), color-mix(in srgb, var(--t-accent2) 20%, transparent))' }}
            />
            <div
              className="relative h-full w-full rounded-3xl overflow-hidden border-2 shadow-2xl group transition-colors duration-700"
              style={{ borderColor: 'var(--t-border)', background: 'var(--t-accent2)' }}
            >
              <img
                src={userPortrait}
                alt="Ul Tazasyah Portrait"
                className="w-full h-full object-cover object-top grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
};
