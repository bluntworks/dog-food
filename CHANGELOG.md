# Changelog

## 2026-05-07 — Image flexibility + dev fixes

### Added
- `data-hero-image-url`, `data-hero-image-alt`, `data-hero-image-position`,
  `data-hero-image-fit` host attributes (and matching Duda Widget Builder
  properties) — site owner can pick a hero image, anchor the focal point
  (`top` / `center` / `bottom` / `left` / `right` / arbitrary CSS), and
  choose `cover` vs `contain` fit. Position and fit are applied as inline
  styles so any CSS value works.
- `public/hero.png` (Nature & Nourish product mock) wired into the dev page
  as the default hero image for local previews.
- Frosted-white result card surface when the hero is an image, so calc
  results stay legible over any photo (`backdrop-filter: blur`).

### Changed
- When a hero image is set, the right panel is now image-only (no headline
  / subtext overlay). The SVG-bowl + headline fallback still renders when
  no image URL is present.
- Dev server config rooted at the project root with `server.open` pointing
  at `/dev/index.html`, so `/src/main.ts` resolves cleanly.

## 2026-05-07 — Nature & Nourish redesign

### Changed
- Repalette to match natureandnourish.dog: mint outer panel, white inner card,
  forest-green type, leaf-green pill CTA. All colours exposed as CSS custom
  properties (`--dfc-*`) so a host can override per-instance.
- Two-column layout (form left, hero/result right) at ≥760px; stacks below.
- Inputs reorganised: breed (with autocomplete from spec breed list), banded
  age dropdown, numeric weight stay visible. Activity / body condition /
  spay-neuter moved into a "More about your dog" expander for progressive
  reveal.
- Result panel replaces the hero illustration on submit. Mode toggle is now
  a pill-button pair; "How we got this" steps collapsed by default.
- Inline SVG bowl illustration (~0.5 KB) as default hero — site owner can
  swap by replacing the panel image later.

### Added
- `data-heading`, `data-subheading`, `data-cta-label` attributes (and
  matching Duda Widget Builder properties).
- Banded-age → numeric-tier mapping (`puppy` / `1-2` / `3-5` / `6-8` / `9+`)
  picked to land unambiguously inside the spec's FCT thresholds.

### Bundle
- 14 KB JS / 4.6 KB gzipped, 5 KB CSS / 1.6 KB gzipped.

## 2026-05-07

### Added
- Initial scaffolding for the Dog Food Calculator Duda widget.
- 1:1 TypeScript port of the Python reference in `spec/dogfoodcalc.docx`:
  pure domain logic in `src/calc/` (types, breed groups, adjustments, FCT/NEM
  computation), with discriminated-union inputs and named exports per global
  TS guidelines. Known spec quirks (duplicate breeds across groups,
  exact-match breed lookup) are preserved and documented.
- Vanilla-TS widget UI in `src/ui/` — auto-mounts on `[data-dogfood-calc]`,
  reads `data-*` attributes for site-owner config, scoped CSS, MutationObserver
  for dynamic Duda re-renders.
- Vite dev host at `dev/index.html` simulating a Duda page.
- Three build modes: `pnpm dev` (HMR), `pnpm build` (IIFE + CSS pair for
  generic Duda HTML/Embed blocks), `pnpm build:duda` (packages
  `widget.{html,css,js,json}` for the Duda Widget Builder).
- Bundle size: 9 KB JS / 3.2 KB gzipped.
