"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DiscomOption } from "@/lib/data/discoms";

export function CompatibilityChecker({ discoms }: { discoms: DiscomOption[] }) {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const selected = discoms.find((d) => d.id === selectedId);

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle>Check compatibility</CardTitle>
        <p className="text-muted-foreground text-sm">
          Confirm your electricity provider supports WattPe credits.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={selectedId}
          onValueChange={(value) => setSelectedId(value ?? undefined)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your electricity provider" />
          </SelectTrigger>
          <SelectContent>
            {discoms.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name} — {d.state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selected && (
          <div className="border-primary/30 bg-primary/10 animate-in fade-in slide-in-from-top-1 flex items-center gap-2 rounded-xl border p-4 text-sm duration-200">
            <CheckCircle2 className="text-primary size-5 shrink-0" />
            <span>
              <strong>{selected.name}</strong> is supported — you can reserve
              capacity and start earning credits right away.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
