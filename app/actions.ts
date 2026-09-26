"use server";

import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { contactSchema, newsletterSchema } from "@/lib/schemas";
import type { FormState } from "@/types";

export async function sendContactMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Verifică câmpurile marcate.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  try {
    await prisma.contactMessage.create({ data: parsed.data });
  } catch (error) {
    console.error("contact message failed", error);
    return { status: "error", message: "Mesajul nu a putut fi trimis. Încearcă din nou peste câteva minute." };
  }
  return { status: "success", message: "Mesajul a fost primit. Îți răspundem în cel mult o zi lucrătoare." };
}

export async function subscribeToNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = newsletterSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  try {
    await prisma.newsletterSubscriber.create({ data: parsed.data });
  } catch (error) {
    // Already subscribed: treat as success so we don't reveal who is on the list.
    if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) {
      console.error("newsletter subscribe failed", error);
      return { status: "error", message: "Abonarea nu a reușit. Încearcă din nou." };
    }
  }
  return { status: "success", message: "Te-ai abonat. Primul mesaj sosește odată cu ofertele săptămânii." };
}
