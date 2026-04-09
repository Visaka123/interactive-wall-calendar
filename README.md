# 🗓️ Wall Calendar — Smart Planner

A highly polished, interactive wall calendar built with **Next.js 16**, **TypeScript**, and **Tailwind CSS v4**. Designed to feel like a hybrid of a physical wall calendar, Excel, and a smart planner.

---
## 🔗 Live Demo  
🎥 Demo Video: [Watch Demo](https://drive.google.com/file/d/1taXGOeT2Hu0sy4luOvAjc636zkD9xEMZ/view?usp=sharing)  

## ✨ Features

### 🖼️ Wall Calendar Aesthetic
- Spiral binding at the top
- Full-bleed hero image per month (12 unique Unsplash photos)
- Smooth curved SVG wave transition from image to calendar grid
- Month + year elegantly overlaid on the wave
- Physical hook detail at the top center

### 🎬 Time Travel Preview (Unique)
- Hover any date for 600ms → floating preview panel appears
- Shows: past notes, range memberships, mood indicator, holiday info
- Long-press on mobile triggers the same panel
- Smooth `fadeSlideUp` animation

### 🎨 Dynamic Theme Generator
- Each month has a curated 3-color palette extracted from its hero image
- Accent colors auto-apply to: selection highlights, tab indicators, badges, range bars
- Context-aware: weekends render in the month's accent color

### 📅 Day Range Selector
- Click once → start date; click again → end date
- Hover preview shows the range before confirming
- Distinct visual states: start (filled circle), end (filled circle), in-between (tinted band)
- Drag to select (Excel-style) — mousedown + mousemove across cells

### 🧠 Smart Range Intelligence
- Automatic insight badges appear above the grid when a range is selected:
  - "⚡ 3-day sprint", "🔥 7-day streak", "🌍 21-day odyssey"
  - "🌴 2 weekends", "💼 5 workdays", "🧠 Productive stretch"

### 📊 Excel Power Mode
- Assign labels to ranges: Work, Study, Travel, Personal, Health, Custom
- Color-coded ranges with per-range notes
- Power tab shows:
  - Total tracked days counter
  - Category breakdown with animated progress bars
  - Full range table with day counts

### 📌 Sticky Notes Layer
- Pin notes to specific dates with custom colors (6 palette options)
- Notes appear as 📌 badge inside date cells
- Visible in Time Travel preview on hover

### 😊 Mood Tracker
- Assign a mood (great/good/neutral/bad/terrible) to any date
- Mood dot appears inside the date cell
- Mood shown in Time Travel preview with color indicator

### 🎞️ Page Flip Animation
- Month navigation triggers a `rotateX` CSS animation
- Smooth 380ms transition with perspective

### 🌙 Context-Aware Dark Mode
- Auto-switches based on system preference OR time of day (after 8pm / before 6am)
- Manual toggle button in the hero image
- Full dark palette across all components

### 💾 Persistence
- All data stored in `localStorage`:
  - `cal-ranges` — date ranges with labels and notes
  - `cal-stickies` — pinned notes
  - `cal-month-notes` — monthly memos
  - `cal-moods` — mood entries

---

## 🏗️ Architecture

```
app/
├── components/
│   ├── Calendar.tsx          # Root orchestrator — wires hooks + layout
│   ├── HeroSection.tsx       # Image, spiral, wave SVG, nav bar
│   ├── CalendarGrid.tsx      # 7-col grid, day headers, insight badges
│   ├── DayCell.tsx           # Individual date cell with all visual states
│   ├── NotesPanel.tsx        # 4-tab panel: Month / Range / Pins / Power
│   └── TimeTravelPreview.tsx # Floating hover preview tooltip
├── hooks/
│   ├── useCalendar.ts        # Navigation, range selection, drag state
│   ├── useNotes.ts           # All data CRUD + localStorage persistence
│   └── useTheme.ts           # Month palette + dark mode logic
├── lib/
│   └── utils.ts              # Grid builder, date math, insights, constants
├── types/
│   └── index.ts              # Shared TypeScript interfaces + enums
├── globals.css               # Tailwind + keyframe animations
├── layout.tsx
└── page.tsx
```

### Design Decisions
- **No external UI libraries** — pure Tailwind + inline styles for pixel-perfect control
- **Hooks-first architecture** — `useCalendar`, `useNotes`, `useTheme` are fully independent and testable
- **Monday-first grid** — matches the reference image (MON → SUN)
- **Inline styles for dynamic values** — theme colors are runtime values, not compile-time Tailwind classes
- **Single `Calendar.tsx` orchestrator** — avoids prop-drilling by keeping state at one level and passing down

---

## 🚀 Getting Started

```bash
cd calendar-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for production
```bash
npm run build
npm start
```

---

## 📱 Responsive Behavior

| Breakpoint | Layout |
|---|---|
| Mobile (`< md`) | Stacked: Hero → Notes → Calendar |
| Desktop (`≥ md`) | Side-by-side: Notes (256px) \| Calendar (flex-1) |

---

## 🎮 How to Use

1. **Navigate months** — Prev / Next buttons or Today shortcut
2. **Select a range** — Click start date, click end date (or drag across cells)
3. **Save a range** — Go to Range tab in Notes, pick a label, add a note, click Save
4. **Pin a note** — Go to Pins tab, pick a date, write text, choose color, click Pin
5. **Track mood** — In Pins tab, pick a date and click a mood emoji
6. **View insights** — Select any range to see smart badges above the grid
7. **Power mode** — Go to Power tab for category breakdown and totals
8. **Time Travel** — Hover any date for 600ms to see its full story
9. **Dark mode** — Click 🌙 in the top-right of the hero image
