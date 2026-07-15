/**
 * Bisection-based IRR, ported 1:1 from the Python engine's `irr()`
 * (dash_studio_v6.py:24-32). This is an annual-period bisection IRR, not a
 * calendar-dated true XIRR — every plan number downstream was derived using
 * this exact math, so it must not be "corrected" to a date-based XIRR.
 */
export function irr(cashflows: number[], lo = -0.95, hi = 5.0): number {
  const f = (r: number) =>
    cashflows.reduce((sum, c, t) => sum + c / Math.pow(1 + r, t), 0);

  if (f(lo) * f(hi) > 0) return NaN;

  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(lo) * f(mid) < 0) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return (lo + hi) / 2;
}
