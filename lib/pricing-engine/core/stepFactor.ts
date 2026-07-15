/**
 * Ported 1:1 from the Python engine's `step_factor()` (dash_studio_v6.py:34-35).
 * Returns the cumulative step-up multiplier for a given year: pct compounds
 * once every `everyYears` years, e.g. every=5, pct=0.10 gives 1.0 for years
 * 1-5, 1.10 for years 6-10, 1.21 for years 11-15.
 */
export function stepFactor(year: number, everyYears: number, pct: number): number {
  const every = Math.max(1, Math.trunc(everyYears));
  const steps = Math.floor((year - 1) / every);
  return Math.pow(1 + pct, steps);
}
