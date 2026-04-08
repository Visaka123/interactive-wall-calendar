export const fmt = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const parseDate = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const today = (): string => fmt(new Date());

export const monthKey = (year: number, month: number): string =>
  `${year}-${String(month + 1).padStart(2, '0')}`;

/** Monday-first 6-week grid. null = padding cell */
export function buildGrid(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const startPad = (first.getDay() + 6) % 7; // Mon=0
  const cells: (string | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(fmt(new Date(year, month, d)));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function daysBetween(a: string, b: string): number {
  return Math.round(Math.abs(parseDate(b).getTime() - parseDate(a).getTime()) / 86400000) + 1;
}

export function isWeekend(dateStr: string): boolean {
  const d = parseDate(dateStr).getDay();
  return d === 0 || d === 6;
}

export function countWeekends(start: string, end: string): number {
  const [lo, hi] = start <= end ? [start, end] : [end, start];
  let count = 0;
  const cur = parseDate(lo);
  const endD = parseDate(hi);
  while (cur <= endD) {
    if (cur.getDay() === 0 || cur.getDay() === 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export interface RangeInsight {
  icon: string;
  label: string;
  color: string;
}

export function getRangeInsights(start: string, end: string): RangeInsight[] {
  const [lo, hi] = start <= end ? [start, end] : [end, start];
  const total = daysBetween(lo, hi);
  const weekends = countWeekends(lo, hi);
  const weekdays = total - weekends;
  const insights: RangeInsight[] = [];

  if (total === 1) insights.push({ icon: '📍', label: 'Single day', color: '#6366f1' });
  else if (total <= 3) insights.push({ icon: '⚡', label: `${total}-day sprint`, color: '#f59e0b' });
  else if (total <= 7) insights.push({ icon: '🔥', label: `${total}-day streak`, color: '#ef4444' });
  else if (total <= 14) insights.push({ icon: '🚀', label: `${total}-day journey`, color: '#8b5cf6' });
  else insights.push({ icon: '🌍', label: `${total}-day odyssey`, color: '#0ea5e9' });

  if (weekends > 0) insights.push({ icon: '🌴', label: `${weekends} weekend${weekends > 1 ? 's' : ''}`, color: '#10b981' });
  if (weekdays >= 5) insights.push({ icon: '💼', label: `${weekdays} workdays`, color: '#6366f1' });
  if (total >= 7 && weekdays >= 5) insights.push({ icon: '🧠', label: 'Productive stretch', color: '#0ea5e9' });

  return insights;
}

export const HOLIDAYS: Record<string, string> = {
  '01-01': "🎆 New Year's Day",
  '02-14': "💝 Valentine's Day",
  '03-17': "🍀 St. Patrick's Day",
  '04-01': "🃏 April Fools'",
  '05-01': "✊ Labour Day",
  '06-21': "☀️ Summer Solstice",
  '07-04': "🎇 Independence Day",
  '08-15': "🙏 Assumption Day",
  '10-31': "🎃 Halloween",
  '11-11': "🎖️ Veterans Day",
  '12-25': "🎄 Christmas",
  '12-31': "🥂 New Year's Eve",
};

export function getHoliday(dateStr: string): string | null {
  const [, m, d] = dateStr.split('-');
  return HOLIDAYS[`${m}-${d}`] ?? null;
}

export const MONTH_DATA: Record<number, { url: string; palette: string[]; label: string }> = {
  0:  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85', palette: ['#1e3a5f','#2563eb','#93c5fd'], label: 'Mountain Summit' },
  1:  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', palette: ['#0f2027','#0f766e','#5eead4'], label: 'Misty Mountains' },
  2:  { url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=900&q=80', palette: ['#14532d','#15803d','#86efac'], label: 'Spring Bloom' },
  3:  { url: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&q=80', palette: ['#0c4a6e','#0369a1','#7dd3fc'], label: 'April Showers' },
  4:  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80', palette: ['#052e16','#166534','#4ade80'], label: 'Forest Path' },
  5:  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80', palette: ['#0c4a6e','#0284c7','#38bdf8'], label: 'Summer Shore' },
  6:  { url: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=900&q=80', palette: ['#451a03','#b45309','#fcd34d'], label: 'Golden Fields' },
  7:  { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80', palette: ['#2e1065','#7c3aed','#c4b5fd'], label: 'Late Summer' },
  8:  { url: 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=900&q=80', palette: ['#431407','#c2410c','#fdba74'], label: 'Autumn Colors' },
  9:  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80', palette: ['#3b0764','#7e22ce','#d8b4fe'], label: 'Fall Foliage' },
  10: { url: 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&q=80', palette: ['#1c1917','#44403c','#d6d3d1'], label: 'First Snow' },
  11: { url: 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=900&q=80', palette: ['#0f172a','#1e3a5f','#60a5fa'], label: 'Winter Nights' },
};
