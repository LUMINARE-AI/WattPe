import { connectDB } from "@/lib/db";
import { asDoc, asDocs } from "@/lib/models/helpers";
import { CreditLedgerEntry } from "@/lib/models/credit-ledger-entry";
import { GenerationReading } from "@/lib/models/generation-reading";
import { Payment } from "@/lib/models/payment";
import { Plan } from "@/lib/models/plan";
import { Project } from "@/lib/models/project";
import { Reservation } from "@/lib/models/reservation";

type PopulatedProject = {
  _id: { toString(): string };
  name: string;
  state: string;
  capacityKW: number;
};

type PopulatedPlan = {
  name: string;
  creditRatePerUnit: number;
  tenureYears: number;
  refundPct: number;
};

type ReservationRow = {
  _id: { toString(): string };
  capacityKW: number;
  status: string;
  startDate: Date | null;
  tenureEndsAt: Date | null;
  projectId: PopulatedProject;
  planId: PopulatedPlan;
};

export type PrimaryReservation = {
  id: string;
  projectId: string;
  capacityKW: number;
  status: string;
  startDate: Date | null;
  tenureEndsAt: Date | null;
  project: PopulatedProject;
  plan: PopulatedPlan;
};

export async function getPrimaryReservation(userId: string): Promise<PrimaryReservation | null> {
  await connectDB();
  const row = asDoc<ReservationRow>(
    await Reservation.findOne({ userId }).sort({ createdAt: 1 }).populate("projectId").populate("planId").lean(),
  );

  if (!row?.projectId || !row.planId) return null;
  if (typeof row.projectId !== "object" || !("name" in row.projectId)) return null;
  if (typeof row.planId !== "object" || !("name" in row.planId)) return null;

  return {
    id: String(row._id),
    projectId: String(row.projectId._id),
    capacityKW: row.capacityKW,
    status: row.status,
    startDate: row.startDate ?? null,
    tenureEndsAt: row.tenureEndsAt ?? null,
    project: row.projectId,
    plan: row.planId,
  };
}

export interface GenerationPoint {
  month: string;
  kWh: number;
}

type ReadingRow = {
  readingDate: Date;
  kwhGenerated: number;
};

export async function getUserGenerationSeries(
  projectId: string,
  reservationCapacityKW: number,
  projectCapacityKW: number,
): Promise<GenerationPoint[]> {
  await connectDB();
  const readings = asDocs<ReadingRow>(
    await GenerationReading.find({ projectId }).sort({ readingDate: 1 }).lean(),
  );
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

type LedgerRow = {
  _id: { toString(): string };
  periodStart: Date;
  unitsAllocated: number;
  creditRatePerUnit: number;
  creditAmount: number;
  gridTariffAssumed: number;
  savingsAmount: number;
  offsetStatus: string;
};

export async function getUserCreditLedger(userId: string): Promise<CreditLedgerRow[]> {
  await connectDB();
  const rows = asDocs<LedgerRow>(
    await CreditLedgerEntry.find({ userId }).sort({ periodStart: 1 }).lean(),
  );
  return rows.map((r) => ({
    id: String(r._id),
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

type PaymentDocRow = {
  _id: { toString(): string };
  amount: number;
  currency: string;
  type: string;
  status: string;
  createdAt: Date;
};

export async function getUserPayments(userId: string): Promise<PaymentRow[]> {
  await connectDB();
  const rows = asDocs<PaymentDocRow>(await Payment.find({ userId }).sort({ createdAt: -1 }).lean());
  return rows.map((p) => ({
    id: String(p._id),
    amount: Number(p.amount),
    currency: p.currency,
    type: p.type,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
  }));
}

// Ensure related models are registered before populate().
void Plan;
void Project;
