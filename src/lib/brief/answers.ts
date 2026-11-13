import {
  ALL_QUESTIONS,
  STEPS,
  MAX_PARAGRAPH,
  MAX_SHORT,
  type Answers,
  type Question,
} from "@/components/site/brief/questions";

/**
 * Pure helpers over the brief's question schema, shared by the client form
 * (per-step checks, review screen) and the Server Action (the real check).
 */

export type Errors = Record<string, string>;

/** Loose on purpose: the email is checked by a person replying to it. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isVisible(question: Question, answers: Answers): boolean {
  return question.showIf ? question.showIf(answers) : true;
}

export function asText(value: string | string[] | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

export function asList(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  return typeof value === "string" && value ? [value] : [];
}

export function isAnswered(question: Question, answers: Answers): boolean {
  return question.kind === "multi"
    ? asList(answers[question.id]).length > 0
    : asText(answers[question.id]).length > 0;
}

/** Option values -> their labels, for the review screen and the email. */
export function displayValue(question: Question, answers: Answers): string {
  if (question.kind === "single" || question.kind === "multi") {
    return asList(answers[question.id])
      .map((value) => question.options.find((option) => option.value === value)?.label ?? value)
      .join(", ");
  }
  return asText(answers[question.id]);
}

/**
 * Read a submitted form into `Answers`, keeping only fields the schema knows
 * about and only option values the schema offers. Anything else in the payload
 * (React's `$ACTION_` keys, the spam fields, a forged value) is ignored.
 */
export function answersFromFormData(formData: FormData): Answers {
  const answers: Answers = {};
  for (const question of ALL_QUESTIONS) {
    if (question.kind === "multi" || question.kind === "single") {
      const allowed = new Set(question.options.map((option) => option.value));
      const values = formData
        .getAll(question.id)
        .filter((value): value is string => typeof value === "string" && allowed.has(value));
      if (question.kind === "multi") answers[question.id] = [...new Set(values)];
      else answers[question.id] = values[0] ?? "";
    } else {
      const value = formData.get(question.id);
      answers[question.id] = typeof value === "string" ? value.trim() : "";
    }
  }
  return answers;
}

/** Drop answers to questions that don't apply (e.g. a URL for "no website"). */
export function pruneHidden(answers: Answers): Answers {
  const pruned: Answers = {};
  for (const question of ALL_QUESTIONS) {
    if (isVisible(question, answers) && answers[question.id] !== undefined) {
      pruned[question.id] = answers[question.id];
    }
  }
  return pruned;
}

export function validateQuestions(questions: Question[], answers: Answers): Errors {
  const errors: Errors = {};
  for (const question of questions) {
    if (!isVisible(question, answers)) continue;

    if (question.required && !isAnswered(question, answers)) {
      errors[question.id] =
        question.kind === "multi" ? "Please pick at least one." : "Please fill this in.";
      continue;
    }

    if (question.kind === "multi") {
      if (question.maxPicks && asList(answers[question.id]).length > question.maxPicks) {
        errors[question.id] = `Please pick up to ${question.maxPicks}.`;
      }
      continue;
    }
    if (question.kind === "single") continue;

    const text = asText(answers[question.id]);
    const max = question.kind === "paragraph" ? MAX_PARAGRAPH : MAX_SHORT;
    if (text.length > max) {
      errors[question.id] = `Please keep this under ${max.toLocaleString("en-US")} characters.`;
    } else if (question.kind === "email" && text && !EMAIL_RE.test(text)) {
      errors[question.id] = "That doesn't look like an email address. Please check it.";
    }
  }
  return errors;
}

export function validateAll(answers: Answers): Errors {
  return validateQuestions(ALL_QUESTIONS, answers);
}

/** Answered questions, grouped by step. Shared by the review screen and both emails. */
export interface Section {
  title: string;
  rows: Array<{ label: string; value: string }>;
}

export function sections(answers: Answers): Section[] {
  return STEPS.map((step) => ({
    title: step.title,
    rows: step.questions
      .filter((question) => isVisible(question, answers) && isAnswered(question, answers))
      .map((question) => ({ label: question.label, value: displayValue(question, answers) })),
  })).filter((section) => section.rows.length > 0);
}


export function textSection(section: Section) {
  const rows = section.rows.map((row) => `${row.label}\n  ${row.value.replace(/\r?\n/g, "\n  ")}`);
  return `${section.title.toUpperCase()}\n${"-".repeat(section.title.length)}\n${rows.join("\n\n")}`;
}

/** Plain text of every answer. Also what the client copies if sending fails. */
export function answersAsText(answers: Answers): string {
  return sections(answers).map(textSection).join("\n\n\n");
}

