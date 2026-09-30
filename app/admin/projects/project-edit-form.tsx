"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createProjectAction,
  deleteProjectAction,
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

const fieldClass =
  "border-input bg-background h-8 w-full rounded-lg border px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const fieldGrid = "grid gap-3 sm:grid-cols-2 lg:grid-cols-4";

function StatusField({ id, defaultValue }: { id: string; defaultValue?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Status</Label>
      <select id={id} name="status" defaultValue={defaultValue ?? "ACTIVE"} className={fieldClass}>
        <option value="UPCOMING">UPCOMING</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="FULL">FULL</option>
        <option value="CLOSED">CLOSED</option>
      </select>
    </div>
  );
}

export function ProjectsBoard({
  canEdit,
  children,
}: {
  canEdit: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Projects</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Add, edit, or delete projects. Active ones show on the public Projects page.
          </p>
        </div>
        {canEdit && (
          <Button
            type="button"
            variant={open ? "outline" : "default"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              "Close"
            ) : (
              <>
                <Plus /> Add project
              </>
            )}
          </Button>
        )}
      </div>
      {open && (
        <div className="mt-4">
          <ProjectCreateForm onCreated={close} />
        </div>
      )}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function ProjectCreateForm({ onCreated }: { onCreated: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<ProjectActionState, FormData>(
    createProjectAction,
    {},
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onCreated();
    }
  }, [state.success, state.at, onCreated]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="border-border bg-card space-y-3 rounded-2xl border p-4 shadow-[0_1px_2px_rgba(15,31,31,0.04),0_8px_24px_rgba(15,31,31,0.05)]"
    >
      <h2 className="font-heading text-base font-semibold">New project</h2>

      <div className={fieldGrid}>
        <div className="space-y-1.5">
          <Label htmlFor="new-name">Name</Label>
          <Input id="new-name" name="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-capacity">Capacity (kW)</Label>
          <Input id="new-capacity" name="capacityKW" type="number" step="0.1" min="0.1" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-state">Location</Label>
          <Input id="new-state" name="state" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-discom">DISCOM</Label>
          <Input id="new-discom" name="discom" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-until">Operational until</Label>
          <Input id="new-until" name="operationalUntil" type="date" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-commissioned">Commissioned at</Label>
          <Input id="new-commissioned" name="commissionedAt" type="date" />
        </div>
        <StatusField id="new-status" />
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-4">
          <Label htmlFor="new-description">Description</Label>
          <Textarea id="new-description" name="description" rows={2} />
        </div>
      </div>

      {state.error && <p className="text-destructive text-sm">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add project"}
      </Button>
    </form>
  );
}

export function ProjectEditForm({ project }: { project: AdminProject }) {
  const [state, formAction, pending] = useActionState<ProjectActionState, FormData>(
    updateProjectAction,
    {},
  );
  const [deleteState, deleteAction, deletePending] = useActionState<
    ProjectActionState,
    FormData
  >(deleteProjectAction, {});

  return (
    <div className="border-border bg-card space-y-3 rounded-2xl border p-4 shadow-[0_1px_2px_rgba(15,31,31,0.04),0_8px_24px_rgba(15,31,31,0.05)]">
    <form action={formAction} className="space-y-3">
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

      <div className={fieldGrid}>
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
        <StatusField id={`${project.id}-status`} defaultValue={project.status} />
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-4">
          <Label htmlFor={`${project.id}-description`}>Description</Label>
          <Textarea
            id={`${project.id}-description`}
            name="description"
            rows={2}
            defaultValue={project.description ?? ""}
          />
        </div>
      </div>

      {state.error && <p className="text-destructive text-sm">{state.error}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>

    <form
      action={deleteAction}
      className="flex flex-wrap items-center gap-3"
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${project.name}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={project.id} />
      <Button type="submit" variant="destructive" size="sm" disabled={deletePending}>
        {deletePending ? "Deleting…" : "Delete"}
      </Button>
      {deleteState.error && <p className="text-destructive text-sm">{deleteState.error}</p>}
    </form>
    </div>
  );
}
