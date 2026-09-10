import { Schema } from "mongoose";
import { getModel } from "@/lib/models/helpers";
import { PROJECT_STATUSES } from "@/lib/models/enums";

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    state: { type: String, required: true },
    discom: { type: String, default: null },
    capacityKW: { type: Number, required: true },
    operationalUntil: { type: Date, required: true },
    commissionedAt: { type: Date, default: null },
    status: { type: String, enum: PROJECT_STATUSES, default: "ACTIVE" },
    heroImage: { type: String, default: null },
    description: { type: String, default: null },
  },
  { timestamps: true },
);

export const Project = getModel("Project", projectSchema);
