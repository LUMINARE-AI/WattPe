"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type ActionState } from "@/lib/actions/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard/user";
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="font-heading text-2xl font-semibold text-white">
          Log in to WattPe
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Welcome back — check your savings and generation.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white/80">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="border-white/15 bg-white/5 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white/80">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-brand-sun text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="border-white/15 bg-white/5 text-white"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Logging in…" : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          New to WattPe?{" "}
          <Link href="/signup" className="text-brand-sun hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
