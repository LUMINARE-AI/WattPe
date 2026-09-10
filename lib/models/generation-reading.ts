import { Schema } from "mongoose";
import { getModel } from "@/lib/models/helpers";
import { READING_SOURCES } from "@/lib/models/enums";

const generationReadingSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    readingDate: { type: Date, required: true },
    kwhGenerated: { type: Number, required: true },
    source: { type: String, enum: READING_SOURCES, default: "SEEDED" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

generationReadingSchema.index({ projectId: 1, readingDate: 1 }, { unique: true });

export const GenerationReading = getModel("GenerationReading", generationReadingSchema);
