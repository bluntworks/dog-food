# Dog Food Calculator — installing on your Duda site

This package contains a self-contained "feeding planner" widget you can drop
into any Duda page. It asks the visitor a few questions about their dog and
shows their daily energy needs and food portion.

There are two ways to install it. **Option A** is the cleaner long-term option
if your Duda plan supports it; **Option B** works on every Duda plan.

---

## Option A — Upload as a Duda Widget (recommended)

> Requires a Duda plan that includes **Widget Builder** (Agency / Business+).
> If you don't see "Develop" or "Widget Builder" inside Duda, use Option B.

1. Log in to Duda → top right account menu → **Develop** → **Widget Builder**.
2. Click **+ Create Widget** → **Upload widget**.
3. Upload **`dogfoodcalc-widget-builder.zip`** (the file attached alongside
   this document).
4. Once it appears in your widget list, open any page in the editor.
5. Drag the **Dog Food Calculator** widget onto the page where you'd like it
   (the *Feeding Guide* page is a good fit).
6. Click the widget to open its **Content** panel on the right. You'll see
   these editable properties:

   | Property | What it does |
   |---|---|
   | Heading text | The big title above the form |
   | Subheading text | The sentence below the heading |
   | Button label | The CTA button copy (default: "Calculate daily portion") |
   | Hero image URL | Image shown in the right-hand panel — use the picker to choose from your Duda media library |
   | Hero image alt text | For screen readers / SEO |
   | Image focal point | Where to anchor the image when cropped (Top / Center / Bottom / Left / Right) |
   | Image fit | "Cover" fills the panel and crops; "Contain" shows the whole image |
   | Food energy density (kcal/kg) | Default 1345 — change to match the food you sell |
   | Kibble energy density (kcal/kg) | Same, for the kibble-mix mode |
   | Food share in mixed mode (%) | Default 80 — split between fresh food and kibble |
   | Default serving mode | Which mode the visitor sees first |
   | Allow visitors to switch modes | Show/hide the Food / Food + Kibble toggle |

7. Hit **Publish**. Done.

---

## Option B — Paste-in HTML embed (works on any Duda plan)

This route uses Duda's regular **HTML widget** to embed a small snippet. No
Widget Builder access required.

### B-1. Upload the two widget files to Duda

1. In the Duda editor, open **Site → Site Files** (or the **Files** section
   inside any page's HTML widget — it gives you a media-library URL).
2. Upload these two files from `dogfoodcalc-embed/`:
   - `dogfoodcalc.iife.js`
   - `dogfoodcalc.css`
3. After upload, copy each file's URL. They'll look something like
   `https://irp.cdn-website.com/.../dogfoodcalc.iife.js`.

### B-2. Add the widget to your page

1. Open the page where you want the calculator (e.g. *Feeding Guide*).
2. Drag a **HTML** widget onto the page.
3. Click it → **Edit HTML** → paste the snippet below.
4. **Replace the two `https://YOUR-DUDA-CDN/...` URLs** with the ones you
   copied in step B-1.
5. *(Optional)* If you want a custom hero image, upload it to Duda's media
   library, copy that URL, and paste it into the `data-hero-image-url`
   attribute. Leave it blank to use the built-in illustration.
6. Save → Publish.

```html
<link rel="stylesheet" href="https://YOUR-DUDA-CDN/dogfoodcalc.css">

<div
  data-dogfood-calc
  data-heading="Build your dog's feeding plan"
  data-subheading="Tell us a bit about your dog and we'll work out their daily energy needs."
  data-cta-label="Calculate daily portion"
  data-hero-image-url=""
  data-hero-image-alt="A happy dog"
  data-hero-image-position="center"
  data-hero-image-fit="cover"
  data-food-kcal-per-kg="1345"
  data-kibble-kcal-per-kg="1345"
  data-food-split-percent="80"
  data-default-mode="mixed"
  data-enable-mixed-mode="true"
></div>

<script src="https://YOUR-DUDA-CDN/dogfoodcalc.iife.js" defer></script>
```

> Tip: every attribute on the `<div>` is optional. Delete any line you don't
> need and the default kicks in.

---

## Customising later

Whichever option you used, **you don't need to re-upload anything to change
the heading, image, or kcal values** — just edit the property (Option A) or
the `data-*` attribute (Option B). The widget reads its config every time the
page loads.

## What visitors see

- A friendly form on the left (breed, age range, weight, plus optional
  activity / body condition / spay-neuter under "More about your dog").
- A hero image (or built-in illustration) on the right.
- After hitting **Calculate**, the right panel shows the daily energy need
  in kcal, the recommended grams of food, and a "How we got this"
  breakdown.

## Troubleshooting

- **Widget appears but is unstyled** — the `<link>` to `dogfoodcalc.css`
  isn't loading. Open browser DevTools → Network tab → look for a 404 on
  the CSS file, and double-check the URL.
- **Widget doesn't appear at all** — JS file URL is wrong or the
  `<script>` tag was removed. The console will show a `404` on
  `dogfoodcalc.iife.js`.
- **Image is cropped weirdly** — try **Image fit: Contain** in the
  property panel, or change **Image focal point**.

## Questions

If anything looks wrong, send a screenshot of the live page and the URL —
happy to help.
