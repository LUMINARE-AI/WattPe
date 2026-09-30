"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  updateUserRoleAction,
  type UserRoleActionState,
} from "@/lib/actions/admin-users";

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN" | "FINANCE";
};

export function UserRoleForm({
  user,
  isSelf,
}: {
  user: AdminUser;
  isSelf: boolean;
}) {
  const [state, formAction, pending] = useActionState<UserRoleActionState, FormData>(
    updateUserRoleAction,
    {},
  );
  const options =
    user.role === "FINANCE"
      ? (["USER", "ADMIN", "FINANCE"] as const)
      : (["USER", "ADMIN"] as const);

  return (
    <form
      action={formAction}
      className="grid items-center gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_9rem_auto] sm:gap-3"
    >
      <input type="hidden" name="id" value={user.id} />
      <p className="truncate text-sm font-medium">
        {user.name || "Unnamed user"}
        {isSelf ? (
          <span className="text-muted-foreground ml-1.5 text-xs font-normal">You</span>
        ) : null}
      </p>
      <p className="text-muted-foreground truncate text-sm">{user.email}</p>
      <select
        name="role"
        defaultValue={user.role}
        aria-label={`Role for ${user.email}`}
        className="border-input bg-background h-8 w-full rounded-lg border px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {options.map((role) => (
          <option key={role} value={role} disabled={isSelf && role !== "ADMIN"}>
            {role}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        {state.success && <p className="text-brand-green text-xs font-medium">Saved</p>}
        {state.error && <p className="text-destructive text-xs">{state.error}</p>}
      </div>
    </form>
  );
}
