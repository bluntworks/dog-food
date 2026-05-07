# Changelog

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
