"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { sendMessage, type ContactState } from "@/actions/contact";
import { isFieldValid, type ContactField } from "@/lib/contact-rules";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/content/types";

const initial: ContactState = { status: "idle" };

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [state, action, pending] = useActionState(sendMessage, initial);
  const f = dict.contact.form;
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // R04  a field is checked when it loses focus, never while someone is still
  // typing their first character, and the message clears the moment the value
  // becomes valid again. The rules come from the same schema the Server Action
  // uses, so the browser can never accept something the server will reject.
  const [localErrors, setLocalErrors] = useState<
    Partial<Record<ContactField, boolean>>
  >({});

  // A fresh verdict from the server replaces every local one. Adjusting during
  // render rather than in an effect: React discards this pass and re-renders
  // immediately, so no stale error is ever painted.
  const [lastState, setLastState] = useState(state);
  if (lastState !== state) {
    setLastState(state);
    setLocalErrors({});
  }

  // A defined local verdict always wins over the server's, so a field the
  // visitor has just fixed stops showing the error from the last submit.
  const isInvalid = (field: ContactField) =>
    localErrors[field] ?? Boolean(state.errors?.[field]);

  function bind(field: ContactField) {
    return {
      name: field,
      required: true,
      invalid: isInvalid(field),
      defaultValue: state.values?.[field],
      onBlur: (e: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>) =>
        setLocalErrors((prev) => ({
          ...prev,
          [field]: !isFieldValid(field, e.target.value),
        })),
      onChange: (
        e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
      ) => {
        // Only ever removes a message  typing never raises a new one.
        if (isInvalid(field) && isFieldValid(field, e.target.value)) {
          setLocalErrors((prev) => ({ ...prev, [field]: false }));
        }
      },
    };
  }

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className="rounded-lg border border-secondary/40 bg-secondary/[0.05] p-6"
      >
        <p className="font-display text-lg font-semibold text-text-strong">
          {f.success.title}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          {f.success.body}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} noValidate className="space-y-5">
      <div
        ref={statusRef}
        tabIndex={-1}
        role="alert"
        aria-live="assertive"
        className={cn(
          "rounded-md border border-danger/40 bg-danger/[0.06] p-4",
          state.status === "error" && !state.errors ? "block" : "hidden",
        )}
      >
        <p className="font-semibold text-text-strong">{f.error.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {f.error.body}
        </p>
        {state.errorId && (
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-faint">
            Error ID · {state.errorId}
          </p>
        )}
      </div>

      <p className="text-xs text-faint">{f.requiredLegend}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          {...bind("name")}
          label={f.name.label}
          placeholder={f.name.placeholder}
          error={f.name.error}
          requiredLabel={f.required}
          autoComplete="name"
        />
        <Field
          {...bind("email")}
          type="email"
          inputMode="email"
          label={f.email.label}
          placeholder={f.email.placeholder}
          help={f.email.help}
          error={f.email.error}
          requiredLabel={f.required}
          autoComplete="email"
        />
      </div>

      <Field
        {...bind("subject")}
        label={f.subject.label}
        placeholder={f.subject.placeholder}
        error={f.subject.error}
        requiredLabel={f.required}
      />

      <Field
        {...bind("message")}
        as="textarea"
        rows={6}
        label={f.message.label}
        placeholder={f.message.placeholder}
        help={f.message.help}
        error={f.message.error}
        requiredLabel={f.required}
      />

      {/* Honeypot  off-screen rather than display:none, which some bots skip. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button type="submit" isLoading={pending} className="w-full sm:w-auto">
        {pending ? f.submitting : f.submit}
      </Button>
    </form>
  );
}

function Field({
  name,
  label,
  help,
  error,
  invalid = false,
  required,
  requiredLabel,
  as = "input",
  className,
  ...props
}: {
  name: string;
  label: string;
  help?: string;
  /** The message to show when `invalid` is true. */
  error?: string;
  invalid?: boolean;
  requiredLabel?: string;
  as?: "input" | "textarea";
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const showError = invalid && Boolean(error);
  // Kept narrow (not widened to `React.ElementType`): once
  // `@react-three/fiber` is anywhere in the program it globally augments
  // `JSX.IntrinsicElements` with every `three` class, and the bare
  // `ElementType` has to satisfy that whole union too, collapsing props
  // like `className` to `never`.
  const Element = as;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
        {required && (
          <>
            {" "}
            <span aria-hidden="true" className="text-danger-soft">
              *
            </span>
            <span className="sr-only">
              {requiredLabel ? ` (${requiredLabel})` : ""}
            </span>
          </>
        )}
      </label>
      <Element
        id={id}
        name={name}
        required={required}
        aria-required={required || undefined}
        aria-invalid={showError || undefined}
        aria-describedby={cn(help && helpId, showError && errorId) || undefined}
        className={cn(
          "min-h-11 w-full rounded-md border bg-surface-2 px-3.5 py-3",
          // 16px on mobile is not a taste call: below it, iOS Safari zooms the
          // whole page on focus and the visitor has to pinch back out.
          "text-base text-text placeholder:text-faint sm:text-[15px]",
          "transition-colors duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary",
          showError ? "border-danger" : "border-line hover:border-line-strong",
          as === "textarea" && "resize-y leading-relaxed",
        )}
        {...props}
      />
      {help && !showError && (
        <p id={helpId} className="text-xs text-faint">
          {help}
        </p>
      )}
      {showError && (
        <p id={errorId} role="alert" className="text-xs text-danger-soft">
          {error}
        </p>
      )}
    </div>
  );
}
