import Link from "next/link";
import { ArrowUpRight, MapPin, Zap } from "lucide-react";
import type { ProjectSummary } from "@/lib/data/projects";
import { getProjectTint, getProjectCode } from "@/lib/project-tint";

export function ProjectCard({
  project,
  creditRatePerUnit,
}: {
  project: ProjectSummary;
  creditRatePerUnit: number;
}) {
  const operationalUntilYear = new Date(project.operationalUntil).getFullYear();
  const tint = getProjectTint(project.slug);
  const code = getProjectCode(project.name);
  const patternId = `panel-weave-${project.slug}`;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="border-border bg-card hover:border-brand-amber/50 shadow-[0_1px_2px_rgba(16,23,42,0.04),0_8px_24px_rgba(16,23,42,0.06)] group block overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className="relative flex h-32 items-start p-4"
        style={{ backgroundColor: `var(${tint.bgVar})` }}
      >
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id={patternId}
              width="34"
              height="20"
              patternUnits="userSpaceOnUse"
              patternTransform="skewX(-18)"
            >
              <rect
                x="1"
                y="1"
                width="30"
                height="16"
                rx="2"
                fill="none"
                stroke={`var(${tint.lineVar})`}
                strokeWidth="1.1"
                opacity="0.55"
              />
              <line
                x1="16"
                y1="1"
                x2="16"
                y2="17"
                stroke={`var(${tint.lineVar})`}
                strokeWidth="0.8"
                opacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
        <div
          className="font-heading relative flex size-[52px] shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-brand-espresso shadow-[0_6px_14px_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(255,255,255,0.5)]"
          style={{ backgroundColor: `var(${tint.avatarVar})` }}
        >
          {code}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h3 className="font-heading text-lg font-bold">{project.name}</h3>
          <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
            <MapPin className="size-4" />
            {project.state}
            {project.discom ? ` · ${project.discom}` : ""}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Capacity</p>
            <p className="font-medium">{project.capacityKW} kW</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Operational until</p>
            <p className="font-medium">{operationalUntilYear}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Discount rate</p>
            <p className="text-brand-amber flex items-center gap-1 font-medium">
              <Zap className="size-3.5" />₹{creditRatePerUnit.toFixed(2)}/unit
            </p>
          </div>
        </div>
        <span className="text-brand-amber inline-flex items-center gap-1 text-sm font-medium">
          View project
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
