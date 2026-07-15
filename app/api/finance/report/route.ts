import { NextRequest, NextResponse } from "next/server";
import { runModel } from "@/lib/pricing-engine/internal/runModel";
import { sundayGridsBenchmarkXirr } from "@/lib/pricing-engine/internal/decoder";
import { buildReportXlsx } from "@/lib/pricing-engine/internal/reportXlsx";
import type { RunModelAssumptions, RunModelPlanInput } from "@/lib/pricing-engine/types";

/**
 * Generates the Business Studio Excel scenario report. Recomputes the model
 * server-side from the assumptions/plans posted by the client (the client
 * never calls `buildReportXlsx` directly — it's async and Node-only via
 * exceljs, so it must run in an API route).
 */
export async function POST(req: NextRequest) {
  let body: { assumptions?: RunModelAssumptions; plans?: RunModelPlanInput[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { assumptions, plans } = body;
  if (!assumptions || !plans) {
    return NextResponse.json({ error: "Missing assumptions or plans" }, { status: 400 });
  }

  const output = runModel(assumptions, plans);
  const sg = sundayGridsBenchmarkXirr(assumptions.genUnitsPerKwDay, assumptions.degradationPct);

  const buffer = await buildReportXlsx({
    assumptions,
    output,
    sundayGridsBenchmarkXirrPct: sg,
  });

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="solar_business_scenario_report.xlsx"',
    },
  });
}
