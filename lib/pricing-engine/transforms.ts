import type { EngineAssumptions, RawAssumptionInput } from "@/lib/pricing-engine/types";

/** Ported from the Python engine's `A()` (dash_studio_v6.py:236-247): raw % inputs -> engine fractions. */
export function toEngineAssumptions(raw: RawAssumptionInput): EngineAssumptions {
  return {
    genUnitsPerKwDay: raw.genUnitsPerKwDay,
    promisedUnitsPerKwDay: raw.promisedUnitsPerKwDay,
    degradationPct: raw.degradationPct / 100,
    stepEveryYears: raw.stepEveryYears,
    userStepPct: raw.userStepPct / 100,
    onboardingFeePct: raw.onboardingFeePct / 100,
    isLegacy: raw.isLegacy ?? false,
    legacyPremiumPct: (raw.legacyPremiumPct ?? 0) / 100,
    maxYears: raw.maxYears ?? 15,
  };
}
