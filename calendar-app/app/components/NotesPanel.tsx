'use client';
import { useState } from 'react';
import type { DateRange, StickyNote, RangeLabel, MoodEntry } from '../types';
import { LABEL_COLORS, MOOD_COLORS, MOOD_EMOJI } from '../types';
import { monthKey, daysBetween } from '../lib/utils';
import type { Theme } from '../hooks/useTheme';

const LABELS: RangeLabel[] = ['Work', 'Study', 'Travel', 'Personal', 'Health', 'Custom'];
const STICKY_COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff', '#fed7aa'];
const MOODS: MoodEntry['mood'][] = ['great', 'good', 'neutral', 'bad', 'terrible'];

interface Props {
  year: number;
  month: number;
  rangeStart: string | null;
  rangeEnd: string | null;
  ranges: DateRange[];
  stickies: StickyNote[];
  theme: Theme;
  monthNote: string;
  onMonthNoteChange: (text: string) => void;
  onAddRange: (start: string, end: string, label: RangeLabel, note: string) => void;
  onUpdateRange: (id: string, patch: Partial<DateRange>) => void;
  onRemoveRange: (id: string) => void;
  onAddSticky: (date: string, text: string, color: string) => void;
  onRemoveSticky: (id: string) => void;
  onSetMood: (date: string, mood: MoodEntry['mood']) => void;
  onClearRange: () => void;
}

type Tab = 'month' | 'range' | 'stickies' | 'power';

