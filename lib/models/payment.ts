import { Schema } from "mongoose";
import { getModel } from "@/lib/models/helpers";
import { PAYMENT_STATUSES, PAYMENT_TYPES } from "@/lib/models/enums";

const paymentSchema = new Schema(
  {
    reservationId: { type: Schema.Types.ObjectId, ref: "Reservation", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    type: { type: String, enum: PAYMENT_TYPES, required: true },
    status: { type: String, enum: PAYMENT_STATUSES, default: "PENDING" },
    provider: { type: String, default: null },
    providerRef: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Payment = getModel("Payment", paymentSchema);
