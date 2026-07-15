"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { RunModelAssumptions } from "@/lib/pricing-engine/types";
import { solvePriceTarget } from "@/lib/pricing-engine/internal/priceTargetSolver";
import { KpiCard, KpiGrid, Section } from "./kpi-card";
import { NumField } from "./num-field";
import { fmtINR } from "./state";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  credit: { label: "Credit, ₹/kW", color: "var(--chart-1)" },
};

export function PriceTargetTab({ assumptions }: { assumptions: RunModelAssumptions }) {
  const [sellPrice, setSellPrice] = useState(40);
  const [tenure, setTenure] = useState(15);
  const [targetXirr, setTargetXirr] = useState(11.5);
  const [refundPct, setRefundPct] = useState(0);

  const result = useMemo(
    () =>
      solvePriceTarget(
        { sellPricePerWatt: sellPrice, tenureYears: tenure, targetXirrPct: targetXirr, refundPct },
        {
          promisedUnitsPerKwDay: assumptions.promisedUnitsPerKwDay,
          degradationPct: assumptions.degradationPct,
          stepEveryYears: assumptions.stepEveryYears,
          mirrorUserStep: assumptions.mirrorUserStep,
          hostStepPct: assumptions.hostStepPct,
          userStepPct: assumptions.userStepPct,
          onboardingFeePct: assumptions.onboardingFeePct,
        },
      ),
    [assumptions, sellPrice, tenure, targetXirr, refundPct],
  );

  const chartData = result.creditStream.map((v, i) => ({ year: `Y${i + 1}`, credit: Math.round(v) }));

  return (
    <div className="flex flex-col gap-4">
      <Section title="Price target solver inputs">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NumField label="Target sell price" suffix="₹/W" step={0.5} value={sellPrice} onChange={setSellPrice} />
          <NumField label="Tenure" suffix="years" step={1} value={tenure} onChange={setTenure} />
          <NumField label="Target XIRR to beat" suffix="%" step={0.5} value={targetXirr} onChange={setTargetXirr} />
          <NumField label="Refund at tenure end" suffix="%" step={5} value={refundPct} onChange={setRefundPct} />
        </div>
      </Section>

      <KpiGrid>
        <KpiCard label="Credit rate needed" value={`₹${result.creditRatePerUnit.toFixed(2)}/unit`} tone="accent" />
        <KpiCard label="Achieved XIRR" value={`${result.achievedXirrPct.toFixed(2)}%`} />
        <KpiCard
          label="Margin vs ₹40/W reference"
          value={fmtINR(result.marginVsReferenceCostPerKw)}
          tone={result.marginVsReferenceCostPerKw >= 0 ? "good" : "bad"}
        />
      </KpiGrid>

      <Section title="Credit stream at solved rate">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="year" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(v) => fmtINR(v, { compact: true })} tickLine={false} axisLine={false} width={70} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="credit" fill="var(--color-credit)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Section>
    </div>
  );
}
