import type { ServingMode } from "../calc/types";

export interface TemplateOptions {
  readonly heading: string;
  readonly subheading: string;
  readonly ctaLabel: string;
  readonly defaultMode: ServingMode;
  readonly enableMixedMode: boolean;
  readonly heroImageUrl: string;
  readonly heroImageAlt: string;
  readonly heroImagePosition: string;
  readonly heroImageFit: "cover" | "contain";
}

/** SVG hero illustration — bowl + kibble. ~0.5 KB inline. */
const HERO_SVG = `
  <svg class="dogfood-calc__hero-illustration" viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <ellipse cx="60" cy="84" rx="46" ry="10" fill="currentColor" opacity="0.12"/>
    <path d="M18 70 Q60 100 102 70 L96 84 Q60 102 24 84 Z" fill="currentColor"/>
    <ellipse cx="60" cy="68" rx="42" ry="9" fill="currentColor" opacity="0.5"/>
    <circle cx="48" cy="64" r="4" fill="currentColor"/>
    <circle cx="62" cy="66" r="5" fill="currentColor"/>
    <circle cx="76" cy="63" r="3.5" fill="currentColor"/>
    <circle cx="55" cy="60" r="3" fill="currentColor"/>
    <circle cx="70" cy="60" r="2.5" fill="currentColor"/>
    <path d="M40 32 q4 -10 10 0 M58 26 q4 -10 10 0 M76 32 q4 -10 10 0 M30 44 q4 -10 10 0" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6"/>
  </svg>
`;

/**
 * Returns the static markup for a single widget instance.
 * Field IDs are namespaced per-instance.
 */
export const renderTemplate = (id: string, opts: TemplateOptions): string => {
  return `
    <div class="dogfood-calc__header">
      <h2>${escapeHtml(opts.heading)}</h2>
      <p>${escapeHtml(opts.subheading)}</p>
    </div>

    <div class="dogfood-calc__layout">
      <form class="dogfood-calc__form" id="${id}-form" novalidate>
        <div class="dogfood-calc__grid">
          <div class="dogfood-calc__field dogfood-calc__field--full">
            <label for="${id}-breed">Your dog's breed</label>
            <input id="${id}-breed" data-field="breed" type="text" list="${id}-breed-list" placeholder="e.g. cockapoo" autocomplete="off" />
            <datalist id="${id}-breed-list"></datalist>
          </div>

          <div class="dogfood-calc__field">
            <label for="${id}-age">Your dog's age</label>
            <select id="${id}-age" data-field="age">
              <option value="puppy">Under 1 year</option>
              <option value="1-2" selected>1–2 years</option>
              <option value="3-5">3–5 years</option>
              <option value="6-8">6–8 years</option>
              <option value="9+">9+ years</option>
            </select>
          </div>

          <div class="dogfood-calc__field">
            <label for="${id}-weight">Your dog's weight (kg)</label>
            <input id="${id}-weight" data-field="weight" type="number" min="0.5" step="0.1" placeholder="e.g. 12" required />
          </div>
        </div>

        <div class="dogfood-calc__more" data-more>
          <button type="button" class="dogfood-calc__more-toggle" data-more-toggle>
            More about your dog
          </button>
          <div class="dogfood-calc__more-panel">
            <div class="dogfood-calc__grid">
              <div class="dogfood-calc__field">
                <label for="${id}-activity">Activity level</label>
                <select id="${id}-activity" data-field="activity">
                  <option value="low">Low</option>
                  <option value="moderate" selected>Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div class="dogfood-calc__field">
                <label for="${id}-body">Body condition</label>
                <select id="${id}-body" data-field="body">
                  <option value="ideal weight" selected>Ideal weight</option>
                  <option value="overweight">Overweight</option>
                  <option value="underweight">Underweight</option>
                </select>
              </div>
              <div class="dogfood-calc__field dogfood-calc__field--full">
                <label for="${id}-spay">Spay / neuter status</label>
                <select id="${id}-spay" data-field="spay">
                  <option value="spayed female">Spayed female</option>
                  <option value="neutered male">Neutered male</option>
                  <option value="intact female">Intact female</option>
                  <option value="intact male" selected>Intact male</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" class="dogfood-calc__submit">${escapeHtml(opts.ctaLabel)}</button>
      </form>

      <aside
        class="dogfood-calc__panel${opts.heroImageUrl ? " dogfood-calc__panel--image" : ""}"
        ${
          opts.heroImageUrl
            ? `style="background-image:url('${escapeAttr(opts.heroImageUrl)}');background-position:${escapeAttr(opts.heroImagePosition)};background-size:${opts.heroImageFit};"`
            : ""
        }
        ${opts.heroImageUrl ? `role="img" aria-label="${escapeAttr(opts.heroImageAlt)}"` : ""}
        aria-live="polite"
      >
        <div class="dogfood-calc__hero" data-hero>
          ${
            opts.heroImageUrl
              ? ""
              : `${HERO_SVG}
                 <p class="dogfood-calc__hero-title">A meal plan, made just for them</p>
                 <p class="dogfood-calc__hero-text">
                   Tell us a few things about your dog and we'll work out their daily energy needs and food portion.
                 </p>`
          }
        </div>

        <div class="dogfood-calc__result" data-result hidden>
          <p class="dogfood-calc__nem-label">Daily energy need</p>
          <p class="dogfood-calc__nem">
            <span data-output-nem>0</span><span class="dogfood-calc__nem-unit">kcal / day</span>
          </p>
          <div class="dogfood-calc__serving" data-output-serving></div>
          ${
            opts.enableMixedMode
              ? `<div class="dogfood-calc__mode" role="group" aria-label="Serving mode">
                   <button type="button" data-mode-btn="food-only" aria-pressed="${opts.defaultMode === "food-only"}">Only food</button>
                   <button type="button" data-mode-btn="mixed" aria-pressed="${opts.defaultMode === "mixed"}">Food + kibble</button>
                 </div>`
              : ""
          }
          <button type="button" class="dogfood-calc__steps-toggle" data-steps-toggle>
            How we got this
          </button>
          <ol class="dogfood-calc__steps" data-output-steps hidden></ol>
        </div>
      </aside>
    </div>
  `;
};

const escapeAttr = (s: string): string => escapeHtml(s);

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return c;
    }
  });
