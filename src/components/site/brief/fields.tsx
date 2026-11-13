"use client";

import { cn } from "@/lib/utils";
import { asList } from "@/lib/brief/answers";
import {
  MAX_PARAGRAPH,
  MAX_SHORT,
  type Answers,
  type MultiQuestion,
  type Question,
  type SingleQuestion,
} from "./questions";

/**
 * The brief's field components. Every one renders a real form control with a
 * `name`, so the form submits with JavaScript off; with it on, values are
 * controlled from `BriefForm`'s answers state.
 *
 * Inputs are 17px, not the site's 14px body: iOS zooms the page into any input
 * under 16px on focus.
 */

interface FieldProps {
  question: Question;
  answers: Answers;
  error?: string;
  onChange: (id: string, value: string | string[]) => void;
}

const fieldId = (id: string) => `q-${id}`;
const hintId = (id: string) => `q-${id}-hint`;
const errorId = (id: string) => `q-${id}-error`;

function describedBy(question: Question, error?: string) {
  const ids = [question.hint ? hintId(question.id) : "", error ? errorId(question.id) : ""];
  return ids.filter(Boolean).join(" ") || undefined;
}

function Label({ question, htmlFor, as = "label" }: { question: Question; htmlFor?: string; as?: "label" | "legend" }) {
  const Tag = as;
  return (
    <Tag htmlFor={as === "label" ? htmlFor : undefined} className="block text-[17px] leading-snug font-semibold text-[var(--ng-body)]">
      {question.label}
      {question.required ? (
        <span className="ml-1.5 text-[13px] font-normal text-[var(--ng-muted)]">(required)</span>
      ) : null}
    </Tag>
  );
}

function Hint({ question }: { question: Question }) {
  if (!question.hint) return null;
  return (
    <p id={hintId(question.id)} className="mt-1 text-[15px] leading-snug text-[var(--ng-muted)]">
      {question.hint}
    </p>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={errorId(id)} className="mt-2 text-[15px] leading-snug font-medium text-[#b42318]">
      {error}
    </p>
  );
}

const CONTROL =
  "mt-3 block w-full rounded-lg border bg-white px-4 py-3 text-[17px] leading-snug text-[var(--ng-body)] placeholder:text-[#a3a3a3] outline-none transition-colors focus:border-[var(--ng-body)] focus:ring-2 focus:ring-[var(--ng-body)]/15";

function TextField({ question, answers, error, onChange }: FieldProps) {
  if (question.kind === "single" || question.kind === "multi") return null;
  const common = {
    id: fieldId(question.id),
    name: question.id,
    // Not trimmed: trimming a controlled value would eat the space being typed.
    value: typeof answers[question.id] === "string" ? (answers[question.id] as string) : "",
    required: question.required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy(question, error),
    placeholder: question.placeholder,
    className: cn(CONTROL, error ? "border-[#b42318]" : "border-[var(--ng-line)]"),
  };

  return (
    <div>
      <Label question={question} htmlFor={common.id} />
      <Hint question={question} />
      {question.kind === "paragraph" ? (
        <textarea
          {...common}
          rows={question.rows ?? 3}
          maxLength={MAX_PARAGRAPH}
          onChange={(event) => onChange(question.id, event.target.value)}
          className={cn(common.className, "resize-y")}
        />
      ) : (
        <input
          {...common}
          type={question.kind === "email" ? "email" : question.kind === "tel" ? "tel" : "text"}
          inputMode={question.inputMode}
          autoComplete={question.autoComplete ?? "off"}
          maxLength={MAX_SHORT}
          onChange={(event) => onChange(question.id, event.target.value)}
        />
      )}
      <ErrorText id={question.id} error={error} />
    </div>
  );
}

/**
 * A choice is drawn as chips when every option is a short bare word, and as
 * full-width rows otherwise — rows read better for sentences and leave room for
 * an option's hint.
 */
function ChoiceGroup({
  question,
  answers,
  error,
  onChange,
}: FieldProps & { question: SingleQuestion | MultiQuestion }) {
  const multi = question.kind === "multi";
  const selected = asList(answers[question.id]);
  const chips = question.options.every((option) => !option.hint && option.label.length <= 18);
  const atMax = multi && question.maxPicks !== undefined && selected.length >= question.maxPicks;

  const toggle = (value: string, checked: boolean) => {
    if (!multi) return onChange(question.id, value);
    onChange(question.id, checked ? [...selected, value] : selected.filter((item) => item !== value));
  };

  return (
    <fieldset aria-describedby={describedBy(question, error)} aria-invalid={error ? true : undefined}>
      <Label question={question} as="legend" />
      <Hint question={question} />
      <div className={cn("mt-3", chips ? "flex flex-wrap gap-2" : "grid gap-2")}>
        {question.options.map((option) => {
          const checked = selected.includes(option.value);
          const disabled = atMax && !checked;
          return (
            <label
              key={option.value}
              className={cn(
                "relative flex cursor-pointer items-start gap-3 rounded-lg border bg-white text-[var(--ng-body)] transition-colors",
                // Chips carry no tick, so a picked chip fills solid; rows keep a
                // light ground and let their tick/dot say it.
                chips
                  ? "has-checked:border-[var(--ng-dark)] has-checked:bg-[var(--ng-dark)] has-checked:text-white"
                  : "has-checked:border-[var(--ng-body)] has-checked:bg-[#f3f3f3]",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[var(--ng-body)]",
                chips ? "min-h-11 items-center px-4 py-2" : "min-h-12 px-4 py-3",
                disabled ? "cursor-not-allowed opacity-45" : "hover:border-[#9a9a9a]",
                error ? "border-[#b42318]/60" : "border-[var(--ng-line)]",
              )}
            >
              <input
                type={multi ? "checkbox" : "radio"}
                name={question.id}
                value={option.value}
                checked={checked}
                disabled={disabled}
                required={!multi && question.required}
                onChange={(event) => toggle(option.value, event.target.checked)}
                className="peer sr-only"
              />
              {chips ? null : (
                <span
                  aria-hidden
                  className={cn(
                    "mt-[3px] flex size-[18px] shrink-0 items-center justify-center border border-[#9a9a9a] bg-white transition-colors peer-checked:border-[var(--ng-body)] peer-checked:bg-[var(--ng-body)]",
                    multi ? "rounded-[4px]" : "rounded-full",
                  )}
                >
                  {/* The tick (two borders of a rotated box) or the radio dot. */}
                  <span className={multi ? "h-[9px] w-[5px] -translate-y-px rotate-45 border-r-2 border-b-2 border-white" : "size-[6px] rounded-full bg-white"} />
                </span>
              )}
              <span className="text-[16px] leading-snug">
                {option.label}
                {option.hint ? (
                  <span className="mt-0.5 block text-[14px] leading-snug text-[var(--ng-muted)]">{option.hint}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      <ErrorText id={question.id} error={error} />
    </fieldset>
  );
}

export function Field(props: FieldProps) {
  const { question } = props;
  if (question.kind === "single" || question.kind === "multi") {
    return <ChoiceGroup {...props} question={question} />;
  }
  return <TextField {...props} />;
}
