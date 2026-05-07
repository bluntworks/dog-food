import type {
  ActivityLevel,
  BodyCondition,
  SpayNeuterStatus,
} from "./types";
import { BREED_GROUPS, DEFAULT_BREED_ADJUSTMENT } from "./breed-groups";

export interface AdjustmentResult {
  readonly delta: number;
  readonly description: string;
}

/** Age-based adjustment to FCB. Returns `null` for puppies (<1y), which the spec rejects. */
export const ageAdjustment = (
  ageYears: number,
): AdjustmentResult | null => {
  if (ageYears < 1) return null;
  if (ageYears <= 2) {
    return { delta: 0.1, description: `Age adjustment (${ageYears}y): +0.1` };
  }
  if (ageYears <= 5) {
    return { delta: 0, description: `Age adjustment (${ageYears}y): 0` };
  }
  if (ageYears <= 8) {
    return { delta: -0.1, description: `Age adjustment (${ageYears}y): -0.1` };
  }
  return { delta: -0.1, description: `Age adjustment (>8y): -0.1` };
};

const ACTIVITY_DELTAS: Record<ActivityLevel, number> = {
  low: -0.2,
  moderate: 0,
  high: 0.3,
};

export const activityAdjustment = (
  activity: ActivityLevel,
): AdjustmentResult => {
  const delta = ACTIVITY_DELTAS[activity];
  return {
    delta,
    description:
      delta === 0
        ? `No activity adjustment ('${activity}')`
        : `Activity adjustment ('${activity}'): ${signed(delta)}`,
  };
};

const BODY_DELTAS: Record<BodyCondition, number> = {
  "ideal weight": 0,
  overweight: -0.2,
  underweight: 0.2,
};

export const bodyConditionAdjustment = (
  body: BodyCondition,
): AdjustmentResult => {
  const delta = BODY_DELTAS[body];
  return {
    delta,
    description:
      delta === 0
        ? `No body-condition adjustment ('${body}')`
        : `Body-condition adjustment ('${body}'): ${signed(delta)}`,
  };
};

const SPAY_DELTAS: Record<SpayNeuterStatus, number> = {
  "spayed female": -0.2,
  "neutered male": -0.1,
  "intact female": 0,
  "intact male": 0.1,
};

export const spayNeuterAdjustment = (
  status: SpayNeuterStatus,
): AdjustmentResult => {
  const delta = SPAY_DELTAS[status];
  return {
    delta,
    description:
      delta === 0
        ? `No spay/neuter adjustment ('${status}')`
        : `Spay/neuter adjustment ('${status}'): ${signed(delta)}`,
  };
};

/** Exact-match breed lookup (1:1 with spec). Falls back to default adjustment. */
export const breedAdjustment = (breed: string): AdjustmentResult => {
  const normalized = breed.trim().toLowerCase();
  for (const group of BREED_GROUPS) {
    if (group.breeds.includes(normalized)) {
      return {
        delta: group.adjustment,
        description: `Breed adjustment (${group.name}): ${signed(group.adjustment)}`,
      };
    }
  }
  return {
    delta: DEFAULT_BREED_ADJUSTMENT,
    description: `Breed adjustment (other): ${signed(DEFAULT_BREED_ADJUSTMENT)}`,
  };
};

const signed = (n: number): string => (n >= 0 ? `+${n}` : `${n}`);
