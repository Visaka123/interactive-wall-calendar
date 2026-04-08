'use client';
import { useState, useEffect } from 'react';
import { MONTH_DATA } from '../lib/utils';

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  dark: boolean;
}

export function useTheme(month: number) {
  const [dark, setDark] = useState(false);

  // Auto dark mode based on system + time
  useEffect(() => {
    const check = () => {
      const hour = new Date().getHours();
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDark(prefersDark || hour >= 20 || hour < 6);
    };
    check();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', check);
    return () => mq.removeEventListener('change', check);
  }, []);

  const palette = MONTH_DATA[month].palette;

  const theme: Theme = {
    primary:   palette[0],
    secondary: palette[1],
    accent:    palette[2],
    dark,
  };

  return { theme, dark, setDark };
}
