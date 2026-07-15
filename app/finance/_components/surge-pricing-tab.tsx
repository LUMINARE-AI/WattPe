"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { RunModelAssumptions, RunModelOutput } from "@/lib/pricing-engine/types";
import { computeSurgePricing } from "@/lib/pricing-engine/internal/surgePricing";
import { KpiCard, KpiGrid, Section } from "./kpi-card";
import { NumField } from "./num-field";
import { CHART_COLORS, fmtINR, fmtLakh, fmtPct } from "./state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

export function SurgePricingTab({
  assumptions,
  output,
}: {
  assumptions: RunModelAssumptions;
  output: RunModelOutput;
}) {
  const [numTranches, setNumTranches] = useState(5);
  const [stepPct, setStepPct] = useState(5);

  const result = useMemo(
    () =>
      computeSurgePricing(
        output.plans,
        output.summary,
        {
          promisedUnitsPerKwDay: assumptions.promisedUnitsPerKwDay,
          degradationPct: assumptions.degradationPct,
          stepEveryYears: assumptions.stepEveryYears,
          mirrorUserStep: assumptions.mirrorUserStep,
          hostStepPct: assumptions.hostStepPct,
          userStepPct: assumptions.userStepPct,
          onboardingFeePct: assumptions.onboardingFeePct,
          marketingPct: assumptions.marketingPct,
        },
        numTranches,
        stepPct / 100,
      ),
    [assumptions, output, numTranches, stepPct],
  );

  const planNames = Array.from(new Set(result.ladder.map((l) => l.planName)));
  const chartConfig: ChartConfig = Object.fromEntries(
    planNames.map((name, i) => [name, { label: name, color: CHART_COLORS[i % CHART_COLORS.length] }]),
  );
  const merged: Record<number, Record<string, number>> = {};
  for (const l of result.ladder) {
    const key = Math.round(l.trancheMidpointPct * 10);
    merged[key] ??= { trancheMidpointPct: l.trancheMidpointPct };
    merged[key][l.planName] = l.feePerWatt;
  }
  const chartData = Object.values(merged).sort((a, b) => a.trancheMidpointPct - b.trancheMidpointPct);

  return (
    <div className="flex flex-col gap-4">
      <Section title="Surge pricing controls" description="Split each plan's capacity into tranches sold at a progressively higher fee.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NumField label="Number of tranches" value={numTranches} step={1} min={1} onChange={setNumTranches} />
          <NumField label="Step per tranche" suffix="%" value={stepPct} step={1} onChange={setStepPct} />
        </div>
      </Section>

      <KpiGrid>
        <KpiCard label="Flat revenue (t0)" value={fmtLakh(result.flatRevenueAtT0)} />
        <KpiCard label="Surged revenue (t0)" value={fmtLakh(result.surgedRevenueAtT0)} tone="accent" />
        <KpiCard label="Uplift" value={fmtLakh(result.uplift)} tone={result.uplift >= 0 ? "good" : "bad"} />
        <KpiCard label="Cash-on-cash, flat" value={fmtPct(result.cashOnCashFlat)} />
        <KpiCard label="Cash-on-cash, surged" value={fmtPct(result.cashOnCashSurged)} tone="good" />
      </KpiGrid>

      <Section title="Price ladder" description="Fee per watt by tranche midpoint (% of plan capacity reserved), per plan.">
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="trancheMidpointPct"
              type="number"
              tickFormatter={(v) => `${v.toFixed(0)}%`}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tickFormatter={(v) => `₹${v.toFixed(0)}`} tickLine={false} axisLine={false} width={60} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {planNames.map((name) => (
              <Line
                key={name}
                type="stepAfter"
                dataKey={name}
                stroke={`var(--color-${name})`}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ChartContainer>
      </Section>

      <Section title="Tranche summary, by plan">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Base fee ₹/W</TableHead>
              <TableHead className="text-right">Top tranche ₹/W</TableHead>
              <TableHead className="text-right">Avg realised ₹/W</TableHead>
              <TableHead className="text-right">Uplift value</TableHead>
              <TableHead className="text-right">Last-buyer XIRR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.tranches.map((t) => (
              <TableRow key={t.planName}>
                <TableCell>{t.planName}</TableCell>
                <TableCell className="text-right tabular-nums">₹{t.baseFeePerWatt.toFixed(2)}</TableCell>
                <TableCell className="text-right tabular-nums">₹{t.topTrancheFeePerWatt.toFixed(2)}</TableCell>
                <TableCell className="text-right tabular-nums">₹{t.avgRealisedFeePerWatt.toFixed(2)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmtINR(t.upliftValue, { compact: true })}</TableCell>
                <TableCell className="text-right tabular-nums">{t.lastBuyerXirrPct.toFixed(2)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </div>
  );
}
