"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  forgotPasswordAction,
  type ForgotPasswordState,
} from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<
    ForgotPasswordState,
    FormData
  >(forgotPasswordAction, {});

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="font-heading text-2xl font-semibold text-white">
          Reset your password
        </h1>
        <p className="mt-1 text-sm text-white/60">
          We&apos;ll email you a link to set a new one.
        </p>

        {state.success ? (
          <p className="mt-6 text-sm text-white/80">
            If an account exists for that email, we&apos;ve sent a reset
            link. Check your inbox.
          </p>
        ) : (
          <form action={formAction} className="mt-6 space-y-4">
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

            {state.error && (
              <p className="text-sm text-red-400">{state.error}</p>
            )}

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-white/60">
          <Link href="/login" className="text-brand-sun hover:underline">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
