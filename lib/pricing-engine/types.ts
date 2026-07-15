/** Engine-ready assumptions: percentages already converted to fractions. */
export interface EngineAssumptions {
  /** Actual generation, units/kW/day — 'gen' in the Python source. */
  genUnitsPerKwDay: number;
  /** Promised/sold units, units/kW/day — 'units' in the Python source. */
  promisedUnitsPerKwDay: number;
  /** Fraction, e.g. 0.01 for 1%/yr — 'deg' in the Python source. */
  degradationPct: number;
  /** Years between credit step-ups — 'step_every'. */
  stepEveryYears: number;
  /** Fraction, e.g. 0.10 for 10% per step — 'user_step' (mirrors host step by default). */
  userStepPct: number;
  /** Fraction, e.g. 0.01 for 1% — 'onb'. */
  onboardingFeePct: number;
  /** Acquired legacy plant (flat PPA/credits, no step-ups) vs new build. Defaults to false. */
  isLegacy?: boolean;
  /** Fraction premium applied to the auto-priced fee for legacy (proven-history) plants. */
  legacyPremiumPct?: number;
  /** Portfolio tenure cap, years — 'N' / 'years' in the Python source. Defaults to 15. */
  maxYears?: number;
}

/** Raw assumption values as stored (percent numbers, not fractions) — mirrors the `PricingAssumption` row. */
export interface RawAssumptionInput {
  genUnitsPerKwDay: number;
  promisedUnitsPerKwDay: number;
  degradationPct: number;
  stepEveryYears: number;
  userStepPct: number;
  onboardingFeePct: number;
  isLegacy?: boolean;
  legacyPremiumPct?: number;
  maxYears?: number;
}

/** A plan as priced — mirrors the editable `Plan` table (percent numbers, not fractions). */
export interface PlanInput {
  code: string;
  name: string;
  tenureYears: number;
  /** ₹/unit credited to the customer. */
  creditRatePerUnit: number;
  /** Target customer return, percent, e.g. 11.5 for 11.5%. */
  targetXirrPct: number;
  /** Refund percent paid back at tenure end, e.g. 100 for a full refund. 0 for none. */
  refundPct: number;
  autoResell?: boolean;
}

export interface PlanEconomicsResult {
  code: string;
  name: string;
  tenureYears: number;
  /** Auto-priced one-time fee, ₹/kW. */
  feePerKW: number;
  /** Year -> ₹/kW credited that year, for years 1..tenureYears. */
  creditStream: Record<number, number>;
  /** 0..1 */
  refundFraction: number;
  /** Realized customer return, percent (annual-period bisection IRR, see core/irr.ts). */
  realizedXirrPct: number;
  creditRatePerUnit: number;
}

// ============================================================================
// Phase 2 — full `run_model()` port (dash_studio_v6.py:37-211) types.
// ============================================================================

/** 'fintype' in the Python source — how the financed % of capex is funded. */
export type FinancingType = "equity" | "debt" | "profitshare";

/**
 * Full engine-ready assumptions for `runModel()` — mirrors everything the
 * Python `DEF` dict (dash_studio_v6.py:224-229) plus `A()` (v6:236-247)
 * produces. All percent-like fields are fractions (0.10, not 10), matching
 * the Python engine's post-`A()` convention. Each field's comment names the
 * corresponding Python key for cross-reference.
 */
