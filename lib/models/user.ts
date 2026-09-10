import { Schema } from "mongoose";
import { getModel } from "@/lib/models/helpers";
import { KYC_STATUSES, ROLES } from "@/lib/models/enums";

const userSchema = new Schema(
  {
    name: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: null },
    role: { type: String, enum: ROLES, default: "USER" },
    kycStatus: { type: String, enum: KYC_STATUSES, default: "NOT_STARTED" },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
  },
  { timestamps: true },
);

export const User = getModel("User", userSchema);
