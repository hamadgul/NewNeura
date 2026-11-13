"use server";

import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/components/site/brief/questions";
import {
  answersFromFormData,
  asText,
  pruneHidden,
  validateAll,
  type Errors,
} from "@/lib/brief/answers";
import { renderBriefEmail, renderConfirmationEmail } from "@/lib/brief/renderEmail";
import { sendEmail } from "@/lib/email/resend";

export type BriefState =
  | { status: "idle" }
  | { status: "invalid"; errors: Errors }
  | { status: "error" }
  | { status: "sent"; firstName: string };

/** A submit faster than this after the form mounted is a bot. */
const MIN_FILL_MS = 3000;

/** Where briefs land. Hamad's own inbox, by his choice, not the public address. */
const TO = process.env.BRIEF_TO_EMAIL || "hamadgul1@gmail.com";
const FROM = process.env.BRIEF_FROM_EMAIL || "NeuraGul Briefs <briefs@neuragul.com>";

/**
 * Receives a website brief and emails it to Hamad, with a copy to the client.
 *
 * Bots get a fake success and nothing is sent, so a script learns nothing from
 * the response. A failed send to Hamad is reported to the client (their
 * answers are still on their device, and the form offers to copy them); a
 * failed confirmation to the client is only logged, since Hamad has the brief.
 */
export async function submitBrief(_previous: BriefState, formData: FormData): Promise<BriefState> {
  const answers = pruneHidden(answersFromFormData(formData));
  const firstName = asText(answers.name).split(/\s+/)[0] ?? "";

  const honeypot = formData.get(HONEYPOT_FIELD);
  const startedAt = Number(formData.get(STARTED_AT_FIELD));
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS;
  if ((typeof honeypot === "string" && honeypot.trim()) || tooFast) {
    console.warn("[brief] dropped a submission as spam", { honeypot: Boolean(honeypot), tooFast });
    return { status: "sent", firstName };
  }

  const errors = validateAll(answers);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const brief = renderBriefEmail(answers);

  if (!process.env.RESEND_API_KEY && process.env.NODE_ENV !== "production") {
    console.info(`[brief] RESEND_API_KEY not set; not sending.\n\nSubject: ${brief.subject}\n\n${brief.text}`);
    return { status: "sent", firstName };
  }

  const sent = await sendEmail({
    from: FROM,
    to: TO,
    replyTo: asText(answers.email),
    ...brief,
  });
  if (!sent.ok) {
    console.error("[brief] sending the brief failed:", sent.error);
    return { status: "error" };
  }

  const confirmation = await sendEmail({
    from: FROM,
    to: asText(answers.email),
    replyTo: TO,
    ...renderConfirmationEmail(answers),
  });
  if (!confirmation.ok) {
    console.error("[brief] the client's confirmation failed:", confirmation.error);
  }

  return { status: "sent", firstName };
}
