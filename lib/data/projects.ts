import { DEFAULT_PROJECTS } from "@/lib/data/project-defaults";
import { hasDatabase, isDatabaseUnavailableError } from "@/lib/data/database";
import { connectDB } from "@/lib/db";
import { asDoc, asDocs } from "@/lib/models/helpers";
import { Project } from "@/lib/models/project";
import type { ProjectStatus } from "@/lib/models/enums";

export interface ProjectSummary {
  slug: string;
  name: string;
  state: string;
  discom: string | null;
  capacityKW: number;
  operationalUntil: string;
  description: string | null;
  heroImage: string | null;
  status: ProjectStatus;
  commissionedAt: string | null;
}

type ProjectRow = {
  slug: string;
  name: string;
  state: string;
  discom: string | null;
  capacityKW: number;
  operationalUntil: Date;
  description: string | null;
  heroImage: string | null;
  status: ProjectStatus;
  commissionedAt: Date | null;
};

function mapProject(p: ProjectRow): ProjectSummary {
  return {
    slug: p.slug,
    name: p.name,
    state: p.state,
    discom: p.discom,
    capacityKW: Number(p.capacityKW),
    operationalUntil: p.operationalUntil.toISOString(),
    description: p.description,
    heroImage: p.heroImage,
    status: p.status,
    commissionedAt: p.commissionedAt ? p.commissionedAt.toISOString() : null,
  };
}

export async function getActiveProjects(): Promise<ProjectSummary[]> {
  if (!hasDatabase()) {
    return DEFAULT_PROJECTS.filter((p) => p.status === "ACTIVE");
  }

  try {
    await connectDB();
    const rows = asDocs<ProjectRow>(
      await Project.find({ status: "ACTIVE" }).sort({ commissionedAt: 1 }).lean(),
    );
    return rows.map(mapProject);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return DEFAULT_PROJECTS.filter((p) => p.status === "ACTIVE");
    }
    throw error;
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectSummary | null> {
  if (!hasDatabase()) {
    return DEFAULT_PROJECTS.find((p) => p.slug === slug) ?? null;
  }

  try {
    await connectDB();
    const p = asDoc<ProjectRow>(await Project.findOne({ slug }).lean());
    if (!p) return null;
    return mapProject(p);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return DEFAULT_PROJECTS.find((p) => p.slug === slug) ?? null;
    }
    throw error;
  }
}

export async function getAllProjectSlugs(): Promise<string[]> {
  if (!hasDatabase()) {
    return DEFAULT_PROJECTS.map((p) => p.slug);
  }

  try {
    await connectDB();
    const rows = asDocs<{ slug: string }>(await Project.find({}, { slug: 1 }).lean());
    return rows.map((r) => r.slug);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return DEFAULT_PROJECTS.map((p) => p.slug);
    }
    throw error;
  }
}
