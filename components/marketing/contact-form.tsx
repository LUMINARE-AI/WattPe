"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactAction, type ActionState } from "@/lib/actions/contact";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    contactAction,
    {},
  );

  if (state.success) {
    return (
      <div className="border-border bg-card rounded-2xl border p-8 text-center">
        <h3 className="font-heading text-lg font-semibold">
          Message sent
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Thanks for reaching out — our team will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={5} required />
      </div>

      {state.error && <p className="text-destructive text-sm">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
