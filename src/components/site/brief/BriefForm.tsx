"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitBrief, type BriefState } from "@/app/brief/website/actions";
import {
  answersAsText,
  asText,
  displayValue,
  isAnswered,
  isVisible,
  validateAll,
  validateQuestions,
  type Errors,
} from "@/lib/brief/answers";
import { cn } from "@/lib/utils";
import { Field } from "./fields";
import { HONEYPOT_FIELD, STARTED_AT_FIELD, STEPS, type Answers } from "./questions";

/**
 * The website brief, as a wizard: an intro, six short steps, a review, and a
 * thank-you.
 *
 * Every step is in the DOM inside ONE `<form>` whose action is the Server
 * Action. With JavaScript, only the current panel shows and Next/Back move
 * between them. Without it, the `<noscript>` rule in `page.tsx` un-hides every
 * panel, so the brief is one long form that still submits.
 *
 * Answers autosave to localStorage on every change and are cleared once sent.
 */

const STORAGE_KEY = "ng-brief-website-v1";
const EMAIL = "hamad@neuragul.com";

type View = "intro" | number | "review";

interface Saved {
  answers: Answers;
  view: View;
  /**
   * When this person first opened the form. Saved with the answers because the
   * spam check rejects a send under 3s after `started_at` — reset on every
   * load, a client who came back, restored and pressed Send at once would be
   * silently dropped.
   */
  startedAt?: number;
}

interface BriefFormProps {
  /** Fields filled from the personalised link (`?name=&business=`). */
  prefill: Answers;
}

const PILL =
  "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-[16px] font-medium transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ng-body)] disabled:cursor-not-allowed disabled:opacity-60";
const PRIMARY = cn(PILL, "bg-[var(--ng-dark)] text-white hover:bg-black");
const SECONDARY = cn(PILL, "border border-[var(--ng-line)] bg-white text-[var(--ng-body)] hover:border-[var(--ng-body)]");
const TEXT_BUTTON =
  "text-[15px] text-[var(--ng-muted)] underline underline-offset-4 hover:text-[var(--ng-body)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ng-body)]";

function firstStepWithError(errors: Errors): number {
  const index = STEPS.findIndex((step) => step.questions.some((question) => errors[question.id]));
  return index === -1 ? 0 : index;
}

