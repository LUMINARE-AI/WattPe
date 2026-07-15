import { describe, expect, it } from "vitest";
import { irr } from "@/lib/pricing-engine/core/irr";

describe("irr", () => {
  it("finds ~10% for a simple single-payout investment", () => {
    // -100 today, 110 back in year 1 => 10% IRR
    expect(irr([-100, 110])).toBeCloseTo(0.1, 6);
  });

  it("finds ~0% when cashflows sum to the initial outlay", () => {
    expect(irr([-100, 50, 50])).toBeCloseTo(0, 4);
  });

  it("returns NaN when there is no sign change (all positive)", () => {
    expect(irr([100, 50, 50])).toBeNaN();
  });
});
