import type { RunModelAssumptions, RunModelPlanInput } from "@/lib/pricing-engine/types";

/** Mirrors the Python `DEF` dict (dash_studio_v6.py:224-229), converted via `A()` into
 * engine-ready fractions and camelCase field names. */
export const DEFAULT_ASSUMPTIONS: RunModelAssumptions = {
  kw: 250,
  capexPerWatt: 40.0,
  genUnitsPerKwDay: 4.5,
  promisedUnitsPerKwDay: 4.0,
  degradationPct: 0.01,
  hostTariffPerUnit: 5.5,
  stepEveryYears: 5,
  hostStepPct: 0.1,
  mirrorUserStep: true,
  userStepPct: 0.1,
  omPerKwYear: 500,
  omEscalationPct: 0.04,
  insurancePerKwYear: 150,
  platformOpexPerKwYear: 300,
  marketingPct: 0.04,
  onboardingFeePct: 0.01,
  sellOutMonths: 6,
  depositMonths: 12,
  ltvPct: 0,
  debtRatePct: 0.1,
  debtTenorYears: 10,
  fdRatePct: 0.072,
  taxRatePct: 0.25,
  discountRatePct: 0.12,
  equityAtT0: 10500000,
  carveOut: true,
  projectType: "new",
  years: 15,
  legacyPremiumPct: 0.05,
  financingType: "equity",
  profitShareSplitUsPct: 0.6,
  profitShareDiminishing: false,
  profitShareBuyoutYears: 7,
};

/** Mirrors the Python `DEF_PLANS` list (dash_studio_v6.py:230-234). */
export const DEFAULT_PLANS: RunModelPlanInput[] = [
  { plan: "Growth-15", tenure: 15, credit: 4.0, target: 11.5, refund: 0, mix: 50, resell: false },
  { plan: "Flexi-10", tenure: 10, credit: 4.5, target: 11.0, refund: 0, mix: 25, resell: false },
  { plan: "Short-3", tenure: 3, credit: 7.0, target: 10.0, refund: 0, mix: 15, resell: true },
  { plan: "Assured-15", tenure: 15, credit: 3.4, target: 10.5, refund: 100, mix: 10, resell: false },
];

export function fmtINR(v: number, opts?: { compact?: boolean }): string {
  if (!Number.isFinite(v)) return "—";
  if (opts?.compact) {
    const abs = Math.abs(v);
    if (abs >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
    if (abs >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
    if (abs >= 1e3) return `₹${(v / 1e3).toFixed(1)} k`;
  }
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
}

export function fmtLakh(v: number): string {
  if (!Number.isFinite(v)) return "—";
  return `₹${(v / 1e5).toFixed(1)} L`;
}

export function fmtPct(v: number, digits = 1): string {
  if (!Number.isFinite(v)) return "—";
  return `${(v * 100).toFixed(digits)}%`;
}

export function fmtPctPoints(v: number, digits = 2): string {
  if (!Number.isFinite(v)) return "—";
  return `${v.toFixed(digits)}%`;
}

export function fmtNum(v: number, digits = 1): string {
  if (!Number.isFinite(v)) return "—";
  return v.toLocaleString("en-IN", { maximumFractionDigits: digits });
}

export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];
