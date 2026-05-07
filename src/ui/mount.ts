import type {
  ActivityLevel,
  BodyCondition,
  CalcInput,
  CalcResult,
  Serving,
  ServingConfig,
  ServingMode,
  SpayNeuterStatus,
} from "../calc/types";
import { calculate, computeServing } from "../calc/calculate";
import { BREED_GROUPS } from "../calc/breed-groups";
import { renderTemplate } from "./template";

export interface WidgetConfig {
  readonly heading: string;
  readonly subheading: string;
  readonly ctaLabel: string;
  readonly foodKcalPerKg: number;
  readonly kibbleKcalPerKg: number;
  readonly foodSplitPercent: number;
  readonly defaultMode: ServingMode;
  readonly enableMixedMode: boolean;
  readonly heroImageUrl: string;
  readonly heroImageAlt: string;
  readonly heroImagePosition: string;
  readonly heroImageFit: "cover" | "contain";
}

const DEFAULTS: WidgetConfig = {
  heading: "Build your dog's feeding plan",
  subheading:
    "Tell us a bit about your dog and we'll work out their daily energy needs.",
  ctaLabel: "Calculate daily portion",
  foodKcalPerKg: 1345,
  kibbleKcalPerKg: 1345,
  foodSplitPercent: 80,
  defaultMode: "mixed",
  enableMixedMode: true,
  heroImageUrl: "",
  heroImageAlt: "Happy dog ready for their meal",
  heroImagePosition: "center",
  heroImageFit: "cover",
};

let instanceCounter = 0;

/** Reads `data-*` attributes off the host element and merges them with defaults. */
export const readConfig = (el: HTMLElement): WidgetConfig => {
  const ds = el.dataset;
  return {
    heading: ds.heading ?? DEFAULTS.heading,
    subheading: ds.subheading ?? DEFAULTS.subheading,
    ctaLabel: ds.ctaLabel ?? DEFAULTS.ctaLabel,
    foodKcalPerKg: numAttr(ds.foodKcalPerKg, DEFAULTS.foodKcalPerKg),
    kibbleKcalPerKg: numAttr(ds.kibbleKcalPerKg, DEFAULTS.kibbleKcalPerKg),
    foodSplitPercent: numAttr(ds.foodSplitPercent, DEFAULTS.foodSplitPercent),
    defaultMode: ds.defaultMode === "food-only" ? "food-only" : "mixed",
    enableMixedMode: ds.enableMixedMode !== "false",
    heroImageUrl: ds.heroImageUrl ?? DEFAULTS.heroImageUrl,
    heroImageAlt: ds.heroImageAlt ?? DEFAULTS.heroImageAlt,
    heroImagePosition: ds.heroImagePosition ?? DEFAULTS.heroImagePosition,
    heroImageFit: ds.heroImageFit === "contain" ? "contain" : "cover",
  };
};

const numAttr = (raw: string | undefined, fallback: number): number => {
  if (raw === undefined) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/**
 * Per-instance state. Kept on a WeakMap keyed by host element so that
 * mode-toggle clicks can re-derive serving without re-running the calc.
 */
interface InstanceState {
  config: WidgetConfig;
  lastResult: Extract<CalcResult, { status: "ok" }> | null;
  currentMode: ServingMode;
}

const STATE = new WeakMap<HTMLElement, InstanceState>();

export const mountWidget = (host: HTMLElement): void => {
  if (host.dataset["dogfoodCalcMounted"] === "true") return;
  host.dataset["dogfoodCalcMounted"] = "true";

  const config = readConfig(host);
  const id = `dfc-${++instanceCounter}`;

  host.classList.add("dogfood-calc");
  host.innerHTML = renderTemplate(id, {
    heading: config.heading,
    subheading: config.subheading,
    ctaLabel: config.ctaLabel,
    defaultMode: config.defaultMode,
    enableMixedMode: config.enableMixedMode,
    heroImageUrl: config.heroImageUrl,
    heroImageAlt: config.heroImageAlt,
    heroImagePosition: config.heroImagePosition,
    heroImageFit: config.heroImageFit,
  });

  populateBreedDatalist(host, id);

  STATE.set(host, {
    config,
    lastResult: null,
    currentMode: config.defaultMode,
  });

  wireForm(host);
  wireMoreToggle(host);
  wireModeButtons(host);
  wireStepsToggle(host);
};

const populateBreedDatalist = (host: HTMLElement, id: string): void => {
  const list = host.querySelector<HTMLDataListElement>(`#${id}-breed-list`);
  if (!list) return;
  const seen = new Set<string>();
  for (const group of BREED_GROUPS) {
    for (const breed of group.breeds) {
      if (seen.has(breed)) continue;
      seen.add(breed);
      const opt = document.createElement("option");
      // Title-case-ish for display; calc layer lower-cases on lookup.
      opt.value = breed.replace(/\b\w/g, (c) => c.toUpperCase());
      list.appendChild(opt);
    }
  }
};

const wireForm = (host: HTMLElement): void => {
  const form = host.querySelector<HTMLFormElement>("form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit(host);
  });
};

