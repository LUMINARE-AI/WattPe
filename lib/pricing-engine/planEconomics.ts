import { irr } from "@/lib/pricing-engine/core/irr";
import { stepFactor } from "@/lib/pricing-engine/core/stepFactor";
import type {
  EngineAssumptions,
  PlanEconomicsResult,
  PlanInput,
} from "@/lib/pricing-engine/types";

/**
 * Ported from the per-plan pricing loop inside the Python engine's
 * `run_model()` (dash_studio_v6.py:105-121). Given a plan and the shared
 * assumptions, auto-prices the one-time fee by discounting the plan's own
 * credit stream at its target XIRR, applies the refund adjustment, then
 * recomputes the realized XIRR off the actual fee/credit/refund cashflows.
 *
 * This is the single source of truth for plan economics — both the public
 * savings calculator and the internal Business Studio (Phase 2) call this,
 * so the math is never duplicated.
 */
export function computePlanEconomics(
  plan: PlanInput,
  assumptions: EngineAssumptions,
): PlanEconomicsResult {
  const maxYears = assumptions.maxYears ?? 15;
  const tenureYears = Math.min(Math.trunc(plan.tenureYears), maxYears);
  const isLegacy = assumptions.isLegacy ?? false;
  const userStep = isLegacy ? 0 : assumptions.userStepPct;
  const targetFraction = plan.targetXirrPct / 100;
  const refundFraction = plan.refundPct / 100;

  const creditStream: Record<number, number> = {};
  for (let year = 1; year <= tenureYears; year++) {
    const unitsForYear =
      assumptions.promisedUnitsPerKwDay *
      365 *
      Math.pow(1 - assumptions.degradationPct, year - 1);
    creditStream[year] =
      unitsForYear *
      plan.creditRatePerUnit *
      stepFactor(year, assumptions.stepEveryYears, userStep);
  }

  let fee = 0;
  for (let year = 1; year <= tenureYears; year++) {
    fee += creditStream[year] / Math.pow(1 + targetFraction, year);
  }

  if (plan.refundPct) {
    fee = fee / (1 - refundFraction * Math.pow(1 + targetFraction, -tenureYears));
  }

  if (isLegacy) {
    fee = fee * (1 + (assumptions.legacyPremiumPct ?? 0));
  }

  const cashflows: number[] = [-fee * (1 + assumptions.onboardingFeePct)];
  for (let year = 1; year <= tenureYears; year++) {
    const refundPayout = year === tenureYears ? fee * refundFraction : 0;
    cashflows.push(creditStream[year] + refundPayout);
  }

  return {
    code: plan.code,
    name: plan.name,
    tenureYears,
    feePerKW: fee,
    creditStream,
    refundFraction,
    realizedXirrPct: 100 * irr(cashflows),
    creditRatePerUnit: plan.creditRatePerUnit,
  };
}
