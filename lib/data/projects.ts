import { DEFAULT_PROJECTS } from "@/lib/data/project-defaults";
import { hasDatabase, isDatabaseUnavailableError } from "@/lib/data/database";
import { prisma } from "@/lib/prisma";

export interface ProjectSummary {
  slug: string;
  name: string;
  state: string;
  discom: string | null;
  capacityKW: number;
  operationalUntil: string;
  description: string | null;
  heroImage: string | null;
  // Existing schema columns, not previously surfaced by this mapper.
  status: "UPCOMING" | "ACTIVE" | "FULL" | "CLOSED";
  commissionedAt: string | null;
}

function mapProject(p: {
  slug: string;
  name: string;
  state: string;
  discom: string | null;
  capacityKW: unknown;
  operationalUntil: Date;
  description: string | null;
  heroImage: string | null;
  status: ProjectSummary["status"];
  commissionedAt: Date | null;
}): ProjectSummary {
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
    const rows = await prisma.project.findMany({
      where: { status: "ACTIVE" },
      orderBy: { commissionedAt: "asc" },
    });
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
    const p = await prisma.project.findUnique({ where: { slug } });
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
    const rows = await prisma.project.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return DEFAULT_PROJECTS.map((p) => p.slug);
    }
    throw error;
  }
}
