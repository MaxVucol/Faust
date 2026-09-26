import { z } from "zod";

export const CONTACT_SUBJECTS = [
  "Întrebare despre o comandă",
  "Problemă cu o cheie de activare",
  "Retur sau rambursare",
  "Colaborare",
  "Altceva",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Numele trebuie să aibă cel puțin 2 caractere.").max(80, "Numele este prea lung."),
  email: z.string().trim().pipe(z.email("Introdu o adresă de email validă.")),
  subject: z.enum(CONTACT_SUBJECTS, "Alege un subiect din listă."),
  message: z
    .string()
    .trim()
    .min(10, "Mesajul trebuie să aibă cel puțin 10 caractere.")
    .max(2000, "Mesajul poate avea cel mult 2000 de caractere."),
});

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Introdu o adresă de email validă.")),
});
