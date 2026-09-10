import { Schema } from "mongoose";
import { getModel } from "@/lib/models/helpers";

const verificationTokenSchema = new Schema(
  {
    identifier: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
  },
  { timestamps: false },
);

verificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

export const VerificationToken = getModel("VerificationToken", verificationTokenSchema);
