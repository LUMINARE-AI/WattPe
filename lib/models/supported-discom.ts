import { Schema } from "mongoose";
import { getModel } from "@/lib/models/helpers";

const supportedDiscomSchema = new Schema(
  {
    name: { type: String, required: true },
    state: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: false },
);

export const SupportedDiscom = getModel("SupportedDiscom", supportedDiscomSchema);
