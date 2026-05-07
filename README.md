# Dog Food Calculator — Duda widget

A drop-in dog energy-needs / food-portion calculator. Ports the Python
reference in [`spec/dogfoodcalc.docx`](spec/dogfoodcalc.docx) to a single
self-contained TypeScript widget that mounts on `[data-dogfood-calc]`.

## Local dev

```sh
pnpm install
pnpm dev          # opens dev/index.html with HMR
```

`dev/index.html` simulates a Duda host page — edit it to test multiple
property combinations.

## Generic embed (any Duda HTML/Embed block)

```sh
pnpm build        # → dist/dogfoodcalc.iife.js + dist/dogfoodcalc.css
```

Paste into a Duda HTML/Embed widget:

```html
<link rel="stylesheet" href="https://your-cdn/dogfoodcalc.css" />
<div
  data-dogfood-calc
  data-food-kcal-per-kg="1345"
  data-kibble-kcal-per-kg="1345"
  data-food-split-percent="80"
  data-default-mode="mixed"
  data-enable-mixed-mode="true"
></div>
<script src="https://your-cdn/dogfoodcalc.iife.js" defer></script>
```

The script auto-mounts every matching `<div>` and re-mounts on DOM mutation,
so it survives Duda's editor re-renders.

## Real Duda Widget Builder package

```sh
pnpm build:duda   # → duda-widget/{widget.html,widget.css,widget.js,widget.json}
```

Zip the `duda-widget/` directory and upload it via the Duda Widget Builder.
Site owners will see the configurable properties (heading, kcal/kg, split %,
mode toggle) in the editor sidebar.

## Project layout

```
spec/                  reference Python implementation (read-only)
src/
  calc/                pure domain logic — no DOM
  ui/                  template, css, mount logic
  main.ts              IIFE entry, auto-scan
scripts/build-duda.ts  packages dist/ into the Duda widget format
dev/index.html         Vite dev host
```

## Notes & known deviations from the spec

The Python spec has a few known issues which are preserved in the 1:1 port:

- `poodle` / `boxer` / `doberman` appear in multiple breed groups; first
  match wins (spec behavior).
- Breed lookup is exact-match on the lowercased input. "Golden retriever
  puppy" won't match "golden retriever".
- Puppies under 1 year are rejected outright.

A second pass will address these in `DEVIATIONS.md`.
