import { Schema } from "mongoose";
import { getModel } from "@/lib/models/helpers";

const pricingAssumptionSchema = new Schema(
  {
    _id: { type: String, default: "default" },
    genUnitsPerKwDay: { type: Number, required: true },
    promisedUnitsPerKwDay: { type: Number, required: true },
    degradationPct: { type: Number, required: true },
    stepEveryYears: { type: Number, required: true },
    userStepPct: { type: Number, required: true },
    onboardingFeePct: { type: Number, required: true },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

export const PricingAssumption = getModel("PricingAssumption", pricingAssumptionSchema);
