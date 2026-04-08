'use client';
import { useMemo } from 'react';
import { MONTH_DATA } from '../lib/utils';
import type { Theme } from '../hooks/useTheme';
import GameZone from './GameZone';
import type { CharPos, TrailPoint } from '../hooks/useGameZone';

interface Props {
  month: number; year: number; theme: Theme;
  onPrev: () => void; onNext: () => void; onToday: () => void;
  dark: boolean; onToggleDark: () => void;
  /* game zone */
  charPos: CharPos;
  trail: TrailPoint[];
  confettiDate: string | null;
  glowPulse: boolean;
  isMoving: boolean;
  hoveredDate: string | null;
  rewardDays: Set<number>;
  onGameMove: (x: number, y: number) => void;
}

const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

function seededRand(seed: number, min: number, max: number) {
  const x = Math.sin(seed + 1) * 10000;
  return min + (x - Math.floor(x)) * (max - min);
}

/* ── January: Blizzard ── */
function JanuaryParticles() {
  const flakes = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: seededRand(i * 7.1, 1, 98),
    size: seededRand(i * 3.3, 10, 26),
    delay: seededRand(i * 5.7, 0, 6),
    dur: seededRand(i * 2.9, 2.5, 5.5),
    anim: i % 3 === 0 ? 'blizzard-fast' : 'blizzard',
    char: i % 4 === 0 ? '✦' : i % 4 === 1 ? '❄' : i % 4 === 2 ? '❅' : '✳',
    color: i % 3 === 0 ? '#a8d8ff' : i % 3 === 1 ? '#d0eeff' : '#ffffff',
  })), []);
  const streaks = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: i, top: seededRand(i * 11, 5, 85),
    delay: seededRand(i * 8, 0, 4), dur: seededRand(i * 6, 1.5, 3),
    width: seededRand(i * 4, 40, 100),
  })), []);
  return (
    <>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(180,220,255,0.18) 100%)', animation: 'frost-pulse 4s ease-in-out infinite', zIndex: 7 }} />
      {streaks.map(s => <div key={s.id} className="particle" style={{ top: `${s.top}%`, left: '-10%', width: s.width, height: 1.5, background: 'linear-gradient(to right, transparent, rgba(200,230,255,0.6), transparent)', animation: `wind-streak ${s.dur}s ${s.delay}s ease-in-out infinite`, borderRadius: 2 }} />)}
      {flakes.map(f => <span key={f.id} className="particle" style={{ left: `${f.left}%`, top: '-5%', fontSize: f.size, color: f.color, animation: `${f.anim} ${f.dur}s ${f.delay}s linear infinite`, textShadow: '0 0 8px rgba(150,210,255,0.8)', opacity: 0 }}>{f.char}</span>)}
    </>
  );
}

/* ── October: Haunted ── */
function OctoberParticles() {
  const bats = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ id: i, top: seededRand(i * 9, 5, 70), delay: seededRand(i * 7, 0, 8), dur: seededRand(i * 5, 4, 8), size: seededRand(i * 3, 16, 28) })), []);
  const lanterns = useMemo(() => Array.from({ length: 5 }, (_, i) => ({ id: i, left: seededRand(i * 13, 5, 90), top: seededRand(i * 11, 30, 75), size: seededRand(i * 7, 20, 34), delay: seededRand(i * 9, 0, 3), dur: seededRand(i * 5, 1.5, 3.5) })), []);
  const leaves = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ id: i, left: seededRand(i * 6, 2, 96), delay: seededRand(i * 8, 0, 7), dur: seededRand(i * 4, 3.5, 7), size: seededRand(i * 3, 14, 24), char: i % 2 === 0 ? '🍂' : '🍁' })), []);
  const ghosts = useMemo(() => Array.from({ length: 3 }, (_, i) => ({ id: i, left: seededRand(i * 17, 10, 80), top: seededRand(i * 13, 15, 60), size: seededRand(i * 9, 22, 36), delay: seededRand(i * 11, 0, 4), dur: seededRand(i * 7, 3, 6) })), []);
  return (
    <>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(30,0,50,0.35) 100%)', zIndex: 7 }} />
      {lanterns.map(l => <span key={l.id} className="particle" style={{ left: `${l.left}%`, top: `${l.top}%`, fontSize: l.size, animation: `lantern-glow ${l.dur}s ${l.delay}s ease-in-out infinite` }}>🎃</span>)}
      {ghosts.map(g => <span key={g.id} className="particle" style={{ left: `${g.left}%`, top: `${g.top}%`, fontSize: g.size, animation: `ghost-float ${g.dur}s ${g.delay}s ease-in-out infinite`, filter: 'drop-shadow(0 0 8px rgba(200,200,255,0.8))', opacity: 0.75 }}>👻</span>)}
      {bats.map(b => <span key={b.id} className="particle" style={{ left: '-5%', top: `${b.top}%`, fontSize: b.size, animation: `bat-fly ${b.dur}s ${b.delay}s ease-in-out infinite`, opacity: 0 }}>🦇</span>)}
      {leaves.map(l => <span key={l.id} className="particle" style={{ left: `${l.left}%`, top: '-5%', fontSize: l.size, animation: `spooky-leaf ${l.dur}s ${l.delay}s ease-in-out infinite`, opacity: 0 }}>{l.char}</span>)}
    </>
  );
}

