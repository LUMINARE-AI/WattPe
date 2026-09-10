import {
  DEFAULT_ENGINE_ASSUMPTIONS,
  DEFAULT_PLANS,
} from "@/lib/data/pricing-defaults";
import { hasDatabase, isDatabaseUnavailableError } from "@/lib/data/database";
import { connectDB } from "@/lib/db";
import { asDoc, asDocs } from "@/lib/models/helpers";
import { Plan } from "@/lib/models/plan";
import { PricingAssumption } from "@/lib/models/pricing-assumption";
import { toEngineAssumptions } from "@/lib/pricing-engine/transforms";
import type { EngineAssumptions, PlanInput } from "@/lib/pricing-engine/types";

type PricingRow = {
  genUnitsPerKwDay: number;
  promisedUnitsPerKwDay: number;
  degradationPct: number;
  stepEveryYears: number;
  userStepPct: number;
  onboardingFeePct: number;
};

type PlanRow = {
  code: string;
  name: string;
  tenureYears: number;
  creditRatePerUnit: number;
  targetXirrPct: number;
  refundPct: number;
  autoResell: boolean;
};

export async function getEngineAssumptions(): Promise<EngineAssumptions> {
  if (!hasDatabase()) return DEFAULT_ENGINE_ASSUMPTIONS;

  try {
    await connectDB();
    const row = asDoc<PricingRow>(await PricingAssumption.findOne({ _id: "default" }).lean());
    if (!row) throw new Error("Missing default pricing assumptions.");
    return toEngineAssumptions({
      genUnitsPerKwDay: Number(row.genUnitsPerKwDay),
      promisedUnitsPerKwDay: Number(row.promisedUnitsPerKwDay),
      degradationPct: Number(row.degradationPct),
      stepEveryYears: row.stepEveryYears,
      userStepPct: Number(row.userStepPct),
      onboardingFeePct: Number(row.onboardingFeePct),
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) return DEFAULT_ENGINE_ASSUMPTIONS;
    throw error;
  }
}

export async function getActivePlans(): Promise<PlanInput[]> {
  if (!hasDatabase()) return DEFAULT_PLANS;

  try {
    await connectDB();
    const rows = asDocs<PlanRow>(await Plan.find({ isActive: true }).sort({ tenureYears: -1 }).lean());
    return rows.map((p) => ({
      code: p.code,
      name: p.name,
      tenureYears: p.tenureYears,
      creditRatePerUnit: Number(p.creditRatePerUnit),
      targetXirrPct: Number(p.targetXirrPct),
      refundPct: Number(p.refundPct),
      autoResell: p.autoResell,
    }));
  } catch (error) {
    if (isDatabaseUnavailableError(error)) return DEFAULT_PLANS;
    throw error;
  }
}

export async function getFlagshipPlan(): Promise<PlanInput> {
  const plans = await getActivePlans();
  const flagship = plans.find((p) => p.code === "GROWTH_15") ?? plans[0];
  if (!flagship) throw new Error("No active plans configured.");
  return flagship;
}
