import { prisma } from "@/lib/prisma";
import { toEngineAssumptions } from "@/lib/pricing-engine/transforms";
import type { EngineAssumptions, PlanInput } from "@/lib/pricing-engine/types";

export async function getEngineAssumptions(): Promise<EngineAssumptions> {
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
}

export async function getActivePlans(): Promise<PlanInput[]> {
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
}

export async function getFlagshipPlan(): Promise<PlanInput> {
  const plans = await getActivePlans();
  const flagship = plans.find((p) => p.code === "GROWTH_15") ?? plans[0];
  if (!flagship) throw new Error("No active plans configured.");
  return flagship;
}
