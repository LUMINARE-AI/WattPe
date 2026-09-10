import { DEFAULT_DISCOMS } from "@/lib/data/discom-defaults";
import { hasDatabase, isDatabaseUnavailableError } from "@/lib/data/database";
import { connectDB } from "@/lib/db";
import { asDocs } from "@/lib/models/helpers";
import { SupportedDiscom } from "@/lib/models/supported-discom";

export interface DiscomOption {
  id: string;
  name: string;
  state: string;
}

type DiscomRow = {
  _id: { toString(): string };
  name: string;
  state: string;
};

export async function getSupportedDiscoms(): Promise<DiscomOption[]> {
  if (!hasDatabase()) return DEFAULT_DISCOMS;

  try {
    await connectDB();
    const rows = asDocs<DiscomRow>(
      await SupportedDiscom.find({ isActive: true }).sort({ state: 1, name: 1 }).lean(),
    );
    return rows.map((d) => ({ id: d._id.toString(), name: d.name, state: d.state }));
  } catch (error) {
    if (isDatabaseUnavailableError(error)) return DEFAULT_DISCOMS;
    throw error;
  }
}