export default function NotesPanel({
  year, month, rangeStart, rangeEnd, ranges, stickies, theme,
  monthNote, onMonthNoteChange,
  onAddRange, onUpdateRange, onRemoveRange,
  onAddSticky, onRemoveSticky, onSetMood, onClearRange,
}: Props) {
  const [tab, setTab] = useState<Tab>('month');
  const [rangeNote, setRangeNote] = useState('');
  const [rangeLabel, setRangeLabel] = useState<RangeLabel>('Personal');
  const [stickyDate, setStickyDate] = useState('');
  const [stickyText, setStickyText] = useState('');
  const [stickyColor, setStickyColor] = useState(STICKY_COLORS[0]);
  const [moodDate, setMoodDate] = useState('');

  const dark = theme.dark;
  const accent = theme.secondary;
  const mk = monthKey(year, month);

  const bg = dark ? '#1a202c' : '#fdf8f0';
  const surface = dark ? '#2d3748' : '#f5ede0';
  const border = dark ? '#2d3748' : '#e8ddd0';
  const text = dark ? '#e2e8f0' : '#2d2010';
  const sub = dark ? '#718096' : '#8a7060';

  // Power mode stats
  const totalDays = ranges.reduce((acc, r) => acc + daysBetween(r.start, r.end), 0);
  const byLabel = LABELS.reduce((acc, l) => {
    acc[l] = ranges.filter(r => r.label === l).reduce((s, r) => s + daysBetween(r.start, r.end), 0);
    return acc;
  }, {} as Record<string, number>);

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'month',    icon: '📋', label: 'Month' },
    { id: 'range',    icon: '📅', label: 'Range' },
    { id: 'stickies', icon: '📌', label: 'Pins' },
    { id: 'power',    icon: '📊', label: 'Power' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: bg, color: text }}>
      {/* Tab bar */}
      <div className="flex border-b" style={{ borderColor: border }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 py-2.5 text-xs font-semibold transition-all"
            style={{
              color: tab === t.id ? accent : sub,
              borderBottom: tab === t.id ? `2px solid ${accent}` : '2px solid transparent',
              background: 'transparent',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>

        {/* ── Month Notes ── */}
        {tab === 'month' && (
          <>
            <div className="text-xs font-bold mb-3" style={{ color: accent }}>📋 Monthly Memo</div>
            <textarea
              value={monthNote}
              onChange={e => onMonthNoteChange(e.target.value)}
              placeholder={`Write your ${new Date(year, month).toLocaleString('en',{month:'long'})} goals, plans, reflections…`}
              className="w-full resize-none outline-none p-3"
              rows={9}
              style={{
                fontSize: 13,
                lineHeight: '28px',
                background: 'transparent',
                color: text,
                border: 'none',
                backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${border} 27px, ${border} 28px)`,
                backgroundSize: '100% 28px',
                backgroundAttachment: 'local',
                fontFamily: 'inherit',
              }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs" style={{ color: sub }}>{monthNote.length} characters</span>
              {monthNote.length > 0 && (
                <button
                  onClick={() => onMonthNoteChange('')}
                  className="text-xs px-2 py-0.5 rounded-lg transition-all hover:opacity-80"
                  style={{ color: sub, border: `1px solid ${border}` }}
                >
                  Clear
                </button>
              )}
            </div>
          </>
        )}

        {/* ── Range Notes ── */}
        {tab === 'range' && (
          <>
            <div className="text-xs font-bold mb-2" style={{ color: accent }}>📅 Date Range Notes</div>

            {!rangeStart && (
              <div
                className="rounded-xl p-4 mb-3 text-center"
                style={{ background: surface, border: `2px dashed ${border}` }}
              >
                <div className="text-2xl mb-2">📅</div>
                <div className="text-xs font-semibold mb-1" style={{ color: accent }}>Select a Date Range</div>
                <div className="text-xs" style={{ color: sub }}>
                  Click a start date on the calendar, then click an end date to create a range.
                </div>
              </div>
            )}

            {rangeStart && (
              <div className="rounded-xl p-3 mb-3" style={{ background: surface, border: `1px solid ${accent}44` }}>
                <div className="text-xs font-semibold mb-2" style={{ color: accent }}>
                  {rangeEnd ? `✅ Range: ${rangeStart} → ${rangeEnd}` : `📍 Start: ${rangeStart} — now click an end date`}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {LABELS.map(l => (
                    <button
                      key={l}
                      onClick={() => setRangeLabel(l)}
                      className="text-xs px-2 py-0.5 rounded-full font-semibold transition-all"
                      style={{
                        background: rangeLabel === l ? LABEL_COLORS[l] : `${LABEL_COLORS[l]}22`,
                        color: rangeLabel === l ? 'white' : LABEL_COLORS[l],
                        border: `1px solid ${LABEL_COLORS[l]}44`,
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <textarea
                  value={rangeNote}
                  onChange={e => setRangeNote(e.target.value)}
                  placeholder="Note for this range…"
                  className="w-full text-xs resize-none outline-none rounded-lg p-2"
                  rows={3}
                  style={{ background: dark ? '#0f172a' : 'white', color: text, border: `1px solid ${border}` }}
                />

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      if (rangeStart && rangeEnd) {
                        onAddRange(rangeStart, rangeEnd, rangeLabel, rangeNote);
                        setRangeNote('');
                        onClearRange();
                      }
                    }}
                    disabled={!rangeEnd}
                    className="flex-1 text-xs font-bold py-1.5 rounded-lg transition-all hover:scale-105 disabled:opacity-40"
                    style={{ background: accent, color: 'white' }}
                  >
                    Save Range
                  </button>
                  <button
                    onClick={onClearRange}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: surface, color: sub, border: `1px solid ${border}` }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Saved ranges */}
            <div className="space-y-2">
              {ranges.length === 0 && (
                <div className="text-xs text-center py-4" style={{ color: sub }}>
                  Select a date range on the calendar to add notes
                </div>
              )}
              {ranges.map(r => (
                <div
                  key={r.id}
                  className="rounded-xl p-3"
                  style={{ background: surface, border: `1px solid ${r.color}44`, borderLeft: `3px solid ${r.color}` }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: r.color }}>{r.label}</span>
                    <button onClick={() => onRemoveRange(r.id)} className="text-xs hover:text-red-400 transition-colors" style={{ color: sub }}>✕</button>
                  </div>
                  <div className="text-xs" style={{ color: sub }}>{r.start} → {r.end}</div>
                  {r.note && <div className="text-xs mt-1" style={{ color: text }}>{r.note}</div>}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {LABELS.map(l => (
                      <button
                        key={l}
                        onClick={() => onUpdateRange(r.id, { label: l })}
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          background: r.label === l ? LABEL_COLORS[l] : `${LABEL_COLORS[l]}22`,
                          color: r.label === l ? 'white' : LABEL_COLORS[l],
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Sticky Notes ── */}
        {tab === 'stickies' && (
          <>
            <div className="text-xs font-bold mb-2" style={{ color: accent }}>📌 Pin a Note</div>

            <div className="rounded-xl p-3 mb-3" style={{ background: surface, border: `1px solid ${border}` }}>
              <input
                type="date"
                value={stickyDate}
                onChange={e => setStickyDate(e.target.value)}
                className="w-full text-xs rounded-lg px-2 py-1.5 mb-2 outline-none"
                style={{ background: dark ? '#0f172a' : 'white', color: text, border: `1px solid ${border}` }}
              />
              <textarea
                value={stickyText}
                onChange={e => setStickyText(e.target.value)}
                placeholder="Note text…"
                className="w-full text-xs resize-none outline-none rounded-lg p-2 mb-2"
                rows={2}
                style={{ background: dark ? '#0f172a' : 'white', color: text, border: `1px solid ${border}` }}
              />
              <div className="flex gap-1.5 mb-2">
                {STICKY_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setStickyColor(c)}
                    className="w-5 h-5 rounded-full transition-all hover:scale-125"
                    style={{
                      background: c,
                      outline: stickyColor === c ? `2px solid ${accent}` : 'none',
                      outlineOffset: 2,
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  if (stickyDate && stickyText.trim()) {
                    onAddSticky(stickyDate, stickyText.trim(), stickyColor);
                    setStickyText('');
                    setStickyDate('');
                  }
                }}
                className="w-full text-xs font-bold py-1.5 rounded-lg transition-all hover:scale-105"
                style={{ background: accent, color: 'white' }}
              >
                Pin Note
              </button>
            </div>

            {/* Mood tracker */}
            <div className="rounded-xl p-3 mb-3" style={{ background: surface, border: `1px solid ${border}` }}>
              <div className="text-xs font-bold mb-2" style={{ color: accent }}>😊 Mood Tracker</div>
              <input
                type="date"
                value={moodDate}
                onChange={e => setMoodDate(e.target.value)}
                className="w-full text-xs rounded-lg px-2 py-1.5 mb-2 outline-none"
                style={{ background: dark ? '#0f172a' : 'white', color: text, border: `1px solid ${border}` }}
              />
              <div className="flex gap-2 justify-center">
                {MOODS.map(m => (
                  <button
                    key={m}
                    onClick={() => moodDate && onSetMood(moodDate, m)}
                    className="text-xl transition-all hover:scale-125"
                    title={m}
                  >
                    {MOOD_EMOJI[m]}
                  </button>
                ))}
              </div>
            </div>

            {/* Pinned notes list */}
            <div className="space-y-2">
              {stickies.length === 0 && (
                <div className="text-xs text-center py-3" style={{ color: sub }}>No pinned notes yet</div>
              )}
              {stickies.map(s => (
                <div
                  key={s.id}
                  className="rounded-xl p-2.5 flex items-start gap-2"
                  style={{ background: s.color + '44', borderLeft: `3px solid ${s.color}` }}
                >
                  <div className="flex-1">
                    <div className="text-xs font-semibold" style={{ color: sub }}>{s.date}</div>
                    <div className="text-xs mt-0.5" style={{ color: text }}>{s.text}</div>
                  </div>
                  <button onClick={() => onRemoveSticky(s.id)} className="text-xs hover:text-red-400 transition-colors flex-shrink-0" style={{ color: sub }}>✕</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Power Mode ── */}
        {tab === 'power' && (
          <>
            <div className="text-xs font-bold mb-2" style={{ color: accent }}>📊 Excel Power Mode</div>

            <div className="rounded-xl p-3 mb-3" style={{ background: surface, border: `1px solid ${border}` }}>
              <div className="text-xs font-semibold mb-2" style={{ color: sub }}>Total Tracked Days</div>
              <div className="text-3xl font-black" style={{ color: accent }}>{totalDays}</div>
              <div className="text-xs mt-1" style={{ color: sub }}>{ranges.length} range{ranges.length !== 1 ? 's' : ''} saved</div>
            </div>

            {/* Category breakdown */}
            <div className="rounded-xl p-3" style={{ background: surface, border: `1px solid ${border}` }}>
              <div className="text-xs font-semibold mb-3" style={{ color: sub }}>Category Breakdown</div>
              {LABELS.map(l => {
                const days = byLabel[l];
                const pct = totalDays > 0 ? Math.round((days / totalDays) * 100) : 0;
                return (
                  <div key={l} className="mb-2.5">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: LABEL_COLORS[l], fontWeight: 600 }}>{l}</span>
                      <span style={{ color: sub }}>{days}d {pct > 0 ? `(${pct}%)` : ''}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: dark ? '#334155' : '#e2e8f0' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: LABEL_COLORS[l] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* All ranges table */}
            {ranges.length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
                <div className="text-xs font-semibold px-3 py-2" style={{ background: surface, color: sub }}>All Ranges</div>
                {ranges.map((r, i) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-2 px-3 py-2 text-xs"
                    style={{
                      borderTop: i > 0 ? `1px solid ${border}` : 'none',
                      background: i % 2 === 0 ? 'transparent' : (dark ? '#1e293b22' : '#f8fafc'),
                    }}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
                    <span className="flex-1 truncate" style={{ color: text }}>{r.start} → {r.end}</span>
                    <span className="font-bold" style={{ color: r.color }}>{daysBetween(r.start, r.end)}d</span>
                    <button onClick={() => onRemoveRange(r.id)} className="hover:text-red-400 transition-colors" style={{ color: sub }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
