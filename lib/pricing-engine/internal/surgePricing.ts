import { irr } from "@/lib/pricing-engine/core/irr";
import { stepFactor } from "@/lib/pricing-engine/core/stepFactor";
import type { RunModelPlanResult, RunModelSummary } from "@/lib/pricing-engine/types";

/**
 * Port of the Python engine's Surge Pricing tab (dash_studio_v6.py:953-997): a
 * flight-style price ladder within one project — early tranches pay the base
 * fee, later tranches pay progressively more (all customers in a tranche still
 * get the same credits, so later buyers simply earn a slightly lower XIRR).
 *
 * Reuses `stepFactor` and `irr` from core/ (the same primitives
 * `computePlanEconomics` is built on) for the last-tranche credit-stream/XIRR
 * calculation, rather than re-deriving that math — this mirrors exactly what
 * the Python does (it recomputes the stream inline off `run_model()`'s
 * already-priced plan list `P`, not by re-calling the per-plan pricer).
 */
export interface SurgePricingAssumptions {
  promisedUnitsPerKwDay: number;
  /** Fraction, e.g. 0.01 for 1%/yr. */
  degradationPct: number;
  stepEveryYears: number;
  mirrorUserStep: boolean;
  /** Fraction. */
  hostStepPct: number;
  /** Fraction. */
  userStepPct: number;
  /** Fraction. */
  onboardingFeePct: number;
  /** Fraction. */
  marketingPct: number;
}

export interface SurgeTrancheRow {
  planName: string;
  baseFeePerWatt: number;
  topTrancheFeePerWatt: number;
  avgRealisedFeePerWatt: number;
  /** ₹ uplift vs a flat-priced sale of the same plan. */
  upliftValue: number;
  /** XIRR earned by the LAST (most expensive) tranche's buyer, percent. */
  lastBuyerXirrPct: number;
}

export interface SurgeLadderPoint {
  planName: string;
  /** Midpoint of this tranche's slice of capacity reserved, percent 0-100. */
  trancheMidpointPct: number;
  feePerWatt: number;
}

export interface SurgePricingResult {
  flatRevenueAtT0: number;
  surgedRevenueAtT0: number;
  uplift: number;
  cashOnCashFlat: number;
  cashOnCashSurged: number;
  tranches: SurgeTrancheRow[];
  ladder: SurgeLadderPoint[];
}

export function computeSurgePricing(
  plans: RunModelPlanResult[],
  summary: RunModelSummary,
  a: SurgePricingAssumptions,
  numTranches: number,
  stepPct: number,
): SurgePricingResult {
  const T = Math.trunc(numTranches || 5);
  const sp = stepPct;
  const ustep = a.mirrorUserStep ? a.hostStepPct : a.userStepPct;

  let flatTotal = 0;
  let surgedTotal = 0;
  const tranches: SurgeTrancheRow[] = [];
  const ladder: SurgeLadderPoint[] = [];

  for (const p of plans) {
    const fee = p.fee;
    const kws = p.kwSold;
    if (kws <= 0) continue; // plan excluded from mix

    const flat = kws * fee;
    // geometric ladder: tranche i pays fee*(1+sp)^i, equal kW per tranche
    let surged = 0;
    for (let i = 0; i < T; i++) surged += (kws / T) * fee * Math.pow(1 + sp, i);
    const topFee = fee * Math.pow(1 + sp, T - 1);

    const ten = p.tenure;
    const stream: number[] = [];
    for (let y = 1; y <= ten; y++) {
      stream.push(
        a.promisedUnitsPerKwDay *
          365 *
          Math.pow(1 - a.degradationPct, y - 1) *
          p.creditRatePerUnit *
          stepFactor(y, a.stepEveryYears, ustep),
      );
    }
    const ucf: number[] = [-topFee * (1 + a.onboardingFeePct)];
    stream.forEach((v, idx) => {
      const y = idx + 1;
      ucf.push(v + (y === ten ? topFee * p.refundFraction : 0));
    });
    const lastXirr = 100 * irr(ucf);

    flatTotal += flat;
    surgedTotal += surged;
    tranches.push({
      planName: p.name,
      baseFeePerWatt: fee / 1000,
      topTrancheFeePerWatt: topFee / 1000,
      avgRealisedFeePerWatt: surged / kws / 1000,
      upliftValue: surged - flat,
      lastBuyerXirrPct: lastXirr,
    });

    for (let i = 0; i < T; i++) {
      ladder.push({
        planName: p.name,
        trancheMidpointPct: ((i + 0.5) * 100) / T,
        feePerWatt: (fee * Math.pow(1 + sp, i)) / 1000,
      });
    }
  }

  if (flatTotal <= 0) {
    return {
      flatRevenueAtT0: 0,
      surgedRevenueAtT0: 0,
      uplift: 0,
      cashOnCashFlat: summary.cashOnCash,
      cashOnCashSurged: summary.cashOnCash,
      tranches: [],
      ladder: [],
    };
  }

  const uplift = surgedTotal - flatTotal;
  const back2 = summary.back + uplift * (1 + a.onboardingFeePct);
  const eq2 = summary.equityNeed + uplift * a.marketingPct;
  const coc2 = (back2 - eq2) / eq2;

  return {
    flatRevenueAtT0: flatTotal,
    surgedRevenueAtT0: surgedTotal,
    uplift,
    cashOnCashFlat: summary.cashOnCash,
    cashOnCashSurged: coc2,
    tranches,
    ladder,
  };
}
