"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/project";
import { Reservation } from "@/lib/models/reservation";
import { requireRole } from "@/lib/requireRole";
import { hasDatabase } from "@/lib/data/database";

export type ProjectActionState = { error?: string; success?: boolean; at?: number };

const projectFieldsSchema = z.object({
  name: z.string().min(2, "Enter a project name."),
  state: z.string().min(2, "Enter a location."),
  discom: z.string().min(1, "Enter a DISCOM."),
  capacityKW: z.coerce.number().positive("Capacity must be greater than 0."),
  operationalUntil: z.string().min(1, "Pick an operational-until date."),
  commissionedAt: z.string().optional(),
  status: z.enum(["UPCOMING", "ACTIVE", "FULL", "CLOSED"]),
  description: z.string().optional(),
});

const projectSchema = projectFieldsSchema.extend({
  id: z.string().min(1),
});

function readProjectFields(formData: FormData) {
  return {
    name: formData.get("name"),
    state: formData.get("state"),
    discom: formData.get("discom"),
    capacityKW: formData.get("capacityKW"),
    operationalUntil: formData.get("operationalUntil"),
    commissionedAt: formData.get("commissionedAt") || undefined,
    status: formData.get("status"),
    description: formData.get("description") || undefined,
  };
}

function toProjectUpdate(data: z.infer<typeof projectFieldsSchema>) {
  return {
    name: data.name,
    state: data.state,
    discom: data.discom,
    capacityKW: data.capacityKW,
    operationalUntil: new Date(data.operationalUntil),
    commissionedAt: data.commissionedAt ? new Date(data.commissionedAt) : null,
    status: data.status,
    description: data.description || null,
  };
}

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "project";
}

async function uniqueSlug(name: string) {
  const base = slugify(name);
  let slug = base;
  let n = 2;
  while (await Project.exists({ slug })) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

function revalidateProject(slug?: string) {
  revalidatePath("/dashboard/user/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  if (slug) revalidatePath(`/projects/${slug}`);
}

function saved(): ProjectActionState {
  return { success: true, at: Date.now() };
}

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
    ...readProjectFields(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const data = parsed.data;

  try {
    await connectDB();
    const updated = await Project.findByIdAndUpdate(data.id, toProjectUpdate(data));
    if (!updated) {
      return { error: "Could not update project. Try again." };
    }
    revalidateProject(updated.slug);
  } catch {
    return { error: "Could not update project. Try again." };
  }

  return saved();
}

export async function createProjectAction(
  _prev: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  await requireRole(["ADMIN"]);

  if (!hasDatabase()) {
    return { error: "Database is not configured." };
  }

  const parsed = projectFieldsSchema.safeParse(readProjectFields(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  try {
    await connectDB();
    const slug = await uniqueSlug(parsed.data.name);
    const created = await Project.create({
      slug,
      ...toProjectUpdate(parsed.data),
    });
    revalidateProject(created.slug);
  } catch {
    return { error: "Could not create project. Try again." };
  }

  return saved();
}

export async function deleteProjectAction(
  _prev: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  await requireRole(["ADMIN"]);

  if (!hasDatabase()) {
    return { error: "Database is not configured." };
  }

  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return { error: "Missing project." };
  }

  try {
    await connectDB();
    const project = await Project.findById(id);
    if (!project) {
      return { error: "Project not found." };
    }

    const reservations = await Reservation.countDocuments({ projectId: project._id });
    if (reservations > 0) {
      return {
        error: "This project has reservations and cannot be deleted.",
      };
    }

    await project.deleteOne();
    revalidateProject(project.slug);
  } catch {
    return { error: "Could not delete project. Try again." };
  }

  return saved();
}
