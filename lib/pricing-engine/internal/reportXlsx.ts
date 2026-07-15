import ExcelJS from "exceljs";
import type { RunModelAssumptions, RunModelOutput } from "@/lib/pricing-engine/types";

/**
 * Port of the Python engine's `build_report_xlsx()` (dash_studio_v6.py:1181-1264),
 * using `exceljs` in place of `openpyxl`. Builds the same 5 sheets (Summary
 * KPIs, Plans, Cash Flow, Balance Sheet, Assumptions) with equivalent
 * formatting (bold headers, currency number formats, conditional green/red
 * fills), returning a Buffer.
 */

const INR_FORMAT = '"₹" #,##0;[Red]("₹" #,##0)';
const PCT_FORMAT = "0.00%";

const NAVY = "FF1F4E79";
const LIGHT_BLUE = "FFD9E1F2";
const GREEN = "FFC6EFCE";
const RED = "FFFFC7CE";

function fill(color: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb: color } };
}

export interface ReportXlsxInput {
  assumptions: RunModelAssumptions;
  output: RunModelOutput;
  /** SundayGrids benchmark XIRR, percent (as returned by `sundayGridsBenchmarkXirr`/`SG_XIRR`). */
  sundayGridsBenchmarkXirrPct: number;
}

export async function buildReportXlsx(input: ReportXlsxInput): Promise<Buffer> {
  const { assumptions: a, output, sundayGridsBenchmarkXirrPct: sg } = input;
  const { rows, plans: P, summary: M } = output;

  const wb = new ExcelJS.Workbook();

  // ---- Summary ----
  const ws = wb.addWorksheet("Summary");
  ws.getCell("A1").value = "Solar Business Studio — Scenario Report";
  ws.getCell("A1").font = { name: "Arial", bold: true, size: 14 };
  ws.getCell("A2").value =
    `Generated from live app state | Plant ${a.kw} kW | Capex ₹${a.capexPerWatt}/W | Host tariff ₹${a.hostTariffPerUnit}/unit`;
  ws.getCell("A2").font = { name: "Arial", italic: true, color: { argb: "FF808080" } };
  ws.getCell("A4").value = "KEY METRICS";
  ws.getCell("A4").font = { name: "Arial", bold: true, color: { argb: NAVY } };
  ws.getCell("A4").fill = fill(LIGHT_BLUE);

  const kpis: [string, number, string][] = [
    ["Project NPV (to equity)", M.npv, INR_FORMAT],
    ["15-yr nominal profit", M.nominal, INR_FORMAT],
    ["Cycle cash-on-cash", M.cashOnCash, PCT_FORMAT],
    ["Flywheel ROE (5y CAGR)", M.flywheelCagr, PCT_FORMAT],
    ["Min cash balance", M.minCash, INR_FORMAT],
    ["Equity needed per project", M.equityNeed, INR_FORMAT],
    ["Day-0 fees collected", M.back, INR_FORMAT],
    ["SundayGrids benchmark XIRR", sg / 100, PCT_FORMAT],
  ];
  let r = 5;
  for (const [label, val, fmt] of kpis) {
    ws.getCell(r, 1).value = label;
    ws.getCell(r, 1).font = { name: "Arial", bold: true };
    const c = ws.getCell(r, 2);
    c.value = val;
    c.numFmt = fmt;
    r++;
  }

  // ---- Plans ----
  const ws2 = wb.addWorksheet("Plans");
  const planHeads = [
    "Plan",
    "Tenure",
    "Credit ₹/unit",
    "Fee ₹/kW",
    "Fee ₹/W",
    "User XIRR",
    "vs SG (pp)",
    "Refund %",
  ];
  planHeads.forEach((h, i) => {
    const c = ws2.getCell(1, i + 1);
    c.value = h;
    c.font = { name: "Arial", bold: true, color: { argb: "FFFFFFFF" } };
    c.fill = fill(NAVY);
  });
  P.forEach((p, idx) => {
    const row = idx + 2;
    ws2.getCell(row, 1).value = p.name;
    ws2.getCell(row, 2).value = p.tenure;
    ws2.getCell(row, 3).value = p.creditRatePerUnit;
    const feeCell = ws2.getCell(row, 4);
    feeCell.value = p.fee;
    feeCell.numFmt = INR_FORMAT;
    const feeWCell = ws2.getCell(row, 5);
    feeWCell.value = p.fee / 1000;
    feeWCell.numFmt = '"₹"0.0"/W"';
    const xirrCell = ws2.getCell(row, 6);
    xirrCell.value = p.realizedXirrPct / 100;
    xirrCell.numFmt = PCT_FORMAT;
    const diff = (p.realizedXirrPct - sg) / 100;
    const diffCell = ws2.getCell(row, 7);
    diffCell.value = diff;
    diffCell.numFmt = PCT_FORMAT;
    diffCell.fill = fill(diff >= 0 ? GREEN : RED);
    const refundCell = ws2.getCell(row, 8);
    refundCell.value = p.refundFraction;
    refundCell.numFmt = PCT_FORMAT;
  });
  ["A", "B", "C", "D", "E", "F", "G", "H"].forEach((col) => {
    ws2.getColumn(col).width = 16;
  });

  // ---- Cash Flow ----
  const ws3 = wb.addWorksheet("Cash Flow");
  const cfHeads = ["Year", "Operating", "Investing", "Financing", "Cash balance"];
  cfHeads.forEach((h, i) => {
    const c = ws3.getCell(1, i + 1);
    c.value = h;
    c.font = { name: "Arial", bold: true, color: { argb: "FFFFFFFF" } };
    c.fill = fill(NAVY);
  });
  let cashCum = 0;
  rows.forEach((row, idx) => {
    cashCum += row.operatingCashFlow + row.investingCashFlow + row.financingCashFlow;
    const excelRow = idx + 2;
    const values = [
      row.year,
      Math.round(row.operatingCashFlow),
      Math.round(row.investingCashFlow),
      Math.round(row.financingCashFlow),
      Math.round(cashCum),
    ];
    values.forEach((v, cidx) => {
      const c = ws3.getCell(excelRow, cidx + 1);
      c.value = v;
      if (cidx > 0) {
        c.numFmt = INR_FORMAT;
        c.fill = fill(v >= 0 ? GREEN : RED);
      }
    });
  });
  ["A", "B", "C", "D", "E"].forEach((col) => {
    ws3.getColumn(col).width = 16;
  });

  // ---- Balance Sheet ----
  const ws4 = wb.addWorksheet("Balance Sheet");
  const bsHeads = [
    "Year",
    "Cash",
    "Plant (net)",
    "Escrow",
    "Debt",
    "Deferred revenue",
    "Host deposit",
    "Refund liability",
    "Equity",
    "Balance check",
  ];
  bsHeads.forEach((h, i) => {
    const c = ws4.getCell(1, i + 1);
    c.value = h;
    c.font = { name: "Arial", bold: true, color: { argb: "FFFFFFFF" } };
    c.fill = fill(NAVY);
  });
  rows.forEach((row, idx) => {
    const excelRow = idx + 2;
    const cash = row.assets - row.netFixedAssets - row.escrow;
    const values = [
      row.year,
      round2(cash),
      round2(row.netFixedAssets),
      round2(row.escrow),
      round2(row.debt),
      round2(row.deferredRevenue),
      round2(row.deposit),
      round2(row.refundLiability),
      round2(row.equity),
      round2(row.balanceCheck),
    ];
    values.forEach((v, cidx) => {
      const c = ws4.getCell(excelRow, cidx + 1);
      c.value = v;
      if (cidx > 0) c.numFmt = INR_FORMAT;
    });
  });
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].forEach((col) => {
    ws4.getColumn(col).width = 15;
  });

  // ---- Assumptions ----
  const ws5 = wb.addWorksheet("Assumptions");
  ws5.getCell("A1").value = "All input values at time of export";
  ws5.getCell("A1").font = { name: "Arial", bold: true, size: 14 };
  let ar = 3;
  for (const [k, v] of Object.entries(a)) {
    ws5.getCell(ar, 1).value = k;
    ws5.getCell(ar, 1).font = { name: "Arial", bold: true };
    ws5.getCell(ar, 2).value = v as ExcelJS.CellValue;
    ar++;
  }
  ws5.getColumn("A").width = 24;
  ws5.getColumn("B").width = 16;

  const arrayBuffer = await wb.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}
