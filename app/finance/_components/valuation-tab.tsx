"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { RunModelOutput } from "@/lib/pricing-engine/types";
import { compareFinancingStructures } from "@/lib/pricing-engine/internal/financingCompare";
import type { RunModelAssumptions, RunModelPlanInput } from "@/lib/pricing-engine/types";
import { KpiCard, KpiGrid, Section } from "./kpi-card";
import { fmtINR, fmtLakh, fmtPct } from "./state";
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
  type ChartConfig,
} from "@/components/ui/chart";
import { useMemo } from "react";

const chartConfig: ChartConfig = {
  npv: { label: "NPV", color: "var(--chart-1)" },
};

export function ValuationTab({
  assumptions,
  plans,
  output,
}: {
  assumptions: RunModelAssumptions;
  plans: RunModelPlanInput[];
  output: RunModelOutput;
}) {
  const m = output.summary;
  const scenarios = useMemo(
    () => compareFinancingStructures(assumptions, plans),
    [assumptions, plans],
  );
  const chartData = scenarios.map((s) => ({
    name: s.structureLabel,
    npv: Math.round(s.npv),
  }));

  return (
    <div className="flex flex-col gap-4">
      <KpiGrid>
        <KpiCard label="NPV to equity" value={fmtLakh(m.npv)} tone="accent" />
        <KpiCard label="Nominal 15yr profit" value={fmtLakh(m.nominal)} />
        <KpiCard label="Cash-on-cash" value={fmtPct(m.cashOnCash)} tone={m.cashOnCash >= 0 ? "good" : "bad"} />
        <KpiCard label="Flywheel 5y CAGR" value={fmtPct(m.flywheelCagr)} tone={m.flywheelCagr >= 0 ? "good" : "bad"} />
      </KpiGrid>

      <Section title="Financing structure comparison" description="Same assumptions run through 4 financing scenarios.">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 32 }}>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis type="number" tickFormatter={(v) => fmtINR(v, { compact: true })} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={220} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="npv" fill="var(--chart-1)" radius={4} />
          </BarChart>
        </ChartContainer>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Structure</TableHead>
              <TableHead className="text-right">Equity needed</TableHead>
              <TableHead className="text-right">NPV</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
              <TableHead className="text-right">Cash-on-cash</TableHead>
              <TableHead className="text-right">True financing cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((s) => (
              <TableRow key={s.structureLabel}>
                <TableCell>{s.structureLabel}</TableCell>
                <TableCell className="text-right tabular-nums">{fmtINR(s.equityNeeded, { compact: true })}</TableCell>
                <TableCell className="text-right tabular-nums">{fmtINR(s.npv, { compact: true })}</TableCell>
                <TableCell className="text-right tabular-nums">{fmtINR(s.nominal15yr, { compact: true })}</TableCell>
                <TableCell className="text-right tabular-nums">{fmtPct(s.cashOnCash)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmtINR(s.trueFinancingCost, { compact: true })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </div>
  );
}
