import type {
  ActivityLevel,
  BodyCondition,
  CalcInput,
  ServingConfig,
  ServingMode,
  SpayNeuterStatus,
} from "../calc/types";
import { calculate, computeServing } from "../calc/calculate";
import { renderTemplate } from "./template";

export interface WidgetConfig {
  readonly heading: string;
  readonly foodKcalPerKg: number;
  readonly kibbleKcalPerKg: number;
  readonly foodSplitPercent: number;
  readonly defaultMode: ServingMode;
  readonly enableMixedMode: boolean;
}

const DEFAULTS: WidgetConfig = {
  heading: "Personalized Energy Needs Calculator",
  foodKcalPerKg: 1345,
  kibbleKcalPerKg: 1345,
  foodSplitPercent: 80,
  defaultMode: "mixed",
  enableMixedMode: true,
};

let instanceCounter = 0;

/** Reads `data-*` attributes off the host element and merges them with defaults. */
export const readConfig = (el: HTMLElement): WidgetConfig => {
  const ds = el.dataset;
  return {
    heading: ds.heading ?? DEFAULTS.heading,
    foodKcalPerKg: numAttr(ds.foodKcalPerKg, DEFAULTS.foodKcalPerKg),
    kibbleKcalPerKg: numAttr(ds.kibbleKcalPerKg, DEFAULTS.kibbleKcalPerKg),
    foodSplitPercent: numAttr(ds.foodSplitPercent, DEFAULTS.foodSplitPercent),
    defaultMode: ds.defaultMode === "food-only" ? "food-only" : "mixed",
    enableMixedMode: ds.enableMixedMode !== "false",
  };
};

const numAttr = (raw: string | undefined, fallback: number): number => {
  if (raw === undefined) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const mountWidget = (host: HTMLElement): void => {
  if (host.dataset["dogfoodCalcMounted"] === "true") return;
  host.dataset["dogfoodCalcMounted"] = "true";

  const config = readConfig(host);
  const id = `dfc-${++instanceCounter}`;

  host.classList.add("dogfood-calc");
  host.innerHTML = renderTemplate(id, {
    heading: config.heading,
    defaultMode: config.defaultMode,
    enableMixedMode: config.enableMixedMode,
  });

  const form = host.querySelector<HTMLFormElement>(`#${id}-form`);
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit(host, config);
  });
};

const handleSubmit = (host: HTMLElement, config: WidgetConfig): void => {
  const out = host.querySelector<HTMLElement>("[data-output]");
  const nemEl = host.querySelector<HTMLElement>("[data-output-nem]");
  const servingEl = host.querySelector<HTMLElement>("[data-output-serving]");
  const stepsEl = host.querySelector<HTMLOListElement>("[data-output-steps]");
  if (!out || !nemEl || !servingEl || !stepsEl) return;

  const input = readForm(host);
  if (!input) {
    showError(out, nemEl, servingEl, stepsEl, "Please fill in valid values for all fields.");
    return;
  }

  const result = calculate(input);
  if (result.status === "rejected") {
    showError(out, nemEl, servingEl, stepsEl, result.message);
    return;
  }

  const mode = readMode(host, config);
  const servingConfig: ServingConfig = {
    foodKcalPerKg: config.foodKcalPerKg,
    kibbleKcalPerKg: config.kibbleKcalPerKg,
    foodSplitPercent: config.foodSplitPercent,
  };
  const serving = computeServing(result.nemKcal, mode, servingConfig);

  nemEl.classList.remove("dogfood-calc__warn");
  nemEl.textContent = `Daily energy need: ${result.nemKcal} kcal`;

  servingEl.textContent =
    serving.mode === "food-only"
      ? `Food only: ${serving.foodGrams} g/day (${config.foodKcalPerKg} kcal/kg).`
      : `Food (${config.foodSplitPercent}%): ${serving.foodKcal} kcal → ${serving.foodGrams} g/day. ` +
        `Kibble (${100 - config.foodSplitPercent}%): ${serving.kibbleKcal} kcal.`;

  stepsEl.innerHTML = result.steps.map((s) => `<li>${s}</li>`).join("");
  out.hidden = false;
};

const readForm = (host: HTMLElement): CalcInput | null => {
  const weight = numField(host, "weight");
  const age = numField(host, "age");
  const breedRaw = strField(host, "breed");
  const activity = strField(host, "activity") as ActivityLevel;
  const body = strField(host, "body") as BodyCondition;
  const spay = strField(host, "spay") as SpayNeuterStatus;

  if (weight === null || age === null || weight <= 0) return null;

  return {
    weightKg: weight,
    ageYears: age,
    activity,
    bodyCondition: body,
    spayNeuter: spay,
    breed: breedRaw ?? "",
  };
};

const readMode = (host: HTMLElement, config: WidgetConfig): ServingMode => {
  if (!config.enableMixedMode) return "food-only";
  const sel = host.querySelector<HTMLSelectElement>('[data-field="mode"]');
  return sel?.value === "food-only" ? "food-only" : "mixed";
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

const showError = (
  out: HTMLElement,
  nemEl: HTMLElement,
  servingEl: HTMLElement,
  stepsEl: HTMLOListElement,
  message: string,
): void => {
  nemEl.classList.add("dogfood-calc__warn");
  nemEl.textContent = message;
  servingEl.textContent = "";
  stepsEl.innerHTML = "";
  out.hidden = false;
};
