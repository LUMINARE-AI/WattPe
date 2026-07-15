import { irr } from "@/lib/pricing-engine/core/irr";
import { stepFactor } from "@/lib/pricing-engine/core/stepFactor";

/**
 * Port of the Python engine's Price Target Solver tab (dash_studio_v6.py:1050-1086).
 * Reverses the usual pricing flow: given a fixed sell price (₹/W) and a minimum
 * customer XIRR to beat, bisects for the credit rate (₹/unit) that hits both.
 *
 * Deviation: the Python callback reads raw percent values off `data['a']` (the
 * un-fractionalized assumptions dict) and divides by 100 inline. This port takes
 * already-fractional assumptions (degradationPct, hostStepPct, userStepPct,
 * onboardingFeePct as fractions), consistent with the rest of lib/pricing-engine —
 * the arithmetic is identical either way since scaling commutes with the /100.
 */
export interface PriceTargetSolverAssumptions {
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
}

export interface PriceTargetSolverInput {
  /** 'pts-fee' — target sell price, ₹/W. */
  sellPricePerWatt: number;
  /** 'pts-tenure' — years. */
  tenureYears: number;
  /** 'pts-xirr' — customer XIRR to beat, PERCENT. */
  targetXirrPct: number;
  /** 'pts-refund' — refund % at tenure end, PERCENT (0-100). */
  refundPct: number;
}

export interface PriceTargetSolverResult {
  /** Solved credit rate, ₹/unit. */
  creditRatePerUnit: number;
  /** Exact XIRR achieved at the solved credit rate, percent. */
  achievedXirrPct: number;
  /** fee - ₹40,000/kW (the Python literal ₹40/W reference cost), ₹/kW. */
  marginVsReferenceCostPerKw: number;
  /** Annual ₹/kW credit stream at the solved credit rate, years 1..tenure. */
  creditStream: number[];
}

export function solvePriceTarget(
  input: PriceTargetSolverInput,
  a: PriceTargetSolverAssumptions,
): PriceTargetSolverResult {
  const fee = input.sellPricePerWatt * 1000; // ₹/W -> ₹/kW
  const tenure = Math.trunc(input.tenureYears);
  const want = input.targetXirrPct;
  const rf = (input.refundPct || 0) / 100;
  const ustep = a.mirrorUserStep ? a.hostStepPct : a.userStepPct;

  function xirrAt(cr: number): number {
    const stream: number[] = [];
    for (let y = 1; y <= tenure; y++) {
      stream.push(
        a.promisedUnitsPerKwDay *
          365 *
          Math.pow(1 - a.degradationPct, y - 1) *
          cr *
          stepFactor(y, a.stepEveryYears, ustep),
      );
    }
    const ucf: number[] = [-fee * (1 + a.onboardingFeePct)];
    stream.forEach((v, idx) => {
      const y = idx + 1;
      ucf.push(v + (y === tenure ? fee * rf : 0));
    });
    return 100 * irr(ucf);
  }

  let lo = 1.0;
  let hi = 30.0;
  let cr: number;
  if (xirrAt(lo) > want) {
    cr = lo;
  } else if (xirrAt(hi) < want) {
    cr = hi;
  } else {
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (xirrAt(mid) < want) lo = mid;
      else hi = mid;
    }
    cr = (lo + hi) / 2;
  }

  const achieved = xirrAt(cr);
  const margin = fee - 40000; // Python literal: 40000 = ₹40/W * 1000, not the live capex assumption

  const creditStream: number[] = [];
  for (let y = 1; y <= tenure; y++) {
    creditStream.push(
      a.promisedUnitsPerKwDay *
        365 *
        Math.pow(1 - a.degradationPct, y - 1) *
        cr *
        stepFactor(y, a.stepEveryYears, ustep),
    );
  }

  return {
    creditRatePerUnit: cr,
    achievedXirrPct: achieved,
    marginVsReferenceCostPerKw: margin,
    creditStream,
  };
}
