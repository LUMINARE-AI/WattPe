"use client";

import type { Dispatch, SetStateAction } from "react";
import type {
  FinancingType,
  RunModelAssumptions,
  RunModelPlanInput,
} from "@/lib/pricing-engine/types";
import { NumField } from "./num-field";
import { Section } from "./kpi-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex min-w-0 items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-brand-green"
      />
      {label}
    </label>
  );
}

export function InputsTab({
  assumptions,
  setAssumptions,
  plans,
  setPlans,
}: {
  assumptions: RunModelAssumptions;
  setAssumptions: Dispatch<SetStateAction<RunModelAssumptions>>;
  plans: RunModelPlanInput[];
  setPlans: Dispatch<SetStateAction<RunModelPlanInput[]>>;
}) {
  function set<K extends keyof RunModelAssumptions>(key: K, value: RunModelAssumptions[K]) {
    setAssumptions((prev) => ({ ...prev, [key]: value }));
  }

  function setPlan<K extends keyof RunModelPlanInput>(
    idx: number,
    key: K,
    value: RunModelPlanInput[K],
  ) {
    setPlans((prev) => prev.map((p, i) => (i === idx ? { ...p, [key]: value } : p)));
  }

  const mixTotal = plans.reduce((s, p) => s + (p.mix || 0), 0);

  return (
    <div className="flex flex-col gap-4">
      <Section title="Solar plant assumptions" description="Plant sizing, capex, generation and O&M.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <NumField label="Plant size" suffix="kW" value={assumptions.kw} step={10} onChange={(v) => set("kw", v)} />
          <NumField label="Capex" suffix="₹/W" step={0.5} value={assumptions.capexPerWatt} onChange={(v) => set("capexPerWatt", v)} />
          <NumField label="Actual generation" suffix="u/kW/day" step={0.1} value={assumptions.genUnitsPerKwDay} onChange={(v) => set("genUnitsPerKwDay", v)} />
          <NumField label="Degradation" suffix="%/yr" step={0.1} value={assumptions.degradationPct * 100} onChange={(v) => set("degradationPct", v / 100)} />
          <NumField label="O&M" suffix="₹/kW/yr" step={10} value={assumptions.omPerKwYear} onChange={(v) => set("omPerKwYear", v)} />
          <NumField label="O&M escalation" suffix="%/yr" step={0.5} value={assumptions.omEscalationPct * 100} onChange={(v) => set("omEscalationPct", v / 100)} />
          <NumField label="Insurance" suffix="₹/kW/yr" step={10} value={assumptions.insurancePerKwYear} onChange={(v) => set("insurancePerKwYear", v)} />
          <NumField label="Platform opex" suffix="₹/kW/yr" step={10} value={assumptions.platformOpexPerKwYear} onChange={(v) => set("platformOpexPerKwYear", v)} />
          <NumField label="Host deposit" suffix="months" step={1} value={assumptions.depositMonths} onChange={(v) => set("depositMonths", v)} />
        </div>
      </Section>

      <Section title="Customer / pricing assumptions" description="Promised generation, host tariff, step-ups, escalation.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <NumField label="Promised generation" suffix="u/kW/day" step={0.1} value={assumptions.promisedUnitsPerKwDay} onChange={(v) => set("promisedUnitsPerKwDay", v)} />
          <NumField label="Host tariff" suffix="₹/unit" step={0.1} value={assumptions.hostTariffPerUnit} onChange={(v) => set("hostTariffPerUnit", v)} />
          <NumField label="Step every" suffix="years" step={1} value={assumptions.stepEveryYears} onChange={(v) => set("stepEveryYears", v)} />
          <NumField label="Host step-up" suffix="%" step={1} value={assumptions.hostStepPct * 100} onChange={(v) => set("hostStepPct", v / 100)} />
          <NumField
            label="User step-up"
            suffix="%"
            step={1}
            value={assumptions.userStepPct * 100}
            onChange={(v) => set("userStepPct", v / 100)}
            className={assumptions.mirrorUserStep ? "opacity-50" : undefined}
          />
          <NumField label="Marketing" suffix="% of sales" step={0.5} value={assumptions.marketingPct * 100} onChange={(v) => set("marketingPct", v / 100)} />
          <NumField label="Onboarding fee" suffix="%" step={0.5} value={assumptions.onboardingFeePct * 100} onChange={(v) => set("onboardingFeePct", v / 100)} />
          <NumField label="Sell-out period" suffix="months" step={1} value={assumptions.sellOutMonths} onChange={(v) => set("sellOutMonths", v)} />
          <div className="flex items-end pb-1.5">
            <Toggle label="Mirror host step onto user credits" checked={assumptions.mirrorUserStep} onChange={(v) => set("mirrorUserStep", v)} />
          </div>
        </div>
      </Section>

      <Section title="Project type" description="New build (escalating tariffs) vs acquired legacy plant (flat PPA).">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Project type</Label>
            <Select
              value={assumptions.projectType}
              onValueChange={(v) => set("projectType", v as "new" | "legacy")}
            >
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New build</SelectItem>
                <SelectItem value="legacy">Legacy (acquired)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <NumField label="Max tenure" suffix="years" step={1} value={assumptions.years} onChange={(v) => set("years", v)} />
          <NumField
            label="Legacy premium"
            suffix="%"
            step={1}
            value={assumptions.legacyPremiumPct * 100}
            onChange={(v) => set("legacyPremiumPct", v / 100)}
            className={assumptions.projectType === "legacy" ? undefined : "opacity-50"}
          />
        </div>
      </Section>

      <Section title="Financing assumptions" description="How the financed share of capex is funded — equity, debt (EMI), or ethical profit-share.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Financing structure</Label>
            <Select
              value={assumptions.financingType}
              onValueChange={(v) => set("financingType", v as FinancingType)}
            >
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="equity">100% Equity</SelectItem>
                <SelectItem value="debt">Debt (EMI)</SelectItem>
                <SelectItem value="profitshare">Profit-share (Musharaka)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <NumField label="Equity at t0" suffix="₹" step={100000} value={assumptions.equityAtT0} onChange={(v) => set("equityAtT0", v)} />
          <NumField label="Financed share (LTV)" suffix="%" step={5} value={assumptions.ltvPct * 100} onChange={(v) => set("ltvPct", v / 100)} />
          <NumField label="Discount rate" suffix="%" step={0.5} value={assumptions.discountRatePct * 100} onChange={(v) => set("discountRatePct", v / 100)} />
          <NumField label="Tax rate" suffix="%" step={1} value={assumptions.taxRatePct * 100} onChange={(v) => set("taxRatePct", v / 100)} />
          <NumField label="Escrow / FD rate" suffix="%" step={0.1} value={assumptions.fdRatePct * 100} onChange={(v) => set("fdRatePct", v / 100)} />
          <div className="flex items-end pb-1.5">
            <Toggle label="Carve out dedicated capacity" checked={assumptions.carveOut} onChange={(v) => set("carveOut", v)} />
          </div>
        </div>

        {assumptions.financingType === "debt" ? (
          <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 sm:grid-cols-3 lg:grid-cols-4">
            <NumField label="Debt rate" suffix="%" step={0.5} value={assumptions.debtRatePct * 100} onChange={(v) => set("debtRatePct", v / 100)} />
            <NumField label="Debt tenor" suffix="years" step={1} value={assumptions.debtTenorYears} onChange={(v) => set("debtTenorYears", v)} />
          </div>
        ) : null}

        {assumptions.financingType === "profitshare" ? (
          <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 sm:grid-cols-3 lg:grid-cols-4">
            <NumField label="Our share of financed-portion profit" suffix="%" step={5} value={assumptions.profitShareSplitUsPct * 100} onChange={(v) => set("profitShareSplitUsPct", v / 100)} />
            <NumField label="Buyout period" suffix="years" step={1} value={assumptions.profitShareBuyoutYears} onChange={(v) => set("profitShareBuyoutYears", v)} />
            <div className="flex items-end pb-1.5">
              <Toggle label="Diminishing (Diminishing Musharaka)" checked={assumptions.profitShareDiminishing} onChange={(v) => set("profitShareDiminishing", v)} />
            </div>
          </div>
        ) : null}
      </Section>

      <Section
        title="Customer plans"
        description="Editable plan mix — tenure, credit rate, target customer XIRR, refund %, capacity mix."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Tenure (yrs)</TableHead>
              <TableHead>Credit ₹/unit</TableHead>
              <TableHead>Target XIRR %</TableHead>
              <TableHead>Refund %</TableHead>
              <TableHead>Mix %</TableHead>
              <TableHead>Auto-resell</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((p, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Input
                    value={p.plan}
                    onChange={(e) => setPlan(i, "plan", e.target.value)}
                    className="min-w-32"
                  />
                </TableCell>
                <TableCell>
                  <Input type="number" step={1} value={p.tenure} onChange={(e) => setPlan(i, "tenure", e.target.valueAsNumber || 0)} className="w-20" />
                </TableCell>
                <TableCell>
                  <Input type="number" step={0.1} value={p.credit} onChange={(e) => setPlan(i, "credit", e.target.valueAsNumber || 0)} className="w-20" />
                </TableCell>
                <TableCell>
                  <Input type="number" step={0.1} value={p.target} onChange={(e) => setPlan(i, "target", e.target.valueAsNumber || 0)} className="w-20" />
                </TableCell>
                <TableCell>
                  <Input type="number" step={5} value={p.refund} onChange={(e) => setPlan(i, "refund", e.target.valueAsNumber || 0)} className="w-20" />
                </TableCell>
                <TableCell>
                  <Input type="number" step={1} value={p.mix} onChange={(e) => setPlan(i, "mix", e.target.valueAsNumber || 0)} className="w-20" />
                </TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={Boolean(p.resell)}
                    onChange={(e) => setPlan(i, "resell", e.target.checked)}
                    className="size-4 accent-brand-green"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
          {Math.round(mixTotal) !== 100 ? (
            <Badge variant="destructive">Mix totals {mixTotal.toFixed(0)}% — should equal 100%</Badge>
          ) : (
            <Badge variant="outline" className="border-brand-green text-brand-green">Mix totals 100%</Badge>
          )}
        </div>
      </Section>
    </div>
  );
}
