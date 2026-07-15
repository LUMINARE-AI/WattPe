"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  cash: { label: "Cash", color: "var(--chart-1)" },
  netFixedAssets: { label: "Net fixed assets", color: "var(--chart-3)" },
  escrow: { label: "Escrow", color: "var(--chart-2)" },
};

export function BalanceSheetTab({ output }: { output: RunModelOutput }) {
  const chartData = output.rows.map((r) => ({
    year: r.year === 0 ? "T0" : `Y${r.year}`,
    cash: Math.round(r.cash),
    netFixedAssets: Math.round(r.netFixedAssets),
    escrow: Math.round(r.escrow),
  }));
  const lastRow = output.rows[output.rows.length - 1];
  const maxAbsCheck = Math.max(...output.rows.map((r) => Math.abs(r.balanceCheck)));

  return (
    <div className="flex flex-col gap-4">
      <KpiGrid>
        <KpiCard label="Final net fixed assets" value={fmtLakh(lastRow.netFixedAssets)} />
        <KpiCard label="Final equity" value={fmtLakh(lastRow.equity)} />
        <KpiCard label="Final debt / financed balance" value={fmtLakh(lastRow.debt)} />
        <KpiCard
          label="Balance check (max |Δ|)"
          value={fmtINR(maxAbsCheck)}
          tone={maxAbsCheck < 1 ? "good" : "bad"}
          sub="assets − liabilities+equity"
        />
      </KpiGrid>

      <Section title="Asset build-up" description="Cash, net fixed assets and escrow over the project horizon.">
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <AreaChart data={chartData}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmtINR(v, { compact: true })} width={70} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area type="monotone" dataKey="netFixedAssets" stackId="a" stroke="var(--color-netFixedAssets)" fill="var(--color-netFixedAssets)" fillOpacity={0.5} />
            <Area type="monotone" dataKey="escrow" stackId="a" stroke="var(--color-escrow)" fill="var(--color-escrow)" fillOpacity={0.5} />
            <Area type="monotone" dataKey="cash" stackId="a" stroke="var(--color-cash)" fill="var(--color-cash)" fillOpacity={0.5} />
          </AreaChart>
        </ChartContainer>
      </Section>

      <Section title="Balance sheet detail, by year">
        <YearTable
          rows={output.rows}
          columns={[
            { key: "cash", label: "Cash" },
            { key: "netFixedAssets", label: "Net fixed assets" },
            { key: "escrow", label: "Escrow" },
            { key: "debt", label: "Debt" },
            { key: "deferredRevenue", label: "Deferred rev." },
            { key: "equity", label: "Equity" },
            { key: "balanceCheck", label: "Check" },
          ]}
        />
      </Section>
    </div>
  );
}
