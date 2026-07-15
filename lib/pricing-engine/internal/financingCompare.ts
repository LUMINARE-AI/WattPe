import { runModel } from "@/lib/pricing-engine/internal/runModel";
import type { FinancingType, RunModelAssumptions, RunModelPlanInput } from "@/lib/pricing-engine/types";

/**
 * Port of the Python engine's Financing Structure Comparison table
 * (dash_studio_v6.py:774-801): runs the SAME assumptions through 4 financing
 * scenarios (100% equity / debt / profit-share flat / profit-share
 * diminishing) so the effect of financing structure alone can be compared.
 */
export interface FinancingScenarioRow {
  structureLabel: string;
  financingType: FinancingType;
  profitShareDiminishing: boolean;
  equityNeeded: number;
  npv: number;
  nominal15yr: number;
  cashOnCash: number;
  /** Sum of interest paid (debt) or total profit-share distributions (profit-share); 0 for equity. */
  trueFinancingCost: number;
}

export function compareFinancingStructures(
  assumptions: RunModelAssumptions,
  plans: RunModelPlanInput[],
): FinancingScenarioRow[] {
  const ltvPct100 = (assumptions.ltvPct * 100).toFixed(0);
  const scenarios: [string, FinancingType, boolean][] = [
    ["100% Equity", "equity", false],
    [`${ltvPct100}% Debt (EMI)`, "debt", false],
    [`${ltvPct100}% Profit-Share (flat share)`, "profitshare", false],
    [
      `${ltvPct100}% Profit-Share (diminishing, ${assumptions.profitShareBuyoutYears}y buyout)`,
      "profitshare",
      true,
    ],
  ];

  return scenarios.map(([label, financingType, diminishing]) => {
    const scenarioAssumptions: RunModelAssumptions = {
      ...assumptions,
      financingType,
      profitShareDiminishing: diminishing,
    };
    const { rows, summary } = runModel(scenarioAssumptions, plans);
    const trueCost =
      financingType === "debt"
        ? rows.reduce((s, r) => s + r.interest, 0)
        : financingType === "profitshare"
          ? summary.profitSharePayTotal
          : 0;

    return {
      structureLabel: label,
      financingType,
      profitShareDiminishing: diminishing,
      equityNeeded: summary.equityNeed,
      npv: summary.npv,
      nominal15yr: summary.nominal,
      cashOnCash: summary.cashOnCash,
      trueFinancingCost: trueCost,
    };
  });
}
