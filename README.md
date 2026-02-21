# ✨ Power Hour

> A premium faith-based daily planning PWA inspired by "Power Hour - Plan with God" by Diacre Bayishime

![Power Hour](public/icons/icon.svg)

## Overview

Power Hour is a beautifully designed Progressive Web App that combines daily planning with spiritual practice. It helps you:

- 🌅 **Start each day with intention** - Set your morning prayer and daily priorities
- ⏰ **Plan your hours** - Block time for what matters most
- 🌙 **End with gratitude** - Reflect on your day and count your blessings
- 📖 **Stay inspired** - Daily scripture verses to guide your journey
- 🎯 **Track your goals** - Long-term goals and daily habits

## Design Philosophy

Inspired by Jony Ive's design principles:
- Ultra-minimalist white space
- Refined typography using Inter font
- Soft shadows and gentle gradients
- Smooth micro-animations with Framer Motion
- Premium feel like Apple Notes meets Things 3

## Features

### Daily Power Hour
The core planning ritual:
- **Morning Intention** - What do you want to accomplish?
- **Morning Prayer** - Commit your day to God
- **Top 3 Priorities** - Focus on what matters most
- **Time Blocks** - Plan your hours with a visual timeline
- **Evening Reflection** - Review how the day went
- **Gratitude** - List 3 things you're thankful for

### Weekly View
- See your whole week at a glance
- Track completed priorities
- View weekly statistics

### Goals & Habits
- Set goals across categories: Spiritual, Personal, Professional, Health, Relationships
- Track daily habits with streak counts
- Visual progress indicators

### Scripture & Inspiration
- Daily verse that changes each day
- 30+ curated scriptures
- Save your favorites
- Share verses with friends
- Search by theme

### Settings
- Light/Dark/System theme
- Customize workday hours
- Export/Import data backup
- Clear all data

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Database:** IndexedDB via Dexie.js
- **PWA:** next-pwa for offline support
- **Language:** TypeScript

## Local-First Architecture

All data is stored locally in IndexedDB:
- No account required
- Works offline
- Your data stays on your device
- Export/import for backup

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or navigate to the project
cd power-hour

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

### PWA Installation

1. Open the app in Chrome/Safari on mobile
2. Tap "Add to Home Screen" in the browser menu
3. The app will install and work offline

## Project Structure

```
power-hour/
├── public/
│   ├── icons/          # PWA icons
│   └── manifest.json   # PWA manifest
├── src/
│   ├── app/            # Next.js pages
│   │   ├── page.tsx    # Today (home)
│   │   ├── week/       # Weekly view
│   │   ├── goals/      # Goals & habits
│   │   ├── inspire/    # Scripture
│   │   └── settings/   # Settings
│   ├── components/     # Reusable UI components
│   └── lib/
│       ├── db.ts       # IndexedDB setup & helpers
│       ├── scriptures.ts # Scripture data
│       └── utils.ts    # Utility functions
└── README.md
```

## Customization

### Adding More Scriptures

Edit `src/lib/scriptures.ts` to add more verses:

```typescript
{
  verse: "Your verse text here",
  reference: "Book Chapter:Verse",
  theme: "category"
}
```

### Changing Colors

The color system is defined in `src/app/globals.css`:
- `--primary` - Main accent color (blue)
- `--gold` - Scripture/spiritual accent
- `--sage` - Success/gratitude accent
- `--lavender` - Prayer accent

### Custom Icons

Replace the icon files in `public/icons/`:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)

Or run the generation script if you have ImageMagick:
```bash
./scripts/generate-icons.sh
```

## Credits

- Book: "Power Hour - Plan with God" by Diacre Bayishime
- Design inspiration: Apple, Things 3, Headspace
- Icons: [Lucide](https://lucide.dev/)
- Font: [Inter](https://rsms.me/inter/)

## License

MIT - Feel free to use and modify for your own spiritual journey.

---

*"Commit your work to the LORD, and your plans will be established."* — Proverbs 16:3
