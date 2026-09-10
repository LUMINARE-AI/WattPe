import { Schema } from "mongoose";
import { getModel } from "@/lib/models/helpers";
import { OFFSET_STATUSES } from "@/lib/models/enums";

const creditLedgerEntrySchema = new Schema(
  {
    reservationId: { type: Schema.Types.ObjectId, ref: "Reservation", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    periodStart: { type: Date, required: true },
    unitsAllocated: { type: Number, required: true },
    creditRatePerUnit: { type: Number, required: true },
    creditAmount: { type: Number, required: true },
    gridTariffAssumed: { type: Number, required: true },
    savingsAmount: { type: Number, required: true },
    offsetStatus: { type: String, enum: OFFSET_STATUSES, default: "APPLIED" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const CreditLedgerEntry = getModel("CreditLedgerEntry", creditLedgerEntrySchema);
