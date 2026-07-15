"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { DecoderSolveFor } from "@/lib/pricing-engine/internal/decoder";
import { decodeProject } from "@/lib/pricing-engine/internal/decoder";
import { KpiCard, KpiGrid, Section } from "./kpi-card";
import { NumField } from "./num-field";
import { fmtINR } from "./state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  credit: { label: "Credit, ₹/kW", color: "var(--chart-1)" },
};

export function DecoderTab() {
  const [kwReserved, setKwReserved] = useState(10);
  const [monthlyKwh, setMonthlyKwh] = useState(1350);
  const [genDirect, setGenDirect] = useState(0);
  const [feeTotal, setFeeTotal] = useState(400000);
  const [feePerWatt, setFeePerWatt] = useState(0);
  const [degradationPct, setDegradationPct] = useState(1.0);
  const [onboardingFeePct, setOnboardingFeePct] = useState(1.0);
  const [refundPct, setRefundPct] = useState(0);
  const [solveFor, setSolveFor] = useState<DecoderSolveFor>("credit");
  const [creditRatePerUnit, setCreditRatePerUnit] = useState(5.5);
  const [tenureYears, setTenureYears] = useState(15);
  const [targetXirrPct, setTargetXirrPct] = useState(11.5);

  const result = useMemo(
    () =>
      decodeProject({
        kwReserved,
        monthlyProductionKwh: monthlyKwh || undefined,
        genDirectUnitsPerKwDay: genDirect || undefined,
        feeTotal: feeTotal || undefined,
        feePerWatt: feePerWatt || undefined,
        degradationPct,
        onboardingFeePct,
        refundPct,
        solveFor,
        creditRatePerUnit,
        tenureYears,
        targetXirrPct,
      }),
    [
      kwReserved,
      monthlyKwh,
      genDirect,
      feeTotal,
      feePerWatt,
      degradationPct,
      onboardingFeePct,
      refundPct,
      solveFor,
      creditRatePerUnit,
      tenureYears,
      targetXirrPct,
    ],
  );

  const chartData = result.creditStream.map((v, i) => ({ year: `Y${i + 1}`, credit: Math.round(v) }));

  return (
    <div className="flex flex-col gap-4">
      <Section title="Decoder / validator inputs" description="Enter whatever real-world data you have — the decoder reconstructs the rest.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <NumField label="kW reserved" step={1} value={kwReserved} onChange={setKwReserved} />
          <NumField label="Monthly production" suffix="kWh" step={10} value={monthlyKwh} onChange={setMonthlyKwh} />
          <NumField label="Generation directly" suffix="u/kW/day" step={0.1} value={genDirect} onChange={setGenDirect} />
          <NumField label="Fee total" suffix="₹" step={1000} value={feeTotal} onChange={setFeeTotal} />
          <NumField label="Fee per watt" suffix="₹/W" step={0.5} value={feePerWatt} onChange={setFeePerWatt} />
          <NumField label="Degradation" suffix="%/yr" step={0.1} value={degradationPct} onChange={setDegradationPct} />
          <NumField label="Onboarding fee" suffix="%" step={0.5} value={onboardingFeePct} onChange={setOnboardingFeePct} />
          <NumField label="Refund at tenure end" suffix="%" step={5} value={refundPct} onChange={setRefundPct} />
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 sm:grid-cols-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Solve for</Label>
            <Select value={solveFor} onValueChange={(v) => setSolveFor(v as DecoderSolveFor)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit rate</SelectItem>
                <SelectItem value="tenure">Tenure</SelectItem>
                <SelectItem value="target">Achieved XIRR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <NumField label="Credit rate" suffix="₹/unit" step={0.1} value={creditRatePerUnit} onChange={setCreditRatePerUnit} className={solveFor === "credit" ? "opacity-50" : undefined} />
          <NumField label="Tenure" suffix="years" step={1} value={tenureYears} onChange={setTenureYears} className={solveFor === "tenure" ? "opacity-50" : undefined} />
          <NumField label="Target XIRR" suffix="%" step={0.5} value={targetXirrPct} onChange={setTargetXirrPct} className={solveFor === "target" ? "opacity-50" : undefined} />
        </div>
      </Section>

      {result.error ? (
        <Badge variant="destructive">{result.error}</Badge>
      ) : (
        <>
          <KpiGrid>
            <KpiCard label="Implied generation" value={`${result.impliedGenUnitsPerKwDay.toFixed(2)} u/kW/day`} />
            <KpiCard label="Implied fee" value={`₹${result.impliedFeePerWatt.toFixed(2)}/W`} />
            <KpiCard label="Solved value" value={result.solvedLabel} tone="accent" />
            <KpiCard label="SundayGrids benchmark" value={`${result.sundayGridsBenchmarkXirrPct.toFixed(2)}%`} />
          </KpiGrid>
          <p className="text-sm text-muted-foreground">{result.vsSundayGridsLabel}</p>

          <Section title="Reconstructed credit stream">
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
        </>
      )}
    </div>
  );
}