const wireMoreToggle = (host: HTMLElement): void => {
  const more = host.querySelector<HTMLElement>("[data-more]");
  const btn = host.querySelector<HTMLButtonElement>("[data-more-toggle]");
  if (!more || !btn) return;
  btn.addEventListener("click", () => {
    const open = more.dataset["open"] === "true";
    more.dataset["open"] = open ? "false" : "true";
  });
};

const wireModeButtons = (host: HTMLElement): void => {
  const buttons = host.querySelectorAll<HTMLButtonElement>("[data-mode-btn]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset["modeBtn"] as ServingMode;
      const state = STATE.get(host);
      if (!state) return;
      state.currentMode = mode;
      buttons.forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          b.dataset["modeBtn"] === mode ? "true" : "false",
        ),
      );
      if (state.lastResult) renderServing(host, state);
    });
  });
};

const wireStepsToggle = (host: HTMLElement): void => {
  const btn = host.querySelector<HTMLButtonElement>("[data-steps-toggle]");
  const list = host.querySelector<HTMLOListElement>("[data-output-steps]");
  if (!btn || !list) return;
  btn.addEventListener("click", () => {
    list.hidden = !list.hidden;
    btn.textContent = list.hidden ? "How we got this" : "Hide details";
  });
};

const handleSubmit = (host: HTMLElement): void => {
  const state = STATE.get(host);
  if (!state) return;

  const input = readForm(host);
  if (!input) {
    showError(host, "Please enter a valid weight in kilograms.");
    return;
  }

  const result = calculate(input);
  if (result.status === "rejected") {
    showError(host, result.message);
    return;
  }

  state.lastResult = result;
  showResult(host, state);
};

/** Maps an age-band select value to a representative numeric age that lands
 *  in the correct spec tier. Spec tiers: <1 reject, 1–2 +0.1, 2–5 0,
 *  5–8 −0.1, >8 −0.1. Representative values are picked to be unambiguously
 *  inside each tier. */
const ageBandToYears = (band: string): number => {
  switch (band) {
    case "puppy":
      return 0.5;
    case "1-2":
      return 2;
    case "3-5":
      return 4;
    case "6-8":
      return 7;
    case "9+":
      return 10;
    default:
      return 4;
  }
};

const readForm = (host: HTMLElement): CalcInput | null => {
  const weight = numField(host, "weight");
  const ageBand = strField(host, "age") ?? "3-5";
  const breedRaw = strField(host, "breed") ?? "";
  const activity = (strField(host, "activity") ?? "moderate") as ActivityLevel;
  const body = (strField(host, "body") ?? "ideal weight") as BodyCondition;
  const spay = (strField(host, "spay") ?? "intact male") as SpayNeuterStatus;

  if (weight === null || weight <= 0) return null;

  return {
    weightKg: weight,
    ageYears: ageBandToYears(ageBand),
    activity,
    bodyCondition: body,
    spayNeuter: spay,
    breed: breedRaw,
  };
};

