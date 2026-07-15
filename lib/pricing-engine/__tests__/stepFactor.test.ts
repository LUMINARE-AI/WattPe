import { describe, expect, it } from "vitest";
import { stepFactor } from "@/lib/pricing-engine/core/stepFactor";

describe("stepFactor", () => {
  it("stays at 1.0 within the first step window", () => {
    expect(stepFactor(1, 5, 0.1)).toBeCloseTo(1.0);
    expect(stepFactor(5, 5, 0.1)).toBeCloseTo(1.0);
  });

  it("steps up once every `every` years", () => {
    expect(stepFactor(6, 5, 0.1)).toBeCloseTo(1.1);
    expect(stepFactor(10, 5, 0.1)).toBeCloseTo(1.1);
    expect(stepFactor(11, 5, 0.1)).toBeCloseTo(1.21);
    expect(stepFactor(15, 5, 0.1)).toBeCloseTo(1.21);
  });

  it("returns 1.0 for a 0% step regardless of year", () => {
    expect(stepFactor(15, 5, 0)).toBeCloseTo(1.0);
  });
});
