"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { requireRole } from "@/lib/requireRole";
import { hasDatabase } from "@/lib/data/database";

export type UserRoleActionState = { error?: string; success?: boolean };

const roleSchema = z.enum(["USER", "ADMIN", "FINANCE"]);

export async function updateUserRoleAction(
  _prev: UserRoleActionState,
  formData: FormData,
): Promise<UserRoleActionState> {
  const session = await requireRole(["ADMIN"]);

  if (!hasDatabase()) {
    return { error: "Database is not configured." };
  }

  const parsed = z
    .object({
      id: z.string().min(1),
      role: roleSchema,
    })
    .safeParse({
      id: formData.get("id"),
      role: formData.get("role"),
    });

  if (!parsed.success) {
    return { error: "Choose a valid role." };
  }

  const { id, role } = parsed.data;

  if (id === session.user.id && role !== "ADMIN") {
    return { error: "You cannot remove your own admin access." };
  }

  try {
    await connectDB();
    const user = await User.findById(id).select("role");
    if (!user) {
      return { error: "User not found." };
    }

    const allowed =
      user.role === "FINANCE" ? ["USER", "ADMIN", "FINANCE"] : ["USER", "ADMIN"];
    if (!allowed.includes(role)) {
      return { error: "Choose a valid role." };
    }

    user.role = role;
    await user.save();
  } catch {
    return { error: "Could not update this user. Try again." };
  }

  revalidatePath("/dashboard/user/users");
  return { success: true };
}
