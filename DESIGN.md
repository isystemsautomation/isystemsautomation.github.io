# ISYSTEMS AUTOMATION — design system

Industrial-vendor visual refresh (ABB / Siemens / Emerson reference level). Single stylesheet, square corners, IBM Plex Sans, 1200px container.

## Design tokens

All tokens live at the top of `src/assets/css/isa.css` as CSS custom properties:

| Token | Use |
|---|---|
| `--c-navy-900`, `--c-navy-700` | Hero overlay, footer, page-hero gradient |
| `--c-blue-600`, `--c-blue-500`, `--c-blue-050` | Primary accent, hover, icon tiles |
| `--c-ink-900` … `--c-ink-500` | Headings, body, captions |
| `--c-line`, `--c-surface`, `--c-white` | Borders, tinted sections, cards |
| `--fs-display` … `--fs-caption`, `--fs-stat` | Type scale (responsive below 767px) |
| `--space-section`, `--space-block`, `--space-gap` | Section and block spacing |
| `--container`, `--gutter` | 1200px max width, 24px gutters |
| `--shadow-card`, `--shadow-card-hover`, `--ease` | Card elevation and motion |

Legacy `--brand-*` aliases map to the new tokens for any residual references.

## Typography

- **IBM Plex Sans** self-hosted: 400 (body), **500** (nav, buttons, card titles), 600 (headings).
- Headings: weight 600, `--c-ink-900`, letter-spacing −0.01em on h1/h2.
- `.section-title`: 48×3px blue underline.
- Links in `.prose p`: underlined `--c-blue-600`; elsewhere (nav, cards, headings): no underline.
- `.prose` max-width 720px (~70ch).

## Components

### Header (`partials/header.njk`, `partials/nav.njk`)

- 72px white bar, bottom border; `.is-scrolled` shadow after 8px scroll (script in `base.njk`).
- SVG logo 44px (`assets/img/isystems-automation-logo.svg`); PNG kept for JSON-LD/OG.
- Six top-level nav items from `src/_data/nav.json`; Contact as `.btn.btn--outline` (40px).
- Dropdown panels: white, 2-column, hover (desktop) / `aria-expanded` (touch).
- Mobile ≤1023px: 320px navy slide-in panel.

### Buttons (`.btn`, `.btn--primary`, `.btn--secondary`, `.btn--outline`)

Primary/secondary append chevron-right via `src/_transforms/enhance-html.js`. Hero secondary variant: transparent on dark overlay.

### Hero

- **Home** (`.hero`): min 480px / max 600px or 70vh; photo + left gradient overlay; stat band overlaps by 40px (facts from references page).
- **Inner pages** (`.page-hero`): 280px navy gradient; optional texture photo from first content figure (`enhance-html.js`); breadcrumbs from URL path; optional `subtitle` front-matter styled when present.

### Stat band (`.stat-band`)

Home page only. Four cells from references definition list facts.

### Card grid (`.card-grid`, `.card`)

Replaces `.link-index` and project promo blocks via HTML transform:

- Default cards: icon tile, title, text, chevron link.
- `.card--media`: 16:9 image, caption, body — project listings.
- Icons: Tabler (MIT), mapped in `src/_data/icons.json`, rendered by `src/_includes/macros/icon.njk`.

### Split layout (`.split`, `.split__main`, `.split__aside`)

7fr / 5fr grid; aside holds figure (4:3) or `.panel` fact list.

| Page | Split target |
|---|---|
| `/index.html` | “What we do that others do not” + fact panel |
| `/industries.html`, `/service.html`, `/company.html` | First intro section + fact panel |
| `/service/*`, `/industries/*` | First section: prose left, hero figure right |
| `/contact.html` | Address blocks left, map placeholder right |

Applied in `enhance-html.js` (no changes to generated copy in `content/`).

### Footer (`partials/footer.njk`, `footer-columns.njk`)

`--c-navy-900`, white monochrome logo, five columns (including Contact from `site.json`), bottom legal bar.

### Fact list (`.fact-list`)

Definition lists with `dt`/`dd` in div wrappers — 2-column grid, row separators. Used in references page, stat band source data, and split `.panel`s.

## Files

| File | Role |
|---|---|
| `src/assets/css/isa.css` | All styles (≤40 KB) |
| `src/_transforms/enhance-html.js` | Post-build HTML structure (cards, split, hero, breadcrumbs, buttons) |
| `src/_data/nav.json`, `icons.json`, `site.json` | Navigation, icon map, contact strings |
| `src/_includes/partials/*.njk` | Header, nav, footer |
| `src/_includes/macros/icon.njk` | Tabler SVG macro |
| `.eleventy.js` | Registers `enhance-html` transform |

## Verification

```bash
npm run build && npm run verify
```

Word baseline in `content/_word-baseline.json` updated after nav restructure (removed standalone “Home” link). Layout verify excludes card, split-aside, gallery and map images from the legacy 320px prose-image guard.
