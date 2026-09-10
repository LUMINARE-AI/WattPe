import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/requireRole";
import { hasDatabase } from "@/lib/data/database";
import { connectDB } from "@/lib/db";
import { asDocs } from "@/lib/models/helpers";
import { Project } from "@/lib/models/project";
import { DEFAULT_PROJECTS } from "@/lib/data/project-defaults";
import {
  ProjectEditForm,
  type AdminProject,
} from "@/app/admin/projects/project-edit-form";

export const metadata = { title: "Projects — Admin" };

function mapDefault(p: (typeof DEFAULT_PROJECTS)[number]): AdminProject {
  return {
    id: `default-${p.slug}`,
    slug: p.slug,
    name: p.name,
    state: p.state,
    discom: p.discom,
    capacityKW: p.capacityKW,
    operationalUntil: p.operationalUntil,
    commissionedAt: p.commissionedAt,
    status: p.status,
    description: p.description,
  };
}

async function loadProjects(): Promise<{ projects: AdminProject[]; fromDb: boolean }> {
  if (!hasDatabase()) {
    return { projects: DEFAULT_PROJECTS.map(mapDefault), fromDb: false };
  }

  try {
    await connectDB();
    const rows = asDocs<{
      _id: { toString(): string };
      slug: string;
      name: string;
      state: string;
      discom: string | null;
      capacityKW: number;
      operationalUntil: Date;
      commissionedAt: Date | null;
      status: AdminProject["status"];
      description: string | null;
    }>(await Project.find().sort({ status: 1, name: 1 }).lean());
    return {
      fromDb: true,
      projects: rows.map((p) => ({
        id: p._id.toString(),
        slug: p.slug,
        name: p.name,
        state: p.state,
        discom: p.discom,
        capacityKW: Number(p.capacityKW),
        operationalUntil: p.operationalUntil.toISOString(),
        commissionedAt: p.commissionedAt?.toISOString() ?? null,
        status: p.status,
        description: p.description,
      })),
    };
  } catch {
    return { projects: DEFAULT_PROJECTS.map(mapDefault), fromDb: false };
  }
}

export default async function AdminProjectsPage() {
  await requireRole(["ADMIN"]);
  const { projects, fromDb } = await loadProjects();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/admin"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-4" /> Admin home
      </Link>

      <h1 className="font-heading mt-6 text-2xl font-semibold">Projects</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Edit name, location, DISCOM, capacity, and status. Changes show on the
        public Projects page when the database is connected.
      </p>

      {!fromDb && (
        <p className="border-brand-sun/30 bg-brand-sun/10 text-foreground mt-4 rounded-xl border px-4 py-3 text-sm">
          Database unavailable — showing default project data (read-only until
          DB is connected and seeded).
        </p>
      )}

      <div className="mt-8 space-y-6">
        {projects.map((project) =>
          fromDb ? (
            <ProjectEditForm key={project.id} project={project} />
          ) : (
            <div
              key={project.id}
              className="border-border bg-card rounded-2xl border p-6 opacity-80"
            >
              <h2 className="font-heading text-lg font-semibold">{project.name}</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {project.state} · {project.discom} · {project.capacityKW} kW ·{" "}
                {project.status}
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
