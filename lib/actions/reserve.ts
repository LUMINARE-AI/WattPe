"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { completeReservation } from "@/lib/data/create-reservation";

export type ReserveState = { error?: string } | undefined;

const reserveSchema = z.object({
  projectSlug: z.string().min(1).max(80),
  planCode: z.string().min(1).max(40),
});

function loginUrlForReserve(slug: string, planCode: string) {
  const callbackUrl = `/projects/${slug}/reserve?plan=${planCode}`;
  return `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

export async function reserveCapacityAction(
  _prev: ReserveState,
  formData: FormData,
): Promise<ReserveState> {
  const parsed = reserveSchema.safeParse({
    projectSlug: formData.get("projectSlug"),
    planCode: formData.get("planCode"),
  });
  if (!parsed.success) {
    return { error: "Choose a plan to reserve." };
  }

  const session = await auth();
  if (!session?.user?.id) {
    redirect(loginUrlForReserve(parsed.data.projectSlug, parsed.data.planCode));
  }

  const result = await completeReservation(
    session.user.id,
    parsed.data.projectSlug,
    parsed.data.planCode,
  );
  if (result.error) return result;

  redirect("/dashboard/user");
}
