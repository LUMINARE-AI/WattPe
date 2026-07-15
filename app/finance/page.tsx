"use client";

import { useMemo, useState } from "react";
import { LineChart, RotateCcw } from "lucide-react";
import { runModel } from "@/lib/pricing-engine/internal/runModel";
import type { RunModelAssumptions, RunModelPlanInput } from "@/lib/pricing-engine/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DEFAULT_ASSUMPTIONS, DEFAULT_PLANS } from "./_components/state";
import { InputsTab } from "./_components/inputs-tab";
import { RevenueTab } from "./_components/revenue-tab";
import { CostsTab } from "./_components/costs-tab";
import { ProjectFinanceTab } from "./_components/project-finance-tab";
import { CashFlowTab } from "./_components/cash-flow-tab";
import { BalanceSheetTab } from "./_components/balance-sheet-tab";
import { ValuationTab } from "./_components/valuation-tab";
import { SensitivityTab } from "./_components/sensitivity-tab";
import { SurgePricingTab } from "./_components/surge-pricing-tab";
import { MonthlyPassthroughTab } from "./_components/monthly-passthrough-tab";
import { PriceTargetTab } from "./_components/price-target-tab";
import { DecoderTab } from "./_components/decoder-tab";
import { DashboardTab } from "./_components/dashboard-tab";

const TABS: { value: string; label: string }[] = [
  { value: "inputs", label: "📥 Inputs" },
  { value: "revenue", label: "💵 Revenue" },
  { value: "costs", label: "🧾 Costs" },
  { value: "finance", label: "🏦 Project Finance" },
  { value: "cashflow", label: "💧 Cash Flow" },
  { value: "balance", label: "⚖️ Balance Sheet" },
  { value: "valuation", label: "📈 Valuation" },
  { value: "sensitivity", label: "🌡️ Sensitivity" },
  { value: "surge", label: "🎟️ Surge Pricing" },
  { value: "passthrough", label: "📅 Monthly Pass-Through" },
  { value: "pricetarget", label: "🎯 Price Target Solver" },
  { value: "decoder", label: "🔍 Decoder / Validator" },
  { value: "dashboard", label: "🎛️ Dashboard" },
];

export default function FinanceHomePage() {
  const [assumptions, setAssumptions] = useState<RunModelAssumptions>(DEFAULT_ASSUMPTIONS);
  const [plans, setPlans] = useState<RunModelPlanInput[]>(DEFAULT_PLANS);

  // Shared source of truth every tab reads from — recomputed whenever any
  // input changes, mirroring the Python dcc.Store's role.
  const output = useMemo(() => runModel(assumptions, plans), [assumptions, plans]);

  function resetToDefaults() {
    setAssumptions(DEFAULT_ASSUMPTIONS);
    setPlans(DEFAULT_PLANS);
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-accent flex size-10 items-center justify-center rounded-full">
            <LineChart className="text-brand-gold-hover size-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-semibold">Business Studio</h1>
            <p className="text-sm text-muted-foreground">
              Solar project financing scenario modeling — every tab recomputes live off the shared pricing engine.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={resetToDefaults}>
          <RotateCcw />
          Reset to defaults
        </Button>
      </header>

      <Tabs defaultValue="inputs">
        <TabsList variant="line" className="h-auto w-full flex-wrap justify-start gap-1 border-b border-border pb-1">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="shrink-0">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="inputs" className="pt-4">
          <InputsTab
            assumptions={assumptions}
            setAssumptions={setAssumptions}
            plans={plans}
            setPlans={setPlans}
          />
        </TabsContent>
        <TabsContent value="revenue" className="pt-4">
          <RevenueTab output={output} assumptions={assumptions} />
        </TabsContent>
        <TabsContent value="costs" className="pt-4">
          <CostsTab output={output} />
        </TabsContent>
        <TabsContent value="finance" className="pt-4">
          <ProjectFinanceTab assumptions={assumptions} output={output} />
        </TabsContent>
        <TabsContent value="cashflow" className="pt-4">
          <CashFlowTab output={output} />
        </TabsContent>
        <TabsContent value="balance" className="pt-4">
          <BalanceSheetTab output={output} />
        </TabsContent>
        <TabsContent value="valuation" className="pt-4">
          <ValuationTab assumptions={assumptions} plans={plans} output={output} />
        </TabsContent>
        <TabsContent value="sensitivity" className="pt-4">
          <SensitivityTab assumptions={assumptions} plans={plans} />
        </TabsContent>
        <TabsContent value="surge" className="pt-4">
          <SurgePricingTab assumptions={assumptions} output={output} />
        </TabsContent>
        <TabsContent value="passthrough" className="pt-4">
          <MonthlyPassthroughTab />
        </TabsContent>
        <TabsContent value="pricetarget" className="pt-4">
          <PriceTargetTab assumptions={assumptions} />
        </TabsContent>
        <TabsContent value="decoder" className="pt-4">
          <DecoderTab />
        </TabsContent>
        <TabsContent value="dashboard" className="pt-4">
          <DashboardTab assumptions={assumptions} plans={plans} output={output} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
