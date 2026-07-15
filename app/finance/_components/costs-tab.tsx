"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  credits: { label: "Customer credits", color: "var(--chart-1)" },
  om: { label: "O&M + insurance", color: "var(--chart-2)" },
  plat: { label: "Platform opex", color: "var(--chart-3)" },
  mkt: { label: "Marketing", color: "var(--chart-4)" },
};

export function CostsTab({ output }: { output: RunModelOutput }) {
  const opRows = output.rows.filter((r) => r.year >= 1);
  const chartData = opRows.map((r) => ({
    year: `Y${r.year}`,
    credits: Math.round(r.credits),
    om: Math.round(r.om),
    plat: Math.round(r.plat),
    mkt: Math.round(r.mkt),
  }));
  const totalCredits = opRows.reduce((s, r) => s + r.credits, 0);
  const totalOm = opRows.reduce((s, r) => s + r.om, 0);
  const totalPlat = opRows.reduce((s, r) => s + r.plat, 0);
  const totalMkt = opRows.reduce((s, r) => s + r.mkt, 0);

  return (
    <div className="flex flex-col gap-4">
      <KpiGrid>
        <KpiCard label="Total customer credits" value={fmtLakh(totalCredits)} />
        <KpiCard label="Total O&M + insurance" value={fmtLakh(totalOm)} />
        <KpiCard label="Total platform opex" value={fmtLakh(totalPlat)} />
        <KpiCard label="Total marketing spend" value={fmtLakh(totalMkt)} />
      </KpiGrid>

      <Section title="Cost stack by year">
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmtINR(v, { compact: true })} width={70} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="credits" stackId="cost" fill="var(--color-credits)" />
            <Bar dataKey="om" stackId="cost" fill="var(--color-om)" />
            <Bar dataKey="plat" stackId="cost" fill="var(--color-plat)" />
            <Bar dataKey="mkt" stackId="cost" fill="var(--color-mkt)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </Section>

      <Section title="Cost detail, by year">
        <YearTable
          rows={output.rows}
          columns={[
            { key: "credits", label: "Credits" },
            { key: "om", label: "O&M" },
            { key: "plat", label: "Platform" },
            { key: "mkt", label: "Marketing" },
            { key: "depreciation", label: "Depreciation" },
          ]}
        />
      </Section>
    </div>
  );
}
