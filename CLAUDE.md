# Vyom — public marketing website

Frontend only. A separate backend service comes later and should need to touch
**only** `src/lib/api.ts`.

Read `DESIGN.md` before changing anything visual. The design file
`design/Vyom Home Screen.html` is the source of truth for the look; the build brief is
the source of truth for content, structure and rules. If the two conflict, ask.

## Stack

- **Next.js** (App Router) with `output: 'export'` — static export, hosted free on
  Cloudflare Pages. No server runtime: no route handlers, no middleware, no ISR,
  no `next/image` loader that needs a server (`images.unoptimized: true`).
- **TypeScript**, strict.
- **Tailwind CSS** v4 — tokens defined once in `@theme`, mirrored as CSS variables.
- **Fonts** via `next/font/google`: Instrument Sans (400, 500, 600, 700),
  IBM Plex Mono (400, 500). No other font source.
- **Icons** are inline SVG components in `src/components/icons`. No icon package.
- **Charts** are plain SVG/CSS. No chart library.
- **Radix UI** primitives only where accessibility needs them (navigation menu, dialog).
- **Ask before adding any other dependency.**
- No analytics, cookies, trackers or third-party form services. Ever.

## Commands

```
npm run dev        # local dev server
npm run build      # static export to ./out — must pass with zero errors
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run check      # typecheck + lint + build
```

## Folder structure

```
src/
  app/                    routes only; page.tsx files stay thin
    products/[slug]/      cases, literature, audit, reports, signal, os
  components/
    ui/                   Button, Chip, Eyebrow, Card, Section, Container,
                          StatCard, ProgressBar
    site/                 Header, MegaMenu, Footer, NoticeBar, Logo,
                          StarfieldBackground
    mocks/                CaseRunPanel, CaseQueue, LiteratureFunnel,
                          VendorScorecard, ReportOutline, SignalBoard,
                          ArchitectureDiagram
    icons/                inline SVG icon components
  content/                site.ts, home.ts, products.ts, platform.ts, company.ts
  lib/                    api.ts, utils
site.config.ts            flags and placeholders
```

## Content rules — non-negotiable

1. **Never invent** customers, logos, testimonials, partnerships, certifications,
   funding or results. If we do not have it, it does not go on the site.
2. **Every number is one of exactly three things:**
   - a **sourced market fact** — the source is shown in small mono text
     (`SOURCE · DELOITTE`);
   - a **target** — labelled as such (`(target)`, `DESIGN TARGETS`);
   - **sample data** — labelled with a `SAMPLE DATA` chip.
   A number that is none of these does not belong on the site.
3. **Sample screens use only fictional identifiers**: drug codes `VY-201`, `VY-305`,
   `VY-412`, case ids `VY-CASE-xxxx`, and `Vendor A`. Vendor A is marked `(FICTIONAL)`.
4. **Never name a competitor.** Compare against "services firms" and
   "software platforms" only.
5. **The Concept preview notice bar** is controlled by one flag in `site.config.ts`
   (`showNotice`).
6. **All copy lives in typed content files** under `src/content/`. Components render
   content; they never hold it. `products.ts` has a `flagship` setting, default `"cases"`.
7. **Placeholders stay visibly marked** — `[YOUR EMAIL]` and friends live in
   `site.config.ts` and keep their brackets until the owner replaces them.
8. Blue accent means **AI activity**. Amber means **a human or physician decision**.
   Never mix them.
9. **Indian English** spelling, as in the design: "hospitalised", "signal",
   "programme" where it occurs.

## Quality bar

- Matches the design at 1440px; works at 375px and 768px with **no horizontal scroll**.
  Wide tables scroll inside their own box.
- Accessible: semantic landmarks, real buttons and links, visible focus states,
  labelled form fields, 4.5:1 text contrast, `aria-label` on icon-only controls,
  `prefers-reduced-motion` respected.
- Motion: only a subtle fade-and-rise on scroll, and the hero case-run steps appearing
  in sequence once. Nothing loops forever.
- SEO: per-page title and description, Open Graph image, `sitemap.xml`, `robots.txt`.
  **While `site.config.ts` has `indexable: false` (the default), every page emits
  `<meta name="robots" content="noindex">` and `robots.txt` disallows everything.**
- `npm run build`, `npm run typecheck` and `npm run lint` pass with zero errors.

## Working agreement

After each phase: run the build, take Playwright screenshots at 375, 768 and 1440px,
compare against the design, fix the differences, then commit with a clear message.
