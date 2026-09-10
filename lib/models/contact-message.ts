import { Schema } from "mongoose";
import { getModel } from "@/lib/models/helpers";

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ContactMessage = getModel("ContactMessage", contactMessageSchema);
