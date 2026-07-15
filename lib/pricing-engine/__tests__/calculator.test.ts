import { describe, expect, it } from "vitest";
import { forSavingsForecast } from "@/lib/pricing-engine/public/calculator";
import { toEngineAssumptions } from "@/lib/pricing-engine/transforms";
import type { PlanInput } from "@/lib/pricing-engine/types";

const assumptions = toEngineAssumptions({
  genUnitsPerKwDay: 4.5,
  promisedUnitsPerKwDay: 4.0,
  degradationPct: 1.0,
  stepEveryYears: 5,
  userStepPct: 10.0,
  onboardingFeePct: 1.0,
  maxYears: 15,
});

const growth15: PlanInput = {
  code: "GROWTH_15",
  name: "Growth-15",
  tenureYears: 15,
  creditRatePerUnit: 4.0,
  targetXirrPct: 11.5,
  refundPct: 0,
};

describe("forSavingsForecast", () => {
  it("sizes capacity so year-1 monthly savings match the desired share of the bill", () => {
    const result = forSavingsForecast(
      { avgMonthlyBill: 4000, desiredSavingsPct: 75 },
      growth15,
      assumptions,
    );
    expect(result.monthlySavings).toBeCloseTo(3000, 4);
    expect(result.reservedCapacityKW).toBeGreaterThan(0);
    expect(result.reservationFee).toBeCloseTo(
      result.reservedCapacityKW * result.feePerKW,
      6,
    );
  });

  it("produces a 15-entry, monotonically increasing cumulative savings series", () => {
    const result = forSavingsForecast(
      { avgMonthlyBill: 4000, desiredSavingsPct: 75 },
      growth15,
      assumptions,
    );
    expect(result.cumulativeSavingsByYear).toHaveLength(15);
    const values = result.cumulativeSavingsByYear.map((r) => r.cumulativeSavings);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });

  it("scales capacity linearly with the desired savings percentage", () => {
    const half = forSavingsForecast(
      { avgMonthlyBill: 4000, desiredSavingsPct: 50 },
      growth15,
      assumptions,
    );
    const full = forSavingsForecast(
      { avgMonthlyBill: 4000, desiredSavingsPct: 100 },
      growth15,
      assumptions,
    );
    expect(full.reservedCapacityKW).toBeCloseTo(half.reservedCapacityKW * 2, 6);
  });
});
