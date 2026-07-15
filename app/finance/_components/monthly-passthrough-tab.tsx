"use client";

import { useMemo, useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
import {
  computeMonthlyPassthrough,
  DEFAULT_GEN,
  MONTH_DAYS,
  MONTHS,
} from "@/lib/pricing-engine/internal/monthlyPassthrough";
import { KpiCard, KpiGrid, Section } from "./kpi-card";
import { NumField } from "./num-field";
import { fmtINR, fmtNum } from "./state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

const genConfig: ChartConfig = {
  actual: { label: "Actual generation, kWh/kW", color: "var(--chart-1)" },
  flatAvg: { label: "Flat average, kWh/kW", color: "var(--chart-4)" },
};

const creditConfig: ChartConfig = {
  seasonal: { label: "Seasonal credit, ₹/kW", color: "var(--chart-2)" },
  smoothed: { label: "Smoothed credit, ₹/kW", color: "var(--chart-3)" },
};

export function MonthlyPassthroughTab() {
  const [siteKw, setSiteKw] = useState(250);
  const [sharePct, setSharePct] = useState(80);
  const [creditRate, setCreditRate] = useState(5.0);
  const [hostTariff, setHostTariff] = useState(5.5);
  const [targetXirr, setTargetXirr] = useState(11.5);
  const [tenure, setTenure] = useState(15);
  const [gen, setGen] = useState<number[]>([...DEFAULT_GEN]);

  const result = useMemo(
    () =>
      computeMonthlyPassthrough({
        siteKw,
        sharePct,
        creditRatePerUnit: creditRate,
        hostTariffPerUnit: hostTariff,
        targetXirrPct: targetXirr,
        tenureYears: tenure,
        monthlyGenerationKwh: gen,
      }),
    [siteKw, sharePct, creditRate, hostTariff, targetXirr, tenure, gen],
  );

  const genChartData = MONTHS.map((month, i) => ({
    month,
    actual: Math.round(result.perMonthGenPerKw[i]),
    flatAvg: Math.round(result.annualAvgUnitsPerKwDay * (365 / 12)),
  }));
  const creditChartData = MONTHS.map((month, i) => ({
    month,
    seasonal: Math.round(result.userCreditsMonth1PerKw[i]),
    smoothed: Math.round(result.flatMonthlyCreditPerKw),
  }));

  return (
    <div className="flex flex-col gap-4">
      <Section title="Monthly pass-through inputs">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <NumField label="Site size" suffix="kW" value={siteKw} step={10} onChange={setSiteKw} />
          <NumField label="Customer share" suffix="%" value={sharePct} step={5} onChange={setSharePct} />
          <NumField label="Credit rate" suffix="₹/unit" step={0.1} value={creditRate} onChange={setCreditRate} />
          <NumField label="Host tariff" suffix="₹/unit" step={0.1} value={hostTariff} onChange={setHostTariff} />
          <NumField label="Target XIRR" suffix="%" step={0.5} value={targetXirr} onChange={setTargetXirr} />
          <NumField label="Tenure" suffix="years" step={1} value={tenure} onChange={setTenure} />
        </div>
      </Section>

      <KpiGrid>
        <KpiCard label="Auto-priced fee" value={fmtINR(result.autoPricedFeePerKw)} sub="₹/kW" />
        <KpiCard label="Margin vs ₹40/W new-build" value={fmtINR(result.marginPerKwNewBuild)} tone={result.marginPerKwNewBuild >= 0 ? "good" : "bad"} />
        <KpiCard label="Margin vs ₹28/W acquisition" value={fmtINR(result.marginPerKwAcquisition)} tone={result.marginPerKwAcquisition >= 0 ? "good" : "bad"} />
        <KpiCard label="Seasonal swing" value={`±${result.swingPct.toFixed(0)}%`} />
        <KpiCard label="Max working-capital buffer" value={fmtINR(result.maxBufferNeededPerKw)} sub="₹/kW" />
      </KpiGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Actual vs flat-average generation">
          <ChartContainer config={genConfig} className="h-64 w-full">
            <ComposedChart data={genChartData}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={50} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="actual" fill="var(--color-actual)" radius={4} />
              <Line type="monotone" dataKey="flatAvg" stroke="var(--color-flatAvg)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ChartContainer>
        </Section>
        <Section title="Seasonal vs smoothed credit">
          <ChartContainer config={creditConfig} className="h-64 w-full">
            <ComposedChart data={creditChartData}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={50} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="seasonal" fill="var(--color-seasonal)" radius={4} />
              <Line type="monotone" dataKey="smoothed" stroke="var(--color-smoothed)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ChartContainer>
        </Section>
      </div>

      <Section title="Monthly generation table" description="Actual metered generation, whole plant, kWh — edit any month.">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Days</TableHead>
              <TableHead className="text-right">Generation, kWh</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MONTHS.map((month, i) => (
              <TableRow key={month}>
                <TableCell>{month}</TableCell>
                <TableCell className="text-right tabular-nums">{MONTH_DAYS[i]}</TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    className="ml-auto w-28"
                    value={gen[i]}
                    onChange={(e) => {
                      const v = e.target.valueAsNumber || 0;
                      setGen((prev) => prev.map((g, idx) => (idx === i ? v : g)));
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground">
          Annual average: {fmtNum(result.annualAvgUnitsPerKwDay)} units/kW/day
        </p>
      </Section>
    </div>
  );
}
