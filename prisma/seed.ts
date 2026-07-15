import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { computePlanEconomics } from "@/lib/pricing-engine/planEconomics";
import { toEngineAssumptions } from "@/lib/pricing-engine/transforms";
import type { PlanInput } from "@/lib/pricing-engine/types";

// Mirrors DEF in dash_studio_v4.py:153-157
const DEF_ASSUMPTIONS = {
  genUnitsPerKwDay: 4.5,
  promisedUnitsPerKwDay: 4.0,
  degradationPct: 1.0,
  stepEveryYears: 5,
  userStepPct: 10.0,
  onboardingFeePct: 1.0,
  maxYears: 15,
};

// Mirrors DEF_PLANS in dash_studio_v4.py:158-162
const DEF_PLANS: (PlanInput & { mixPct: number })[] = [
  { code: "GROWTH_15", name: "Growth-15", tenureYears: 15, creditRatePerUnit: 4.0, targetXirrPct: 11.5, refundPct: 0, mixPct: 50, autoResell: false },
  { code: "FLEXI_10", name: "Flexi-10", tenureYears: 10, creditRatePerUnit: 4.5, targetXirrPct: 11.0, refundPct: 0, mixPct: 25, autoResell: false },
  { code: "SHORT_3", name: "Short-3", tenureYears: 3, creditRatePerUnit: 7.0, targetXirrPct: 10.0, refundPct: 0, mixPct: 15, autoResell: true },
  { code: "ASSURED_15", name: "Assured-15", tenureYears: 15, creditRatePerUnit: 3.4, targetXirrPct: 10.5, refundPct: 100, mixPct: 10, autoResell: false },
];

// Mirrors MONTHS / MONTH_DAYS / DEFAULT_GEN in dash_studio_v4.py:297-299
// (Indian FY: Apr-Mar). DEFAULT_GEN is whole-plant kWh for an implied 15 kW site.
const MONTH_DAYS = [30, 31, 30, 31, 31, 30, 31, 30, 31, 31, 28, 31];
const DEFAULT_GEN_AT_15KW = [2490, 2164, 1924.78, 1370.11, 1602.72, 1950.55, 1724.08, 1553.53, 1446.82, 1330.25, 1693.44, 2283];
const DEFAULT_GEN_BASE_KW = 15;

