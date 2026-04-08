export type RangeLabel = 'Work' | 'Study' | 'Travel' | 'Personal' | 'Health' | 'Custom';

export interface DateRange {
  id: string;
  start: string; // ISO date string YYYY-MM-DD
  end: string;
  label: RangeLabel;
  color: string;
  note: string;
}

export interface StickyNote {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  color: string;
}

export interface MonthNote {
  monthKey: string; // YYYY-MM
  text: string;
}

export interface MoodEntry {
  date: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
}

export interface CalendarState {
  year: number;
  month: number; // 0-indexed
  rangeStart: string | null;
  rangeEnd: string | null;
  isDragging: boolean;
  dragStart: string | null;
}

export const LABEL_COLORS: Record<RangeLabel, string> = {
  Work:     '#6366f1',
  Study:    '#0ea5e9',
  Travel:   '#f59e0b',
  Personal: '#ec4899',
  Health:   '#10b981',
  Custom:   '#8b5cf6',
};

export const MOOD_COLORS: Record<string, string> = {
  great:    '#10b981',
  good:     '#6366f1',
  neutral:  '#f59e0b',
  bad:      '#f97316',
  terrible: '#ef4444',
};

export const MOOD_EMOJI: Record<string, string> = {
  great: '🌟', good: '😊', neutral: '😐', bad: '😔', terrible: '😢',
};
