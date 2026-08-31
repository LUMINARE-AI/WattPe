"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Wallet, Zap, Activity, PiggyBank, ArrowRight } from "lucide-react";
import { forSavingsForecast } from "@/lib/pricing-engine/public/calculator";
import type { EngineAssumptions, PlanInput } from "@/lib/pricing-engine/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function SavingsCalculator({
  plan,
  assumptions,
}: {
  plan: PlanInput;
  assumptions: EngineAssumptions;
}) {
  const [bill, setBill] = useState(3000);
  const [savingsPct, setSavingsPct] = useState(75);

  const result = useMemo(
    () =>
      forSavingsForecast(
        { avgMonthlyBill: bill, desiredSavingsPct: savingsPct },
        plan,
        assumptions,
      ),
    [bill, savingsPct, plan, assumptions],
  );

  const cumulative15y =
    result.cumulativeSavingsByYear[result.cumulativeSavingsByYear.length - 1]
      ?.cumulativeSavings ?? 0;

  return (
    <div className="bg-brand-paper border-border relative overflow-hidden rounded-3xl border p-6 shadow-[0_1px_2px_rgba(15,31,31,0.05),0_20px_50px_rgba(15,31,31,0.08)] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-brand-green font-mono text-xs font-semibold tracking-wide uppercase">
            Savings forecast calculator
          </p>
          <p className="text-muted-foreground mt-3 text-sm">
            Estimated on the {plan.name} plan — {plan.tenureYears}-year
            tenure, ₹{plan.creditRatePerUnit.toFixed(1)}/unit credit.
          </p>

          <div className="mt-8 space-y-1.5">
            <Label htmlFor="bill">Average monthly electricity bill</Label>
            <div className="relative">
              <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                ₹
              </span>
              <Input
                id="bill"
                type="number"
                min={0}
                value={bill}
                onChange={(e) => setBill(Number(e.target.value) || 0)}
                className="bg-card h-11 rounded-xl pl-7"
              />
            </div>
          </div>

          <div className="mt-6 space-y-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="savings-pct">Desired savings</Label>
              <span className="text-brand-green font-mono text-sm font-semibold">
                {savingsPct}%
              </span>
            </div>
            <Slider
              id="savings-pct"
              value={[savingsPct]}
              min={10}
              max={100}
              step={5}
              onValueChange={(v) =>
                setSavingsPct(Array.isArray(v) ? v[0] : v)
              }
              className="mt-3 [&_[data-slot=slider-range]]:bg-brand-green [&_[data-slot=slider-thumb]]:border-brand-green"
            />
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3">
            <Stat
              icon={Wallet}
              label="Monthly savings"
              value={inr.format(result.monthlySavings)}
              chipTone="teal"
              isSavingsFigure
            />
            <Stat
              icon={Zap}
              label="Reserved capacity"
              value={`${result.reservedCapacityKW.toFixed(2)} kW`}
              chipTone="coral"
            />
            <Stat
              icon={Activity}
              label="Monthly generation"
              value={`${result.monthlyEnergyProductionKWh.toFixed(0)} kWh`}
              chipTone="coral"
            />
            <Stat
              icon={PiggyBank}
              label="Annual savings"
              value={inr.format(result.annualSavings)}
              chipTone="teal"
              isSavingsFigure
            />
          </div>

          <div className="border-border bg-card mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-4 text-sm shadow-[0_1px_2px_rgba(15,31,31,0.04)]">
            <span className="text-muted-foreground">
              {plan.tenureYears}-year cumulative savings
            </span>
            <span className="text-brand-teal font-mono text-lg font-semibold">
              {inr.format(cumulative15y)}
            </span>
          </div>

          <div className="border-border bg-card mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border p-4 text-sm shadow-[0_1px_2px_rgba(15,31,31,0.04)]">
            <span className="text-muted-foreground">
              One-time reservation fee
            </span>
            <span className="font-mono text-lg font-semibold">
              {inr.format(result.reservationFee)}
            </span>
          </div>

          <Button
            size="lg"
            className="bg-brand-green hover:bg-brand-green-hover mt-5 h-11 w-full rounded-full text-white"
            render={<Link href="/projects" />}
          >
            Reserve your capacity <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  chipTone,
  isSavingsFigure = false,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  chipTone: "coral" | "teal";
  isSavingsFigure?: boolean;
}) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-[0_1px_2px_rgba(15,31,31,0.04),0_6px_16px_rgba(15,31,31,0.05)]">
      <div
        className={cn(
          "mb-2.5 flex size-7 items-center justify-center rounded-lg",
          chipTone === "coral" ? "bg-brand-green/15" : "bg-brand-teal/15",
        )}
      >
        <Icon
          className={cn(
            "size-3.5",
            chipTone === "coral" ? "text-brand-green" : "text-brand-teal",
          )}
        />
      </div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p
        className={cn(
          "mt-0.5 font-mono text-lg font-semibold tabular-nums",
          isSavingsFigure && "text-brand-teal",
        )}
      >
        {value}
      </p>
    </div>
  );
}
