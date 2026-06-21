# Reader

The reader is the chapter-viewing experience at `/read/[slug]`. It supports three reading modes (single-page, long-strip, webtoon), a VIP paywall on chapters beyond the free limit, and silent reading-history tracking.

---

## File layout

```
src/
├─ app/
│  ├─ read/[slug]/page.tsx           # Server route — query, VIP gate, render
│  └─ api/history/route.ts           # POST /api/history — progress tracking
└─ components/reader/
   ├─ reader.tsx                     # Client — full reading UI
   └─ vip-gate.tsx                   # Client — paywall screen
```

---

## Data flow

```
URL: /read/<chapterSlug>
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│ src/app/read/[slug]/page.tsx          (RSC, dynamic)         │
│  1. prisma.chapter.findUnique({ where:{slug}, include:{       │
│        manga { id, slug, title, type, chapters{...} },        │
│        images{...} } })                                      │
│  2. Increment chapter.views (atomic)                          │
│  3. If chapter.number > 3 AND user is not VIP → VipGate      │
│  4. Else → <Reader .../>                                      │
└──────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│ src/components/reader/reader.tsx          ("use client")     │
│  State: mode, currentPage, zoom, gap, fullscreen,             │
│         showUI, showSettings, loadedPages, progress           │
│  • IntersectionObserver tracks currentPage in long-strip      │
│  • Keyboard nav (←/→/F/Esc/S)                                 │
│  • Auto-hide UI on idle (3 s)                                 │
│  • POST /api/history on currentPage change                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Component API

### `<Reader />` — `src/components/reader/reader.tsx`

```ts
interface ReaderProps {
  manga:        { id: string; slug: string; title: string; type: string };
  chapter:      { id: string; number: number; title: string | null; slug: string };
  pages:        { id: string; pageNumber: number; imageUrl: string; width: number; height: number }[];
  prevChapter:  { slug: string; number: number; title: string | null } | null;
  nextChapter:  { slug: string; number: number; title: string | null } | null;
  allChapters:  { id: string; number: number; slug: string; title: string | null }[];
}
```

`width` / `height` are normalized in the page route (`i.width || 800`, `i.height || 1200`) so the client can rely on them.

#### Reading modes

| Mode           | Default for                  | Layout                                                    |
| -------------- | ---------------------------- | --------------------------------------------------------- |
| `single`       | `Manga`, `Manhua`            | One image at a time; click zones (left/right thirds), `←`/`→` |
| `long-strip`   | `Webtoon`, `Manhwa`          | Vertical scroll, all pages stacked                        |
| `webtoon`      | (manual)                     | Same as long-strip but narrower (`max-w-2xl` vs `max-w-3xl`) |

Default mode is set in a `useEffect` based on `manga.type` and can be overridden by the user via the settings popover.

#### Keyboard shortcuts

| Key            | Action                                |
| -------------- | ------------------------------------- |
| `←` / `→`      | Previous / next page (or chapter at boundaries) |
| `F`            | Toggle fullscreen                     |
| `S`            | Toggle settings popover               |
| `Esc`          | Close settings                        |

Shortcuts are ignored when an `<input>` has focus.

#### UI auto-hide

`mousemove` on `window` resets a 3 s timer; on expiry the top header (and page indicator in single mode) fade out. Settings popover stays open regardless.

---

### `<VipGate />` — `src/components/reader/vip-gate.tsx`

Shown when `chapter.number > FREE_CHAPTER_LIMIT` (default **3**) and the user is not VIP.

```ts
interface VipGateProps {
  mangaSlug:     string;
  mangaTitle:    string;
  chapterNumber: number;
  isLoggedIn:    boolean;
}
```

Renders a centered card with:
- Animated crown + lock badge
- "VIP EXCLUSIVE" badge
- Chapter & manga context line ("Chapter X of <Title> is reserved for VIP members. The first 3 chapters are free for everyone.")
- Lifetime price (`6,900₮`)
- 4 benefits list
- **Get VIP** → `/vip`
- **Sign in** (only when `!isLoggedIn`) → `/login?callbackUrl=/manga/<slug>`
- **Back to manga** → `/manga/<slug>`

The component is `"use client"` (uses `framer-motion`'s `motion`) but doesn't manage local state — props are enough.

---

## VIP gate logic

Implemented in `src/app/read/[slug]/page.tsx`:

```ts
const FREE_CHAPTER_LIMIT = 3;
// ...
const isLocked = chapter.number > FREE_CHAPTER_LIMIT && !userIsVip;
```

`userIsVip` is true when **any** of:

- `user.role === "ADMIN"`, **or**
- `user.vip === true` AND (`vipExpiresAt` is `null` OR `vipExpiresAt > now`)

The free-chapter count is per-chapter-`number`, **not** per-chapter-`id`. Chapters within the first 3 by `number` are always free. After chapter 3, even an unpublished-cascade or a guest must be VIP. `published: false` chapters return `notFound()` regardless.

---

## History API

`POST /api/history` — `src/app/api/history/route.ts`

```ts
// request
{ mangaId: string, chapterId: string, page: number }
```

Behavior:
- **Unauthenticated requests succeed silently** (`{ success: true }`) — the reader can `fetch` without crashing for guests.
- Authenticated requests insert a new `ReadingHistory` row keyed by `userId` (no upsert, no de-dup — every page change appends).
- Returns `{ success: true }`.

The reader fires this on every `currentPage` change in long-strip mode (via the IntersectionObserver) and on every click/keyboard nav in single mode.

> **Caveat:** the current implementation creates a row per page-turn. For long chapters this writes many rows. If retention becomes a concern, switch to an upsert keyed on `(userId, chapterId)` so only the latest page is kept. See "Extending" below.

---

## Prisma models used

From `prisma/schema.prisma`:

- **`Chapter`** — `number` (`Float`, so `1.5` for half-chapters), `slug` (unique), `published`, `views`, `mangaId`, `pages: ChapterPage[]`
- **`ChapterPage`** — `chapterId`, `pageNumber`, `imageUrl`, optional `width`/`height`
- **`Manga`** — `type` (`"Manga" | "Manhwa" | "Manhua" | "Webtoon"`) drives default mode
- **`User`** — `vip`, `vipExpiresAt`, `role` gate the paywall
- **`ReadingHistory`** — `(userId, chapterId, page, readAt)` — written by `/api/history`

Indexes that matter:
- `Chapter @@index([mangaId, number])` — for prev/next lookup
- `ChapterPage @@index([chapterId, pageNumber])` — page order query
- `ReadingHistory @@index([userId, readAt])` — "continue reading" queries

---

## Performance notes

- `dynamic = "force-dynamic"` on the page so view counts are always fresh.
- Pages 1–3 of a chapter use `loading="eager"`, the rest `loading="lazy"` — first paint is immediate.
- `next.config.mjs` should serve `imageUrl` hosts via `images.remotePatterns` if you want `<Image>`; the current implementation uses raw `<img>` (with an eslint-disable per image) for simplicity. Swap in `next/image` if you need automatic optimization.
- `pageRefs` is a `Map` outside React state — mutations don't re-render, keeping scroll-to-page snappy.
- `setLoadedPages` is a `Set<number>` add-only — sized by chapter page count, not by re-renders.

---

## Theming & UX details

- **Top bar** is `fixed`, `backdrop-blur-xl`, `bg-background/80` — works over both light and dark manga pages.
- **Progress bar** under the top bar tracks `(currentPage / pages.length) * 100`.
- **Single-mode** uses `bg-black/95` for the canvas and a circular page indicator at the bottom.
- **Webtoon mode** narrows the column to `max-w-2xl` (vs `max-w-3xl` for long-strip) — typical for scroll-vertical color comics.
- All buttons reuse `@/components/ui/button` (Radix + CVA). Icons are `lucide-react`.
- The reader intentionally hides the global `<SiteHeader />` / `<SiteFooter />` — only the lock screen keeps a minimal sticky header with a back button.

---

## Keyboard & a11y

- All icon buttons have `aria-label`.
- `Escape` closes the settings popover (and Radix handles focus restoration).
- The reader disables image dragging (`draggable={false}`) to prevent accidental drag-to-save.
- `next/image` is not used; the `<img>` tags carry meaningful `alt={`Page N`}` for screen readers.

No specific reduced-motion handling — `framer-motion` animations are short (≤ 0.4 s) and the IntersectionObserver-driven progress bar uses CSS transitions only.

---

## Extending the reader

### Add a new reading mode

1. Add the literal to `type ReadingMode = "single" | "long-strip" | "webtoon" | "..."`.
2. Add a button in the settings grid (3-column → consider 4-column).
3. Branch the render in `reader.tsx` (copy the `(mode === "long-strip" || ...)` block).

### Track only the latest page per chapter

Replace the insert in `/api/history`:

```ts
// upsert by (userId, chapterId) — keeps history table small
await prisma.readingHistory.upsert({
  where: { userId_chapterId: { userId, chapterId } }, // requires @@unique
  update: { page, readAt: new Date() },
  create:  { userId, mangaId, chapterId, page },
});
```

Add `@@unique([userId, chapterId])` on `ReadingHistory` and run `prisma db push`.

### Change the free-chapter limit

Edit `FREE_CHAPTER_LIMIT` in `src/app/read/[slug]/page.tsx`. To make it per-manga, store a `freeChapterCount` on `Manga` and read it in the gate.

### Swap `<img>` for `next/image`

Add `images.remotePatterns` for each image host in `next.config.mjs`, then change `<img>` → `<Image src={page.imageUrl} width={page.width} height={page.height} ... />`. Remember to import `Image from "next/image"`.

### Add per-page preloading

In `reader.tsx`, before each `<img>` render a hidden `<link rel="preload" as="image" href={pages[currentPage]?.imageUrl} />` (and the next/prev page in single mode). Skip for long-strip — the browser's lazy loader is fine.

---

## Known limitations

- History writes one row per page turn — switch to upsert if storage is a concern (see "Extending").
- No offline / service worker support — refresh loses scroll position in long-strip mode unless you persist `currentPage` to `localStorage` and restore on mount.
- No "fit to width" / "fit to height" toggle — only a percent slider (50–100 %).
- VIP gate compares against `chapter.number`, so a manga published with `number = 4` as its first chapter will be paid-only.