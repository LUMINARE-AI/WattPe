import { describe, expect, it } from "vitest";
import { flywheelDf } from "@/lib/pricing-engine/internal/flywheel";

describe("flywheelDf — hand-verified against the Python recurrence", () => {
  // eq=100, back=150, eb1=0, kwp=250, cap=4, start=250 (2.5x eq): cycle 1 funds
  // min(4, floor(250/100))=2 projects, pool = 250 - 2*100 + 2*150 + 0 = 350, cum=500 kW.
  it("cycle 1 funds floor(pool/eq) projects, capped at `cap`", () => {
    const rows = flywheelDf(100, 150, 0, 250, 4, 3, 250);
    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({ cycle: 1, year: 0.5, projectsThisCycle: 2, cumulativeKw: 500, poolAfter: 350 });
  });

  it("caps projects per cycle at `cap` even when the pool could fund more", () => {
    // pool=10000, eq=100 -> floor(10000/100)=100, capped at cap=4.
    const rows = flywheelDf(100, 150, 0, 250, 4, 1, 10000);
    expect(rows[0].projectsThisCycle).toBe(4);
    expect(rows[0].cumulativeKw).toBe(1000);
    // pool = 10000 - 4*100 + 4*150 + 0 = 10200
    expect(rows[0].poolAfter).toBeCloseTo(10200, 6);
  });

  it("falls back to equityPerCycle as the starting pool when startPool is falsy (0 or omitted)", () => {
    const withZero = flywheelDf(500, 700, 0, 250, 4, 1, 0);
    const withUndefined = flywheelDf(500, 700, 0, 250, 4, 1);
    // pool starts at eq=500 -> floor(500/500)=1 project funded.
    expect(withZero[0].projectsThisCycle).toBe(1);
    expect(withUndefined[0].projectsThisCycle).toBe(1);
    expect(withZero[0].poolAfter).toBeCloseTo(withUndefined[0].poolAfter, 9);
  });

  it("the eb1 'flywheel bonus' scales with half of cumulative kW funded so far", () => {
    // eq=100, back=100 (breakeven per project), eb1=2, start=300 -> cycle1 funds 3 projects
    // (floor(300/100)=3, cap=4), cum=750kW, ebi=0 (cum was 0 entering cycle 1).
    // pool after cycle1 = 300 - 3*100 + 3*100 + 0 = 300.
    // cycle2: floor(300/100)=3 (capped at 4), ebi = 750*2/2 = 750.
    // pool after cycle2 = 300 - 3*100 + 3*100 + 750 = 1050.
    const rows = flywheelDf(100, 100, 2, 250, 4, 2, 300);
    expect(rows[0].poolAfter).toBeCloseTo(300, 6);
    expect(rows[1].poolAfter).toBeCloseTo(1050, 6);
    expect(rows[1].cumulativeKw).toBe(1500);
  });

  it("running it against the equity-scenario runModel's flywheel seed produces a sane, non-negative pool", () => {
    // eb1 as produced by the Python default-equity run: (ebitda[1]-emi-ps_pay[1])/kw
    // = (166965.625 - 0 - 0) / 250 = 667.8625
    const eb1 = 166965.625 / 250;
    const eqNeed = 10912643.832201524;
    const back = 11053934.675942408;
    const rows = flywheelDf(eqNeed, back, eb1, 250, 4, 10, 10500000);
    expect(rows).toHaveLength(10);
    for (const row of rows) {
      expect(row.poolAfter).toBeGreaterThan(0);
    }
  });
});
