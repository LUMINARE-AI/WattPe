import type { RunModelYearRow } from "@/lib/pricing-engine/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fmtINR } from "./state";

export interface YearTableColumn {
  key: keyof RunModelYearRow;
  label: string;
  compact?: boolean;
}

export function YearTable({
  rows,
  columns,
}: {
  rows: RunModelYearRow[];
  columns: YearTableColumn[];
}) {
  return (
    <div className="max-h-96 overflow-y-auto rounded-lg border border-border">
      <Table>
        <TableHeader className="sticky top-0 bg-card">
          <TableRow>
            <TableHead>Year</TableHead>
            {columns.map((c) => (
              <TableHead key={c.key} className="text-right">
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.year}>
              <TableCell className="font-medium">{row.year === 0 ? "T0" : row.year}</TableCell>
              {columns.map((c) => (
                <TableCell key={c.key} className="text-right tabular-nums">
                  {fmtINR(row[c.key] as number, { compact: c.compact })}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
