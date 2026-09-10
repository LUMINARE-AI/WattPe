"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/requireRole";
import { hasDatabase } from "@/lib/data/database";

export type ProjectActionState = { error?: string; success?: boolean };

const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, "Enter a project name."),
  state: z.string().min(2, "Enter a location."),
  discom: z.string().min(1, "Enter a DISCOM."),
  capacityKW: z.coerce.number().positive("Capacity must be greater than 0."),
  operationalUntil: z.string().min(1, "Pick an operational-until date."),
  commissionedAt: z.string().optional(),
  status: z.enum(["UPCOMING", "ACTIVE", "FULL", "CLOSED"]),
  description: z.string().optional(),
});

export async function updateProjectAction(
  _prev: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  await requireRole(["ADMIN"]);

  if (!hasDatabase()) {
    return { error: "Database is not configured." };
  }

  const parsed = projectSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    state: formData.get("state"),
    discom: formData.get("discom"),
    capacityKW: formData.get("capacityKW"),
    operationalUntil: formData.get("operationalUntil"),
    commissionedAt: formData.get("commissionedAt") || undefined,
    status: formData.get("status"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const data = parsed.data;

  try {
    await prisma.project.update({
      where: { id: data.id },
      data: {
        name: data.name,
        state: data.state,
        discom: data.discom,
        capacityKW: data.capacityKW,
        operationalUntil: new Date(data.operationalUntil),
        commissionedAt: data.commissionedAt ? new Date(data.commissionedAt) : null,
        status: data.status,
        description: data.description || null,
      },
    });
  } catch {
    return { error: "Could not update project. Try again." };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");

  return { success: true };
}
