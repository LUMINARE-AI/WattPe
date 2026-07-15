import { irr } from "@/lib/pricing-engine/core/irr";

/**
 * Port of the Python engine's Decoder/Validator tab (dash_studio_v6.py:1088-1170).
 * Given partial real-world project data (kW, monthly kWh OR direct generation,
 * total fee OR fee/W, degradation, onboarding %, refund %), reverse-solves for
 * whichever ONE of {credit rate, tenure, achieved XIRR} the caller asks for.
 *
 * Deviation from the Python source: the original reads `data['a']` (the raw,
 * un-fractionalized `vals` dict stashed by `compute()`) only for the SG
 * benchmark inside `update_decoder`; degradation/onboarding/refund here are
 * always supplied directly as PERCENT inputs (matching the Dash number
 * fields `dec-deg`, `dec-onb`, `dec-refund`), so no double `/100` ambiguity
 * exists in this port.
 */

export type DecoderSolveFor = "credit" | "tenure" | "target";

export interface DecoderInput {
  /** 'dec-kw' — kW reserved. */
  kwReserved: number;
  /** 'dec-kwh-month' — monthly production, kWh (whole plant). 0/undefined -> use genDirectUnitsPerKwDay. */
  monthlyProductionKwh?: number;
  /** 'dec-gen-direct' — generation directly, units/kW/day. Used only if monthlyProductionKwh is unset/0. */
  genDirectUnitsPerKwDay?: number;
  /** 'dec-fee-total' — reservation fee, ₹ total. 0/undefined -> use feePerWatt. */
  feeTotal?: number;
  /** 'dec-fee-w' — fee per watt, ₹/W. Used only if feeTotal is unset/0. */
  feePerWatt?: number;
  /** 'dec-deg' — degradation assumption, PERCENT (e.g. 1.0 for 1%/yr). */
  degradationPct: number;
  /** 'dec-onb' — onboarding fee assumption, PERCENT (e.g. 1.0 for 1%). */
  onboardingFeePct: number;
  /** 'dec-refund' — refund % at tenure end, PERCENT (0 if none). */
  refundPct: number;
  /** 'dec-solve-for' — which one unknown to solve for. */
  solveFor: DecoderSolveFor;
  /** 'dec-credit' — ₹/unit, ignored when solveFor === 'credit'. Defaults to 5.5 like the Python UI default. */
  creditRatePerUnit?: number;
  /** 'dec-tenure' — years, ignored when solveFor === 'tenure'. Defaults to 15. */
  tenureYears?: number;
  /** 'dec-target' — target XIRR percent, ignored when solveFor === 'target'. Defaults to 11.5. */
  targetXirrPct?: number;
}

export interface DecoderResult {
  /** Implied generation, units/kW/day. */
  impliedGenUnitsPerKwDay: number;
  /** Implied fee per watt, ₹/W. */
  impliedFeePerWatt: number;
  /** Human-readable solved-value label, e.g. '₹5.43/unit', '12.3 years', '11.02% (exact XIRR)'. */
  solvedLabel: string;
  /** The raw solved number (₹/unit, years, or XIRR percent depending on solveFor). */
  solvedValue: number;
  /** SundayGrids benchmark XIRR at this project's implied generation, percent. */
  sundayGridsBenchmarkXirrPct: number;
  /** Human-readable comparison line vs the SundayGrids benchmark. */
  vsSundayGridsLabel: string;
  /** Reconstructed ₹/kW credit stream used for the solved scenario (for charting). */
  creditStream: number[];
  /** Error message when required inputs are missing (mirrors the Python tab's early returns). */
  error?: string;
}

/** Prorated credit stream for a possibly-fractional tenure — mirrors Python's `stream_for()`. */
function streamFor(gen: number, degradationPct: number, credit: number, tenure: number): number[] {
  const whole = Math.trunc(tenure);
  const frac = tenure - whole;
  const s: number[] = [];
  for (let y = 1; y <= whole; y++) {
    s.push(gen * 365 * Math.pow(1 - degradationPct, y - 1) * credit);
  }
  if (frac > 1e-9) {
    s.push(gen * 365 * frac * Math.pow(1 - degradationPct, whole) * credit); // prorated partial final year
  }
  return s;
}

/** Underwriting cashflow for a fee/credit/tenure combo — mirrors Python's `ucf_for()`. */
function ucfFor(
  gen: number,
  degradationPct: number,
  onboardingFraction: number,
  refundFraction: number,
  fee: number,
  credit: number,
  tenure: number,
): number[] {
  const s = streamFor(gen, degradationPct, credit, tenure);
  const nPeriods = s.length;
  const ucf: number[] = [-fee * (1 + onboardingFraction)];
  s.forEach((v, i) => {
    ucf.push(v + (i === nPeriods - 1 ? fee * refundFraction : 0));
  });
  return ucf;
}

