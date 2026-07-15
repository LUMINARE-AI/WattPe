"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { z } from "zod";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ActionState = { error?: string } | undefined;

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: (formData.get("callbackUrl") as string) || "/dashboard/user",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "That email/password combination doesn't match our records." };
    }
    throw error;
  }
}

const signupSchema = z.object({
  name: z.string().min(2, "Enter your full name."),
  email: z.email(),
  password: z.string().min(8, "Use at least 8 characters."),
});

export async function signupAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, passwordHash, role: "USER" },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard/user",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created — please log in." };
    }
    throw error;
  }
}

export type ForgotPasswordState = { error?: string; success?: boolean };

const forgotPasswordSchema = z.object({ email: z.email() });

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.verificationToken.create({
      data: { identifier: user.email, token, expires },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/reset-password/${token}`;

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "WattPe <no-reply@wattpe.com>",
        to: user.email,
        subject: "Reset your WattPe password",
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
      });
    } else {
      // No email provider configured yet — surface the link in server logs for local/dev use.
      console.log(`[forgot-password] Reset link for ${user.email}: ${resetUrl}`);
    }
  }

  // Always return success to avoid leaking which emails have accounts.
  return { success: true };
}

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Use at least 8 characters."),
});

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token: parsed.data.token },
  });
  if (!record || record.expires < new Date()) {
    return { error: "This reset link is invalid or has expired." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.update({
    where: { email: record.identifier },
    data: { passwordHash },
  });
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: record.identifier, token: record.token } },
  });

  try {
    await signIn("credentials", {
      email: record.identifier,
      password: parsed.data.password,
      redirectTo: "/dashboard/user",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Password updated — please log in." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
