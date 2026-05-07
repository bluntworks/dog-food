/**
 * Domain types for the dog-food calculator.
 *
 * Discriminated unions are used over `string` literal soup so callers (and
 * the UI layer) get exhaustiveness checks when handling each variant.
 */

export type ActivityLevel = "low" | "moderate" | "high";

export type BodyCondition = "ideal weight" | "overweight" | "underweight";

export type SpayNeuterStatus =
  | "spayed female"
  | "neutered male"
  | "intact female"
  | "intact male";

export interface CalcInput {
  readonly weightKg: number;
  readonly ageYears: number;
  readonly activity: ActivityLevel;
  readonly bodyCondition: BodyCondition;
  readonly spayNeuter: SpayNeuterStatus;
  /** Free-text breed; matched (lowercased + trimmed) against breed groups. */
  readonly breed: string;
}

export type CalcResult =
  | {
      readonly status: "rejected";
      readonly reason: "puppy-under-one";
      readonly message: string;
    }
  | {
      readonly status: "ok";
      readonly fct: number;
      readonly nemKcal: number;
      readonly steps: readonly string[];
    };

export type ServingMode = "food-only" | "mixed";

export interface ServingConfig {
  readonly foodKcalPerKg: number;
  readonly kibbleKcalPerKg: number;
  /** 0–100; share of NEM that comes from "food" in mixed mode. */
  readonly foodSplitPercent: number;
}

export type Serving =
  | {
      readonly mode: "food-only";
      readonly foodKcal: number;
      readonly foodGrams: number;
    }
  | {
      readonly mode: "mixed";
      readonly foodKcal: number;
      readonly foodGrams: number;
      readonly kibbleKcal: number;
    };
