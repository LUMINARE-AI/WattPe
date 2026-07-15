"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import type { RunModelAssumptions, RunModelPlanInput } from "@/lib/pricing-engine/types";
import {
  tornadoAnalysis,
  tariffCreditHeatmap,
} from "@/lib/pricing-engine/internal/sensitivity";
import { Section } from "./kpi-card";
import { fmtINR } from "./state";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig: ChartConfig = {
  low: { label: "-10%", color: "var(--destructive)" },
  high: { label: "+10%", color: "var(--chart-1)" },
};

function heatCellStyle(value: number, maxAbs: number): React.CSSProperties {
  if (maxAbs === 0) return {};
  const t = Math.max(-1, Math.min(1, value / maxAbs));
  // Diverging: destructive (negative) <-> neutral gray <-> brand-green (positive)
  const color = t >= 0 ? "var(--chart-1)" : "var(--destructive)";
  const alpha = Math.abs(t) * 0.75;
  return { backgroundColor: `color-mix(in oklch, ${color} ${alpha * 100}%, transparent)` };
}

export function SensitivityTab({
  assumptions,
  plans,
}: {
  assumptions: RunModelAssumptions;
  plans: RunModelPlanInput[];
}) {
  const tornado = useMemo(() => tornadoAnalysis(assumptions, plans), [assumptions, plans]);
  const heatmap = useMemo(() => tariffCreditHeatmap(assumptions, plans), [assumptions, plans]);

  const tornadoData = tornado
    .map((t) => ({ driver: t.driver, low: Math.round(t.low), high: Math.round(t.high) }))
    .sort((a, b) => Math.abs(b.high - b.low) - Math.abs(a.high - a.low));

  const maxAbsHeat = Math.max(...heatmap.npvGridLakh.flat().map((v) => Math.abs(v)), 1);

  return (
    <div className="flex flex-col gap-4">
      <Section
        title="Tornado — NPV sensitivity"
        description="Each driver perturbed ±10% from base; bars show the NPV delta vs base case."
      >
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <BarChart data={tornadoData} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis type="number" tickFormatter={(v) => fmtINR(v, { compact: true })} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="driver" tickLine={false} axisLine={false} width={110} />
            <ReferenceLine x={0} stroke="var(--border)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="low" stackId="t" fill="var(--color-low)" radius={4} />
            <Bar dataKey="high" stackId="t" fill="var(--color-high)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Section>

      <Section
        title="Tariff × credit-shift NPV heatmap"
        description="NPV (₹ lakh) across host tariff (columns) and a uniform credit-rate shift applied to all plans (rows)."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-1 text-left font-medium text-muted-foreground">Credit shift \ Tariff</th>
                {heatmap.tariffs.map((t) => (
                  <th key={t} className="p-1 text-center font-medium text-muted-foreground">
                    ₹{t.toFixed(2)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmap.creditShifts.map((shift, ri) => (
                <tr key={shift}>
                  <td className="p-1 text-right font-medium text-muted-foreground">
                    {shift >= 0 ? "+" : ""}
                    {shift.toFixed(2)}
                  </td>
                  {heatmap.npvGridLakh[ri].map((v, ci) => (
                    <td
                      key={ci}
                      className={cn("p-1.5 text-center tabular-nums")}
                      style={heatCellStyle(v, maxAbsHeat)}
                    >
                      {v.toFixed(0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
