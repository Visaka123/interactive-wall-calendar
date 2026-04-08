'use client';
import { useMemo } from 'react';
import { buildGrid, getRangeInsights, today as getToday } from '../lib/utils';
import type { DateRange, StickyNote, MoodEntry } from '../types';
import type { Theme } from '../hooks/useTheme';
import DayCell from './DayCell';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

interface Props {
  year: number;
  month: number;
  rangeStart: string | null;
  rangeEnd: string | null;
  hovered: string | null;
  theme: Theme;
  ranges: DateRange[];
  stickies: StickyNote[];
  moods: MoodEntry[];
  onDayClick: (date: string) => void;
  onDragStart: (date: string) => void;
  onDragEnter: (date: string) => void;
  onDragEnd: () => void;
  onHover: (date: string | null) => void;
  flipping: 'prev' | 'next' | null;
}

export default function CalendarGrid({
  year, month, rangeStart, rangeEnd, hovered, theme,
  ranges, stickies, moods,
  onDayClick, onDragStart, onDragEnter, onDragEnd, onHover,
  flipping,
}: Props) {
  const grid = useMemo(() => buildGrid(year, month), [year, month]);
  const todayStr = getToday();

  // Effective end for hover preview
  const effectiveEnd = rangeEnd ?? hovered;

  const isInRange = (date: string) => {
    if (!rangeStart || !effectiveEnd) return false;
    const [lo, hi] = rangeStart <= effectiveEnd ? [rangeStart, effectiveEnd] : [effectiveEnd, rangeStart];
    return date > lo && date < hi;
  };

  const insights = useMemo(() => {
    if (rangeStart && rangeEnd) return getRangeInsights(rangeStart, rangeEnd);
    return [];
  }, [rangeStart, rangeEnd]);

  const accentColor = theme.secondary;
  const dark = theme.dark;

  return (
    <div className="flex flex-col h-full">
      {/* Range insights badges */}
      {insights.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pt-3 pb-1">
          {insights.map((ins, i) => (
            <span
              key={i}
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: `${ins.color}22`, color: ins.color, border: `1px solid ${ins.color}44` }}
            >
              {ins.icon} {ins.label}
            </span>
          ))}
        </div>
      )}

      {/* Day headers */}
      <div
        className="grid grid-cols-7 px-4 pt-4 pb-2"
        style={{
          borderBottom: `1px solid ${dark ? '#2d3748' : '#e8ddd0'}`,
        }}
      >
        {DAYS.map(d => (
          <div
            key={d}
            className="text-center text-xs font-black py-1.5 tracking-widest"
            style={{
              color: d === 'SAT' || d === 'SUN'
                ? accentColor
                : dark ? '#718096' : '#b0a090',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-7 px-4 pb-4 flex-1"
        style={{
          animation: flipping ? (flipping === 'next' ? 'flipOut 0.38s ease forwards' : 'flipIn 0.38s ease forwards') : 'flipIn 0.38s ease',
          transformOrigin: 'top center',
          gap: '4px 0',
        }}
        onMouseLeave={onDragEnd}
        onMouseUp={onDragEnd}
      >
        {grid.map((dateStr, i) => {
          if (!dateStr) return <div key={`pad-${i}`} />;

          const cellRanges = ranges.filter(r => dateStr >= r.start && dateStr <= r.end);
          const cellStickies = stickies.filter(s => s.date === dateStr);
          const cellMood = moods.find(m => m.date === dateStr)?.mood ?? null;
          const isStart = rangeStart === dateStr;
          const isEnd = (rangeEnd ?? hovered) === dateStr && rangeStart !== null;

          return (
            <DayCell
              key={dateStr}
              date={dateStr}
              isToday={dateStr === todayStr}
              isRangeStart={isStart}
              isRangeEnd={isEnd && !isStart}
              isInRange={isInRange(dateStr)}
              theme={theme}
              stickies={cellStickies}
              ranges={cellRanges}
              mood={cellMood}
              onMouseDown={onDragStart}
              onMouseEnter={onDragEnter}
              onMouseUp={onDragEnd}
              onClick={onDayClick}
              onHover={onHover}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="flex flex-wrap gap-3 px-4 py-2 text-xs border-t"
        style={{ borderColor: dark ? '#2d3748' : '#e8ddd0', color: dark ? '#718096' : '#a09080' }}
      >
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Holiday</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Note</span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block border-2" style={{ borderColor: accentColor }} /> Today
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: accentColor }} /> Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-6 h-3 inline-block rounded" style={{ background: `${accentColor}28` }} /> Range
        </span>
      </div>
    </div>
  );
}