/**
 * SundayGrids external benchmark (dash_studio_v6.py:221 `SG_XIRR`, as reconstructed literally
 * inside the Decoder tab at v6:1157): a fixed ₹56,000/kW fee, 5.2 ₹/unit credit, 15-year flat
 * tenure, at 1% onboarding — the only free variables are the project's own generation and
 * degradation. Onboarding is intentionally NOT parameterized: it is fixed at the benchmark's
 * own 1% (the Python literal `1.01`), independent of the caller's own onboarding assumption.
 */
export function sundayGridsBenchmarkXirr(
  genUnitsPerKwDay: number,
  degradationPct: number,
): number {
  const cashflows: number[] = [-56000 * 1.01];
  for (let y = 1; y <= 15; y++) {
    cashflows.push(genUnitsPerKwDay * 365 * Math.pow(1 - degradationPct, y - 1) * 5.2);
  }
  return 100 * irr(cashflows);
}

export function decodeProject(input: DecoderInput): DecoderResult {
  const empty = (error: string): DecoderResult => ({
    impliedGenUnitsPerKwDay: 0,
    impliedFeePerWatt: 0,
    solvedLabel: "",
    solvedValue: NaN,
    sundayGridsBenchmarkXirrPct: NaN,
    vsSundayGridsLabel: "",
    creditStream: [],
    error,
  });

  if (!input.kwReserved || input.kwReserved <= 0) return empty("Enter kW reserved");

  const deg = (input.degradationPct || 0) / 100;
  const onb = (input.onboardingFeePct || 0) / 100;
  const refund = (input.refundPct || 0) / 100;

  const gen =
    input.monthlyProductionKwh && input.monthlyProductionKwh > 0
      ? input.monthlyProductionKwh / input.kwReserved / 30.42
      : input.genDirectUnitsPerKwDay || 0;
  if (gen <= 0) {
    return empty("Enter kWh/month or generation directly");
  }

  let feePerKw: number;
  if (input.feeTotal && input.feeTotal > 0) {
    feePerKw = input.feeTotal / input.kwReserved;
  } else if (input.feePerWatt && input.feePerWatt > 0) {
    feePerKw = input.feePerWatt * 1000;
  } else {
    return {
      impliedGenUnitsPerKwDay: gen,
      impliedFeePerWatt: 0,
      solvedLabel: "",
      solvedValue: NaN,
      sundayGridsBenchmarkXirrPct: NaN,
      vsSundayGridsLabel: "",
      creditStream: [],
      error: "Enter reservation fee or ₹/W",
    };
  }

  let solvedValue: number;
  let solvedLabel: string;
  let tenureForPlot: number;
  let creditForPlot: number;

  if (input.solveFor === "credit") {
    const tenure = input.tenureYears || 15;
    const target = (input.targetXirrPct ?? 11.5) / 100;
    let lo = 0.5;
    let hi = 30.0;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const x = 100 * irr(ucfFor(gen, deg, onb, refund, feePerKw, mid, tenure));
      if (x < target * 100) lo = mid;
      else hi = mid;
    }
    solvedValue = (lo + hi) / 2;
    solvedLabel = `₹${solvedValue.toFixed(2)}/unit`;
    tenureForPlot = tenure;
    creditForPlot = solvedValue;
  } else if (input.solveFor === "tenure") {
    const credit = input.creditRatePerUnit || 5.5;
    const target = (input.targetXirrPct ?? 11.5) / 100;
    let lo = 0.5;
    let hi = 25.0;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const x = 100 * irr(ucfFor(gen, deg, onb, refund, feePerKw, credit, mid));
      // XIRR rises with tenure -> raise lower bound when XIRR too low
      if (x < target * 100) lo = mid;
      else hi = mid;
    }
    solvedValue = (lo + hi) / 2;
    solvedLabel = `${solvedValue.toFixed(1)} years`;
    tenureForPlot = Math.round(solvedValue);
    creditForPlot = credit;
  } else {
    const credit = input.creditRatePerUnit || 5.5;
    const tenure = input.tenureYears || 15;
    solvedValue = 100 * irr(ucfFor(gen, deg, onb, refund, feePerKw, credit, tenure));
    solvedLabel = `${solvedValue.toFixed(2)}% (exact XIRR)`;
    tenureForPlot = tenure;
    creditForPlot = credit;
  }

  const sg = sundayGridsBenchmarkXirr(gen, 0.01);
  const vsSundayGridsLabel =
    input.solveFor === "target"
      ? `${(solvedValue - sg >= 0 ? "+" : "") + (solvedValue - sg).toFixed(2)}pp vs SundayGrids ${sg.toFixed(2)}%`
      : `SundayGrids benchmark at this generation: ${sg.toFixed(2)}% XIRR`;

  return {
    impliedGenUnitsPerKwDay: gen,
    impliedFeePerWatt: feePerKw / 1000,
    solvedLabel,
    solvedValue,
    sundayGridsBenchmarkXirrPct: sg,
    vsSundayGridsLabel,
    creditStream: streamFor(gen, deg, creditForPlot || 5.5, tenureForPlot),
  };
}
