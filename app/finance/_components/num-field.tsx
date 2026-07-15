"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Reusable labeled number input mirroring the Python `num_field()` helper
 * (dash_studio_v6.py:260-266) — a label above a native numeric input.
 */
export function NumField({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  suffix,
  className,
  id,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          step={step}
          min={min}
          max={max}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => {
            const v = e.target.valueAsNumber;
            onChange(Number.isNaN(v) ? 0 : v);
          }}
          className={suffix ? "pr-8" : undefined}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-xs text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}
