"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupAction, type ActionState } from "@/lib/actions/auth";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signupAction,
    undefined,
  );

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="font-heading text-2xl font-semibold text-white">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Reserve your first plant in a couple of minutes.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-white/80">
              Full name
            </Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              required
              className="border-white/15 bg-white/5 text-white"
            />
          </div>
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
            <Label htmlFor="password" className="text-white/80">
              Password
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
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-sun hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
