import type { ServingMode } from "../calc/types";

export interface TemplateOptions {
  readonly heading: string;
  readonly defaultMode: ServingMode;
  readonly enableMixedMode: boolean;
}

/**
 * Returns the static markup for a single widget instance.
 * Field IDs are namespaced per-instance by {@link mountWidget}.
 */
export const renderTemplate = (id: string, opts: TemplateOptions): string => {
  const modeToggle = opts.enableMixedMode
    ? `
      <label class="dogfood-calc__mode">
        Mode
        <select data-field="mode">
          <option value="food-only" ${opts.defaultMode === "food-only" ? "selected" : ""}>Only food</option>
          <option value="mixed" ${opts.defaultMode === "mixed" ? "selected" : ""}>Food + kibble</option>
        </select>
      </label>`
    : "";

  return `
    <h2>${escapeHtml(opts.heading)}</h2>
    <form class="dogfood-calc__form" id="${id}-form" novalidate>
      <div class="dogfood-calc__grid">
        <div class="dogfood-calc__field">
          <label for="${id}-weight">Weight (kg)</label>
          <input id="${id}-weight" data-field="weight" type="number" min="0.1" step="0.1" required />
        </div>
        <div class="dogfood-calc__field">
          <label for="${id}-age">Age (years)</label>
          <input id="${id}-age" data-field="age" type="number" min="0" step="0.1" required />
        </div>
        <div class="dogfood-calc__field">
          <label for="${id}-activity">Activity</label>
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
        <div class="dogfood-calc__field">
          <label for="${id}-spay">Spay / neuter</label>
          <select id="${id}-spay" data-field="spay">
            <option value="spayed female">Spayed female</option>
            <option value="neutered male">Neutered male</option>
            <option value="intact female">Intact female</option>
            <option value="intact male" selected>Intact male</option>
          </select>
        </div>
        <div class="dogfood-calc__field">
          <label for="${id}-breed">Breed</label>
          <input id="${id}-breed" data-field="breed" type="text" placeholder="e.g. labrador" />
        </div>
      </div>

      <div class="dogfood-calc__actions">
        <button type="submit" class="dogfood-calc__submit">Calculate</button>
        ${modeToggle}
      </div>
    </form>

    <div class="dogfood-calc__output" data-output hidden>
      <p class="dogfood-calc__nem" data-output-nem></p>
      <p class="dogfood-calc__serving" data-output-serving></p>
      <ol class="dogfood-calc__steps" data-output-steps></ol>
    </div>
  `;
};

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
