'use client';
import { useState, useRef, useCallback } from 'react';
import type { StickyNote, DateRange, MoodEntry } from '../types';
import { MOOD_COLORS } from '../types';
import { getHoliday, isWeekend } from '../lib/utils';
import TimeTravelPreview from './TimeTravelPreview';
import type { Theme } from '../hooks/useTheme';

interface Props {
  date: string;
  isToday: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isOtherMonth?: boolean;
  theme: Theme;
  stickies: StickyNote[];
  ranges: DateRange[];
  mood: MoodEntry['mood'] | null;
  onMouseDown: (date: string) => void;
  onMouseEnter: (date: string) => void;
  onMouseUp: () => void;
  onClick: (date: string) => void;
  onHover: (date: string | null) => void;
}

export default function DayCell({
  date, isToday, isRangeStart, isRangeEnd, isInRange,
  theme, stickies, ranges, mood,
  onMouseDown, onMouseEnter, onMouseUp, onClick, onHover,
}: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dayNum = parseInt(date.split('-')[2], 10);
  const holiday = getHoliday(date);
  const weekend = isWeekend(date);
  const hasSticky = stickies.length > 0;
  const hasRange = ranges.length > 0;

  const accentColor = theme.secondary;

  // Background logic
  let cellBg = 'transparent';
  let cellColor = theme.dark ? '#e2e8f0' : '#2d2010';
  let borderRadius = '10px';
  let fontWeight = '400';

  if (isRangeStart && isRangeEnd) {
    cellBg = accentColor;
    cellColor = 'white';
    borderRadius = '50%';
    fontWeight = '700';
  } else if (isRangeStart) {
    cellBg = accentColor;
    cellColor = 'white';
    borderRadius = '50% 0 0 50%';
    fontWeight = '700';
  } else if (isRangeEnd) {
    cellBg = accentColor;
    cellColor = 'white';
    borderRadius = '0 50% 50% 0';
    fontWeight = '700';
  } else if (isInRange) {
    cellBg = `${accentColor}28`;
    borderRadius = '0';
  } else if (isToday) {
    cellBg = 'transparent';
    fontWeight = '800';
  }

  if (weekend && !isRangeStart && !isRangeEnd && !isInRange) {
    cellColor = theme.dark ? '#93c5fd' : accentColor;
  }

  const handleMouseEnter = useCallback(() => {
    onHover(date);
    onMouseEnter(date);
    hoverTimer.current = setTimeout(() => setShowPreview(true), 600);
  }, [date, onHover, onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setShowPreview(false);
  }, [onHover]);

  // Touch long-press for mobile preview
  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => setShowPreview(true), 600);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    setTimeout(() => setShowPreview(false), 2000);
  }, []);

  return (
    <div
      className="relative flex justify-center items-center select-none"
      style={{ padding: '2px 0' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`${date}${isToday ? ', today' : ''}${holiday ? `, ${holiday}` : ''}`}
        className="relative flex flex-col items-center justify-center cursor-pointer transition-all duration-150 hover:scale-110 active:scale-95"
        style={{
          width: 46, height: 46,
          background: cellBg,
          color: cellColor,
          borderRadius,
          fontWeight,
          fontSize: 15,
          outline: isToday && !isRangeStart && !isRangeEnd
            ? `2px solid ${accentColor}`
            : 'none',
          outlineOffset: 2,
          userSelect: 'none',
        }}
        onMouseDown={() => onMouseDown(date)}
        onMouseEnter={() => onMouseEnter(date)}
        onMouseUp={onMouseUp}
        onClick={() => onClick(date)}
        onKeyDown={e => e.key === 'Enter' && onClick(date)}
      >
        <span style={{ lineHeight: 1 }}>{dayNum}</span>

        {/* Indicator dots row */}
        <div className="flex gap-0.5 mt-0.5" style={{ height: 5 }}>
          {holiday && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" title={holiday} />
          )}
          {mood && (
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: MOOD_COLORS[mood] }} />
          )}
          {hasSticky && (
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          )}
          {hasRange && !isRangeStart && !isRangeEnd && (
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: ranges[0].color }} />
          )}
        </div>
      </div>

      {/* Sticky note tags inside cell */}
      {hasSticky && stickies.slice(0, 1).map(s => (
        <div
          key={s.id}
          className="absolute -top-1 -right-1 text-xs px-1 rounded-sm font-bold z-10 pointer-events-none"
          style={{
            background: s.color,
            color: '#1e293b',
            fontSize: 8,
            maxWidth: 32,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          📌
        </div>
      ))}

      {/* Time Travel Preview */}
      {showPreview && (
        <TimeTravelPreview
          date={date}
          stickies={stickies}
          ranges={ranges}
          mood={mood}
          isToday={isToday}
          dark={theme.dark}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}
