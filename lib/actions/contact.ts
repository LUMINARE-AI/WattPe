"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

export type ActionState = { error?: string; success?: boolean };

const contactSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.email(),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)."),
});

export async function contactAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  await prisma.contactMessage.create({ data: parsed.data });

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "WattPe <no-reply@wattpe.com>",
      to: "contact@wattpe.com",
      subject: `New contact message from ${parsed.data.name}`,
      html: `<p><strong>${parsed.data.name}</strong> (${parsed.data.email})</p><p>${parsed.data.message}</p>`,
    });
  }

  return { success: true };
}
