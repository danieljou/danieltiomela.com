"use server";

import { Resend } from "resend";
import { site } from "@/lib/site";
import { contactSchema, isContactField } from "@/lib/contact-rules";

export type ContactState = {
  status: "idle" | "success" | "error";
  /** Field-level messages, keyed by input name. */
  errors?: Partial<Record<"name" | "email" | "subject" | "message", string>>;
  /** Short id the visitor can quote if they report the failure. */
  errorId?: string;
  /** Echoed back so a failed submit never empties the form. */
  values?: Record<string, string>;
};

/**
 * Best-effort throttle. This is per-instance memory, so on serverless it
 * limits a burst from one warm instance rather than a distributed flood
 * enough for a personal site, and honest about what it is. Swap for Upstash
 * if the form ever gets seriously abused.
 */
const seen = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function throttled(key: string) {
  const now = Date.now();
  const hits = (seen.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  seen.set(key, hits);
  if (seen.size > 500) seen.clear();
  return hits.length > MAX_PER_WINDOW;
}

export async function sendMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    company: String(formData.get("company") ?? ""),
  };
  const values = { ...raw, company: "" };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    // The honeypot is not a validation error the visitor should ever see.
    if (raw.company) return { status: "success" };

    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (isContactField(field)) errors[field] = errors[field] ?? "invalid";
    }
    return { status: "error", errors, values };
  }

  if (parsed.data.company) return { status: "success" };

  if (throttled(parsed.data.email.toLowerCase())) {
    return { status: "error", errorId: "RATE", values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error("[contact] RESEND_API_KEY or CONTACT_FROM_EMAIL is not set");
    return { status: "error", errorId: "CONFIG", values };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: site.email,
      replyTo: parsed.data.email,
      subject: `[danieltiomela.com] ${parsed.data.subject}`,
      text: [
        `From:    ${parsed.data.name} <${parsed.data.email}>`,
        `Subject: ${parsed.data.subject}`,
        "",
        parsed.data.message,
      ].join("\n"),
    });

    if (error) {
      console.error("[contact] resend error", error);
      return { status: "error", errorId: "SEND", values };
    }

    return { status: "success" };
  } catch (err) {
    console.error("[contact] unexpected", err);
    return { status: "error", errorId: "UNKNOWN", values };
  }
}
