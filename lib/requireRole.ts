import { auth } from "@/lib/auth";
import type { AppRole } from "@/lib/rbac";

/**
 * Defense-in-depth check for use inside Server Components / Server Actions
 * (Node runtime), in addition to the edge-safe route checks in middleware.ts.
 * Kept out of `lib/rbac.ts` because that file must stay import-free of
 * `lib/auth.ts` (and therefore Prisma) so middleware's edge bundle stays clean.
 */
export async function requireRole(allowed: AppRole[]) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || !role || !allowed.includes(role as AppRole)) {
    throw new Error("Unauthorized");
  }
  return session;
}
