'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export interface CharPos { x: number; y: number; }
export interface TrailPoint { x: number; y: number; id: number; }

function seeded(seed: number, min: number, max: number) {
  const x = Math.sin(seed + 1) * 10000;
  return min + (x - Math.floor(x)) * (max - min);
}

export function useGameZone(month: number) {
  const [charPos, setCharPos]       = useState<CharPos>({ x: 50, y: 60 });
  const [trail, setTrail]           = useState<TrailPoint[]>([]);
  const [confettiDate, setConfettiDate] = useState<string | null>(null);
  const [activatedDates, setActivatedDates] = useState<Set<string>>(new Set());
  const [hoveredDate, setHoveredDate]   = useState<string | null>(null);
  const [glowPulse, setGlowPulse]       = useState(false);
  const [isMoving, setIsMoving]         = useState(false);
  const trailIdRef = useRef(0);
  const moveRafRef = useRef<number | null>(null);
  const targetPosRef = useRef<CharPos>({ x: 50, y: 60 });
  const currentPosRef = useRef<CharPos>({ x: 50, y: 60 });

  /* Reward dates — seeded per month so stable */
  const rewardDates = useRef<Set<number>>(new Set(
    Array.from({ length: 5 }, (_, i) => Math.floor(seeded(i * 7 + month * 3, 1, 28)))
  ));

  /* Smooth lerp movement */
  const animateMove = useCallback(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const dx = targetPosRef.current.x - currentPosRef.current.x;
    const dy = targetPosRef.current.y - currentPosRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0.15) {
      currentPosRef.current.x = lerp(currentPosRef.current.x, targetPosRef.current.x, 0.07);
      currentPosRef.current.y = lerp(currentPosRef.current.y, targetPosRef.current.y, 0.07);
      setCharPos({ x: currentPosRef.current.x, y: currentPosRef.current.y });

      /* Add trail point every ~8px */
      if (dist > 8) {
        trailIdRef.current++;
        const id = trailIdRef.current;
        setTrail(prev => [...prev.slice(-18), { x: currentPosRef.current.x, y: currentPosRef.current.y, id }]);
      }
      setIsMoving(true);
      moveRafRef.current = requestAnimationFrame(animateMove);
    } else {
      setIsMoving(false);
    }
  }, []);

  const moveTo = useCallback((x: number, y: number) => {
    const cx = Math.max(5, Math.min(95, x));
    const cy = Math.max(8, Math.min(88, y));
    targetPosRef.current = { x: cx, y: cy };
    if (moveRafRef.current) cancelAnimationFrame(moveRafRef.current);
    moveRafRef.current = requestAnimationFrame(animateMove);
  }, [animateMove]);

  /* Arrow key movement */
  useEffect(() => {
    const STEP = 4;
    const keys: Record<string, boolean> = {};
    let raf: number;

    const tick = () => {
      let { x, y } = targetPosRef.current;
      if (keys['ArrowLeft'])  x -= STEP;
      if (keys['ArrowRight']) x += STEP;
      if (keys['ArrowUp'])    y -= STEP;
      if (keys['ArrowDown'])  y += STEP;
      if (keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown']) {
        moveTo(x, y);
      }
      raf = requestAnimationFrame(tick);
    };

    const down = (e: KeyboardEvent) => {
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
        e.preventDefault();
        keys[e.key] = true;
      }
    };
    const up = (e: KeyboardEvent) => { keys[e.key] = false; };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      cancelAnimationFrame(raf);
    };
  }, [moveTo]);

  /* Date selected → character jumps to mapped position */
  const onDateSelect = useCallback((dateStr: string) => {
    const day = parseInt(dateStr.split('-')[2], 10);
    /* Map day 1-31 to a path across the image */
    const t = (day - 1) / 30;
    const x = 10 + t * 80;
    const y = 25 + Math.sin(t * Math.PI * 2) * 25 + 20;
    moveTo(x, y);

    setActivatedDates(prev => new Set([...prev, dateStr]));

    /* Reward check */
    if (rewardDates.current.has(day)) {
      setConfettiDate(dateStr);
      setTimeout(() => setConfettiDate(null), 3200);
    }
  }, [moveTo]);

  /* Hover → glow pulse */
  const onDateHover = useCallback((dateStr: string | null) => {
    setHoveredDate(dateStr);
    if (dateStr) {
      setGlowPulse(true);
      setTimeout(() => setGlowPulse(false), 700);
    }
  }, []);

  /* Month change → reset trail + reposition */
  useEffect(() => {
    setTrail([]);
    setActivatedDates(new Set());
    moveTo(50, 60);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  return {
    charPos, trail, confettiDate, activatedDates,
    hoveredDate, glowPulse, isMoving,
    moveTo, onDateSelect, onDateHover,
    rewardDays: rewardDates.current,
  };
}
