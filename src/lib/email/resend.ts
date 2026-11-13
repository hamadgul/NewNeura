/**
 * A minimal client for Resend's send endpoint — one `fetch`, no SDK.
 *
 * Sending domain: `neuragul.com`, verified in Resend. The domain's DMARC policy
 * is `p=reject`, so a send from an unverified domain is not junked but refused
 * outright; if mail stops arriving, check the domain status in Resend first.
 */

export interface SendEmailInput {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}

export type SendEmailResult = { ok: true; id: string } | { ok: false; error: string };

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY is not set" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: input.from,
        to: [input.to],
        reply_to: input.replyTo,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    const body = (await response.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!response.ok || !body.id) {
      return { ok: false, error: `Resend ${response.status}: ${body.message ?? "no message"}` };
    }
    return { ok: true, id: body.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
