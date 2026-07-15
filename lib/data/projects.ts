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

export async function getActiveProjects(): Promise<ProjectSummary[]> {
  const rows = await prisma.project.findMany({
    where: { status: "ACTIVE" },
    orderBy: { commissionedAt: "asc" },
  });
  return rows.map((p) => ({
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
  }));
}

export async function getProjectBySlug(slug: string): Promise<ProjectSummary | null> {
  const p = await prisma.project.findUnique({ where: { slug } });
  if (!p) return null;
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

export async function getAllProjectSlugs(): Promise<string[]> {
  const rows = await prisma.project.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}