/* ── December: Christmas ── */
function DecemberParticles() {
  const stars = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ id: i, left: seededRand(i * 8, 3, 95), top: seededRand(i * 6, 5, 80), size: seededRand(i * 4, 14, 30), delay: seededRand(i * 9, 0, 6), dur: seededRand(i * 5, 2, 5), char: i % 3 === 0 ? '⭐' : i % 3 === 1 ? '✨' : '💫' })), []);
  const ornaments = useMemo(() => Array.from({ length: 6 }, (_, i) => ({ id: i, left: seededRand(i * 11, 5, 90), top: seededRand(i * 7, 10, 55), size: seededRand(i * 5, 18, 30), delay: seededRand(i * 9, 0, 3), dur: seededRand(i * 7, 2, 4), char: ['🔴','🟡','🔵','🟢','🟣','🟠'][i % 6] })), []);
  const snowflakes = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ id: i, left: seededRand(i * 6, 1, 98), delay: seededRand(i * 8, 0, 7), dur: seededRand(i * 4, 3, 7), size: seededRand(i * 3, 10, 22) })), []);
  const sparkles = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ id: i, left: seededRand(i * 13, 5, 92), top: seededRand(i * 9, 10, 85), size: seededRand(i * 7, 12, 22), delay: seededRand(i * 11, 0, 5), dur: seededRand(i * 5, 1.5, 3.5) })), []);
  return (
    <>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,200,80,0.12) 0%, transparent 60%)', zIndex: 7 }} />
      {sparkles.map(s => <span key={s.id} className="particle" style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: s.size, animation: `sparkle ${s.dur}s ${s.delay}s ease-in-out infinite`, opacity: 0 }}>✦</span>)}
      {ornaments.map(o => <span key={o.id} className="particle" style={{ left: `${o.left}%`, top: `${o.top}%`, fontSize: o.size, animation: `ornament-swing ${o.dur}s ${o.delay}s ease-in-out infinite`, transformOrigin: 'top center', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))' }}>{o.char}</span>)}
      {stars.map(s => <span key={s.id} className="particle" style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: s.size, animation: `star-burst ${s.dur}s ${s.delay}s ease-in-out infinite`, filter: 'drop-shadow(0 0 6px rgba(255,220,80,0.9))', opacity: 0 }}>{s.char}</span>)}
      {snowflakes.map(f => <span key={f.id} className="particle" style={{ left: `${f.left}%`, top: '-5%', fontSize: f.size, color: '#e8f4ff', animation: `xmas-snow ${f.dur}s ${f.delay}s linear infinite`, opacity: 0 }}>❄</span>)}
      <span className="particle" style={{ right: '8%', bottom: '18%', fontSize: 48, animation: 'candle-flicker 2s ease-in-out infinite', filter: 'drop-shadow(0 0 12px rgba(100,200,80,0.6))' }}>🎄</span>
    </>
  );
}

const GENERIC: Record<number, { emoji: string; count: number; animation: string; dur: [number,number]; size: [number,number] }> = {
  1:  { emoji:'❄️', count:10, animation:'snowfall',   dur:[4,8],  size:[10,18] },
  2:  { emoji:'🌸', count:12, animation:'petalfall',  dur:[4,8],  size:[14,22] },
  3:  { emoji:'🌸', count:14, animation:'petalfall',  dur:[3,7],  size:[12,20] },
  4:  { emoji:'🌿', count:10, animation:'petalfall',  dur:[5,9],  size:[14,20] },
  5:  { emoji:'🫧', count:10, animation:'bubblerise', dur:[4,8],  size:[14,22] },
  6:  { emoji:'☀️', count:6,  animation:'twinkle',    dur:[2,4],  size:[16,24] },
  7:  { emoji:'🌊', count:8,  animation:'bubblerise', dur:[5,9],  size:[14,20] },
  8:  { emoji:'🍂', count:12, animation:'leaffall',   dur:[4,8],  size:[14,22] },
  10: { emoji:'⭐', count:10, animation:'twinkle',    dur:[1,3],  size:[10,18] },
};

function GenericParticles({ month }: { month: number }) {
  const cfg = GENERIC[month];
  const particles = useMemo(() => Array.from({ length: cfg.count }, (_, i) => ({
    id: i,
    left: seededRand(i * 7 + month, 2, 96),
    top:  seededRand(i * 5 + month, 0, 65),
    size: seededRand(i * 3 + month, cfg.size[0], cfg.size[1]),
    delay: seededRand(i * 9 + month, 0, 5),
    dur: seededRand(i * 6 + month, cfg.dur[0], cfg.dur[1]),
  })), [cfg, month]);
  return (
    <>
      {particles.map(p => (
        <span key={p.id} className="particle" style={{ left: `${p.left}%`, top: `${p.top}%`, fontSize: p.size, animation: `${cfg.animation} ${p.dur}s ${p.delay}s ease-in-out infinite`, opacity: 0 }}>{cfg.emoji}</span>
      ))}
    </>
  );
}

