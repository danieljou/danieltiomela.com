import { z } from "zod";

/**
 * One schema, used by the Server Action and by the on-blur check in the form.
 * Keeping it here rather than inside the "use server" module is what stops the
 * two from drifting  a field that passes in the browser must pass on the
 * server, and a rule can only be changed in one place.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(20).max(5000),
  // Honeypot: a real person never sees this field, so a value means a bot.
  company: z.string().max(0).optional(),
});

export type ContactField = "name" | "email" | "subject" | "message";

export const contactFields: readonly ContactField[] = [
  "name",
  "email",
  "subject",
  "message",
];

export function isContactField(value: unknown): value is ContactField {
  return contactFields.includes(value as ContactField);
}

/** True when the single field is valid on its own. Used on blur. */
export function isFieldValid(field: ContactField, value: string): boolean {
  return contactSchema.shape[field].safeParse(value).success;
}
