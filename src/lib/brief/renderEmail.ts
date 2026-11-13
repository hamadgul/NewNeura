import { QUESTION_BY_ID, STEPS, type Answers } from "@/components/site/brief/questions";
import { OFFICES } from "@/components/site/home/content";
import {
  asText,
  displayValue,
  isAnswered,
  isVisible,
  sections,
  textSection,
  type Section,
} from "@/lib/brief/answers";

/**
 * Answers -> the two emails a brief produces: the full report to Hamad and the
 * confirmation copy to the client. Both are rendered as HTML and plain text.
 *
 * Only answered questions are printed; a skipped question is left out rather
 * than shown as "—", so the email reads as what the client actually said.
 */

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Escaped, with the client's own line breaks kept. */
const escBlock = (value: string) => esc(value).replace(/\r?\n/g, "<br>");

/** The questions Hamad wants first, in this order, above the full answers. */
const SUMMARY_IDS = [
  "business",
  "name",
  "email",
  "phone",
  "contact_pref",
  "goals",
  "primary_action",
  "timeline",
  "deadline",
  "budget",
];

function summaryRows(answers: Answers) {
  return SUMMARY_IDS.map((id) => QUESTION_BY_ID[id])
    .filter((question) => isVisible(question, answers) && isAnswered(question, answers))
    .map((question) => ({ label: question.label, value: displayValue(question, answers) }));
}

/** The sign-off line, from the one record that holds the phone number. */
const SIGN_OFF = `NeuraGul · neuragul.com · ${OFFICES[0].phone}`;

const FONT = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;";

function htmlRows(rows: Array<{ label: string; value: string }>) {
  return rows
    .map(
      (row) => `
      <tr>
        <td style="${FONT}padding:8px 16px 8px 0;vertical-align:top;color:#747474;font-size:13px;line-height:1.4;width:38%;">${esc(row.label)}</td>
        <td style="${FONT}padding:8px 0;vertical-align:top;color:#111111;font-size:15px;line-height:1.45;">${escBlock(row.value)}</td>
      </tr>`,
    )
    .join("");
}

function htmlSection(section: Section) {
  return `
    <h2 style="${FONT}margin:32px 0 4px;font-size:17px;font-weight:600;color:#111111;">${esc(section.title)}</h2>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border-top:1px solid #d6d6d6;">${htmlRows(section.rows)}</table>`;
}

function htmlDocument(body: string) {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#ffffff;">
  <div style="max-width:640px;margin:0 auto;">${body}</div></body></html>`;
}

function who(answers: Answers) {
  const name = asText(answers.name) || "Unknown";
  const business = asText(answers.business);
  return business ? `${business} (${name})` : name;
}

export function renderBriefEmail(answers: Answers): RenderedEmail {
  const summary: Section = { title: "At a glance", rows: summaryRows(answers) };
  // "About you" is wholly contained in the summary, so it isn't printed twice.
  const all = sections(answers).filter((section) => section.title !== STEPS[0].title);

  const html = htmlDocument(`
    <p style="${FONT}margin:0 0 4px;font-size:13px;color:#747474;">New website brief</p>
    <h1 style="${FONT}margin:0;font-size:24px;font-weight:600;color:#111111;">${esc(who(answers))}</h1>
    <p style="${FONT}margin:8px 0 0;font-size:14px;color:#747474;">Reply to this email to answer them directly.</p>
    ${htmlSection(summary)}
    ${all.map(htmlSection).join("")}`);

  const text = [
    `New website brief: ${who(answers)}`,
    "Reply to this email to answer them directly.",
    textSection(summary),
    ...all.map(textSection),
  ].join("\n\n\n");

  return { subject: `Website brief — ${who(answers)}`, html, text };
}

export function renderConfirmationEmail(answers: Answers): RenderedEmail {
  const first = asText(answers.name).split(/\s+/)[0] || "there";
  const all = sections(answers);
  const lead =
    "Thanks for telling us about your website. Hamad will read this himself and reply within one business day.";
  const files =
    "If you have files to share, like a logo, photos or a menu, just reply to this email and attach them.";

  const html = htmlDocument(`
    <p style="${FONT}margin:0 0 16px;font-size:16px;line-height:1.5;color:#111111;">Hi ${esc(first)},</p>
    <p style="${FONT}margin:0 0 12px;font-size:16px;line-height:1.5;color:#111111;">${esc(lead)}</p>
    <p style="${FONT}margin:0 0 12px;font-size:16px;line-height:1.5;color:#111111;">${esc(files)}</p>
    <p style="${FONT}margin:0 0 8px;font-size:16px;line-height:1.5;color:#111111;">Here's a copy of what you sent.</p>
    ${all.map(htmlSection).join("")}
    <p style="${FONT}margin:32px 0 0;font-size:14px;line-height:1.5;color:#747474;">${esc(SIGN_OFF)}</p>`);

  const text = [
    `Hi ${first},`,
    lead,
    files,
    "Here's a copy of what you sent.",
    ...all.map(textSection),
    SIGN_OFF,
  ].join("\n\n");

  return { subject: "We've got your website brief — NeuraGul", html, text };
}
