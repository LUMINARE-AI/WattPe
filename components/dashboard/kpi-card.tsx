import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <Card className={cn("border-border/80 rounded-2xl", className)}>
      <CardContent>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-heading text-primary mt-1.5 text-2xl font-semibold tabular-nums">
          {value}
        </p>
        {sub && <p className="text-muted-foreground mt-1 text-xs">{sub}</p>}
      </CardContent>
    </Card>
  );
}
