"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { RunModelAssumptions, RunModelOutput } from "@/lib/pricing-engine/types";
import { KpiCard, KpiGrid, Section } from "./kpi-card";
import { YearTable } from "./year-table";
import { fmtINR, fmtLakh, fmtPct, fmtNum } from "./state";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const sourcesConfig: ChartConfig = {
  value: { label: "₹", color: "var(--chart-1)" },
};

export function ProjectFinanceTab({
  assumptions,
  output,
}: {
  assumptions: RunModelAssumptions;
  output: RunModelOutput;
}) {
  const m = output.summary;
  const sources = [
    { name: "Equity", value: Math.round(assumptions.equityAtT0) },
    { name: "Financed (debt/PS)", value: Math.round(m.financed) },
  ];
  const uses = [
    { name: "Capex", value: Math.round(m.capex) },
    { name: "Host deposit", value: Math.round(m.deposit) },
    { name: "Refund escrow", value: Math.round(m.escrow0) },
  ];
  const structureLabel =
    m.financingType === "equity"
      ? "100% Equity"
      : m.financingType === "debt"
        ? "Debt (EMI)"
        : `Profit-share (${assumptions.profitShareDiminishing ? "diminishing" : "flat"})`;
  const opRows = output.rows.filter((r) => r.year >= 1);

  return (
    <div className="flex flex-col gap-4">
      <KpiGrid>
        <KpiCard label="Financing structure" value={structureLabel} />
        <KpiCard label="Equity needed" value={fmtLakh(m.equityNeed)} />
        <KpiCard label="Financed amount" value={fmtLakh(m.financed)} />
        <KpiCard label="Cash-on-cash" value={fmtPct(m.cashOnCash)} tone={m.cashOnCash >= 0 ? "good" : "bad"} />
        <KpiCard label="Dedicated / carve-out kW" value={fmtNum(m.dedicated)} sub={`sellable ${fmtNum(m.sellable)} kW`} />
        <KpiCard label="DSCR" value={Number.isFinite(m.dscr) ? m.dscr.toFixed(2) + "x" : "n/a"} />
        {m.financingType === "debt" ? (
          <KpiCard label="Annual EMI" value={fmtLakh(m.emi)} />
        ) : null}
        {m.financingType === "profitshare" ? (
          <>
            <KpiCard label="Financer's revenue share" value={fmtPct(m.financerFraction)} />
            <KpiCard label="Year-1 profit-share payout" value={fmtLakh(m.profitSharePayYear1)} />
            <KpiCard label="Implied rate (yr1)" value={fmtPct(m.profitShareImpliedRate)} />
          </>
        ) : null}
      </KpiGrid>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title="Sources" description="Where the money at t0 comes from.">
          <ChartContainer config={sourcesConfig} className="h-56 w-full">
            <BarChart data={sources} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tickFormatter={(v) => fmtINR(v, { compact: true })} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={140} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--chart-1)" radius={4} />
            </BarChart>
          </ChartContainer>
        </Section>
        <Section title="Uses" description="Where the money at t0 goes.">
          <ChartContainer config={sourcesConfig} className="h-56 w-full">
            <BarChart data={uses} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tickFormatter={(v) => fmtINR(v, { compact: true })} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={140} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--chart-2)" radius={4} />
            </BarChart>
          </ChartContainer>
        </Section>
      </div>

      {m.financingType === "debt" ? (
        <Section
          title="Debt amortization schedule"
          description="Annual EMI split between interest and principal, and the outstanding balance."
        >
          <YearTable
            rows={opRows}
            columns={[
              { key: "interest", label: "Interest" },
              { key: "principal", label: "Principal" },
              { key: "debt", label: "Debt outstanding" },
            ]}
          />
        </Section>
      ) : null}

      {m.financingType === "profitshare" ? (
        <Section
          title="Profit-share schedule"
          description="Host revenue vs the financer's profit-share distribution and principal buyback."
        >
          <YearTable
            rows={opRows}
            columns={[
              { key: "host", label: "Host revenue (gross)" },
              { key: "profitSharePay", label: "Financer's profit-share" },
              { key: "profitShareBuyback", label: "Financer's buyback (principal)" },
            ]}
          />
        </Section>
      ) : null}
    </div>
  );
}