export function BriefForm({ prefill }: BriefFormProps) {
  const [state, formAction, pending] = useActionState<BriefState, FormData>(submitBrief, { status: "idle" });
  const [answers, setAnswers] = useState<Answers>(prefill);
  const [view, setView] = useState<View>("intro");
  const [errors, setErrors] = useState<Errors>({});
  const [mounted, setMounted] = useState(false);
  const [resumeView, setResumeView] = useState<View | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [copied, setCopied] = useState(false);

  const headingRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const viewChanged = useRef(false);

  const goTo = (next: View) => {
    viewChanged.current = true;
    setView(next);
  };

  // Restore saved answers. Saved answers win over the link's prefill: they are
  // what this person actually typed.
  useEffect(() => {
    let firstOpened = Date.now();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Saved;
        const hasAnswers = Object.values(saved.answers ?? {}).some((value) =>
          Array.isArray(value) ? value.length > 0 : Boolean(value),
        );
        if (hasAnswers) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from storage after hydration
          setAnswers({ ...prefill, ...saved.answers });
          setResumeView(saved.view === "intro" ? 0 : saved.view);
        }
        if (typeof saved.startedAt === "number" && saved.startedAt < firstOpened) {
          firstOpened = saved.startedAt;
        }
      }
    } catch {
      // Unreadable storage (private mode, corrupt JSON) just means a fresh start.
    }
    setStartedAt(firstOpened);
    setMounted(true);
  }, [prefill]);

  // Autosave.
  useEffect(() => {
    if (!mounted || state.status === "sent") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, view, startedAt } satisfies Saved));
    } catch {
      // Storage full or blocked: the form still works, it just won't remember.
    }
  }, [answers, view, startedAt, mounted, state.status]);

  // Server outcomes: clear storage once sent; route a server-side validation
  // failure back to the step that holds the first error.
  useEffect(() => {
    if (state.status === "sent") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    if (state.status === "invalid") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors the action's result into local UI state
      setErrors(state.errors);
      goTo(firstStepWithError(state.errors));
    }
  }, [state]);

  // Move focus to the new panel's heading and the page to the top, so a
  // screen reader announces the step and a phone user isn't left mid-page.
  useEffect(() => {
    if (!viewChanged.current) return;
    viewChanged.current = false;
    window.scrollTo({ top: 0 });
    headingRefs.current[String(view)]?.focus({ preventScroll: true });
  }, [view]);

  const onChange = (id: string, value: string | string[]) => {
    setAnswers((previous) => ({ ...previous, [id]: value }));
    if (errors[id]) {
      setErrors((previous) => {
        const rest = { ...previous };
        delete rest[id];
        return rest;
      });
    }
  };

  /** Validate the current step; on failure, focus the first bad field. */
  const checkStep = (index: number) => {
    const stepErrors = validateQuestions(STEPS[index].questions, answers);
    setErrors(stepErrors);
    const firstBad = STEPS[index].questions.find((question) => stepErrors[question.id]);
    if (firstBad) {
      const field = document.getElementById(`q-${firstBad.id}`) ?? document.querySelector<HTMLInputElement>(`[name="${firstBad.id}"]`);
      field?.focus();
      field?.scrollIntoView({ block: "center" });
      return false;
    }
    return true;
  };

  const next = (index: number) => {
    if (!checkStep(index)) return;
    goTo(index + 1 < STEPS.length ? index + 1 : "review");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!mounted) return;
    // Enter in a text field submits the form; on a step, treat it as "Next".
    if (typeof view === "number") {
      event.preventDefault();
      next(view);
      return;
    }
    if (view !== "review") {
      event.preventDefault();
      return;
    }
    const allErrors = validateAll(answers);
    if (Object.keys(allErrors).length > 0) {
      event.preventDefault();
      setErrors(allErrors);
      goTo(firstStepWithError(allErrors));
    }
  };

  const startOver = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setAnswers(prefill);
    setErrors({});
    setResumeView(null);
    goTo(0);
  };

  const copyAnswers = async () => {
    try {
      await navigator.clipboard.writeText(answersAsText(answers));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const firstName = asText(answers.name).split(/\s+/)[0];

  if (state.status === "sent") {
    const email = asText(answers.email);
    return (
      <section aria-labelledby="brief-sent" className="py-6">
        <h1
          id="brief-sent"
          tabIndex={-1}
          ref={(node) => node?.focus()}
          className="font-L text-[var(--ng-body)] outline-none"
        >
          {state.firstName ? `Thanks, ${state.firstName}.` : "Thanks."}
        </h1>
        <p className="mt-6 max-w-[520px] text-[18px] leading-relaxed text-[var(--ng-body)]">
          Your brief is with us. Hamad will read it himself and reply within one business day.
        </p>
        <p className="mt-4 max-w-[520px] text-[16px] leading-relaxed text-[var(--ng-muted)]">
          {email ? `We've sent a copy of your answers to ${email}.` : "We've sent a copy of your answers to your email."}{" "}
          If you have files to share, like a logo or photos, just reply to that email and attach them.
        </p>
      </section>
    );
  }

  /** `true` -> the attribute renders; `undefined` -> it doesn't. */
  const panelHidden = (panel: View) => (view !== panel ? true : undefined);
  const headingRef = (panel: View) => (node: HTMLHeadingElement | null) => {
    headingRefs.current[String(panel)] = node;
  };

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate={mounted} className="pb-24">
      {/* Spam checks: a field people never see, and when the form mounted. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name={STARTED_AT_FIELD} value={startedAt || ""} />

      {/* ---------------------------------------------------------- intro */}
      <section data-hidden={panelHidden("intro")} aria-labelledby="brief-intro" className="brief-panel">
        <h1 id="brief-intro" tabIndex={-1} ref={headingRef("intro")} className="font-L text-[var(--ng-body)] outline-none">
          {firstName ? `Hi ${firstName}, tell us about the website you want.` : "Tell us about the website you want."}
        </h1>
        <div className="mt-6 max-w-[540px] space-y-4 text-[18px] leading-relaxed text-[var(--ng-body)]">
          <p>It takes about ten minutes. Only four questions are required, and “not sure” is always a fine answer.</p>
          <p className="brief-js text-[16px] text-[var(--ng-muted)]">
            Your answers are saved on this device as you go, so you can close this page and come back to it.
          </p>
        </div>

        <div className="brief-js mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          {resumeView !== null ? (
            <>
              <p className="w-full text-[16px] font-medium text-[var(--ng-body)]">
                Welcome back, we kept your answers.
              </p>
              <button type="button" className={PRIMARY} onClick={() => goTo(resumeView)}>
                Continue where you left off
              </button>
              <button type="button" className={TEXT_BUTTON} onClick={startOver}>
                Start over
              </button>
            </>
          ) : (
            <button type="button" className={PRIMARY} onClick={() => goTo(0)}>
              Start
            </button>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------- steps */}
      {STEPS.map((step, index) => (
        <section
          key={step.id}
          data-hidden={panelHidden(index)}
          aria-labelledby={`brief-step-${step.id}`}
          className="brief-panel"
        >
          <div className="brief-js mb-8" aria-hidden>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[#ececec]">
              <div
                className="h-full rounded-full bg-[var(--ng-dark)] transition-[width] duration-300"
                style={{ width: `${((index + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-[14px] font-medium tracking-wide text-[var(--ng-muted)] uppercase">
            Step {index + 1} of {STEPS.length}
          </p>
          <h2
            id={`brief-step-${step.id}`}
            tabIndex={-1}
            ref={headingRef(index)}
            className="font-L mt-2 text-[var(--ng-body)] outline-none"
          >
            {step.title}
          </h2>
          <p className="mt-3 text-[17px] leading-relaxed text-[var(--ng-muted)]">{step.intro}</p>

          <div className="mt-10 space-y-10">
            {step.questions.map((question) =>
              !mounted || isVisible(question, answers) ? (
                <Field
                  key={question.id}
                  question={question}
                  answers={answers}
                  error={errors[question.id]}
                  onChange={onChange}
                />
              ) : null,
            )}
          </div>

          <div className="brief-js mt-12 flex items-center justify-between gap-4">
            <button type="button" className={SECONDARY} onClick={() => goTo(index === 0 ? "intro" : index - 1)}>
              Back
            </button>
            <button type="button" className={PRIMARY} onClick={() => next(index)}>
              {index + 1 < STEPS.length ? "Next" : "Review my answers"}
            </button>
          </div>
        </section>
      ))}

      {/* --------------------------------------------------------- review */}
      <section data-hidden={panelHidden("review")} aria-labelledby="brief-review" className="brief-panel">
        <h2 id="brief-review" tabIndex={-1} ref={headingRef("review")} className="font-L text-[var(--ng-body)] outline-none">
          <span className="brief-js">Check your answers</span>
          <span className="brief-nojs">Send your brief</span>
        </h2>
        <p className="brief-js mt-3 text-[17px] leading-relaxed text-[var(--ng-muted)]">
          Nothing is sent until you press the button at the bottom.
        </p>

        <div className="brief-js mt-10 space-y-10">
          {STEPS.map((step, index) => {
            const rows = step.questions.filter(
              (question) => isVisible(question, answers) && isAnswered(question, answers),
            );
            return (
              <div key={step.id}>
                <div className="flex items-baseline justify-between gap-4 border-b border-[var(--ng-line)] pb-2">
                  <h3 className="text-[19px] font-semibold text-[var(--ng-body)]">{step.title}</h3>
                  <button
                    type="button"
                    className={TEXT_BUTTON}
                    onClick={() => goTo(index)}
                    aria-label={`Edit ${step.title}`}
                  >
                    Edit
                  </button>
                </div>
                {rows.length > 0 ? (
                  <dl className="mt-1">
                    {rows.map((question) => (
                      <div key={question.id} className="grid gap-1 py-3 sm:grid-cols-[40%_1fr] sm:gap-4">
                        <dt className="text-[15px] leading-snug text-[var(--ng-muted)]">{question.label}</dt>
                        <dd className="text-[16px] leading-snug break-words whitespace-pre-line text-[var(--ng-body)]">
                          {displayValue(question, answers)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="py-3 text-[15px] text-[var(--ng-muted)]">Skipped, and that&apos;s fine.</p>
                )}
              </div>
            );
          })}
        </div>

        {state.status === "error" ? (
          <div role="alert" className="mt-10 rounded-lg border border-[#b42318]/40 bg-[#fdf3f2] p-5 text-[16px] leading-relaxed text-[var(--ng-body)]">
            <p className="font-semibold">Something went wrong sending your brief.</p>
            <p className="mt-1">
              Your answers are still saved here. Please try again in a moment. If it keeps failing, copy your answers
              and email them to{" "}
              <a href={`mailto:${EMAIL}?subject=Website%20brief`} className="underline underline-offset-4">
                {EMAIL}
              </a>
              .
            </p>
            <button type="button" className={cn(SECONDARY, "mt-4 min-h-11 px-5 text-[15px]")} onClick={copyAnswers}>
              {copied ? "Copied" : "Copy my answers"}
            </button>
          </div>
        ) : null}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <button type="button" className={cn(SECONDARY, "brief-js")} onClick={() => goTo(STEPS.length - 1)}>
            Back
          </button>
          <button type="submit" className={PRIMARY} disabled={pending}>
            {pending ? "Sending…" : "Send my brief"}
          </button>
        </div>
      </section>
    </form>
  );
}
