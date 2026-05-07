# Changelog

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
