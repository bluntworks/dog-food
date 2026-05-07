import type { CalcInput, CalcResult, Serving, ServingConfig } from "./types";
import {
  activityAdjustment,
  ageAdjustment,
  bodyConditionAdjustment,
  breedAdjustment,
  spayNeuterAdjustment,
} from "./adjustments";

/** Initial Food Calculation Base — fixed by the spec. */
export const FCB_INITIAL = 1.4;

/**
 * Compute FCT (final adjustment factor) and NEM (kcal/day).
 * Mirrors the sequential-print loop in the Python spec but returns
 * the steps as data so the UI can render them.
 */
export const calculate = (input: CalcInput): CalcResult => {
  const age = ageAdjustment(input.ageYears);
  if (age === null) {
    return {
      status: "rejected",
      reason: "puppy-under-one",
      message: "Diet is not recommended for puppies under 1 year old.",
    };
  }

  const steps: string[] = [`Initial FCB: ${FCB_INITIAL.toFixed(2)}`];

  let fcb = FCB_INITIAL + age.delta;
  steps.push(`${age.description} → FCB = ${fcb.toFixed(2)}`);

  const activity = activityAdjustment(input.activity);
  fcb += activity.delta;
  steps.push(`${activity.description} → FCB = ${fcb.toFixed(2)}`);

  const body = bodyConditionAdjustment(input.bodyCondition);
  fcb += body.delta;
  steps.push(`${body.description} → FCB = ${fcb.toFixed(2)}`);

  const spay = spayNeuterAdjustment(input.spayNeuter);
  fcb += spay.delta;
  steps.push(`${spay.description} → FCB = ${fcb.toFixed(2)}`);

  const breed = breedAdjustment(input.breed);
  const fct = fcb + breed.delta;
  steps.push(`${breed.description} → FCT = ${fct.toFixed(2)}`);

  const nemKcal = Math.round(95 * Math.pow(input.weightKg, 0.75) * fct);

  return { status: "ok", fct, nemKcal, steps };
};

/** Convert kcal to grams given a food's kcal/kg density. */
const kcalToGrams = (kcal: number, kcalPerKg: number): number =>
  Math.round(kcal / (kcalPerKg / 1000));

export const computeServing = (
  nemKcal: number,
  mode: Serving["mode"],
  config: ServingConfig,
): Serving => {
  if (mode === "food-only") {
    return {
      mode: "food-only",
      foodKcal: nemKcal,
      foodGrams: kcalToGrams(nemKcal, config.foodKcalPerKg),
    };
  }
  const foodKcal = Math.round(nemKcal * (config.foodSplitPercent / 100));
  const kibbleKcal = nemKcal - foodKcal;
  return {
    mode: "mixed",
    foodKcal,
    foodGrams: kcalToGrams(foodKcal, config.foodKcalPerKg),
    kibbleKcal,
  };
};
