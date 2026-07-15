import { computePlanEconomics } from "@/lib/pricing-engine/planEconomics";
import type { EngineAssumptions, PlanInput } from "@/lib/pricing-engine/types";

const DAYS_PER_MONTH = 30.44;

export interface SavingsForecastInput {
  /** Customer's current average monthly electricity bill, ₹. */
  avgMonthlyBill: number;
  /** Desired share of the bill to offset with solar credits, 0-100. */
  desiredSavingsPct: number;
}

export interface SavingsForecastResult {
  reservedCapacityKW: number;
  monthlyEnergyProductionKWh: number;
  monthlySavings: number;
  annualSavings: number;
  /** Cumulative savings by end of each year, for years 1..tenureYears. */
  cumulativeSavingsByYear: { year: number; cumulativeSavings: number }[];
  reservationFee: number;
  feePerKW: number;
  realizedXirrPct: number;
}

/**
 * Inverts the plan's credit-rate economics to size a reservation from a bill
 * amount: solves for the capacity (kW) whose year-1 monthly credit matches the
 * customer's desired savings, then reports the plant-level generation and the
 * savings trajectory over the plan's tenure. This inverse doesn't exist in the
 * Python source — it's built on top of `computePlanEconomics`, the shared
 * source of truth for fee/credit-stream math.
 */
export function forSavingsForecast(
  input: SavingsForecastInput,
  plan: PlanInput,
  assumptions: EngineAssumptions,
): SavingsForecastResult {
  const economics = computePlanEconomics(plan, assumptions);

  const desiredMonthlySavings =
    input.avgMonthlyBill * (input.desiredSavingsPct / 100);

  // Year 1's per-kW credit, spread evenly across 12 months.
  const year1CreditPerKW = economics.creditStream[1] ?? 0;
  const monthlyCreditPerKW = year1CreditPerKW / 12;

  const reservedCapacityKW =
    monthlyCreditPerKW > 0 ? desiredMonthlySavings / monthlyCreditPerKW : 0;

  const monthlyEnergyProductionKWh =
    reservedCapacityKW * assumptions.genUnitsPerKwDay * DAYS_PER_MONTH;

  const monthlySavings = reservedCapacityKW * monthlyCreditPerKW;
  const annualSavings = reservedCapacityKW * year1CreditPerKW;

  let cumulative = 0;
  const cumulativeSavingsByYear = Array.from(
    { length: economics.tenureYears },
    (_, i) => i + 1,
  ).map((year) => {
    cumulative += reservedCapacityKW * (economics.creditStream[year] ?? 0);
    return { year, cumulativeSavings: cumulative };
  });

  return {
    reservedCapacityKW,
    monthlyEnergyProductionKWh,
    monthlySavings,
    annualSavings,
    cumulativeSavingsByYear,
    reservationFee: reservedCapacityKW * economics.feePerKW,
    feePerKW: economics.feePerKW,
    realizedXirrPct: economics.realizedXirrPct,
  };
}