const numField = (host: HTMLElement, name: string): number | null => {
  const el = host.querySelector<HTMLInputElement>(`[data-field="${name}"]`);
  if (!el || el.value === "") return null;
  const n = Number(el.value);
  return Number.isFinite(n) ? n : null;
};

const strField = (host: HTMLElement, name: string): string | null => {
  const el = host.querySelector<HTMLInputElement | HTMLSelectElement>(
    `[data-field="${name}"]`,
  );
  return el?.value ?? null;
};

/* ---------- Output rendering ---------- */

const showResult = (host: HTMLElement, state: InstanceState): void => {
  const hero = host.querySelector<HTMLElement>("[data-hero]");
  const result = host.querySelector<HTMLElement>("[data-result]");
  const nemEl = host.querySelector<HTMLElement>("[data-output-nem]");
  if (!hero || !result || !nemEl || !state.lastResult) return;

  hero.hidden = true;
  result.hidden = false;
  nemEl.classList.remove("dogfood-calc__warn");
  nemEl.textContent = String(state.lastResult.nemKcal);

  renderServing(host, state);
  renderSteps(host, state.lastResult.steps);
};

const renderServing = (host: HTMLElement, state: InstanceState): void => {
  if (!state.lastResult) return;
  const servingEl = host.querySelector<HTMLElement>("[data-output-serving]");
  if (!servingEl) return;

  const config: ServingConfig = {
    foodKcalPerKg: state.config.foodKcalPerKg,
    kibbleKcalPerKg: state.config.kibbleKcalPerKg,
    foodSplitPercent: state.config.foodSplitPercent,
  };
  const mode: ServingMode = state.config.enableMixedMode
    ? state.currentMode
    : "food-only";
  const serving = computeServing(state.lastResult.nemKcal, mode, config);
  servingEl.innerHTML = formatServing(serving, state.config);
};

const formatServing = (serving: Serving, config: WidgetConfig): string => {
  if (serving.mode === "food-only") {
    return `<strong>${serving.foodGrams} g</strong> of food per day
      <br><span style="color:var(--dfc-muted);font-size:0.85em">
      Based on ${config.foodKcalPerKg} kcal/kg.</span>`;
  }
  const kibblePercent = 100 - config.foodSplitPercent;
  return `<strong>${serving.foodGrams} g</strong> of food
    <span style="color:var(--dfc-muted)">(${config.foodSplitPercent}%, ${serving.foodKcal} kcal)</span>
    <br>+ <strong>${serving.kibbleKcal} kcal</strong> of kibble
    <span style="color:var(--dfc-muted)">(${kibblePercent}%)</span>`;
};

const renderSteps = (host: HTMLElement, steps: readonly string[]): void => {
  const list = host.querySelector<HTMLOListElement>("[data-output-steps]");
  const toggle = host.querySelector<HTMLButtonElement>("[data-steps-toggle]");
  if (!list) return;
  list.innerHTML = steps.map((s) => `<li>${s}</li>`).join("");
  list.hidden = true;
  if (toggle) toggle.textContent = "How we got this";
};

const showError = (host: HTMLElement, message: string): void => {
  const hero = host.querySelector<HTMLElement>("[data-hero]");
  const result = host.querySelector<HTMLElement>("[data-result]");
  const nemEl = host.querySelector<HTMLElement>("[data-output-nem]");
  const servingEl = host.querySelector<HTMLElement>("[data-output-serving]");
  const stepsEl = host.querySelector<HTMLOListElement>("[data-output-steps]");
  if (!hero || !result || !nemEl || !servingEl || !stepsEl) return;

  hero.hidden = true;
  result.hidden = false;
  nemEl.classList.add("dogfood-calc__warn");
  nemEl.textContent = "—";
  servingEl.innerHTML = `<span class="dogfood-calc__warn">${message}</span>`;
  stepsEl.innerHTML = "";
  stepsEl.hidden = true;
};
