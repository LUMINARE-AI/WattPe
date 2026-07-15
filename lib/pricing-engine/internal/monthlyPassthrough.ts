/**
 * Port of the Python engine's Monthly Pass-Through tab (dash_studio_v6.py:392-394,
 * 999-1048): prices credits off ACTUAL metered monthly generation instead of an
 * assumed daily average — the customer gets a fixed share of whatever the plant
 * actually produced that month, at a fixed ₹/unit rate. Includes a smoothing
 * calculation (flat monthly credit) and the max working-capital buffer needed
 * to cover lean months, trying every possible rolling-window start month.
 */

/** 'MONTHS' — fiscal-year month labels, Apr-Mar. */
export const MONTHS = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
] as const;

/** 'MONTH_DAYS' — days per fiscal month, aligned with MONTHS. */
export const MONTH_DAYS = [30, 31, 30, 31, 31, 30, 31, 30, 31, 31, 28, 31];

/** 'DEFAULT_GEN' — default sample monthly generation (kWh, whole plant), aligned with MONTHS. */
export const DEFAULT_GEN = [
  2490, 2164, 1924.78, 1370.11, 1602.72, 1950.55, 1724.08, 1553.53, 1446.82, 1330.25, 1693.44,
  2283,
];

export interface MonthlyPassthroughInput {
  /** 'pt-kw' — site capacity, kW. */
  siteKw: number;
  /** 'pt-share' — share of actual generation credited to customer, PERCENT (0-100). */
  sharePct: number;
  /** 'pt-credit' — credit rate, ₹/unit. */
  creditRatePerUnit: number;
  /** 'pt-tariff' — host tariff, ₹/unit. */
  hostTariffPerUnit: number;
  /** 'pt-target' — target customer XIRR, PERCENT. Unused in the Python fee formula beyond
   *  discounting (kept for interface parity with the Dash inputs). */
  targetXirrPct: number;
  /** 'pt-tenure' — years. */
  tenureYears: number;
  /** 'pt-monthly-table' gen column — 12 months of actual generation, kWh, whole plant, in MONTHS order. */
  monthlyGenerationKwh: number[];
}

export interface MonthlyPassthroughResult {
  /** Annual average generation, units/kW/day. */
  annualAvgUnitsPerKwDay: number;
  /** Auto-priced fee, ₹/kW, discounted at targetXirrPct with the Python's hardcoded 1% degradation. */
  autoPricedFeePerKw: number;
  /** fee - ₹40,000/kW (new-build ₹40/W reference). */
  marginPerKwNewBuild: number;
  /** fee - ₹28,000/kW (₹28/W acquisition reference). */
  marginPerKwAcquisition: number;
  /** Generation per kW per month, aligned with MONTHS. */
  perMonthGenPerKw: number[];
  /** Year-1 customer credit per kW reserved, per month (raw seasonal swing), aligned with MONTHS. */
  userCreditsMonth1PerKw: number[];
  /** Best (highest) month's credit, ₹/kW. */
  swingBestPerKw: number;
  /** Worst (lowest) month's credit, ₹/kW. */
  swingWorstPerKw: number;
  /** (best/mean - 1) * 100, percent — the Python swing label's ± figure. */
  swingPct: number;
  /** Flat monthly credit if smoothed evenly across the year, ₹/kW. */
  flatMonthlyCreditPerKw: number;
  /** Max working-capital buffer needed to cover the smoothing, ₹/kW (rolling-window worst case, every start month tried). */
  maxBufferNeededPerKw: number;
}

/** Hardcoded in the Python passthrough tab regardless of any other degradation input. */
const PASSTHROUGH_DEGRADATION = 0.01;

export function computeMonthlyPassthrough(input: MonthlyPassthroughInput): MonthlyPassthroughResult {
  const kw = input.siteKw;
  const share = input.sharePct / 100;
  const credit = input.creditRatePerUnit;
  const target = input.targetXirrPct / 100;
  const tenure = Math.trunc(input.tenureYears);
  const deg = PASSTHROUGH_DEGRADATION;

  const gens = input.monthlyGenerationKwh;
  const totalKwh = gens.reduce((s, v) => s + v, 0);
  const avgUpkd = totalKwh / kw / 365;
  const perMonthGenPerKw = gens.map((g) => g / kw);
  const userCreditsMonth1PerKw = gens.map((g) => (g / kw) * share * credit);
  const annUserUnits = avgUpkd * 365 * share;

  let fee = 0;
  for (let y = 1; y <= tenure; y++) {
    fee += (annUserUnits * Math.pow(1 - deg, y - 1) * credit) / Math.pow(1 + target, y);
  }

  const marginNew = fee - 40000;
  const marginAcq = fee - 28000;

  const mean = userCreditsMonth1PerKw.reduce((s, v) => s + v, 0) / userCreditsMonth1PerKw.length;
  const best = Math.max(...userCreditsMonth1PerKw);
  const worstMonth = Math.min(...userCreditsMonth1PerKw);
  const swingPct = (best / mean - 1) * 100;

  // Rolling buffer needed, trying every start month.
  let worst = 0;
  for (let start = 0; start < 12; start++) {
    let cum = 0;
    let w = 0;
    for (let i = 0; i < 12; i++) {
      cum += userCreditsMonth1PerKw[(start + i) % 12] - mean;
      w = Math.min(w, cum);
    }
    worst = Math.min(worst, w);
  }

  return {
    annualAvgUnitsPerKwDay: avgUpkd,
    autoPricedFeePerKw: fee,
    marginPerKwNewBuild: marginNew,
    marginPerKwAcquisition: marginAcq,
    perMonthGenPerKw,
    userCreditsMonth1PerKw,
    swingBestPerKw: best,
    swingWorstPerKw: worstMonth,
    swingPct,
    flatMonthlyCreditPerKw: mean,
    maxBufferNeededPerKw: -worst,
  };
}
