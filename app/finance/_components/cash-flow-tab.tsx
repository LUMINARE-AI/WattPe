"use client";

import { Bar, ComposedChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import type { RunModelOutput } from "@/lib/pricing-engine/types";
import { KpiCard, KpiGrid, Section } from "./kpi-card";
import { YearTable } from "./year-table";
import { fmtINR, fmtLakh } from "./state";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  net: { label: "Net cash flow", color: "var(--chart-1)" },
  cash: { label: "Cumulative cash", color: "var(--chart-4)" },
};

export function CashFlowTab({ output }: { output: RunModelOutput }) {
  const chartData = output.rows.map((r) => ({
    year: r.year === 0 ? "T0" : `Y${r.year}`,
    net: Math.round(r.operatingCashFlow + r.investingCashFlow + r.financingCashFlow),
    cash: Math.round(r.cash),
  }));

  return (
    <div className="flex flex-col gap-4">
      <KpiGrid>
        <KpiCard
          label="Minimum cash balance"
          value={fmtLakh(output.summary.minCash)}
          tone={output.summary.minCash >= 0 ? "good" : "bad"}
        />
        <KpiCard label="NPV to equity" value={fmtLakh(output.summary.npv)} tone="accent" />
        <KpiCard label="Nominal profit" value={fmtLakh(output.summary.nominal)} />
        <KpiCard label="Day-0 net cash" value={fmtLakh(chartData[0]?.net ?? 0)} />
      </KpiGrid>

      <Section title="Cash story" description="Net cash flow per year (bars) vs cumulative cash balance (line).">
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <ComposedChart data={chartData}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmtINR(v, { compact: true })} width={70} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="net" fill="var(--color-net)" radius={4} />
            <Line type="monotone" dataKey="cash" stroke="var(--color-cash)" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ChartContainer>
      </Section>

      <Section title="Cash flow detail, by year">
        <YearTable
          rows={output.rows}
          columns={[
            { key: "operatingCashFlow", label: "Operating" },
            { key: "investingCashFlow", label: "Investing" },
            { key: "financingCashFlow", label: "Financing" },
            { key: "cash", label: "Cumulative cash" },
          ]}
        />
      </Section>
    </div>
  );
}
