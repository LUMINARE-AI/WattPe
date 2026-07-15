"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, XAxis, YAxis } from "recharts";
import type { RunModelAssumptions, RunModelOutput, RunModelPlanInput } from "@/lib/pricing-engine/types";
import { sundayGridsBenchmarkXirr } from "@/lib/pricing-engine/internal/decoder";
import { KpiCard, KpiGrid, Section } from "./kpi-card";
import { Button } from "@/components/ui/button";
import { CHART_COLORS, fmtINR, fmtLakh, fmtPct } from "./state";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const savingsConfig: ChartConfig = {
  creditPerKw: { label: "Avg credit, ₹/kW/yr", color: "var(--chart-1)" },
};

const cashConfig: ChartConfig = {
  net: { label: "Net cash flow", color: "var(--chart-2)" },
  cash: { label: "Cumulative cash", color: "var(--chart-4)" },
};

export function DashboardTab({
  assumptions,
  plans,
  output,
}: {
  assumptions: RunModelAssumptions;
  plans: RunModelPlanInput[];
  output: RunModelOutput;
}) {
  const [downloading, setDownloading] = useState(false);
  const sgXirr = useMemo(
    () => sundayGridsBenchmarkXirr(assumptions.genUnitsPerKwDay, assumptions.degradationPct),
    [assumptions.genUnitsPerKwDay, assumptions.degradationPct],
  );

  const savingsData = output.plans.map((p) => ({
    plan: p.name,
    creditPerKw: Math.round(
      Object.values(p.creditStream).reduce((s, v) => s + v, 0) / Math.max(1, p.tenure),
    ),
  }));

  const cashData = output.rows.map((r) => ({
    year: r.year === 0 ? "T0" : `Y${r.year}`,
    net: Math.round(r.operatingCashFlow + r.investingCashFlow + r.financingCashFlow),
    cash: Math.round(r.cash),
  }));

  async function downloadReport() {
    setDownloading(true);
    try {
      const res = await fetch("/api/finance/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assumptions, plans }),
      });
      if (!res.ok) throw new Error("Report generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "solar_business_scenario_report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <KpiGrid>
        <KpiCard label="NPV to equity" value={fmtLakh(output.summary.npv)} tone="accent" />
        <KpiCard label="Cash-on-cash" value={fmtPct(output.summary.cashOnCash)} tone={output.summary.cashOnCash >= 0 ? "good" : "bad"} />
        <KpiCard label="Flywheel 5y CAGR" value={fmtPct(output.summary.flywheelCagr)} tone={output.summary.flywheelCagr >= 0 ? "good" : "bad"} />
        <KpiCard label="SundayGrids benchmark XIRR" value={`${sgXirr.toFixed(2)}%`} />
      </KpiGrid>

      <Section title="Plan performance vs SundayGrids benchmark">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {output.plans.map((p) => {
            const delta = p.realizedXirrPct - sgXirr;
            return (
              <div key={p.name} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm font-semibold">{p.name}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      delta >= 0
                        ? "bg-accent text-brand-green-hover"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {delta >= 0 ? "+" : ""}
                    {delta.toFixed(2)}pp
                  </span>
                </div>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{p.realizedXirrPct.toFixed(2)}%</p>
                <p className="text-xs text-muted-foreground">
                  {p.tenure}yr · ₹{p.creditRatePerUnit.toFixed(2)}/unit · {p.kwSold.toFixed(1)} kW sold
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Customer savings per kW" description="Average annual credit per kW, by plan.">
          <ChartContainer config={savingsConfig} className="h-64 w-full">
            <BarChart data={savingsData}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="plan" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(v) => fmtINR(v, { compact: true })} tickLine={false} axisLine={false} width={70} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="creditPerKw" radius={4}>
                {savingsData.map((entry, i) => (
                  <Cell key={entry.plan} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </Section>

        <Section title="Cash story" description="Net cash flow (bars) vs cumulative cash (line).">
          <ChartContainer config={cashConfig} className="h-64 w-full">
            <ComposedChart data={cashData}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(v) => fmtINR(v, { compact: true })} tickLine={false} axisLine={false} width={70} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="net" fill="var(--color-net)" radius={4} />
              <Line type="monotone" dataKey="cash" stroke="var(--color-cash)" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ChartContainer>
        </Section>
      </div>

      <Section title="Export">
        <Button onClick={downloadReport} disabled={downloading}>
          <Download />
          {downloading ? "Generating…" : "Download Excel report"}
        </Button>
      </Section>
    </div>
  );
}
