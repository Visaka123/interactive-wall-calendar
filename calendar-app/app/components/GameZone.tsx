'use client';
import { useRef, useCallback, useMemo } from 'react';
import type { CharPos, TrailPoint } from '../hooks/useGameZone';

interface Props {
  charPos: CharPos;
  trail: TrailPoint[];
  confettiDate: string | null;
  glowPulse: boolean;
  isMoving: boolean;
  hoveredDate: string | null;
  month: number;
  onMove: (x: number, y: number) => void;
}

function seeded(seed: number, min: number, max: number) {
  const x = Math.sin(seed + 1) * 10000;
  return min + (x - Math.floor(x)) * (max - min);
}

/* ── Clouds ── */
function Clouds({ month }: { month: number }) {
  const clouds = useMemo(() => Array.from({ length: 4 }, (_, i) => ({
    id: i,
    top: seeded(i * 5 + month, 8, 45),
    size: seeded(i * 7 + month, 60, 130),
    dur: seeded(i * 3 + month, 18, 32),
    delay: seeded(i * 11 + month, 0, 15),
    opacity: seeded(i * 9 + month, 0.25, 0.55),
  })), [month]);

  return (
    <>
      {clouds.map(c => (
        <div key={c.id} className="gz-cloud" style={{
          top: `${c.top}%`,
          width: c.size,
          height: c.size * 0.45,
          opacity: c.opacity,
          animationDuration: `${c.dur}s`,
          animationDelay: `${c.delay}s`,
        }} />
      ))}
    </>
  );
}

/* ── Birds ── */
function Birds({ month }: { month: number }) {
  const birds = useMemo(() => Array.from({ length: 5 }, (_, i) => ({
    id: i,
    top: seeded(i * 6 + month, 10, 55),
    size: seeded(i * 4 + month, 10, 18),
    dur: seeded(i * 8 + month, 6, 14),
    delay: seeded(i * 12 + month, 0, 12),
  })), [month]);

  return (
    <>
      {birds.map(b => (
        <span key={b.id} className="gz-bird" style={{
          top: `${b.top}%`,
          fontSize: b.size,
          animationDuration: `${b.dur}s`,
          animationDelay: `${b.delay}s`,
        }}>🕊️</span>
      ))}
    </>
  );
}

/* ── Light Particles ── */
function LightParticles({ month }: { month: number }) {
  const particles = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: seeded(i * 7 + month, 3, 95),
    top: seeded(i * 5 + month, 5, 85),
    size: seeded(i * 3 + month, 3, 8),
    dur: seeded(i * 9 + month, 2, 5),
    delay: seeded(i * 11 + month, 0, 6),
  })), [month]);

  return (
    <>
      {particles.map(p => (
        <div key={p.id} className="gz-particle" style={{
          left: `${p.left}%`,
          top: `${p.top}%`,
          width: p.size,
          height: p.size,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </>
  );
}

/* ── Confetti burst ── */
function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
    id: i,
    color: ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b','#cc5de8','#f06595'][i % 7],
    angle: (i / 28) * 360,
    dist: 40 + (i % 5) * 18,
    size: 5 + (i % 4) * 3,
    shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'rect' : 'star',
    delay: (i % 4) * 0.06,
  })), []);

  return (
    <div className="gz-confetti-wrap">
      {pieces.map(p => (
        <div key={p.id} className="gz-confetti-piece" style={{
          background: p.color,
          width: p.shape === 'rect' ? p.size * 1.6 : p.size,
          height: p.size,
          borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'rect' ? 2 : '50% 0',
          '--angle': `${p.angle}deg`,
          '--dist': `${p.dist}px`,
          animationDelay: `${p.delay}s`,
        } as React.CSSProperties} />
      ))}
      <div className="gz-confetti-emoji">🎉</div>
    </div>
  );
}

/* ── Trail ── */
function Trail({ trail }: { trail: TrailPoint[] }) {
  if (trail.length < 2) return null;
  const pts = trail.map(p => `${p.x}% ${p.y}%`).join(', ');
  return (
    <svg className="gz-trail-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={trail.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="rgba(255,220,80,0.7)"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 2"
        style={{ filter: 'drop-shadow(0 0 3px rgba(255,200,50,0.9))' }}
      />
      {/* Glow layer */}
      <polyline
        points={trail.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="rgba(255,255,150,0.25)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Character ── */
function Character({ pos, isMoving }: { pos: CharPos; isMoving: boolean }) {
  return (
    <div className={`gz-character ${isMoving ? 'gz-character--moving' : ''}`} style={{
      left: `${pos.x}%`,
      top: `${pos.y}%`,
    }}>
      {/* Shadow */}
      <div className="gz-char-shadow" />
      {/* Body */}
      <div className="gz-char-body">
        <span className="gz-char-emoji">🧗</span>
      </div>
      {/* Glow ring */}
      <div className="gz-char-glow" />
    </div>
  );
}

/* ── Hover Ripple ── */
function HoverRipple({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="gz-ripple-wrap">
      <div className="gz-ripple gz-ripple-1" />
      <div className="gz-ripple gz-ripple-2" />
      <div className="gz-ripple gz-ripple-3" />
    </div>
  );
}

export default function GameZone({
  charPos, trail, confettiDate, glowPulse, isMoving, hoveredDate, month, onMove,
}: Props) {
  const zoneRef = useRef<HTMLDivElement>(null);

  const getRelPos = useCallback((clientX: number, clientY: number) => {
    const el = zoneRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const pos = getRelPos(e.clientX, e.clientY);
    if (pos) onMove(pos.x, pos.y);
  }, [getRelPos, onMove]);

  /* Touch drag */
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    const pos = getRelPos(t.clientX, t.clientY);
    if (pos) onMove(pos.x, pos.y);
  }, [getRelPos, onMove]);

  return (
    <div
      ref={zoneRef}
      className="gz-zone"
      onClick={handleClick}
      onTouchMove={handleTouchMove}
      style={{ cursor: 'crosshair' }}
    >
      {/* Ambient overlay */}
      <div className="gz-ambient" />

      {/* Animated elements */}
      <Clouds month={month} />
      <Birds month={month} />
      <LightParticles month={month} />

      {/* Trail */}
      <Trail trail={trail} />

      {/* Character */}
      <Character pos={charPos} isMoving={isMoving} />

      {/* Confetti */}
      {confettiDate && (
        <div style={{ position: 'absolute', left: `${charPos.x}%`, top: `${charPos.y}%`, zIndex: 30 }}>
          <Confetti />
        </div>
      )}

      {/* Hover ripple */}
      <HoverRipple active={glowPulse} />

      {/* Controls hint */}
      <div className="gz-hint">
        <span>🕹️ Arrow keys or click to move</span>
      </div>
    </div>
  );
}