const DEMO_PASSWORD = "WattPe#2026";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const [, , user] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@wattpe.com" },
      update: {},
      create: { email: "admin@wattpe.com", name: "WattPe Admin", passwordHash, role: "ADMIN", kycStatus: "VERIFIED" },
    }),
    prisma.user.upsert({
      where: { email: "finance@wattpe.com" },
      update: {},
      create: { email: "finance@wattpe.com", name: "WattPe Finance", passwordHash, role: "FINANCE", kycStatus: "VERIFIED" },
    }),
    prisma.user.upsert({
      where: { email: "user@wattpe.com" },
      update: {},
      create: { email: "user@wattpe.com", name: "Arjun Rao", passwordHash, role: "USER", kycStatus: "VERIFIED" },
    }),
  ]);

  const pricingAssumptionColumns = {
    genUnitsPerKwDay: DEF_ASSUMPTIONS.genUnitsPerKwDay,
    promisedUnitsPerKwDay: DEF_ASSUMPTIONS.promisedUnitsPerKwDay,
    degradationPct: DEF_ASSUMPTIONS.degradationPct,
    stepEveryYears: DEF_ASSUMPTIONS.stepEveryYears,
    userStepPct: DEF_ASSUMPTIONS.userStepPct,
    onboardingFeePct: DEF_ASSUMPTIONS.onboardingFeePct,
  };
  await prisma.pricingAssumption.upsert({
    where: { id: "default" },
    update: pricingAssumptionColumns,
    create: { id: "default", ...pricingAssumptionColumns },
  });

  await Promise.all(
    DEF_PLANS.map((plan) =>
      prisma.plan.upsert({
        where: { code: plan.code },
        update: {
          name: plan.name,
          tenureYears: plan.tenureYears,
          creditRatePerUnit: plan.creditRatePerUnit,
          targetXirrPct: plan.targetXirrPct,
          refundPct: plan.refundPct,
          mixPct: plan.mixPct,
          autoResell: plan.autoResell ?? false,
        },
        create: {
          code: plan.code,
          name: plan.name,
          tenureYears: plan.tenureYears,
          creditRatePerUnit: plan.creditRatePerUnit,
          targetXirrPct: plan.targetXirrPct,
          refundPct: plan.refundPct,
          mixPct: plan.mixPct,
          autoResell: plan.autoResell ?? false,
        },
      }),
    ),
  );

  const discoms = [
    { name: "BESCOM", state: "Karnataka" },
    { name: "MSEDCL", state: "Maharashtra" },
    { name: "Adani Electricity Mumbai", state: "Maharashtra" },
    { name: "Tata Power Mumbai", state: "Maharashtra" },
    { name: "BEST", state: "Maharashtra" },
  ];
  for (const d of discoms) {
    const existing = await prisma.supportedDiscom.findFirst({ where: { name: d.name } });
    if (!existing) {
      await prisma.supportedDiscom.create({ data: d });
    }
  }

  const project = await prisma.project.upsert({
    where: { slug: "vega-150" },
    update: {},
    create: {
      slug: "vega-150",
      name: "Vega 150",
      state: "Karnataka",
      discom: "BESCOM",
      capacityKW: 250,
      operationalUntil: new Date("2040-03-31"),
      commissionedAt: new Date("2024-06-01"),
      status: "ACTIVE",
      description:
        "A 250 kW community solar plant near Bengaluru, generating credits for over 60 reserved households.",
    },
  });

  await prisma.project.upsert({
    where: { slug: "helios-80" },
    update: {},
    create: {
      slug: "helios-80",
      name: "Helios 80",
      state: "Maharashtra",
      discom: "Adani Electricity Mumbai",
      capacityKW: 80,
      operationalUntil: new Date("2039-12-31"),
      commissionedAt: new Date("2024-11-01"),
      status: "ACTIVE",
      description: "An 80 kW rooftop-scale community plant serving Mumbai households on Adani Electricity.",
    },
  });

  // ---- Demo reservation: Arjun on Growth-15 at Vega 150, started 12 months ago ----
  const growth15 = DEF_PLANS[0];
  const dbPlan = await prisma.plan.findUniqueOrThrow({ where: { code: growth15.code } });
  const assumptions = toEngineAssumptions(DEF_ASSUMPTIONS);
  const economics = computePlanEconomics(growth15, assumptions);

  const reservationCapacityKW = 5;
  const reservationFeePerKW = economics.feePerKW;
  const reservationFee = reservationCapacityKW * reservationFeePerKW;

  const startDate = new Date();
  startDate.setUTCMonth(startDate.getUTCMonth() - 12);
  startDate.setUTCDate(1);
  const tenureEndsAt = new Date(startDate);
  tenureEndsAt.setUTCFullYear(tenureEndsAt.getUTCFullYear() + growth15.tenureYears);

  const existingReservation = await prisma.reservation.findFirst({
    where: { userId: user.id, projectId: project.id, planId: dbPlan.id },
  });

  const reservation =
    existingReservation ??
    (await prisma.reservation.create({
      data: {
        userId: user.id,
        projectId: project.id,
        planId: dbPlan.id,
        capacityKW: reservationCapacityKW,
        feePerKW: reservationFeePerKW,
        reservationFee,
        status: "ACTIVE",
        startDate,
        tenureEndsAt,
      },
    }));

  const existingPayment = await prisma.payment.findFirst({ where: { reservationId: reservation.id } });
  if (!existingPayment) {
    await prisma.payment.create({
      data: {
        reservationId: reservation.id,
        userId: user.id,
        amount: reservationFee,
        type: "RESERVATION_FEE",
        status: "SUCCEEDED",
        provider: "seed",
        createdAt: startDate,
      },
    });
  }

  // ---- 12 months of generation readings for the project, seasonal shape from DEFAULT_GEN ----
  const gridTariffAssumed = 8.0; // DEF['grid0']
  const year1CreditPerKW = economics.creditStream[1] ?? 0;
  const monthlyCreditAmount = (year1CreditPerKW * reservationCapacityKW) / 12;

  for (let i = 0; i < DEFAULT_GEN_AT_15KW.length; i++) {
    const monthKWhAt15kW = DEFAULT_GEN_AT_15KW[i];
    const projectKWh =
      (monthKWhAt15kW / DEFAULT_GEN_BASE_KW) * Number(project.capacityKW);

    const readingDate = new Date(startDate);
    readingDate.setUTCMonth(readingDate.getUTCMonth() + i);

    await prisma.generationReading.upsert({
      where: { projectId_readingDate: { projectId: project.id, readingDate } },
      update: { kwhGenerated: projectKWh, source: "SEEDED" },
      create: {
        projectId: project.id,
        readingDate,
        kwhGenerated: projectKWh,
        source: "SEEDED",
      },
    });

    const unitsAllocated =
      reservationCapacityKW * DEF_ASSUMPTIONS.promisedUnitsPerKwDay * MONTH_DAYS[i];

    const existingEntry = await prisma.creditLedgerEntry.findFirst({
      where: { reservationId: reservation.id, periodStart: readingDate },
    });
    if (!existingEntry) {
      await prisma.creditLedgerEntry.create({
        data: {
          reservationId: reservation.id,
          userId: user.id,
          periodStart: readingDate,
          unitsAllocated,
          creditRatePerUnit: growth15.creditRatePerUnit,
          creditAmount: monthlyCreditAmount,
          gridTariffAssumed,
          savingsAmount: monthlyCreditAmount,
          offsetStatus: "APPLIED",
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log(`  Admin:   admin@wattpe.com   / ${DEMO_PASSWORD}`);
  console.log(`  Finance: finance@wattpe.com / ${DEMO_PASSWORD}`);
  console.log(`  User:    user@wattpe.com    / ${DEMO_PASSWORD}`);
  console.log(`  Demo reservation: ${reservationCapacityKW} kW of ${project.name} on ${growth15.name}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
