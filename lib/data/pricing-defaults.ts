import { toEngineAssumptions } from "@/lib/pricing-engine/transforms";
import type { EngineAssumptions, PlanInput } from "@/lib/pricing-engine/types";

/** Mirrors DEF / DEF_PLANS in prisma/seed.ts and dash_studio_v4.py. */
export const DEFAULT_ENGINE_ASSUMPTIONS: EngineAssumptions = toEngineAssumptions({
  genUnitsPerKwDay: 4.5,
  promisedUnitsPerKwDay: 4.0,
  degradationPct: 1.0,
  stepEveryYears: 5,
  userStepPct: 10.0,
  onboardingFeePct: 1.0,
  maxYears: 15,
});

export const DEFAULT_PLANS: PlanInput[] = [
  {
    code: "GROWTH_15",
    name: "Growth-15",
    tenureYears: 15,
    creditRatePerUnit: 4.0,
    targetXirrPct: 11.5,
    refundPct: 0,
    autoResell: false,
  },
  {
    code: "FLEXI_10",
    name: "Flexi-10",
    tenureYears: 10,
    creditRatePerUnit: 4.5,
    targetXirrPct: 11.0,
    refundPct: 0,
    autoResell: false,
  },
  {
    code: "SHORT_3",
    name: "Short-3",
    tenureYears: 3,
    creditRatePerUnit: 7.0,
    targetXirrPct: 10.0,
    refundPct: 0,
    autoResell: true,
  },
  {
    code: "ASSURED_15",
    name: "Assured-15",
    tenureYears: 15,
    creditRatePerUnit: 3.4,
    targetXirrPct: 10.5,
    refundPct: 100,
    autoResell: false,
  },
];
