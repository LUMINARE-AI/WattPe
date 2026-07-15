import { prisma } from "@/lib/prisma";

export interface DiscomOption {
  id: string;
  name: string;
  state: string;
}

export async function getSupportedDiscoms(): Promise<DiscomOption[]> {
  const rows = await prisma.supportedDiscom.findMany({
    where: { isActive: true },
    orderBy: [{ state: "asc" }, { name: "asc" }],
  });
  return rows.map((d) => ({ id: d.id, name: d.name, state: d.state }));
}
