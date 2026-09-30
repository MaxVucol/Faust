"use server";

import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";
import { allowAttempt, clientIp, isBot } from "@/lib/rate-limit";
import { contactSchema, newsletterSchema } from "@/lib/schemas";
import type { FormState } from "@/types";

const TEN_MINUTES = 10 * 60 * 1000;

export async function sendContactMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const t = await getDictionary();
  // A filled honeypot is a bot: answer as if it worked, store nothing.
  if (isBot(formData)) return { status: "success", message: t.contact.success };
  const parsed = contactSchema(t).safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: t.contact.errors.checkFields,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  // Only valid messages count, so someone correcting a typo is never locked out.
  if (!allowAttempt(`contact:${await clientIp()}`, 3, TEN_MINUTES)) {
    return { status: "error", message: t.contact.errors.tooMany };
  }
  try {
    await prisma.contactMessage.create({ data: parsed.data });
  } catch (error) {
    console.error("contact message failed", error);
    return { status: "error", message: t.contact.errors.sendFailed };
  }
  return { status: "success", message: t.contact.success };
}

export async function subscribeToNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const t = await getDictionary();
  if (isBot(formData)) return { status: "success", message: t.newsletter.success };
  const parsed = newsletterSchema(t).safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  if (!allowAttempt(`newsletter:${await clientIp()}`, 5, TEN_MINUTES)) {
    return { status: "error", message: t.newsletter.tooMany };
  }
  try {
    await prisma.newsletterSubscriber.create({ data: parsed.data });
  } catch (error) {
    // Already subscribed: treat as success so we don't reveal who is on the list.
    if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) {
      console.error("newsletter subscribe failed", error);
      return { status: "error", message: t.newsletter.failed };
    }
  }
  return { status: "success", message: t.newsletter.success };
}
