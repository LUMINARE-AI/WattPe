import { DEFAULT_DISCOMS } from "@/lib/data/discom-defaults";
import { hasDatabase, isDatabaseUnavailableError } from "@/lib/data/database";
import { prisma } from "@/lib/prisma";

export interface DiscomOption {
  id: string;
  name: string;
  state: string;
}

export async function getSupportedDiscoms(): Promise<DiscomOption[]> {
  if (!hasDatabase()) return DEFAULT_DISCOMS;

  try {
    const rows = await prisma.supportedDiscom.findMany({
      where: { isActive: true },
      orderBy: [{ state: "asc" }, { name: "asc" }],
    });
    return rows.map((d) => ({ id: d.id, name: d.name, state: d.state }));
  } catch (error) {
    if (isDatabaseUnavailableError(error)) return DEFAULT_DISCOMS;
    throw error;
  }
}
