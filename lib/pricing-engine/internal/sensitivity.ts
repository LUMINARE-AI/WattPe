import { runModel } from "@/lib/pricing-engine/internal/runModel";
import type { RunModelAssumptions, RunModelPlanInput } from "@/lib/pricing-engine/types";

/**
 * Port of the Python engine's Sensitivity tab (dash_studio_v6.py:873-912): a
 * tornado analysis (each driver perturbed +/-10%, recording the NPV delta vs
 * base) and a host-tariff x credit-shift NPV heatmap grid.
 *
 * Deviation: the Python callback perturbs raw percent fields on `data['a']`
 * (e.g. `av['mkt'] = a['mkt']*0.9`) before re-running them through `A()`. This
 * port perturbs the already-fractional `RunModelAssumptions` fields directly
 * (e.g. `marketingPct * 0.9`) — mathematically identical, since scaling by a
 * constant commutes with the later `/100` conversion.
 */

export interface TornadoBar {
  driver: string;
  /** NPV at -10% minus base NPV (can be positive or negative). */
  low: number;
  /** NPV at +10% minus base NPV. */
  high: number;
}

type NumericAssumptionKey = Extract<
  {
    [K in keyof RunModelAssumptions]: RunModelAssumptions[K] extends number ? K : never;
  }[keyof RunModelAssumptions],
  string
>;

const TORNADO_DRIVERS: [NumericAssumptionKey, string][] = [
  ["hostTariffPerUnit", "Host tariff"],
  ["capexPerWatt", "Capex ₹/W"],
  ["genUnitsPerKwDay", "Generation"],
  ["marketingPct", "Marketing %"],
  ["omPerKwYear", "O&M"],
  ["hostStepPct", "Step-up %"],
];

export function tornadoAnalysis(
  assumptions: RunModelAssumptions,
  plans: RunModelPlanInput[],
): TornadoBar[] {
  const baseNpv = runModel(assumptions, plans).summary.npv;

  return TORNADO_DRIVERS.map(([key, label]) => {
    const base = assumptions[key];
    const lowAssumptions: RunModelAssumptions = { ...assumptions, [key]: base * 0.9 };
    const highAssumptions: RunModelAssumptions = { ...assumptions, [key]: base * 1.1 };
    const lowNpv = runModel(lowAssumptions, plans).summary.npv;
    const highNpv = runModel(highAssumptions, plans).summary.npv;
    return { driver: label, low: lowNpv - baseNpv, high: highNpv - baseNpv };
  });
}

/** 'tars' — host tariff grid points, ₹/unit (np.arange(4.5, 7.01, 0.5)). */
export const HEATMAP_TARIFFS = [4.5, 5.0, 5.5, 6.0, 6.5, 7.0];
/** 'shifts' — credit shift grid points, ₹/unit, applied to ALL plans (np.arange(-1.0, 1.01, 0.25)). */
export const HEATMAP_CREDIT_SHIFTS = [-1.0, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1.0];

export interface HeatmapResult {
  tariffs: number[];
  creditShifts: number[];
  /** [shiftIndex][tariffIndex] -> NPV in ₹ lakh. */
  npvGridLakh: number[][];
}

export function tariffCreditHeatmap(
  assumptions: RunModelAssumptions,
  plans: RunModelPlanInput[],
): HeatmapResult {
  const z: number[][] = [];
  for (const s of HEATMAP_CREDIT_SHIFTS) {
    const row: number[] = [];
    for (const t of HEATMAP_TARIFFS) {
      const av: RunModelAssumptions = { ...assumptions, hostTariffPerUnit: t };
      const pl: RunModelPlanInput[] = plans.map((p) => ({ ...p, credit: p.credit + s }));
      const { summary } = runModel(av, pl);
      row.push(summary.npv / 1e5);
    }
    z.push(row);
  }
  return { tariffs: HEATMAP_TARIFFS, creditShifts: HEATMAP_CREDIT_SHIFTS, npvGridLakh: z };
}