export interface RunModelAssumptions {
  /** 'kw' — plant size, kW. */
  kw: number;
  /** 'capex_w' — capex, ₹/W. */
  capexPerWatt: number;
  /** 'gen' — actual generation, units/kW/day. */
  genUnitsPerKwDay: number;
  /** 'units' — promised/sold units, units/kW/day. */
  promisedUnitsPerKwDay: number;
  /** 'deg' — fraction, e.g. 0.01 for 1%/yr. */
  degradationPct: number;
  /** 'tariff' — host PPA tariff base, ₹/unit. */
  hostTariffPerUnit: number;
  /** 'step_every' — years between tariff/credit step-ups. */
  stepEveryYears: number;
  /** 'host_step' — fraction, e.g. 0.10 for 10% per step. */
  hostStepPct: number;
  /** 'mirror' — mirror host steps onto user credits when true. */
  mirrorUserStep: boolean;
  /** 'user_step' — fraction, used only when mirrorUserStep is false. */
  userStepPct: number;
  /** 'om' — O&M, ₹/kW/yr. */
  omPerKwYear: number;
  /** 'om_esc' — O&M escalation, fraction/yr. */
  omEscalationPct: number;
  /** 'ins' — insurance, ₹/kW/yr. */
  insurancePerKwYear: number;
  /** 'plat' — platform opex, ₹/kW/yr. */
  platformOpexPerKwYear: number;
  /** 'mkt' — digital marketing, fraction of sales. */
  marketingPct: number;
  /** 'onb' — onboarding fee, fraction. */
  onboardingFeePct: number;
  /** 'sellout' — sell-out period, months (informational; not used inside run_model's math). */
  sellOutMonths: number;
  /** 'dep_m' — host security deposit, months (used for deposit-fund sizing). */
  depositMonths: number;
  /** 'ltv' — financed fraction of capex (debt OR profit-share). */
  ltvPct: number;
  /** 'drate' — debt interest rate, fraction/yr. */
  debtRatePct: number;
  /** 'dtenor' — debt tenor, years. */
  debtTenorYears: number;
  /** 'fd' — escrow/FD rate, fraction/yr. */
  fdRatePct: number;
  /** 'tax' — corporate tax rate, fraction. */
  taxRatePct: number;
  /** 'disc' — NPV discount rate, fraction. */
  discountRatePct: number;
  /** 'equity' — promoter equity injected at t0, ₹. */
  equityAtT0: number;
  /** 'carveout' — dedicate a capacity slice to service debt EMI / profit-share obligations. */
  carveOut: boolean;
  /** 'ptype' — 'new' build (escalating tariffs) vs 'legacy' (flat PPA, proven history). */
  projectType: "new" | "legacy";
  /** 'years' — max/remaining PPA tenure, years (N in the Python source, default 15). */
  years: number;
  /** 'legacy_prem' — fraction premium on auto-priced fees for legacy plants. */
  legacyPremiumPct: number;
  /** 'fintype' — 'equity' | 'debt' | 'profitshare'. */
  financingType: FinancingType;
  /** 'ps_split_us' — our share of NET PROFIT from the financed portion, fraction. */
  profitShareSplitUsPct: number;
  /** 'ps_diminishing' — Diminishing Musharaka: revenue split also declines to zero over the buyout period. */
  profitShareDiminishing: boolean;
  /** 'ps_buyout_years' — principal repayment period for profit-share financing, years. */
  profitShareBuyoutYears: number;
}

/** One row (year 0..years) of the year-by-year model table — mirrors the Python `df` columns. */
export interface RunModelYearRow {
  /** 'year' — 0 is the t0/construction row, 1..years are operating years. */
  year: number;
  /** 'host' — gross host PPA revenue. */
  host: number;
  /** 'credits' — total customer credits paid out. */
  credits: number;
  /** 'om' — O&M + insurance. */
  om: number;
  /** 'plat' — platform opex. */
  plat: number;
  /** 'mkt' — marketing spend. */
  mkt: number;
  /** 'fee_cash' — one-time capacity-sale cash booked this year (tranche sales). */
  feeCash: number;
  /** 'onb' — onboarding fee cash booked this year. */
  onboarding: number;
  /** 'amort' — deferred-revenue amortization recognized as income this year. */
  amortization: number;
  /** 'ebitda' — host - credits - om - plat (pre onboarding/marketing/interest/tax). */
  ebitda: number;
  /** 'dep' — straight-line depreciation this year. */
  depreciation: number;
  /** 'interest' — debt interest this year (0 unless debt financing within tenor). */
  interest: number;
  /** 'principal' — debt principal repaid this year. */
  principal: number;
  /** 'ps_pay' — profit-share distribution paid to the financer this year. */
  profitSharePay: number;
  /** 'ps_buyback' — profit-share principal buyback this year. */
  profitShareBuyback: number;
  /** 'pbt' — profit before tax (interest deducted, profit-share NOT deducted). */
  pbt: number;
  /** 'tax' — tax on max(0, pbt). */
  tax: number;
  /** 'pat' — our retained profit after tax AND after the financer's profit-share distribution. */
  pat: number;
  /** 'op_cf' — operating cash flow (excludes interest/principal/profit-share; includes tax). */
  operatingCashFlow: number;
  /** 'inv_cf' — investing cash flow (-capex-escrow0 at t0, 0 otherwise). */
  investingCashFlow: number;
  /** 'fin_cf' — financing cash flow (equity/debt/profit-share inflows at t0; debt/PS service after). */
  financingCashFlow: number;
  /** 'escrow' — refund escrow balance, compounding at the FD rate. */
  escrow: number;
  /** 'debt' — outstanding financed balance (debt or profit-share principal). */
  debt: number;
  /** 'defrev' — deferred revenue (cumulative fees booked, net of amortization recognized). */
  deferredRevenue: number;
  /** 'deposit' — host security deposit liability outstanding. */
  deposit: number;
  /** 'refund_liab' — refund liability (mirrors escrow). */
  refundLiability: number;
  /** 'equity' — cumulative equity account (t0 equity + cumulative PAT). */
  equity: number;
  /** 'cash' — cumulative cash balance (cumsum of op_cf+inv_cf+fin_cf). */
  cash: number;
  /** 'nfa' — net fixed assets (capex - cumulative depreciation). */
  netFixedAssets: number;
  /** 'assets' — cash + nfa + escrow. */
  assets: number;
  /** 'liab_eq' — debt + defrev + deposit + refund_liab + equity. */
  liabilitiesAndEquity: number;
  /** 'check' — assets - liab_eq; should be ~0. */
  balanceCheck: number;
}

