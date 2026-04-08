'use client';
import { useState, useEffect, useCallback } from 'react';
import type { DateRange, StickyNote, MonthNote, MoodEntry, RangeLabel } from '../types';
import { LABEL_COLORS } from '../types';

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }
  catch { return fallback; }
}

function save<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function useNotes() {
  const [ranges,      setRanges]      = useState<DateRange[]>([]);
  const [stickies,    setStickies]    = useState<StickyNote[]>([]);
  const [monthNotes,  setMonthNotes]  = useState<MonthNote[]>([]);
  const [moods,       setMoods]       = useState<MoodEntry[]>([]);
  const [hydrated,    setHydrated]    = useState(false);

  useEffect(() => {
    setRanges(load('cal-ranges', []));
    setStickies(load('cal-stickies', []));
    setMonthNotes(load('cal-month-notes', []));
    setMoods(load('cal-moods', []));
    setHydrated(true);
  }, []);

  // ── Ranges ──────────────────────────────────────────────────────────────────
  const addRange = useCallback((start: string, end: string, label: RangeLabel = 'Personal', note = '') => {
    const [lo, hi] = start <= end ? [start, end] : [end, start];
    const entry: DateRange = {
      id: `${lo}-${hi}-${Date.now()}`,
      start: lo, end: hi,
      label, color: LABEL_COLORS[label], note,
    };
    setRanges(prev => { const next = [...prev, entry]; save('cal-ranges', next); return next; });
    return entry.id;
  }, []);

  const updateRange = useCallback((id: string, patch: Partial<DateRange>) => {
    setRanges(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...patch, color: LABEL_COLORS[(patch.label ?? r.label) as RangeLabel] } : r);
      save('cal-ranges', next);
      return next;
    });
  }, []);

  const removeRange = useCallback((id: string) => {
    setRanges(prev => { const next = prev.filter(r => r.id !== id); save('cal-ranges', next); return next; });
  }, []);

  const getRangesForDate = useCallback((date: string): DateRange[] =>
    ranges.filter(r => date >= r.start && date <= r.end), [ranges]);

  // ── Sticky Notes ────────────────────────────────────────────────────────────
  const addSticky = useCallback((date: string, text: string, color = '#fef08a') => {
    const entry: StickyNote = { id: `${date}-${Date.now()}`, date, text, color };
    setStickies(prev => { const next = [...prev, entry]; save('cal-stickies', next); return next; });
  }, []);

  const updateSticky = useCallback((id: string, text: string) => {
    setStickies(prev => { const next = prev.map(s => s.id === id ? { ...s, text } : s); save('cal-stickies', next); return next; });
  }, []);

  const removeSticky = useCallback((id: string) => {
    setStickies(prev => { const next = prev.filter(s => s.id !== id); save('cal-stickies', next); return next; });
  }, []);

  const getStickiesForDate = useCallback((date: string): StickyNote[] =>
    stickies.filter(s => s.date === date), [stickies]);

  // ── Month Notes ─────────────────────────────────────────────────────────────
  const setMonthNote = useCallback((key: string, text: string) => {
    setMonthNotes(prev => {
      const next = [...prev.filter(n => n.monthKey !== key), ...(text ? [{ monthKey: key, text }] : [])];
      save('cal-month-notes', next);
      return next;
    });
  }, []);

  const getMonthNote = useCallback((key: string): string =>
    monthNotes.find(n => n.monthKey === key)?.text ?? '', [monthNotes]);

  // ── Moods ───────────────────────────────────────────────────────────────────
  const setMood = useCallback((date: string, mood: MoodEntry['mood']) => {
    setMoods(prev => {
      const next = [...prev.filter(m => m.date !== date), { date, mood }];
      save('cal-moods', next);
      return next;
    });
  }, []);

  const getMood = useCallback((date: string): MoodEntry['mood'] | null =>
    moods.find(m => m.date === date)?.mood ?? null, [moods]);

  return {
    hydrated,
    ranges, addRange, updateRange, removeRange, getRangesForDate,
    stickies, addSticky, updateSticky, removeSticky, getStickiesForDate,
    monthNotes, setMonthNote, getMonthNote,
    moods, setMood, getMood,
  };
}
