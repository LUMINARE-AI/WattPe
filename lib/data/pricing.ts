import {
  DEFAULT_ENGINE_ASSUMPTIONS,
  DEFAULT_PLANS,
} from "@/lib/data/pricing-defaults";
import { hasDatabase, isDatabaseUnavailableError } from "@/lib/data/database";
import { prisma } from "@/lib/prisma";
import { toEngineAssumptions } from "@/lib/pricing-engine/transforms";
import type { EngineAssumptions, PlanInput } from "@/lib/pricing-engine/types";

export async function getEngineAssumptions(): Promise<EngineAssumptions> {
  if (!hasDatabase()) return DEFAULT_ENGINE_ASSUMPTIONS;

  try {
    const row = await prisma.pricingAssumption.findUniqueOrThrow({
      where: { id: "default" },
    });
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
    const rows = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { tenureYears: "desc" },
    });
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
