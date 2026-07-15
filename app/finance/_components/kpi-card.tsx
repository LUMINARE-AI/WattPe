import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "good" | "bad" | "accent";
}) {
  return (
    <Card size="sm" className="min-w-0">
      <CardContent className="flex flex-col gap-0.5">
        <span className="truncate text-xs text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-heading text-xl leading-tight font-semibold tabular-nums",
            tone === "good" && "text-brand-green",
            tone === "bad" && "text-destructive",
            tone === "accent" && "text-brand-sun-hover",
          )}
        >
          {value}
        </span>
        {sub ? <span className="text-xs text-muted-foreground">{sub}</span> : null}
      </CardContent>
    </Card>
  );
}

export function KpiGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {children}
    </div>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div>
        <h3 className="font-heading text-sm font-semibold">{title}</h3>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
