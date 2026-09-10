"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateProjectAction,
  type ProjectActionState,
} from "@/lib/actions/admin-projects";

export type AdminProject = {
  id: string;
  slug: string;
  name: string;
  state: string;
  discom: string | null;
  capacityKW: number;
  operationalUntil: string;
  commissionedAt: string | null;
  status: "UPCOMING" | "ACTIVE" | "FULL" | "CLOSED";
  description: string | null;
};

function toDateInput(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function ProjectEditForm({ project }: { project: AdminProject }) {
  const [state, formAction, pending] = useActionState<ProjectActionState, FormData>(
    updateProjectAction,
    {},
  );

  useEffect(() => {
    if (state.success) {
      // brief visual feedback via native form reset not needed — revalidate refreshes
    }
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="border-border bg-card space-y-4 rounded-2xl border p-6 shadow-[0_1px_2px_rgba(15,31,31,0.04),0_8px_24px_rgba(15,31,31,0.05)]"
    >
      <input type="hidden" name="id" value={project.id} />

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="font-heading text-lg font-semibold">{project.name}</h2>
          <p className="text-muted-foreground text-xs">/{project.slug}</p>
        </div>
        {state.success && (
          <p className="text-brand-green text-sm font-medium">Saved</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${project.id}-name`}>Name</Label>
          <Input
            id={`${project.id}-name`}
            name="name"
            defaultValue={project.name}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${project.id}-capacity`}>Capacity (kW)</Label>
          <Input
            id={`${project.id}-capacity`}
            name="capacityKW"
            type="number"
            step="0.1"
            min="0.1"
            defaultValue={project.capacityKW}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${project.id}-state`}>Location</Label>
          <Input
            id={`${project.id}-state`}
            name="state"
            defaultValue={project.state}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${project.id}-discom`}>DISCOM</Label>
          <Input
            id={`${project.id}-discom`}
            name="discom"
            defaultValue={project.discom ?? ""}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${project.id}-until`}>Operational until</Label>
          <Input
            id={`${project.id}-until`}
            name="operationalUntil"
            type="date"
            defaultValue={toDateInput(project.operationalUntil)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${project.id}-commissioned`}>Commissioned at</Label>
          <Input
            id={`${project.id}-commissioned`}
            name="commissionedAt"
            type="date"
            defaultValue={toDateInput(project.commissionedAt)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`${project.id}-status`}>Status</Label>
          <select
            id={`${project.id}-status`}
            name="status"
            defaultValue={project.status}
            className="border-input bg-background h-8 w-full rounded-lg border px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="UPCOMING">UPCOMING</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="FULL">FULL</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`${project.id}-description`}>Description</Label>
          <Textarea
            id={`${project.id}-description`}
            name="description"
            rows={3}
            defaultValue={project.description ?? ""}
          />
        </div>
      </div>

      {state.error && <p className="text-destructive text-sm">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
