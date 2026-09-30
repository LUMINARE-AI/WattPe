import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { completeReservation } from "@/lib/data/create-reservation";

export const dynamic = "force-dynamic";

const PLAN_CODE = /^[A-Z0-9_]{1,40}$/i;

export default async function ReserveCallbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ plan?: string }>;
}) {
  const { slug } = await params;
  const { plan } = await searchParams;
  const projectHref = `/projects/${slug}`;

  if (!plan || !PLAN_CODE.test(plan)) {
    redirect(projectHref);
  }

  const session = await auth();
  if (!session?.user?.id) {
    const callbackUrl = `/projects/${slug}/reserve?plan=${plan}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const result = await completeReservation(session.user.id, slug, plan);
  if (result.error) {
    redirect(projectHref);
  }

  redirect("/dashboard/user");
}
