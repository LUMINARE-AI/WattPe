"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction, type ActionState } from "@/lib/actions/auth";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    resetPasswordAction,
    undefined,
  );

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="font-heading text-2xl font-semibold text-white">
          Set a new password
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Choose a new password for your WattPe account.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="token" value={token} />
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-white/80">
              New password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              className="border-white/15 bg-white/5 text-white"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
