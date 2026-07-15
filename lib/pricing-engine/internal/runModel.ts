import { irr } from "@/lib/pricing-engine/core/irr";
import { stepFactor } from "@/lib/pricing-engine/core/stepFactor";
import type {
  RunModelAssumptions,
  RunModelOutput,
  RunModelPlanInput,
  RunModelPlanResult,
  RunModelSummary,
  RunModelYearRow,
} from "@/lib/pricing-engine/types";

/**
 * Full port of the Python engine's `run_model()` (dash_studio_v6.py:37-211).
 *
 * This is the single most complex function in the source: it sizes capex and
 * financing (equity / debt / profit-share "Musharaka"), carves out a
 * dedicated capacity slice to service debt EMI or profit-share obligations,
 * prices every plan's revenue stream (including the resell-tranche logic for
 * short auto-resell plans), builds the full cost stack, produces a P&L, a
 * cash flow statement, and a balance sheet (with the `assets - liab_eq =
 * check` identity as a correctness self-check), and finally computes NPV,
 * cash-on-cash, and a flywheel seed value.
 *
 * Every formula below is a direct line-for-line translation of the Python —
 * nothing has been "simplified". Where a deliberate deviation from the exact
 * Python behavior was unavoidable (e.g. JS `x/0 -> Infinity` vs Python's
 * `ZeroDivisionError`), it is called out in a comment at that line.
 */
