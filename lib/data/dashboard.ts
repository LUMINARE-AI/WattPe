import { prisma } from "@/lib/prisma";

export async function getPrimaryReservation(userId: string) {
  return prisma.reservation.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { plan: true, project: true },
  });
}

export interface GenerationPoint {
  month: string;
  kWh: number;
}

export async function getUserGenerationSeries(
  projectId: string,
  reservationCapacityKW: number,
  projectCapacityKW: number,
): Promise<GenerationPoint[]> {
  const readings = await prisma.generationReading.findMany({
    where: { projectId },
    orderBy: { readingDate: "asc" },
  });
  const share = projectCapacityKW > 0 ? reservationCapacityKW / projectCapacityKW : 0;
  return readings.map((r) => ({
    month: r.readingDate.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
    kWh: Number(r.kwhGenerated) * share,
  }));
}

export interface CreditLedgerRow {
  id: string;
  periodStart: string;
  unitsAllocated: number;
  creditRatePerUnit: number;
  creditAmount: number;
  gridTariffAssumed: number;
  savingsAmount: number;
  offsetStatus: string;
}

export async function getUserCreditLedger(userId: string): Promise<CreditLedgerRow[]> {
  const rows = await prisma.creditLedgerEntry.findMany({
    where: { userId },
    orderBy: { periodStart: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    periodStart: r.periodStart.toISOString(),
    unitsAllocated: Number(r.unitsAllocated),
    creditRatePerUnit: Number(r.creditRatePerUnit),
    creditAmount: Number(r.creditAmount),
    gridTariffAssumed: Number(r.gridTariffAssumed),
    savingsAmount: Number(r.savingsAmount),
    offsetStatus: r.offsetStatus,
  }));
}

export interface PaymentRow {
  id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  createdAt: string;
}

export async function getUserPayments(userId: string): Promise<PaymentRow[]> {
  const rows = await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((p) => ({
    id: p.id,
    amount: Number(p.amount),
    currency: p.currency,
    type: p.type,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
  }));
}
