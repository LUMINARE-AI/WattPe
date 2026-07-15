"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { RunModelAssumptions, RunModelOutput } from "@/lib/pricing-engine/types";
import { sundayGridsBenchmarkXirr } from "@/lib/pricing-engine/internal/decoder";
import { KpiCard, KpiGrid, Section } from "./kpi-card";
import { YearTable } from "./year-table";
import { fmtINR, fmtLakh } from "./state";
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

const chartConfig: ChartConfig = {
  host: { label: "Host PPA revenue", color: "var(--chart-1)" },
  feeCash: { label: "Reservation fee cash", color: "var(--chart-2)" },
  onboarding: { label: "Onboarding fee", color: "var(--chart-3)" },
};

export function RevenueTab({
  output,
  assumptions,
}: {
  output: RunModelOutput;
  assumptions: RunModelAssumptions;
}) {
  const sgXirr = useMemo(
    () => sundayGridsBenchmarkXirr(assumptions.genUnitsPerKwDay, assumptions.degradationPct),
    [assumptions.genUnitsPerKwDay, assumptions.degradationPct],
  );

  const opRows = output.rows.filter((r) => r.year >= 1);
  const chartData = output.rows.map((r) => ({
    year: r.year === 0 ? "T0" : `Y${r.year}`,
    host: Math.round(r.host),
    feeCash: Math.round(r.feeCash),
    onboarding: Math.round(r.onboarding),
  }));
  const totalHost = opRows.reduce((s, r) => s + r.host, 0);
  const totalFees = output.rows.reduce((s, r) => s + r.feeCash, 0);

  return (
    <div className="flex flex-col gap-4">
      <KpiGrid>
        <KpiCard label="Total host PPA revenue" value={fmtLakh(totalHost)} sub="over full tenure" />
        <KpiCard label="Total reservation fees" value={fmtLakh(totalFees)} sub="cash booked at sale" />
        <KpiCard label="Day-0 fees + onboarding" value={fmtLakh(output.summary.back)} tone="accent" />
        <KpiCard label="kW sold" value={output.summary.sold.toFixed(1)} sub={`of ${output.summary.sellable.toFixed(1)} sellable`} />
      </KpiGrid>

      <Section
        title="Revenue Model"
        description="Two engines: (1) one-time capacity sales, (2) 15 years of host PPA payments."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Tenure</TableHead>
              <TableHead className="text-right">kW_sold</TableHead>
              <TableHead className="text-right">Fee_per_kW</TableHead>
              <TableHead className="text-right">Fee_per_W</TableHead>
              <TableHead className="text-right">User_XIRR</TableHead>
              <TableHead className="text-right">Refund</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {output.plans.map((p) => (
              <TableRow key={p.name}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-right tabular-nums">{p.tenure}</TableCell>
                <TableCell className="text-right tabular-nums">{p.kwSold.toFixed(1)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmtINR(p.fee)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  ₹{(p.fee / 1000).toFixed(1)}/W
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {p.realizedXirrPct.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {(p.refundFraction * 100).toFixed(0)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="bg-accent text-accent-foreground rounded-lg px-3 py-2 text-sm">
          SundayGrids benchmark (₹56k/kW, ₹5.2/unit, 15y): {sgXirr.toFixed(2)}% XIRR — green plans
          beat this.
        </p>
      </Section>

      <Section title="Revenue by year" description="Host PPA revenue vs one-time fee cash booked, by year.">
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmtINR(v, { compact: true })} width={70} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="host" stackId="rev" fill="var(--color-host)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="feeCash" stackId="rev" fill="var(--color-feeCash)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="onboarding" stackId="rev" fill="var(--color-onboarding)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </Section>

      <Section title="Revenue detail, by year">
        <YearTable
          rows={output.rows}
          columns={[
            { key: "host", label: "Host PPA" },
            { key: "feeCash", label: "Fee cash" },
            { key: "onboarding", label: "Onboarding" },
            { key: "amortization", label: "Amortization" },
          ]}
        />
      </Section>
    </div>
  );
}
