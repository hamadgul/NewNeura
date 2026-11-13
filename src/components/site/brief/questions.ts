/**
 * The website brief: every step, question, option and hint, in one place.
 *
 * This file is the single source for three consumers — the form that renders
 * the questions, the validator that checks the answers (on the client per step,
 * and again in the Server Action), and the email that reports them. Rewording a
 * question here rewords it everywhere; nothing is copied by hand.
 *
 * Copy rules, which apply to every string below:
 *   - Answerable with no technical knowledge. Any term that needs explaining
 *     gets a one-line `hint`.
 *   - Every choice question offers a "Not sure" way out.
 *   - Only four questions are required: name, email, what the business does,
 *     and what the website should do.
 *   - Budget is an optional open text field. No preset ranges, by decision.
 */

export type Answers = Record<string, string | string[]>;

export interface Option {
  value: string;
  label: string;
  /** One plain-language line under the option label. */
  hint?: string;
}

interface QuestionBase {
  /** Form field name and answer key. Stable: it is also the autosave key. */
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  /**
   * The question only applies when this returns true. Hidden questions are not
   * validated, and their answers are dropped before the email is rendered.
   */
  showIf?: (answers: Answers) => boolean;
}

export interface TextQuestion extends QuestionBase {
  kind: "text" | "email" | "tel";
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "url" | "email" | "tel";
}

export interface ParagraphQuestion extends QuestionBase {
  kind: "paragraph";
  placeholder?: string;
  rows?: number;
}

export interface SingleQuestion extends QuestionBase {
  kind: "single";
  options: Option[];
}

export interface MultiQuestion extends QuestionBase {
  kind: "multi";
  options: Option[];
  /** Cap on how many options can be picked at once. */
  maxPicks?: number;
}

export type Question = TextQuestion | ParagraphQuestion | SingleQuestion | MultiQuestion;

export interface Step {
  id: string;
  title: string;
  intro: string;
  questions: Question[];
}

/** Length caps, enforced by the validator and mirrored as `maxLength`. */
export const MAX_SHORT = 200;
export const MAX_PARAGRAPH = 4000;

const NOT_SURE: Option = { value: "not-sure", label: "Not sure — help me decide" };

const picked = (answers: Answers, id: string, value: string) => {
  const answer = answers[id];
  return Array.isArray(answer) ? answer.includes(value) : answer === value;
};

