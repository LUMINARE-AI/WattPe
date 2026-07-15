"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { GenerationPoint } from "@/lib/data/dashboard";

const chartConfig: ChartConfig = {
  kWh: { label: "Generation (kWh)", color: "var(--chart-1)" },
};

export function GenerationChart({ data }: { data: GenerationPoint[] }) {
  return (
    <Card className="border-border/80 rounded-2xl">
      <CardHeader>
        <CardTitle>Generation, your share</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="kWh" fill="var(--color-kWh)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
