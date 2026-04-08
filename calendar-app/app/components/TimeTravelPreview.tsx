'use client';
import type { StickyNote, DateRange, MoodEntry } from '../types';
import { MOOD_COLORS, MOOD_EMOJI, LABEL_COLORS } from '../types';
import { getHoliday } from '../lib/utils';

interface Props {
  date: string;
  stickies: StickyNote[];
  ranges: DateRange[];
  mood: MoodEntry['mood'] | null;
  isToday: boolean;
  dark: boolean;
  accentColor: string;
}

export default function TimeTravelPreview({ date, stickies, ranges, mood, isToday, dark, accentColor }: Props) {
  const holiday = getHoliday(date);
  const hasContent = stickies.length > 0 || ranges.length > 0 || mood || holiday || isToday;

  const bg = dark ? 'rgba(15,23,42,0.97)' : 'rgba(255,255,255,0.97)';
  const border = dark ? '#334155' : '#e2e8f0';
  const text = dark ? '#f1f5f9' : '#1e293b';
  const sub = dark ? '#94a3b8' : '#64748b';

  return (
    <div
      className="absolute z-50 rounded-2xl shadow-2xl p-3 w-52 pointer-events-none"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color: text,
        backdropFilter: 'blur(16px)',
        bottom: '110%',
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'fadeSlideUp 0.18s ease',
      }}
      role="tooltip"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: accentColor }}>
          🕰️ {date}
        </span>
        {mood && (
          <span
            className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
            style={{ background: `${MOOD_COLORS[mood]}22`, color: MOOD_COLORS[mood] }}
          >
            {MOOD_EMOJI[mood]} {mood}
          </span>
        )}
      </div>

      {isToday && (
        <div className="text-xs font-semibold mb-1.5 px-2 py-0.5 rounded-full text-center"
          style={{ background: `${accentColor}22`, color: accentColor }}>
          ✨ Today
        </div>
      )}

      {holiday && (
        <div className="text-xs mb-1.5 px-2 py-1 rounded-lg" style={{ background: dark ? '#1e293b' : '#f1f5f9' }}>
          {holiday}
        </div>
      )}

      {ranges.map(r => (
        <div key={r.id} className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
          <span className="text-xs truncate" style={{ color: sub }}>{r.label}{r.note ? `: ${r.note.slice(0, 20)}` : ''}</span>
        </div>
      ))}

      {stickies.map(s => (
        <div
          key={s.id}
          className="text-xs px-2 py-1 rounded-lg mb-1 truncate"
          style={{ background: s.color + '44', borderLeft: `3px solid ${s.color}` }}
        >
          📌 {s.text.slice(0, 30)}
        </div>
      ))}

      {!hasContent && (
        <div className="text-xs text-center py-1" style={{ color: sub }}>No events yet</div>
      )}

      {/* Tooltip arrow */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: -7,
          width: 0, height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: `7px solid ${border}`,
        }}
      />
    </div>
  );
}
