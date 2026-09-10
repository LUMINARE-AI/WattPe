import { Schema } from "mongoose";
import { getModel } from "@/lib/models/helpers";

const planSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tenureYears: { type: Number, required: true },
    creditRatePerUnit: { type: Number, required: true },
    targetXirrPct: { type: Number, required: true },
    refundPct: { type: Number, default: 0 },
    mixPct: { type: Number, required: true },
    autoResell: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

export const Plan = getModel("Plan", planSchema);
