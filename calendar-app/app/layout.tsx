import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wall Calendar — Smart Planner',
  description: 'Interactive wall calendar with range selection, notes, mood tracking, and Excel power mode',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