export const STEPS: Step[] = [
  {
    id: "you",
    title: "About you",
    intro: "So we know who we're talking to and how to reach you.",
    questions: [
      {
        id: "name",
        kind: "text",
        label: "Your name",
        required: true,
        autoComplete: "name",
      },
      {
        id: "email",
        kind: "email",
        label: "Email",
        hint: "We'll send a copy of your answers here.",
        required: true,
        autoComplete: "email",
        inputMode: "email",
      },
      {
        id: "phone",
        kind: "tel",
        label: "Phone",
        autoComplete: "tel",
        inputMode: "tel",
      },
      {
        id: "contact_pref",
        kind: "single",
        label: "Best way to reach you",
        options: [
          { value: "email", label: "Email" },
          { value: "call", label: "Phone call" },
          { value: "text", label: "Text message" },
        ],
      },
      {
        id: "business",
        kind: "text",
        label: "Business or project name",
        autoComplete: "organization",
      },
    ],
  },
  {
    id: "business",
    title: "Your business",
    intro: "A little background, in your own words.",
    questions: [
      {
        id: "business_what",
        kind: "paragraph",
        label: "What does your business do?",
        hint: "One or two sentences, the way you'd explain it to a new customer.",
        required: true,
        rows: 3,
      },
      {
        id: "customers",
        kind: "paragraph",
        label: "Who are your customers?",
        placeholder: "e.g. families in Queens, restaurant owners, other businesses",
        rows: 2,
      },
      {
        id: "area",
        kind: "single",
        label: "Where are your customers?",
        options: [
          { value: "local", label: "One local area" },
          { value: "regional", label: "Several towns or cities" },
          { value: "national", label: "Across the country" },
          { value: "online", label: "Online, anywhere" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "area_detail",
        kind: "text",
        label: "Which areas?",
        placeholder: "e.g. Queens and Long Island",
        showIf: (a) => picked(a, "area", "local") || picked(a, "area", "regional"),
      },
      {
        id: "current_site",
        kind: "single",
        label: "Do you have a website now?",
        options: [
          { value: "no", label: "No" },
          { value: "improve", label: "Yes, and I want to improve it" },
          { value: "replace", label: "Yes, but I want to start over" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "current_site_url",
        kind: "text",
        label: "What's the address?",
        placeholder: "e.g. yourbusiness.com",
        inputMode: "url",
        showIf: (a) => picked(a, "current_site", "improve") || picked(a, "current_site", "replace"),
      },
      {
        id: "current_site_dislike",
        kind: "paragraph",
        label: "What don't you like about it?",
        rows: 3,
        showIf: (a) => picked(a, "current_site", "improve") || picked(a, "current_site", "replace"),
      },
    ],
  },
  {
    id: "goals",
    title: "What the website should do",
    intro: "This shapes everything else, so it's worth a minute.",
    questions: [
      {
        id: "goals",
        kind: "multi",
        label: "What should the website do for you?",
        hint: "Pick as many as you like.",
        required: true,
        options: [
          { value: "leads", label: "Bring in calls or quote requests" },
          { value: "booking", label: "Let customers book appointments" },
          { value: "sell", label: "Sell products online" },
          { value: "portfolio", label: "Show off my work" },
          { value: "answers", label: "Answer common customer questions" },
          { value: "trust", label: "Make my business look established and trustworthy" },
          { value: "google", label: "Get found on Google" },
          { value: "other", label: "Something else" },
          NOT_SURE,
        ],
      },
      {
        id: "goals_other",
        kind: "text",
        label: "What else should it do?",
        showIf: (a) => picked(a, "goals", "other"),
      },
      {
        id: "primary_action",
        kind: "single",
        label: "If a visitor does just one thing, what should it be?",
        hint: "We'll design the pages around this one action.",
        options: [
          { value: "call", label: "Call us" },
          { value: "form", label: "Fill out a form" },
          { value: "book", label: "Book a time" },
          { value: "buy", label: "Buy something" },
          { value: "visit", label: "Visit us in person" },
          NOT_SURE,
        ],
      },
      {
        id: "success",
        kind: "paragraph",
        label: "Six months after launch, how will you know it worked?",
        placeholder: "e.g. ten more calls a week, fewer people phoning to ask our hours",
        rows: 3,
      },
    ],
  },
  {
    id: "pages",
    title: "Pages and features",
    intro: "Rough ideas are fine. We'll help you fill in the gaps.",
    questions: [
      {
        id: "pages",
        kind: "multi",
        label: "Which pages do you think you need?",
        options: [
          { value: "home", label: "Home" },
          { value: "about", label: "About" },
          { value: "services", label: "Services" },
          { value: "pricing", label: "Pricing" },
          { value: "gallery", label: "Gallery or portfolio" },
          { value: "reviews", label: "Reviews" },
          { value: "faq", label: "Questions and answers (FAQ)" },
          { value: "blog", label: "Blog or news" },
          { value: "contact", label: "Contact" },
          NOT_SURE,
        ],
      },
      {
        id: "features",
        kind: "multi",
        label: "Do you need any of these?",
        options: [
          { value: "contact_form", label: "Contact form", hint: "Visitors send you a message from the site." },
          { value: "booking", label: "Online booking", hint: "Customers pick a time on a calendar." },
          { value: "payments", label: "Take payments", hint: "Deposits, invoices or one-off payments." },
          { value: "shop", label: "Online shop", hint: "Products with a cart and checkout." },
          { value: "accounts", label: "Customer accounts", hint: "Customers log in to see their own information." },
          { value: "reviews", label: "Show your Google reviews" },
          { value: "map", label: "Map and directions" },
          { value: "editable", label: "Pages you can edit yourself", hint: "Change text, photos or prices without calling us." },
          { value: "languages", label: "More than one language" },
          NOT_SURE,
        ],
      },
      {
        id: "catalog_size",
        kind: "single",
        label: "Roughly how many products or services will you list?",
        options: [
          { value: "under-10", label: "Fewer than 10" },
          { value: "10-50", label: "10 to 50" },
          { value: "50-plus", label: "More than 50" },
          { value: "not-sure", label: "Not sure" },
        ],
        showIf: (a) => picked(a, "features", "shop") || picked(a, "pages", "services"),
      },
      {
        id: "tools",
        kind: "text",
        label: "Do you already use any apps the site should work with?",
        hint: "e.g. Square, Calendly, QuickBooks, Shopify, Mailchimp. Leave blank if none.",
      },
    ],
  },
  {
    id: "look",
    title: "Look and content",
    intro: "How it should feel, and what you already have.",
    questions: [
      {
        id: "logo",
        kind: "single",
        label: "Do you have a logo?",
        options: [
          { value: "yes", label: "Yes" },
          { value: "refresh", label: "Yes, but it needs a refresh" },
          { value: "no", label: "No, I need one" },
        ],
      },
      {
        id: "colors",
        kind: "text",
        label: "Brand colours",
        hint: "If you have them. Leave blank if not.",
      },
      {
        id: "feel",
        kind: "multi",
        label: "What should the site feel like?",
        hint: "Pick up to three.",
        maxPicks: 3,
        options: [
          { value: "modern", label: "Modern" },
          { value: "warm", label: "Warm and friendly" },
          { value: "bold", label: "Bold" },
          { value: "simple", label: "Clean and simple" },
          { value: "premium", label: "Premium" },
          { value: "playful", label: "Playful" },
          { value: "professional", label: "Professional" },
          { value: "classic", label: "Classic" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "liked_sites",
        kind: "paragraph",
        label: "Any websites you like?",
        hint: "Paste up to three addresses and say what you like about each. Any website counts, not just ones in your line of work.",
        rows: 4,
      },
      {
        id: "disliked_sites",
        kind: "paragraph",
        label: "Competitors, or sites you don't want to look like",
        rows: 2,
      },
      {
        id: "photos",
        kind: "single",
        label: "Do you have photos for the site?",
        options: [
          { value: "pro", label: "Yes, professional photos" },
          { value: "phone", label: "Yes, photos from my phone" },
          { value: "none", label: "No, I'll need some" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "copywriting",
        kind: "single",
        label: "Who will write the words on the site?",
        options: [
          { value: "me", label: "I will" },
          { value: "help", label: "I'd like help writing them" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "files",
        kind: "text",
        label: "A link to any files you want to share",
        hint: "Logo, photos, menus, price lists. A Google Drive or Dropbox link works, or reply to your confirmation email with attachments.",
        inputMode: "url",
      },
    ],
  },
  {
    id: "practical",
    title: "Timing and the practical bits",
    intro: "Last step. Skip anything you're unsure of.",
    questions: [
      {
        id: "domain",
        kind: "single",
        label: "Do you own a web address?",
        hint: "Your web address is the name people type to find you, like yourbusiness.com.",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "domain_name",
        kind: "text",
        label: "Which address?",
        placeholder: "e.g. yourbusiness.com",
        inputMode: "url",
        showIf: (a) => picked(a, "domain", "yes"),
      },
      {
        id: "business_email",
        kind: "single",
        label: "Do you have an email address that ends in that web address?",
        hint: "Like you@yourbusiness.com rather than a Gmail or Yahoo address.",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "updates",
        kind: "single",
        label: "After launch, who will keep the site up to date?",
        options: [
          { value: "me", label: "Me or my team" },
          { value: "neuragul", label: "I'd like you to" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "timeline",
        kind: "single",
        label: "When do you need it?",
        options: [
          { value: "asap", label: "As soon as possible" },
          { value: "1-2-months", label: "In the next month or two" },
          { value: "3-plus-months", label: "In three months or more" },
          { value: "date", label: "By a specific date" },
          { value: "no-rush", label: "No rush" },
        ],
      },
      {
        id: "deadline",
        kind: "text",
        label: "What date, and what's happening then?",
        placeholder: "e.g. 1 March, our grand opening",
        showIf: (a) => picked(a, "timeline", "date"),
      },
      {
        id: "budget",
        kind: "paragraph",
        label: "Do you have a budget in mind?",
        hint: "Optional. A number, a range, or “not sure yet” are all fine.",
        rows: 2,
      },
      {
        id: "decision",
        kind: "single",
        label: "Who else is involved in the decision?",
        options: [
          { value: "me", label: "Just me" },
          { value: "team", label: "Me and a partner or team" },
          { value: "other", label: "Someone else decides" },
        ],
      },
      {
        id: "anything_else",
        kind: "paragraph",
        label: "Anything else we should know?",
        rows: 4,
      },
    ],
  },
];

export const ALL_QUESTIONS: Question[] = STEPS.flatMap((step) => step.questions);

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  ALL_QUESTIONS.map((question) => [question.id, question]),
);

/**
 * Spam-check fields. They live here, not in the Server Action module, because a
 * `"use server"` file may only export async functions.
 */
/** Hidden from people; anything typed into it is a bot. */
export const HONEYPOT_FIELD = "fax_number";
/** Set to `Date.now()` by the form on mount. */
export const STARTED_AT_FIELD = "started_at";
