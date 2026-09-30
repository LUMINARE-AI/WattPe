import { connectDB } from "@/lib/db";
import { hasDatabase } from "@/lib/data/database";
import { getEngineAssumptions } from "@/lib/data/pricing";
import { asDoc } from "@/lib/models/helpers";
import { Plan } from "@/lib/models/plan";
import { Project } from "@/lib/models/project";
import { Reservation } from "@/lib/models/reservation";
import { computePlanEconomics } from "@/lib/pricing-engine/planEconomics";
import type { PlanInput } from "@/lib/pricing-engine/types";

type ProjectRow = {
  _id: unknown;
  status: string;
  capacityKW: number;
};

type PlanRow = {
  _id: unknown;
  code: string;
  name: string;
  tenureYears: number;
  creditRatePerUnit: number;
  targetXirrPct: number;
  refundPct: number;
  autoResell: boolean;
};

export async function completeReservation(
  userId: string,
  projectSlug: string,
  planCode: string,
): Promise<{ error?: string }> {
  if (!hasDatabase()) {
    return { error: "Reservations aren't available right now." };
  }

  await connectDB();

  const existing = asDoc(
    await Reservation.findOne({
      userId,
      status: { $in: ["PENDING_PAYMENT", "ACTIVE"] },
    }).lean(),
  );
  if (existing) return {};

  const project = asDoc<ProjectRow>(await Project.findOne({ slug: projectSlug }).lean());
  if (!project) return { error: "That project isn't available." };
  if (project.status === "FULL") return { error: "This plant is fully reserved." };
  if (project.status !== "ACTIVE") {
    return { error: "This plant isn't accepting reservations." };
  }

  const plan = asDoc<PlanRow>(
    await Plan.findOne({ code: planCode, isActive: true }).lean(),
  );
  if (!plan) return { error: "Choose a valid plan to reserve." };

  const assumptions = await getEngineAssumptions();
  const planInput: PlanInput = {
    code: plan.code,
    name: plan.name,
    tenureYears: plan.tenureYears,
    creditRatePerUnit: Number(plan.creditRatePerUnit),
    targetXirrPct: Number(plan.targetXirrPct),
    refundPct: Number(plan.refundPct),
    autoResell: plan.autoResell,
  };
  const economics = computePlanEconomics(planInput, assumptions);
  const capacityKW = Number(project.capacityKW);
  const feePerKW = economics.feePerKW;
  const reservationFee = capacityKW * feePerKW;

  const startDate = new Date();
  const tenureEndsAt = new Date(startDate);
  tenureEndsAt.setUTCFullYear(tenureEndsAt.getUTCFullYear() + plan.tenureYears);

  await Reservation.create({
    userId,
    projectId: project._id,
    planId: plan._id,
    capacityKW,
    feePerKW,
    reservationFee,
    status: "ACTIVE",
    startDate,
    tenureEndsAt,
  });

  return {};
}
