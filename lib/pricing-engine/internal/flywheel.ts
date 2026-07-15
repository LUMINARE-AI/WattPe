/**
 * Port of the Python engine's `flywheel_df()` (dash_studio_v6.py:213-219): simulates
 * recycling reservation-fee proceeds into new project capacity over successive
 * 6-month cycles, to project a 5-year equity ROE (see `RunModelSummary.flywheelCagr`
 * for the closed-form seed this same recurrence produces inside `runModel()`).
 */
export interface FlywheelCycleRow {
  cycle: number;
  /** Half-years elapsed (cycle / 2), matching the Python 'year' column. */
  year: number;
  /** 'projects' — number of new projects funded this cycle. */
  projectsThisCycle: number;
  /** 'cum_kW' — cumulative kW funded across all cycles so far. */
  cumulativeKw: number;
  /** 'pool' — cash pool remaining after this cycle's funding + paybacks. */
  poolAfter: number;
}

/**
 * @param equityPerCycle 'eq' — equity required to fund one project.
 * @param backAtT0 'back' — day-0 cash returned per funded project.
 * @param eb1 per-kW EBITDA-minus-financing-service seed used for the "flywheel bonus".
 * @param kwPerProject 'kwp' — kW capacity per project.
 * @param cap 'cap' — max projects fundable per cycle (default 4).
 * @param cycles number of cycles to simulate (default 10, i.e. 5 years at 2 cycles/yr).
 * @param startPool 'start' — starting pool; falls back to equityPerCycle if falsy (0 or
 *   undefined), matching the Python `start or eq` truthiness fallback.
 */
export function flywheelDf(
  equityPerCycle: number,
  backAtT0: number,
  eb1: number,
  kwPerProject: number,
  cap = 4,
  cycles = 10,
  startPool?: number,
): FlywheelCycleRow[] {
  let pool = startPool || equityPerCycle;
  let cum = 0;
  const rows: FlywheelCycleRow[] = [];
  for (let c = 1; c <= cycles; c++) {
    const nProjects = Math.min(cap, Math.floor(pool / equityPerCycle));
    const ebi = (cum * eb1) / 2;
    const poolAfter = pool - nProjects * equityPerCycle + nProjects * backAtT0 + ebi;
    cum += nProjects * kwPerProject;
    rows.push({
      cycle: c,
      year: c / 2,
      projectsThisCycle: nProjects,
      cumulativeKw: cum,
      poolAfter,
    });
    pool = poolAfter;
  }
  return rows;
}
