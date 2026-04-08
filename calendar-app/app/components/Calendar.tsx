'use client';
import { useCalendar } from '../hooks/useCalendar';
import { useNotes } from '../hooks/useNotes';
import { useTheme } from '../hooks/useTheme';
import { useGameZone } from '../hooks/useGameZone';
import { monthKey } from '../lib/utils';
import HeroSection from './HeroSection';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import { useRef, useState, useCallback, useEffect } from 'react';

export default function Calendar() {
  const cal   = useCalendar();
  const notes = useNotes();
  const { theme, dark, setDark } = useTheme(cal.month);
  const game  = useGameZone(cal.month);
  const mk = monthKey(cal.year, cal.month);

  const border = dark ? '#2d3748' : '#e0d5c5';
  const cardBg = dark ? '#1a202c' : '#fefcf8';

  /* ── Mouse-physics tilt ── */
  const cardRef    = useRef<HTMLDivElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const [tilt, setTilt]         = useState({ x: 0, y: 0 });
  const [isTilting, setIsTilting] = useState(false);
  const rafRef     = useRef<number | null>(null);
  const targetRef  = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const animate = useCallback(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.08);
    currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.08);
    setTilt({ x: currentRef.current.x, y: currentRef.current.y });
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [animate]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    targetRef.current = { x: dy * 3.5, y: dx * 2.5 };
    setIsTilting(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetRef.current = { x: 0, y: 0 };
    setIsTilting(false);
  }, []);

  const ropeAngle = tilt.y * 0.6;

  /* Wire day click → game zone */
  const handleDayClick = useCallback((date: string) => {
    cal.handleDayClick(date);
    game.onDateSelect(date);
  }, [cal, game]);

  /* Wire hover → game zone */
  const handleHover = useCallback((date: string | null) => {
    cal.setHovered(date);
    game.onDateHover(date);
  }, [cal, game]);

  if (!notes.hydrated) {
    return (
      <div className="wall-bg min-h-screen flex items-center justify-center">
        <div className="wall-texture" />
        <div className="text-5xl animate-bounce relative z-10">🗓️</div>
      </div>
    );
  }

  return (
    <div className="wall-bg min-h-screen relative" style={{ paddingBottom: 52 }}>
      <div className="wall-texture" />

      {/* Ambient window light — top left warm */}
      <div className="fixed pointer-events-none" style={{ top: 0, left: 0, width: '45vw', height: '55vh', background: 'radial-gradient(ellipse at 0% 0%, rgba(255,235,180,0.30) 0%, rgba(230,210,160,0.10) 40%, transparent 65%)', zIndex: 1 }} />

      {/* Lamp glow — bottom right */}
      <div className="fixed pointer-events-none" style={{ bottom: '8%', right: '4%', width: '30vw', height: '40vh', background: 'radial-gradient(ellipse at 100% 100%, rgba(255,210,130,0.22) 0%, transparent 60%)', zIndex: 1 }} />

      {/* Left wall — hanging plant / decoration */}
      <div className="fixed hidden xl:block pointer-events-none" style={{ top: '8%', left: '2%', zIndex: 3 }}>
        {/* Wicker basket planter */}
        <div style={{ width: 80, height: 90, position: 'relative' }}>
          {/* Rope */}
          <div style={{ width: 2, height: 28, background: 'linear-gradient(to bottom,#8a6a3a,#6a4a20)', margin: '0 auto', borderRadius: 2 }} />
          {/* Basket */}
          <div style={{ width: 70, height: 55, background: 'linear-gradient(135deg,#c8a060,#a07840)', borderRadius: '8px 8px 18px 18px', margin: '0 auto', boxShadow: '2px 4px 12px rgba(0,0,0,0.25)', overflow: 'hidden', position: 'relative' }}>
            {/* Weave lines */}
            {[0,1,2,3,4].map(i => <div key={i} style={{ height: 2, background: 'rgba(0,0,0,0.15)', marginTop: i === 0 ? 8 : 9 }} />)}
            {/* Greenery */}
            <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 32, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🌿</div>
          </div>
        </div>
      </div>

      {/* Right wall — light wood shelf with objects */}
      <div className="fixed hidden xl:block pointer-events-none" style={{ top: '14%', right: '1.5%', zIndex: 3 }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', marginBottom: 3 }}>
          {/* Books — light spines */}
          {[['#8B4513','58px'],['#2F6B3A','42px'],['#1a4a8a','50px'],['#8B6914','44px'],['#5a3a6a','36px']].map(([c,h],i) => (
            <div key={i} style={{ width: 13, height: h, background: `linear-gradient(to right, ${c}, rgba(255,255,255,0.12), ${c})`, borderRadius: '1px 1px 0 0', boxShadow: '2px 0 4px rgba(0,0,0,0.25), inset 1px 0 0 rgba(255,255,255,0.15)' }}>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.25)', marginTop: 6 }} />
            </div>
          ))}
          {/* Small white pot with plant */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 20, filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))' }}>🌱</div>
            <div style={{ width: 18, height: 20, background: 'linear-gradient(to bottom, #f0ece4, #e0dcd4)', borderRadius: '2px 2px 4px 4px', boxShadow: '1px 2px 5px rgba(0,0,0,0.18)' }} />
          </div>
        </div>
        {/* Shelf — light wood */}
        <div style={{ width: 110, height: 12, background: 'linear-gradient(to bottom,#c8a870,#b89050)', borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,240,200,0.4)' }} />
        {/* Brackets */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 6px' }}>
          {[0,1].map(i => <div key={i} style={{ width: 8, height: 18, background: 'linear-gradient(to bottom,#b89050,#9a7840)', borderRadius: '0 0 2px 2px', boxShadow: '1px 2px 4px rgba(0,0,0,0.2)' }} />)}
        </div>
      </div>

      {/* ── Main hanging scene ── */}
      <div
        ref={wrapRef}
        className="relative flex flex-col items-center"
        style={{ paddingTop: 30, zIndex: 10 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Nail */}
        <div className="flex flex-col items-center" style={{ zIndex: 60 }}>
          <div className="wall-nail" />
          <div className="nail-shadow" />
        </div>

        {/* Rope SVG */}
        <div className="relative w-full flex justify-center" style={{ height: 68, marginTop: -13, zIndex: 50, transform: `rotate(${ropeAngle}deg)`, transformOrigin: 'top center', transition: 'transform 0.1s ease' }}>
          <svg width="100%" height="68" viewBox="0 0 1000 68" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
            <path d="M 500,2 Q 360,22 195,60" stroke="#7a6040" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 500,2 Q 360,22 195,60" stroke="rgba(220,185,120,0.45)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 500,4 Q 362,24 197,62" stroke="rgba(0,0,0,0.22)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 500,2 Q 640,22 805,60" stroke="#7a6040" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 500,2 Q 640,22 805,60" stroke="rgba(220,185,120,0.45)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 500,4 Q 642,24 807,62" stroke="rgba(0,0,0,0.22)" strokeWidth="3" fill="none" strokeLinecap="round" />
            {[0.18,0.36,0.54,0.72,0.88].map((t,i) => {
              const x = 500*(1-t) + 195*t + (360-500)*2*t*(1-t);
              const y = 2*(1-t)  + 60*t  + 22*2*t*(1-t);
              return <g key={`kl${i}`}><ellipse cx={x} cy={y} rx="3.5" ry="2" fill="#5a4030" opacity="0.6" transform={`rotate(${-35+i*5},${x},${y})`} /><ellipse cx={x} cy={y} rx="2" ry="1" fill="rgba(220,185,120,0.4)" transform={`rotate(${-35+i*5},${x},${y})`} /></g>;
            })}
            {[0.18,0.36,0.54,0.72,0.88].map((t,i) => {
              const x = 500*(1-t) + 805*t + (640-500)*2*t*(1-t);
              const y = 2*(1-t)  + 60*t  + 22*2*t*(1-t);
              return <g key={`kr${i}`}><ellipse cx={x} cy={y} rx="3.5" ry="2" fill="#5a4030" opacity="0.6" transform={`rotate(${35-i*5},${x},${y})`} /><ellipse cx={x} cy={y} rx="2" ry="1" fill="rgba(220,185,120,0.4)" transform={`rotate(${35-i*5},${x},${y})`} /></g>;
            })}
            <circle cx="500" cy="2" r="5" fill="none" stroke="#8a7050" strokeWidth="2.5" />
            <circle cx="500" cy="2" r="5" fill="none" stroke="rgba(255,220,150,0.4)" strokeWidth="1" />
          </svg>
        </div>

        {/* ── Calendar Card ── */}
        <div
          ref={cardRef}
          className={`calendar-card w-full ${isTilting ? 'is-tilting' : 'calendar-sway'}`}
          style={{
            maxWidth: 1020,
            background: cardBg,
            border: `1px solid ${border}`,
            marginTop: -10,
            transform: isTilting
              ? `perspective(1600px) rotateX(${2.5 - tilt.x * 0.8}deg) rotateY(${tilt.y}deg) rotate(${tilt.y * 0.15}deg)`
              : undefined,
          }}
        >
          {/* Rope hook brackets */}
          <div className="absolute top-0 left-0 right-0 flex justify-between pointer-events-none" style={{ zIndex: 35, paddingLeft: '19.5%', paddingRight: '19.5%', marginTop: -7 }}>
            {[0,1].map(i => (
              <div key={i} style={{ width: 18, height: 12, background: 'linear-gradient(to bottom,#6B5335,#4a3820)', borderRadius: '3px 3px 0 0', boxShadow: '0 -2px 5px rgba(0,0,0,0.35)' }} />
            ))}
          </div>

          {/* Hero + Spiral + Nav */}
          <HeroSection
            month={cal.month} year={cal.year} theme={theme}
            onPrev={() => cal.navigate(-1)} onNext={() => cal.navigate(1)}
            onToday={cal.goToToday} dark={dark}
            onToggleDark={() => setDark(d => !d)}
            charPos={game.charPos}
            trail={game.trail}
            confettiDate={game.confettiDate}
            glowPulse={game.glowPulse}
            isMoving={game.isMoving}
            hoveredDate={game.hoveredDate}
            rewardDays={game.rewardDays}
            onGameMove={game.moveTo}
          />

          {/* Body */}
          <div className="flex flex-col lg:flex-row" style={{ borderTop: `1px solid ${border}` }}>
            <div className="lg:w-72 flex-shrink-0 border-b lg:border-b-0 lg:border-r" style={{ borderColor: border, background: dark ? '#1a202c' : '#fdf8f0', minHeight: 500 }}>
              <NotesPanel
                year={cal.year} month={cal.month}
                rangeStart={cal.rangeStart} rangeEnd={cal.rangeEnd}
                ranges={notes.ranges} stickies={notes.stickies} theme={theme}
                monthNote={notes.getMonthNote(mk)}
                onMonthNoteChange={text => notes.setMonthNote(mk, text)}
                onAddRange={notes.addRange} onUpdateRange={notes.updateRange}
                onRemoveRange={notes.removeRange} onAddSticky={notes.addSticky}
                onRemoveSticky={notes.removeSticky} onSetMood={notes.setMood}
                onClearRange={cal.clearRange}
              />
            </div>
            <div className="flex-1" style={{ background: dark ? '#1e2533' : '#fffdf9', minHeight: 500 }}>
              <CalendarGrid
                year={cal.year} month={cal.month}
                rangeStart={cal.rangeStart} rangeEnd={cal.rangeEnd}
                hovered={cal.hovered} theme={theme}
                ranges={notes.ranges} stickies={notes.stickies} moods={notes.moods}
                onDayClick={handleDayClick}
                onDragStart={cal.handleDragStart} onDragEnter={cal.handleDragEnter}
                onDragEnd={cal.handleDragEnd} onHover={handleHover}
                flipping={cal.flipping}
              />
            </div>
          </div>
        </div>

        {/* Floor shadow */}
        <div style={{ width: '85%', maxWidth: 900, height: 28, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.30) 0%, transparent 70%)', filter: 'blur(10px)', marginTop: 4 }} />
      </div>
    </div>
  );
}
