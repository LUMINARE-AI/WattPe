"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  reserveCapacityAction,
  type ReserveState,
} from "@/lib/actions/reserve";
import { cn } from "@/lib/utils";

export type ReservablePlan = {
  code: string;
  name: string;
  tenureYears: number;
  creditRatePerUnit: number;
  refundPct: number;
  targetXirrPct: number;
  feePerKW: number;
};

type ProjectReserveSectionProps = {
  projectSlug: string;
  projectName: string;
  projectStatus: "UPCOMING" | "ACTIVE" | "FULL" | "CLOSED";
  plans: ReservablePlan[];
  isLoggedIn: boolean;
};

function defaultPlanCode(plans: ReservablePlan[]) {
  return plans.find((plan) => plan.code === "GROWTH_15")?.code ?? plans[0]?.code ?? "";
}

function loginHref(slug: string, planCode: string) {
  const callbackUrl = `/projects/${slug}/reserve?plan=${planCode}`;
  return `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

export function ProjectReserveSection({
  projectSlug,
  projectName,
  projectStatus,
  plans,
  isLoggedIn,
}: ProjectReserveSectionProps) {
  const [selectedCode, setSelectedCode] = useState(defaultPlanCode(plans));
  const [state, formAction, pending] = useActionState<ReserveState, FormData>(
    reserveCapacityAction,
    undefined,
  );

  const selected = useMemo(
    () => plans.find((plan) => plan.code === selectedCode) ?? plans[0],
    [plans, selectedCode],
  );

  const unavailable = projectStatus === "FULL" || projectStatus === "CLOSED";
  const canReserve = !unavailable && Boolean(selected);

  const ctaLabel = projectStatus === "FULL"
    ? "Fully reserved"
    : `Reserve capacity in ${projectName}`;

  return (
    <>
      <h2 className="font-heading text-2xl font-bold">Choose your plan</h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm">
        Every plan credits your bill for the tenure shown, at the credit
        rate locked in when you reserve.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const isSelected = plan.code === selected?.code;
          return (
            <button
              key={plan.code}
              type="button"
              aria-pressed={isSelected}
              disabled={unavailable}
              onClick={() => setSelectedCode(plan.code)}
              className="w-full appearance-none rounded-xl border-0 bg-transparent p-0 text-left disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Card
                className={cn(
                  "border-border/80 h-full transition-colors",
                  isSelected
                    ? "border-primary ring-primary/40 ring-2"
                    : "hover:border-primary/50",
                )}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {plan.tenureYears}-year tenure
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <Row
                    label="Credit rate"
                    value={`₹${plan.creditRatePerUnit.toFixed(2)}/unit`}
                  />
                  <Row
                    label="Fee"
                    value={`₹${(plan.feePerKW / 1000).toFixed(1)}/W`}
                  />
                  <Row
                    label="Refund at end"
                    value={plan.refundPct > 0 ? `${plan.refundPct}%` : "—"}
                  />
                  <Row
                    label="Target return"
                    value={`${plan.targetXirrPct.toFixed(1)}%`}
                  />
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        {isLoggedIn ? (
          <form action={formAction}>
            <input type="hidden" name="projectSlug" value={projectSlug} />
            <input type="hidden" name="planCode" value={selected?.code ?? ""} />
            <Button type="submit" size="lg" disabled={!canReserve || pending}>
              {pending ? "Reserving…" : ctaLabel}
            </Button>
          </form>
        ) : (
          <Button
            size="lg"
            disabled={!canReserve}
            render={
              canReserve && selected ? (
                <Link href={loginHref(projectSlug, selected.code)} />
              ) : undefined
            }
          >
            {ctaLabel}
          </Button>
        )}
        {selected && !unavailable && (
          <p className="text-muted-foreground mt-3 text-sm">
            Reserving {selected.name}
          </p>
        )}
        {state?.error && (
          <p className="text-destructive mt-3 text-sm">{state.error}</p>
        )}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
