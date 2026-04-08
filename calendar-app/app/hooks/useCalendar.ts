'use client';
import { useState, useCallback, useRef } from 'react';
import { fmt } from '../lib/utils';

export function useCalendar() {
  const now = new Date();
  const [year,       setYear]       = useState(now.getFullYear());
  const [month,      setMonth]      = useState(now.getMonth());
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd,   setRangeEnd]   = useState<string | null>(null);
  const [hovered,    setHovered]    = useState<string | null>(null);
  const [flipping,   setFlipping]   = useState<'prev' | 'next' | null>(null);

  // Drag state — tracked via ref to avoid stale closures
  const isDragging  = useRef(false);
  const dragAnchor  = useRef<string | null>(null);
  const dragMoved   = useRef(false); // did the drag actually move to another cell?

  const navigate = useCallback((dir: -1 | 1) => {
    setFlipping(dir === -1 ? 'prev' : 'next');
    setTimeout(() => {
      const d = new Date(year, month + dir, 1);
      setYear(d.getFullYear());
      setMonth(d.getMonth());
      setFlipping(null);
    }, 380);
  }, [year, month]);

  const goToToday = useCallback(() => {
    const n = new Date();
    setYear(n.getFullYear());
    setMonth(n.getMonth());
  }, []);

  /* ── Click-based range selection ──────────────────────────────────────────
     1st click  → set start, clear end
     2nd click  → set end (order-corrected)
     3rd click  → reset to new start
  ─────────────────────────────────────────────────────────────────────────── */
  const handleDayClick = useCallback((date: string) => {
    // If drag moved cells, don't also fire click
    if (dragMoved.current) return;

    setRangeStart(prev => {
      if (!prev || (prev && rangeEnd !== null)) {
        // Start fresh
        setRangeEnd(null);
        return date;
      }
      // Second click — set end
      const [lo, hi] = date < prev ? [date, prev] : [prev, date];
      setRangeStart(lo);
      setRangeEnd(hi);
      return lo;
    });
  }, [rangeEnd]);

  /* ── Drag selection ────────────────────────────────────────────────────── */
  const handleDragStart = useCallback((date: string) => {
    isDragging.current  = true;
    dragAnchor.current  = date;
    dragMoved.current   = false;
    setRangeStart(date);
    setRangeEnd(null);
  }, []);

  const handleDragEnter = useCallback((date: string) => {
    if (!isDragging.current || !dragAnchor.current) return;
    if (date === dragAnchor.current) return;
    dragMoved.current = true;
    const [lo, hi] = date < dragAnchor.current ? [date, dragAnchor.current] : [dragAnchor.current, date];
    setRangeStart(lo);
    setRangeEnd(hi);
  }, []);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
    // Reset dragMoved after a tick so click handler can check it
    setTimeout(() => { dragMoved.current = false; }, 50);
  }, []);

  const clearRange = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  const today = fmt(new Date());

  return {
    year, month, today,
    rangeStart, rangeEnd, hovered, setHovered,
    handleDayClick, navigate, goToToday, clearRange,
    handleDragStart, handleDragEnter, handleDragEnd,
    flipping,
  };
}