/** Summary KPIs for the model run — mirrors the Python `m` / `M` dict. */
export interface RunModelSummary {
  /** 'capex' — total capex, ₹. */
  capex: number;
  /** 'sold' — total kW-equivalent sold across all plans (sellable * gen / units). */
  sold: number;
  /** 'fees0' — total one-time fee cash booked at t0. */
  fees0: number;
  /** 'escrow0' — total refund escrow seeded at t0. */
  escrow0: number;
  /** 'deposit' — host security deposit amount. */
  deposit: number;
  /** 'npv' — NPV of equity cashflows at the discount rate. */
  npv: number;
  /** 'nominal' — nominal (undiscounted) sum of equity cashflows. */
  nominal: number;
  /** 'equity_need' — equity required at t0. */
  equityNeed: number;
  /** 'back' — fee + onboarding cash back at t0. */
  back: number;
  /** 'coc' — cash-on-cash, (back - equityNeed) / equityNeed. */
  cashOnCash: number;
  /** 'fly' — flywheel 5-year CAGR seed value. */
  flywheelCagr: number;
  /** 'min_cash' — minimum cumulative cash balance across the model. */
  minCash: number;
  /** 'emi' — annual EMI for debt financing (0 if not debt). */
  emi: number;
  /** 'dedicated' — kW dedicated/carved out to service debt or profit-share obligations. */
  dedicated: number;
  /** 'sellable' — kW available to sell to customers (kw - dedicated). */
  sellable: number;
  /** 'dscr' — debt-service coverage ratio on the dedicated capacity. */
  dscr: number;
  /** 'fintype' — financing structure used. */
  financingType: FinancingType;
  /** 'financed' — ₹ amount financed (debt or profit-share principal). */
  financed: number;
  /** 'ps_ratio' — ltv fraction, only when profit-share is active. */
  profitShareRatio: number;
  /** 'ps_us' — our share of financed-portion net profit, fraction. */
  profitShareUsSplit: number;
  /** 'financer_frac' — fraction of TOTAL host revenue paid to the financer at year 1. */
  financerFraction: number;
  /** 'our_host_frac' — 1 - financerFraction. */
  ourHostFraction: number;
  /** 'ps_diminishing' — echoes RunModelAssumptions.profitShareDiminishing, gated by is_ps. */
  profitShareDiminishing: boolean;
  /** 'ps_buyout' — profit-share repayment tenure, years (null if not applicable). */
  profitShareBuyoutYears: number | null;
  /** 'ps_peak_oblig' — worst-year (profit-share pay + buyback) obligation used to size the carve-out. */
  profitSharePeakObligation: number;
  /** 'ps_pay_yr1' — profit-share distribution paid in year 1. */
  profitSharePayYear1: number;
  /** 'ps_pay_total' — total profit-share distributions over the model horizon. */
  profitSharePayTotal: number;
  /** 'ps_buyback_total' — total profit-share principal repaid over the model horizon. */
  profitShareBuybackTotal: number;
  /** 'ps_implied_rate' — year-1 profit-share pay / financed, as an implied "rate" comparable to debtRatePct. */
  profitShareImpliedRate: number;
}

/** One plan's priced result inside a full model run — mirrors the Python `P` list entries. */
export interface RunModelPlanResult {
  /** 'name' — plan name. */
  name: string;
  /** 'tenure' — effective tenure (min(plan tenure, years)). */
  tenure: number;
  /** 'fee' — auto-priced one-time fee, ₹/kW. */
  fee: number;
  /** 'kws' — kW sold to this plan (sellable * mix%). */
  kwSold: number;
  /** 'stream' — year -> ₹/kW credited, for years 1..tenure (or 1..n for auto-resell plans). */
  creditStream: Record<number, number>;
  /** 'sale_years' — years (0-based, relative to project start) in which this tranche is (re)sold. */
  saleYears: number[];
  /** 'esc0' — refund escrow seeded per kW at t0. */
  escrowSeed: number;
  /** 'refund' — refund fraction (0..1) paid at tenure end. */
  refundFraction: number;
  /** 'xirr' — realized customer XIRR, percent. */
  realizedXirrPct: number;
  /** 'credit' — credit rate, ₹/unit. */
  creditRatePerUnit: number;
}

/** Full `run_model()` output — mirrors the Python `(df, P, m)` tuple. */
export interface RunModelOutput {
  rows: RunModelYearRow[];
  plans: RunModelPlanResult[];
  summary: RunModelSummary;
}

/** A single plan as fed into `runModel()` — mirrors one entry of `DEF_PLANS` / the plans table. */
export interface RunModelPlanInput {
  plan: string;
  tenure: number;
  /** ₹/unit. */
  credit: number;
  /** Target customer XIRR, PERCENT (e.g. 11.5), matching the Python plans table convention. */
  target: number;
  /** Refund percent at tenure end, e.g. 100 for full refund, 0 for none. */
  refund: number;
  /** Mix percent of sellable capacity allocated to this plan, e.g. 50 for 50%. */
  mix: number;
  /** Auto-resell short tenure (<=3y) repeatedly across the full project life. */
  resell?: boolean;
}
