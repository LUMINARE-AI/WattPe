import { Schema } from "mongoose";
import { getModel } from "@/lib/models/helpers";
import { RESERVATION_STATUSES } from "@/lib/models/enums";

const reservationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    capacityKW: { type: Number, required: true },
    feePerKW: { type: Number, required: true },
    reservationFee: { type: Number, required: true },
    status: { type: String, enum: RESERVATION_STATUSES, default: "PENDING_PAYMENT" },
    startDate: { type: Date, default: null },
    tenureEndsAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Reservation = getModel("Reservation", reservationSchema);