export default function HeroSection({
  month, year, theme, onPrev, onNext, onToday, dark, onToggleDark,
  charPos, trail, confettiDate, glowPulse, isMoving, hoveredDate, rewardDays, onGameMove,
}: Props) {
  const data   = MONTH_DATA[month];
  const cardBg = dark ? '#1a202c' : '#fefcf8';

  return (
    <div className="relative">

      {/* ── Spiral binding ── */}
      <div className="spiral-bar relative flex items-center justify-around px-3" style={{ height: 40, zIndex: 10 }}>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2" style={{ height: 6, background: 'linear-gradient(180deg,#4a5568 0%,#2d3748 50%,#1a2130 100%)', boxShadow: '0 2px 5px rgba(0,0,0,0.55)' }} />
        {Array.from({ length: 22 }).map((_, i) => <div key={i} className="spiral-ring relative z-10" />)}
      </div>

      {/* ── Hero image ── */}
      <div className="relative overflow-hidden" style={{ height: 310 }}>
        <img
          src={data.url} alt={data.label}
          className="absolute inset-0 w-full h-full object-cover gz-scene-img"
          draggable={false}
        />

        {/* Cinematic gradient */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(165deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.60) 100%)' }} />

        {/* Hover glow pulse overlay */}
        {glowPulse && (
          <div className="absolute inset-0 gz-glow-pulse pointer-events-none" style={{ zIndex: 8 }} />
        )}

        {/* Month-specific particles */}
        {month === 0  && <JanuaryParticles />}
        {month === 9  && <OctoberParticles />}
        {month === 11 && <DecemberParticles />}
        {GENERIC[month] && <GenericParticles month={month} />}

        {/* ── GAME ZONE ── */}
        <GameZone
          charPos={charPos}
          trail={trail}
          confettiDate={confettiDate}
          glowPulse={glowPulse}
          isMoving={isMoving}
          hoveredDate={hoveredDate}
          month={month}
          onMove={onGameMove}
        />

        {/* Top controls */}
        <div className="absolute top-3 left-4 right-4 flex justify-between items-center z-20">
          <div style={{ background: 'rgba(0,0,0,0.42)', color: 'rgba(255,255,255,0.93)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20, letterSpacing: '0.05em' }}>
            📸 {data.label}
          </div>
          <button
            onClick={onToggleDark}
            style={{ background: 'rgba(0,0,0,0.42)', color: 'rgba(255,255,255,0.93)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', fontSize: 13, padding: '5px 12px', borderRadius: 20, cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.12)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            aria-label="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* ── Curved SVG wave ── */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 900 115" preserveAspectRatio="none" style={{ height: 115 }}>
          <path d="M0,115 L0,65 Q75,28 200,50 Q340,74 480,38 Q618,4 758,28 Q848,40 900,24 L900,115 Z" fill={cardBg} />
          <path d="M355,44 Q495,10 648,26 Q778,38 900,18 L900,115 L355,115 Z" fill={theme.secondary} opacity="0.87" />
          <path d="M638,28 Q778,10 900,16 L900,115 L638,115 Z" fill={theme.primary} opacity="0.74" />
        </svg>

        {/* Month + Year */}
        <div className="absolute bottom-7 right-8 text-right z-10">
          <div style={{ color: 'rgba(255,255,255,0.70)', fontSize: 11, fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase', marginBottom: 3 }}>{year}</div>
          <div style={{ color: 'white', fontSize: 38, fontWeight: 900, letterSpacing: '0.07em', lineHeight: 1, textShadow: '0 3px 18px rgba(0,0,0,0.60)', textTransform: 'uppercase' }}>{MONTH_NAMES[month]}</div>
        </div>
      </div>

      {/* ── Navigation bar ── */}
      <div className="flex items-center justify-between px-6 py-3" style={{ background: dark ? 'linear-gradient(180deg,#1a202c,#1e2533)' : 'linear-gradient(180deg,#f5efe4,#ede5d8)', borderBottom: `1px solid ${dark ? '#2d3748' : '#ddd0bc'}` }}>
        {[
          { label: '← Prev', fn: onPrev, aria: 'Previous month' },
          { label: 'Today',  fn: onToday, aria: 'Go to today' },
          { label: 'Next →', fn: onNext, aria: 'Next month' },
        ].map(btn => (
          <button key={btn.label} onClick={btn.fn} aria-label={btn.aria}
            style={{ background: `${theme.secondary}1e`, color: theme.secondary, border: `1.5px solid ${theme.secondary}38`, fontSize: 13, fontWeight: 700, padding: '7px 20px', borderRadius: 12, cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform='scale(1.06)'; e.currentTarget.style.boxShadow=`0 4px 12px ${theme.secondary}30`; }}
            onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
