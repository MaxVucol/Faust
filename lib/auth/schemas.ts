import { z } from "zod";

/** Account rules shared by sign-in, the admin panel's user forms and scripts/create-admin.ts. */
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email"));
export const passwordSchema = z.string().min(10, "At least 10 characters").max(200, "At most 200 characters");

export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Required").max(200) });