export function runModel(
  a: RunModelAssumptions,
  plans: RunModelPlanInput[],
): RunModelOutput {
  const n = Math.trunc(a.years);
  const legacy = a.projectType === "legacy";
  const kw = a.kw;
  const capex = kw * a.capexPerWatt * 1000;
  const fintype = a.financingType;
  const financed = a.ltvPct * capex; // % of capex financed, reused for both debt and profit-share
  const isDebt = fintype === "debt" && financed > 0;
  const isPs = fintype === "profitshare" && financed > 0;
  const debt = isDebt ? financed : 0;
  const emi =
    debt > 0
      ? (debt * a.debtRatePct) / (1 - Math.pow(1 + a.debtRatePct, -a.debtTenorYears))
      : 0;
  const netPerKw =
    a.genUnitsPerKwDay * 365 * a.hostTariffPerUnit -
    (a.omPerKwYear + a.insurancePerKwYear + a.platformOpexPerKwYear);

  const yrs: number[] = [];
  for (let y = 1; y <= n; y++) yrs.push(y);

  const hstep = legacy ? 0 : a.hostStepPct;
  const unitsY: Record<number, number> = {};
  const hostT: Record<number, number> = {};
  for (const y of yrs) {
    unitsY[y] = a.promisedUnitsPerKwDay * 365 * Math.pow(1 - a.degradationPct, y - 1);
    hostT[y] = a.hostTariffPerUnit * stepFactor(y, a.stepEveryYears, hstep);
  }
  const ustep = legacy ? 0 : a.mirrorUserStep ? a.hostStepPct : a.userStepPct;

  // Profit-share (ethical/Musharaka-style) financing — see dash_studio_v6.py:55-68 for the
  // full rationale. Financer's return is a % of NET PROFIT from the financed share, never a
  // fixed interest rate; principal is always repaid smoothly over a buyout period (never a
  // lump sum); the DIMINISHING toggle controls whether the revenue SHARE also declines to
  // zero over that period (Diminishing Musharaka) or stays flat while principal still repays.
  const psUs = a.profitShareSplitUsPct; // our share of revenue/profit from the FINANCED portion
  const psRatio = isPs ? a.ltvPct : 0;
  const financerFrac = psRatio * (1 - psUs); // fraction of TOTAL host revenue paid to financer at year 1
  const psDiminishing = Boolean(a.profitShareDiminishing) && isPs;
  const psBuyout = isPs ? Math.max(1, Math.trunc(a.profitShareBuyoutYears)) : null; // repayment tenure, like debt's dtenor

  function fracForYear(y: number): number {
    if (!(isPs && psBuyout !== null && y <= psBuyout)) return 0;
    return psDiminishing
      ? financerFrac * Math.max(0, 1 - (y - 1) / psBuyout)
      : financerFrac;
  }

  /**
   * Revenue-based APPROXIMATION used only to size the EMI-style dedicated capacity carve-out
   * (a bankability/DSCR check). The real cash-flow calc below shares actual NET PROFIT (after
   * credits, opex, and tax) -- true profit-and-loss sharing. Gross revenue here is a
   * deliberately conservative proxy (avoids circularity with the sizing it's used for).
   */
  function psScheduleFor(kwBase: number): Record<number, [number, number]> {
    const sched: Record<number, [number, number]> = {};
    for (const y of yrs) {
      const hostY = kwBase * a.genUnitsPerKwDay * 365 * Math.pow(1 - a.degradationPct, y - 1) * hostT[y];
      const fracY = fracForYear(y);
      const buyback = isPs && psBuyout !== null && y <= psBuyout ? financed / psBuyout : 0;
      sched[y] = [hostY * fracY, buyback];
    }
    return sched;
  }

  let dedicated: number;
  if (isDebt) {
    dedicated = a.carveOut ? Math.min(kw * 0.9, emi / netPerKw) : 0;
  } else if (isPs && a.carveOut) {
    // Size a dedicated slice of PHYSICAL capacity whose host revenue alone always covers the
    // worst-year obligation to the financer (profit-share + any buyback that year) -- same
    // bankability logic as debt's EMI carve-out, just against a schedule that isn't flat.
    const fullSched = psScheduleFor(kw);
    const values = Object.values(fullSched);
    const peakOblig = values.length > 0 ? Math.max(...values.map(([pay, buyback]) => pay + buyback)) : 0;
    dedicated = netPerKw > 0 ? Math.min(kw * 0.9, peakOblig / netPerKw) : 0;
  } else {
    dedicated = 0;
  }
  const sellable = kw - dedicated;
  const soldTotal = (sellable * a.genUnitsPerKwDay) / a.promisedUnitsPerKwDay;

  const P: RunModelPlanResult[] = [];
  for (const p of plans) {
    const ten = Math.min(Math.trunc(p.tenure), n);
    const resellExtended = ten <= 3 && Boolean(p.resell);
    const streamUpper = resellExtended ? n : ten;
    const stream: Record<number, number> = {};
    for (const y of yrs) {
      if (y <= streamUpper) {
        stream[y] = unitsY[y] * p.credit * stepFactor(y, a.stepEveryYears, ustep);
      }
    }
    let fee = 0;
    for (const y of yrs) {
      if (y <= ten && stream[y] !== undefined) {
        fee += stream[y] / Math.pow(1 + p.target / 100, y);
      }
    }
    if (p.refund) {
      fee = fee / (1 - (p.refund / 100) * Math.pow(1 + p.target / 100, -ten));
    }
    if (legacy) {
      fee = fee * (1 + (a.legacyPremiumPct ?? 0));
    }
    const kws = (soldTotal * p.mix) / 100;
    const saleYears: number[] = [];
    if (!resellExtended) {
      saleYears.push(0);
    } else {
      for (let sy = 0; sy <= n - ten; sy += ten) saleYears.push(sy);
    }
    const esc0 = p.refund ? ((p.refund / 100) * fee) / Math.pow(1 + a.fdRatePct, ten) : 0;
    const ucf: number[] = [-fee * (1 + a.onboardingFeePct)];
    for (let y = 1; y <= ten; y++) {
      const refundPayout = y === ten ? (fee * p.refund) / 100 : 0;
      ucf.push((stream[y] ?? 0) + refundPayout);
    }
    P.push({
      name: p.plan,
      tenure: ten,
      fee,
      kwSold: kws,
      creditStream: stream,
      saleYears,
      escrowSeed: esc0,
      refundFraction: p.refund / 100,
      realizedXirrPct: 100 * irr(ucf),
      creditRatePerUnit: p.credit,
    });
  }

  const feeCash: Record<number, number> = {};
  for (let y = 0; y <= n; y++) feeCash[y] = 0;
  const credits: Record<number, number> = {};
  for (const y of yrs) credits[y] = 0;
  let escrow0 = 0;
  const tranches: [number, number][] = [];
  for (const p of P) {
    for (const sy of p.saleYears) {
      const amt = p.kwSold * p.fee;
      feeCash[sy] += amt;
      tranches.push([sy, amt * (1 + a.onboardingFeePct) - (sy === 0 ? p.kwSold * p.escrowSeed : 0)]);
    }
    for (const y of yrs) {
      credits[y] += p.kwSold * (p.creditStream[y] ?? 0);
    }
    escrow0 += p.kwSold * p.escrowSeed;
  }

  const onbCash: Record<number, number> = {};
  const mktCash: Record<number, number> = {};
  for (let y = 0; y <= n; y++) {
    onbCash[y] = feeCash[y] * a.onboardingFeePct;
    mktCash[y] = feeCash[y] * a.marketingPct;
  }
  const amort: Record<number, number> = {};
  for (const y of yrs) amort[y] = 0;
  for (const [sy, amt] of tranches) {
    const life = n - sy;
    for (let y = sy + 1; y <= n; y++) amort[y] += amt / life;
  }

  const depAmt = (kw * a.genUnitsPerKwDay * 365 * a.hostTariffPerUnit * a.depositMonths) / 12;
  const psFullSchedule = psScheduleFor(kw); // revenue-based proxy, used ONLY for carve-out sizing above

  const rows: RunModelYearRow[] = [];
  let bal = financed;
  let cumPat = 0;
  let cumFees = 0;
  let cumAmort = 0;
  for (let y = 0; y <= n; y++) {
    const host = y >= 1 ? kw * a.genUnitsPerKwDay * 365 * Math.pow(1 - a.degradationPct, y - 1) * hostT[y] : 0;
    const [, psBuyback] = psFullSchedule[y] ?? [0, 0]; // buyback (principal) is a fixed schedule, not profit-linked
    const cr = credits[y] ?? 0;
    const om = y >= 1 ? kw * (a.omPerKwYear * Math.pow(1 + a.omEscalationPct, y - 1) + a.insurancePerKwYear) : 0;
    const plat = y >= 1 ? kw * a.platformOpexPerKwYear : 0;
    const fc = feeCash[y] ?? 0;
    const ob = onbCash[y] ?? 0;
    const mk = mktCash[y] ?? 0;
    const interest = isDebt && y >= 1 && y <= a.debtTenorYears ? bal * a.debtRatePct : 0;
    const principal = isDebt && y >= 1 && y <= a.debtTenorYears ? emi - interest : 0;
    const d = y >= 1 ? capex / n : 0;
    // Whole-company PBT/tax computed WITHOUT profit-share first -- ps_pay is a distribution OF
    // net profit (like a Musharaka partner's share), not a pre-tax deductible expense (unlike
    // interest). Matches real-world tax treatment: interest is deductible, profit-share
    // distributions to a co-owner typically are not.
    const pbt = (y >= 1 ? amort[y] : 0) + host - cr - om - plat - mk - d - interest;
    const tax = Math.max(0, pbt) * a.taxRatePct;
    const patCompany = pbt - tax;
    // NOW share actual net profit with the financer (true profit-AND-loss sharing): if the
    // company posts a loss this year, the financer's share floors at 0 rather than going negative.
    const psPay = y >= 1 ? Math.max(0, fracForYear(y) * patCompany) : 0;
    const pat = patCompany - psPay; // our retained share, after the financer's distribution
    cumPat += pat;
    bal -= principal + psBuyback; // declines for amortizing debt or diminishing profit-share; constant otherwise
    cumFees += fc * (1 + a.onboardingFeePct) - (y === 0 ? escrow0 : 0);
    cumAmort += y >= 1 ? amort[y] : 0;
    const opCf = fc + ob + host - cr - om - plat - mk - tax; // financing costs (interest, ps_pay) excluded -- belong in finCf
    const invCf = y === 0 ? -capex - escrow0 : 0;
    const finCf =
      (y === 0 ? a.equityAtT0 + financed + depAmt : 0) -
      interest -
      principal -
      psPay -
      psBuyback -
      (y === n ? depAmt : 0);
    const escrow = y < n ? escrow0 * Math.pow(1 + a.fdRatePct, y) : 0;
    const defrev = cumFees - cumAmort;

    rows.push({
      year: y,
      host,
      credits: cr,
      om,
      plat,
      mkt: mk,
      feeCash: fc,
      onboarding: ob,
      amortization: y >= 1 ? amort[y] : 0,
      ebitda: host - cr - om - plat,
      depreciation: d,
      interest,
      principal,
      profitSharePay: psPay,
      profitShareBuyback: psBuyback,
      pbt,
      tax,
      pat,
      operatingCashFlow: opCf,
      investingCashFlow: invCf,
      financingCashFlow: finCf,
      escrow,
      debt: bal,
      deferredRevenue: defrev,
      deposit: y < n ? depAmt : 0,
      refundLiability: escrow,
      equity: a.equityAtT0 + cumPat,
      // filled in below, once we have the full series
      cash: 0,
      netFixedAssets: 0,
      assets: 0,
      liabilitiesAndEquity: 0,
      balanceCheck: 0,
    });
  }

  // df.cash / nfa / assets / liab_eq / check — cumulative columns computed after the row loop.
  let cashCum = 0;
  let depCum = 0;
  for (const row of rows) {
    cashCum += row.operatingCashFlow + row.investingCashFlow + row.financingCashFlow;
    row.cash = cashCum;
    depCum += row.depreciation;
    row.netFixedAssets = capex - depCum;
    row.assets = row.cash + row.netFixedAssets + row.escrow;
    row.liabilitiesAndEquity = row.debt + row.deferredRevenue + row.deposit + row.refundLiability + row.equity;
    row.balanceCheck = row.assets - row.liabilitiesAndEquity;
  }

  const efcf = rows.map((row) => row.operatingCashFlow + row.investingCashFlow + row.financingCashFlow);
  efcf[0] -= a.equityAtT0;
  let npv = 0;
  for (let t = 0; t < efcf.length; t++) npv += efcf[t] / Math.pow(1 + a.discountRatePct, t);
  const eqNeed = (1 - a.ltvPct) * capex + mktCash[0] + escrow0;
  const back = feeCash[0] + onbCash[0];
  const eb1 = (rows[1].ebitda - emi - rows[1].profitSharePay) / kw;

  let pool = eqNeed;
  let cum = 0;
  for (let i = 0; i < 10; i++) {
    const nProj = Math.min(4, Math.floor(pool / eqNeed));
    const ebi = (cum * eb1) / 2;
    pool = pool - nProj * eqNeed + nProj * back + ebi;
    cum += nProj * kw;
  }
  const flyCagr = pool > 0 ? Math.pow(pool / eqNeed, 1 / 5) - 1 : -1;

  const psScheduleValues = Object.values(psFullSchedule);
  const psPeakOblig = isPs
    ? psScheduleValues.length > 0
      ? Math.max(...psScheduleValues.map(([pay, buyback]) => pay + buyback))
      : 0
    : 0;

  const dscr =
    emi > 0
      ? (dedicated * a.genUnitsPerKwDay * 365 * a.hostTariffPerUnit) / emi
      : isPs && psPeakOblig > 0
        ? (dedicated * a.genUnitsPerKwDay * 365 * a.hostTariffPerUnit) / psPeakOblig
        : NaN;

  const psPayTotal = rows.reduce((s, row) => s + row.profitSharePay, 0);
  const psBuybackTotal = rows.reduce((s, row) => s + row.profitShareBuyback, 0);

  const summary: RunModelSummary = {
    capex,
    sold: soldTotal,
    fees0: feeCash[0],
    escrow0,
    deposit: depAmt,
    npv,
    nominal: efcf.reduce((s, v) => s + v, 0),
    equityNeed: eqNeed,
    back,
    cashOnCash: (back - eqNeed) / eqNeed,
    flywheelCagr: flyCagr,
    minCash: Math.min(...rows.map((row) => row.cash)),
    emi,
    dedicated,
    sellable,
    dscr,
    financingType: fintype,
    financed,
    profitShareRatio: psRatio,
    profitShareUsSplit: psUs,
    financerFraction: financerFrac,
    ourHostFraction: 1 - financerFrac,
    profitShareDiminishing: psDiminishing,
    profitShareBuyoutYears: psBuyout,
    profitSharePeakObligation: psPeakOblig,
    profitSharePayYear1: n >= 1 ? rows[1].profitSharePay : 0,
    profitSharePayTotal: psPayTotal,
    profitShareBuybackTotal: psBuybackTotal,
    profitShareImpliedRate: isPs && financed > 0 ? rows[1].profitSharePay / financed : NaN,
  };

  return { rows, plans: P, summary };
}
