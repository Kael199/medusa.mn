# AkiraScans — Manga Reader Site

A polished, modern manga reader site inspired by asurascans.com with a clean **white / red / blue** design system.

## 📁 Files

```
manga-site/
├── index.html      ← Page structure (hero, top 10, daily 4, latest chapters, newsletter, footer)
├── styles.css      ← Full design system, responsive layout, animations, dark mode
├── data.js         ← Manga content (titles, ratings, covers, chapters)
└── script.js       ← All interactions: search, filters, sliders, drawer, theme toggle, toasts
```

## 🚀 How to run

Just open `index.html` in any modern browser. No build step required.

```bash
# Windows
start index.html

# Or right-click index.html → "Open with browser"
```

For a nicer experience (and to avoid file:// restrictions on some features), serve it locally:

```bash
# Python
python -m http.server 5500

# Node
npx serve .

# Then visit http://localhost:5500
```

## ✨ Features

### Layout
- **Sticky navbar** with logo, primary nav, expandable search, theme toggle, sign-in/join
- **Sub-nav genre chips** (All / Action / Romance / Fantasy / etc.)
- **Hero section** with rotating featured manga (auto-rotates every 5s)
- **Top 10 Reading** — ranked list with rating, trend arrows, hover reveals
- **Daily 4 Manga** — editor's picks, one per mood (THRILL / WARMTH / INTENSE / COZY)
- **Last Chapters** — grid + list view toggle, filter pills, load-more button
- **Newsletter** with gradient card
- **Footer** with brand, socials, link columns, legal row

### Design system
- Pure white/red/blue palette (`#e63946` red, `#1d4ed8` blue)
- Gradient brand logo
- Soft shadows, rounded corners, glass blur on sticky nav
- Bricolage Grotesque for headings, Plus Jakarta Sans for body

### Interactions
- 🔍 **Live search** with keyboard nav (↑/↓/Enter) and `/` shortcut
- 🌗 **Theme toggle** with localStorage persistence
- 📱 **Mobile drawer** with slide-in animation and scrim
- 🎠 **Hero carousel** with auto-rotate + manual dots
- 🪟 **Grid ↔ List** view toggle for latest chapters
- 🏷️ **Genre / range / type filters** with active states
- 🌊 **Scroll progress bar** at top
- 🔔 **Toast notifications** for actions
- 👁️ **Reveal-on-scroll** for cards (IntersectionObserver)
- 💧 **Click ripple** on buttons
- ⌨️ **Keyboard shortcuts** (`/` focus search, `Esc` close drawer)
- ♿ **Reduced-motion** respected
- 📱 **Fully responsive** down to 375px

### Performance
- Zero external images (CSS gradient covers) → instant load
- IntersectionObserver for lazy reveal
- Debounced scroll handlers via `passive: true`
- Web fonts loaded with `display: swap`
- ~50KB total (HTML + CSS + JS uncompressed)

## 🎨 Customize

- **Colors**: edit CSS variables at the top of `styles.css` (`--red-500`, `--blue-600`, etc.)
- **Manga data**: edit `data.js` — `TOP_MANGA`, `DAILY_PICKS`, `CHAPTERS`, `HERO_SLIDES`
- **Palette covers**: each manga uses a `palette` key like `'red-blue'`, `'fire'`, `'ocean'`, `'royal'` — see `palettes` object in `data.js` for all options

Enjoy! 📚